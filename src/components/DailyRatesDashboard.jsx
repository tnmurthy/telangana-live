import { goldRates } from '../data/goldRates';
import ShareWhatsApp from './ShareWhatsApp';

function PriceChange({ change }) {
    const isPositive = change > 0;
    const isZero = change === 0;
    return (
        <span className={`text-sm font-bold flex items-center gap-1.5 mt-2 ${isZero ? 'text-text-muted' : isPositive ? 'text-success' : 'text-danger'}`}>
            {!isZero && (
                <svg className={`w-3.5 h-3.5 ${isPositive ? '' : 'rotate-180'}`} viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 2L10 8H2L6 2Z" />
                </svg>
            )}
            {isZero ? 'No change' : `${isPositive ? '+' : ''}₹${Math.abs(change)}`}
        </span>
    );
}

function RateCard({ label, price, change, unit, accent, type }) {
    return (
        <div className="glass-card hover-lift p-5 sm:p-6 min-w-[200px] sm:min-w-0 flex-1">
            <div className="flex items-center justify-between mb-3">
                <span className="label-xs">{label}</span>
                <ShareWhatsApp type="gold" data={{ label, price, unit }} />
            </div>
            <div className="flex items-end gap-2">
                <span className={`price-value text-2xl sm:text-3xl ${accent}`}>₹{price.toLocaleString()}</span>
                <span className="text-xs text-text-muted mb-1 font-medium">{unit}</span>
            </div>
            <PriceChange change={change} />
        </div>
    );
}


export default function DailyRatesDashboard() {
    const { gold22k, gold24k, silver, date, history } = goldRates;

    return (
        <section id="rates" className="animate-fade-in">
            <div className="section-header">
                <div>
                    <h2 className="section-title flex items-center gap-2">
                        <span className="gold-text">✦</span> Daily Rates
                    </h2>
                    <p className="section-subtitle">{goldRates.city} market prices</p>
                </div>
                <span className="date-badge">{date}</span>
            </div>

            {/* Rate Cards */}
            <div className="overflow-x-auto scroll-x-mobile -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-3 sm:gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                    <RateCard label="Gold 22K" price={gold22k.price} change={gold22k.change} unit={gold22k.unit} accent="gold-text" />
                    <RateCard label="Gold 24K" price={gold24k.price} change={gold24k.change} unit={gold24k.unit} accent="gold-text" />
                    <RateCard label="Silver" price={silver.price} change={silver.change} unit={silver.unit} accent="text-gray-200" />
                </div>
            </div>

            {/* 7-Day History */}
            <div className="mt-4 glass-card section-block overflow-x-auto scroll-x-mobile">
                <h3 className="label-xs mb-3">7-Day Trend</h3>
                <table className="w-full min-w-[400px] text-sm">
                    <thead>
                        <tr className="text-text-muted border-b border-white/[0.06]">
                            <th className="text-left py-2 pr-4 label-xs">Date</th>
                            <th className="text-right py-2 px-4 label-xs">22K (₹/g)</th>
                            <th className="text-right py-2 pl-4 label-xs">24K (₹/g)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((row, idx) => (
                            <tr key={row.date} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                <td className="py-2.5 pr-4 text-text-secondary text-sm font-medium">{row.date}</td>
                                <td className="text-right py-2.5 px-4 gold-text font-bold text-sm">₹{row.gold22k.toLocaleString()}</td>
                                <td className="text-right py-2.5 pl-4 gold-text font-bold text-sm">₹{row.gold24k.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
