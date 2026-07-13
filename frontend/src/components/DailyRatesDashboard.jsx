import { useState, useEffect } from 'react';
import { goldRates as staticGoldRates } from '../data/goldRates';
import { fuelPrices as staticFuelPrices } from '../data/fuelPrices';
import { pulses as pulsesData } from '../data/pulses';
import newsData from '../data/news.json';
import { fetchGoldRates, fetchFuelPrices } from '../services/pricesService';
import ShareWhatsApp from './ShareWhatsApp';
import FuelTaxCard from './FuelTaxCard';
import { Icons } from './Icons';

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
    { key: 'silver', label: 'Silver', field: 'silver', unit: '₹/g' },
];

export default function DailyRatesDashboard() {
    const [goldRates, setGoldRates] = useState(staticGoldRates);
    const [fuelPrices, setFuelPrices] = useState(staticFuelPrices);
    const [activeTab, setActiveTab] = useState('gold22k');

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        // GTM Tracking Event
        if (window.dataLayer) {
            window.dataLayer.push({
                event: 'utility_interaction',
                utility_type: 'gold_rates',
                interaction_detail: `view_${tabKey}`
            });
        }
    };

    useEffect(() => {
        fetchGoldRates().then(data => {
            if (data?.gold22k) {
                setGoldRates(prev => ({
                    ...prev,
                    gold22k: { ...prev.gold22k, price: data.gold22k.price, change: data.gold22k.change ?? prev.gold22k.change },
                    gold24k: { ...prev.gold24k, price: data.gold24k.price, change: data.gold24k.change ?? prev.gold24k.change },
                    silver:  { ...prev.silver,  price: data.silver.price,  change: data.silver.change  ?? prev.silver.change  },
                    date: data.lastUpdated ? new Date(data.lastUpdated).toISOString().slice(0, 10) : prev.date,
                }));
            }
        }).catch(() => {});

        fetchFuelPrices().then(data => {
            if (data?.petrol) {
                setFuelPrices(prev => ({
                    ...prev,
                    petrol: { ...prev.petrol, price: data.petrol.price, change: data.petrol.change ?? 0 },
                    diesel: { ...prev.diesel, price: data.diesel.price, change: data.diesel.change ?? 0 },
                    ...(data.lpg    ? { lpgHousehold: { ...prev.lpgHousehold, price: data.lpg.price,    change: data.lpg.change    ?? 0 } } : {}),
                    ...(data.cng    ? { cngVehicle:   { ...prev.cngVehicle,   price: data.cng.price,    change: data.cng.change    ?? 0 } } : {}),
                    date: data.lastUpdated ? new Date(data.lastUpdated).toISOString().slice(0, 10) : prev.date,
                }));
            }
        }).catch(() => {});
    }, []);

    const [newsExpanded, setNewsExpanded] = useState(false);

    const { gold22k, gold24k, silver, date, history } = goldRates;
    const currentTab = historyTabs.find(t => t.key === activeTab);

    // Filter news matching gold_rate, fuel_price, or mandi_price
    const marketNews = newsData?.filter(article => 
        article.correlated_civic_entities?.some(ent => 
            ent.entity_type === 'gold_rate' || 
            ent.entity_type === 'fuel_price' || 
            ent.entity_type === 'mandi_price'
        )
    ) || [];

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
                            onClick={() => handleTabChange(tab.key)}
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
                        Fuel Prices (Hyderabad)
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

            {/* Market News Panel */}
            {marketNews && marketNews.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/[0.08]">
                    <button 
                        onClick={() => setNewsExpanded(!newsExpanded)}
                        className="w-full flex items-center justify-between label-xs text-heritage-gold mb-2.5 hover:text-white transition-colors"
                    >
                        <span className="flex items-center gap-1.5">
                            <Icons.TrendingUp className="w-3.5 h-3.5" />
                            Market News & Inflation Analysis
                        </span>
                        <span className="text-[10px] text-text-muted">
                            {newsExpanded ? 'Hide' : `Show (${marketNews.length})`}
                        </span>
                    </button>
                    {newsExpanded && (
                        <div className="space-y-2 animate-slide-down">
                            {marketNews.slice(0, 3).map((news, idx) => (
                                <a 
                                    key={idx} 
                                    href={news.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-all text-xs"
                                >
                                    <div className="text-white font-semibold line-clamp-1 hover:text-heritage-gold">{news.title}</div>
                                    <div className="flex justify-between text-[9px] text-text-muted mt-1.5">
                                        <span>{news.source}</span>
                                        <span>{news.published}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
