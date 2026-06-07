'use client';

import { useState, useEffect } from 'react';
import CivicCard from './ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function MeeSevaWidget() {
  const { selectedArea } = useArea();
  const [centers, setCenters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeeSeva = async () => {
      setIsLoading(true);
      try {
        const areaId = selectedArea?.id || 'all';
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/mee-seva?area_id=${areaId}`);
        const data = await res.json();
        setCenters(data);
      } catch (error) {
        console.error('Mee Seva fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeeSeva();
  }, [selectedArea]);

  if (isLoading) return <div className="h-48 animate-pulse bg-slate-100 rounded-xl" />;

  return (
    <CivicCard title="Mee Seva Centers" subtitle="Official Government Service Points" accentColor="blue">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {centers.length > 0 ? centers.map((c, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 transition-all">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase leading-none">{c.name}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-1">{c.address}</p>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                    Open
                  </span>
               </div>
               
               <div className="mt-3 flex flex-wrap gap-1">
                  {c.services.slice(0, 3).map((s: string) => (
                    <span key={s} className="text-[7px] font-black uppercase px-1.5 py-0.5 bg-white border border-slate-100 text-slate-500 rounded">
                      {s}
                    </span>
                  ))}
               </div>

               <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100/50">
                  <a href={`tel:${c.phone}`} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">📞 {c.phone}</a>
                  <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">📍 Get Directions</button>
               </div>
            </div>
          )) : (
            <p className="text-[10px] text-slate-400 italic text-center py-4 uppercase font-bold">Initializing local service points...</p>
          )}
        </div>
      </div>
    </CivicCard>
  );
}
