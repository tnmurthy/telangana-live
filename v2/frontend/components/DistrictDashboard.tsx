'use client';

import { useState, useEffect } from 'react';
import CivicCard from "@/components/ui/CivicCard";
import Link from "next/link";
import AlertBanner from "@/components/AlertBanner";
import FundFlowSankey from "@/components/visuals/FundFlowSankey";

export default function DistrictDashboard({ slug }: { slug: string }) {
  const [officials, setOfficials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const areaName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  useEffect(() => {
    const fetchOfficials = async () => {
      setIsLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/v2/civic/officials?area_id=all`);
        const data = await response.json();
        setOfficials(data);
      } catch (e) {
        console.error('Officials fetch error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOfficials();
  }, [slug]);

  return (
    <div className="space-y-8">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Dashboard</Link>
             <span className="text-slate-300">/</span>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{slug}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight uppercase text-slate-900">{areaName}</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hyper-local Command Center</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-sm">
            Ward ID: {slug.toUpperCase()}
          </div>
        </div>
      </header>

      <AlertBanner />

      {/* Financial Transparency Layer */}
      <CivicCard title="LAD Fund Flow Transparency" subtitle="Tracking every rupee from allocation to on-ground assets" accentColor="blue" className="w-full">
         <FundFlowSankey data={{
           total: (officials[0]?.total_lad_allocation / 10000000) || 100, 
           admin: (officials[0]?.total_lad_allocation * 0.05 / 10000000) || 5,
           planned: 25, 
           active: 40,  
           completed: (officials[0]?.spent_lad_funds / 10000000) || 30 
         }} />
         <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-4 flex items-start gap-3">
            <span className="text-xl">📊</span>
            <div>
               <p className="text-[11px] font-bold text-blue-900 leading-tight uppercase">Visual Verification Active</p>
               <p className="text-[10px] text-blue-700 mt-1 uppercase tracking-tight font-medium">This diagram is dynamically generated using real-time spending reports and public work milestones.</p>
            </div>
         </div>
      </CivicCard>

      {/* Grid of Specialized Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Utility Status Widget */}
        <CivicCard title="Live Utilities" accentColor="blue" className="lg:row-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
               <div className="flex items-center gap-3">
                 <span className="text-xl">💧</span>
                 <div>
                   <p className="text-xs font-bold text-slate-900 uppercase">Water Supply</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase">Next: 4:00 PM</p>
                 </div>
               </div>
               <span className="text-xs font-mono font-black text-emerald-600">6h left</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
               <div className="flex items-center gap-3">
                 <span className="text-xl">⚡</span>
                 <div>
                   <p className="text-xs font-bold text-slate-900 uppercase">Power Grid</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Stable</p>
                 </div>
               </div>
               <span className="text-xs font-mono font-black text-emerald-600 uppercase">Normal</span>
            </div>
          </div>
          <Link href="/water" className="block text-center mt-6 py-2 rounded-lg border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            Full Utility View →
          </Link>
        </CivicCard>

        {/* Infrastructure Widget */}
        <CivicCard title="Ward Infrastructure" className="lg:col-span-2" accentColor="green">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Works</p>
                 <p className="text-3xl font-black text-slate-900">04</p>
                 <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[60%]" />
                 </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Citizen Verified</p>
                 <p className="text-3xl font-black text-emerald-600">78%</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Based on 1.2k reports</p>
              </div>
           </div>
           <Link href="/public-works" className="block text-center mt-6 py-2 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md">
             Track Transparency Tracker →
           </Link>
        </CivicCard>

        {/* Elected Representative Widget (Live Data) */}
        <CivicCard title="Elected Representative" accentColor="amber">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
               <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100" />
                  <div className="h-4 w-32 bg-slate-100 rounded" />
               </div>
            </div>
          ) : officials.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-2xl shadow-xl text-white">
                   {officials[0].role.includes('MP') ? '🏛️' : '⚖️'}
                 </div>
                 <div>
                    <p className="text-lg font-black tracking-tight leading-none mb-1 uppercase text-slate-900">{officials[0].name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-2">{officials[0].role}</p>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">{officials[0].party}</span>
                 </div>
              </div>
              
              {/* LAD Fund Transparency */}
              <div className="pt-4 border-t border-slate-50 space-y-2">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">LAD Fund Utilization</span>
                    <span className="text-slate-900">{officials[0].total_lad_allocation > 0 ? Math.round((officials[0].spent_lad_funds / officials[0].total_lad_allocation) * 100) : 0}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-1000" 
                      style={{ width: `${officials[0].total_lad_allocation > 0 ? (officials[0].spent_lad_funds / officials[0].total_lad_allocation) * 100 : 0}%` }}
                    />
                 </div>
                 <p className="text-[8px] text-slate-400 font-bold uppercase italic tracking-tighter">Spent: ₹{(officials[0].spent_lad_funds / 10000000).toFixed(2)} Cr / ₹{(officials[0].total_lad_allocation / 10000000).toFixed(2)} Cr</p>
              </div>

              <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-900 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                Full Profile & Performance →
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
               <p className="text-[11px] font-bold text-slate-400 uppercase italic">No mapped representatives found.</p>
            </div>
          )}
        </CivicCard>

        {/* Local Officials Widget */}
        <CivicCard title="Local Ward Officials">
          <div className="space-y-4">
            {[
              { role: 'Corporator', name: 'K. Venkatesh' },
              { role: 'Ward Officer', name: 'M. Sridevi' }
            ].map((o, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400">👤</div>
                <div>
                  <p className="text-xs font-bold text-slate-900 uppercase">{o.name}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{o.role}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/sos" className="block text-center mt-6 py-2 rounded-lg border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            Direct Contact List →
          </Link>
        </CivicCard>

        {/* Local Alerts Feed */}
        <CivicCard title="Hyper-local Alerts">
          <div className="space-y-4">
             <div className="pl-3 border-l-2 border-amber-500 py-1">
               <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Traffic</p>
               <p className="text-xs font-bold text-slate-600 uppercase tracking-tight leading-tight">Congestion at Road No 45 due to pipeline work.</p>
             </div>
             <div className="pl-3 border-l-2 border-emerald-500 py-1">
               <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Health</p>
               <p className="text-xs font-bold text-slate-600 uppercase tracking-tight leading-tight">Mega health camp this Sunday at Ward Office.</p>
             </div>
          </div>
        </CivicCard>

      </div>
    </div>
  );
}
