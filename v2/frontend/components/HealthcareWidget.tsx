'use client';

import { useState, useEffect } from 'react';
import CivicCard from './ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function HealthcareWidget() {
  const { selectedArea } = useArea();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHealthcare = async () => {
      setIsLoading(true);
      try {
        const areaId = selectedArea?.id || 'all';
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/healthcare?area_id=${areaId}`);
        const data = await res.json();
        setFacilities(data);
      } catch (error) {
        console.error('Healthcare fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHealthcare();
  }, [selectedArea]);

  if (isLoading) return <div className="h-48 animate-pulse bg-slate-100 rounded-xl" />;

  return (
    <CivicCard title="Local Healthcare" subtitle="Nearby Basthi Dawakhanas" accentColor="green">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {facilities.length > 0 ? facilities.map((f, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-200 transition-all">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase leading-none">{f.name}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{f.address}</p>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Free
                  </span>
               </div>
               <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100/50">
                  <p className="text-[9px] font-bold text-slate-500 uppercase italic">🕐 {f.timings}</p>
                  <a href={`tel:${f.phone}`} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">📞 Call Clinic</a>
               </div>
            </div>
          )) : (
            <p className="text-[10px] text-slate-400 italic text-center py-4 uppercase font-bold">Search within your ward...</p>
          )}
        </div>
      </div>
    </CivicCard>
  );
}
