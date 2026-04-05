import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import newsData from '../data/news.json';
import { supabase } from '../services/supabaseClient';

const STORY_DISTRICTS = [
  { name: 'Top', emoji: '🔥', color: 'from-red-500 to-orange-400' },
  { name: 'Hyderabad', emoji: '🏙️', color: 'from-telangana-green to-emerald-400' },
  { name: 'Cyberabad', emoji: '💻', color: 'from-blue-500 to-cyan-400' },
  { name: 'Warangal', emoji: '🏯', color: 'from-amber-500 to-yellow-400' },
  { name: 'Karimnagar', emoji: '🌾', color: 'from-green-600 to-lime-400' },
  { name: 'Nizamabad', emoji: '🕌', color: 'from-purple-500 to-violet-400' },
  { name: 'Khammam', emoji: '⛏️', color: 'from-slate-500 to-zinc-400' },
];

function getStoryForDistrict(districtName, publishedStories) {
  // Try published Supabase stories first (category may match district)
  if (publishedStories.length > 0 && districtName !== 'Top') {
    const match = publishedStories.find(s =>
      (s.title || '').toLowerCase().includes(districtName.toLowerCase()) ||
      (s.content || '').toLowerCase().includes(districtName.toLowerCase())
    );
    if (match) {
      return {
        title: match.title,
        description: match.content?.slice(0, 200) + '…',
        ai_summary: null,
        source: 'TG Stories',
        link: match.source_url || '#',
        category: match.category,
      };
    }
  }

  if (districtName === 'Top') return publishedStories[0]
    ? {
        title: publishedStories[0].title,
        description: publishedStories[0].content?.slice(0, 200) + '…',
        ai_summary: null,
        source: 'TG Stories',
        link: publishedStories[0].source_url || '#',
        category: publishedStories[0].category,
      }
    : newsData[0] || null;

  return newsData.find(n =>
    n.region === districtName || n.title.toLowerCase().includes(districtName.toLowerCase())
  ) || newsData[0];
}

function StoryOverlay({ story, district, onClose }) {
  if (!story) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${district.color} opacity-20`} />
        <div className="absolute inset-0 bg-dark-bg-secondary/90" />

        {/* Progress bar */}
        <div className="relative h-1 bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 8, ease: 'linear' }}
            onAnimationComplete={onClose}
            className="h-full bg-telangana-green"
          />
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{district.emoji}</span>
              <span className="text-sm font-bold text-white">{district.name}</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={`inline-flex text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r ${district.color} text-dark-bg`}>
            {story.category || 'News'}
          </div>

          <h2 className="text-lg font-black text-white leading-snug">{story.title}</h2>

          {story.ai_summary && (
            <p className="text-sm text-text-secondary leading-relaxed italic">
              ✨ {story.ai_summary}
            </p>
          )}

          {story.description && !story.ai_summary && (
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
              {story.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <span className="text-[10px] text-text-muted">{story.source}</span>
            <a
              href={story.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-telangana-green hover:text-telangana-green-light transition-colors"
            >
              Read Full Story →
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StoriesBar() {
  const [activeStory, setActiveStory] = useState(null);
  const [seenDistricts, setSeenDistricts] = useState(new Set());
  const [publishedStories, setPublishedStories] = useState([]);

  // Fetch published AI-generated stories from Supabase
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('content')
      .select('id, title, category, content, source_url, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (!error && data?.length) setPublishedStories(data);
      });
  }, []);

  const openStory = (district) => {
    const story = getStoryForDistrict(district.name, publishedStories);
    setActiveStory({ story, district });
    setSeenDistricts(prev => new Set([...prev, district.name]));
  };

  const closeStory = () => setActiveStory(null);

  return (
    <>
      <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar scrollbar-hide -mx-1 px-1">
        {STORY_DISTRICTS.map((district, i) => {
          const seen = seenDistricts.has(district.name);
          return (
            <motion.button
              key={district.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => openStory(district)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div className={`relative w-14 h-14 rounded-full p-0.5 ${seen ? 'bg-white/10' : `bg-gradient-to-br ${district.color}`}`}>
                <div className="w-full h-full rounded-full bg-dark-bg-secondary flex items-center justify-center text-2xl
                                group-hover:scale-95 transition-transform duration-200">
                  {district.emoji}
                </div>
                {!seen && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-telangana-green
                                   border-2 border-dark-bg flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-semibold tracking-wide truncate max-w-[56px] ${seen ? 'text-text-muted' : 'text-text-secondary'}`}>
                {district.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeStory && (
          <StoryOverlay
            story={activeStory.story}
            district={activeStory.district}
            onClose={closeStory}
          />
        )}
      </AnimatePresence>
    </>
  );
}
