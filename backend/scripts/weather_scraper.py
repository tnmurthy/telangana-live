"""Weather scraper for Telangana districts with multi-tier fallbacks.

Tiers:
  1. OpenWeatherMap API (if OWM_API_KEY is present)
  2. Open-Meteo API (Free, high-accuracy, keyless, global coverage)
  3. Existing weatherData.js cache fallback
  4. Seasonal district baseline fallback

Fetches current weather for all 33 Telangana districts and writes
src/data/weatherData.js compatible with the existing frontend schema.
"""

import json
import os
import re
import time
from datetime import UTC, datetime

_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.dirname(os.path.dirname(_SCRIPTS_DIR))
OUTPUT_FILE = os.path.join(_REPO_ROOT, "frontend", "src", "data", "weatherData.js")

try:
    import requests
except ImportError:
    print("WARNING: requests not installed. Run: pip install requests")
    requests = None

# ---------------------------------------------------------------------------
# District -> OWM query string mapping
# ---------------------------------------------------------------------------
DISTRICT_OWM_MAP = {
    "Adilabad":                   "Adilabad,IN",
    "Bhadradri Kothagudem":       "Kothagudem,IN",
    "Hyderabad":                  "Hyderabad,IN",
    "Jagtial":                    "Jagtial,IN",
    "Jangaon":                    "Jangaon,IN",
    "Jayashankar Bhupalpally":    "Bhupalpally,IN",
    "Jogulamba Gadwal":           "Gadwal,IN",
    "Kamareddy":                  "Kamareddy,IN",
    "Karimnagar":                 "Karimnagar,IN",
    "Khammam":                    "Khammam,IN",
    "Kumuram Bheem Asifabad":     "Asifabad,IN",
    "Mahabubabad":                "Mahabubabad,IN",
    "Mahbubnagar":                "Mahbubnagar,IN",
    "Mancherial":                 "Mancherial,IN",
    "Medak":                      "Medak,IN",
    "Medchal-Malkajgiri":         "Medchal,IN",
    "Mulugu":                     "Mulugu,IN",
    "Nagarkurnool":               "Nagarkurnool,IN",
    "Nalgonda":                   "Nalgonda,IN",
    "Narayanpet":                 "Narayanpet,IN",
    "Nirmal":                     "Nirmal,IN",
    "Nizamabad":                  "Nizamabad,IN",
    "Peddapalli":                 "Peddapalli,IN",
    "Rajanna Sircilla":           "Sircilla,IN",
    "Rangareddy":                 "Hyderabad,IN",
    "Sangareddy":                 "Sangareddy,IN",
    "Siddipet":                   "Siddipet,IN",
    "Suryapet":                   "Suryapet,IN",
    "Vikarabad":                  "Vikarabad,IN",
    "Wanaparthy":                 "Wanaparthy,IN",
    "Warangal (Rural)":           "Warangal,IN",
    "Warangal (Urban)":           "Warangal,IN",
    "Yadadri Bhuvanagiri":        "Bhongir,IN",
}

