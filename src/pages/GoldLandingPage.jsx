import { goldRates } from '../data/goldRates';
import ShareWhatsApp from '../components/ShareWhatsApp';
import DateTimeBar from '../components/DateTimeBar';

export default function GoldLandingPage() {
    const { gold22k, gold24k, silver, date, history } = goldRates;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="glass-card section-block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">✨</div>
                <div className="relative z-10">
                    <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Hyderabad Gold Rates</h2>
                    <p className="text-text-secondary font-medium italic">Standardized 22K & 24K Market Prices · March 2026</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-heritage-gold/20">
                    <div className="flex justify-between items-start mb-4">
                        <span className="label-xs">Gold 22K (Per Gram)</span>
                        <ShareWhatsApp type="gold" data={{ label: '22K', price: gold22k.price, unit: 'g' }} />
                    </div>
                    <div className="text-4xl font-bold gold-text">₹{gold22k.price.toLocaleString()}</div>
                    <p className={`text-sm mt-2 font-bold ${gold22k.change < 0 ? 'text-danger' : 'text-success'}`}>
                        {gold22k.change < 0 ? '▼' : '▲'} ₹{Math.abs(gold22k.change)} today
                    </p>
                </div>
                <div className="glass-card p-6 border-heritage-gold/20">
                    <div className="flex justify-between items-start mb-4">
                        <span className="label-xs">Gold 24K (Per Gram)</span>
                        <ShareWhatsApp type="gold" data={{ label: '24K', price: gold24k.price, unit: 'g' }} />
                    </div>
                    <div className="text-4xl font-bold gold-text">₹{gold24k.price.toLocaleString()}</div>
                    <p className={`text-sm mt-2 font-bold ${gold24k.change < 0 ? 'text-danger' : 'text-success'}`}>
                        {gold24k.change < 0 ? '▼' : '▲'} ₹{Math.abs(gold24k.change)} today
                    </p>
                </div>
                <div className="glass-card p-6 border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <span className="label-xs">Silver (Per Kg)</span>
                        <ShareWhatsApp type="gold" data={{ label: 'Silver', price: silver.price, unit: 'kg' }} />
                    </div>
                    <div className="text-4xl font-bold text-gray-200">₹{silver.price.toLocaleString()}</div>
                    <p className={`text-sm mt-2 font-bold ${silver.change < 0 ? 'text-danger' : 'text-success'}`}>
                        {silver.change < 0 ? '▼' : '▲'} ₹{Math.abs(silver.change)} today
                    </p>
                </div>
            </div>

            <div className="glass-card section-block">
                <h3 className="section-title mb-6 flex items-center gap-2">
                    <span className="gold-text">📊</span> 7-Day Market History
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-text-muted text-xs uppercase tracking-widest">
                                <th className="py-4">Date</th>
                                <th className="py-4">Gold 22K (₹/g)</th>
                                <th className="py-4">Gold 24K (₹/g)</th>
                                <th className="py-4">Change</th>
                            </tr>
                        </thead>
                        <tbody className="text-white text-sm">
                            {history.map((row, i) => (
                                <tr key={row.date} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4">{row.date}</td>
                                    <td className="py-4 font-bold">{row.gold22k.toLocaleString()}</td>
                                    <td className="py-4 font-bold">{row.gold24k.toLocaleString()}</td>
                                    <td className="py-4">
                                        {i < history.length - 1 ? (
                                            <span className={row.gold22k - history[i + 1].gold22k < 0 ? 'text-danger' : 'text-success'}>
                                                {row.gold22k - history[i + 1].gold22k < 0 ? '▼' : '▲'} {Math.abs(row.gold22k - history[i + 1].gold22k)}
                                            </span>
                                        ) : '---'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glass-card section-block bg-heritage-gold/5">
                <h3 className="label-xs mb-4">💡 Buyer's Guide March 2026</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                    Market analysis suggests a stabilization phase after the recent 2% dip. Experts recommend monitoring the international indices before large purchases. GST of 3% is applicable on finished jewelry.
                </p>
            </div>
        </div>
    );
}
