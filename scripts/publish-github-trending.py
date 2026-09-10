#!/usr/bin/env python3
"""Publish the daily Repository Radar snapshot from the isolated checkout."""
from __future__ import annotations

import fcntl
import importlib.util
import json
import sys
from pathlib import Path

from github_trending_digest import validate_payload


HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("tech_signal_publisher_base", HERE / "publish-tech-news.py")
if spec is None or spec.loader is None:
    raise RuntimeError("unable to load isolated publisher")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

base.NEWS_PATH = Path("public/tech-news/github-trending.json")
base.SYNC_SCRIPT = HERE / "sync-github-trending.py"
base.DEPLOYMENT_URL = "https://nateec.github.io/tech-news/github-trending.json"
base._validate_payload = validate_payload


def publish() -> int:
    base._ensure_publishable_worktree()
    try:
        current = json.loads((base.PROJECT_ROOT / base.NEWS_PATH).read_text(encoding="utf-8"))
        date = validate_payload(current)
    except (OSError, ValueError, TypeError, json.JSONDecodeError):
        pass
    else:
        evidence = base._wait_for_deployment(date, current["updatedAt"])
        print(f"no-op: Repository Radar {date} is already published; verified via {evidence}")
        return 0

    base._ensure_dependencies()
    result = base._run([sys.executable, str(base.SYNC_SCRIPT)], timeout=180)
    if result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip() or f"exit code {result.returncode}"
        raise RuntimeError(f"Repository Radar sync failed: {detail[:1600]}")
    payload = json.loads((base.PROJECT_ROOT / base.NEWS_PATH).read_text(encoding="utf-8"))
    date = validate_payload(payload)
    base._checked(["npm", "run", "check"], timeout=600)
    changed = base._changed_paths()
    if changed - {base.NEWS_PATH.as_posix()}:
        raise RuntimeError("checks produced unrelated changes; no commit performed")
    if base.NEWS_PATH.as_posix() in changed:
        base._checked(["git", "add", "--", base.NEWS_PATH.as_posix()])
        base._checked([
            "git", "commit", "-m", f"chore(radar): 更新 {date} GitHub 趋势",
            "-m", "- 刷新 GitHub Trending 前十仓库、语言频谱与主题聚类。\n- 通过数据契约、站点构建和隔离发布检查后推送。",
        ])
        base._push_main()
    evidence = base._wait_for_deployment(date, payload["updatedAt"])
    print(f"published: Repository Radar {date}; main pushed, deployment verified via {evidence}")
    return 0


def main() -> int:
    try:
        with base._git_file("tech-signal.lock").open("a") as lock:
            try:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                raise RuntimeError("another Tech Signal publisher is still running")
            return publish()
    except Exception as exc:
        print(f"error: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
