import { useState } from 'react';
import { goldRates } from '../data/goldRates';
import { fuelPrices } from '../data/fuelPrices';
import { pulsesData } from '../data/pulses';
import ShareWhatsApp from './ShareWhatsApp';
import FuelTaxCard from './FuelTaxCard';

function PriceChange({ change }) {
    const isPositive = change > 0;
    const isZero = change === 0;
    return (
        <span className={`text-xs font-bold flex items-center gap-1 ${isZero ? 'text-text-muted' : isPositive ? 'text-success' : 'text-danger'}`}>
            {!isZero && (
                <svg className={`w-2.5 h-2.5 ${isPositive ? '' : 'rotate-180'}`} viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 2L10 8H2L6 2Z" />
                </svg>
            )}
            {isZero ? '—' : `${isPositive ? '+' : ''}₹${Math.abs(change)}`}
        </span>
    );
}

/* Tab definitions */
const historyTabs = [
    { key: 'gold22k', label: '22K', field: 'gold22k', unit: '₹/g' },
    { key: 'gold24k', label: '24K', field: 'gold24k', unit: '₹/g' },
    { key: 'silver', label: 'Silver', field: 'silver', unit: '₹/kg' },
];

export default function DailyRatesDashboard() {
    const { gold22k, gold24k, silver, date, history } = goldRates;
    const [activeTab, setActiveTab] = useState('gold22k');
    const currentTab = historyTabs.find(t => t.key === activeTab);

    const rateItems = [
        { label: 'Gold 22K', key: 'gold22k', price: gold22k.price, change: gold22k.change, unit: gold22k.unit, accent: 'gold-text' },
        { label: 'Gold 24K', key: 'gold24k', price: gold24k.price, change: gold24k.change, unit: gold24k.unit, accent: 'gold-text' },
        { label: 'Silver', key: 'silver', price: silver.price, change: silver.change, unit: silver.unit, accent: 'text-gray-300' },
    ];

    return (
        <div className="glass-card section-block animate-fade-in h-full hover-lift-gold">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-heading font-bold text-white text-base sm:text-lg tracking-tight flex items-center gap-2">
                        <svg className="w-4 h-4 text-heritage-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                        </svg>
                        Daily Rates
                    </h3>
                    <p className="section-subtitle">{goldRates.city} market</p>
                </div>
                <span className="date-badge">{date}</span>
            </div>

            {/* Compact rate summary row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
                {rateItems.map((r) => (
                    <button
                        key={r.key}
                        onClick={() => setActiveTab(r.key)}
                        className={`text-left p-2.5 rounded-xl transition-all ${activeTab === r.key ? 'bg-white/[0.06] ring-1 ring-heritage-gold/30' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
                    >
                        <div className="label-xs mb-1">{r.label}</div>
                        <div className="flex items-end gap-1">
                            <span className={`price-value text-sm sm:text-base ${r.accent}`}>₹{r.price.toLocaleString()}</span>
                        </div>
                        <PriceChange change={r.change} />
                    </button>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between mb-2">
                <h4 className="label-xs">7-Day Trend</h4>
                <div className="flex gap-1">
                    {historyTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-all uppercase tracking-wider ${activeTab === tab.key
                                ? 'bg-heritage-gold/15 text-heritage-gold'
                                : 'text-text-muted hover:text-text-secondary'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Compact Table — same style as PowerTariffCard */}
            <div className="overflow-x-auto scroll-x-mobile">
                <table className="w-full min-w-[280px] text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            <th className="text-left py-1.5 pr-3 label-xs">Date</th>
                            <th className="text-right py-1.5 px-3 label-xs">Price</th>
                            <th className="text-right py-1.5 pl-3 label-xs">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((row, idx) => {
                            const value = row[currentTab.field];
                            const prev = idx > 0 ? history[idx - 1][currentTab.field] : null;
                            const diff = prev !== null ? value - prev : null;
                            return (
                                <tr key={row.date} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                    <td className="py-1.5 pr-3 text-text-secondary text-xs font-medium">{row.date}</td>
                                    <td className="text-right py-1.5 px-3 font-bold">
                                        <span className="gold-text text-xs">₹{value.toLocaleString()}</span>
                                    </td>
                                    <td className="text-right py-1.5 pl-3">
                                        {diff !== null ? (
                                            <span className={`text-[11px] font-bold ${diff > 0 ? 'text-success' : diff < 0 ? 'text-danger' : 'text-text-muted'}`}>
                                                {diff === 0 ? '—' : `${diff > 0 ? '+' : ''}₹${diff}`}
                                            </span>
                                        ) : (
                                            <span className="text-text-muted text-[11px]">—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Essential Commodities Section — NEW */}
            <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="label-xs flex items-center gap-1.5">
                        <Icons.TrendingUp className="w-3 h-3 text-success" />
                        Essential Commodities
                    </h4>
                    <span className="text-[10px] text-text-muted italic">Market Avg.</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {pulsesData.commodities.slice(0, 4).map((item) => (
                        <div key={item.name} className="bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
                            <div className="flex justify-between items-start mb-0.5">
                                <span className="text-[11px] font-medium text-text-secondary">{item.name}</span>
                                <PriceChange change={item.change} />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-white">₹{item.price}</span>
                                <span className="text-[9px] text-text-muted">/{item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fuel Prices & Tax Breakup — NEW */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="label-xs flex items-center gap-1.5 uppercase tracking-wider">
                        <Icons.TrendingUp className="w-3 h-3 text-heritage-gold" />
                        Fuel Transparency (Hyderabad)
                    </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FuelTaxCard type="Petrol" data={fuelPrices.petrol} />
                    <FuelTaxCard type="Diesel" data={fuelPrices.diesel} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="glass-card p-3 bg-white/[0.02]">
                        <div className="label-xs text-[9px] mb-1">{fuelPrices.lpgHousehold.label}</div>
                        <div className="flex justify-between items-end">
                            <span className="text-base font-bold text-white">₹{fuelPrices.lpgHousehold.price}</span>
                            <span className="text-[10px] text-success font-bold">GST 5% Inc.</span>
                        </div>
                    </div>
                    <div className="glass-card p-3 bg-white/[0.02]">
                        <div className="label-xs text-[9px] mb-1">{fuelPrices.cngVehicle.label}</div>
                        <div className="flex justify-between items-end">
                            <span className="text-base font-bold text-white">₹{fuelPrices.cngVehicle.price}</span>
                            <span className="text-[10px] text-blue-400 font-bold">GST 12% Inc.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
