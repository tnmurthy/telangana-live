import { useState } from 'react';
import { searchWard } from '../data/wardData';

const corpColors = { GHMC: '#F97316', CMC: '#6366F1', MMC: '#EC4899' };

export default function KnowYourWard() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(null);

    const handleSearch = (value) => {
        setQuery(value);
        setSelected(null);
        setResults(searchWard(value));
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="glass-card p-6">
                <h3 className="section-title text-xl mb-2">🔍 Know Your Ward</h3>
                <p className="text-text-muted text-xs mb-5">Search by colony name to find your ward, corporation, and zonal commissioner office</p>
                <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Enter colony name... e.g., Gachibowli, Malkajgiri, Banjara Hills"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-text-muted focus:border-heritage-gold/50 focus:outline-none transition-all"
                    />
                </div>

                {/* Autocomplete Dropdown */}
                {results.length > 0 && !selected && (
                    <div className="mt-3 border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5 max-h-64 overflow-y-auto">
                        {results.map(ward => (
                            <button
                                key={ward.ward}
                                onClick={() => { setSelected(ward); setResults([]); }}
                                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-all flex items-center gap-3"
                            >
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: corpColors[ward.corporation] }}></span>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm text-white font-bold">{ward.colony}</span>
                                    <span className="text-[10px] text-text-muted ml-2">Ward {ward.ward} · {ward.corporation}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {query.length >= 2 && results.length === 0 && !selected && (
                    <p className="text-xs text-text-muted mt-3 text-center py-4">No colonies matching "{query}". Try a different name.</p>
                )}
            </div>

            {/* Result Card */}
            {selected && (
                <div className="glass-card p-6 border-2 animate-fade-in" style={{ borderColor: `${corpColors[selected.corporation]}40` }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${corpColors[selected.corporation]}20` }}>
                            {selected.corporation === 'GHMC' ? '🏛️' : selected.corporation === 'CMC' ? '💻' : '🏘️'}
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-white">{selected.colony}</h4>
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: corpColors[selected.corporation] }}>{selected.corporation}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="detail-box">
                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Ward Number</p>
                            <p className="text-2xl font-black text-white">#{selected.ward}</p>
                        </div>
                        <div className="detail-box">
                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Circle</p>
                            <p className="text-sm font-bold text-white">{selected.circle}</p>
                        </div>
                        <div className="detail-box sm:col-span-2">
                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Zonal Commissioner Office</p>
                            <p className="text-sm font-bold text-white">📍 {selected.zonal}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href="https://prajavani.telangana.gov.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 rounded-2xl bg-white text-dark-bg text-[11px] font-black uppercase tracking-[0.15em] text-center hover:bg-heritage-gold transition-all"
                        >
                            File Complaint at {selected.corporation}
                        </a>
                        <button
                            onClick={() => { setSelected(null); setQuery(''); }}
                            className="py-3 px-6 rounded-2xl bg-white/5 text-text-muted text-[11px] font-black uppercase tracking-[0.15em] hover:bg-white/10 transition-all"
                        >
                            Search Again
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
                {Object.entries(corpColors).map(([corp, color]) => {
                    return (
                        <div key={corp} className="glass-card p-4 text-center">
                            <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: color }}></div>
                            <p className="text-2xl font-black text-white">{corp === 'GHMC' ? 100 : corp === 'CMC' ? 100 : 100}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">{corp} Wards</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
