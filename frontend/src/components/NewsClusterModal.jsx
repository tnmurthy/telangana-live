import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import newsData from '../data/news.json';
import { useAppContext } from '../context/AppContext';
import { Icons } from './Icons';
import ArticleModal from './ArticleModal';
import { formatRelativeTime } from '../utils/timeUtils';

const DISTRICT_META = {
  'hyderabad': { emoji: '🏙️', color: 'from-telangana-green to-emerald-400', route: 'hyderabad' },
  'cyberabad': { emoji: '💻', color: 'from-blue-500 to-cyan-400', route: 'cyberabad' },
  'malkajgiri': { emoji: '🏢', color: 'from-purple-500 to-indigo-400', route: 'malkajgiri' },
  'warangal': { emoji: '🏯', color: 'from-amber-500 to-yellow-400', route: 'warangal' },
  'karimnagar': { emoji: '🌾', color: 'from-green-600 to-lime-400', route: 'karimnagar' },
  'nizamabad': { emoji: '🕌', color: 'from-purple-600 to-violet-400' },
  'khammam': { emoji: '⛏️', color: 'from-slate-500 to-zinc-400' },
  'default': { emoji: '📍', color: 'from-emerald-500 to-teal-400' }
};

const CATEGORY_META = {
  'govt': { label: 'Civic', emoji: '🏛️', color: 'from-blue-500 to-indigo-400' },
  'safety': { label: 'Security', emoji: '🛡️', color: 'from-red-500 to-rose-400' },
  'business': { label: 'Market', emoji: '📈', color: 'from-amber-500 to-yellow-400' },
  'transit': { label: 'Transit', emoji: '🚇', color: 'from-emerald-500 to-teal-400' },
  'weather': { label: 'Weather', emoji: '⛅', color: 'from-sky-500 to-cyan-400' },
  'education': { label: 'Education', emoji: '🎓', color: 'from-violet-500 to-purple-400' },
  'health': { label: 'Health', emoji: '🏥', color: 'from-rose-500 to-pink-400' },
  'general': { label: 'General', emoji: '📰', color: 'from-slate-500 to-zinc-400' },
  'default': { label: 'News', emoji: '📰', color: 'from-slate-500 to-zinc-400' }
};

