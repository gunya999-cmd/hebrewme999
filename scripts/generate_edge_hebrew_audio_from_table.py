#!/usr/bin/env python3
"""
Generate HebrewMe verb audio with Microsoft Edge TTS.

The script reads the current top-350 verb rows directly from:
  src/data/verbs-table-top350-*.ts

It writes MP3 files:
  public/audio/verbs/001.mp3 ... 350.mp3
  public/audio/verbs-edge-manifest.csv
  public/audio/verbs-edge-manifest.json
  public/audio/verbs-edge-generation-status.csv

This generator does not need an API key. It uses the edge-tts Python package.
Default voice: he-IL-HilaNeural.
"""
from __future__ import annotations

import argparse
import asyncio
import csv
import json
import sys
from pathlib import Path
from typing import Any

import edge_tts


def extract_json_array_from_ts(text: str, path: Path) -> list[Any]:
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
        packed_rows = extract_json_array_from_ts(path.read_text(encoding="utf-8"), path)
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


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        return
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def read_existing_status(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def merge_status(existing: list[dict[str, Any]], current: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_rank: dict[str, dict[str, Any]] = {}
    for row in existing:
        rank = row.get("rank")
        if rank:
            by_rank[str(rank)] = row
    for row in current:
        by_rank[str(row["rank"])] = row
    return [by_rank[k] for k in sorted(by_rank, key=lambda x: int(x))]


def build_manifest_row(row: dict[str, Any], out_dir: str, voice: str, rate: str, volume: str) -> dict[str, Any]:
    rank = int(row["rank"])
    filename = f"{rank:03d}.mp3"
    prompt_text = row["infinitive_hebrew"]
    return {
        "rank": rank,
        "infinitive_hebrew": row["infinitive_hebrew"],
        "transcription_ru": row["transcription_ru"],
        "binyan": row["binyan"],
        "difficulty": row["difficulty"],
        "audio_url": f"/audio/verbs/{filename}",
        "audio_file": str(Path(out_dir) / filename).replace("\\", "/"),
        "audio_provider": "microsoft_edge_tts",
        "audio_voice": voice,
        "audio_rate": rate,
        "audio_volume": volume,
        "audio_text": prompt_text,
    }


async def generate_one(text: str, voice: str, rate: str, volume: str, out_file: Path) -> None:
    out_file.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, volume=volume)
    await communicate.save(str(out_file))


async def main_async() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--out-dir", default="public/audio/verbs")
    parser.add_argument("--voice", default="he-IL-HilaNeural")
    parser.add_argument("--rate", default="-10%", help="Edge TTS speech rate, e.g. -10%, +0%, +20%")
    parser.add_argument("--volume", default="+0%")
    parser.add_argument("--start-rank", type=int, default=1)
    parser.add_argument("--end-rank", type=int, default=350)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--max-successes", type=int, default=0, help="Stop after this many newly generated MP3 files; 0 means no cap")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--sleep", type=float, default=0.4)
    parser.add_argument("--max-attempts", type=int, default=4)
    parser.add_argument("--status-csv", default="public/audio/verbs-edge-generation-status.csv")
    parser.add_argument("--manifest-csv", default="public/audio/verbs-edge-manifest.csv")
    parser.add_argument("--manifest-json", default="public/audio/verbs-edge-manifest.json")
    args = parser.parse_args()

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
        if args.max_successes and generated >= args.max_successes:
            print(f"Reached max_successes={args.max_successes}; stopping successfully.", flush=True)
            break

        rank = int(row["rank"])
        filename = f"{rank:03d}.mp3"
        out_file = out_dir / filename
        manifest_row = build_manifest_row(row, args.out_dir, args.voice, args.rate, args.volume)
        manifest_rows.append(manifest_row)

        if out_file.exists() and out_file.stat().st_size > 1000 and not args.force:
            print(f"[{idx}/{len(selected)}] SKIP {rank:03d} {row['infinitive_hebrew']} -> {out_file}", flush=True)
            status_rows.append({**manifest_row, "generation_status": "skipped_exists", "file_size": out_file.stat().st_size, "error": ""})
            skipped += 1
            continue

        print(f"[{idx}/{len(selected)}] GEN  {rank:03d} {row['infinitive_hebrew']} -> {out_file}", flush=True)
        last_error = ""
        for attempt in range(1, args.max_attempts + 1):
            try:
                await generate_one(row["infinitive_hebrew"], args.voice, args.rate, args.volume, out_file)
                if out_file.stat().st_size <= 1000:
                    raise RuntimeError(f"Generated file is too small: {out_file.stat().st_size} bytes")
                status_rows.append({**manifest_row, "generation_status": "generated", "file_size": out_file.stat().st_size, "error": ""})
                generated += 1
                await asyncio.sleep(args.sleep)
                break
            except Exception as exc:
                last_error = f"{type(exc).__name__}: {exc}"
                if attempt < args.max_attempts:
                    wait_seconds = min(2 ** attempt, 20)
                    print(f"Transient Edge TTS error for rank {rank:03d}; attempt {attempt}/{args.max_attempts}. Sleeping {wait_seconds}s before retry.", flush=True)
                    await asyncio.sleep(wait_seconds)
                    continue
                print(f"FAILED rank {rank:03d}: {last_error}", file=sys.stderr, flush=True)
                status_rows.append({**manifest_row, "generation_status": "failed", "file_size": 0, "error": last_error})
                failed += 1

    old_status = read_existing_status(repo_root / args.status_csv)
    merged_status = merge_status(old_status, status_rows)
    write_csv(repo_root / args.manifest_csv, manifest_rows)
    (repo_root / args.manifest_json).parent.mkdir(parents=True, exist_ok=True)
    (repo_root / args.manifest_json).write_text(json.dumps(manifest_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    write_csv(repo_root / args.status_csv, merged_status)

    print(f"Done. generated={generated}, skipped={skipped}, failed={failed}", flush=True)
    print(f"Manifest CSV: {args.manifest_csv}", flush=True)
    print(f"Manifest JSON: {args.manifest_json}", flush=True)
    print(f"Status CSV: {args.status_csv}", flush=True)
    return 1 if failed else 0


def main() -> int:
    return asyncio.run(main_async())


if __name__ == "__main__":
    raise SystemExit(main())
