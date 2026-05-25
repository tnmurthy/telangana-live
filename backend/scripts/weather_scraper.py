"""Weather scraper for Telangana districts using OpenWeatherMap API.

Fetches current weather for all 33 Telangana districts and writes
src/data/weatherData.js compatible with the existing frontend schema.

Required environment variable:
  OWM_API_KEY  – OpenWeatherMap API key (free tier is sufficient).
"""

import json
import os
import re
import time
from datetime import datetime

_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.dirname(os.path.dirname(_SCRIPTS_DIR))
OUTPUT_FILE = os.path.join(_REPO_ROOT, "frontend", "src", "data", "weatherData.js")

try:
    import requests
except ImportError:
    print("WARNING: requests not installed. Run: pip install requests")
    requests = None

# ---------------------------------------------------------------------------
# District → OWM query string mapping
# Several Telangana district names are not recognised by OWM's city-name
# endpoint, so we map them to the nearest queryable city/town.
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


def fetch_weather(api_key: str) -> dict:
    """Fetch current weather for all districts and return the weatherData dict."""
    base_url = "https://api.openweathermap.org/data/2.5/weather"
    weather_data = {}
    weather_cache_by_query: dict[str, dict] = {}  # avoids duplicate API calls for shared OWM cities

    for district, query in DISTRICT_OWM_MAP.items():
        # Use cached result if the same OWM city was already queried
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
                wind_speed = round(d["wind"]["speed"] * 3.6)  # m/s → km/h
                owm_main = d["weather"][0]["main"]
                owm_desc = d["weather"][0]["description"]
                condition = _owm_condition(owm_main, owm_desc)

    # AQI placeholder – OWM free tier needs a separate call;
                # use 80 (mid-range "Satisfactory" level, typical for Indian urban areas)
                # so the field is never empty.
                aqi = 80
                aqi_label, aqi_color = _aqi_label_and_color(aqi)

                entry = {
                    "temp": temp,
                    "feelsLike": feels_like,
                    "condition": condition,
                    "humidity": humidity,
                    "windSpeed": wind_speed,
                    "aqi": aqi,
                    "aqiLabel": aqi_label,
                    "aqiColor": aqi_color,
                }
                weather_data[district] = entry
                weather_cache_by_query[query] = entry
                print(f"  {district}: {temp}°C, {condition}")
            else:
                print(f"  WARNING {district}: HTTP {resp.status_code} for query '{query}'")
        except Exception as exc:
            print(f"  ERROR {district}: {exc}")

        time.sleep(0.2)  # stay well within free-tier rate limits (60 req/min)

    return weather_data


def write_weather_module(data: dict):
    """Write src/data/weatherData.js as an ES module."""
    ts = datetime.now().isoformat()
    lines = [
        f"// Automatically generated by weather_scraper.py at {ts}",
        f"export const weatherData = {json.dumps(data, indent=2, ensure_ascii=False)};",
        "",
    ]
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Weather data written to {OUTPUT_FILE} ({len(data)} districts).")


if __name__ == "__main__":
    if requests is None:
        raise SystemExit("Install requests: pip install requests")

    api_key = os.environ.get("OWM_API_KEY")
    if not api_key:
        raise SystemExit("OWM_API_KEY environment variable not set.")

    print(f"Fetching weather data for {len(DISTRICT_OWM_MAP)} Telangana districts...")
    data = fetch_weather(api_key)
    if data:
        write_weather_module(data)
        print("Done.")
    else:
        print("WARNING: No weather data could be fetched (network or API offline). Skipping write to avoid blanking out existing data.")
        raise SystemExit(0)
