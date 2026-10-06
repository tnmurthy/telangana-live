"""weather_scraper: no generated weather, no fixed AQI (docs/DATA_STANDARDS.md)."""
import importlib.util
import inspect
import os
from unittest.mock import MagicMock, patch

_PATH = os.path.join(os.path.dirname(__file__), "..", "backend", "scripts", "weather_scraper.py")
_spec = importlib.util.spec_from_file_location("weather_scraper", _PATH)
ws = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ws)


def test_indian_aqi_uses_cpcb_breakpoints():
    assert ws.indian_aqi(38.1, 50) == 63
    assert ws.indian_aqi(10, 180) == 153
    assert ws.indian_aqi(None, None) is None


def test_no_generated_weather_or_fixed_aqi():
    source = inspect.getsource(ws)
    assert not hasattr(ws, "generate_mock_weather_data")
    assert "aqi = 75" not in source and "aqi = 80" not in source


def _response(payload):
    resp = MagicMock(status_code=200)
    resp.json.return_value = payload
    resp.raise_for_status.return_value = None
    return resp


def test_incomplete_open_meteo_reading_is_skipped_not_filled():
    with patch.object(ws, "DISTRICT_COORDS", {"Hyderabad": (17.385, 78.4867)}), \
         patch.object(ws.requests, "get", return_value=_response({"current": {"temperature_2m": 30}})), \
         patch.object(ws.time, "sleep"):
        assert ws.fetch_weather_open_meteo() == {}


def test_air_quality_needs_most_of_a_day_of_readings():
    ws._aq_cache.clear()
    few = {"hourly": {"pm2_5": [40.0] * 5, "pm10": [60.0] * 5}}
    with patch.object(ws.requests, "get", return_value=_response(few)):
        assert ws.fetch_air_quality(1.0, 2.0)["aqi"] is None
    ws._aq_cache.clear()
    day = {"hourly": {"pm2_5": [38.0] * 24, "pm10": [50.0] * 24}}
    with patch.object(ws.requests, "get", return_value=_response(day)):
        fields = ws.fetch_air_quality(1.0, 2.0)
    assert fields["aqi"] == 63 and fields["aqiLabel"] == "Satisfactory" and fields["aqiSource"]
