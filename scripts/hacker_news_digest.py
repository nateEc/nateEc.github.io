#!/usr/bin/env python3
"""Fetch latest Hacker News + TechCrunch items for Hermes cron digest with richer fields."""
from __future__ import annotations

import html
from concurrent.futures import ThreadPoolExecutor
import json
import math
import re
import sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from typing import Any, Dict
from urllib.parse import parse_qs, urlparse
from xml.etree import ElementTree as ET

SOURCES = [
    {
        "name": "Hacker News",
        "source_page": "https://news.ycombinator.com/news",
        "feed_url": "https://news.ycombinator.com/rss",
        "max_items": 20,
    },
    {
        "name": "TechCrunch",
        "source_page": "https://techcrunch.com/",
        "feed_url": "https://techcrunch.com/feed/",
        "max_items": 12,
    },
]

UA = "Mozilla/5.0 (compatible; HermesAgent/1.0; +https://hermes-agent.nousresearch.com)"
MAX_OUTPUT_PER_SOURCE = 8
SUMMARY_TARGET_LEN = 500
MIN_SUMMARY_LEN = 140
TREND_WEIGHTS = {
    "AI": 2.6,
    "人工智能": 2.8,
    "大模型": 2.2,
    "模型": 2.0,
    "监管": 3.0,
    "安全": 2.4,
    "安全性": 2.4,
    "漏洞": 2.8,
    "隐私": 2.0,
    "开源": 1.8,
    "融资": 2.0,
    "投资": 1.7,
    "上市": 1.8,
    "收购": 1.8,
    "创业": 1.4,
    "产品": 1.1,
    "基础设施": 1.2,
}
RECENCY_HOURS = 72
HN_API_URL = "https://hacker-news.firebaseio.com/v0/item/{item_id}.json"


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._in_noise = 0
        self._parts: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() in {"script", "style", "noscript", "header", "footer", "nav"}:
            self._in_noise += 1

    def handle_endtag(self, tag):
        if tag.lower() in {"script", "style", "noscript", "header", "footer", "nav"} and self._in_noise:
            self._in_noise -= 1

    def handle_data(self, data):
        if self._in_noise:
            return
        cleaned = (data or "").strip()
        if cleaned:
            self._parts.append(cleaned)

    def text(self) -> str:
        text = " ".join(self._parts)
        text = html.unescape(text)
        text = re.sub(r"\s+", " ", text).strip()
        return text


# Verified TLS and bounded retries; never disable certificate validation.
from news_http import fetch


def text_of(elem, name):
    child = elem.find(name)
    return (child.text or "").strip() if child is not None else ""


def normalize_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value or "")
    value = html.unescape(value)
    return re.sub(r"\s+", " ", value).strip()


def normalize_summary(value: str) -> str:
    return normalize_text(value)[:SUMMARY_TARGET_LEN]


