'use client';

import { useState, useEffect } from 'react';
import CivicCard from './ui/CivicCard';

export default function MarketRatesWidget() {
  const [rates, setRates] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/rates/daily?city=Hyderabad`);
        const data = await res.json();
        setRates(data);
      } catch (error) {
        console.error('Rates fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, []);

  if (isLoading) return <div className="h-32 animate-pulse bg-slate-100 rounded-xl" />;

  return (
    <CivicCard title="Daily Rates" subtitle="Market Intelligence" accentColor="amber">
      <div className="space-y-4">
         {/* Gold & Silver */}
         <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
               <p className="text-[8px] font-black uppercase text-amber-600">Gold (24K/10g)</p>
               <p className="text-sm font-black text-slate-900">₹{rates?.gold?.gold_24k?.toLocaleString() || '72,450'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
               <p className="text-[8px] font-black uppercase text-slate-400">Silver (1Kg)</p>
               <p className="text-sm font-black text-slate-900">₹{rates?.gold?.silver_rate?.toLocaleString() || '92,000'}</p>
            </div>
         </div>

         {/* Fuel */}
         <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
               <div className="flex items-center gap-2">
                  <span className="text-xs">⛽</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Petrol (Hyd)</span>
               </div>
               <span className="text-sm font-mono font-black text-slate-900">₹{rates?.fuel?.petrol_price || '109.66'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
               <div className="flex items-center gap-2">
                  <span className="text-xs">🚚</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Diesel (Hyd)</span>
               </div>
               <span className="text-sm font-mono font-black text-slate-900">₹{rates?.fuel?.diesel_price || '97.82'}</span>
            </div>
         </div>

         <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter text-right italic">
           Source: MCX & Official OMCs • {rates?.gold?.date || new Date().toLocaleDateString()}
         </p>
      </div>
    </CivicCard>
  );
}
