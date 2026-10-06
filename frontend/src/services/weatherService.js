import { districtCoords } from '../data/districtCoords';
import { weatherData as snapshot } from '../data/weatherData';
import { aqiBand, indianAqi } from '../utils/aqi';

const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Cache to avoid redundant API calls within a session
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Fetch live weather + AQI for a Telangana district.
 * Falls back to the scraped snapshot (weather_scraper.py, every few hours)
 * when there is no API key or the call fails; that is labelled with its time.
 */
export async function fetchWeather(districtName) {
    // Map custom/virtual regions to official meteorological districts
    let searchName = districtName;
    if (districtName === 'Cyberabad') {
        searchName = 'Hyderabad';
    } else if (districtName === 'Malkajgiri') {
        searchName = 'Medchal-Malkajgiri';
    }

    // No key → the scraped snapshot
    if (!API_KEY) {
        return { data: snapshot[searchName] ?? null, source: 'snapshot' };
    }

    // Check cache
    const cacheKey = searchName;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { data: cached.data, source: 'cache' };
    }

    const coords = districtCoords[searchName];
    if (!coords) {
        return { data: snapshot[searchName] ?? null, source: 'snapshot' };
    }

    try {
        // Parallel: weather + air quality
        const [weatherRes, aqiRes] = await Promise.all([
            fetch(`${BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`),
            fetch(`${BASE_URL}/air_pollution?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`),
        ]);

        if (!weatherRes.ok) throw new Error(`Weather API ${weatherRes.status}`);

        const weatherJson = await weatherRes.json();
        const aqiJson = aqiRes.ok ? await aqiRes.json() : null;

        // Indian AQI (CPCB) from the current PM2.5/PM10 reading; null if none.
        const aqiValue = indianAqi(aqiJson?.list?.[0]?.components);
        const band = aqiBand(aqiValue);

        const conditionMap = {
            'Clear': 'Clear',
            'Clouds': 'Cloudy',
            'Few clouds': 'Partly Cloudy',
            'Scattered clouds': 'Partly Cloudy',
            'Broken clouds': 'Cloudy',
            'Overcast clouds': 'Cloudy',
            'Rain': 'Light Rain',
            'Drizzle': 'Light Rain',
            'Thunderstorm': 'Thunderstorm',
            'Mist': 'Haze',
            'Haze': 'Haze',
            'Fog': 'Haze',
            'Smoke': 'Haze',
        };

        const mainCondition = weatherJson.weather?.[0]?.main ?? 'Clear';
        const description = weatherJson.weather?.[0]?.description ?? '';

        const data = {
            temp: Math.round(weatherJson.main.temp),
            feelsLike: Math.round(weatherJson.main.feels_like),
            condition: conditionMap[mainCondition] || mainCondition,
            conditionDesc: description,
            humidity: weatherJson.main.humidity,
            windSpeed: Math.round(weatherJson.wind.speed * 3.6), // m/s → km/h
            aqi: aqiValue,
            aqiLabel: band.label,
            aqiColor: band.color,
            aqiSource: aqiValue == null ? null : 'Indian AQI (CPCB method) from the current PM2.5/PM10 reading, OpenWeatherMap',
            observedAt: new Date((weatherJson.dt ?? Date.now() / 1000) * 1000).toISOString(),
        };

        // Cache the result
        cache.set(cacheKey, { data, timestamp: Date.now() });

        return { data, source: 'live' };
    } catch (err) {
        console.warn(`[WeatherService] Failed for ${searchName}, using snapshot:`, err.message);
        return { data: snapshot[searchName] ?? null, source: 'snapshot' };
    }
}
