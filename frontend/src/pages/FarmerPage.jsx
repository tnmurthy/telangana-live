import { useState, useEffect } from 'react';
import { fetchMandiPrices } from '../services/pricesService';
import {
    mspPrices,
    cropAdvisories,
    farmerSchemes,
    marketPrices,
    farmerHelplines,
    cropCalendar,
} from '../data/farmerData';

const urgencyConfig = {
    critical: { label: 'Critical', color: '#EF4444', bg: 'bg-red-500/10 border-red-500/20' },
    high: { label: 'Urgent', color: '#F97316', bg: 'bg-orange-500/10 border-orange-500/20' },
    medium: { label: 'Advisory', color: '#EAB308', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    low: { label: 'Info', color: '#22C55E', bg: 'bg-green-500/10 border-green-500/20' },
};

function MspRow({ crop }) {
    const change = crop.msp - crop.lastYearMsp;
    const changePct = ((change / crop.lastYearMsp) * 100).toFixed(1);
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{crop.name}</p>
                <p className="text-[10px] text-text-muted">{crop.telugu} · {crop.season} · {crop.category}</p>
            </div>
            <div className="text-right ml-3 flex-shrink-0">
                <p className="text-sm font-black text-heritage-gold">₹{crop.msp.toLocaleString('en-IN')}</p>
                <p className="text-[9px] text-text-muted">{crop.unit}</p>
                <span className={`text-[9px] font-bold ${change >= 0 ? 'text-telangana-green' : 'text-red-400'}`}>
                    {change >= 0 ? '▲' : '▼'} ₹{Math.abs(change)} ({changePct}%)
                </span>
            </div>
        </div>
    );
}

