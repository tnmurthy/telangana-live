"""
emergency_alerts.py — entry point for the civic alerts feed.

Kept as a thin shim because two callers depend on it:
  * .github/workflows/emergency_alerts_sync.yml runs it as a script
  * backend/api/civic_gateway.py imports fetch_latest_alerts()

The work itself lives in scripts/data_engine.sync_alerts(): Google News RSS
queries for civic disruptions, each headline judged by core.alert_triage
(TypeSafe), written in the single schema from core.alert_feed.

Removed from this module, deliberately:
  * _try_ai_alerts() asked an LLM to "summarize current civic alerts" with no
    source documents, so every alert it produced was invented — including
    specific outages ("Power restoration in progress for Jubilee Hills Road
    No. 36") stamped with a hardcoded "15 mins ago".
  * _extract_alerts_from_news() keyword-matched the general news feed, which
    turned business stories into utility alerts ("IndianOil brings packaged
    water to the pump" became a water alert).
  * The curated-helpline tier, which surfaced static helpline numbers as
    "breaking" alerts. Helplines belong on the emergency contacts page; an
    empty feed is the honest answer when nothing is disrupted.
"""
import json
import os
import sys

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(_SCRIPTS_DIR))  # backend/
sys.path.insert(0, _SCRIPTS_DIR)

PUBLIC_ALERTS_PATH = os.path.join(
    _SCRIPTS_DIR, "..", "..", "frontend", "public", "data", "alerts.json")


def fetch_latest_alerts() -> list:
    """Return the published alerts feed.

    Reads the file rather than regenerating it: civic_gateway calls this on
    every API request, and regenerating would mean a round of RSS fetches and
    TypeSafe calls per page view.
    """
    try:
        with open(PUBLIC_ALERTS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, ValueError):
        return []
    return data if isinstance(data, list) else []


def main() -> None:
    from data_engine import sync_alerts

    alerts = sync_alerts()
    print(f"Alerts feed now holds {len(alerts)} active alert(s).")


if __name__ == "__main__":
    main()
