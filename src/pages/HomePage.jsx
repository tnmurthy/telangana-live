import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import newsData from '../data/news.json';
import NewsCard from '../components/NewsCard';
import CitizenPoll from '../components/CitizenPoll';
import { Icons } from '../components/Icons';
import StoriesBar from '../components/StoriesBar';
import DistrictOnboarding from '../components/DistrictOnboarding';
import { SkeletonFeed } from '../components/SkeletonCard';
import { useAppContext } from '../context/AppContext';

const CATEGORIES = ['All', 'General', 'Politics', 'Crime', 'Sports', 'Business', 'Health', 'Tech', 'Transit'];
const PAGE_SIZE = 5;

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
        <NewsCard key={news.link || idx} news={news} />
      ))}
    </div>
  </section>
);

export default function HomePage() {
  const { searchQuery, myDistrict } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchQuery]);

  // Filter news
  const filteredNews = useMemo(() => {
    let items = [...newsData];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(n =>
        n.title.toLowerCase().includes(q) ||
        (n.description || '').toLowerCase().includes(q) ||
        (n.region || '').toLowerCase().includes(q) ||
        (n.source || '').toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      items = items.filter(n =>
        (n.category || '').toLowerCase() === activeCategory.toLowerCase()
      );
    }
    return items;
  }, [searchQuery, activeCategory]);

  const myDistrictNews = useMemo(() => {
    if (!myDistrict) return [];
    return filteredNews.filter(n =>
      (n.region || '').toLowerCase().includes(myDistrict.toLowerCase())
    );
  }, [filteredNews, myDistrict]);

  const topStories = useMemo(() => filteredNews.slice(0, 3), [filteredNews]);
  const feedNews = useMemo(() => filteredNews.slice(0, page * PAGE_SIZE), [filteredNews, page]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (page * PAGE_SIZE < filteredNews.length) {
      setPage(p => p + 1);
    }
  }, [page, filteredNews.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (loading) {
    return (
      <div className="space-y-8 pb-20">
        <div className="skeleton h-40 rounded-2xl" />
        <SkeletonFeed count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Stories Bar */}
      <section className="animate-in">
        <StoriesBar />
      </section>

      {/* District onboarding */}
      <DistrictOnboarding />

      {/* My District feed (pinned) */}
      {myDistrictNews.length > 0 && (
        <FeedSection
          title={`📍 ${myDistrict} – My District`}
          items={myDistrictNews.slice(0, 3)}
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>}
          delay="0ms"
        />
      )}

      {/* AI Pulse Hero Banner */}
      <section className="animate-in">
        <Link to="/ai-pulse" className="block group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-dark-bg-secondary to-emerald-950/30 border border-white/[0.06] hover:border-telangana-green/20 p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-telangana-green/5">
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

      {/* Category Tabs */}
      <section className="animate-in" style={{ animationDelay: '50ms' }}>
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar -mx-1 px-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-telangana-green text-dark-bg shadow-lg shadow-telangana-green/20'
                  : 'bg-white/[0.05] text-text-muted hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Search result indicator */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-text-muted animate-in">
          <Icons.Search className="w-3.5 h-3.5" />
          <span>{filteredNews.length} results for "<span className="text-white font-medium">{searchQuery}</span>"</span>
        </div>
      )}

      {/* Empty state */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-16 animate-in">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-text-secondary">No articles found{searchQuery ? ` for "${searchQuery}"` : ''}</p>
          <button onClick={() => { setActiveCategory('All'); }} className="mt-4 text-sm text-telangana-green hover:text-telangana-green-light transition-colors">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Top Stories Feed */}
          <FeedSection
            title="Top Stories"
            items={topStories}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
            delay="100ms"
          />

          {/* In-feed Widget: Citizen Poll */}
          <section className="animate-in" style={{ animationDelay: '200ms' }}>
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

          {/* Infinite scroll feed */}
          <section className="space-y-4 animate-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2.5 px-1">
              <div className="p-1.5 bg-telangana-green/10 rounded-lg text-telangana-green">
                <Icons.Building size="sm" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight font-heading">Latest News</h2>
              <div className="flex-grow h-px bg-gradient-to-r from-white/[0.08] to-transparent ml-2"></div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {feedNews.slice(3).map((news, idx) => (
                <NewsCard key={news.link || idx} news={news} />
              ))}
            </div>
          </section>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-8 flex items-center justify-center">
            {page * PAGE_SIZE < filteredNews.length && (
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <div className="w-4 h-4 border-2 border-telangana-green/20 border-t-telangana-green rounded-full animate-spin" />
                Loading more...
              </div>
            )}
          </div>
        </>
      )}

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
