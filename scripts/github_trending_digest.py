#!/usr/bin/env python3
"""Collect GitHub's daily Trending page into a small, stable JSON contract."""
from __future__ import annotations

import html
import json
import re
import sys
import time
from datetime import datetime
from typing import Any
from urllib.error import URLError
from urllib.request import Request, urlopen


SOURCE_URL = "https://github.com/trending?since=daily"
MAX_REPOSITORIES = 10
FETCH_ATTEMPTS = 3
FETCH_TIMEOUT_SECONDS = 25
MAX_RESPONSE_BYTES = 2_000_000
LANGUAGE_COLORS = {
    "Python": "#3572A5", "TypeScript": "#3178C6", "JavaScript": "#F1E05A",
    "Rust": "#DEA584", "Go": "#00ADD8", "Shell": "#89E051", "HTML": "#E34C26",
    "Java": "#B07219", "C++": "#F34B7D", "C": "#555555", "Swift": "#F05138",
    "Kotlin": "#A97BFF", "Ruby": "#701516", "PHP": "#4F5D95", "Vue": "#41B883",
}
THEME_RULES = [
    ("Agent systems", re.compile(r"\b(agent|agents|mcp|copilot|autonomous)\b", re.I)),
    ("Developer tools", re.compile(r"\b(cli|developer|coding|code|terminal|ide|debug|git)\b", re.I)),
    ("AI infrastructure", re.compile(r"\b(ai|llm|model|inference|rag|embedding|transformer)\b", re.I)),
    ("Data & systems", re.compile(r"\b(database|data|distributed|runtime|cloud|server|storage)\b", re.I)),
    ("Security", re.compile(r"\b(security|secure|vulnerability|privacy|auth|sandbox)\b", re.I)),
]


def _text(fragment: str) -> str:
    without_tags = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", html.unescape(without_tags)).strip()


def _number(value: str) -> int:
    digits = re.sub(r"\D", "", value)
    return int(digits) if digits else 0


def parse_trending_html(document: str) -> list[dict[str, Any]]:
    repositories: list[dict[str, Any]] = []
    for block in re.findall(r'<article\s+class="Box-row"[^>]*>(.*?)</article>', document, re.S | re.I):
        heading = re.search(r'<h2[^>]*>(.*?)</h2>', block, re.S | re.I)
        if not heading:
            continue
        repo_link = re.search(r'href="/([^"/?#]+/[^"/?#]+)"', heading.group(1), re.I)
        if not repo_link:
            continue
        full_name = html.unescape(repo_link.group(1)).strip()
        description_match = re.search(r'<p[^>]*class="[^"]*col-9[^"]*"[^>]*>(.*?)</p>', block, re.S | re.I)
        language_match = re.search(r'<span[^>]*itemprop="programmingLanguage"[^>]*>(.*?)</span>', block, re.S | re.I)
        today_match = re.search(r'([\d,]+)\s+stars?\s+today', _text(block), re.I)
        stars_match = re.search(rf'href="/{re.escape(full_name)}/stargazers"[^>]*>(.*?)</a>', block, re.S | re.I)
        forks_match = re.search(rf'href="/{re.escape(full_name)}/forks"[^>]*>(.*?)</a>', block, re.S | re.I)
        language = _text(language_match.group(1)) if language_match else "Unknown"
        repositories.append({
            "rank": len(repositories) + 1,
            "fullName": full_name,
            "description": _text(description_match.group(1))[:280] if description_match else "",
            "language": language,
            "languageColor": LANGUAGE_COLORS.get(language, "#8B949E"),
            "starsToday": _number(today_match.group(1)) if today_match else 0,
            "totalStars": _number(_text(stars_match.group(1))) if stars_match else 0,
            "forks": _number(_text(forks_match.group(1))) if forks_match else 0,
            "url": f"https://github.com/{full_name}",
        })
        if len(repositories) >= MAX_REPOSITORIES:
            break
    return repositories


def build_themes(repositories: list[dict[str, Any]]) -> list[dict[str, Any]]:
    themes = []
    for name, pattern in THEME_RULES:
        matches = [repo["fullName"] for repo in repositories if pattern.search(f'{repo["fullName"]} {repo["description"]}')]
        if matches:
            themes.append({"name": name, "count": len(matches), "repositories": matches[:4]})
    themes.sort(key=lambda item: (-item["count"], item["name"]))
    return themes[:3]


