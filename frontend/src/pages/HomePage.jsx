import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import newsData from '../data/news.json';
import NewsCard from '../components/NewsCard';
import { Icons } from '../components/Icons';
import StoriesBar from '../components/StoriesBar';
import DistrictOnboarding from '../components/DistrictOnboarding';
import { SkeletonFeed } from '../components/SkeletonCard';
import { useAppContext } from '../context/AppContext';

const CATEGORIES = [
  { id: 'All', label: 'Briefing' },
  { id: 'Telangana', label: 'Telangana' },
  { id: 'Safety', label: 'Security' },
  { id: 'Govt', label: 'Civic' },
  { id: 'Business', label: 'Market' },
  { id: 'Transit', label: 'Transit' },
];

const PAGE_SIZE = 8;

const FeedSection = ({ title, items, icon, delay = '0ms' }) => (
  <section className="space-y-6 animate-liquid-in" style={{ animationDelay: delay }}>
    <div className="flex items-center gap-4 px-2">
      <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white">
        {icon}
      </div>
      <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
    </div>
    
    <div className="flex flex-col gap-6">
      {items.map((news, idx) => (
        <NewsCard key={news.link || idx} news={news} />
      ))}
    </div>
  </section>
);

export default function HomePage() {
  const { searchQuery, myDistrict, followed } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, searchQuery]);

  const filteredNews = useMemo(() => {
    let items = [...newsData];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(n =>
        n.title.toLowerCase().includes(q) ||
        (n.description || '').toLowerCase().includes(q)
      );
    }
    
    if (activeCategory !== 'All') {
      items = items.filter(n => (n.category || '').toLowerCase() === activeCategory.toLowerCase());
    }

    return items.sort((a, b) => {
      const aFollowed = followed.topics.includes(a.category) || followed.regions.includes(a.region);
      const bFollowed = followed.topics.includes(b.category) || followed.regions.includes(b.region);
      if (aFollowed && !bFollowed) return -1;
      if (!aFollowed && bFollowed) return 1;
      return new Date(b.published) - new Date(a.published);
    });
  }, [searchQuery, activeCategory, followed]);

  const myDistrictNews = useMemo(() => {
    if (!myDistrict) return [];
    return filteredNews.filter(n =>
      (n.region || '').toLowerCase().includes(myDistrict.toLowerCase())
    );
  }, [filteredNews, myDistrict]);

  const feedNews = useMemo(() => filteredNews.slice(0, page * PAGE_SIZE), [filteredNews, page]);

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
      <div className="space-y-12 pb-20 max-w-5xl mx-auto px-4 mt-8">
        <div className="liquid-glass h-56 w-full animate-pulse" />
        <SkeletonFeed count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto px-4 mt-6">
      {/* Liquid Header section */}
      <section className="animate-liquid-in">
        <StoriesBar />
      </section>

      {/* Floating Category Pill */}
      <section className="sticky top-[100px] z-40 py-4 pointer-events-none">
        <div className="liquid-glass border-white/5 bg-black/40 backdrop-blur-2xl px-2 py-1.5 inline-flex gap-1.5 pointer-events-auto mx-auto shadow-2xl">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ${
                activeCategory === cat.id
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <DistrictOnboarding />

      {/* Main Intelligence Feed */}
      <FeedSection
        title={activeCategory === 'All' ? 'Intelligence Dashboard' : activeCategory}
        items={feedNews}
        icon={<Icons.AI className="w-6 h-6" />}
        delay="100ms"
      />

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-24 flex items-center justify-center">
        {page * PAGE_SIZE < filteredNews.length && (
          <div className="flex flex-col items-center gap-4 text-white/30">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Synching with live grid</span>
          </div>
        )}
      </div>
    </div>
  );
}
