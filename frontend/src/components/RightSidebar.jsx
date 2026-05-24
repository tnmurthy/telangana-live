import React, { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';
import { fetchGoldRates, fetchFuelPrices, fetchMandiPrices } from '../services/pricesService';
import { Icons } from './Icons';
import { goldRates as staticGold } from '../data/goldRates';
import { fuelPrices as staticFuel } from '../data/fuelPrices';
import ProgrammaticAd from './ProgrammaticAd';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';


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
  const [goldRates, setGoldRates] = useState(staticGold);
  const [fuelPrices, setFuelPrices] = useState(staticFuel);

  useEffect(() => {
    fetchGoldRates().then(data => {
      if (data?.gold10g24k) {
        setGoldRates(prev => ({
          ...prev,
          gold24k: { ...prev.gold24k, price: data.gold24k.price, change: data.gold24k.change || 0 },
          gold10g24k: data.gold10g24k.price
        }));
      }
    }).catch(() => {});

    fetchFuelPrices().then(data => {
      if (data?.petrol) {
        setFuelPrices(prev => ({
          ...prev,
          petrol: { ...prev.petrol, price: data.petrol?.price, change: data.petrol?.change ?? 0 },
          diesel: { ...prev.diesel, price: data.diesel?.price, change: data.diesel?.change ?? 0 },
        }));
      }
    }).catch(() => {});
  }, []);

  const gold10g = goldRates?.gold10g24k || (goldRates?.gold24k?.price ? goldRates.gold24k.price * 10 : 0);
  const goldPer10g = gold10g.toLocaleString('en-IN');
  const petrol = fuelPrices?.petrol;
  const diesel = fuelPrices?.diesel;

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
          <span className="text-xl font-black gold-text tracking-tight leading-none">₹{goldPer10g}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-success/10">
          <span className="text-[10px] font-bold text-success uppercase">Steady</span>
        </div>
      </div>

      <div className="divider mb-3.5"></div>

      {/* Fuel */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">Petrol (HYD)</span>
          <span className="text-lg font-black text-white tracking-tight leading-none">₹{(petrol?.price ?? 0).toFixed(2)}</span>
        </div>
        <div className="flex flex-col gap-0.5 border-l border-white/5 pl-4">
          <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">Diesel (HYD)</span>
          <span className="text-lg font-black text-white tracking-tight leading-none">₹{(diesel?.price ?? 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const MandiWidget = () => {
  const [mandi, setMandi] = useState(null);

  useEffect(() => {
    fetchMandiPrices().then(setMandi);
  }, []);

  if (!mandi || !mandi.items.length) return null;

  return (
    <div className="widget-card hover-lift-green">
      <div className="flex justify-between items-center pb-3 mb-3 border-b border-white/[0.06]">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">Mandi Prices</h4>
        <span className="text-[9px] text-telangana-green font-bold px-2 py-0.5 rounded bg-telangana-green/10">Agriculture</span>
      </div>
      <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
        {mandi.items.map(item => (
          <div key={item.name} className="flex flex-col gap-0.5">
            <span className="text-[9px] text-text-muted font-medium truncate">{item.name}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-white">₹{item.price.toLocaleString('en-IN')}</span>
              <span className="text-[8px] text-text-muted/60 font-medium">/q</span>
            </div>
          </div>
        ))}
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


const TrendingWidget = () => {
  const { setSearchQuery } = useAppContext();
  const navigate = useNavigate();

  const trendingItems = [
    { tag: '#HydMetro', count: '12K posts', query: 'Metro' },
    { tag: '#RTCFreeBus', count: '8.4K posts', query: 'Bus' },
    { tag: '#GHMCUpdates', count: '5.1K posts', query: 'GHMC' },
  ];

  const handleHashtagClick = (query) => {
    setSearchQuery(query);
    navigate('/search');
  };

  return (
    <div className="widget-card">
      <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted mb-3">Trending in TG</h4>
      <ul className="space-y-2">
        {trendingItems.map(item => (
          <li 
            key={item.tag} 
            onClick={() => handleHashtagClick(item.query)}
            className="flex justify-between items-center group cursor-pointer"
          >
            <span className="text-xs text-telangana-green font-bold group-hover:underline underline-offset-2 transition-colors">{item.tag}</span>
            <span className="text-[9px] text-text-muted/60 font-medium">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


const RightSidebar = () => {
  return (
    <aside className="w-[300px] hidden xl:flex flex-col sticky top-[7.5rem] h-[calc(100vh-8rem)] overflow-y-auto pl-2 space-y-4 custom-scrollbar">
      <WeatherWidget />
      <MarketWidget />
      <ProgrammaticAd />
      <MandiWidget />
      <TransportWidget />
      <TrendingWidget />
    </aside>
  );
};


export default RightSidebar;