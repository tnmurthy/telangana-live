"""
Print every Tech & AI Pulse verdict with its raw signals, so the thresholds in
backend/scripts/tech_pulse.py can be checked against real headlines.

Live: reads Google News and calls TypeSafe (TYPESAFE_API_KEY from .env).
Writes nothing.

  python tools/calibrate_tech_pulse.py --region telangana
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                                "backend", "scripts"))
import tech_pulse as tp  # noqa: E402


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--region", required=True, choices=sorted(tp.REGIONS))
    args = parser.parse_args()

    rows = []

    def recording_judge(headline, query_category):
        verdict = tp.judge_headline(headline, query_category, args.region)
        rows.append((verdict, query_category, headline))
        return verdict

    feed = tp.build_feed(args.region, judge=recording_judge)
    for v, query_category, headline in rows:
        conf = f"{v.confidence:.2f}" if v.confidence is not None else "  - "
        reg = f"{v.region_probability:.2f}" if v.region_probability is not None else "  - "
        outcome = v.category if v.accepted else f"x {v.rejection_reason}"
        print(f"{v.method[:2]} conf={conf} region={reg} q={query_category:6} {outcome:16} {headline[:90]}")
    print({c: len(items) for c, items in feed["categories"].items()})


if __name__ == "__main__":
    main()
