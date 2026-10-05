#!/usr/bin/env python3
"""
calibrate_alert_district.py — threshold calibration for the district judgment
in core.alert_triage (MIN_DISTRICT_CONFIDENCE).

Runs the real TypeSafe question set over headlines labelled with their district
and reports, per threshold, how many districts would be published and how many
of those would be wrong. Two sets:

  LISTED    places named in DISTRICT_CRITERIA (checks the model reads the options)
  UNLISTED  places not named there (checks what happens beyond the list)

A wrong district is worse than none (the alert then shows as "Telangana"), so
pick the lowest threshold with no wrong districts in either set.

This hits the live API and costs tokens. It is not part of the pytest run.

Usage:
    python tools/calibrate_alert_district.py
"""
import os
import sys
from concurrent.futures import ThreadPoolExecutor

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

from core.alert_triage import (  # noqa: E402
    DISTRICT_CRITERIA,
    MIN_DISTRICT_CONFIDENCE,
    STATEWIDE,
    UNCLEAR_DISTRICT,
    _get_client,
    triage_headline,
)

LISTED = [
    ("Power cut across Gachibowli as substation trips", "Rangareddy"),
    ("Waterlogging brings HITEC City traffic to a halt", "Rangareddy"),
    ("NH-44 closed near Shamshabad after lorry overturns", "Rangareddy"),
    ("Flooding in LB Nagar colonies after overnight rain", "Rangareddy"),
    ("HMWSSB suspends water supply in Kukatpally for two days", "Medchal-Malkajgiri"),
    ("Power outage in Uppal and Ramanthapur", "Medchal-Malkajgiri"),
    ("Fire breaks out at ECIL industrial unit", "Medchal-Malkajgiri"),
    ("Traffic diverted on Tank Bund ahead of immersion procession", "Hyderabad"),
    ("Building collapses in Old City, rescue operation under way", "Hyderabad"),
    ("Fire breaks out at Secunderabad commercial complex", "Hyderabad"),
    ("Heavy rain lashes Hyderabad, roads flooded", "Hyderabad"),
    ("Gas leak at Patancheru pharma unit, workers hospitalised", "Sangareddy"),
    ("Godavari crosses danger mark at Bhadrachalam, third warning issued", "Bhadradri Kothagudem"),
    ("Rasta roko in Warangal as farmers protest paddy procurement", "Warangal"),
    ("Kazipet railway underbridge flooded, traffic diverted", "Hanumakonda"),
    ("TGSPDCL announces 6-hour power shutdown in Nizamabad", "Nizamabad"),
    ("Flash floods hit Khammam low-lying areas", "Khammam"),
    ("Road caves in at Ramagundam, traffic diverted", "Peddapalli"),
    ("Water supply disrupted in Siddipet town for 3 days", "Siddipet"),
    ("Bandh in Bhainsa after clashes, shops shut", "Nirmal"),
    ("Medaram jatara: traffic diverted on Mulugu roads", "Mulugu"),
    ("Heavy rain floods Miryalaguda streets", "Nalgonda"),
    ("Kaleshwaram barrage gates lifted, flood alert downstream", "Jayashankar Bhupalpally"),
    ("Power cut in Tandur as transformer fails", "Vikarabad"),
    ("RTC bandh call hits bus services across Telangana", STATEWIDE),
    ("IMD issues orange alert for heavy rainfall across Telangana", STATEWIDE),
    ("Power outage in several areas, says discom", UNCLEAR_DISTRICT),
    ("Road blocked after tree falls", UNCLEAR_DISTRICT),
]

UNLISTED = [
    ("Power cut in Miyapur and Chandanagar for maintenance", "Rangareddy"),
    ("Manikonda colonies inundated after heavy downpour", "Rangareddy"),
    ("Water supply suspended in Attapur and Kismatpur", "Rangareddy"),
    ("Traffic diverted at Kokapet as road widening begins", "Rangareddy"),
    ("Nizampet lake overflows, colonies flooded", "Medchal-Malkajgiri"),
    ("Fire at Jeedimetla chemical factory", "Medchal-Malkajgiri"),
    ("Power outage in Boduppal and Peerzadiguda", "Medchal-Malkajgiri"),
    ("Waterlogging at Koti and Abids slows traffic", "Hyderabad"),
    ("Nampally road closed for metro work", "Hyderabad"),
    ("Fire in Moosarambagh godown", "Hyderabad"),
    ("Water supply hit in Khairatabad and Lakdikapul", "Hyderabad"),
    ("Heavy rain floods Kodangal town", "Vikarabad"),
    ("Road washed away near Devarakadra", "Mahabubnagar"),
    ("Flash flood in Eturnagaram forest area, villages cut off", "Mulugu"),
    ("Godavari floods Manuguru low-lying areas", "Bhadradri Kothagudem"),
    ("Bandh observed in Kagaznagar over mill closure", "Kumuram Bheem Asifabad"),
    ("Power shutdown in Huzurnagar for line maintenance", "Suryapet"),
    ("Water shortage hits Gajwel colonies", "Siddipet"),
    ("Heavy rain in Hanamkonda and Subedari, roads submerged", "Hanumakonda"),
    ("Accident on Vijayawada highway near Choutuppal, traffic jam", "Yadadri Bhuvanagiri"),
    ("Kerala floods: relief camps opened in Kochi", UNCLEAR_DISTRICT),
]

THRESHOLDS = (0.4, 0.5, 0.6, 0.7, 0.8, 0.9)


def _judge(cases):
    with ThreadPoolExecutor(6) as pool:
        verdicts = list(pool.map(lambda case: triage_headline(case[0], ""), cases))
    return [(headline, want, v.chosen_district, v.district_confidence)
            for (headline, want), v in zip(cases, verdicts)]


def _report(name, rows):
    print(f"\n{name}")
    for headline, want, got, confidence in rows:
        mark = "ok" if got == want else "XX"
        print(f"  {mark} {confidence:.2f} {got!s:<24} want {want:<24} {headline[:60]}")
    for threshold in THRESHOLDS:
        # Only a real district is published; statewide/unclear publish nothing.
        published = [r for r in rows if r[3] >= threshold and r[2] in DISTRICT_CRITERIA]
        wrong = [r for r in published if r[2] != r[1]]
        flag = "  <- current" if threshold == MIN_DISTRICT_CONFIDENCE else ""
        print(f"  threshold {threshold:.1f}: {len(published)} districts published, "
              f"{len(wrong)} wrong{flag}")


def main():
    if _get_client() is None:
        sys.exit("TYPESAFE_API_KEY is not set or typesafe_sdk is missing.")
    _report("LISTED (places named in the options)", _judge(LISTED))
    _report("UNLISTED (places not named in the options)", _judge(UNLISTED))


if __name__ == "__main__":
    main()
