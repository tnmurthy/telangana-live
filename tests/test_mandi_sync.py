"""mandi_sync: Agmarknet mandi prices and MSPs (TL-49).

Fixtures copy the shape of real api.agmarknet.gov.in responses (Oct 2026).
"""
import datetime
import json
import os
import sys

import pytest
import requests

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", "scripts"))
import mandi_sync  # noqa: E402

BASKET_PAYLOAD = {
    "status": "success",
    "data": {"records": [
        {"cmdt_id": 65, "state_id": 32, "cmdt_name": "Tomato", "cmdt_grp_name": "Vegetables", "as_on": "2157.01", "one_yr_ago": "1331.64"},
        {"cmdt_id": 65, "state_id": 12, "cmdt_name": "Tomato", "cmdt_grp_name": "Vegetables", "as_on": "2284.18", "one_yr_ago": "2240.53"},
        {"cmdt_id": 23, "state_id": 32, "cmdt_name": "Onion", "cmdt_grp_name": "Vegetables", "as_on": "3455.40", "one_yr_ago": None},
        {"cmdt_id": 24, "state_id": 32, "cmdt_name": "Potato", "cmdt_grp_name": "Vegetables", "as_on": "13.27", "one_yr_ago": "1705.27"},
        {"cmdt_id": 999, "state_id": 32, "cmdt_name": "Not in basket", "as_on": "5000"},
    ]},
}

MSP_PAYLOAD = {
    "status": "success",
    "data": {
        "columns": [{"key": "commodity_info", "columns": [
            {"key": "cmdt_name", "title": "Commodity"},
            {"key": "msp_price", "title": "MSP (Rs./Quintal) 2026-27"},
        ]}],
        "records": [
            {"cmdt_name": "Paddy(Common)", "cmdt_grp_name": "Cereals", "msp_price": "2441.00", "as_on_price": "2523.32", "as_on_arrival": "1313.47", "reported_date": "07-10-2026"},
            {"cmdt_name": "Jowar(Sorghum)", "cmdt_grp_name": "Cereals", "msp_price": "4023.00", "as_on_price": "2970.40", "as_on_arrival": "1.00", "reported_date": "07-10-2026"},
        ],
    },
}

TODAY = datetime.date(2026, 10, 8)


def test_basket_keeps_this_state_and_basket_only():
    rows = mandi_sync.parse_basket(BASKET_PAYLOAD)
    assert [r["name"] for r in rows] == ["Onion", "Tomato"]
    tomato = rows[1]
    assert tomato == {"name": "Tomato", "group": "Vegetables", "price": 2157.01, "yearAgo": 1331.64, "unit": "Rs./quintal"}


def test_basket_drops_prices_outside_a_sane_range():
    # 13.27 per quintal is an entry error (per-kg typed into a per-quintal field).
    assert "Potato" not in [r["name"] for r in mandi_sync.parse_basket(BASKET_PAYLOAD)]


def test_msp_price_is_quoted_only_with_enough_arrivals():
    rows = {r["name"]: r for r in mandi_sync.parse_msp(MSP_PAYLOAD)}
    assert rows["Paddy(Common)"]["price"] == 2523.32
    assert rows["Jowar(Sorghum)"]["price"] is None
    assert rows["Jowar(Sorghum)"]["msp"] == 4023.0
    assert rows["Jowar(Sorghum)"]["arrivalTonnes"] == 1.0


def test_msp_season_comes_from_the_column_title():
    assert mandi_sync.msp_season(MSP_PAYLOAD) == "2026-27"


def test_snapshot_shape():
    snap = mandi_sync.build_snapshot(BASKET_PAYLOAD, MSP_PAYLOAD, TODAY, "2026-10-08T13:30:00Z")
    assert snap["state"] == "Telangana"
    assert snap["fromDate"] == "2026-10-06" and snap["toDate"] == "2026-10-08"
    assert snap["sourceUrl"] == "https://agmarknet.gov.in/"
    assert snap["mspSeason"] == "2026-27"
    assert len(snap["basket"]) == 2 and len(snap["msp"]) == 2


@pytest.mark.parametrize("payload", [None, [], {"status": False, "message": "No data available.", "data": []}, {"status": "success"}])
def test_nothing_usable_means_no_snapshot(payload):
    assert mandi_sync.build_snapshot(payload, payload, TODAY, "x") is None


def test_failed_fetch_leaves_the_previous_file(tmp_path, monkeypatch):
    out = tmp_path / "mandiPrices.json"
    out.write_text('{"previous": true}', encoding="utf-8")
    monkeypatch.setattr(mandi_sync, "OUT_PATH", str(out))

    def boom(_today):
        raise requests.ConnectionError("unreachable")

    monkeypatch.setattr(mandi_sync, "fetch", boom)
    assert mandi_sync.main() == 0
    assert json.loads(out.read_text(encoding="utf-8")) == {"previous": True}


def test_successful_fetch_writes_the_snapshot(tmp_path, monkeypatch):
    out = tmp_path / "mandiPrices.json"
    monkeypatch.setattr(mandi_sync, "OUT_PATH", str(out))
    monkeypatch.setattr(mandi_sync, "fetch", lambda _today: (BASKET_PAYLOAD, MSP_PAYLOAD))
    assert mandi_sync.main() == 0
    data = json.loads(out.read_text(encoding="utf-8"))
    assert [r["name"] for r in data["basket"]] == ["Onion", "Tomato"]
