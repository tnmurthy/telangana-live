import { fuelPrices } from '../data/fuelPrices';
import ShareWhatsApp from '../components/ShareWhatsApp';

export default function FuelLandingPage() {
    const { petrol, diesel, lpgHousehold, lpgVehicle, date, city } = fuelPrices;

    const cards = [
        { label: 'Petrol', ...petrol, color: 'text-emerald-400', icon: '⛽' },
        { label: 'Diesel', ...diesel, color: 'text-amber-400', icon: '🛢️' },
        { label: lpgHousehold.label, ...lpgHousehold, color: 'text-blue-400', icon: '🔥' },
        { label: lpgVehicle.label, ...lpgVehicle, color: 'text-purple-400', icon: '🚗' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="glass-card section-block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">⚡</div>
                <div className="relative z-10">
                    <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Fuel Rates: {city}</h2>
                    <p className="text-text-secondary font-medium italic">Latest updates for March 2026</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((f) => (
                    <div key={f.label} className="glass-card p-6 hover-lift border-white/5">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-2xl">{f.icon}</span>
                            <ShareWhatsApp type="fuel" data={{ type: f.label, price: f.price }} />
                        </div>
                        <h4 className="label-xs mb-2">{f.label}</h4>
                        <div className={`text-3xl font-bold ${f.color}`}>₹{f.price.toFixed(2)}</div>
                        <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider font-bold">{f.unit}</p>
                        <div className={`text-xs mt-3 flex items-center gap-1 font-bold ${f.change === 0 ? 'text-text-muted' : f.change > 0 ? 'text-danger' : 'text-success'}`}>
                            {f.change === 0 ? 'Steady' : f.change > 0 ? `▲ +₹${f.change.toFixed(2)}` : `▼ -₹${Math.abs(f.change).toFixed(2)}`}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card section-block">
                    <h3 className="label-xs mb-4">📍 District-wise Petrol Variation</h3>
                    <div className="space-y-3">
                        {[{ d: 'Hyderabad', p: 107.46 }, { d: 'Warangal', p: 108.12 }, { d: 'Nizamabad', p: 109.43 }, { d: 'Khammam', p: 108.85 }].map(item => (
                            <div key={item.d} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 text-sm">
                                <span className="text-text-secondary">{item.d}</span>
                                <span className="font-bold text-white">₹{item.p.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card section-block bg-blue-500/5">
                    <h3 className="label-xs mb-4">💡 Energy Saving Tip</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                        With summer approaching, ensure your vehicle tires are at optimum pressure to improve fuel efficiency by up to 3%. Early morning refueling is recommended for better density.
                    </p>
                </div>
            </div>
        </div>
    );
}
