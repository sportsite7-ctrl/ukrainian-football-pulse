#!/usr/bin/env python3
"""Fetch football RSS feeds, summarize eligible stories in Ukrainian with Gemini,
and publish them to the SPORT PULSE Supabase articles table.

Uses only Python's standard library so the GitHub Actions job needs no pip installs.
"""
from __future__ import annotations

import hashlib
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from typing import Any

USER_AGENT = "SPORT-PULSE-NewsCollector/1.0 (+https://github.com/sportsite7-ctrl/ukrainian-football-pulse)"
MAX_ITEMS_PER_FEED = 12
MAX_AGE_HOURS = 72
MAX_BATCH_ITEMS = 24
ALLOWED_CATEGORIES = {"transfers", "matches", "tournaments", "players", "coaches"}
ALLOWED_CLUBS = {
    "real-madrid", "barcelona", "man-city", "liverpool", "arsenal",
    "man-utd", "bayern", "psg", "inter", "juventus",
}
ALLOWED_TOURNAMENTS = {"ucl", "uel", "world-cup", "euro", "nations-league"}

DEFAULT_SOURCES = [
    {
        "name": "BBC Sport",
        "feed_url": "https://feeds.bbci.co.uk/sport/football/rss.xml",
        "type": "rss",
        "active": True,
    },
    {
        "name": "ESPN Soccer",
        "feed_url": "https://www.espn.com/espn/rss/soccer/news",
        "type": "rss",
        "active": True,
    },
]

CLUB_GUIDE = {
    "real-madrid": "Real Madrid, Реал Мадрид",
    "barcelona": "Barcelona, Барселона",
    "man-city": "Manchester City, Манчестер Сіті",
    "liverpool": "Liverpool, Ліверпуль",
    "arsenal": "Arsenal, Арсенал",
    "man-utd": "Manchester United, Манчестер Юнайтед",
    "bayern": "Bayern Munich, Баварія",
    "psg": "Paris Saint-Germain, PSG, ПСЖ",
    "inter": "Inter Milan, Інтер",
    "juventus": "Juventus, Ювентус",
}
TOURNAMENT_GUIDE = {
    "ucl": "UEFA Champions League, Ліга чемпіонів",
    "uel": "UEFA Europa League, Ліга Європи",
    "world-cup": "FIFA World Cup, Чемпіонат світу",
    "euro": "UEFA European Championship, Чемпіонат Європи",
    "nations-league": "UEFA Nations League, Ліга націй",
}


def log(message: str) -> None:
    print(f"[SPORT PULSE] {message}", flush=True)


def request_json(url: str, *, method: str = "GET", payload: Any = None,
                 headers: dict[str, str] | None = None, timeout: int = 30) -> Any:
    body = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request_headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    if body is not None:
        request_headers["Content-Type"] = "application/json"
    if headers:
        request_headers.update(headers)
    req = urllib.request.Request(url, data=body, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
            if not raw:
                return None
            return json.loads(raw)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:1200]
        raise RuntimeError(f"HTTP {exc.code} for {url}: {detail}") from exc


def supabase_headers(secret: str) -> dict[str, str]:
    # New sb_secret_* keys are API keys, not JWTs: send them only via apikey.
    # Keep Bearer auth for the legacy JWT-based service_role key.
    headers = {"apikey": secret}
    if not secret.startswith("sb_secret_"):
        headers["Authorization"] = f"Bearer {secret}"
    return headers


def supabase_url(base: str, path: str) -> str:
    return base.rstrip("/") + "/rest/v1/" + path.lstrip("/")


def ensure_sources(base: str, secret: str) -> list[dict[str, Any]]:
    headers = supabase_headers(secret)
    rows = request_json(
        supabase_url(base, "sources?select=id,name,feed_url,type,active&active=eq.true&order=name.asc"),
        headers=headers,
    )
    if rows:
        return rows

    log("No active RSS sources found; adding the two starter feeds.")
    request_json(
        supabase_url(base, "sources?on_conflict=feed_url"),
        method="POST",
        payload=DEFAULT_SOURCES,
        headers={**headers, "Prefer": "resolution=ignore-duplicates,return=minimal"},
    )
    rows = request_json(
        supabase_url(base, "sources?select=id,name,feed_url,type,active&active=eq.true&order=name.asc"),
        headers=headers,
    )
    return rows or []


