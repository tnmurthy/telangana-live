import React from 'react';
import { Icons } from './Icons';

export default function FuelTaxCard({ type, data }) {
    if (!data || !data.taxBreakup) return null;

    const { price, unit, taxBreakup } = data;
    const labels = {
        basePrice: "Base Price",
        exciseDuty: "Central Excise",
        vatPercent: "State VAT (TS)",
        dealerCommission: "Dealer Commission",
        centralExcise: "Central Excise",
        stateVAT: "State VAT (TS)",
        gst: "GST",
        distributorCommission: "Distributor Comm.",
        excise: "Addl. Excise"
    };

    return (
        <div className="glass-card p-4 animate-fade-in border-white/[0.05]">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white uppercase text-xs tracking-widest flex items-center gap-2">
                    <Icons.Tools className="w-3.5 h-3.5 text-heritage-gold" />
                    {type} TAX BREAKUP
                </h4>
                <span className="text-xs font-bold text-text-secondary">
                    Total: <span className="gold-text">₹{price}</span>/{unit}
                </span>
            </div>

            <div className="space-y-2.5">
                {Object.entries(taxBreakup).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-[11px]">
                        <span className="text-text-muted">{labels[key] || key}</span>
                        <div className="flex-grow mx-2 border-b border-white/[0.05] border-dotted"></div>
                        <span className="font-mono text-white">₹{value.toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-2 bg-heritage-gold/5 rounded-lg border border-heritage-gold/10">
                <p className="text-[10px] text-heritage-gold/80 italic leading-snug">
                    *Taxes are approximate and subject to daily revision by OMCs and Govt. notifications.
                </p>
            </div>
        </div>
    );
}
