'use client';

import { useState, useEffect } from 'react';
import CivicCard from './ui/CivicCard';
import { useLocale } from '@/lib/LocaleContext';

export default function PanchangWidget() {
  const { locale } = useLocale();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPanchang = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/panchang`);
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error('Panchang fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPanchang();
  }, []);

  if (isLoading) return <div className="h-48 animate-pulse bg-slate-100 rounded-xl" />;

  const isTelugu = locale === 'te';

  return (
    <CivicCard 
      title={isTelugu ? "తెలుగు పంచాంగం" : "Telugu Panchangam"} 
      subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      accentColor="amber"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="p-2 rounded bg-amber-50 border border-amber-100">
             <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">{isTelugu ? "తిథి" : "Tithi"}</p>
             <p className="text-xs font-bold text-slate-900">{data?.tithi}</p>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-100">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{isTelugu ? "నక్షత్రం" : "Nakshatra"}</p>
             <p className="text-xs font-bold text-slate-900">{data?.nakshatra}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-2 rounded bg-red-50 border border-red-100">
             <p className="text-[8px] font-black text-red-600 uppercase tracking-widest">{isTelugu ? "రాహుకాలం" : "Rahu Kaalam"}</p>
             <p className="text-xs font-bold text-slate-900">{data?.rahu_kaalam}</p>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-100">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sunrise / Sunset</p>
             <p className="text-xs font-bold text-slate-900">{data?.sunrise} / {data?.sunset}</p>
          </div>
        </div>
      </div>

      {data?.festivals?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
           <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Upcoming Festivals</p>
           <div className="flex flex-wrap gap-2">
              {data.festivals.map((f: string) => (
                <span key={f} className="text-[10px] font-bold text-slate-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  ✨ {f}
                </span>
              ))}
           </div>
        </div>
      )}
    </CivicCard>
  );
}
