'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import CivicCard from "@/components/ui/CivicCard";
import Link from "next/link";
import { useArea } from '@/lib/AreaContext';
import { useLocale } from '@/lib/LocaleContext';
import RegionSelector from '@/components/RegionSelector';
import AlertBanner from '@/components/AlertBanner';
import LivePulseWidget from '@/components/LivePulseWidget';
import MarketRatesWidget from '@/components/MarketRatesWidget';
import MandiPricesWidget from '@/components/MandiPricesWidget';
import ODOPWidget from '@/components/ODOPWidget';
import BudgetWidget from '@/components/BudgetWidget';
import PanchangWidget from '@/components/PanchangWidget';
import HealthcareWidget from '@/components/HealthcareWidget';
import MeeSevaWidget from '@/components/MeeSevaWidget';
import ParityWidgets from '@/components/ParityWidgets';
import CitizenPollWidget from '@/components/CitizenPollWidget';
import FuelTaxWidget from '@/components/FuelTaxWidget';
import PowerTariffWidget from '@/components/PowerTariffWidget';
import AdSlot from '@/components/AdSlot';

// Dynamic import for the Leaflet map to prevent SSR errors
const CivicMap = dynamic(() => import('@/components/CivicMap'), { 
  ssr: false,
  loading: () => <div className="h-[500px] bg-slate-100 animate-pulse rounded-xl" />
});

export default function Home() {
  const { selectedArea } = useArea();
  const { t } = useLocale();
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="space-y-6">
      {/* Region Context Bar (High Trust) */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Now Viewing: <span className="text-slate-900">{selectedArea ? `${selectedArea.name}, ${selectedArea.parent}` : 'Telangana (State)'}</span>
          </p>
        </div>
        <button 
          onClick={() => setShowSelector(true)}
          className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
        >
          {t("select_area")} →
        </button>
      </div>

      {showSelector && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <RegionSelector onClose={() => setShowSelector(false)} />
        </div>
      )}

      {/* Primary Alerts (Integrated) */}
      <AlertBanner />

      <AdSlot id="banner-top" className="mb-6" />

      {/* The Civic Map */}
      <CivicMap points={[
        { id: '1', lat: 17.4326, lng: 78.4071, title: 'Jubilee Hills Mee Seva', type: 'meeseva' },
        { id: '2', lat: 17.4165, lng: 78.4446, title: 'Ward 95 Drainage Work', type: 'work' },
        { id: '3', lat: 17.4350, lng: 78.3900, title: 'Basthi Dawakhana Ph 2', type: 'health' }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <PanchangWidget />
          <LivePulseWidget />
          <ParityWidgets />
          <PowerTariffWidget />

          <CivicCard title="Live Services" accentColor="blue">
             <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t("assistant"), href: "/ai-assistant", icon: "🤖" },
                  { label: t("water"), href: "/water", icon: "💧" },
                  { label: "Public Works", href: "/public-works", icon: "🏗️" },
                  { label: t("jobs"), href: "/jobs", icon: "📜" },
                ].map((item) => (
                  <Link key={item.label} href={item.href}>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-center">
                      <div className="text-xl mb-1">{item.icon}</div>
                      <p className="text-[10px] font-bold text-slate-700">{item.label}</p>
                    </div>
                  </Link>
                ))}
             </div>
          </CivicCard>

          <MarketRatesWidget />
          <FuelTaxWidget />
          <MandiPricesWidget />
        </div>

        {/* Middle Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">{t("news")}</h2>
             <Link href="/news" className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Full Feed</Link>
          </div>
          
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-all flex gap-4">
                 <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0" />
                 <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-tighter text-blue-500">Policy • 2h ago</p>
                    <h3 className="text-sm font-bold leading-tight group-hover:text-blue-600 transition-colors">New infrastructure model launched for Greater Hyderabad.</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">The state government announced a revolutionary shift towards transparency...</p>
                 </div>
              </div>
            ))}
            <AdSlot id="feed-mid" />
          </div>

          <div className="grid grid-cols-1 gap-6">
             <CitizenPollWidget />
             <ODOPWidget />
             <BudgetWidget />
          </div>
        </div>

        {/* Right Column (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
           <CivicCard title="Your Elected Rep" accentColor="amber">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">👤</div>
                 <div>
                    <p className="text-xs font-bold leading-none">M. Raghunandan</p>
                    <p className="text-[9px] font-black uppercase text-slate-400">MLA • {selectedArea?.name || 'Local'}</p>
                 </div>
              </div>
              <button className="w-full py-2 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">Performance</button>
           </CivicCard>

           <MeeSevaWidget />
           <HealthcareWidget />

           <div className="p-5 rounded-xl bg-blue-600 text-white space-y-4 shadow-lg">
              <h3 className="text-xs font-black uppercase tracking-widest">{t("report")}</h3>
              <p className="text-[11px] text-blue-100">AI-routed to the correct department within minutes.</p>
              <Link href="/report" className="block text-center py-2 rounded-lg bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">
                Submit Report
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
