'use client';

import { useState, useEffect } from 'react';
import CivicCard from './ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function BudgetWidget() {
  const { selectedArea } = useArea();
  const [budget, setBudget] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudget = async () => {
      setIsLoading(true);
      try {
        const areaId = selectedArea?.id || 'all';
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/budget?area_id=${areaId}`);
        const data = await res.json();
        setBudget(data);
      } catch (error) {
        console.error('Budget fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBudget();
  }, [selectedArea]);

  if (isLoading) return <div className="h-64 animate-pulse bg-slate-100 rounded-xl" />;

  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-slate-400'
  ];

  return (
    <CivicCard title="Budget Explainer" subtitle="Where your tax money goes" accentColor="blue">
      <div className="space-y-6">
        {/* Simplified Stacked Bar */}
        <div className="w-full h-8 flex rounded-lg overflow-hidden shadow-inner border border-slate-100">
           {budget.map((item, idx) => (
             <div 
               key={item.category}
               className={`${colors[idx % colors.length]} h-full transition-all hover:opacity-80 cursor-help`}
               style={{ width: `${item.percentage}%` }}
               title={`${item.category}: ${item.percentage}%`}
             />
           ))}
        </div>

        {/* Legend / Breakdown */}
        <div className="grid grid-cols-1 gap-3">
           {budget.map((item, idx) => (
             <div key={item.category} className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                   <span className="font-bold text-slate-500 uppercase tracking-tighter">{item.category}</span>
                </div>
                <div className="text-right">
                   <span className="font-black text-slate-900">₹{(item.allocation_cr / 100).toFixed(1)}k Cr</span>
                   <span className="ml-2 text-slate-400 font-medium">({item.percentage}%)</span>
                </div>
             </div>
           ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
             Data based on the <span className="text-blue-600 underline">2026-27 Municipal Budget</span>.
           </p>
        </div>
      </div>
    </CivicCard>
  );
}
