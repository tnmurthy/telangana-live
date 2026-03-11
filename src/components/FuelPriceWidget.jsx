import { fuelPrices } from '../data/fuelPrices';
import ShareWhatsApp from './ShareWhatsApp';

/* ── SVG Icons for fuel types ── */
const fuelIcons = {
    petrol: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
        </svg>
    ),
    diesel: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18a.94.94 0 0 0-.662.274.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 1 2.153-1.116 48.019 48.019 0 0 1 7.803.89A2.25 2.25 0 0 1 21 12v1.393Z" />
        </svg>
    ),
    lpgHome: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        </svg>
    ),
    cngAuto: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V11.25c0-2.209-1.791-4-4-4h-.338l-.933-2.8A2.25 2.25 0 0 0 14.967 3H9.033a2.25 2.25 0 0 0-2.137 1.547l-.934 2.8A4.001 4.001 0 0 0 2 11.25v5.625A1.125 1.125 0 0 0 3.375 18" />
        </svg>
    ),
};

const fuelColors = {
    petrol: 'bg-emerald-500/12 text-emerald-400',
    diesel: 'bg-amber-500/12 text-amber-400',
    lpgHome: 'bg-blue-500/12 text-blue-400',
    cngAuto: 'bg-purple-500/12 text-purple-400',
};

export default function FuelPriceWidget() {
    const fuels = [
        { label: 'Petrol', ...petrol, iconKey: 'petrol', unit: petrol.unit },
        { label: 'Diesel', ...diesel, iconKey: 'diesel', unit: diesel.unit },
        { label: lpgHousehold.label, ...lpgHousehold, iconKey: 'lpgHome', unit: lpgHousehold.unit },
        { label: cngVehicle.label, ...cngVehicle, iconKey: 'cngAuto', unit: cngVehicle.unit },
    ];

    return (
        <div className="glass-card section-block animate-fade-in h-full">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-heading font-bold text-white text-base sm:text-lg tracking-tight">Fuel Prices</h3>
                    <p className="section-subtitle">{city} daily rates</p>
                </div>
                <span className="date-badge">{date}</span>
            </div>

            {/* Compact table layout */}
            <div className="overflow-x-auto scroll-x-mobile">
                <table className="w-full min-w-[300px] text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            <th className="text-left py-1.5 pr-3 label-xs">Fuel</th>
                            <th className="text-right py-1.5 px-3 label-xs">Rate</th>
                            <th className="text-right py-1.5 pl-3 label-xs">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fuels.map((f) => {
                            const isPositive = f.change > 0;
                            const isZero = f.change === 0;
                            return (
                                <tr key={f.label} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                    <td className="py-2 pr-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-lg ${fuelColors[f.iconKey]} flex items-center justify-center`}>
                                                {fuelIcons[f.iconKey]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-semibold text-white">{f.label}</span>
                                                    <ShareWhatsApp type="fuel" data={{ type: f.label, price: f.price, unit: f.unit }} className="!p-0 opacity-0 group-hover:opacity-100" />
                                                </div>
                                                <span className="text-[10px] text-text-muted block">{f.unit}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-right py-2 px-3 font-bold">
                                        <span className="text-white text-sm">₹{f.price.toFixed(2)}</span>
                                    </td>
                                    <td className="text-right py-2 pl-3">
                                        {isZero ? (
                                            <span className="text-text-muted text-xs">—</span>
                                        ) : (
                                            <span className={`text-xs font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-danger' : 'text-success'}`}>
                                                <svg className={`w-2.5 h-2.5 ${isPositive ? '' : 'rotate-180'}`} viewBox="0 0 12 12" fill="currentColor">
                                                    <path d="M6 2L10 8H2L6 2Z" />
                                                </svg>
                                                ₹{Math.abs(f.change).toFixed(2)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
