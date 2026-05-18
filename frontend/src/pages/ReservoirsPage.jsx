import { useState, useEffect } from 'react';
import { getReservoirStatus } from '../data/reservoirsData';
import { fetchWaterLevels } from '../services/waterService';

function LevelBar({ pct, color }) {
    return (
        <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
            />
        </div>
    );
}

function ReservoirCard({ reservoir }) {
    const { color, label, pct } = getReservoirStatus(reservoir);
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`glass-card p-4 cursor-pointer hover-lift transition-all ${reservoir.state === 'low' ? 'border border-orange-500/20' : ''}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm truncate">{reservoir.name}</h3>
                        {reservoir.alertMessage && (
                            <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-full font-semibold">⚠️ Alert</span>
                        )}
                    </div>
                    <p className="text-xs text-text-muted">{reservoir.river} River · {reservoir.district}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <span
                        className="text-[11px] font-bold px-2 py-1 rounded-full"
                        style={{ backgroundColor: color + '18', color }}
                    >
                        {label}
                    </span>
                </div>
            </div>

            {/* Level bar */}
            <LevelBar pct={pct} color={color} />
            <div className="flex justify-between mt-1.5 mb-3">
                <span className="text-[10px] text-text-muted">0 TMC</span>
                <span className="text-[10px] font-bold" style={{ color }}>
                    {reservoir.currentLevelTMC.toFixed(1)} / {reservoir.fullCapacityTMC.toFixed(1)} TMC ({pct.toFixed(0)}%)
                </span>
                <span className="text-[10px] text-text-muted">{reservoir.fullCapacityTMC} TMC</span>
            </div>

            {/* Compact stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="detail-box p-2">
                    <p className="text-[9px] text-text-muted uppercase font-bold">Level</p>
                    <p className="text-xs font-bold text-white">{reservoir.currentLevelFt} ft</p>
                </div>
                <div className="detail-box p-2">
                    <p className="text-[9px] text-text-muted uppercase font-bold">Inflow</p>
                    <p className="text-xs font-bold text-telangana-green">▲ {reservoir.inflow.toLocaleString('en-IN')}</p>
                    <p className="text-[8px] text-text-muted">{reservoir.inflowUnit}</p>
                </div>
                <div className="detail-box p-2">
                    <p className="text-[9px] text-text-muted uppercase font-bold">Outflow</p>
                    <p className="text-xs font-bold text-heritage-gold">▼ {reservoir.outflow.toLocaleString('en-IN')}</p>
                    <p className="text-[8px] text-text-muted">{reservoir.inflowUnit}</p>
                </div>
            </div>

            {/* Expanded section */}
            {expanded && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2 animate-in">
                    <div>
                        <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-1">Purpose</p>
                        <div className="flex flex-wrap gap-1">
                            {reservoir.purpose.map(p => (
                                <span key={p} className="text-[10px] bg-telangana-green/10 text-telangana-green px-2 py-0.5 rounded-full">{p}</span>
                            ))}
                        </div>
                    </div>
                    {reservoir.alertMessage && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2.5">
                            <p className="text-xs text-orange-300">⚠️ {reservoir.alertMessage}</p>
                        </div>
                    )}
                    <p className="text-[10px] text-text-muted">Full reservoir level: {reservoir.fullLevelFt} ft</p>
                </div>
            )}
        </div>
    );
}

function SummaryBar({ reservoirs }) {
    const total = reservoirs.reduce((s, r) => s + r.fullCapacityTMC, 0);
    const current = reservoirs.reduce((s, r) => s + r.currentLevelTMC, 0);
    const pct = (current / total) * 100;
    const lowCount = reservoirs.filter(r => getReservoirStatus(r).pct < 50).length;

    return (
        <div className="glass-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-base font-bold text-white">Combined Storage — All Reservoirs</h2>
                    <p className="text-xs text-text-muted mt-0.5">{reservoirs.length} reservoirs tracked</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-heritage-gold">{pct.toFixed(1)}%</p>
                    <p className="text-xs text-text-muted">{current.toFixed(1)} / {total.toFixed(1)} TMC</p>
                </div>
            </div>
            <LevelBar pct={pct} color={pct > 60 ? '#22C55E' : pct > 40 ? '#F97316' : '#EF4444'} />
            {lowCount > 0 && (
                <div className="mt-3 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2.5 flex items-start gap-2">
                    <span className="text-orange-400 text-base">⚠️</span>
                    <p className="text-xs text-orange-300">{lowCount} reservoir{lowCount > 1 ? 's are' : ' is'} below 50% capacity. Water conservation advised.</p>
                </div>
            )}
        </div>
    );
}

export default function ReservoirsPage() {
    const [liveData, setLiveData] = useState({ reservoirs: [], lastUpdated: '' });
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchWaterLevels().then(data => {
            if (data && data.reservoirs) {
                setLiveData(data);
            }
        });
    }, []);

    const reservoirs = liveData.reservoirs;

    const filtered = filter === 'all' ? reservoirs
        : filter === 'low' ? reservoirs.filter(r => getReservoirStatus(r).pct < 50)
        : reservoirs.filter(r => getReservoirStatus(r).pct >= 50);

    const updatedTime = liveData.lastUpdated ? new Date(liveData.lastUpdated).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }) : 'Loading...';

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-black text-white font-heading tracking-tight">
                            💧 Water Reservoir Levels
                        </h1>
                        <p className="text-text-muted text-sm mt-1">Major dams & reservoirs in Telangana</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <span className="badge-live bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-live"></span>
                            Updated
                        </span>
                        <p className="text-[10px] text-text-muted mt-1">{updatedTime}</p>
                    </div>
                </div>
            </div>

            {/* Summary */}
            {reservoirs.length > 0 ? (
                <SummaryBar reservoirs={reservoirs} />
            ) : (
                <div className="glass-card p-5 text-center text-text-muted">Loading live reservoir data...</div>
            )}

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { key: 'all', label: 'All Reservoirs' },
                    { key: 'low', label: '⚠️ Low Levels' },
                    { key: 'normal', label: '✅ Normal' },
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

            {/* Reservoir cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(r => (
                    <ReservoirCard key={r.id} reservoir={r} />
                ))}
            </div>

            {/* Info note */}
            <div className="glass-card p-4">
                <p className="text-xs text-text-muted leading-relaxed">
                    <span className="text-heritage-gold font-semibold">ℹ️ Data Note: </span>
                    Reservoir levels are reported in TMC (Thousand Million Cubic feet). Inflow/outflow is in cusecs (cubic feet per second). Data is sourced from CWC (Central Water Commission) and Telangana Irrigation Department. Tap any card for details.
                </p>
            </div>
        </div>
    );
}