export default function NewsClusterModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('district'); // 'district' or 'category'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const navigate = useNavigate();
  const { saveDistrict } = useAppContext();

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return newsData;
    const q = searchQuery.toLowerCase();
    return newsData.filter(item => 
      item.title.toLowerCase().includes(q) || 
      (item.description || '').toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Group by District (Region)
  const districtClusters = useMemo(() => {
    const groups = {};
    filteredArticles.forEach(article => {
      const region = article.region || 'Telangana';
      if (!groups[region]) {
        groups[region] = [];
      }
      groups[region].push(article);
    });

    // Sort regions so that specific districts come before general 'Telangana'
    return Object.entries(groups)
      .map(([name, articles]) => ({ name, articles }))
      .sort((a, b) => {
        if (a.name === 'Telangana') return 1;
        if (b.name === 'Telangana') return -1;
        return b.articles.length - a.articles.length;
      });
  }, [filteredArticles]);

  // Group by Category
  const categoryClusters = useMemo(() => {
    const groups = {};
    filteredArticles.forEach(article => {
      const cat = article.category || 'General';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(article);
    });

    return Object.entries(groups)
      .map(([name, articles]) => ({ name, articles }))
      .sort((a, b) => b.articles.length - a.articles.length);
  }, [filteredArticles]);

  const handleShortcutNavigate = (e, name, route) => {
    e.stopPropagation();
    onClose();
    saveDistrict(name);
    if (route) {
      navigate(`/${route}`);
    } else {
      navigate('/dashboard');
    }
  };

  const toggleGroup = (groupName) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  const clusters = activeTab === 'district' ? districtClusters : categoryClusters;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
          >
          <motion.div
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="bg-dark-bg-secondary/95 border border-white/[0.08] rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>📰</span> Live News Clusters
                </h2>
                <p className="text-xs text-text-muted mt-0.5">Explore {newsData.length} active updates categorized by region or topic</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Controls: Search and Tabs */}
            <div className="px-6 py-4 bg-white/[0.01] border-b border-white/[0.04] space-y-4">
              {/* Search input */}
              <div className="relative group">
                <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted transition-colors group-focus-within:text-telangana-green" />
                <input
                  type="text"
                  placeholder="Search updates..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-telangana-green/40 focus:ring-1 focus:ring-telangana-green/10 transition-all"
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-2 bg-black/25 p-1 rounded-xl w-fit">
                <button
                  onClick={() => { setActiveTab('district'); setExpandedGroup(null); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'district' 
                      ? 'bg-white/10 text-white border border-white/5' 
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  📍 By District ({districtClusters.length})
                </button>
                <button
                  onClick={() => { setActiveTab('category'); setExpandedGroup(null); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'category' 
                      ? 'bg-white/10 text-white border border-white/5' 
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  🏷️ By Category ({categoryClusters.length})
                </button>
              </div>
            </div>

            {/* Group Lists */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {clusters.length > 0 ? (
                clusters.map(cluster => {
                  const meta = activeTab === 'district' 
                    ? (DISTRICT_META[cluster.name.toLowerCase()] || DISTRICT_META.default)
                    : (CATEGORY_META[cluster.name.toLowerCase()] || CATEGORY_META.default);

                  const displayName = activeTab === 'category' ? (meta.label || cluster.name) : cluster.name;
                  const isExpanded = expandedGroup === cluster.name;

                  return (
                    <div 
                      key={cluster.name} 
                      className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isExpanded ? 'border-white/[0.12] bg-white/[0.03]' : 'border-white/[0.05] hover:border-white/[0.1] bg-white/[0.01]'
                      }`}
                    >
                      {/* Cluster Header Button */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleGroup(cluster.name)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGroup(cluster.name); } }}
                        className="w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-lg`}>
                            {meta.emoji}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-sm">{displayName}</h3>
                            <p className="text-[10px] text-text-muted mt-0.5">{cluster.articles.length} updates published</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Navigation shortcut helper */}
                          {activeTab === 'district' && cluster.name !== 'Telangana' && (
                            <button
                              onClick={(e) => handleShortcutNavigate(e, cluster.name, meta.route)}
                              className="px-2.5 py-1 rounded-lg bg-telangana-green/10 hover:bg-telangana-green/20 border border-telangana-green/20 text-[10px] font-bold text-telangana-green-light transition-all flex items-center gap-1"
                              title={`Open ${cluster.name} Page`}
                            >
                              <span>Feed</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                              </svg>
                            </button>
                          )}
                          <svg 
                            className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Cluster Article List Accordion */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="border-t border-white/[0.04] bg-black/20 overflow-hidden"
                          >
                            <div className="p-2 space-y-1">
                              {cluster.articles.map((article, idx) => (
                                <button
                                  key={article.link || idx}
                                  onClick={() => setSelectedArticle(article)}
                                  className="w-full text-left p-3 rounded-xl hover:bg-white/[0.03] transition-all flex flex-col gap-1.5 border border-transparent hover:border-white/[0.04]"
                                >
                                  <h4 className="text-xs font-bold text-white leading-snug hover:text-telangana-green transition-colors line-clamp-2">
                                    {article.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[10px] text-text-muted">
                                    <span className="font-semibold text-white/60">{article.source}</span>
                                    <span>•</span>
                                    <span>{formatRelativeTime(article.published)}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
                  <div className="p-3 rounded-full bg-white/5 text-text-muted">
                    <Icons.Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">No matches found</h4>
                    <p className="text-text-muted text-xs mt-0.5">Try widening your search query</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Nested full article modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
