import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';
import { AlertBox, AqiGauge, Card, CardHeader, StatChip } from './LocalPulse';

const condIcons = { Sunny: '☀️', 'Partly Cloudy': '⛅', Cloudy: '☁️', 'Light Rain': '🌧️', Haze: '🌫️', Clear: '🌙', Thunderstorm: '⛈️' };

export default function WeatherCard({ selectedDistrict, variant = 'default' }) {
    const [weather, setWeather] = useState(null);
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function loadWeather() {
            setLoading(true);
            try {
                const result = await fetchWeather(selectedDistrict);
                if (!cancelled) { setWeather(result.data); setSource(result.source); }
            } catch (error) { console.error('Failed to fetch weather:', error); }
            finally { if (!cancelled) setLoading(false); }
        }
        loadWeather();
        return () => { cancelled = true; };
    }, [selectedDistrict]);

    const title = variant === 'district' ? 'Weather & Environment' : selectedDistrict;
    // The snapshot is a real reading from a few hours ago: say when, not "Demo".
    const observed = weather?.observedAt ? new Date(weather.observedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : null;
    const status = source === 'live' ? 'Live' : source === 'cache' ? 'Cached' : source === 'snapshot' ? (observed ? `As of ${observed}` : 'Earlier reading') : null;
    if (loading) return <Card accent="sky" className="animate-fade-in h-full min-h-[280px] flex items-center justify-center"><p className="text-xs text-text-muted">Loading weather…</p></Card>;
    if (!weather) return <Card accent="sky" className="animate-fade-in h-full min-h-[280px] flex items-center justify-center"><p className="text-sm text-text-secondary">Weather unavailable.</p></Card>;
    const hasAdvisory = weather.temp > 40 || weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('cloudy');

    return <Card accent="sky" className="animate-fade-in h-full">
        <CardHeader icon="☁" title={title} subtitle={selectedDistrict} status={status} />
        <div className="local-pulse-weather-hero"><div><div className="local-pulse-temperature">{weather.temp}°</div><p className="local-pulse-condition">{weather.conditionDesc || weather.condition} · Feels like {weather.feelsLike}°C</p></div><span className="local-pulse-weather-icon" aria-hidden="true">{condIcons[weather.condition] || '🌤️'}</span></div>
        <div className="local-pulse-stat-grid local-pulse-weather-stats"><StatChip label="Humidity" value={`${weather.humidity}%`} /><StatChip label="Wind" value={`${weather.windSpeed} km/h`} /></div>
        {weather.aqi != null
            ? <AqiGauge value={weather.aqi} label={weather.aqiLabel} color={weather.aqiColor} />
            : <p className="text-xs text-text-muted">Air quality reading unavailable.</p>}
        {hasAdvisory && <AlertBox icon={weather.temp > 40 ? '☀' : '☂'} lead={weather.temp > 40 ? 'Extreme heat alert.' : 'Rain health advisory.'} href="/health/basthi-dawakhana" linkLabel="Find nearest Basthi Dawakhana">{weather.temp > 40 ? ' Basthi Dawakhaanas offer free ORS and cooling relief.' : ' Basthi Dawakhaanas offer free diagnostics and seasonal advice.'}</AlertBox>}
    </Card>;
}
