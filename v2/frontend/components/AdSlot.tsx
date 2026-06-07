'use client';

import { useEffect } from 'react';

interface AdSlotProps {
  id: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export default function AdSlot({ id, format = 'auto', className }: AdSlotProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense Error:', e);
    }
  }, []);

  return (
    <div className={`my-6 flex justify-center w-full bg-slate-50 border border-dashed border-slate-200 rounded-lg overflow-hidden min-h-[100px] items-center relative ${className}`}>
      <span className="absolute top-2 left-2 text-[8px] font-black uppercase text-slate-300 tracking-widest">Public Service Announcement / Advertisement</span>
      
      {/* Real Adsense Code would go here */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={id}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      
      {/* Placeholder for local testing */}
      <div className="flex flex-col items-center gap-1 opacity-20 group">
         <span className="text-xl">🏛️</span>
         <p className="text-[10px] font-bold uppercase tracking-tighter">Monetization Node: {id}</p>
      </div>
    </div>
  );
}
