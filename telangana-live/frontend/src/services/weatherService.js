import { districtCoords } from '../data/districtCoords';
import { weatherData as mockWeather } from '../data/weatherData';

const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Cache to avoid redundant API calls within a session
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Fetch live weather + AQI for a Telangana district.
 * Falls back to mock data if no API key or on error.
 */
export async function fetchWeather(districtName) {
    // Map custom/virtual regions to official meteorological districts
    let searchName = districtName;
    if (districtName === 'Cyberabad') {
        searchName = 'Hyderabad';
    } else if (districtName === 'Malkajgiri') {
        searchName = 'Medchal-Malkajgiri';
    }

    // No key → graceful fallback to mock
    if (!API_KEY) {
        return { data: mockWeather[searchName], source: 'mock' };
    }

    // Check cache
    const cacheKey = searchName;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { data: cached.data, source: 'cache' };
    }

    const coords = districtCoords[searchName];
    if (!coords) {
        return { data: mockWeather[searchName], source: 'mock' };
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

        // Map AQI index (1-5) to labels and colors
        const aqiMap = [
            { label: 'Good', color: '#22C55E' },
            { label: 'Satisfactory', color: '#84CC16' },
            { label: 'Moderate', color: '#EAB308' },
            { label: 'Poor', color: '#F97316' },
            { label: 'Very Poor', color: '#EF4444' },
        ];

        const aqiIndex = aqiJson?.list?.[0]?.main?.aqi ?? 1; // 1-5 scale
        const aqiPm25 = aqiJson?.list?.[0]?.components?.pm2_5 ?? 0;
        // Convert PM2.5 to approximate AQI value for the gauge
        const aqiValue = Math.round(aqiPm25 * 4.2); // rough linear approximation

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
            aqi: aqiValue || aqiIndex * 50,
            aqiLabel: aqiMap[aqiIndex - 1]?.label ?? 'Unknown',
            aqiColor: aqiMap[aqiIndex - 1]?.color ?? '#A1A1AA',
        };

        // Cache the result
        cache.set(cacheKey, { data, timestamp: Date.now() });

        return { data, source: 'live' };
    } catch (err) {
        console.warn(`[WeatherService] Failed for ${searchName}, using mock:`, err.message);
        return { data: mockWeather[searchName], source: 'mock' };
    }
}