# ---------------------------------------------------------------------------
# District -> Geographic Coordinates (for Open-Meteo fallback)
# ---------------------------------------------------------------------------
DISTRICT_COORDS = {
    "Adilabad": (19.6641, 78.5320),
    "Bhadradri Kothagudem": (17.5500, 80.6167),
    "Hyderabad": (17.3850, 78.4867),
    "Jagtial": (18.7967, 78.9167),
    "Jangaon": (17.7214, 79.1558),
    "Jayashankar Bhupalpally": (18.4312, 79.8667),
    "Jogulamba Gadwal": (16.2333, 77.8000),
    "Kamareddy": (18.3167, 78.3333),
    "Karimnagar": (18.4386, 79.1288),
    "Khammam": (17.2473, 80.1514),
    "Kumuram Bheem Asifabad": (19.3583, 79.2883),
    "Mahabubabad": (17.5983, 80.0033),
    "Mahbubnagar": (16.7488, 77.9856),
    "Mancherial": (18.8679, 79.4639),
    "Medak": (18.0461, 78.2611),
    "Medchal-Malkajgiri": (17.6297, 78.4814),
    "Mulugu": (18.1925, 79.9431),
    "Nagarkurnool": (16.4842, 78.3333),
    "Nalgonda": (17.0575, 79.2689),
    "Narayanpet": (16.7333, 77.5000),
    "Nirmal": (19.0964, 78.3431),
    "Nizamabad": (18.6725, 78.0941),
    "Peddapalli": (18.6167, 79.3833),
    "Rajanna Sircilla": (18.3847, 78.8042),
    "Rangareddy": (17.3100, 78.5400),
    "Sangareddy": (17.6194, 78.0814),
    "Siddipet": (18.1018, 78.8520),
    "Suryapet": (17.1439, 79.6236),
    "Vikarabad": (17.3364, 77.9048),
    "Wanaparthy": (16.3622, 78.0628),
    "Warangal (Rural)": (17.9689, 79.5941),
    "Warangal (Urban)": (17.9784, 79.6000),
    "Yadadri Bhuvanagiri": (17.5108, 78.8872),
}

# Condition-string mapping from OWM codes to the labels used by the frontend
def _owm_condition(owm_main: str, owm_desc: str) -> str:
    m = owm_main.lower()
    if m in ("thunderstorm",):
        return "Thunderstorm"
    if m in ("drizzle", "rain"):
        return "Light Rain"
    if m in ("snow",):
        return "Cloudy"
    if m in ("mist", "smoke", "haze", "dust", "fog", "sand", "ash", "squall", "tornado"):
        return "Haze"
    if m == "clouds":
        d = owm_desc.lower()
        return "Partly Cloudy" if "few" in d or "scattered" in d else "Cloudy"
    return "Sunny"


def _wmo_condition(wmo_code: int) -> str:
    """Map WMO Weather interpretation codes (WW) to frontend condition labels."""
    if wmo_code == 0:
        return "Clear"
    if wmo_code in (1, 2):
        return "Sunny" if wmo_code == 1 else "Partly Cloudy"
    if wmo_code == 3:
        return "Cloudy"
    if wmo_code in (45, 48):
        return "Haze"
    if wmo_code in (51, 53, 55, 56, 57):
        return "Light Rain"
    if wmo_code in (61, 63, 65, 80, 81, 82):
        return "Rain"
    if wmo_code in (95, 96, 99):
        return "Thunderstorm"
    return "Partly Cloudy"


def _aqi_label_and_color(aqi_value: int):
    """Map numeric AQI to label/color matching the frontend schema."""
    if aqi_value <= 50:
        return "Good", "#22C55E"
    if aqi_value <= 100:
        return "Satisfactory", "#84CC16"
    if aqi_value <= 200:
        return "Moderate", "#EAB308"
    if aqi_value <= 300:
        return "Poor", "#F97316"
    if aqi_value <= 400:
        return "Very Poor", "#EF4444"
    return "Severe", "#991B1B"


# CPCB National AQI breakpoints (24-hour average, µg/m³) -> index ranges.
_CPCB_BREAKPOINTS = {
    "pm2_5": [(0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200),
              (91, 120, 201, 300), (121, 250, 301, 400), (251, 500, 401, 500)],
    "pm10": [(0, 50, 0, 50), (51, 100, 51, 100), (101, 250, 101, 200),
             (251, 350, 201, 300), (351, 430, 301, 400), (431, 600, 401, 500)],
}
AQI_SOURCE = "Indian AQI (CPCB method) from 24-hour PM2.5 and PM10, Open-Meteo air-quality model"


def _sub_index(pollutant: str, conc: float) -> int:
    conc = round(conc)
    for c_lo, c_hi, i_lo, i_hi in _CPCB_BREAKPOINTS[pollutant]:
        if conc <= c_hi:
            return round(i_lo + (i_hi - i_lo) * (max(conc, c_lo) - c_lo) / (c_hi - c_lo))
    return 500


