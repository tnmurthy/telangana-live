'use client';

import { useState, useEffect } from 'react';
import CivicCard from '@/components/ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function TransportPage() {
  const { selectedArea } = useArea();
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [activeMode, setActiveTab] = useState('metro');

  useEffect(() => {
    // Mocking API call
    setArrivals([
      { id: '1', type: 'metro', route: 'Blue Line', station: 'Jubilee Hills Check Post', eta: 4, status: 'On-time', platform: '1' },
      { id: '2', type: 'metro', route: 'Blue Line', station: 'Ameerpet', eta: 12, status: 'On-time', platform: '1' },
      { id: '3', type: 'bus', route: '222L', station: 'Road No 36', eta: 15, status: 'Delayed', platform: 'Bus Stop' },
    ]);
  }, []);

  const filtered = arrivals.filter(a => a.type === activeMode);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">TRANSIT BOARD</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live arrivals for {selectedArea?.name || 'Telangana'}</p>
        </div>
        <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
          <button 
            onClick={() => setActiveTab('metro')}
            className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
              activeMode === 'metro' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Metro
          </button>
          <button 
            onClick={() => setActiveTab('bus')}
            className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
              activeMode === 'bus' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Bus
          </button>
        </div>
      </header>

      {/* Arrival Board */}
      <div className="space-y-4">
        {filtered.map(arrival => (
          <CivicCard key={arrival.id} className="p-6 flex items-center justify-between group hover:border-blue-300 transition-all bg-white" accentColor={arrival.type === 'metro' ? "blue" : "amber"}>
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border shadow-sm ${
                arrival.type === 'metro' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-amber-50 border-amber-100 text-amber-600'
              }`}>
                <span className="text-2xl">{arrival.type === 'metro' ? '🚇' : '🚌'}</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">{arrival.route}</span>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">{arrival.station}</h3>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Platform {arrival.platform}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className={`text-[10px] font-black uppercase tracking-widest ${
                arrival.status === 'Delayed' ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {arrival.status}
              </p>
              <p className="text-4xl font-black font-mono tracking-tighter text-slate-900">
                {arrival.eta}<span className="text-sm ml-1 text-slate-400">MIN</span>
              </p>
            </div>
          </CivicCard>
        ))}
      </div>

      {/* Network Map / Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
        <CivicCard title="Service Alerts" accentColor="blue">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
              Blue Line frequency: 5m. Green Line: 2m signal delay.
            </p>
          </div>
        </CivicCard>
        
        <CivicCard title="Quick Links">
          <div className="flex flex-wrap gap-2">
            {['Route Map', 'Fare Calculator', 'Monthly Pass', 'Complaint'].map(link => (
              <button key={link} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all">
                {link}
              </button>
            ))}
          </div>
        </CivicCard>
      </div>
    </div>
  );
}
