"""
Unit tests for core.sachet — the NDMA SACHET (CAP) alert reader shared by
telangana.live and vizag.live. Fixtures mirror the live feed's shape as seen
on 5 Oct 2026 (Andhra Pradesh SDMA items carry Telugu titles; the English
text and the area come from the per-alert CAP file).

Run with:  pytest tests/test_sachet.py
"""
import datetime
import os
import sys

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "backend"))

from core.sachet import (  # noqa: E402
    SACHET_RSS_URL,
    AreaFilter,
    alert_kind,
    fetch_alerts,
    parse_cap,
    parse_rss,
    site_severity,
)

IST = datetime.timezone(datetime.timedelta(hours=5, minutes=30))
NOW = datetime.datetime(2026, 10, 5, 7, 30, tzinfo=IST)

RSS = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <item>
    <title>మీ ప్రాంతంలో పిడుగులు పడే అవకాశం ఉంది</title>
    <category>Met</category>
    <link>https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=111</link>
    <author>controlroom@ndma.gov.in (Andhra Pradesh SDMA)</author>
    <guid isPermaLink="false">111</guid>
    <pubDate>Mon, 05 Oct 2026 01:41:07 GMT</pubDate>
  </item>
  <item>
    <title>Thunderstorm over North Dinajpur district</title>
    <category>Met</category>
    <link>https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=222</link>
    <author>controlroom@ndma.gov.in (IMD Kolkata)</author>
    <guid isPermaLink="false">222</guid>
    <pubDate>Mon, 05 Oct 2026 02:41:02 GMT</pubDate>
  </item>
  <item>
    <title>bad guid</title>
    <link>https://example.com/x</link>
    <guid>../etc</guid>
  </item>
</channel></rss>"""


def cap_xml(*, identifier="IN-111_8", sender="Andhra-Pradesh-SDMA",
            msg_type="Alert", status="Actual", event="Lightning",
            severity="Severe", area="vsp-gajuwaka, ankp-anakapalli mandals ",
            headline=None, expires="2026-10-05T08:10:00+05:30",
            english=True):
    headline = headline or f"Lightning is Likely to occur over {area}."
    english_block = f"""
<cap:info>
<cap:language>en-IN</cap:language>
<cap:category>Met</cap:category>
<cap:event>{event}</cap:event>
<cap:urgency>Expected</cap:urgency>
<cap:severity>{severity}</cap:severity>
<cap:certainty>Possible</cap:certainty>
<cap:effective>2026-10-05T07:10:00+05:30</cap:effective>
<cap:onset>2026-10-05T07:12:02+05:30</cap:onset>
<cap:expires>{expires}</cap:expires>
<cap:headline>{headline}</cap:headline>
<cap:description/>
<cap:instruction>Please follow SDMA guidelines.</cap:instruction>
<cap:area><cap:areaDesc>{area}</cap:areaDesc></cap:area>
</cap:info>""" if english else ""
    return f"""<cap:alert xmlns:cap="urn:oasis:names:tc:emergency:cap:1.2">
