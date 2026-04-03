import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import newsData from '../data/news.json';
import NewsCard from '../components/NewsCard';
import CitizenPoll from '../components/CitizenPoll';
import { Icons } from '../components/Icons';

const FeedSection = ({ title, items, icon, delay = '0ms' }) => (
  <section className="space-y-4 animate-in" style={{ animationDelay: delay }}>
    <div className="flex items-center gap-2.5 px-1">
      <div className="p-1.5 bg-telangana-green/10 rounded-lg text-telangana-green">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-white tracking-tight font-heading">{title}</h2>
      <div className="flex-grow h-px bg-gradient-to-r from-white/[0.08] to-transparent ml-2"></div>
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
        <div className="space-y-8 pb-20">
            {/* AI Pulse Hero Banner */}
            <section className="animate-in">
                <Link to="/ai-pulse" className="block group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-dark-bg-secondary to-emerald-950/30 border border-white/[0.06] hover:border-telangana-green/20 p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-telangana-green/5">
                    {/* Decorative glow */}
                    <div className="absolute -right-16 -top-16 w-64 h-64 bg-telangana-green/8 blur-[80px] rounded-full group-hover:bg-telangana-green/15 transition-all duration-700"></div>
                    <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-indigo-500/5 blur-[60px] rounded-full"></div>

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="space-y-3.5 max-w-lg">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-telangana-green/15 border border-telangana-green/25 text-telangana-green text-[9px] font-bold uppercase tracking-[0.18em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-telangana-green animate-pulse"></span>
                            AI Pulse Live
                          </div>
                          <h1 className="text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight font-heading">
                            Your Daily <span className="green-text">Civic Intelligence</span> Briefing.
                          </h1>
                          <p className="text-sm text-text-secondary leading-relaxed font-medium max-w-md">
                            Automated synthesis of market rates, transit shifts, and civic updates across Telangana.
                          </p>
                        </div>
                        <div className="shrink-0">
                           <div className="w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center border border-white/[0.08] group-hover:scale-110 group-hover:bg-telangana-green/10 group-hover:border-telangana-green/20 transition-all duration-500">
                             <svg className="w-7 h-7 text-telangana-green" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
                           </div>
                        </div>
                    </div>
                  </div>
                </Link>
            </section>

            {/* Top Stories Feed */}
            <FeedSection
              title="Top Stories"
              items={topStories}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
              delay="100ms"
            />

            {/* Local Pulse: Hyderabad */}
            <FeedSection
              title="Hyderabad Local"
              items={hyderabadNews.length > 0 ? hyderabadNews : topStories.slice(0,1)}
              icon={<Icons.Building size="sm" />}
              delay="200ms"
            />

            {/* In-feed Widget: Citizen Poll */}
            <section className="animate-in" style={{ animationDelay: '300ms' }}>
              <div className="glass-card p-5 lg:p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-heritage-gold via-heritage-gold/50 to-transparent rounded-r"></div>
                <div className="flex items-center justify-between mb-5 pl-3">
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight font-heading">Citizen Voice</h2>
                    <p className="text-xs text-text-muted mt-0.5">Direct participation in civic decisions</p>
                  </div>
                  <div className="badge-live bg-heritage-gold/10 text-heritage-gold border border-heritage-gold/20">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
                    Poll
                  </div>
                </div>
                <div className="pl-3">
                  <CitizenPoll />
                </div>
              </div>
            </section>

            {/* Local Pulse: Cyberabad */}
            <FeedSection
              title="Cyberabad News"
              items={cyberabadNews.length > 0 ? cyberabadNews : topStories.slice(1,2)}
              icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm1.5-12h7.5v7.5h-7.5V7.5Z" /></svg>}
              delay="400ms"
            />

            {/* Footer Explore Link */}
            <div className="text-center py-6 animate-in" style={{ animationDelay: '500ms' }}>
              <Link to="/news" className="inline-flex items-center gap-2.5 text-sm font-bold text-telangana-green uppercase tracking-widest hover:gap-3.5 transition-all duration-300 group">
                Explore Full Archive
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
        </div>
    );
}
