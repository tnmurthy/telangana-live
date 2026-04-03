import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import newsData from '../data/news.json';
import NewsCard from '../components/NewsCard';
import CitizenPoll from '../components/CitizenPoll';
import { Icons } from '../components/Icons';

const FeedSection = ({ title, items, icon }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2 px-2">
      <div className="p-1.5 bg-telangana-green/10 rounded-lg text-telangana-green">
        {icon}
      </div>
      <h2 className="text-xl font-black text-white tracking-tight uppercase italic">{title}</h2>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {items.map((news, idx) => (
        <NewsCard key={idx} news={news} />
      ))}
    </div>
  </section>
);

export default function HomePage() {
    const topStories = useMemo(() => newsData.slice(0, 3), []);
    const hyderabadNews = useMemo(() => newsData.filter(n => n.region === 'Hyderabad'), []);
    const cyberabadNews = useMemo(() => newsData.filter(n => n.region === 'Cyberabad' || n.category === 'Transit'), []);

    return (
        <div className="space-y-10 pb-20">
            {/* AI Pulse Hero Banner */}
            <section className="animate-in">
                <Link to="/ai-pulse" className="block w-full bg-gradient-to-br from-indigo-950 via-dark-bg to-emerald-950/30 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl hover:shadow-telangana-green/10 transition-all group relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-telangana-green/10 blur-[100px] rounded-full group-hover:bg-telangana-green/20 transition-colors"></div>
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4 max-w-2xl">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-telangana-green/20 border border-telangana-green/30 text-telangana-green text-[10px] font-black uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-telangana-green animate-pulse"></span>
                            AI Pulse Live
                          </div>
                          <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tighter">
                            Your Daily <span className="text-telangana-green italic">Civic Intelligence</span> Briefing.
                          </h1>
                          <p className="text-sm lg:text-base text-text-secondary leading-relaxed font-medium">
                            Automated synthesis of coding gains, transit shifts, and market fluctuations across Telangana.
                          </p>
                        </div>
                        <div className="shrink-0">
                           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                             <Icons.Search className="w-8 h-8 text-telangana-green" />
                           </div>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Top Stories Feed */}
            <FeedSection 
              title="Top Stories" 
              items={topStories} 
              icon={<Icons.Info size="sm" />} 
            />

            {/* Local Pulse: Hyderabad */}
            <FeedSection 
              title="Hyderabad Local" 
              items={hyderabadNews.length > 0 ? hyderabadNews : topStories.slice(0,1)} 
              icon={<Icons.Building size="sm" />} 
            />

            {/* In-feed Widget Case: Citizen Poll */}
            <section className="glass-card p-6 border-l-4 border-heritage-gold animate-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight uppercase">Citizen Voice</h2>
                    <p className="text-xs text-text-muted">Direct participation in civic decisions</p>
                  </div>
                  <Icons.Info size="md" className="text-heritage-gold opacity-50" />
                </div>
                <CitizenPoll />
            </section>

            {/* Local Pulse: Cyberabad */}
            <FeedSection 
              title="Cyberabad News" 
              items={cyberabadNews.length > 0 ? cyberabadNews : topStories.slice(1,2)} 
              icon={<Icons.Info size="sm" />} 
            />

            {/* Footer Explore Link */}
            <div className="text-center py-10">
              <Link to="/news" className="inline-flex items-center gap-2 text-sm font-black text-telangana-green uppercase tracking-widest hover:gap-3 transition-all">
                Explore Full Archive <Icons.ExternalLink className="w-4 h-4" />
              </Link>
            </div>
        </div>
    );
}
