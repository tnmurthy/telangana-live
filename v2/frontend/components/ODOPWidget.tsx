'use client';

import { useState, useEffect } from 'react';
import CivicCard from './ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function ODOPWidget() {
  const { selectedArea } = useArea();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchODOP = async () => {
      setIsLoading(true);
      try {
        const areaId = selectedArea?.id || 'all';
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/odop?area_id=${areaId}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('ODOP fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchODOP();
  }, [selectedArea]);

  if (isLoading) return <div className="h-48 animate-pulse bg-slate-100 rounded-xl" />;
  if (!product) return null;

  return (
    <CivicCard title="District Pride" subtitle="One District One Product (ODOP)" accentColor="amber">
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl shadow-sm">
             ✨
          </div>
          <div className="space-y-1">
             <h3 className="text-lg font-black text-slate-900 uppercase leading-none">{product.product_name}</h3>
             <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">{product.category}</p>
             <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mt-2">
               {product.description}
             </p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-50 flex gap-3">
           <a 
             href={product.buy_url} 
             target="_blank" 
             className="flex-grow py-2 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest text-center hover:bg-slate-800 transition-all shadow-md"
           >
             Support Artisans →
           </a>
        </div>
      </div>
    </CivicCard>
  );
}
