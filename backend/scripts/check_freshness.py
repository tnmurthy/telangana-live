"""
check_freshness.py: daily check that every published data module is current.

Each module is judged by its own timestamp (not the file's commit time)
against how often that data should change. Any module older than its limit,
missing, or unreadable fails the run, so GitHub notifies the maintainer, and
a table is written to the run summary. Idea from ForThePeople's verify-data
cron (MIT, github.com/jayanthmb14/forthepeople).

Run:  python backend/scripts/check_freshness.py
"""
import datetime
import json
import os
import re
import sys
from dataclasses import dataclass
from email.utils import parsedate_to_datetime

_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_IST = datetime.timezone(datetime.timedelta(hours=5, minutes=30))


@dataclass(frozen=True)
class Module:
    name: str
    path: str
    field: str          # "updatedAt", "[].published", "categories.*[].publishedAt"
    max_age_hours: int  # older than this = stale


def _data(*parts):
    return os.path.join(_REPO_ROOT, "frontend", *parts)


MODULES: list[Module] = [
    Module("fuel", _data("src", "data", "fuelPrices.js"), "updatedAt", 30),
    Module("pulses", _data("src", "data", "pulses.js"), "updatedAt", 30),
    Module("news", _data("src", "data", "news.json"), "[].published", 12),
    Module("tech_pulse", _data("public", "data", "tech_pulse.json"), "categories.*[].publishedAt", 96),
    # water_levels: no official source connected yet; the page says so.
    Module("transit_status", _data("src", "data", "transit_status.json"), "lastUpdated", 24),
]


@dataclass(frozen=True)
class Result:
    name: str
    updated: datetime.datetime | None
    age_hours: int | None
    max_age_hours: int
    stale: bool
    error: str | None = None


def _load(path: str):
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    if path.endswith(".js"):
        match = re.search(r"= (\{[\s\S]*\}|\[[\s\S]*\]);\s*$", text)
        if not match:
            raise ValueError("no exported data object")
        text = match.group(1)
    return json.loads(text)


def _parse_time(value) -> datetime.datetime:
    text = str(value).strip()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", text):
        # A date without a time means "as of that day" in India: end of day IST.
        day = datetime.datetime.strptime(text, "%Y-%m-%d").replace(hour=23, minute=59, second=59, tzinfo=_IST)
        return day.astimezone(datetime.timezone.utc)
    if re.match(r"\d{4}-\d{2}-\d{2}T", text):
        parsed = datetime.datetime.fromisoformat(text.replace("Z", "+00:00"))
    elif re.fullmatch(r"\d{1,2} [A-Za-z]{3}, \d{4} [+-]\d{4}", text):
        parsed = datetime.datetime.strptime(text, "%d %b, %Y %z")  # "01 Oct, 2026 +0530"
    else:
        parsed = parsedate_to_datetime(text)  # RFC 822, e.g. RSS pubDate
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=datetime.timezone.utc)
    return parsed.astimezone(datetime.timezone.utc)


def _values(node, path: list[str]):
    if not path:
        yield node
        return
    head, rest = path[0], path[1:]
    if head == "[]":
        for item in node if isinstance(node, list) else []:
            yield from _values(item, rest)
    elif head == "*":
        for item in node.values() if isinstance(node, dict) else []:
            yield from _values(item, rest)
    elif isinstance(node, dict) and head in node:
        yield from _values(node[head], rest)


def read_timestamp(module: Module) -> datetime.datetime:
    """Newest timestamp at module.field. Raises when there is none."""
    path = [p for p in re.split(r"\.|(\[\])", module.field) if p]
    stamps = []
    for value in _values(_load(module.path), path):
        if not value:
            continue
        try:
            stamps.append(_parse_time(value))
        except (ValueError, TypeError):
            continue  # one malformed item must not hide a fresh feed
    if not stamps:
        raise ValueError(f"no readable time at {module.field}")
    return max(stamps)


def check(modules: list[Module], now: datetime.datetime | None = None) -> list[Result]:
    now = now or datetime.datetime.now(datetime.timezone.utc)
    results = []
    for m in modules:
        try:
            updated = read_timestamp(m)
        except (OSError, ValueError, TypeError) as e:
            results.append(Result(m.name, None, None, m.max_age_hours, True, str(e)))
            continue
        age = int((now - updated).total_seconds() // 3600)
        results.append(Result(m.name, updated, age, m.max_age_hours, age > m.max_age_hours))
    return results


def _table(results: list[Result]) -> str:
    lines = ["| Module | Last updated (UTC) | Age | Limit | Status |", "|---|---|---|---|---|"]
    for r in results:
        when = r.updated.strftime("%Y-%m-%d %H:%M") if r.updated else "—"
        age = f"{r.age_hours} h" if r.age_hours is not None else (r.error or "—")
        lines.append(f"| {r.name} | {when} | {age} | {r.max_age_hours} h | {'STALE' if r.stale else 'ok'} |")
    return "\n".join(lines)


def main(now: datetime.datetime | None = None) -> int:
    results = check(MODULES, now=now)
    table = _table(results)
    print(table)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as fh:
            fh.write("## Data freshness\n\n" + table + "\n")
    stale = [r.name for r in results if r.stale]
    if stale:
        print(f"Stale modules: {', '.join(stale)}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
