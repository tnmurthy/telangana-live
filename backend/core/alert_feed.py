"""
alert_feed.py — the one schema written to frontend alerts.json.

Two families of components read that file and historically disagreed on its
shape, so whichever writer ran last left half the UI blank:

  * AlertsBanner / AlertsPage  read title, description, severity, type,
                               region, createdAt / publishedAt, sourceLink
  * BreakingNewsBanner          reads message, time, severity
  * api/civic_gateway           filters on district

Every record produced here carries all of those fields. Aliases (message/title,
region/district, sourceLink/link) are kept in sync by construction.
"""
import datetime
import hashlib
from typing import Iterable, Optional

# Matches SEVERITY_ORDER in frontend/src/pages/AlertsPage.jsx.
FRONTEND_SEVERITIES = ("low", "medium", "high", "critical")

DEFAULT_DISTRICT = "Telangana"

_IST = datetime.timezone(datetime.timedelta(hours=5, minutes=30), "IST")
_MONTHS = ("Jan", "Feb", "Mar", "Apr", "May", "Jun",
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
_ISO = "%Y-%m-%dT%H:%M:%SZ"


def format_ist(moment: datetime.datetime) -> str:
    """'1 Oct, 3:00 PM IST' — an absolute stamp that cannot go stale.

    Built by hand because strftime's no-padding flags differ between Windows
    and Linux, and this runs on both.
    """
    local = moment.astimezone(_IST)
    hour = local.hour % 12 or 12
    meridiem = "AM" if local.hour < 12 else "PM"
    return f"{local.day} {_MONTHS[local.month - 1]}, {hour}:{local.minute:02d} {meridiem} IST"


def _to_iso(moment: datetime.datetime) -> str:
    return moment.astimezone(datetime.timezone.utc).strftime(_ISO)


def _published_to_datetime(published) -> Optional[datetime.datetime]:
    """Accept feedparser's *_parsed struct_time (or any 6+ int sequence)."""
    if not published:
        return None
    try:
        return datetime.datetime(*tuple(published)[:6], tzinfo=datetime.timezone.utc)
    except (TypeError, ValueError):
        return None


def is_fresh(published, *, now: datetime.datetime, max_age_days: int) -> bool:
    """True when the feed's own publication date is within max_age_days.

    Age is a known rule, so it lives here rather than in a model judgment: a
    headline reads the same whether it was written today or in 2024. A missing
    date counts as stale — silence beats a possibly years-old "alert".
    """
    published_dt = _published_to_datetime(published)
    if published_dt is None:
        return False
    return now - published_dt < datetime.timedelta(days=max_age_days)


def _stable_id(link: str, title: str) -> str:
    digest = hashlib.sha1((link or title).encode("utf-8")).hexdigest()[:12]
    return f"alert-{digest}"


def build_alert_record(*, title: str, description: str, alert_type: str,
                       severity: str, district: Optional[str], link: str,
                       source: str, published, now: datetime.datetime,
                       expires: Optional[datetime.datetime] = None) -> dict:
    """Build one alerts.json record that satisfies every consumer.

    expires: an official alert's own end time (SACHET CAP). The record is
    dropped once it passes, ahead of the usual expiry_days window.
    """
    if severity not in FRONTEND_SEVERITIES:
        raise ValueError(
            f"severity {severity!r} is not one of {FRONTEND_SEVERITIES}; "
            "the frontend would fail to sort or badge it"
        )

    district = district or DEFAULT_DISTRICT
    published_dt = _published_to_datetime(published) or now

    record = {
        "id": _stable_id(link, title),
        "type": alert_type,
        "severity": severity,
        "title": title,
        "message": title,
        "description": description,
        "district": district,
        "region": district,
        "createdAt": _to_iso(now),
        "publishedAt": _to_iso(published_dt),
        "time": format_ist(published_dt),
        "link": link,
        "sourceLink": link,
        "source": source,
    }
    if expires is not None:
        record["expiresAt"] = _to_iso(expires)
    return record


def _has_ended(expires_at, now: datetime.datetime) -> bool:
    if not expires_at:
        return False
    try:
        ends = datetime.datetime.strptime(expires_at, _ISO).replace(
            tzinfo=datetime.timezone.utc)
    except (TypeError, ValueError):
        return True  # an unreadable end time is not a reason to keep showing it
    return ends <= now


def partition_existing(existing: Iterable[dict], *, now: datetime.datetime,
                       expiry_days: int) -> tuple:
    """Split the previous feed into (still-active alerts, titles already seen).

    Records without a parseable createdAt — including every record in the
    legacy emergency_alerts.py schema — are dropped rather than raising.
    """
    kept, seen = [], set()
    for alert in existing:
        title = alert.get("title")
        if title:
            seen.add(title)
        # Expire on publication date: an old article ingested today must not
        # stay live for expiry_days. createdAt is the fallback for older rows.
        stamp = alert.get("publishedAt") or alert.get("createdAt")
        try:
            published = datetime.datetime.strptime(stamp, _ISO).replace(
                tzinfo=datetime.timezone.utc)
        except (TypeError, ValueError):
            continue
        if now - published >= datetime.timedelta(days=expiry_days):
            continue
        if _has_ended(alert.get("expiresAt"), now):
            continue
        kept.append(alert)
    return kept, seen


def build_official_record(alert, *, now: datetime.datetime) -> dict:
    """An alerts.json record from an NDMA SACHET alert (core.sachet.SachetAlert).

    The issuing authority is named in source, and the record carries the CAP
    expiry so partition_existing drops it when the authority's alert ends.
    """
    title = alert.headline or f"{alert.event or 'Alert'}: {alert.area}"
    description = " ".join(
        part for part in (f"Area: {alert.area}." if alert.area else "", alert.instruction or "")
        if part)
    issued = alert.sent or alert.effective or now
    return build_alert_record(
        title=title,
        description=description,
        alert_type=alert.kind,
        severity=alert.severity,
        district=None,
        link=alert.link,
        source=f"NDMA SACHET ({alert.sender})",
        published=issued.astimezone(datetime.timezone.utc).timetuple(),
        now=now,
        expires=alert.expires,
    )
