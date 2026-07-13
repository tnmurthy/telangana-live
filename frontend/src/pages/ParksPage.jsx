import { useState } from 'react';
import { parksData, crowdLevelInfo } from '../data/parksData';

function CrowdBadge({ index }) {
    const info = crowdLevelInfo[index] || crowdLevelInfo[0];
    return (
        <span
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: info.color + '18', color: info.color }}
        >
            <span>{info.emoji}</span>
            {info.label}
        </span>
    );
}

function OccupancyBar({ current, capacity, color }) {
    const pct = Math.min((current / capacity) * 100, 100);
    return (
        <div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[9px] text-text-muted">{current.toLocaleString('en-IN')} visitors</span>
                <span className="text-[9px] text-text-muted">Cap: {capacity.toLocaleString('en-IN')}</span>
            </div>
        </div>
    );
}

function ParkCard({ park }) {
    const crowdInfo = crowdLevelInfo[park.crowdIndex] || crowdLevelInfo[0];
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className="glass-card p-4 cursor-pointer hover-lift transition-all"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-telangana-green/10 flex items-center justify-center text-xl flex-shrink-0">
                    {park.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm leading-tight">{park.name}</h3>
                        <CrowdBadge index={park.crowdIndex} />
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{park.area}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] bg-white/[0.05] px-2 py-0.5 rounded-full text-text-secondary">{park.type}</span>
                        <span className="text-[10px] text-text-muted">🕐 {park.openTime}{park.closeTime ? `–${park.closeTime}` : ' (Open 24 hrs)'}</span>
                    </div>
                </div>
            </div>

            {/* Occupancy bar */}
            <OccupancyBar current={park.currentCount} capacity={park.capacity} color={crowdInfo.color} />

            {/* Entry fee */}
            <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-text-muted">
                    🎟️ <span className="text-text-secondary">{park.entryFee}</span>
                </span>
                <span className="text-[10px] text-text-muted">{expanded ? '▲ Less' : '▼ More'}</span>
            </div>

            {/* Expanded */}
            {expanded && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-3 animate-in">
                    <div>
                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1.5">Highlights</p>
                        <div className="flex flex-wrap gap-1">
                            {park.highlights.map(h => (
                                <span key={h} className="text-[10px] bg-heritage-gold/10 text-heritage-gold px-2 py-0.5 rounded-full">{h}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1.5">Amenities</p>
                        <div className="flex flex-wrap gap-1">
                            {park.amenities.map(a => (
                                <span key={a} className="text-[10px] bg-white/[0.05] text-text-secondary px-2 py-0.5 rounded-full">{a}</span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-telangana-green/10 border border-telangana-green/20 rounded-lg p-2.5">
                        <p className="text-[10px] text-telangana-green font-semibold mb-0.5">🌟 Best Time to Visit</p>
                        <p className="text-xs text-text-secondary">{park.bestTime}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {park.contact && (
                            <a
                                href={`tel:${park.contact}`}
                                onClick={e => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-[11px] text-telangana-green hover:underline"
                            >
                                📞 {park.contact}
                            </a>
                        )}
                        {park.mapUrl && (
                            <a
                                href={park.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-[11px] text-blue-400 hover:underline"
                            >
                                📍 Get Directions
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function CrowdLegend() {
    return (
        <div className="glass-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-3">Crowd Level Guide</p>
            <div className="flex flex-wrap gap-2">
                {crowdLevelInfo.map(info => (
                    <div key={info.label} className="flex items-center gap-1.5">
                        <span className="text-sm">{info.emoji}</span>
                        <span className="text-xs text-text-secondary">{info.label}</span>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-text-muted mt-2">{parksData.disclaimer}</p>
        </div>
    );
}

export default function ParksPage() {
    const { parks, lastUpdated, nextUpdateAt } = parksData;
    const [filter, setFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const types = ['all', ...new Set(parks.map(p => p.type))];

    const filtered = parks.filter(p => {
        const crowdMatch = filter === 'all'
            ? true
            : filter === 'quiet' ? p.crowdIndex <= 1
            : p.crowdIndex >= 3;
        const typeMatch = typeFilter === 'all' || p.type === typeFilter;
        return crowdMatch && typeMatch;
    });

    const updatedTime = new Date(lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const nextTime = new Date(nextUpdateAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-black text-white font-heading tracking-tight">
                            🌳 Public Parks & Crowd Status
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            Live crowd estimates for parks across Hyderabad &amp; Telangana
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <span className="badge-live bg-success/10 text-success border border-success/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-live"></span>
                            Live
                        </span>
                        <p className="text-[10px] text-text-muted mt-1">Updated {updatedTime}</p>
                        <p className="text-[10px] text-text-muted">Next: {nextTime}</p>
                    </div>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="glass-card p-3 text-center">
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Total Parks</p>
                    <p className="text-2xl font-black text-white">{parks.length}</p>
                </div>
                <div className="glass-card p-3 text-center">
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Currently Quiet</p>
                    <p className="text-2xl font-black text-telangana-green">{parks.filter(p => p.crowdIndex <= 1).length}</p>
                </div>
                <div className="glass-card p-3 text-center">
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Busy Now</p>
                    <p className="text-2xl font-black text-orange-400">{parks.filter(p => p.crowdIndex >= 3).length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3">
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'all', label: 'All Parks' },
                        { key: 'quiet', label: '🟢 Quiet Now' },
                        { key: 'busy', label: '🔴 Busy Now' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                                filter === key
                                    ? 'bg-telangana-green text-white'
                                    : 'bg-white/[0.06] text-text-muted hover:bg-white/10'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {types.map(t => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all ${
                                typeFilter === t
                                    ? 'bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30'
                                    : 'bg-white/[0.04] text-text-muted hover:bg-white/10'
                            }`}
                        >
                            {t === 'all' ? 'All Types' : t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <CrowdLegend />

            {/* Park cards */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(park => (
                        <ParkCard key={park.id} park={park} />
                    ))}
                </div>
            ) : (
                <div className="glass-card p-8 text-center">
                    <p className="text-text-muted text-sm">No parks match the selected filters.</p>
                </div>
            )}
        </div>
    );
}
