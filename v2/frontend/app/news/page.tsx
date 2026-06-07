'use client';

import { useState, useEffect } from 'react';
import CivicCard from '@/components/ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function NewsPage() {
  const { selectedArea } = useArea();
  const [news, setNews] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [highImpactOnly, setHighImpactOnly] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const minScore = highImpactOnly ? 80 : 0;
        const areaParam = selectedArea ? `&area_id=${selectedArea.id}` : '';
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const url = `${backendUrl}/api/v2/civic/news/feed?category=${activeCat}&min_score=${minScore}${areaParam}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('News fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [activeCat, selectedArea, highImpactOnly]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">CIVIC PULSE</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI-classified updates for {selectedArea?.name || 'Telangana'}</p>
        </div>
        <div className="flex flex-col md:items-end gap-3">
           <div className="flex gap-2">
              {['all', 'civic', 'weather', 'jobs', 'politics'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCat === cat 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
           
           {/* Accuracy/Impact Filter */}
           <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={highImpactOnly} 
                onChange={(e) => setHighImpactOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                High Impact Only (AI Pulse 80+)
              </span>
           </label>
        </div>
      </header>

      {/* Featured News */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <CivicCard key={i} className="p-6 animate-pulse bg-white">
              <div className="flex gap-8 items-start">
                <div className="w-48 h-48 rounded-xl bg-slate-100 flex-shrink-0" />
                <div className="flex-grow space-y-4">
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                  <div className="h-8 w-3/4 bg-slate-100 rounded" />
                  <div className="h-16 w-full bg-slate-100 rounded" />
                </div>
              </div>
            </CivicCard>
          ))
        ) : news.length > 0 ? news.map(item => (
          <CivicCard key={item.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start group bg-white hover:border-blue-300 transition-all" accentColor={item.category === 'weather' ? 'amber' : 'blue'}>
            <div className="w-full md:w-48 h-48 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center text-5xl">
               {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" alt="" /> : '📰'}
            </div>
            
            <div className="flex-grow space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    item.category === 'weather' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(item.published_at).toLocaleDateString()}
                  </span>
                </div>
                {(item.is_verified || item.ai_relevance_score > 80) && (
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Verified Pulse
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-black tracking-tight leading-tight text-slate-900 uppercase group-hover:text-blue-600 transition-colors">
                {item.title}
              </h2>
              
              <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase tracking-tight line-clamp-3">
                {item.content}
              </p>
              
              <div className="pt-4 flex items-center gap-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">AI Relevance</p>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${item.ai_relevance_score || 0}%` }} />
                  </div>
                  <span className="text-xs font-black font-mono text-emerald-600">{item.ai_relevance_score || 0}%</span>
                </div>
                <a href={item.source_url} target="_blank" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline ml-auto">
                  Source Link →
                </a>
              </div>
            </div>
          </CivicCard>
        )) : (
          <CivicCard className="p-16 text-center text-slate-400 italic">
            No live updates found for this category or region.
          </CivicCard>
        )}
      </div>

      <CivicCard className="p-8 text-center bg-slate-50 border-dashed border-slate-200 shadow-none">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          News is aggregated from 45+ verified regional sources and classified for citizen relevance.
        </p>
      </CivicCard>
    </div>
  );
}