def parse_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        parsed = parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except (TypeError, ValueError, OverflowError):
        pass
    try:
        normalized = value.replace("Z", "+00:00")
        parsed = datetime.fromisoformat(normalized)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except (TypeError, ValueError):
        return None


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    value = re.sub(r"<[^>]+>", " ", value)
    value = html.unescape(value)
    return re.sub(r"\s+", " ", value).strip()


def entry_image(entry: ET.Element) -> str | None:
    for element in entry.iter():
        tag = element.tag.lower()
        if tag.endswith("}content") or tag.endswith("}thumbnail") or tag.endswith("enclosure"):
            url = element.attrib.get("url") or element.attrib.get("href")
            mime = element.attrib.get("type", "")
            if url and (not mime or mime.startswith("image/")):
                return url
    return None


def parse_feed(xml_bytes: bytes, source: dict[str, Any]) -> list[dict[str, Any]]:
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as exc:
        log(f"Could not parse feed {source.get('name')}: {exc}")
        return []

    entries = [node for node in root.iter() if node.tag.rsplit("}", 1)[-1].lower() in {"item", "entry"}]
    now = datetime.now(timezone.utc)
    oldest = now - timedelta(hours=MAX_AGE_HOURS)
    found: list[dict[str, Any]] = []

    for entry in entries[:MAX_ITEMS_PER_FEED]:
        values: dict[str, str] = {}
        for child in list(entry):
            key = child.tag.rsplit("}", 1)[-1].lower()
            if key in {"title", "description", "summary", "content", "pubdate", "published", "updated", "link", "guid", "id"}:
                text_value = clean_text(" ".join(child.itertext()))
                if text_value and key not in values:
                    values[key] = text_value
            if key == "link" and not values.get("link"):
                values["link"] = child.attrib.get("href", "")

        title = values.get("title", "")
        url = values.get("link") or values.get("guid") or values.get("id") or ""
        if url and not url.startswith(("http://", "https://")):
            url = ""
        published = parse_date(values.get("pubdate") or values.get("published") or values.get("updated"))
        if not title or not url or not published or published < oldest or published > now + timedelta(hours=2):
            continue

        description = values.get("description") or values.get("summary") or values.get("content") or ""
        found.append({
            "title": title[:300],
            "snippet": description[:700],
            "url": url,
            "published_at": published.isoformat().replace("+00:00", "Z"),
            "source_name": str(source.get("name") or "Джерело"),
            "image_url": entry_image(entry),
        })
    return found


