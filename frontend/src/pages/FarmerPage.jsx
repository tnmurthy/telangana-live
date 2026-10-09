import { useState } from 'react';
import { BasketTable, MspTable, MandiSource } from '../components/MandiTables';
import { farmerSchemes, farmerHelplines, cropCalendar } from '../data/farmerData';

// The page showed crop advisories with pesticide doses dated April but labelled
// as this month, an MSP table labelled 2025-26 holding older figures (and MSPs
// for turmeric and chilli, which have none), and fixed April mandi prices
// credited to the Marketing Department (TL-44). MSP and mandi prices now come
// from the daily Agmarknet snapshot (TL-49).

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
    { key: 'msp', label: '💰 MSP Prices' },
    { key: 'schemes', label: '📋 Schemes' },
    { key: 'market', label: '📈 Market Rates' },
    { key: 'calendar', label: '🗓️ Crop Calendar' },
];

export default function FarmerPage() {
    const [activeTab, setActiveTab] = useState('schemes');
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
                            Schemes, helplines, MSP and mandi prices for Telangana farmers
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

            {/* MSP Prices */}
            {activeTab === 'msp' && (
                <div className="glass-card p-4 space-y-3">
                    <MspTable />
                    <MandiSource />
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
                <div className="glass-card p-4 space-y-3">
                    <BasketTable />
                    <MandiSource />
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
