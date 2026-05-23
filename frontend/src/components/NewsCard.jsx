import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import ShareWhatsApp from './ShareWhatsApp';
import ArticleModal from './ArticleModal';
import { formatRelativeTime } from '../utils/timeUtils';
import { useAppContext } from '../context/AppContext';


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
const NewsCard = ({ news }) => {
  const { id, title, link, source, published, description, region, category, ai_summary, image_url, credibility_score } = news;
  const [speaking, setSpeaking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { recordRead, followed, toggleFollow } = useAppContext();

  const relTime = formatRelativeTime(published);
  const aiConfidence = credibility_score || (ai_summary ? Math.min(98, 75 + (title.length % 20)) : null);

  const isOfficial = source?.toLowerCase().includes('ghmc') || source?.toLowerCase().includes('govt');
  const isVerified = source?.toLowerCase().includes('hindu') || source?.toLowerCase().includes('today');
  const isFollowing = followed.topics.includes(category) || followed.regions.includes(region);

  // Google News layout logic: If no image is provided, do not use generic stock fallbacks.
  // Instead, set finalImage to null so the card collapses and text fills 100% width.
  const finalImage = (!imageError && image_url) ? image_url : null;

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
        className="liquid-glass liquid-glass-hover group relative flex flex-col md:flex-row gap-6 p-5 sm:p-6 overflow-hidden cursor-pointer"
      >
        {/* Inner Gradient Glow */}
        <div className="absolute inset-0 gradient-glass pointer-events-none" />
        
        {/* Image Area (Apple-style rounded corners) */}
        {finalImage && (
          <div className="w-full md:w-44 h-44 md:h-44 shrink-0 rounded-[20px] overflow-hidden relative z-10 border border-white/10">
            <img 
              src={finalImage} 
              alt={title} 
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-grow min-w-0 flex flex-col relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{source}</span>
              </div>
              {isOfficial && (
                <div className="flex items-center gap-1 text-[9px] font-black text-red-400 uppercase tracking-wider">
                  <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                  Official
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{relTime}</span>
          </div>

          {/* Headline */}
          <h3 className="text-lg sm:text-xl font-bold text-white leading-[1.3] mb-3 group-hover:text-telangana-green transition-colors line-clamp-2">
            {title}
          </h3>

          {/* AI Summary or Description Snippet */}
          {(ai_summary || description) && (
            <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-4">
              {ai_summary || description}
            </p>
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
