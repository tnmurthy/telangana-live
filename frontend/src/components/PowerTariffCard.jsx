import { powerTariff } from '../data/alerts';

export default function PowerTariffCard({ variant = 'default' }) {
    const isDistrict = variant === 'district';
    return (
        <div className={`${isDistrict ? 'rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-4' : 'glass-card section-block'} animate-fade-in h-full flex flex-col`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-heading font-bold text-white text-base sm:text-lg tracking-tight flex items-center gap-2">
                        ⚡ TS Power Tariff
                    </h3>
                    <p className="section-subtitle">TSSPDCL / TSNPDCL</p>
                </div>
                <span className="date-badge">{powerTariff.lastUpdated}</span>
            </div>

            <div className="overflow-x-auto scroll-x-mobile flex-1">
                <table className="w-full min-w-[340px] text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            <th className="text-left py-2 pr-3 label-xs">Category</th>
                            <th className="text-right py-2 px-3 label-xs">Rate</th>
                            <th className="text-right py-2 pl-3 label-xs">Slab</th>
                        </tr>
                    </thead>
                    <tbody>
                        {powerTariff.categories.map((cat, idx) => (
                            <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                <td className="py-2 pr-3 text-text-secondary text-xs font-medium">{cat.name}</td>
                                <td className="text-right py-2 px-3 font-bold">
                                    {cat.rate === 0
                                        ? <span className="text-success text-xs bg-success/10 px-2 py-0.5 rounded-full">Free</span>
                                        : <span className="gold-text text-xs">₹{cat.rate.toFixed(2)}</span>
                                    }
                                </td>
                                <td className="text-right py-2 pl-3 text-text-muted text-[11px]">{cat.slab}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
