import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';

const condIcons = {
    'Sunny': '☀️', 'Partly Cloudy': '⛅', 'Cloudy': '☁️',
    'Light Rain': '🌧️', 'Haze': '🌫️', 'Clear': '🌙', 'Thunderstorm': '⛈️',
};

export default function WeatherCard({ selectedDistrict }) {
    const [weather, setWeather] = useState(null);
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadWeather() {
            setLoading(true);
            try {
                const { data, source } = await fetchWeather(selectedDistrict);
                if (!cancelled) {
                    setWeather(data);
                    setSource(source);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch weather:', error);
                if (!cancelled) setLoading(false);
            }
        }

        loadWeather();
        return () => { cancelled = true; };
    }, [selectedDistrict]);

    if (loading) {
        return (
            <div className="glass-card section-block animate-fade-in h-full flex items-center justify-center min-h-[280px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-9 h-9 border-2 border-heritage-gold/30 border-t-heritage-gold rounded-full animate-spin"></div>
                    <p className="text-xs text-text-muted">Loading weather...</p>
                </div>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="glass-card section-block animate-fade-in h-full flex items-center justify-center min-h-[280px]">
                <div className="flex flex-col items-center gap-3 text-center px-4">
                    <span className="text-4xl">🌫️</span>
                    <p className="text-sm font-bold text-white">Weather Unavailable</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                        Live weather data could not be loaded.{' '}
                        <span className="text-heritage-gold">Set <code className="font-mono">VITE_OWM_API_KEY</code></span> to enable real-time conditions.
                    </p>
                </div>
            </div>
        );
    }

    if (source === 'mock') {
        // Show a subtle "demo data" badge but still render the card
    }

    return (
        <div className="glass-card section-block animate-fade-in h-full">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-heading font-bold text-white text-base sm:text-lg tracking-tight">{selectedDistrict}</h3>
                    <p className="section-subtitle flex items-center gap-1.5">
                        Weather & AQI
                        {source === 'live' && <span className="text-[9px] text-success bg-success/10 px-1.5 py-0.5 rounded-full font-semibold uppercase">Live</span>}
                        {source === 'cache' && <span className="text-[9px] text-heritage-gold bg-heritage-gold/10 px-1.5 py-0.5 rounded-full font-semibold uppercase">Cached</span>}
                        {source === 'mock' && <span className="text-[9px] text-text-muted bg-white/10 px-1.5 py-0.5 rounded-full font-semibold uppercase">Demo</span>}
                    </p>
                </div>
                <span className="text-4xl sm:text-5xl drop-shadow-lg">{condIcons[weather.condition] || '🌤️'}</span>
            </div>

            {/* Temperature */}
            <div className="flex items-end gap-1 mb-1">
                <span className="price-value text-4xl sm:text-5xl text-white">{weather.temp}°</span>
                <span className="text-text-muted text-base mb-2 font-light">C</span>
            </div>
            <p className="text-sm text-text-secondary mb-4 font-medium">
                {weather.conditionDesc || weather.condition} · Feels like {weather.feelsLike}°C
            </p>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="detail-box">
                    <p className="label-xs mb-1">💧 Humidity</p>
                    <p className="text-sm font-bold text-white">{weather.humidity}%</p>
                </div>
                <div className="detail-box">
                    <p className="label-xs mb-1">💨 Wind</p>
                    <p className="text-sm font-bold text-white">{weather.windSpeed} km/h</p>
                </div>
            </div>

            {/* AQI */}
            <div className="detail-box">
                <div className="flex items-center justify-between mb-2.5">
                    <p className="label-xs">Air Quality Index</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ backgroundColor: weather.aqiColor + '18', color: weather.aqiColor }}>
                        {weather.aqiLabel}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="price-value text-2xl" style={{ color: weather.aqiColor }}>{weather.aqi}</span>
                    <div className="flex-1">
                        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${Math.min((weather.aqi / 500) * 100, 100)}%`, backgroundColor: weather.aqiColor }} />
                        </div>
                        <div className="flex justify-between mt-0.5">
                            <span className="text-[8px] text-text-muted">0</span>
                            <span className="text-[8px] text-text-muted">500</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conditional Heatwave/Monsoon Advisory */}
            {(weather.temp > 40 || weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('cloudy')) && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2">
                    <span className="text-base flex-shrink-0 mt-0.5">
                        {weather.temp > 40 ? '🥵' : '🌧️'}
                    </span>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white leading-snug">
                            {weather.temp > 40 
                                ? `Extreme heat alert: Local Basthi Dawakhaanas are open with free ORS and cooling relief.` 
                                : `Heavy rain condition: Basthi Dawakhaanas are offering free diagnostics and seasonal advice.`
                            }
                        </p>
                        <a 
                            href="/health/basthi-dawakhana"
                            className="text-[9px] font-bold text-heritage-gold hover:underline mt-1.5 inline-block"
                        >
                            Find Nearest Basthi Dawakhana ↗
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
