'use client';

import { useState, useEffect } from 'react';
import CivicCard from '@/components/ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function PowerPage() {
  const { selectedArea } = useArea();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isNormal, setIsNormal] = useState(true);

  useEffect(() => {
    // Mocking real-time feed
    setAlerts([
      {
        id: "OUT-991",
        type: "unplanned",
        status: "active",
        start: "10:15 AM",
        eta: "12:30 PM",
        reason: "Transformer Maintenance",
        area: "Sector 4 & 5"
      }
    ]);
    setIsNormal(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">Power Status</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grid intelligence for {selectedArea?.name || 'your area'}</p>
      </header>

      {/* Main Status Hero */}
      <CivicCard className={`p-10 text-center space-y-4 ${
        isNormal ? 'bg-emerald-50/30' : 'bg-amber-50/30'
      }`} accentColor={isNormal ? 'green' : 'amber'}>
        <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl shadow-md border ${
          isNormal ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-white border-amber-100 text-amber-500 animate-pulse'
        }`}>
          ⚡
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            {isNormal ? 'GRID STATUS: NORMAL' : 'PARTIAL OUTAGE DETECTED'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wide">
            {isNormal 
              ? 'TSSPDCL reports stable power supply in your zone.' 
              : 'Unscheduled interruption reported in local sub-station.'}
          </p>
        </div>
      </CivicCard>

      {/* Active Alerts */}
      {!isNormal && (
        <section className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Active Alerts
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {alerts.map(alert => (
              <CivicCard key={alert.id} className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 bg-white" accentColor="red">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100`}>
                      {alert.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{alert.id}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">{alert.reason}</h3>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">Affected Regions: {alert.area}</p>
                </div>
                
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Started</p>
                    <p className="font-mono font-bold text-slate-900">{alert.start}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">ETA Restore</p>
                    <p className="font-mono font-bold text-emerald-600">{alert.eta}</p>
                  </div>
                </div>
              </CivicCard>
            ))}
          </div>
        </section>
      )}

      {/* Planned Maintenance */}
      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Planned Maintenance</h2>
        <CivicCard className="p-0 bg-white overflow-hidden">
          <div className="divide-y divide-slate-100">
            {[
              { date: 'June 08', time: '10:00 AM - 01:00 PM', reason: 'Line Stringing Work' },
              { date: 'June 12', time: '02:00 PM - 05:00 PM', reason: 'Tree Pruning & Safety' }
            ].map((m, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900 uppercase">{m.reason}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{m.time}</p>
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md">{m.date}</span>
              </div>
            ))}
          </div>
        </CivicCard>
      </section>

      {/* Report Button */}
      <CivicCard className="p-6 text-center bg-slate-50 border-dashed border-slate-200 shadow-none">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Experiencing a blackout not listed here?</p>
        <button className="px-8 py-2 rounded-lg border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
          Report No-Power →
        </button>
      </CivicCard>
    </div>
  );
}
