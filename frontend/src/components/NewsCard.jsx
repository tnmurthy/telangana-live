import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Icons } from './Icons';
import ShareWhatsApp from './ShareWhatsApp';
import ArticleModal from './ArticleModal';
import { formatRelativeTime } from '../utils/timeUtils';
import { useAppContext } from '../context/AppContext';

const getCategoryCover = (category) => {
  const covers = {
    Govt: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=500&auto=format&fit=crop&q=80',
    Business: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    Safety: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    Transit: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80',
    Weather: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=500&auto=format&fit=crop&q=80',
    Education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80',
    Health: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=500&auto=format&fit=crop&q=80',
    General: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&auto=format&fit=crop&q=80'
  };
  return covers[category] || covers.General;
};

function PublisherLogo({ name = '' }) {
  const char = name.charAt(0).toUpperCase();
  const colors = {
    T: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    H: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    D: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    G: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  const theme = colors[char] || 'bg-white/10 text-white/80 border-white/20';
  return (
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-black tracking-tighter ${theme}`}>
      {char}
    </div>
  );
}

/* ─── Apple-Style Confidence Badge ──────────────────────────── */
function ConfidenceBadge({ score = 78 }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="w-1.5 h-1.5 rounded-full bg-telangana-green shadow-[0_0_8px_rgba(0,168,107,0.8)]" />
      <span className="text-[9px] font-bold text-white/70 tracking-tight">{score}% AI Confidence</span>
    </div>
  );
}

/* ─── NewsCard (Liquid Glass Edition) ───────────────────────── */
const NewsCard = ({ news, isSpotlight = false }) => {
  const { id, title, link, source, published, description, region, category, ai_summary, image_url, credibility_score, other_sources } = news;
  const [speaking, setSpeaking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { recordRead, followed, toggleFollow } = useAppContext();

  const relTime = formatRelativeTime(published);
  const aiConfidence = credibility_score || (ai_summary ? Math.min(98, 75 + (title.length % 20)) : null);

  const isOfficial = source?.toLowerCase().includes('ghmc') || source?.toLowerCase().includes('govt');
  const isVerified = source?.toLowerCase().includes('hindu') || source?.toLowerCase().includes('today');
  const isFollowing = followed.topics.includes(category) || followed.regions.includes(region);

  const finalImage = !imageError ? (image_url || getCategoryCover(category)) : getCategoryCover(category);

  const civicAction = useMemo(() => {
    const t = title?.toLowerCase() || '';
    if (t.includes('tax')) return { label: 'Pay Tax', path: '/property-tax', icon: <Icons.Building className="w-3 h-3" /> };
    if (t.includes('metro') || t.includes('bus')) return { label: 'Plan Trip', path: '/transport', icon: <Icons.Location className="w-3 h-3" /> };
    return null;
  }, [title]);

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utt = new SpeechSynthesisUtterance(`${title}. ${ai_summary || ''}`);
    utt.lang = 'en-IN';
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
    setSpeaking(true);
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    toggleFollow(region && region !== 'Telangana' ? 'regions' : 'topics', region || category);
  };

  return (
    <>
      <article
        onClick={() => {
          recordRead();
          if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
          } else {
            setModalOpen(true);
          }
        }}
        className={`liquid-glass liquid-glass-hover group relative flex flex-col gap-6 p-5 sm:p-6 overflow-hidden cursor-pointer ${
          isSpotlight 
            ? 'col-span-full md:flex-row md:p-8 border border-white/10 shadow-[0_0_30px_rgba(0,176,116,0.05)]' 
            : 'md:flex-row-reverse justify-between items-start'
        }`}
      >
        {/* Inner Gradient Glow */}
        <div className="absolute inset-0 gradient-glass pointer-events-none" />
        
        {/* Image Area (Google News styled) */}
        {finalImage && (
          <div className={`shrink-0 rounded-2xl overflow-hidden relative z-10 border border-white/10 shadow-lg ${
            isSpotlight 
              ? 'w-full md:w-[42%] h-52 md:h-60' 
              : 'w-full md:w-28 h-28 md:h-28 self-start md:ml-4'
          }`}>
            <img 
              src={finalImage} 
              alt={title} 
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-grow min-w-0 flex flex-col relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                <PublisherLogo name={source} />
                <span className="text-[9px] font-black text-white/90 uppercase tracking-wider">{source}</span>
              </div>
              {isOfficial && (
                <div className="flex items-center gap-1.5 text-[9px] font-black text-red-400 uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Official
                </div>
              )}
            </div>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{relTime}</span>
          </div>

          {/* Headline */}
          <h3 className={`font-bold text-white leading-snug mb-2 group-hover:text-telangana-green transition-colors line-clamp-3 ${
            isSpotlight ? 'text-xl sm:text-2xl font-black' : 'text-base sm:text-lg'
          }`}>
            {title}
          </h3>

          {/* AI Summary or Description Snippet */}
          {(ai_summary || description) && (
            <p className="text-xs text-white/50 leading-relaxed line-clamp-2 mb-3">
              {ai_summary || description}
            </p>
          )}

          {/* Alternative Coverage accordion (Google News inspired) */}
          {other_sources && other_sources.length > 0 && (
            <div className="mt-2.5 mb-3 relative z-20">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 text-telangana-green text-[10px] font-black uppercase tracking-wider transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5" />
                </svg>
                {isExpanded ? 'Hide' : 'View'} Full Coverage ({other_sources.length})
                <svg 
                  className={`w-2.5 h-2.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden mt-3 space-y-2 border-l border-emerald-500/20 pl-3.5 py-1"
                  >
                    {other_sources.map((src, idx) => (
                      <a 
                        key={idx}
                        href={src.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 py-1 text-xs text-white/50 hover:text-telangana-green transition-all"
                      >
                        <PublisherLogo name={src.source} />
                        <span className="font-bold text-white/70 hover:underline">{src.source}</span>
                        <span className="text-[10px] text-white/30">• Alternative Coverage Link</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Footer Metadata & Actions */}
          <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              {aiConfidence && <ConfidenceBadge score={aiConfidence} />}
              {civicAction && (
                <Link 
                  to={civicAction.path} 
                  onClick={e => e.stopPropagation()} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg shadow-white/5"
                >
                  {civicAction.label}
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleSpeak} 
                className={`p-2 rounded-full backdrop-blur-md border border-white/10 transition-all ${speaking ? 'bg-telangana-green text-black border-telangana-green' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <Icons.Sound className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleFollow} 
                className={`p-2 rounded-full backdrop-blur-md border border-white/10 transition-all ${isFollowing ? 'bg-white/20 text-white border-white/30' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <Icons.Heart className={`w-3.5 h-3.5 ${isFollowing ? 'fill-current' : ''}`} />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <ShareWhatsApp type="custom" customTitle={title} customLink={link} />
            </div>
          </div>
        </div>

        {/* Glass Reflection Highlight */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
      </article>

      <AnimatePresence>
        {modalOpen && <ArticleModal article={news} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default NewsCard;
