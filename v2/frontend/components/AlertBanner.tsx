'use client';

import { useState, useEffect } from 'react';
import { useArea } from '@/lib/AreaContext';
import GlassCard from './ui/GlassCard';

export default function AlertBanner() {
  const { selectedArea } = useArea();
  const [alert, setAlert] = useState<any>(null);

  useEffect(() => {
    // Mocking API fetch
    // In real app, fetch from /api/v2/civic/alerts/hyperlocal?area_id=...
    const mockAlert = {
      id: 'A-101',
      severity: 'critical',
      title: 'HEAVY RAIN WARNING',
      message: `Flash flood risk in ${selectedArea?.name || 'GHMC area'}. Avoid low-lying areas.`,
      is_active: true
    };
    
    setAlert(mockAlert);
  }, [selectedArea]);

  if (!alert || !alert.is_active) return null;

  return (
    <div className="mb-6 animate-in slide-in-from-top-4 duration-500">
      <GlassCard className={`p-4 border-l-4 ${
        alert.severity === 'critical' 
          ? 'border-l-red-500 bg-red-500/5' 
          : 'border-l-amber-500 bg-amber-500/5'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-full font-bold ${
              alert.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
            }`}>
              ⚠️
            </span>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${
                alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'
              }`}>
                {alert.severity} • {selectedArea?.name || 'Telangana'}
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                {alert.title}: <span className="font-medium text-slate-300 ml-1">{alert.message}</span>
              </p>
            </div>
          </div>
          <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white px-2">
            Dismiss
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
