'use client';

import { useState, useEffect } from 'react';
import CivicCard from '@/components/ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function JobsPage() {
  const { selectedArea } = useArea();
  const [jobs, setJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Mocking API call
    setJobs([
      { id: 1, title: 'Data Analyst', company: 'Telangana AI Mission (T-AIM)', cat: 'government', salary: '₹8L - ₹12L', match: 95, loc: 'Hyderabad' },
      { id: 2, title: 'Ward Volunteer', company: 'GHMC', cat: 'government', salary: '₹2.5L - ₹4L', match: 88, loc: selectedArea?.name || 'Local' },
      { id: 3, title: 'Retail Associate', company: 'Reliance Trends', cat: 'retail', salary: '₹3L - ₹5L', match: 72, loc: selectedArea?.parent || 'Regional' },
    ]);
  }, [selectedArea]);

  const filtered = jobs.filter(j => activeTab === 'all' || j.cat === activeTab);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">CAREER HUB</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hyper-local opportunities for {selectedArea?.name || 'Telangana'}</p>
        </div>
        <div className="flex gap-2">
          {['all', 'government', 'it', 'retail', 'healthcare'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(job => (
          <CivicCard key={job.id} className="p-6 space-y-6 group hover:border-blue-300 transition-all bg-white" accentColor={job.cat === 'government' ? "amber" : "blue"}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    job.cat === 'government' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {job.cat}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{job.loc}</span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{job.company}</p>
              </div>
              
              <div className="text-right">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Match Score</p>
                 <span className="text-lg font-black text-emerald-600">{job.match}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Estimated Salary</p>
                <p className="font-mono font-bold text-sm text-slate-900">{job.salary}</p>
              </div>
              <button className="px-6 py-2 rounded-lg bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95">
                Quick Apply
              </button>
            </div>
          </CivicCard>
        ))}
      </div>

      <CivicCard className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-blue-50 border-blue-100 shadow-none border-dashed">
        <div className="text-center md:text-left">
          <h3 className="text-sm font-black text-blue-900 uppercase tracking-tight">Never miss an opportunity</h3>
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-1">Get WhatsApp alerts for new {activeTab !== 'all' ? activeTab : ''} jobs in {selectedArea?.name || 'your area'}.</p>
        </div>
        <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg active:scale-95">
          Enable Notifications
        </button>
      </CivicCard>
    </div>
  );
}