def indian_aqi(pm25: float | None, pm10: float | None) -> int | None:
    """CPCB AQI: the worst sub-index of the pollutants we have readings for."""
    subs = [_sub_index(name, value) for name, value in (("pm2_5", pm25), ("pm10", pm10)) if value is not None]
    return max(subs) if subs else None


_aq_cache: dict[tuple, dict] = {}


def fetch_air_quality(lat: float, lon: float) -> dict:
    """AQI fields for a place, or aqi None when no reading is available."""
    key = (round(lat, 2), round(lon, 2))
    if key in _aq_cache:
        return _aq_cache[key]
    fields = {"aqi": None, "aqiLabel": None, "aqiColor": None, "aqiSource": None}
    try:
        resp = requests.get(
            "https://air-quality-api.open-meteo.com/v1/air-quality",
            params={"latitude": lat, "longitude": lon, "hourly": "pm10,pm2_5",
                    "past_hours": 24, "forecast_hours": 0, "timezone": "Asia/Kolkata"},
            timeout=10,
        )
        resp.raise_for_status()
        hourly = resp.json().get("hourly", {})

        def mean(name):
            vals = [v for v in hourly.get(name, []) if v is not None]
            return sum(vals) / len(vals) if len(vals) >= 16 else None  # need most of the day

        aqi = indian_aqi(mean("pm2_5"), mean("pm10"))
        if aqi is not None:
            label, color = _aqi_label_and_color(aqi)
            fields = {"aqi": aqi, "aqiLabel": label, "aqiColor": color, "aqiSource": AQI_SOURCE}
    except Exception as exc:
        print(f"  [AQI] {key}: {exc}")
    _aq_cache[key] = fields
    return fields


def _now_iso() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def fetch_weather_owm(api_key: str) -> dict:
    """Fetch current weather for all districts using OpenWeatherMap API."""
    base_url = "https://api.openweathermap.org/data/2.5/weather"
    weather_data = {}
    weather_cache_by_query: dict[str, dict] = {}

    for district, query in DISTRICT_OWM_MAP.items():
        if query in weather_cache_by_query:
            weather_data[district] = weather_cache_by_query[query].copy()
            continue

        try:
            resp = requests.get(
                base_url,
                params={"q": query, "appid": api_key, "units": "metric"},
                timeout=10,
            )
            if resp.status_code == 200:
                d = resp.json()
                temp = round(d["main"]["temp"])
                feels_like = round(d["main"]["feels_like"])
                humidity = d["main"]["humidity"]
                wind_speed = round(d["wind"]["speed"] * 3.6)
                owm_main = d["weather"][0]["main"]
                owm_desc = d["weather"][0]["description"]
                condition = _owm_condition(owm_main, owm_desc)

                entry = {
                    "temp": temp,
                    "feelsLike": feels_like,
                    "condition": condition,
                    "humidity": humidity,
                    "windSpeed": wind_speed,
                    "observedAt": _now_iso(),
                    "source": "OpenWeatherMap",
                    **fetch_air_quality(*DISTRICT_COORDS[district]),
                }
                weather_data[district] = entry
                weather_cache_by_query[query] = entry
                print(f"  [OWM] {district}: {temp}°C, {condition}")
            else:
                print(f"  [OWM] WARNING {district}: HTTP {resp.status_code} for query '{query}'")
        except Exception as exc:
            print(f"  [OWM] ERROR {district}: {exc}")

        time.sleep(0.1)

    return weather_data


