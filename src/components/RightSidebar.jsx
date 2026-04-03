import React, { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';
import { Icons } from './Icons';

const WeatherWidget = ({ selectedDistrict = 'Hyderabad' }) => {
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

  if (loading || !weather) {
    return (
      <div className="widget-card animate-pulse">
        <div className="h-5 bg-white/5 rounded w-24 mb-3"></div>
        <div className="h-8 bg-white/5 rounded w-16 mb-2"></div>
        <div className="h-3 bg-white/5 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="widget-card group hover-lift">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-0.5">{selectedDistrict}</p>
          <p className="text-[10px] text-text-muted/60 font-medium">Weather & AQI</p>
        </div>
        <div className="text-2xl group-hover:animate-float">☀️</div>
      </div>
      <div className="flex items-end gap-2.5">
        <span className="text-4xl font-black text-white tracking-tighter leading-none">{weather.temp}°</span>
        <div className="flex flex-col gap-0.5 mb-0.5">
          <span className="text-[10px] text-text-secondary font-semibold">{weather.condition}</span>
          <span className={`text-[10px] font-bold tracking-widest ${weather.aqi <= 100 ? 'text-success' : 'text-amber-400'}`}>AQI {weather.aqi}</span>
        </div>
      </div>
    </div>
  );
};

const MarketWidget = () => {
  return (
    <div className="widget-card hover-lift-gold">
      <div className="flex justify-between items-center pb-3 mb-3 border-b border-white/[0.06]">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">Market Rates</h4>
        <span className="badge-live bg-heritage-gold/10 text-heritage-gold border border-heritage-gold/20">
          <span className="w-1.5 h-1.5 rounded-full bg-heritage-gold animate-pulse-live"></span>
          Live
        </span>
      </div>

      {/* Gold */}
      <div className="flex justify-between items-end mb-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">Gold 24K / 10g</span>
          <span className="text-xl font-black gold-text tracking-tight leading-none">₹72,450</span>
        </div>
        <div className="flex items-center gap-1 bg-success/10 px-2 py-1 rounded-lg">
          <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042.815a.75.75 0 0 1-.53-.919Z" clipRule="evenodd" /></svg>
          <span className="text-[10px] text-success font-bold">0.8%</span>
        </div>
      </div>

      <div className="divider mb-3.5"></div>

      {/* Fuel */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">Petrol (HYD)</span>
          <span className="text-xl font-black text-white tracking-tight leading-none">₹107.41</span>
        </div>
        <span className="text-[10px] text-text-muted font-bold bg-white/[0.04] px-2 py-1 rounded-lg uppercase tracking-wider">Stable</span>
      </div>
    </div>
  );
};

const TransportWidget = () => (
  <div className="widget-card hover-lift-green relative overflow-hidden">
    <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-telangana-green via-telangana-green/50 to-transparent"></div>
    <div className="flex items-center gap-2 mb-2.5 pl-2">
      <Icons.Bus className="w-4 h-4 text-telangana-green" />
      <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">Metro Phase 2</h4>
    </div>
    <p className="text-[13px] text-text-secondary leading-relaxed pl-2">
       L.B. Nagar → Hayathnagar: <span className="text-white font-semibold">Soil testing in progress.</span>
    </p>
  </div>
);

const TrendingWidget = () => (
  <div className="widget-card">
    <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-3">Trending in TG</h4>
    <ul className="space-y-2">
      {[
        { tag: '#HydMetro', count: '12K posts' },
        { tag: '#RTCFreeBus', count: '8.4K posts' },
        { tag: '#GHMCUpdates', count: '5.1K posts' },
      ].map(item => (
        <li key={item.tag} className="flex justify-between items-center group cursor-pointer">
          <span className="text-xs text-telangana-green font-bold group-hover:underline underline-offset-2 transition-colors">{item.tag}</span>
          <span className="text-[9px] text-text-muted/60 font-medium">{item.count}</span>
        </li>
      ))}
    </ul>
  </div>
);

const RightSidebar = () => {
  return (
    <aside className="w-[300px] hidden xl:flex flex-col sticky top-[7.5rem] h-[calc(100vh-8rem)] overflow-y-auto pl-2 space-y-4 custom-scrollbar">
      <WeatherWidget />
      <MarketWidget />
      <TransportWidget />
      <TrendingWidget />
    </aside>
  );
};

export default RightSidebar;
