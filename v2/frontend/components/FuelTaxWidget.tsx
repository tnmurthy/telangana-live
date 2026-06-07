'use client';

import CivicCard from './ui/CivicCard';

export default function FuelTaxWidget() {
  return (
    <CivicCard title="Fuel Tax Breakdown" subtitle="Price Transparency" accentColor="amber">
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-slate-100 pb-2">
           <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Total Price (Hyd)</p>
              <p className="text-lg font-black text-slate-900">₹109.66 /L</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black uppercase text-amber-600">Tax Component</p>
              <p className="text-sm font-bold text-amber-600">₹42.34 (38.6%)</p>
           </div>
        </div>

        <div className="space-y-2">
           <div className="flex justify-between text-[9px] font-bold uppercase">
              <span className="text-slate-500">Central Excise</span>
              <span className="text-slate-900">₹19.90</span>
           </div>
           <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400 w-[18%]" />
           </div>

           <div className="flex justify-between text-[9px] font-bold uppercase">
              <span className="text-slate-500">State VAT</span>
              <span className="text-slate-900">₹22.44</span>
           </div>
           <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[20%]" />
           </div>
        </div>
        
        <p className="text-[8px] text-slate-400 italic text-center uppercase font-bold">Updated daily based on official OMC pricing notifications.</p>
      </div>
    </CivicCard>
  );
}
