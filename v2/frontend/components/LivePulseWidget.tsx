'use client';

import { useState, useEffect } from 'react';
import CivicCard from './ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function LivePulseWidget() {
  const { selectedArea } = useArea();
  const [env, setEnv] = useState<any>(null);
  const [traffic, setTraffic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPulse = async () => {
      setIsLoading(true);
      try {
        const areaId = selectedArea?.id || 'all';
        const [envRes, trafficRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/environment?area_id=${areaId}`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/pulse/traffic?area_id=${areaId}`)
        ]);
        
        const envData = await envRes.json();
        const trafficData = await trafficRes.json();
        
        setEnv(envData);
        setTraffic(trafficData);
      } catch (error) {
        console.error('Pulse fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPulse();
  }, [selectedArea]);

  return (
    <CivicCard title="Live Area Pulse" subtitle="Real-time Environment & Mobility" accentColor="blue">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-100 rounded w-full" />
          <div className="h-8 bg-slate-100 rounded w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Environment Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border ${
                env?.aqi < 50 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
              }`}>
                🍃
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">AQI (Pollution)</p>
                <p className="text-sm font-black text-slate-900">{env?.aqi} • {env?.aqi_status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-xl text-blue-600">
                💨
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">Wind Speed</p>
                <p className="text-sm font-black text-slate-900">{env?.wind_speed_kmh} km/h</p>
              </div>
            </div>
          </div>

          {/* Mobility Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border ${
                traffic?.congestion_index < 30 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
              }`}>
                🚗
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">Traffic Density</p>
                <p className="text-sm font-black text-slate-900">{traffic?.congestion_index}% • {traffic?.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xl text-slate-600">
                🌡️
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400">Temperature</p>
                <p className="text-sm font-black text-slate-900">{env?.temp_c}°C</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </CivicCard>
  );
}
