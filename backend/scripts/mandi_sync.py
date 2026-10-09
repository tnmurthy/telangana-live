"""
mandi_sync.py: daily wholesale (mandi) prices and MSPs for Telangana from
Agmarknet, written to frontend/src/data/mandiPrices.json.

Source: api.agmarknet.gov.in, the public API behind the Agmarknet 2.0 website
(Directorate of Marketing & Inspection, Ministry of Agriculture). It needs no
key. The data.gov.in API for the same dataset is unavailable and the CEDA
mirror the site used returns 404 (TL-49).

Two requests per run:
  * statewise_price_arrival_sp: the arrival-weighted average price of each
    basket commodity over the last few days, and the same figure a year ago.
  * marketwise_price_arrival: MSP commodities with the latest reported price,
    the official MSP and the day's arrivals in tonnes.

Rules (docs/DATA_STANDARDS.md, rule 1): nothing is invented. A price outside
a sane range is dropped. An MSP crop's price is quoted only when the day's
arrivals reach MIN_ARRIVAL_TONNES, because a handful of sales swings the
average (Jowar went 2,250 -> 7,960 -> 2,970 on ~1 t). When a request fails,
the previous file is left as it is; the page shows its date.

  python backend/scripts/mandi_sync.py
"""
from __future__ import annotations

import datetime
import json
import os
import sys
from typing import Any

import requests

API = "https://api.agmarknet.gov.in/v1/dashboard-data/"
SOURCE = "Agmarknet, Directorate of Marketing & Inspection, Ministry of Agriculture"
SOURCE_URL = "https://agmarknet.gov.in/"
HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "telangana.live mandi sync (+https://www.telangana.live/sources)",
    "Origin": "https://agmarknet.gov.in",
    "Referer": "https://agmarknet.gov.in/",
}
TIMEOUT = 60

STATE_ID = 32  # Telangana
STATE_NAME = "Telangana"
WINDOW_DAYS = 3
MIN_ARRIVAL_TONNES = 5.0
MIN_PRICE, MAX_PRICE = 100.0, 200_000.0  # Rs./quintal; outside this is an entry error

# Agmarknet commodity ids -> the name we show.
BASKET = {
    23: "Onion",
    65: "Tomato",
    24: "Potato",
    3: "Rice",
    1: "Wheat",
    45: "Tur (red gram)",
    6: "Bengal gram",
    9: "Green gram (moong)",
    8: "Black gram (urad)",
    10: "Groundnut",
    113: "Dry chillies",
    35: "Turmeric",
    15: "Cotton",
    2: "Paddy",
    4: "Maize",
}

IST = datetime.timezone(datetime.timedelta(hours=5, minutes=30))
OUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "frontend", "src", "data", "mandiPrices.json",
)


def _num(value: Any) -> float | None:
    try:
        n = float(value)
    except (TypeError, ValueError):
        return None
    return n


def _price(value: Any) -> float | None:
    n = _num(value)
    if n is None or not (MIN_PRICE <= n <= MAX_PRICE):
        return None
    return round(n, 2)


def _records(payload: Any) -> list[dict]:
    if not isinstance(payload, dict) or payload.get("status") != "success":
        return []
    data = payload.get("data")
    records = data.get("records") if isinstance(data, dict) else None
    return records if isinstance(records, list) else []


def parse_basket(payload: Any, state_id: int = STATE_ID) -> list[dict]:
    """Weighted-average prices for the basket, this state only."""
    rows = []
    for r in _records(payload):
        if r.get("state_id") != state_id or r.get("cmdt_id") not in BASKET:
            continue
        price = _price(r.get("as_on"))
        if price is None:
            continue
        year_ago = _price(r.get("one_yr_ago"))
        rows.append({
            "name": BASKET[r["cmdt_id"]],
            "group": r.get("cmdt_grp_name"),
            "price": price,
            "yearAgo": year_ago,
            "unit": "Rs./quintal",
        })
    order = list(BASKET.values())
    return sorted(rows, key=lambda row: order.index(row["name"]))


def parse_msp(payload: Any) -> list[dict]:
    """MSP crops: official MSP, latest price and arrivals."""
    rows = []
    for r in _records(payload):
        msp = _price(r.get("msp_price"))
        if msp is None:
            continue
        arrival = _num(r.get("as_on_arrival"))
        price = _price(r.get("as_on_price"))
        quotable = price is not None and arrival is not None and arrival >= MIN_ARRIVAL_TONNES
        rows.append({
            "name": r.get("cmdt_name"),
            "group": r.get("cmdt_grp_name"),
            "msp": msp,
            "price": price if quotable else None,
            "arrivalTonnes": round(arrival, 2) if arrival is not None else None,
            "reportedDate": r.get("reported_date"),
        })
    return rows


def msp_season(payload: Any) -> str | None:
    """'2026-27' from the column title 'MSP (Rs./Quintal) 2026-27'."""
    if not isinstance(payload, dict):
        return None
    for group in (payload.get("data") or {}).get("columns", []):
        for col in group.get("columns", []) if isinstance(group, dict) else []:
            title = col.get("title", "") if isinstance(col, dict) else ""
            if col.get("key") == "msp_price" and title:
                return title.split()[-1]
    return None


def build_snapshot(basket_payload: Any, msp_payload: Any, today: datetime.date, now_iso: str) -> dict | None:
    basket = parse_basket(basket_payload)
    msp = parse_msp(msp_payload)
    if not basket and not msp:
        return None
    return {
        "updatedAt": now_iso,
        "state": STATE_NAME,
        "fromDate": (today - datetime.timedelta(days=WINDOW_DAYS - 1)).isoformat(),
        "toDate": today.isoformat(),
        "source": SOURCE,
        "sourceUrl": SOURCE_URL,
        "minArrivalTonnes": MIN_ARRIVAL_TONNES,
        "basket": basket,
        "mspSeason": msp_season(msp_payload),
        "msp": msp,
    }


def _post(body: dict) -> Any:
    resp = requests.post(API, json=body, headers=HEADERS, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def fetch(today: datetime.date) -> tuple[Any, Any]:
    start = today - datetime.timedelta(days=WINDOW_DAYS - 1)
    basket = _post({
        "dashboard": "statewise_price_arrival_sp",
        "from_date": start.isoformat(),
        "to_date": today.isoformat(),
        "commodity": list(BASKET),
        "state": str(STATE_ID),
        "limit": 500,
        "page": 1,
        "format": "json",
    })
    msp = _post({
        "dashboard": "marketwise_price_arrival",
        "date": today.isoformat(),
        "group": [100000],
        "commodity": [100001],
        "variety": 100021,
        "state": STATE_ID,
        "district": [100007],
        "market": [100009],
        "market_type": [100004],
        "grades": [100011],
        "page": 1,
        "limit": 100,
        "format": "json",
    })
    return basket, msp


def main() -> int:
    now = datetime.datetime.now(IST)
    try:
        basket, msp = fetch(now.date())
    except (requests.RequestException, ValueError) as exc:
        print(f"mandi_sync: Agmarknet unavailable ({exc}); leaving {OUT_PATH} unchanged")
        return 0
    snapshot = build_snapshot(basket, msp, now.date(), now.astimezone(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"))
    if snapshot is None:
        print("mandi_sync: no usable rows; leaving the previous file unchanged")
        return 0
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"mandi_sync: {len(snapshot['basket'])} basket rows, {len(snapshot['msp'])} MSP rows -> {OUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