def fetch_weather_open_meteo() -> dict:
    """Fetch real-time weather using Open-Meteo free API (No API key required)."""
    print("Fetching live weather via Open-Meteo keyless fallback...")
    weather_data = {}
    base_url = "https://api.open-meteo.com/v1/forecast"

    for district, (lat, lon) in DISTRICT_COORDS.items():
        try:
            params = {
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
                "timezone": "Asia/Kolkata"
            }
            resp = requests.get(base_url, params=params, timeout=10)
            if resp.status_code == 200:
                d = resp.json().get("current", {})
                needed = ("temperature_2m", "apparent_temperature", "relative_humidity_2m",
                          "wind_speed_10m", "weather_code")
                if any(d.get(k) is None for k in needed):
                    # A missing reading is skipped, never filled with a stand-in value.
                    print(f"  [Open-Meteo] {district}: incomplete reading, skipped")
                    continue
                temp = round(d["temperature_2m"])
                condition = _wmo_condition(d["weather_code"])

                entry = {
                    "temp": temp,
                    "feelsLike": round(d["apparent_temperature"]),
                    "condition": condition,
                    "humidity": round(d["relative_humidity_2m"]),
                    "windSpeed": round(d["wind_speed_10m"]),
                    "observedAt": _now_iso(),
                    "source": "Open-Meteo",
                    **fetch_air_quality(lat, lon),
                }
                weather_data[district] = entry
                print(f"  [Open-Meteo] {district}: {temp}°C, {condition}")
            else:
                print(f"  [Open-Meteo] WARNING {district}: HTTP {resp.status_code}")
        except Exception as exc:
            print(f"  [Open-Meteo] ERROR {district}: {exc}")

        time.sleep(0.05)

    return weather_data


def load_existing_weather_cache() -> dict:
    """Read existing weatherData.js if available to avoid regressions."""
    if not os.path.exists(OUTPUT_FILE):
        return {}
    try:
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            content = f.read()
        match = re.search(r"export\s+const\s+weatherData\s*=\s*(\{[\s\S]*?\});", content)
        if match:
            return json.loads(match.group(1))
    except Exception as e:
        print(f"  Could not read existing weatherData.js: {e}")
    return {}


def write_weather_module(data: dict):
    """Write src/data/weatherData.js as an ES module."""
    ts = datetime.now(UTC).isoformat()
    lines = [
        f"// Automatically generated by weather_scraper.py at {ts}",
        f"export const weatherData = {json.dumps(data, indent=2, ensure_ascii=False)};",
        "",
    ]
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Weather data written to {OUTPUT_FILE} ({len(data)} districts).")


if __name__ == "__main__":
    if requests is None:
        raise SystemExit("Install requests: pip install requests")

    api_key = os.environ.get("OWM_API_KEY")
    data = {}

    # Tier 1: OpenWeatherMap (if API key available)
    if api_key:
        print(f"Attempting Tier 1 (OpenWeatherMap) for {len(DISTRICT_OWM_MAP)} districts...")
        try:
            data = fetch_weather_owm(api_key)
        except Exception as e:
            print(f"Tier 1 (OWM) failed: {e}")

    # Tier 2: Open-Meteo Keyless API (Fallback if OWM key absent or incomplete)
    if len(data) < len(DISTRICT_OWM_MAP):
        print("Proceeding to Tier 2 (Open-Meteo keyless API)...")
        try:
            om_data = fetch_weather_open_meteo()
            for dist, val in om_data.items():
                if dist not in data or not data[dist]:
                    data[dist] = val
        except Exception as e:
            print(f"Tier 2 (Open-Meteo) failed: {e}")

    # Tier 3: Existing cached weatherData.js
    if len(data) < len(DISTRICT_OWM_MAP):
        print("Proceeding to Tier 3 (Local cached weather data)...")
        cached = load_existing_weather_cache()
        for dist, val in cached.items():
            if dist not in data or not data[dist]:
                if not val.get("aqiSource"):
                    # Older files carried a fixed AQI (75/80); drop it.
                    val = {**val, "aqi": None, "aqiLabel": None, "aqiColor": None, "aqiSource": None}
                data[dist] = val

    # No generated baseline: a district with no real reading is left out and
    # the card says weather is unavailable (docs/DATA_STANDARDS.md, rule 1).

    if data:
        write_weather_module(data)
        print("✅ Weather sync completed successfully.")
    else:
        print("WARNING: All weather sources failed. Existing data untouched.")


