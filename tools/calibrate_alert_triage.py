#!/usr/bin/env python3
"""
calibrate_alert_triage.py — threshold calibration for core.alert_triage.

Runs the real TypeSafe question set over a labelled corpus of Telangana civic
headlines and reports, per threshold, how many labelled positives and negatives
each cut-off would admit. Use it to pick MIN_TYPE_CONFIDENCE,
MIN_TELANGANA_PROBABILITY and MIN_CURRENT_PROBABILITY on real data rather than
on the placeholder values currently in alert_triage.py.

This hits the live API and costs tokens. It is not part of the pytest run.

Usage:
    export TYPESAFE_API_KEY=...
    python tools/calibrate_alert_triage.py
    python tools/calibrate_alert_triage.py --live   # pull today's real RSS too
"""
import argparse
import os
import sys

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

from core.alert_triage import (  # noqa: E402
    MIN_CURRENT_PROBABILITY,
    MIN_TELANGANA_PROBABILITY,
    MIN_TYPE_CONFIDENCE,
    NO_ALERT,
    severity_for_score,
    triage_headline,
)

# (headline, should_be_accepted, expected_type)
# Positives are unambiguous local disruptions. Negatives are the cases the old
# regex stack admitted wrongly: out-of-state events, funding announcements,
# anniversaries, sports uses of "strike", and approved-but-unbuilt projects.
CORPUS = [
    ("Flash floods submerge low-lying areas of Hyderabad", True, "flood"),
    ("Heavy waterlogging brings Begumpet traffic to a halt", True, "flood"),
    ("TGSPDCL announces 6-hour power shutdown in Nizamabad", True, "power_outage"),
    ("Power cut across Kukatpally as transformer fails", True, "power_outage"),
    ("HMWSSB suspends water supply in Kukatpally for two days", True, "water_supply"),
    ("Rasta roko in Warangal as farmers protest paddy procurement", True, "strike"),
    ("RTC bandh call hits bus services across Telangana", True, "strike"),
    ("Traffic diverted on Tank Bund ahead of immersion procession", True, "road_closure"),
    ("NH-44 closed near Shamshabad after lorry overturns", True, "road_closure"),
    ("IMD issues orange alert for heavy rainfall across Telangana", True, "weather"),
    ("Fire breaks out at Secunderabad commercial complex", True, "emergency"),
    ("Building collapses in Old City, rescue operation under way", True, "emergency"),
    # Negatives
    ("Kerala floods: Telangana sends relief material", False, None),
    ("Mumbai rains disrupt local trains, say Hyderabad travellers", False, None),
    ("Telangana govt sanctions Rs 500 crore for flood-prevention works", False, None),
    ("Remembering the 2020 Hyderabad floods, five years on", False, None),
    ("Hyderabad FC strike twice in second half to win", False, None),
    ("Assembly debates power tariff hike proposal", False, None),
    ("New flyover to be built at Uppal, says minister", False, None),
    ("GHMC completes monsoon preparedness review", False, None),
    ("Water conservation drive launched in Siddipet schools", False, None),
    ("Cricket: lightning strike delays Telangana Ranji match", False, None),
]

THRESHOLD_GRID = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9]


def _fetch_live_headlines(limit=30):
    """Pull today's real alert-query RSS so calibration sees live phrasing."""
    import feedparser
    import requests

    from scripts.data_engine import ALERT_TOPIC_QUERIES

    seen, out = set(), []
    for query in ALERT_TOPIC_QUERIES:
        url = (f"https://news.google.com/rss/search?q={requests.utils.quote(query)}"
               "&hl=en-IN&gl=IN&ceid=IN:en")
        for entry in feedparser.parse(url).entries[:10]:
            title = entry.get("title", "").strip()
            if title and title not in seen:
                seen.add(title)
                out.append(title)
            if len(out) >= limit:
                return out
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--live", action="store_true",
                        help="also triage today's unlabelled RSS headlines")
    args = parser.parse_args()

    if not os.getenv("TYPESAFE_API_KEY"):
        print("TYPESAFE_API_KEY is not set — triage would fall back to regex "
              "and calibration would be meaningless. Aborting.")
        return 1

    print(f"Triaging {len(CORPUS)} labelled headlines...\n")
    rows = []
    for headline, expected_accept, expected_type in CORPUS:
        v = triage_headline(headline, "")
        if v.source != "typesafe":
            print(f"  ! fell back to regex on {headline!r} — check API key/service")
            continue
        rows.append((headline, expected_accept, expected_type, v))

    # Per-headline detail
    print(f"{'ok':<4}{'type':<17}{'conf':>6}{'TG':>6}{'now':>6}{'sev':>10}  headline")
    print("-" * 110)
    for headline, expected_accept, expected_type, v in rows:
        type_ok = (v.alert_type == expected_type) if expected_accept else (v.accepted is False)
        mark = "ok" if (v.accepted == expected_accept and type_ok) else "XX"
        shown_type = v.chosen_type or NO_ALERT
        sev = severity_for_score(v.severity_score) if v.severity_score is not None else "-"
        print(f"{mark:<4}{shown_type:<17}{v.type_confidence:>6.2f}"
              f"{v.telangana_probability:>6.2f}{v.current_probability:>6.2f}"
              f"{sev:>10}  {headline[:52]}")

    # Threshold sweep — one axis at a time, others held at their current value
    print("\nThreshold sweep (positives kept / negatives admitted):")
    axes = [
        ("MIN_TYPE_CONFIDENCE", lambda v: v.type_confidence, MIN_TYPE_CONFIDENCE),
        ("MIN_TELANGANA_PROBABILITY", lambda v: v.telangana_probability, MIN_TELANGANA_PROBABILITY),
        ("MIN_CURRENT_PROBABILITY", lambda v: v.current_probability, MIN_CURRENT_PROBABILITY),
    ]
    positives = [r for r in rows if r[1]]
    negatives = [r for r in rows if not r[1]]

    for name, signal, current in axes:
        print(f"\n  {name} (currently {current}):")
        for t in THRESHOLD_GRID:
            kept = sum(1 for _, _, _, v in positives
                       if v.chosen_type != NO_ALERT and signal(v) >= t)
            admitted = sum(1 for _, _, _, v in negatives
                           if v.chosen_type != NO_ALERT and signal(v) >= t)
            flag = "  <- current" if abs(t - current) < 1e-9 else ""
            print(f"    {t:.1f}   {kept:>2}/{len(positives)} kept   "
                  f"{admitted:>2}/{len(negatives)} admitted{flag}")

    if args.live:
        print("\nToday's live RSS headlines:")
        for headline in _fetch_live_headlines():
            v = triage_headline(headline, "")
            status = f"{v.alert_type}/{v.severity}" if v.accepted else f"rejected:{v.rejection_reason}"
            print(f"  {status:<28} {headline[:70]}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
