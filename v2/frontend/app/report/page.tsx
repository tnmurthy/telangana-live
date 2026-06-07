'use client';

import { useState, useEffect } from 'react';
import CivicCard from '@/components/ui/CivicCard';
import { useArea } from '@/lib/AreaContext';
import UpvoteButton from '@/components/UpvoteButton';

export default function ReportPage() {
  const { selectedArea } = useArea();
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [localReports, setLocalReports] = useState<any[]>([]);

  useEffect(() => {
    // Mocking a fetch of local reports
    // In real app, fetch from /api/v2/civic/reports?area_id=...
    setLocalReports([
      { id: 101, title: 'Streetlight out in Lane 4', category: 'Infrastructure', upvotes: 45, time: '2h ago' },
      { id: 102, title: 'Garbage pileup near Metro Pillar 12', category: 'Sanitation', upvotes: 128, time: '5h ago' }
    ]);
  }, [selectedArea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea) {
      alert('Please select your area on the homepage first.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/report/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          area_id: selectedArea.id
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Submission failed');
      setResult(data);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="space-y-8">
        <header>
          <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">REPORT A GRIEVANCE</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Citizen-led issue tracking with AI routing</p>
        </header>

        {!result ? (
          <CivicCard className="p-8 bg-white shadow-lg border-t-4 border-t-blue-600">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Subject</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="e.g. Streetlight not working in Lane 4"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Details</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="Describe the issue in detail..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md active:scale-95"
              >
                {isSubmitting ? 'AI Analyzing...' : 'Submit Report'}
              </button>
            </form>
          </CivicCard>
        ) : (
          <div className="space-y-6">
            <CivicCard className="p-8 bg-white animate-in fade-in slide-in-from-bottom-4 duration-500" accentColor="green">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">Grievance Submitted!</h2>
                  <p className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-tight">{result.id}</p>
                </div>
                <span className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold">
                  ✓
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Classification</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Category</span>
                      <span className="text-xs font-black text-slate-900 uppercase">{result.classification.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Routed To</span>
                      <span className="text-xs font-black text-slate-900 uppercase">{result.classification.department}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Priority</span>
                      <span className={`text-xs font-black uppercase tracking-widest ${
                        result.classification.priority === 'emergency' ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        {result.classification.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Reasoning</h3>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 italic text-xs text-slate-600 leading-relaxed">
                    "{result.classification.reasoning}"
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4">
                <button onClick={() => setResult(null)} className="flex-grow py-3 rounded-lg border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                  Submit Another
                </button>
                <button className="flex-grow py-3 rounded-lg bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95">
                  Track Status
                </button>
              </div>
            </CivicCard>
          </div>
        )}
      </section>

      {/* Community Pulse: Local Grievances Feed */}
      <section className="space-y-6 pt-8 border-t border-slate-100">
         <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Community Pulse: {selectedArea?.name || 'Local'} Issues</h2>
         <div className="grid grid-cols-1 gap-4">
            {localReports.map(report => (
              <CivicCard key={report.id} className="p-5 bg-white group hover:border-blue-300 transition-all">
                 <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-slate-500">{report.category}</span>
                       <h3 className="text-sm font-bold text-slate-900 uppercase group-hover:text-blue-600 transition-colors">{report.title}</h3>
                       <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{report.time}</p>
                    </div>
                    <UpvoteButton reportId={report.id} initialCount={report.upvotes} />
                 </div>
              </CivicCard>
            ))}
         </div>
      </section>
    </div>
  );
}
