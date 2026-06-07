'use client';

import { useState, useEffect } from 'react';
import CivicCard from './ui/CivicCard';

export default function MandiPricesWidget() {
  const [prices, setPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/rates/market`);
        const data = await res.json();
        setPrices(data);
      } catch (error) {
        console.error('Mandi fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
  }, []);

  if (isLoading) return <div className="h-48 animate-pulse bg-slate-100 rounded-xl" />;

  return (
    <CivicCard title="Mandi Watch" subtitle="Essential Commodity Prices" accentColor="green">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {prices.length > 0 ? prices.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-200 transition-all">
               <div className="flex items-center gap-3">
                  <span className="text-lg">🥗</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 uppercase leading-none">{item.commodity}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{item.market} Market</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">₹{item.modal_price}</p>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">per {item.unit}</p>
               </div>
            </div>
          )) : (
            <p className="text-[10px] text-slate-400 italic text-center py-4 uppercase font-bold">Waiting for today's market opening...</p>
          )}
        </div>
        
        <button className="w-full py-2 rounded-lg bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md">
          View 45+ Markets →
        </button>
      </div>
    </CivicCard>
  );
}
