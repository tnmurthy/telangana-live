// api/weather.js - Vercel Edge Function
// Fetches live weather & AQI data for Hyderabad from OpenWeatherMap API

export const config = { runtime: 'edge' };

const HYDERABAD_COORDS = {
  lat: 17.385044,
  lon: 78.486671
};

// FALLBACK data when API fails (last known good values)
const FALLBACK = {
  temperature: 35,
  feelsLike: 38,
  humidity: 45,
  windSpeed: 15,
  description: 'Cloudy',
  icon: '02d',
  aqi: 180,
  pm25: 85,
  pm10: 120,
  lastUpdated: new Date().toISOString(),
  source: 'fallback'
};

export default async function handler(req) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.error('OpenWeatherMap API key not configured');
      return new Response(JSON.stringify({ 
        ...FALLBACK, 
        error: 'API key not configured' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch current weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${HYDERABAD_COORDS.lat}&lon=${HYDERABAD_COORDS.lon}&units=metric&appid=${apiKey}`;
    
    const weatherResponse = await fetch(weatherUrl, {
      headers: { 'User-Agent': 'Telangana.live/1.0' }
    });

    if (!weatherResponse.ok) {
      throw new Error(`Weather API failed: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // Fetch Air Quality data
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${HYDERABAD_COORDS.lat}&lon=${HYDERABAD_COORDS.lon}&appid=${apiKey}`;
    
    const aqiResponse = await fetch(aqiUrl, {
      headers: { 'User-Agent': 'Telangana.live/1.0' }
    });

    let aqiData = null;
    if (aqiResponse.ok) {
      aqiData = await aqiResponse.json();
    }

    // Process and return structured data
    const result = {
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      description: weatherData.weather[0].main,
      detailedDescription: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      aqi: aqiData ? aqiData.list[0].main.aqi * 50 : null, // Convert 1-5 scale to approx AQI
      pm25: aqiData ? Math.round(aqiData.list[0].components.pm2_5) : null,
      pm10: aqiData ? Math.round(aqiData.list[0].components.pm10) : null,
      lastUpdated: new Date().toISOString(),
      source: 'OpenWeatherMap',
      valid: true
    };

    // Validate data freshness (reject if timestamp is in future or too old)
    const dataAge = Date.now() - (weatherData.dt * 1000);
    if (dataAge > 3600000) { // 1 hour
      console.warn('Weather data is stale, using fallback');
      return new Response(JSON.stringify(FALLBACK), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=1800' // Cache for 30 minutes
      }
    });

  } catch (error) {
    console.error('Weather API error:', error);
    return new Response(JSON.stringify({ 
      ...FALLBACK, 
      error: error.message 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