<cap:identifier>{identifier}</cap:identifier>
<cap:sender>{sender}</cap:sender>
<cap:sent>2026-10-05T07:11:07+05:30</cap:sent>
<cap:status>{status}</cap:status>
<cap:msgType>{msg_type}</cap:msgType>{english_block}
<cap:info>
<cap:language>TL</cap:language>
<cap:event>{event}</cap:event>
<cap:severity>{severity}</cap:severity>
<cap:expires>{expires}</cap:expires>
<cap:headline>పిడుగులు</cap:headline>
<cap:area><cap:areaDesc>{area}</cap:areaDesc></cap:area>
</cap:info>
</cap:alert>"""


LINK = "https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=111"

VIZAG = AreaFilter(state="Andhra Pradesh", codes=("vsp",),
                   names=("Visakhapatnam", "Gajuwaka", "Bheemunipatnam"))
TELANGANA = AreaFilter(state="Telangana")


# ── RSS ──────────────────────────────────────────────────────

def test_parse_rss_reads_office_and_skips_bad_guids():
    items = parse_rss(RSS)

    assert [i.guid for i in items] == ["111", "222"]
    assert items[0].office == "Andhra Pradesh SDMA"
    assert items[0].link == LINK
    assert items[0].published == datetime.datetime(
        2026, 10, 5, 1, 41, 7, tzinfo=datetime.timezone.utc)


def test_parse_rss_returns_empty_for_garbage():
    assert parse_rss("<html>maintenance</html>") == []
    assert parse_rss("not xml at all <") == []


# ── CAP ──────────────────────────────────────────────────────

def test_parse_cap_prefers_english_block():
    alert = parse_cap(cap_xml(), LINK)

    assert alert.identifier == "IN-111_8"
    assert alert.sender == "Andhra-Pradesh-SDMA"
    assert alert.event == "Lightning"
    assert alert.headline.startswith("Lightning is Likely")
    assert alert.area == "vsp-gajuwaka, ankp-anakapalli mandals"
    assert alert.instruction == "Please follow SDMA guidelines."
    assert alert.expires == datetime.datetime(2026, 10, 5, 8, 10, tzinfo=IST)
    assert alert.link == LINK


def test_parse_cap_falls_back_to_first_block_without_english():
    alert = parse_cap(cap_xml(english=False), LINK)

    assert alert.headline == "పిడుగులు"


def test_parse_cap_skips_cancellations_tests_and_garbage():
    assert parse_cap(cap_xml(msg_type="Cancel"), LINK) is None
    assert parse_cap(cap_xml(status="Exercise"), LINK) is None
    assert parse_cap("<html>error</html>", LINK) is None
    assert parse_cap("<<<", LINK) is None


# ── Mapping ──────────────────────────────────────────────────

def test_site_severity_maps_cap_scale():
    assert site_severity("Extreme") == "critical"
    assert site_severity("Severe") == "high"
    assert site_severity("Moderate") == "medium"
    assert site_severity("Minor") == "low"
    assert site_severity("Unknown") == "low"
    assert site_severity(None) == "low"


def test_alert_kind_uses_existing_site_types():
    assert alert_kind("Flood") == "flood"
    assert alert_kind("Lightning") == "weather"
    assert alert_kind("Cyclone") == "weather"
    assert alert_kind("Heat Wave") == "weather"
    assert alert_kind("Landslide") == "natural_disaster"
    assert alert_kind("Earthquake") == "natural_disaster"
    assert alert_kind("Forest Fire") == "emergency"
    assert alert_kind(None) == "natural_disaster"


# ── Area matching ────────────────────────────────────────────

def test_area_filter_matches_district_code_prefix():
    assert VIZAG.matches(parse_cap(cap_xml(), LINK))
    other = parse_cap(cap_xml(area="elr-kaikalur, wgd-akividu mandals"), LINK)
    assert not VIZAG.matches(other)


def test_area_filter_matches_names_as_whole_words():
    named = parse_cap(cap_xml(area="Visakhapatnam district"), LINK)
    assert VIZAG.matches(named)
    # "vsp" inside another word is not a district code
    assert not VIZAG.matches(parse_cap(cap_xml(area="avspur mandal"), LINK))


def test_area_filter_requires_state():
    # Same place name, other state's sender and no state in the text
    elsewhere = parse_cap(cap_xml(sender="Tamil-Nadu-SDMA",
                                  area="Visakhapatnam Road"), LINK)
    assert not VIZAG.matches(elsewhere)


def test_state_only_filter_matches_sender_or_area():
    by_sender = parse_cap(cap_xml(sender="Telangana-SDMA", area="Nirmal"), LINK)
    by_area = parse_cap(cap_xml(sender="IMD-Hyderabad",
                                area="Adilabad, Nirmal districts of Telangana"), LINK)
    elsewhere = parse_cap(cap_xml(), LINK)

    assert TELANGANA.matches(by_sender)
    assert TELANGANA.matches(by_area)
    assert not TELANGANA.matches(elsewhere)


# ── fetch_alerts ─────────────────────────────────────────────

def _fake_get(pages):
    calls = []

    def get(url):
        calls.append(url)
        return pages[url]
    return get, calls


def test_fetch_alerts_reads_only_hinted_offices_and_drops_expired():
    get, calls = _fake_get({
        SACHET_RSS_URL: RSS,
        LINK: cap_xml(),
    })

    alerts = fetch_alerts(VIZAG, offices=("Andhra Pradesh",), now=NOW, get=get)

    assert [a.identifier for a in alerts] == ["IN-111_8"]
    assert calls == [SACHET_RSS_URL, LINK]  # IMD Kolkata's CAP never fetched

    later = NOW + datetime.timedelta(hours=1)
    assert fetch_alerts(VIZAG, offices=("Andhra Pradesh",), now=later, get=get) == []


def test_fetch_alerts_survives_failed_cap_fetch():
    def get(url):
        if url == SACHET_RSS_URL:
            return RSS
        raise OSError("timeout")

    assert fetch_alerts(VIZAG, offices=("Andhra Pradesh",), now=NOW, get=get) == []


def test_fetch_alerts_skips_known_identifiers():
    get, calls = _fake_get({SACHET_RSS_URL: RSS, LINK: cap_xml()})

    alerts = fetch_alerts(VIZAG, offices=("Andhra Pradesh",), now=NOW, get=get,
                          skip_guids={"111"})

    assert alerts == []
    assert calls == [SACHET_RSS_URL]
