#!/usr/bin/env python3
"""
Generate HebrewMe verb audio with Google AI Studio / Gemini TTS.

The script reads the current top-350 verb rows directly from:
  src/data/verbs-table-top350-*.ts

It writes:
  public/audio/verbs/001.wav ... 350.wav
  public/audio/verbs-manifest.csv
  public/audio/verbs-manifest.json
  public/audio/verbs-generation-status.csv

No API key is stored in this file. Set GOOGLE_AI_API_KEY or GEMINI_API_KEY.
"""
from __future__ import annotations

import argparse
import base64
import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import wave
from pathlib import Path
from typing import Any

API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
MAX_RETRY_SECONDS = 90.0


class RetryableHttpError(RuntimeError):
    def __init__(self, code: int, body: str, retry_after: float | None = None):
        super().__init__(f"HTTP {code}: {body}")
        self.code = code
        self.body = body
        self.retry_after = retry_after


def extract_json_array_from_ts(text: str, path: Path) -> list[Any]:
    """Extract the exported packed-row array from a TypeScript data file."""
    assignment_index = text.find("=")
    if assignment_index < 0:
        raise RuntimeError(f"Cannot find array assignment in {path}")

    start = text.find("[", assignment_index)
    end = text.rfind("];")
    if start < 0 or end < 0 or end <= start:
        raise RuntimeError(f"Cannot find exported array body in {path}")

    array_text = text[start : end + 1]
    try:
        return json.loads(array_text)
    except json.JSONDecodeError as exc:
        snippet = array_text[max(0, exc.pos - 120) : exc.pos + 120]
        raise RuntimeError(
            f"Cannot parse packed row array as JSON in {path}: {exc}. Around error: {snippet!r}"
        ) from exc


def read_top350_rows(repo_root: Path) -> list[dict[str, Any]]:
    data_dir = repo_root / "src" / "data"
    paths = [
        data_dir / "verbs-table-top350-1-100.ts",
        data_dir / "verbs-table-top350-101-200.ts",
        data_dir / "verbs-table-top350-201-300.ts",
        data_dir / "verbs-table-top350-301-350.ts",
    ]
    rows: list[dict[str, Any]] = []
    for path in paths:
        if not path.exists():
            raise FileNotFoundError(f"Missing source table: {path}")
        text = path.read_text(encoding="utf-8")
        packed_rows = extract_json_array_from_ts(text, path)
        for packed in packed_rows:
            if not isinstance(packed, list) or len(packed) < 6:
                raise RuntimeError(f"Invalid packed row in {path}: {packed!r}")
            rank, infinitive_hebrew, transcription_ru, binyan, difficulty, _packed_forms = packed[:6]
            rows.append(
                {
                    "rank": int(rank),
                    "infinitive_hebrew": str(infinitive_hebrew),
                    "transcription_ru": str(transcription_ru),
                    "binyan": str(binyan),
                    "difficulty": str(difficulty),
                }
            )
    rows.sort(key=lambda r: r["rank"])
    ranks = [r["rank"] for r in rows]
    expected = list(range(1, 351))
    if ranks != expected:
        missing = sorted(set(expected) - set(ranks))
        duplicate = sorted({r for r in ranks if ranks.count(r) > 1})
        raise RuntimeError(f"Top-350 table is not complete. missing={missing}, duplicate={duplicate}")
    return rows


def save_wav(path: Path, pcm: bytes, rate: int = 24000) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(rate)
        wf.writeframes(pcm)


def extract_audio_bytes(data: dict[str, Any]) -> bytes:
    candidates = data.get("candidates") or []
    for candidate in candidates:
        parts = ((candidate.get("content") or {}).get("parts") or [])
        for part in parts:
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                return base64.b64decode(inline["data"])
    raise RuntimeError(f"Unexpected Gemini response shape: {json.dumps(data, ensure_ascii=False)[:1200]}")


def retry_seconds_from_body(body: str) -> float | None:
    # Gemini quota errors commonly include: "Please retry in 17.923009039s."
    match = re.search(r"retry in\s+([0-9]+(?:\.[0-9]+)?)s", body, re.IGNORECASE)
    if match:
        return float(match.group(1)) + 2.0

    try:
        parsed = json.loads(body)
    except json.JSONDecodeError:
        return None

    details = ((parsed.get("error") or {}).get("details") or [])
    for detail in details:
        retry_delay = detail.get("retryDelay")
        if isinstance(retry_delay, str) and retry_delay.endswith("s"):
            try:
                return float(retry_delay[:-1]) + 2.0
            except ValueError:
                return None
    return None