def parse_pub_date(value: str):
    if not value:
        return "", None
    try:
        dt = parsedate_to_datetime(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat(), dt
    except Exception:
        return value, None


def extract_meta_desc(html_text: str) -> str:
    for pattern in (
        re.compile(r'<meta[^>]+name=["\'](?:description|twitter:description)["\'][^>]+content=["\']([^"\']+)["\']', re.I),
        re.compile(r'<meta[^>]+property=["\'](?:og:description|twitter:description)["\'][^>]+content=["\']([^"\']+)["\']', re.I),
        re.compile(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:name|property)=["\'](?:description|og:description|twitter:description)["\']', re.I),
    ):
        match = pattern.search(html_text)
        if match:
            return html.unescape(match.group(1).strip())
    return ""


def extract_leadin(html_text: str) -> str:
    body_match = re.search(r"<body[^>]*>(.*)</body>", html_text, flags=re.S | re.I)
    search_scope = body_match.group(1) if body_match else html_text

    candidates = re.findall(r"<p[^>]*>(.*?)</p>", search_scope, flags=re.S | re.I)
    for raw in candidates:
        value = normalize_text(raw)
        if len(value) >= 70:
            return value

    parser = _TextExtractor()
    parser.feed(search_scope)
    full = parser.text()
    return full[:700] if len(full) > 80 else ""


def enrich_summary(link: str, fallback: str) -> str:
    if fallback and len(normalize_text(fallback)) >= MIN_SUMMARY_LEN:
        return normalize_summary(fallback)
    if not link:
        return normalize_summary(fallback)

    try:
        html_text = fetch(link, timeout=15, accepts="text/html").decode("utf-8", errors="ignore")
    except Exception:
        return normalize_summary(fallback)

    meta = extract_meta_desc(html_text)
    if meta:
        return normalize_summary(meta)

    lead = extract_leadin(html_text)
    if lead:
        return normalize_summary(lead)

    return normalize_summary(fallback)


def extract_hn_id(source_item: Dict[str, Any]) -> str:
    comments_url = source_item.get("comments", "")
    if comments_url:
        parsed = urlparse(comments_url)
        query = parse_qs(parsed.query)
        if "id" in query and query["id"]:
            return str(query["id"][0])

    link = source_item.get("link", "")
    parsed = urlparse(link)
    if parsed.hostname and "ycombinator" in parsed.hostname:
        query = parse_qs(parsed.query)
        if "id" in query and query["id"]:
            return str(query["id"][0])
    return ""


def fetch_hn_item(hn_id: str) -> Dict[str, Any]:
    if not hn_id:
        return {}
    api_url = HN_API_URL.format(item_id=hn_id)
    raw = fetch(api_url, timeout=15, accepts="application/json")
    data = json.loads(raw.decode("utf-8", errors="ignore"))
    return data if isinstance(data, dict) else {}


def _score_keywords(text_lower: str) -> tuple[float, list[str]]:
    score = 0.0
    reasons: list[str] = []
    for keyword, weight in TREND_WEIGHTS.items():
        normalized = keyword.lower()
        if normalized.isascii():
            matched = re.search(rf'(?<![a-z0-9]){re.escape(normalized)}(?![a-z0-9])', text_lower)
        else:
            matched = normalized in text_lower
        if matched:
            score += weight
            reasons.append(keyword)
    return score, reasons


def compute_trend_score(item: Dict[str, Any], now: datetime) -> tuple[float, list[str]]:
    combined = " ".join(
        [
            (item.get("title") or "").lower(),
            (item.get("summary") or "").lower(),
            " ".join(item.get("categories", [])).lower(),
        ]
    )

    kw_score, reasons = _score_keywords(combined)

    pub_dt = item.get("published_dt")
    recency = 0.0
    if pub_dt:
        age_hours = max((now - pub_dt).total_seconds() / 3600.0, 0.0)
        recency = max(0.0, 1.0 - age_hours / RECENCY_HOURS) * 2.0

    score_from_feedback = 0.0
    if item.get("hn_score") is not None:
        score_from_feedback += math.log1p(max(0, int(item["hn_score"]))) * 0.25
    if item.get("comments_count") is not None:
        score_from_feedback += math.log1p(max(0, int(item["comments_count"]))) * 0.20

    total = kw_score + recency + score_from_feedback

    why = reasons[:4]
    if item.get("hn_score"):
        why.append(f"HN分数{int(item['hn_score'])}")
    if item.get("comments_count"):
        why.append(f"讨论量{int(item['comments_count'])}")

    return round(total, 3), sorted(dict.fromkeys(why))


def fetch_rss_source(source):
    raw = fetch(source["feed_url"], timeout=8)

    root = ET.fromstring(raw)
    channel = root.find("channel")
    if channel is None:
        return {
            "name": source["name"],
            "source_page": source["source_page"],
            "feed_url": source["feed_url"],
            "error": "RSS 中未找到 <channel>",
        }

    raw_items = []
    for item in channel.findall("item")[: source["max_items"]]:
        description = normalize_text((item.findtext("description") or "").strip())
        categories = [
            (cat.text or "").strip() for cat in item.findall("category") if (cat.text or "").strip()
        ]
        raw_items.append(
            {
                "title": text_of(item, "title"),
                "link": text_of(item, "link"),
                "published": text_of(item, "pubDate"),
                "comments": text_of(item, "comments"),
                "summary": description,
                "categories": categories[:8],
            }
        )

    normalized = []
    seen = set()
    for raw_item in raw_items:
        title = (raw_item.get("title") or "").strip()
        link = (raw_item.get("link") or "").strip()
        if not title:
            continue
        dedupe_key = link or title
        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)

        parsed_iso, parsed_dt = parse_pub_date(raw_item.get("published", ""))

        item = {
            "title": title,
            "link": link,
            "published": parsed_iso,
            "published_dt": parsed_dt,
            "comments": raw_item.get("comments", ""),
            "summary": normalize_summary(raw_item.get("summary", "")),
            "categories": raw_item.get("categories", []),
        }

        # Enrich only selected stories below, with a bounded worker pool.

        normalized.append(item)

    if source["name"] == "Hacker News":
        def add_feedback(item):
            hn_id = extract_hn_id(item)
            if hn_id:
                try:
                    hn_item = fetch_hn_item(hn_id)
                    item["hn_id"] = hn_id
                    if isinstance(hn_item, dict):
                        if hn_item.get("score") is not None:
                            item["hn_score"] = int(hn_item.get("score", 0))
                        if hn_item.get("descendants") is not None:
                            item["comments_count"] = int(hn_item.get("descendants", 0))
                except Exception:
                    item["hn_id"] = hn_id
            return item
        with ThreadPoolExecutor(max_workers=6) as pool:
            normalized = list(pool.map(add_feedback, normalized))

    now = datetime.now(timezone.utc)
    for item in normalized:
        trend_score, reasons = compute_trend_score(item, now)
        item["trend_score"] = trend_score
        item["why_trending"] = reasons
        item.pop("published_dt", None)

    normalized.sort(key=lambda x: x.get("trend_score", 0.0), reverse=True)

    if not normalized:
        raise RuntimeError("RSS contained no usable items")
    return {
        "name": source["name"],
        "source_page": source["source_page"],
        "feed_url": source["feed_url"],
        "item_count": len(normalized),
        "items": normalized[:MAX_OUTPUT_PER_SOURCE],
    }


