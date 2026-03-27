import React from 'react';
import { aiBriefingData } from '../data/aiBriefingData';
import { Icons } from '../components/Icons';

export default function AIPulsePage() {
  const handleShare = () => {
    const text = `🚨 AI Pulse Briefing (${aiBriefingData.date}):\n\n` +
      `🔥 Coding: ${aiBriefingData.executiveBrief[0].gainedGround} leading.\n` +
      `🧠 Context: ${aiBriefingData.executiveBrief[1].description}\n` +
      `💰 Spend: ${aiBriefingData.executiveBrief[2].description}\n\n` +
      `Read full live comparison at telangana.live/ai-pulse`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 relative">
      
      {/* Background ambient glow specific to this page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />

      {/* Header */}
      <div className="text-center mb-10 animate-in">
        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl mb-4 border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <Icons.AI className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white tracking-tight mb-3">
          AI Pulse Briefing
        </h1>
        <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
          Daily snapshot of model releases, pricing warfare, and benchmark shifts across OpenAI, Anthropic, Google, and more.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-widest uppercase text-white/80">
                {aiBriefingData.date}
            </span>
            <span className="flex items-center gap-1 text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live Updates
            </span>
        </div>
      </div>

      {/* 3-Minute Executive Brief */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">The 3-Minute Briefing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiBriefingData.executiveBrief.map((brief, index) => (
            <div 
              key={brief.id} 
              className={`glass-card p-6 relative overflow-hidden group hover-lift animate-in delay-${(index + 1) * 100}`}
            >
              {/* Decorative gradient orb */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40
                ${brief.trend === 'up' ? 'bg-green-500' : brief.trend === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`} 
              />
              
              <div className="flex items-center gap-2 mb-3">
                {brief.trend === 'up' && <Icons.TrendingUp className="w-5 h-5 text-green-400" />}
                {brief.trend === 'alert' && <Icons.Warning className="w-5 h-5 text-red-400" />}
                <h3 className="text-lg font-bold text-white">{brief.title}</h3>
              </div>
              
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {brief.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-white/5">
                <p className="text-xs uppercase tracking-wider text-text-muted font-semibold flex flex-col gap-1">
                  <span>Advantage:</span>
                  <span className="text-purple-300 font-bold">{brief.gainedGround}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deprecations Alert */}
      {aiBriefingData.deprecations && aiBriefingData.deprecations.length > 0 && (
        <div className="mb-12 animate-in delay-400">
           <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.1)] flex items-start flex-col sm:flex-row gap-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                 <Icons.Warning className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                 <h3 className="text-xl font-bold text-red-400 mb-2">Urgent Stack Deprecations</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {aiBriefingData.deprecations.map(dep => (
                      <div key={dep.model} className="bg-black/30 border border-red-500/20 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-white font-mono font-bold">{dep.model}</span>
                           <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">{dep.date}</span>
                        </div>
                        <p className="text-xs text-text-muted">Requires migration to <span className="text-white font-mono">{dep.replacement}</span> ({dep.provider})</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Live Comparison Table */}
      <div className="animate-in delay-500">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Live Model Arena & Pricing</h2>
            <button 
                onClick={handleShare}
                className="hidden sm:flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] px-4 py-2 rounded-xl font-bold text-sm transition-all border border-[#25D366]/30 shadow-[0_0_15px_rgba(37,211,102,0.15)] hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:-translate-y-0.5"
            >
                <Icons.WhatsApp className="w-4 h-4" />
                Share Briefing
            </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto scroll-x-mobile">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-widest pl-6">Model / Provider</th>
                  <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-widest">Coding</th>
                  <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-widest">Agentic</th>
                  <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-widest">Context</th>
                  <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-widest">Price / 1M</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {aiBriefingData.comparisonStats.map((stat, idx) => (
                  <tr key={stat.model} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 pl-6 relative">
                      {/* Active glowing indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                      
                      <div className="font-bold text-white text-base">{stat.model}</div>
                      <div className="text-xs text-text-muted flex justify-between items-center mt-1">
                          {stat.provider}
                          <span className={`text-[10px] px-2 py-0.5 rounded border border-white/10 ${stat.color.replace('bg-', 'text-').replace('-500', '-300')} bg-white/5`}>
                             {stat.status}
                          </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono font-bold text-gray-200">{stat.codingScore}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono font-bold text-gray-200">{stat.agenticScore}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-300 font-medium">{stat.contextWindow}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono font-bold text-white">{stat.pricePer1M}</div>
                      {stat.priceChange !== 0 && (
                        <div className={`text-xs mt-1 flex items-center gap-1 ${stat.priceChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {stat.priceChange < 0 ? <Icons.ArrowDown className="w-3 h-3" /> : <Icons.ArrowUp className="w-3 h-3" />}
                           {Math.abs(stat.priceChange).toFixed(2)} vs yest.
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
          onClick={handleShare}
          className="sm:hidden fixed bottom-24 right-4 z-50 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all"
      >
          <Icons.WhatsApp className="w-6 h-6" />
      </button>
      
    </div>
  );
}
