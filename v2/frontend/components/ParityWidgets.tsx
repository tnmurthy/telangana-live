'use client';

import { useState, useEffect } from 'react';
import CivicCard from './ui/CivicCard';

export default function ParityWidgets() {
  const [shloka, setShloka] = useState<any>(null);
  const [agri, setAgri] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParityData = async () => {
      try {
        const [shlokaRes, agriRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/parity/shloka`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/parity/agri`)
        ]);
        setShloka(await shlokaRes.json());
        setAgri(await agriRes.json());
      } catch (e) {
        console.error('Parity fetch error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchParityData();
  }, []);

  if (isLoading) return <div className="h-32 animate-pulse bg-slate-100 rounded-xl" />;

  return (
    <div className="space-y-6">
      {/* Daily Shloka (Spiritual Parity) */}
      <CivicCard title="Daily Wisdom" subtitle="Spiritual Pulse" className="bg-slate-900 text-white border-none shadow-xl">
         <div className="text-center space-y-3 py-2">
            <p className="text-lg font-serif italic text-emerald-400">"{shloka?.sanskrit}"</p>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">{shloka?.telugu}</p>
            <p className="text-[10px] text-slate-500 italic mt-2">— {shloka?.meaning}</p>
         </div>
      </CivicCard>

      {/* Agri Intelligence (Farmer Parity) */}
      <CivicCard title="Agri Pulse" subtitle="Farmer Advisories" accentColor="green">
         <div className="space-y-3">
            {agri.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-emerald-600 uppercase">{item.crop}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                      item.urgency === 'high' ? 'bg-red-100 text-red-600' : 'bg-white text-emerald-600'
                    }`}>{item.urgency}</span>
                 </div>
                 <p className="text-xs font-medium text-slate-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
         </div>
      </CivicCard>
    </div>
  );
}
