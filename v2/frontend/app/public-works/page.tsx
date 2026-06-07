'use client';

import { useState, useEffect } from 'react';
import CivicCard from '@/components/ui/CivicCard';

export default function PublicWorksPage() {
  const [summary, setSummary] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for the complex visualizer
    setSummary({
      total_count: 12,
      active_count: 5,
      total_investment: 450000000,
      completion_rate: 65
    });

    setProjects([
      {
        id: 1,
        title: "Ward 95 Drainage Modernization",
        status: "in_progress",
        budget: "₹4.5 Cr",
        spent: "₹2.1 Cr",
        progress: 45,
        milestones: [
          { label: "Survey", status: "completed" },
          { label: "Excavation", status: "completed" },
          { label: "Pipe Laying", status: "in_progress" },
          { label: "Restoration", status: "pending" }
        ]
      },
      {
        id: 2,
        title: "Smart Street Lighting - Phase II",
        status: "completed",
        budget: "₹1.2 Cr",
        spent: "₹1.15 Cr",
        progress: 100,
        milestones: [
          { label: "Installation", status: "completed" },
          { label: "Grid Sync", status: "completed" }
        ]
      }
    ]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">PUBLIC WORKS</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tracking infrastructure transparency in your ward</p>
        </div>
        <div className="flex gap-2">
          <CivicCard className="px-4 py-2 border-slate-200" accentColor="green">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{summary?.active_count} Active Projects</span>
          </CivicCard>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CivicCard className="text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Investment</p>
          <p className="text-xl font-black text-slate-900">₹{(summary?.total_investment / 10000000).toFixed(1)} Cr</p>
        </CivicCard>
        <CivicCard className="text-center space-y-1" accentColor="green">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion Rate</p>
          <p className="text-xl font-black text-emerald-600">{summary?.completion_rate}%</p>
        </CivicCard>
        <CivicCard className="text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Citizen Verified</p>
          <p className="text-xl font-black text-slate-900">92%</p>
        </CivicCard>
      </div>

      {/* Projects List */}
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Active Infrastructure Projects</h2>
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <CivicCard key={project.id} className="p-6 md:p-8 space-y-6 bg-white" accentColor={project.status === 'completed' ? 'green' : 'blue'}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">{project.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MA&UD • INFRASTRUCTURE DIVISION</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Budget</p>
                      <p className="text-sm font-black text-slate-900">{project.budget}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      project.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Physical Progress</span>
                    <span className="text-slate-900">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${project.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Stepper */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  {project.milestones.map((m: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          m.status === 'completed' ? 'bg-emerald-500' : 
                          m.status === 'in_progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
                        }`} />
                        <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">{m.label}</span>
                      </div>
                      <p className={`text-[10px] font-bold ${
                        m.status === 'completed' ? 'text-emerald-600' : 
                        m.status === 'in_progress' ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {m.status.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Last updated: 2 days ago • Verified Feed</p>
                  <button className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                    Report Delay / Issue →
                  </button>
                </div>
              </CivicCard>
            ))}
          </div>
        </section>

        {/* Upcoming Tenders (For The People Alignment) */}
        <section className="space-y-6">
           <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Upcoming Tenders & Planned Works</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'TND-01', title: 'Community Hall Renovation', dept: 'GHMC Engineering', budget: '₹25 L', deadline: '15 Days' },
                { id: 'TND-02', title: 'Smart Street Lighting Ph III', dept: 'MA&UD', budget: '₹1.8 Cr', deadline: '22 Days' }
              ].map(tender => (
                <CivicCard key={tender.id} className="p-5 bg-white border-dashed" accentColor="blue">
                   <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tighter text-blue-600">{tender.dept}</p>
                        <h3 className="text-sm font-bold text-slate-900 uppercase">{tender.title}</h3>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-50 text-blue-500 border border-blue-100">Tender</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Est. Budget</p>
                        <p className="text-sm font-black text-slate-800">{tender.budget}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Bid Deadline</p>
                        <p className="text-xs font-bold text-red-500">{tender.deadline}</p>
                      </div>
                   </div>
                </CivicCard>
              ))}
           </div>
           <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                Tender data is synchronized with the official <span className="text-blue-600 underline">Telangana e-Procurement Portal</span>.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
}
