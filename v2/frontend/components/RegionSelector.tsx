'use client';

import { useState } from 'react';
import { useArea } from '@/lib/AreaContext';
import GlassCard from './ui/GlassCard';

const MOCK_AREAS = [
  { id: 'ghmc-95', name: 'Jubilee Hills', type: 'ward', parent: 'Hyderabad' },
  { id: 'ac-160', name: 'Jubilee Hills', type: 'assembly_constituency', parent: 'Hyderabad PC' },
  { id: 'pc-24', name: 'Hyderabad', type: 'parliamentary_constituency', parent: 'Telangana' },
  { id: 'warangal-u', name: 'Hanmakonda', type: 'mandal', parent: 'Warangal' }
];

export default function RegionSelector({ onClose }: { onClose?: () => void }) {
  const { setArea, selectedArea } = useArea();
  const [search, setSearch] = useState('');

  const filtered = MOCK_AREAS.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.parent.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <GlassCard className="p-6 w-full max-w-md bg-slate-900 border-white/20 shadow-2xl">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Your Area</h2>
          {onClose && <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>}
        </div>
        
        <input
          autoFocus
          type="text"
          placeholder="Search Ward, Mandal, AC or PC..."
          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
          {filtered.map(area => (
            <button
              key={area.id}
              onClick={() => {
                setArea(area);
                if (onClose) onClose();
              }}
              className={`w-full p-4 rounded-xl text-left transition-all border ${
                selectedArea?.id === area.id 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                  : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{area.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">{area.parent} • {area.type}</p>
                </div>
                {selectedArea?.id === area.id && <span className="text-xs font-black uppercase">Current</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
