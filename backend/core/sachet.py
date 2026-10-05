"""
sachet.py — official disaster alerts from NDMA SACHET (Common Alerting Protocol).

Shared, byte-for-byte, by telangana.live and vizag.live: keep both copies the
same. Each site stores the alerts its own way (telangana in alerts.json, vizag
in the alerts table); this module only reads and filters.

SACHET is the National Disaster Management Authority's CAP system; IMD, CWC
and the State Disaster Management Authorities publish through it. No key.
  RSS (all India): SACHET_RSS_URL, one <item> per alert, <guid> = identifier,
                   <author> "controlroom@ndma.gov.in (Andhra Pradesh SDMA)".
  CAP message:     <link> of the item. One <cap:info> per language; Andhra
                   Pradesh SDMA items have Telugu RSS titles, so the English
                   headline and the area come from here.

Matching approach adapted from ForThePeople.in's src/scraper/lib/sachet.ts
(© 2026 Jayanth M B, MIT License, github.com/jayanthmb14/forthepeople):
the alert must name the state (sender or English text) before a district name
is looked for, so a "Hyderabad" in another state cannot match. Only the English
headline and areaDesc are searched; descriptions carry office signatures that
are not the affected area.
"""
import datetime
import email.utils
import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from typing import Callable, Iterable, Optional

SACHET_RSS_URL = "https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml"
_SACHET_LINK = re.compile(r"^https://sachet\.ndma\.gov\.in/")
_GUID = re.compile(r"^[\w-]+$")

# CAP severity -> the four bands both sites rank and badge.
_SEVERITY = {"extreme": "critical", "severe": "high", "moderate": "medium", "minor": "low"}

# CAP event -> a type both sites already render. Order matters: first match wins.
_KINDS = (
    ("flood", re.compile(r"flood|inundat", re.I)),
    ("natural_disaster", re.compile(r"landslide|avalanche|earthquake|tsunami", re.I)),
    ("emergency", re.compile(r"fire", re.I)),
    ("weather", re.compile(r"cyclone|depression|storm|thunder|lightning|squall|gust"
                           r"|rain|heat|cold|wind|fog|dust|hail", re.I)),
)


@dataclass(frozen=True)
class SachetItem:
    guid: str
    title: str
    link: str
    office: Optional[str]
    published: Optional[datetime.datetime]


@dataclass(frozen=True)
class SachetAlert:
    identifier: str
    sender: str
    sent: Optional[datetime.datetime]
    event: Optional[str]
    cap_severity: Optional[str]
    urgency: Optional[str]
    certainty: Optional[str]
    headline: Optional[str]
    description: Optional[str]
    instruction: Optional[str]
    area: str
    effective: Optional[datetime.datetime]
    expires: Optional[datetime.datetime]
    link: str

    @property
    def severity(self) -> str:
        return site_severity(self.cap_severity)

    @property
    def kind(self) -> str:
        return alert_kind(self.event)

    def is_active(self, now: datetime.datetime) -> bool:
        """An alert with no expiry is treated as expired: silence beats a stale warning."""
        return self.expires is not None and self.expires > now


def site_severity(cap_severity: Optional[str]) -> str:
    return _SEVERITY.get((cap_severity or "").strip().lower(), "low")


def alert_kind(event: Optional[str]) -> str:
    for kind, pattern in _KINDS:
        if event and pattern.search(event):
            return kind
    return "natural_disaster"


# ── Parsing ──────────────────────────────────────────────────

def _strip_namespaces(root: ET.Element) -> ET.Element:
    for el in root.iter():
        if isinstance(el.tag, str) and "}" in el.tag:
            el.tag = el.tag.split("}", 1)[1]
    return root


def _parse_xml(text: str) -> Optional[ET.Element]:
    try:
        return _strip_namespaces(ET.fromstring(text))
    except ET.ParseError:
        return None


def _text(el: Optional[ET.Element], tag: str) -> Optional[str]:
    if el is None:
        return None
    child = el.find(tag)
    if child is None or child.text is None:
        return None
    return re.sub(r"\s+", " ", child.text).strip() or None


def _iso(value: Optional[str]) -> Optional[datetime.datetime]:
    if not value:
        return None
    try:
        moment = datetime.datetime.fromisoformat(value)
    except ValueError:
        return None
    return moment if moment.tzinfo else None


