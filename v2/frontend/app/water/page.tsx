'use client';

import { useState, useEffect } from 'react';
import CivicCard from '@/components/ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function WaterPage() {
  const { selectedArea } = useArea();
  const [nextSupply, setNextSupply] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    // Mocking the backend call
    const simulatedDate = new Date();
    simulatedDate.setHours(simulatedDate.getHours() + 3);
    simulatedDate.setMinutes(45);
    
    setNextSupply({
      start: simulatedDate,
      duration: 120,
      status: 'scheduled'
    });
  }, []);

  useEffect(() => {
    if (!nextSupply) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextSupply.start.getTime() - now;

      if (distance < 0) {
        setTimeLeft('ACTIVE NOW');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextSupply]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">Water Supply</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time scheduling for {selectedArea?.name || 'your area'}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Countdown Card */}
        <CivicCard className="p-8 flex flex-col items-center justify-center text-center space-y-4 bg-white" accentColor="blue">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Next Supply In</p>
          <p className="text-5xl font-black font-mono tracking-tighter text-slate-900">
            {timeLeft || '--h --m --s'}
          </p>
          <div className="pt-4 space-y-1">
            <p className="text-sm font-bold text-slate-700">Today, {nextSupply?.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Duration: 2 Hours</p>
          </div>
        </CivicCard>

        {/* Status Card */}
        <div className="space-y-4">
          <CivicCard title="Supply Status" accentColor="green" className="bg-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-lg font-bold">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">System Normal</p>
                <p className="text-[11px] text-slate-500 font-medium">No major pipeline leaks reported in your zone.</p>
              </div>
            </div>
          </CivicCard>

          <CivicCard title="Reservoir Level" className="bg-white">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Osman Sagar</span>
                <span className="text-blue-600">82%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: '82%' }} />
              </div>
            </div>
          </CivicCard>
        </div>
      </div>

      {/* Weekly Schedule */}
      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Weekly Schedule</h2>
        <div className="grid grid-cols-1 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="bg-white border border-slate-200 p-4 rounded-lg flex items-center justify-between shadow-sm">
              <span className="font-bold text-sm text-slate-700">{day}</span>
              <div className="flex items-center gap-6">
                <span className="text-xs font-mono text-slate-500 font-bold">06:00 AM - 08:00 AM</span>
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                  i % 2 === 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                }`}>
                  {i % 2 === 0 ? 'Confirmed' : 'Tentative'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
