import React, { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';
import fuelPrices from '../data/fuelPrices.js';
import { Icons } from './Icons';

const WeatherSnapshot = ({ selectedDistrict = 'Hyderabad' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        const { data } = await fetchWeather(selectedDistrict);
        setWeather(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [selectedDistrict]);

  if (loading || !weather) return <div className="h-20 animate-pulse bg-white/5 rounded-2xl" />;

  return (
    <div className="glass-card p-4 hover-lift">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-tight">{selectedDistrict}</span>
        <span className="text-2xl">☀️</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-black text-white tracking-tighter">{weather.temp}°</span>
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted font-bold uppercase">{weather.condition}</span>
          <span className="text-[10px] text-success font-bold uppercase tracking-widest">AQI {weather.aqi}</span>
        </div>
      </div>
    </div>
  );
};

const MarketSnapshot = () => {
  return (
    <div className="glass-card p-4 space-y-4 hover-lift">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Market Rates</h4>
        <span className="text-[9px] bg-heritage-gold/10 text-heritage-gold px-1.5 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
      </div>
      
      {/* Gold */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted font-bold uppercase">Gold (24K/10g)</span>
          <span className="text-lg font-black text-heritage-gold tracking-tight">₹72,450</span>
        </div>
        <span className="text-[10px] text-success font-bold">▲ 0.8%</span>
      </div>

      {/* Fuel */}
      <div className="flex justify-between items-end pt-2 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted font-bold uppercase">Petrol (Hyd)</span>
          <span className="text-lg font-black text-white tracking-tight">₹107.41</span>
        </div>
        <span className="text-[10px] text-text-muted font-bold">STABLE</span>
      </div>
    </div>
  );
};

const RightSidebar = () => {
  return (
    <aside className="w-80 hidden xl:flex flex-col sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pl-4 space-y-6">
      <WeatherSnapshot />
      <MarketSnapshot />
      
      {/* Transport Snapshot */}
      <div className="glass-card p-4 space-y-3 hover-lift border-l-2 border-telangana-green">
        <div className="flex items-center gap-2">
          <Icons.Bus className="w-4 h-4 text-telangana-green" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Metro Phase 2 Status</h4>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
           L.B. Nagar to Hayathnagar: <span className="text-white font-bold">Soil testing in progress.</span>
        </p>
      </div>

      {/* Quick Links / Trending */}
      <div className="px-4 space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Trending in TG</h4>
        <ul className="space-y-2">
          {['#HydMetro', '#RTCFreeBus', '#GHMCUpdates'].map(tag => (
            <li key={tag} className="text-xs text-telangana-green hover:underline cursor-pointer font-bold">{tag}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
