'use client';

import { useState } from 'react';
import CivicCard from './ui/CivicCard';

export default function PowerTariffWidget() {
  const [units, setUnits] = useState(100);

  const calculateBill = (u: number) => {
    // Simplified TSSPDCL Domestic LT-I Category
    if (u <= 50) return u * 1.45;
    if (u <= 100) return (50 * 1.45) + (u - 50) * 2.60;
    if (u <= 200) return (50 * 1.45) + (50 * 2.60) + (u - 100) * 4.30;
    return (50 * 1.45) + (50 * 2.60) + (100 * 4.30) + (u - 200) * 9.50;
  };

  return (
    <CivicCard title="Power Tariff" subtitle="Bill Calculator" accentColor="blue">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Monthly Units (kWh)</label>
          <input 
            type="range" 
            min="0" max="500" 
            value={units} 
            onChange={(e) => setUnits(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-2">
             <span className="text-xs font-black text-slate-900">{units} Units</span>
             <span className="text-xs font-black text-blue-600">₹{calculateBill(units).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-800 uppercase tracking-tight leading-relaxed">
           Estimate based on <span className="underline">TSSPDCL LT-I (Domestic)</span> slab rates. Fixed charges & taxes extra.
        </div>
      </div>
    </CivicCard>
  );
}
