import { fuelPrices } from '../data/fuelPrices';
import ShareWhatsApp from './ShareWhatsApp';

const fuelIcons = {
    petrol: '⛽',
    diesel: '🛢️',
    lpgHome: '🔥',
    lpgAuto: '🚗',
};

const fuelColors = {
    petrol: 'bg-emerald-500/12',
    diesel: 'bg-amber-500/12',
    lpgHome: 'bg-blue-500/12',
    lpgAuto: 'bg-purple-500/12',
};

function FuelCard({ label, price, change, unit, iconKey }) {
    const isPositive = change > 0;
    const isZero = change === 0;

    return (
        <div className="glass-card hover-lift p-5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${fuelColors[iconKey]} flex items-center justify-center text-lg`}>
                        {fuelIcons[iconKey]}
                    </div>
                    <span className="label-xs leading-tight">{label}</span>
                </div>
                <ShareWhatsApp type="fuel" data={{ type: label, price }} />
            </div>
            <div className="flex items-end gap-1.5 mb-1">
                <span className="price-value text-xl sm:text-2xl text-white">₹{price.toFixed(2)}</span>
                <span className="text-[10px] text-text-muted mb-0.5 font-medium">{unit}</span>
            </div>
            <div className={`text-xs font-bold flex items-center gap-1.5 mt-1.5 ${isZero ? 'text-text-muted' : isPositive ? 'text-danger' : 'text-success'}`}>
                {!isZero && (
                    <svg className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 2L10 8H2L6 2Z" />
                    </svg>
                )}
                {isZero ? 'No change' : `${isPositive ? '+' : ''}₹${Math.abs(change).toFixed(2)}`}
            </div>
        </div>
    );
}


export default function FuelPriceWidget() {
    const { petrol, diesel, lpgHousehold, lpgVehicle, date, city } = fuelPrices;

    return (
        <section className="animate-fade-in">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Fuel Prices</h2>
                    <p className="section-subtitle">{city} daily rates</p>
                </div>
                <span className="date-badge">{date}</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <FuelCard label="Petrol" price={petrol.price} change={petrol.change} unit={petrol.unit} iconKey="petrol" />
                <FuelCard label="Diesel" price={diesel.price} change={diesel.change} unit={diesel.unit} iconKey="diesel" />
                <FuelCard label={lpgHousehold.label} price={lpgHousehold.price} change={lpgHousehold.change} unit={lpgHousehold.unit} iconKey="lpgHome" />
                <FuelCard label={lpgVehicle.label} price={lpgVehicle.price} change={lpgVehicle.change} unit={lpgVehicle.unit} iconKey="lpgAuto" />
            </div>
        </section>
    );
}