def build_payload(repositories: list[dict[str, Any]], now: datetime | None = None) -> dict[str, Any]:
    if not repositories:
        raise ValueError("GitHub Trending returned no repositories")
    stamp = now or datetime.now().astimezone()
    languages: dict[str, int] = {}
    for repo in repositories:
        languages[repo["language"]] = languages.get(repo["language"], 0) + 1
    language_mix = [
        {"name": name, "count": count, "share": round(count / len(repositories) * 100),
         "color": LANGUAGE_COLORS.get(name, "#8B949E")}
        for name, count in sorted(languages.items(), key=lambda item: (-item[1], item[0]))
    ]
    return {
        "schemaVersion": 1,
        "updatedAt": stamp.isoformat(timespec="seconds"),
        "date": stamp.date().isoformat(),
        "period": "daily",
        "source": SOURCE_URL,
        "repositories": repositories,
        "languages": language_mix,
        "themes": build_themes(repositories),
    }


def validate_payload(payload: Any, *, require_today: bool = True) -> str:
    if not isinstance(payload, dict) or payload.get("schemaVersion") != 1:
        raise ValueError("invalid GitHub Trending schema")
    stamp = datetime.fromisoformat(payload.get("updatedAt", ""))
    if stamp.tzinfo is None or payload.get("date") != stamp.astimezone().date().isoformat():
        raise ValueError("invalid GitHub Trending timestamp")
    today = datetime.now().astimezone().date().isoformat()
    if require_today and payload.get("date") != today:
        raise ValueError(f'GitHub Trending snapshot is not for today: {payload.get("date")}')
    if payload.get("source") != SOURCE_URL or payload.get("period") != "daily":
        raise ValueError("unexpected GitHub Trending source")
    repos = payload.get("repositories")
    if not isinstance(repos, list) or not 1 <= len(repos) <= MAX_REPOSITORIES:
        raise ValueError("GitHub Trending has no displayable repositories")
    names: set[str] = set()
    for index, repo in enumerate(repos, 1):
        if not isinstance(repo, dict) or repo.get("rank") != index:
            raise ValueError("GitHub Trending ranks are not contiguous")
        name = repo.get("fullName")
        if not isinstance(name, str) or not re.fullmatch(r"[^/\s]+/[^/\s]+", name) or name in names:
            raise ValueError("invalid or duplicate GitHub repository")
        names.add(name)
        if repo.get("url") != f"https://github.com/{name}":
            raise ValueError("unsafe GitHub repository URL")
        if not isinstance(repo.get("starsToday"), int) or repo["starsToday"] < 0:
            raise ValueError("invalid daily star count")
    return payload["date"]


def fetch_payload() -> dict[str, Any]:
    last_error = "unknown fetch error"
    for attempt in range(1, FETCH_ATTEMPTS + 1):
        try:
            request = Request(SOURCE_URL, headers={
                "User-Agent": "Mozilla/5.0 portfolio-repository-radar/1.0",
                "Accept": "text/html,application/xhtml+xml",
            })
            with urlopen(request, timeout=FETCH_TIMEOUT_SECONDS) as response:
                body = response.read(MAX_RESPONSE_BYTES + 1)
            if len(body) > MAX_RESPONSE_BYTES:
                raise ValueError("GitHub Trending response exceeded 2 MB")
            document = body.decode("utf-8", errors="replace")
            payload = build_payload(parse_trending_html(document))
            validate_payload(payload)
            return payload
        except (OSError, URLError, ValueError) as exc:
            last_error = str(exc)
            if attempt < FETCH_ATTEMPTS:
                time.sleep(2 * attempt)
    raise RuntimeError(f"GitHub Trending fetch failed after {FETCH_ATTEMPTS} attempts: {last_error}")


def main() -> int:
    try:
        print(json.dumps(fetch_payload(), ensure_ascii=False, indent=2))
        return 0
    except Exception as exc:
        print(json.dumps({"error": str(exc), "source": SOURCE_URL}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