def fetch_candidates(sources: list[dict[str, Any]]) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    seen_urls: set[str] = set()
    for source in sources:
        feed_url = str(source.get("feed_url") or "")
        if not feed_url.startswith("https://"):
            continue
        try:
            req = urllib.request.Request(feed_url, headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml"})
            with urllib.request.urlopen(req, timeout=25) as response:
                parsed = parse_feed(response.read(3_000_000), source)
            for item in parsed:
                key = normalize_url(item["url"])
                if key not in seen_urls:
                    seen_urls.add(key)
                    candidates.append(item)
        except Exception as exc:
            log(f"Feed unavailable ({source.get('name')}): {exc}")
    return sorted(candidates, key=lambda item: item["published_at"], reverse=True)[:MAX_BATCH_ITEMS]


def normalize_url(url: str) -> str:
    parts = urllib.parse.urlsplit(url)
    query = urllib.parse.parse_qsl(parts.query, keep_blank_values=True)
    query = [(k, v) for k, v in query if not k.lower().startswith("utm_") and k.lower() not in {"fbclid", "gclid", "ocid"}]
    clean = urllib.parse.urlunsplit((parts.scheme.lower(), parts.netloc.lower(), parts.path.rstrip("/"), urllib.parse.urlencode(query), ""))
    return clean


def gemini_summarize(api_key: str, model: str, candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not candidates:
        return []
    prompt_items = [
        {
            "index": index,
            "source": item["source_name"],
            "headline": item["title"],
            "snippet": item["snippet"],
            "published_at": item["published_at"],
        }
        for index, item in enumerate(candidates)
    ]
    prompt = (
        "Ти редактор українського футбольного новинного сайту SPORT PULSE. "
        "Опрацюй надані RSS-заголовки та короткі описи. Поверни ЛИШЕ JSON-масив об'єктів. "
        "Залиш тільки достовірні новини про футбол, які стосуються великого європейського або міжнародного футболу. "
        "Не вигадуй факти, рахунки, цитати, дати, травми, суми трансферів чи подробиці. "
        "Використовуй лише інформацію з заголовка та короткого опису. Якщо інформації недостатньо для коректного "
        "короткого переказу або новина не про футбол — пропусти її. Не копіюй текст джерела дослівно. "
        "Напиши природною українською: title — короткий заголовок; summary — 2 короткі речення; "
        "body — масив із 1–2 коротких абзаців. category має бути одним із: transfers, matches, tournaments, players, coaches. "
        "clubs — масив лише з дозволених ID: real-madrid, barcelona, man-city, liverpool, arsenal, man-utd, bayern, psg, inter, juventus. "
        "Додавай клуб тільки коли він прямо згадується або однозначно є головним предметом новини. "
        "tournaments — масив лише з ID: ucl, uel, world-cup, euro, nations-league. "
        "Додавай турнір лише коли він прямо згадується. Не додавай інші клуби/турніри. "
        "Кожен об'єкт має містити index, relevant, title, summary, body, category, clubs, tournaments. "
        "relevant має бути true або false. Не включай поле source_url — його додасть система.\n\n"
        "Дозволені ID клубів: " + json.dumps(CLUB_GUIDE, ensure_ascii=False) +
        "\nДозволені ID турнірів: " + json.dumps(TOURNAMENT_GUIDE, ensure_ascii=False) +
        "\nRSS-матеріали:\n" + json.dumps(prompt_items, ensure_ascii=False)
    )
    def generate_with_model(model_name: str, attempts: int = 3) -> Any:
        model_url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            + urllib.parse.quote(model_name, safe="")
            + ":generateContent"
        )
        delays = (3, 8)
        for attempt in range(attempts):
            try:
                return request_json(
                    model_url,
                    method="POST",
                    payload=payload,
                    headers={"x-goog-api-key": api_key},
                    timeout=60,
                )
            except (RuntimeError, TimeoutError, urllib.error.URLError) as exc:
                message = str(exc)
                transient = (
                    isinstance(exc, (TimeoutError, urllib.error.URLError))
                    or any(
                        message.startswith(f"HTTP {status} ")
                        for status in (408, 429, 500, 502, 503, 504)
                    )
                )
                if not transient or attempt >= attempts - 1:
                    raise
                delay = delays[attempt]
                log(
                    f"Gemini {model_name} temporarily unavailable. "
                    f"Retrying in {delay}s (attempt {attempt + 2}/{attempts})."
                )
                time.sleep(delay)

    try:
        result = generate_with_model(model)
    except (RuntimeError, TimeoutError, urllib.error.URLError) as primary_error:
        fallback_model = "gemini-3.5-flash-lite"
        if model == fallback_model:
            raise
        log(
            f"Primary Gemini model {model} unavailable after retries; "
            f"switching to fallback model {fallback_model}."
        )
        try:
            result = generate_with_model(fallback_model, attempts=2)
        except Exception as fallback_error:
            raise RuntimeError(
                f"Primary model failed ({primary_error}); "
                f"fallback model {fallback_model} also failed ({fallback_error})."
            ) from fallback_error
    try:
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            parsed = parsed.get("articles", [])
        return parsed if isinstance(parsed, list) else []
    except (KeyError, IndexError, TypeError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Gemini returned an unexpected response: {exc}; response={str(result)[:1000]}") from exc


def event_key_for(url: str) -> str:
    return hashlib.sha256(normalize_url(url).encode("utf-8")).hexdigest()


def main() -> int:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    base = os.environ.get("SUPABASE_URL", "").strip()
    secret = os.environ.get("SUPABASE_SECRET_KEY", "").strip()
    model = os.environ.get("GEMINI_MODEL", "gemini-3.8-flash").strip()

    missing = [name for name, value in {
        "GEMINI_API_KEY": api_key,
        "SUPABASE_URL": base,
        "SUPABASE_SECRET_KEY": secret,
    }.items() if not value]
    if missing:
        log("Missing GitHub Actions secrets: " + ", ".join(missing))
        return 1

    sources = ensure_sources(base, secret)
    if not sources:
        log("No active sources are configured.")
        return 0

    candidates = fetch_candidates(sources)
    log(f"Fetched {len(candidates)} recent candidate items from {len(sources)} active feeds.")
    if not candidates:
        return 0

    keys = [event_key_for(item["url"]) for item in candidates]
    # Query existing event keys in chunks so repeated RSS entries are not republished.
    existing: set[str] = set()
    headers = supabase_headers(secret)
    for offset in range(0, len(keys), 30):
        chunk = keys[offset:offset + 30]
        query = urllib.parse.urlencode({
            "select": "event_key",
            "event_key": "in.(" + ",".join(chunk) + ")",
        }, safe="(),")
        rows = request_json(supabase_url(base, "articles?" + query), headers=headers)
        existing.update(row.get("event_key") for row in (rows or []) if row.get("event_key"))

    fresh = [item for item in candidates if event_key_for(item["url"]) not in existing]
    log(f"{len(fresh)} candidates remain after URL de-duplication.")
    if not fresh:
        return 0

    generated = gemini_summarize(api_key, model, fresh)
    published: list[dict[str, Any]] = []
    for article in generated:
        if not isinstance(article, dict) or article.get("relevant") is not True:
            continue
        try:
            index = int(article.get("index"))
        except (TypeError, ValueError):
            continue
        if index < 0 or index >= len(fresh):
            continue
        source = fresh[index]
        title = clean_text(str(article.get("title") or ""))[:220]
        summary = clean_text(str(article.get("summary") or ""))[:700]
        body = article.get("body")
        if isinstance(body, str):
            body = [clean_text(body)]
        if not isinstance(body, list):
            body = []
        body = [clean_text(str(paragraph))[:900] for paragraph in body if clean_text(str(paragraph))][:3]
        category = article.get("category")
        if category not in ALLOWED_CATEGORIES or not title or not summary or not body:
            continue
        clubs = [value for value in article.get("clubs", []) if value in ALLOWED_CLUBS] if isinstance(article.get("clubs"), list) else []
        tournaments = [value for value in article.get("tournaments", []) if value in ALLOWED_TOURNAMENTS] if isinstance(article.get("tournaments"), list) else []
        published.append({
            "title": title,
            "summary": summary,
            "body": body,
            "category": category,
            "clubs": sorted(set(clubs)),
            "tournaments": sorted(set(tournaments)),
            "published_at": source["published_at"],
            "source_name": source["source_name"],
            "source_url": source["url"],
            "sources": [{"name": source["source_name"], "url": source["url"]}],
            "image_url": source.get("image_url"),
            "image_alt": None,
            "is_featured": False,
            "event_key": event_key_for(source["url"]),
            "status": "published",
        })

    # Keep the workflow conservative: never write unvalidated model output.
    unique: dict[str, dict[str, Any]] = {}
    for article in published:
        unique[article["event_key"]] = article
    rows = list(unique.values())
    if not rows:
        log("Gemini did not return any eligible, valid articles.")
        return 0

    request_json(
        supabase_url(base, "articles"),
        method="POST",
        payload=rows,
        headers={**headers, "Prefer": "return=minimal"},
        timeout=45,
    )
    # Update source health timestamps; failure here should not undo published articles.
    checked_at = datetime.now(timezone.utc).isoformat()
    for source in sources:
        source_id = source.get("id")
        if source_id:
            try:
                request_json(
                    supabase_url(base, "sources?id=eq." + urllib.parse.quote(str(source_id), safe="")),
                    method="PATCH",
                    payload={"last_checked_at": checked_at},
                    headers=headers,
                    timeout=15,
                )
            except Exception as exc:
                log(f"Could not update last_checked_at for {source.get('name')}: {exc}")

    log(f"Published {len(rows)} Ukrainian news summaries.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        log(f"FAILED: {error}")
        raise
