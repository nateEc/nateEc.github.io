#!/usr/bin/env python3
"""Atomically refresh the public Repository Radar snapshot."""
from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from github_trending_digest import fetch_payload, validate_payload


PROJECT_ROOT = Path(os.environ.get(
    "PORTFOLIO_PROJECT_ROOT", str(Path(__file__).resolve().parents[1])
)).expanduser().resolve()
OUTPUT = PROJECT_ROOT / "public/tech-news/github-trending.json"


def write_snapshot(payload: dict) -> None:
    validate_payload(payload)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=OUTPUT.parent,
                                         prefix=".github-trending-", suffix=".tmp", delete=False) as stream:
            temporary = Path(stream.name)
            json.dump(payload, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, OUTPUT)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def main() -> int:
    try:
        payload = fetch_payload()
        write_snapshot(payload)
    except Exception as exc:
        print(f"error: {exc}")
        return 1
    print(f"updated: Repository Radar snapshot saved -> {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
