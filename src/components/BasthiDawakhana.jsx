import { useState } from 'react';
import { basthiDawakhanas } from '../data/transportData';

export default function BasthiDawakhana() {
    const [search, setSearch] = useState('');
    const [selectedZone, setSelectedZone] = useState('all');

    const filtered = basthiDawakhanas.filter((d) => {
        const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.area.toLowerCase().includes(search.toLowerCase());
        const matchesZone = selectedZone === 'all' || d.zone === selectedZone;
        return matchesSearch && matchesZone;
    });

    const zones = [
        { key: 'all', label: 'All Zones' },
        { key: 'hyderabad', label: 'GHMC' },
        { key: 'cyberabad', label: 'CMC' },
        { key: 'malkajgiri', label: 'MMC' },
    ];

    return (
        <section className="animate-fade-in">
            <div className="section-header">
                <div>
                    <h2 className="section-title flex items-center gap-2">🏥 Basthi Dawakhana</h2>
                    <p className="section-subtitle">Free primary healthcare — 2026 locations</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by area..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-heritage-gold/40 transition-all"
                />
                <div className="flex gap-1.5">
                    {zones.map((z) => (
                        <button key={z.key} onClick={() => setSelectedZone(z.key)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${selectedZone === z.key
                                    ? 'bg-telangana-green/20 text-green-300 border border-telangana-green/30'
                                    : 'bg-white/[0.04] text-text-muted border border-white/[0.04] hover:text-white'
                                }`}>
                            {z.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((d) => (
                    <div key={d.name} className="glass-card p-4 hover-lift-green">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h4 className="text-sm font-semibold text-white">{d.name}</h4>
                                <p className="text-xs text-text-muted mt-0.5">{d.area}</p>
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${d.zone === 'hyderabad' ? 'bg-blue-500/15 text-blue-300' :
                                    d.zone === 'cyberabad' ? 'bg-purple-500/15 text-purple-300' :
                                        'bg-green-500/15 text-green-300'
                                }`}>{d.zone === 'hyderabad' ? 'GHMC' : d.zone === 'cyberabad' ? 'CMC' : 'MMC'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-text-muted">🕐 {d.timings}</span>
                            <a href={`tel:${d.phone}`} className="text-heritage-gold hover:underline font-medium">📞 {d.phone}</a>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="sm:col-span-2 text-center py-8 text-text-muted text-sm">No Basthi Dawakhanas found for this search</div>
                )}
            </div>
        </section>
    );
}