function AdvisoryCard({ advisory }) {
    const urg = urgencyConfig[advisory.urgency] || urgencyConfig.low;
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`glass-card p-4 cursor-pointer transition-all border ${urg.bg}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl">{advisory.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                            <p className="text-xs font-bold text-white">{advisory.crop} <span className="text-text-muted font-normal">({advisory.telugu})</span></p>
                            <p className="text-sm font-semibold text-text-secondary mt-0.5">{advisory.title}</p>
                        </div>
                        <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: urg.color + '18', color: urg.color }}
                        >
                            {urg.label}
                        </span>
                    </div>
                    {!expanded && <p className="text-xs text-text-muted mt-1.5 line-clamp-2">{advisory.advisory}</p>}
                    {expanded && (
                        <div className="mt-2 animate-in">
                            <p className="text-xs text-text-secondary leading-relaxed">{advisory.advisory}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {advisory.tags.map(t => (
                                    <span key={t} className="text-[9px] bg-white/[0.05] text-text-muted px-2 py-0.5 rounded-full">{t}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SchemeCard({ scheme }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div
            className="glass-card p-4 cursor-pointer hover-lift transition-all"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl">{scheme.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="text-sm font-bold text-white">{scheme.name}</p>
                            <p className="text-[10px] text-text-muted">{scheme.telugu}</p>
                        </div>
                        <span className="text-[9px] bg-telangana-green/10 text-telangana-green border border-telangana-green/20 px-2 py-0.5 rounded-full font-bold flex-shrink-0">Active</span>
                    </div>
                    <p className="text-xs text-heritage-gold font-semibold mt-1.5">🎁 {scheme.benefit}</p>
                    {!expanded && <p className="text-xs text-text-muted mt-1 line-clamp-2">{scheme.description}</p>}
                    {expanded && (
                        <div className="mt-2 space-y-2 animate-in">
                            <p className="text-xs text-text-secondary leading-relaxed">{scheme.description}</p>
                            <div className="detail-box p-2.5 space-y-1">
                                <p className="text-[10px] text-text-muted"><span className="font-semibold text-text-secondary">Eligibility:</span> {scheme.eligibility}</p>
                                <p className="text-[10px] text-text-muted"><span className="font-semibold text-text-secondary">How to Apply:</span> {scheme.howToApply}</p>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                {scheme.contact && (
                                    <a href={`tel:${scheme.contact}`} onClick={e => e.stopPropagation()}
                                        className="text-[11px] text-telangana-green hover:underline">📞 {scheme.contact}</a>
                                )}
                                {scheme.website && (
                                    <a href={scheme.website} target="_blank" rel="noopener noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        className="text-[11px] text-blue-400 hover:underline">🌐 Website</a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const TABS = [
    { key: 'advisory', label: '🌿 Crop Advisory' },
    { key: 'msp', label: '💰 MSP Prices' },
    { key: 'schemes', label: '📋 Schemes' },
    { key: 'market', label: '📈 Market Rates' },
    { key: 'calendar', label: '🗓️ Crop Calendar' },
];

export default function FarmerPage() {
    const [activeTab, setActiveTab] = useState('advisory');
    const [mspSeason, setMspSeason] = useState('All');
    const [mspCategory, setMspCategory] = useState('All');
    const [liveMandi, setLiveMandi] = useState({ items: [], lastUpdated: '' });

    useEffect(() => {
        fetchMandiPrices().then(data => setLiveMandi(data));
    }, []);

    const categories = ['All', ...new Set(mspPrices.crops.map(c => c.category))];
    const seasons = ['All', 'Kharif', 'Rabi'];

    const filteredMsp = mspPrices.crops.filter(c => {
        const seasonOk = mspSeason === 'All' || c.season === mspSeason;
        const catOk = mspCategory === 'All' || c.category === mspCategory;
        return seasonOk && catOk;
    });

    const currentMonthYear = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const currentMonthName = new Date().toLocaleDateString('en-IN', { month: 'long' });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-black text-white font-heading tracking-tight">
                            🌾 Farmer Information Portal
                        </h1>
                        <p className="text-text-muted text-sm mt-1">
                            MSP prices, crop advisories, government schemes &amp; market rates for Telangana farmers
                        </p>
                    </div>
                </div>
                {/* Helpline strip */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {farmerHelplines.map(h => (
                        <a
                            key={h.number}
                            href={`tel:${h.number}`}
                            className="detail-box p-2 text-center hover:bg-white/[0.08] transition-colors"
                        >
                            <p className="text-base mb-0.5">{h.icon}</p>
                            <p className="text-[10px] font-bold text-white">{h.name}</p>
                            <p className="text-[11px] text-telangana-green font-mono">{h.number}</p>
                            <p className="text-[9px] text-text-muted mt-0.5">{h.description}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Tab nav */}
            <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                            activeTab === tab.key
                                ? 'bg-telangana-green text-white'
                                : 'bg-white/[0.06] text-text-muted hover:bg-white/10'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Crop Advisory */}
            {activeTab === 'advisory' && (
                <div className="space-y-3">
                    <p className="text-xs text-text-muted px-1">
                        Advisory for <span className="text-telangana-green font-semibold">{currentMonthYear}</span> — Kharif pre-sowing season
                    </p>
                    {cropAdvisories.map(a => (
                        <AdvisoryCard key={a.id} advisory={a} />
                    ))}
                </div>
            )}

            {/* MSP Prices */}
            {activeTab === 'msp' && (
                <div className="space-y-4">
                    <div className="glass-card p-3">
                        <p className="text-xs text-text-muted mb-2">
                            MSP announced by Govt. of India for{' '}
                            <span className="text-heritage-gold font-semibold">{mspPrices.season}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex gap-1">
                                {seasons.map(s => (
                                    <button key={s} onClick={() => setMspSeason(s)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${mspSeason === s ? 'bg-heritage-gold/20 text-heritage-gold' : 'bg-white/[0.05] text-text-muted'}`}
                                    >{s}</button>
                                ))}
                            </div>
                            <div className="flex gap-1 flex-wrap">
                                {categories.map(c => (
                                    <button key={c} onClick={() => setMspCategory(c)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${mspCategory === c ? 'bg-telangana-green/20 text-telangana-green' : 'bg-white/[0.05] text-text-muted'}`}
                                    >{c}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-4">
                        {filteredMsp.map(crop => <MspRow key={crop.name} crop={crop} />)}
                    </div>
                </div>
            )}

            {/* Schemes */}
            {activeTab === 'schemes' && (
                <div className="space-y-3">
                    {farmerSchemes.map(s => <SchemeCard key={s.id} scheme={s} />)}
                </div>
            )}

            {/* Market Rates */}
            {activeTab === 'market' && (
                <div className="space-y-4">
                    <p className="text-xs text-text-muted px-1">
                        APMC regulated market prices (Hybrid Sync) ·{' '}
                        <span className="text-text-secondary">Last updated: {liveMandi.lastUpdated || marketPrices.lastUpdated}</span>
                    </p>
                    <div className="glass-card p-4">
                        <h3 className="text-sm font-bold text-white mb-3">Live Mandi Rates</h3>
                        <div className="space-y-0">
                            {liveMandi.items.length > 0 ? (
                                liveMandi.items.map(c => (
                                    <div key={c.name} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                                        <p className="text-sm text-text-secondary">{c.name}</p>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white">₹{c.price.toLocaleString('en-IN')}</p>
                                            <p className="text-[9px] text-text-muted">{c.unit}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-text-muted">Loading live rates...</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Fallback Static Data */}
                    <div className="mt-6">
                        <p className="text-xs text-text-muted px-1 mb-2">Historical/Static APMC Data</p>
                        {marketPrices.markets.map(m => (
                            <div key={m.market} className="glass-card p-4 mb-4">
                                <h3 className="text-sm font-bold text-white mb-3">{m.market}</h3>
                                <div className="space-y-0">
                                    {m.commodities.map(c => (
                                        <div key={c.name} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                                            <p className="text-sm text-text-secondary">{c.name}</p>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-white">₹{c.price.toLocaleString('en-IN')}</p>
                                                <p className="text-[9px] text-text-muted">{c.unit}</p>
                                                {c.change !== 0 && (
                                                    <span className={`text-[9px] font-bold ${c.change > 0 ? 'text-red-400' : 'text-telangana-green'}`}>
                                                        {c.change > 0 ? '▲' : '▼'} ₹{Math.abs(c.change)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-text-muted px-1">
                        Source: Enum / Local Network Sync
                    </p>
                </div>
            )}

            {/* Crop Calendar */}
            {activeTab === 'calendar' && (
                <div className="space-y-3">
                    {cropCalendar.map((month, i) => (
                        <div key={month.month} className={`glass-card p-4 ${month.month === currentMonthName ? 'border border-telangana-green/30' : ''}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className={`text-sm font-bold ${month.month === currentMonthName ? 'text-telangana-green' : 'text-white'}`}>
                                    {month.month}
                                </h3>
                                {month.month === currentMonthName && (
                                    <span className="text-[9px] bg-telangana-green/10 text-telangana-green border border-telangana-green/20 px-2 py-0.5 rounded-full font-bold">Current Month</span>
                                )}
                            </div>
                            <ul className="space-y-1">
                                {month.activities.map((act, j) => (
                                    <li key={j} className="flex items-start gap-2 text-xs text-text-secondary">
                                        <span className="text-telangana-green mt-0.5 flex-shrink-0">•</span>
                                        {act}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