def parse_rss(xml: str) -> list:
    root = _parse_xml(xml)
    if root is None:
        return []
    items = []
    for item in root.iter("item"):
        guid = _text(item, "guid") or ""
        link = _text(item, "link") or ""
        if not _GUID.match(guid) or not _SACHET_LINK.match(link):
            continue
        author = _text(item, "author") or ""
        office = re.search(r"\(([^)]+)\)\s*$", author)
        published = None
        try:
            published = email.utils.parsedate_to_datetime(_text(item, "pubDate") or "")
        except (TypeError, ValueError):
            pass
        items.append(SachetItem(
            guid=guid,
            title=_text(item, "title") or "",
            link=link,
            office=office.group(1).strip() if office else None,
            published=published,
        ))
    return items


def parse_cap(xml: str, link: str) -> Optional[SachetAlert]:
    """A live CAP alert or update, or None (cancellation, test, unparseable)."""
    root = _parse_xml(xml)
    if root is None or root.tag != "alert":
        return None
    if _text(root, "status") != "Actual" or _text(root, "msgType") not in ("Alert", "Update"):
        return None
    infos = root.findall("info")
    info = next((i for i in infos if (_text(i, "language") or "").lower().startswith("en")),
                infos[0] if infos else None)
    if info is None:
        return None
    areas = [_text(a, "areaDesc") for a in info.findall("area")]
    return SachetAlert(
        identifier=_text(root, "identifier") or "",
        sender=_text(root, "sender") or "",
        sent=_iso(_text(root, "sent")),
        event=_text(info, "event"),
        cap_severity=_text(info, "severity"),
        urgency=_text(info, "urgency"),
        certainty=_text(info, "certainty"),
        headline=_text(info, "headline"),
        description=_text(info, "description"),
        instruction=_text(info, "instruction"),
        area="; ".join(a for a in areas if a),
        effective=_iso(_text(info, "effective")),
        expires=_iso(_text(info, "expires")),
        link=link,
    )


# ── Matching ─────────────────────────────────────────────────

def _squash(text: str) -> str:
    return re.sub(r"[^a-z]", "", text.lower())


@dataclass(frozen=True)
class AreaFilter:
    """Which alerts a site shows.

    state: must be named by the sender or the English text.
    codes: district prefixes used by state SDMAs in areaDesc ("vsp-gajuwaka").
    names: district, city or mandal names, matched as whole words.
    With neither codes nor names, every alert naming the state matches.
    """
    state: str
    codes: tuple = ()
    names: tuple = ()

    def _names_state(self, alert: SachetAlert) -> bool:
        state = _squash(self.state)
        haystack = (alert.sender, alert.area, alert.headline or "")
        return any(state in _squash(h) for h in haystack)

    def matches(self, alert: SachetAlert) -> bool:
        if not self._names_state(alert):
            return False
        if not self.codes and not self.names:
            return True
        text = f"{alert.headline or ''} | {alert.area}"
        for code in self.codes:
            if re.search(rf"(?<![a-z]){re.escape(code)}-", text, re.I):
                return True
        return any(re.search(rf"\b{re.escape(name)}\b", text, re.I) for name in self.names)


# ── Fetching ─────────────────────────────────────────────────

def fetch_alerts(area: AreaFilter, *, offices: Iterable[str], now: datetime.datetime,
                 get: Callable[[str], str], skip_guids: Iterable[str] = ()) -> list:
    """Active SACHET alerts for one area.

    offices: substrings of the RSS issuing office worth opening ("Andhra
    Pradesh", "Hyderabad", "CWC"). The RSS lists the whole country, so this
    keeps a run to a handful of CAP downloads instead of ~100.
    skip_guids: items the caller already stored; not downloaded again.
    get: url -> text; raises on failure. A failed CAP download skips that alert.
    """
    offices = tuple(o.lower() for o in offices)
    skip = set(skip_guids)
    alerts = []
    for item in parse_rss(get(SACHET_RSS_URL)):
        if item.guid in skip:
            continue
        if not item.office or not any(o in item.office.lower() for o in offices):
            continue
        try:
            alert = parse_cap(get(item.link), item.link)
        except Exception as exc:  # one bad alert must not lose the rest
            print(f"  ⚠️ SACHET {item.guid}: {exc}")
            continue
        if alert and alert.is_active(now) and area.matches(alert):
            alerts.append(alert)
    return alerts
