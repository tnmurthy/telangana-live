import { useState, useMemo } from 'react';
import { weatherForecast, availableDistricts } from '../data/weatherForecastData';

const conditionColors = {
    'Sunny': '#F59E0B',
    'Partly Cloudy': '#60A5FA',
    'Cloudy': '#9CA3AF',
    'Light Rain': '#34D399',
    'Haze': '#D1D5DB',
    'Clear': '#818CF8',
    'Thunderstorm': '#EF4444',
};

function WeekRow({ days, selectedIdx, onSelect }) {
    return (
        <div className="grid grid-cols-7 gap-1.5">
            {days.map((day, i) => {
                const isToday = i === 0;
                const isSelected = selectedIdx === i;
                return (
                    <button
                        key={day.date}
                        onClick={() => onSelect(i)}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all text-center cursor-pointer border ${
                            isSelected
                                ? 'bg-telangana-green/20 border-telangana-green/50'
                                : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07]'
                        }`}
                    >
                        <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isToday ? 'text-telangana-green' : 'text-text-muted'}`}>
                            {isToday ? 'Today' : day.dayLabel}
                        </span>
                        <span className="text-lg mb-1">{day.icon}</span>
                        <span className="text-xs font-bold text-white">{day.maxTemp}°</span>
                        <span className="text-[10px] text-text-muted">{day.minTemp}°</span>
                    </button>
                );
            })}
        </div>
    );
}

function DetailCard({ label, value, unit, icon }) {
    return (
        <div className="glass-card p-3 flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{icon} {label}</p>
            <p className="text-lg font-black text-white">{value}<span className="text-xs font-normal text-text-muted ml-1">{unit}</span></p>
        </div>
    );
}

export default function WeatherForecastPage() {
    const [district, setDistrict] = useState('Hyderabad');
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);
    const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'

    const forecast = weatherForecast[district] || weatherForecast['Hyderabad'];
    const selectedDay = forecast[selectedDayIdx];

    const weeks = [];
    for (let i = 0; i < 28; i += 7) weeks.push(forecast.slice(i, i + 7));

    const currentWeekIdx = Math.floor(selectedDayIdx / 7);

    const monthYearLabel = useMemo(() => {
        const d = new Date(forecast[0].date);
        return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    }, [forecast]);

    const monthLabel = useMemo(() => {
        const d = new Date(forecast[0].date);
        return d.toLocaleDateString('en-IN', { month: 'long' });
    }, [forecast]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-black text-white font-heading tracking-tight">
                            🌤️ Monthly Weather Forecast
                        </h1>
                        <p className="text-text-muted text-sm mt-1">30-day outlook for Telangana districts</p>
                    </div>
                    <select
                        value={district}
                        onChange={e => { setDistrict(e.target.value); setSelectedDayIdx(0); }}
                        className="bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-telangana-green/50 min-w-[180px]"
                    >
                        {availableDistricts.map(d => (
                            <option key={d} value={d} className="bg-gray-900">{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* View toggle */}
            <div className="flex gap-2">
                {['week', 'month'].map(m => (
                    <button
                        key={m}
                        onClick={() => setViewMode(m)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                            viewMode === m
                                ? 'bg-telangana-green text-white'
                                : 'bg-white/[0.06] text-text-muted hover:bg-white/10'
                        }`}
                    >
                        {m === 'week' ? '7-Day' : '30-Day'}
                    </button>
                ))}
            </div>

            {viewMode === 'week' ? (
                <>
                    {/* Weekly grid */}
                    <div className="glass-card p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-4">This Week — {district}</p>
                        <WeekRow
                            days={forecast.slice(0, 7)}
                            selectedIdx={selectedDayIdx < 7 ? selectedDayIdx : -1}
                            onSelect={i => setSelectedDayIdx(i)}
                        />
                    </div>

                    {/* Selected day detail */}
                    {selectedDayIdx < 7 && (
                        <div className="glass-card p-5 animate-in">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-black text-white">{selectedDayIdx === 0 ? 'Today' : selectedDay.dateLabel}</h2>
                                    <p className="text-text-muted text-sm">{selectedDay.condition}</p>
                                </div>
                                <span className="text-5xl">{selectedDay.icon}</span>
                            </div>
                            <div className="flex items-end gap-2 mb-5">
                                <span className="text-5xl font-black text-white">{selectedDay.maxTemp}°</span>
                                <span className="text-2xl text-text-muted mb-1">/ {selectedDay.minTemp}°C</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <DetailCard label="Rain Chance" value={selectedDay.rainChance} unit="%" icon="🌧️" />
                                <DetailCard label="Humidity" value={selectedDay.humidity} unit="%" icon="💧" />
                                <DetailCard label="Wind Speed" value={selectedDay.windSpeed} unit="km/h" icon="💨" />
                                <DetailCard label="Min Temp" value={selectedDay.minTemp} unit="°C" icon="🌡️" />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* Month view — compact list */
                <div className="glass-card p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-4">{monthYearLabel} — {district}</p>
                    <div className="space-y-2">
                        {forecast.map((day, i) => {
                            const isToday = i === 0;
                            const barWidth = Math.min(((day.maxTemp - 20) / 25) * 100, 100);
                            return (
                                <div
                                    key={day.date}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                        isToday ? 'bg-telangana-green/10 border border-telangana-green/20' : 'hover:bg-white/[0.04]'
                                    }`}
                                    onClick={() => { setSelectedDayIdx(i); setViewMode('week'); }}
                                >
                                    <div className="w-16 flex-shrink-0">
                                        <p className={`text-xs font-bold ${isToday ? 'text-telangana-green' : 'text-text-secondary'}`}>
                                            {isToday ? 'Today' : day.dayLabel}
                                        </p>
                                        <p className="text-[10px] text-text-muted">{day.dateLabel}</p>
                                    </div>
                                    <span className="text-base w-6 flex-shrink-0">{day.icon}</span>
                                    <div className="flex-1 hidden sm:block">
                                        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${barWidth}%`, backgroundColor: conditionColors[day.condition] || '#60A5FA' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-sm font-bold text-white">{day.maxTemp}°</span>
                                        <span className="text-xs text-text-muted">{day.minTemp}°</span>
                                        {day.rainChance > 40 && (
                                            <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full font-semibold">{day.rainChance}% 🌧️</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Season summary */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-bold text-white mb-4">{monthLabel} Outlook for {district}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="detail-box text-center">
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Avg Max Temp</p>
                        <p className="text-2xl font-black text-heritage-gold">
                            {Math.round(forecast.reduce((s, d) => s + d.maxTemp, 0) / forecast.length)}°C
                        </p>
                    </div>
                    <div className="detail-box text-center">
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Rainy Days</p>
                        <p className="text-2xl font-black text-blue-400">
                            {forecast.filter(d => d.rainChance > 50).length} days
                        </p>
                    </div>
                    <div className="detail-box text-center">
                        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Humidity Range</p>
                        <p className="text-2xl font-black text-telangana-green">
                            {Math.min(...forecast.map(d => d.humidity))}–{Math.max(...forecast.map(d => d.humidity))}%
                        </p>
                    </div>
                </div>
                <p className="text-xs text-text-muted mt-4">
                    ⚠️ Forecast data is indicative. {monthLabel} outlook shown above. Telangana summers (April–June) typically reach 38–44°C. Stay hydrated and avoid outdoor activity between 11 AM–4 PM.
                </p>
            </div>
        </div>
    );
}
