import React, { useState, useMemo } from 'react';
import newsData from '../data/news.json';
import NewsCard from '../components/NewsCard';
import { Icons } from '../components/Icons';

const NewsListingPage = () => {
  const [filter, setFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...new Set(newsData.map(item => item.category))];
  const regions = ['All', 'Hyderabad', 'Cyberabad', 'Malkajgiri', 'Telangana'];

  const filteredNews = useMemo(() => {
    return newsData.filter(item => {
      const matchCategory = filter === 'All' || item.category === filter;
      const matchRegion = regionFilter === 'All' || item.region === regionFilter;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchRegion && matchSearch;
    });
  }, [filter, regionFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            Civic <span className="text-telangana-green">News</span>
          </h1>
          <p className="text-text-muted font-medium max-w-xl">
            Real-time automated news aggregator with AI-powered summaries for Hyderabad and surrounding regions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 group">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted transition-colors group-focus-within:text-telangana-green" />
          <input 
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-telangana-green/50 transition-all backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black uppercase text-text-muted tracking-widest mr-2">Regions</span>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                regionFilter === r 
                ? 'bg-telangana-green text-white border-telangana-green shadow-lg shadow-telangana-green/20' 
                : 'bg-white/5 text-text-muted border-white/10 hover:border-white/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-black uppercase text-text-muted tracking-widest mr-2">Categories</span>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                filter === c 
                ? 'bg-white text-dark-bg border-white shadow-lg' 
                : 'bg-white/5 text-text-muted border-white/10 hover:border-white/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news, idx) => (
            <NewsCard key={idx} news={news} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 rounded-3xl bg-white/5 border border-dashed border-white/10">
          <div className="p-4 rounded-full bg-white/5">
            <Icons.Info className="w-8 h-8 text-text-muted" />
          </div>
          <div className="space-y-1">
            <h3 className="text-white font-bold text-lg">No news found</h3>
            <p className="text-text-muted text-sm max-w-xs">
              Try adjusting your filters or search query to find relevant civic updates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsListingPage;