def fetch_hn_api(source):
    # Official v0 schema: https://github.com/HackerNews/API#items
    ids = json.loads(fetch("https://hacker-news.firebaseio.com/v0/topstories.json", accepts="application/json"))
    if not isinstance(ids, list) or not ids:
        raise RuntimeError("HN API returned no story IDs")
    def item_for(hn_id):
        try:
            data = fetch_hn_item(str(hn_id))
            if data.get("type") != "story" or data.get("dead") or data.get("deleted") or not data.get("title") or not data.get("time"):
                return None
            comments = f"https://news.ycombinator.com/item?id={hn_id}"
            link = data.get("url") or comments
            if not link.startswith("https://"):
                link = comments
            published = datetime.fromtimestamp(data["time"], timezone.utc)
            item = {"title": html.unescape(data["title"]), "link": link,
                    "published": published.isoformat(), "published_dt": published,
                    "comments": comments, "summary": normalize_summary(data.get("text", "")),
                    "categories": [], "hn_id": str(hn_id),
                    "hn_score": data.get("score", 0), "comments_count": data.get("descendants", 0)}
            item["trend_score"], item["why_trending"] = compute_trend_score(item, datetime.now(timezone.utc))
            item.pop("published_dt")
            return item
        except Exception:
            return None
    with ThreadPoolExecutor(max_workers=6) as pool:
        items = [item for item in pool.map(item_for, ids[:30]) if item]
    if not items:
        raise RuntimeError("HN API returned no usable stories")
    items.sort(key=lambda item: item["trend_score"], reverse=True)
    return {"name": source["name"], "source_page": source["source_page"],
            "feed_url": source["feed_url"], "fetch_method": "official-api",
            "item_count": len(items), "items": items[:MAX_OUTPUT_PER_SOURCE]}


def fetch_source(source):
    try:
        result = fetch_rss_source(source)
        if result.get("error") or not result.get("items"):
            raise RuntimeError(result.get("error", "empty RSS"))
    except Exception as exc:
        if source["name"] != "Hacker News":
            raise
        result = fetch_hn_api(source)
        result["warning"] = f"RSS unavailable; using official HN API ({str(exc)[:180]})"
    def enrich(item):
        item["summary"] = enrich_summary(item["link"], item.get("summary", ""))
        return item
    with ThreadPoolExecutor(max_workers=6) as pool:
        result["items"] = list(pool.map(enrich, result["items"]))
    return result


def main():
    sources = []
    for source in SOURCES:
        try:
            sources.append(fetch_source(source))
        except Exception as exc:
            sources.append(
                {
                    "name": source["name"],
                    "source_page": source["source_page"],
                    "feed_url": source["feed_url"],
                    "error": f"{type(exc).__name__}: {exc}",
                }
            )

    print(
        json.dumps(
            {
                "digest_name": "Hacker News + TechCrunch",
                "sources": sources,
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 1 if any(source.get("error") or not source.get("items") for source in sources) else 0


if __name__ == "__main__":
    sys.exit(main())