def call_gemini_tts(api_key: str, model: str, voice: str, prompt: str, timeout: int = 90) -> bytes:
    url = API_URL_TEMPLATE.format(model=model)
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {"voiceName": voice},
                }
            },
        },
    }
    request = urllib.request.Request(
        url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            data = json.load(response)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")[:5000]
        raise RetryableHttpError(exc.code, body, retry_seconds_from_body(body)) from exc
    return extract_audio_bytes(data)


def build_prompt(hebrew: str) -> str:
    return (
        "Read aloud exactly this Hebrew infinitive once, in modern Israeli Hebrew, "
        "at a clear slow teaching pace. Do not add translation, explanation, or any other words: "
        f"{hebrew}"
    )


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        return
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--out-dir", default="public/audio/verbs")
    parser.add_argument("--model", default="gemini-3.1-flash-tts-preview")
    parser.add_argument("--voice", default="Aoede")
    parser.add_argument("--start-rank", type=int, default=1)
    parser.add_argument("--end-rank", type=int, default=350)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--sleep", type=float, default=7.0, help="Seconds to sleep after each successful request. Free tier is usually ~10 requests/minute.")
    parser.add_argument("--max-attempts", type=int, default=8)
    parser.add_argument("--status-csv", default="public/audio/verbs-generation-status.csv")
    parser.add_argument("--manifest-csv", default="public/audio/verbs-manifest.csv")
    parser.add_argument("--manifest-json", default="public/audio/verbs-manifest.json")
    args = parser.parse_args()

    api_key = os.environ.get("GOOGLE_AI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: Set GOOGLE_AI_API_KEY or GEMINI_API_KEY first.", file=sys.stderr)
        return 2

    repo_root = Path(args.repo_root).resolve()
    rows = read_top350_rows(repo_root)
    selected = [r for r in rows if args.start_rank <= int(r["rank"]) <= args.end_rank]
    if args.limit:
        selected = selected[: args.limit]

    out_dir = (repo_root / args.out_dir).resolve()
    manifest_rows: list[dict[str, Any]] = []
    status_rows: list[dict[str, Any]] = []
    generated = skipped = failed = 0

    for idx, row in enumerate(selected, start=1):
        rank = int(row["rank"])
        filename = f"{rank:03d}.wav"
        rel_url = f"/audio/verbs/{filename}"
        out_file = out_dir / filename
        prompt = build_prompt(row["infinitive_hebrew"])

        manifest_row = {
            "rank": rank,
            "infinitive_hebrew": row["infinitive_hebrew"],
            "transcription_ru": row["transcription_ru"],
            "binyan": row["binyan"],
            "difficulty": row["difficulty"],
            "audio_url": rel_url,
            "audio_file": str(Path(args.out_dir) / filename).replace("\\", "/"),
            "audio_provider": "google_ai_studio_gemini_tts",
            "audio_model": args.model,
            "audio_voice": args.voice,
            "audio_prompt": prompt,
        }
        manifest_rows.append(manifest_row)

        if out_file.exists() and out_file.stat().st_size > 1000 and not args.force:
            print(f"[{idx}/{len(selected)}] SKIP {rank:03d} {row['infinitive_hebrew']} -> {out_file}")
            status_rows.append({**manifest_row, "generation_status": "skipped_exists", "file_size": out_file.stat().st_size, "error": ""})
            skipped += 1
            continue

        print(f"[{idx}/{len(selected)}] GEN  {rank:03d} {row['infinitive_hebrew']} -> {out_file}")
        try:
            pcm = None
            last_error = ""
            for attempt in range(1, args.max_attempts + 1):
                try:
                    pcm = call_gemini_tts(api_key, args.model, args.voice, prompt)
                    break
                except RetryableHttpError as exc:
                    last_error = str(exc)
                    is_retryable = exc.code in (429, 500, 502, 503, 504)
                    if is_retryable and attempt < args.max_attempts:
                        wait_seconds = exc.retry_after if exc.retry_after is not None else min(2 ** attempt, MAX_RETRY_SECONDS)
                        wait_seconds = min(max(wait_seconds, 3.0), MAX_RETRY_SECONDS)
                        print(f"Rate/server limit for rank {rank:03d}; attempt {attempt}/{args.max_attempts}. Sleeping {wait_seconds:.1f}s before retry.")
                        time.sleep(wait_seconds)
                        continue
                    raise RuntimeError(last_error)
                except Exception as exc:
                    last_error = f"{type(exc).__name__}: {exc}"
                    if attempt < args.max_attempts:
                        wait_seconds = min(2 ** attempt, 30)
                        print(f"Transient error for rank {rank:03d}; attempt {attempt}/{args.max_attempts}. Sleeping {wait_seconds:.1f}s before retry.")
                        time.sleep(wait_seconds)
                        continue
                    raise RuntimeError(last_error)
            if not pcm:
                raise RuntimeError(last_error or "No audio returned")
            save_wav(out_file, pcm)
            status_rows.append({**manifest_row, "generation_status": "generated", "file_size": out_file.stat().st_size, "error": ""})
            generated += 1
            time.sleep(args.sleep)
        except Exception as exc:
            print(f"FAILED rank {rank:03d}: {exc}", file=sys.stderr)
            status_rows.append({**manifest_row, "generation_status": "failed", "file_size": 0, "error": str(exc)})
            failed += 1

    write_csv(repo_root / args.manifest_csv, manifest_rows)
    (repo_root / args.manifest_json).parent.mkdir(parents=True, exist_ok=True)
    (repo_root / args.manifest_json).write_text(json.dumps(manifest_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    write_csv(repo_root / args.status_csv, status_rows)

    print(f"Done. generated={generated}, skipped={skipped}, failed={failed}")
    print(f"Manifest CSV: {args.manifest_csv}")
    print(f"Manifest JSON: {args.manifest_json}")
    print(f"Status CSV: {args.status_csv}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
