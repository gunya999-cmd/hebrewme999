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
ROW_RE = re.compile(
    r'\[(\d+),"((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)","((?:\\.|[^"\\])*)"\]',
    re.S,
)


def decode_ts_string(value: str) -> str:
    return json.loads(f'"{value}"')


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
        for match in ROW_RE.finditer(text):
            rank = int(match.group(1))
            rows.append(
                {
                    "rank": rank,
                    "infinitive_hebrew": decode_ts_string(match.group(2)),
                    "transcription_ru": decode_ts_string(match.group(3)),
                    "binyan": decode_ts_string(match.group(4)),
                    "difficulty": decode_ts_string(match.group(5)),
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
    with urllib.request.urlopen(request, timeout=timeout) as response:
        data = json.load(response)
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
    parser.add_argument("--sleep", type=float, default=0.8)
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
            for attempt in range(1, 4):
                try:
                    pcm = call_gemini_tts(api_key, args.model, args.voice, prompt)
                    break
                except urllib.error.HTTPError as e:
                    body = e.read().decode("utf-8", errors="replace")[:1000]
                    last_error = f"HTTP {e.code}: {body}"
                    if e.code in (429, 500, 502, 503, 504) and attempt < 3:
                        time.sleep(2 ** attempt)
                        continue
                    raise RuntimeError(last_error)
                except Exception as e:
                    last_error = f"{type(e).__name__}: {e}"
                    if attempt < 3:
                        time.sleep(2 ** attempt)
                        continue
                    raise RuntimeError(last_error)
            if not pcm:
                raise RuntimeError(last_error or "No audio returned")
            save_wav(out_file, pcm)
            status_rows.append({**manifest_row, "generation_status": "generated", "file_size": out_file.stat().st_size, "error": ""})
            generated += 1
            time.sleep(args.sleep)
        except Exception as e:
            print(f"FAILED rank {rank:03d}: {e}", file=sys.stderr)
            status_rows.append({**manifest_row, "generation_status": "failed", "file_size": 0, "error": str(e)})
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
