'use client';

import { useState, useEffect } from 'react';
import CivicCard from '@/components/ui/CivicCard';

export default function NOCDashboard() {
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/monitoring/status`);
        const data = await res.json();
        setAgents(data);
      } catch (error) {
        console.error('Monitoring fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">Agent Sentry: NOC</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Agent Health & Data Accuracy</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase">System Integrity</p>
              <p className="text-emerald-400 font-black text-lg">99.8%</p>
           </div>
           <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 animate-pulse">
             📡
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-48 animate-pulse bg-white rounded-xl border border-slate-100" />)
        ) : agents.map(agent => (
          <CivicCard key={agent.agent_name} title={agent.agent_name} className="bg-white">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                  agent.status === 'healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {agent.status}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Last Run: {new Date(agent.last_run).toLocaleTimeString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">AI Accuracy Score</span>
                  <span className="text-slate-900">{agent.accuracy_score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000" 
                    style={{ width: `${agent.accuracy_score}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Latency</p>
                    <p className="text-xs font-black text-slate-900">{agent.data_latency_seconds}s</p>
                 </div>
                 <button className="text-[9px] font-black text-blue-600 uppercase hover:underline">View Audit Log →</button>
              </div>
            </div>
          </CivicCard>
        ))}
      </div>
    </div>
  );
}
