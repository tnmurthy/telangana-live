import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from './Icons';
import ShareWhatsApp from './ShareWhatsApp';
import ArticleModal from './ArticleModal';
import { formatRelativeTime } from '../utils/timeUtils';
import { useAppContext } from '../context/AppContext';

/* ─── News Reaction Pulse (Phase 4) ──────────────────────────── */
function ReactionPulse({ articleId }) {
  const [reactions, setReactions] = useState(() => {
    const saved = localStorage.getItem(`tg-react-${articleId}`);
    // Simulate live feeling with randomized initial counters
    const base = (articleId.length % 5) * 12 + 5;
    return {
      safe: { count: base + 2, active: saved === 'safe' },
      helpful: { count: base + 18, active: saved === 'helpful' },
      eye: { count: base % 4, active: saved === 'eye' },
    };
  });

  const handleReact = (type) => {
    setReactions(prev => {
      const isRemoving = prev[type].active;
      const next = {
        ...prev,
        [type]: { count: prev[type].count + (isRemoving ? -1 : 1), active: !isRemoving },
        // Unset others
        ...(type !== 'safe' ? { safe: { ...prev.safe, active: false } } : {}),
        ...(type !== 'helpful' ? { helpful: { ...prev.helpful, active: false } } : {}),
        ...(type !== 'eye' ? { eye: { ...prev.eye, active: false } } : {}),
      };
      if (!isRemoving) localStorage.setItem(`tg-react-${articleId}`, type);
      else localStorage.removeItem(`tg-react-${articleId}`);
      return next;
    });
  };

  return (
    <div className="flex items-center gap-1.5 mt-3 sm:mt-0">
      <button 
        onClick={(e) => { e.stopPropagation(); handleReact('safe'); }}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${reactions.safe.active ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
      >
        <span>🛡️</span> {reactions.safe.count}
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); handleReact('helpful'); }}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${reactions.helpful.active ? 'bg-telangana-green/20 text-telangana-green border border-telangana-green/30' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
      >
        <span>✅</span> {reactions.helpful.count}
      </button>
      {reactions.eye.count > 0 && (
        <button 
          onClick={(e) => { e.stopPropagation(); handleReact('eye'); }}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${reactions.eye.active ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
        >
          <span>👁️</span> {reactions.eye.count}
        </button>
      )}
    </div>
  );
}

/* ─── AI Confidence Ring ─────────────────────────────────────── */
function AIRing({ score = 78 }) {
  const r = 9;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex items-center gap-1.5" title={`AI Accuracy: ${score}%`}>
      <svg width="20" height="20" viewBox="0 0 26 26" className="-rotate-90">
        <circle cx="13" cy="13" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
        <circle
          cx="13" cy="13" r={r} fill="none"
          stroke="var(--telangana-green)" strokeWidth="2.5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <span className="text-[9px] font-mono text-telangana-green/80 font-bold">{score}%</span>
    </div>
  );
}

/* ─── NewsCard (Google News / Premium Civic Portal Style) ────── */
const NewsCard = ({ news, variant = 'standard' }) => {
  const { id, title, link, source, published, description, region, category, ai_summary, image_url } = news;
  const [speaking, setSpeaking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { recordRead, followed, toggleFollow } = useAppContext();

  const relTime = formatRelativeTime(published);
  const aiConfidence = ai_summary ? Math.min(98, 70 + (title.length % 25)) : null;

  // 1. Badge Logic
  const sourceLower = source.toLowerCase();
  const titleLower = title.toLowerCase();
  const isOfficial = sourceLower.includes('ghmc') || sourceLower.includes('hmwssb') || sourceLower.includes('tsrtc') || 
                    sourceLower.includes('police') || sourceLower.includes('hydra') || sourceLower.includes('government') || sourceLower.includes('pds');
  const isVerifiedNews = sourceLower.includes('hindu') || sourceLower.includes('telangana today') || 
                        sourceLower.includes('chronicle') || sourceLower.includes('india today') || sourceLower.includes('times of india');

  // 2. Follow Status
  const isTopicFollowed = followed.topics.includes(category);
  const isRegionFollowed = followed.regions.includes(region);
  const isFollowing = isTopicFollowed || isRegionFollowed;

  // 3. Civic Action Button Logic (Phase 3)
  const civicAction = useMemo(() => {
    if (titleLower.includes('tax') || titleLower.includes('property')) return { label: 'Pay Tax', path: '/property-tax', icon: <Icons.Building className="w-3 h-3" /> };
    if (titleLower.includes('water') || titleLower.includes('hmwssb')) return { label: 'Check Supply', path: '/water-supply', icon: <Icons.Search className="w-3 h-3" /> };
    if (titleLower.includes('metro') || titleLower.includes('tsrtc') || titleLower.includes('transit')) return { label: 'Plan Trip', path: '/transport/metro', icon: <Icons.Location className="w-3 h-3" /> };
    if (titleLower.includes('ration') || titleLower.includes('pds')) return { label: 'Check Ration', path: '/ration-pds', icon: <Icons.Info className="w-3 h-3" /> };
    if (titleLower.includes('scheme') || titleLower.includes('beneficiary')) return { label: 'Apply Now', path: '/schemes', icon: <Icons.Building className="w-3 h-3" /> };
    if (titleLower.includes('rain') || titleLower.includes('weather') || titleLower.includes('heatwave')) return { label: 'View Forecast', path: '/weather/forecast', icon: <Icons.Cloud className="w-3 h-3" /> };
    return null;
  }, [titleLower]);

  // 4. Image Fallbacks
  const finalImage = useMemo(() => {
    if (image_url) return image_url;
    if (description && description.includes('<img')) {
      const match = description.match(/src="([^"]+)"/);
      if (match) return match[1];
    }
    const localFallbacks = {
      Politics: '/images/fallback/assembly.png',
      Transit: '/images/fallback/metro.png',
      Business: '/images/fallback/market.png',
      Hyderabad: '/images/fallback/hyderabad_skyline.png',
    };
    if (category === 'Politics') return localFallbacks.Politics;
    if (category === 'Transit') return localFallbacks.Transit;
    if (category === 'Business') return localFallbacks.Business;
    if (region?.includes('Hyderabad')) return localFallbacks.Hyderabad;
    return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400&auto=format';
  }, [image_url, description, category, region]);

  const cleanDescription = useMemo(() => {
    if (!description) return '';
    return description.replace(/<[^>]*>/g, '').trim();
  }, [description]);

  const handleSpeak = useCallback((e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utt = new SpeechSynthesisUtterance(`${title}. ${ai_summary || cleanDescription}`);
    utt.lang = 'en-IN';
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
    setSpeaking(true);
  }, [speaking, title, ai_summary, cleanDescription]);

  const handleOpenModal = () => {
    recordRead();
    setModalOpen(true);
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    if (region && region !== 'Telangana') toggleFollow('regions', region);
    else toggleFollow('topics', category);
  };

  return (
    <>
      <article
        onClick={handleOpenModal}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-white/[0.01] border transition-all duration-500 hover:shadow-2xl hover:shadow-black/40 p-4 sm:p-5
                   ${isFollowing ? 'border-telangana-green/40 bg-telangana-green/[0.02]' : 'border-white/[0.04] hover:border-telangana-green/30 hover:bg-white/[0.04]'}`}
      >
        {isFollowing && (
          <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none overflow-hidden">
            <div className="absolute top-2 right-[-24px] rotate-45 bg-telangana-green text-dark-bg text-[8px] font-black py-0.5 px-8 uppercase tracking-widest">
              Pinned
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6">
          <div className="flex-grow min-w-0 flex flex-col justify-between">
            <div>
              {/* Header: Source & Badges */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white/5 rounded-full pl-1.5 pr-2.5 py-0.5 border border-white/5">
                    <div className="w-3.5 h-3.5 rounded-full bg-telangana-green/20 flex items-center justify-center text-[7px] font-black text-telangana-green uppercase">
                      {source.charAt(0)}
                    </div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{source}</span>
                  </div>

                  {isOfficial && (
                    <span className="flex items-center gap-1 bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-red-500/20">
                      <Icons.Emergency className="w-2.5 h-2.5" />
                      Official
                    </span>
                  )}
                  {isVerifiedNews && !isOfficial && (
                    <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-blue-500/20">
                      <Icons.Check className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-text-muted font-semibold tracking-tighter uppercase">{relTime}</span>
                   <button 
                    onClick={handleFollow}
                    className={`p-1 rounded-full transition-all duration-300 ${isFollowing ? 'text-telangana-green scale-110' : 'text-text-muted/40 hover:text-white hover:scale-110'}`}
                   >
                     {isFollowing ? <Icons.Heart className="w-4 h-4 fill-current" /> : <Icons.Heart className="w-4 h-4" />}
                   </button>
                </div>
              </div>

              {/* Headline */}
              <h3 className="text-base sm:text-lg lg:text-[1.15rem] font-heading font-extrabold text-white leading-[1.25] mb-3 group-hover:text-telangana-green-light transition-colors line-clamp-3">
                {title}
              </h3>

              {/* Civic Action Button (Phase 3) */}
              {civicAction && (
                <Link 
                  to={civicAction.path}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-lg bg-telangana-green text-dark-bg text-[10px] font-black uppercase tracking-wider hover:bg-telangana-green-light transition-all shadow-lg shadow-telangana-green/10"
                >
                  {civicAction.icon}
                  {civicAction.label}
                </Link>
              )}

              {/* AI Insight */}
              {ai_summary && (
                <div className="relative mb-4 bg-telangana-green/[0.03] rounded-xl p-3 border-l-2 border-telangana-green/40 group-hover:bg-telangana-green/[0.05] transition-colors">
                  <div className="flex items-start gap-2.5">
                    <Icons.Info className="w-3 h-3 text-telangana-green mt-0.5 shrink-0" />
                    <p className="text-[11.5px] leading-relaxed text-text-secondary line-clamp-3">
                      <span className="text-telangana-green font-bold text-[9px] uppercase tracking-widest block mb-0.5">Quick Summary</span>
                      {ai_summary}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer & Reaction Pulse (Phase 4) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 pt-3 border-t border-white/[0.03]">
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFollow('regions', region); }}
                  className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-md transition-all ${isRegionFollowed ? 'bg-telangana-green/20 text-telangana-green' : 'text-text-muted opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                >
                  <Icons.Pin className="w-2.5 h-2.5" />
                  {region}
                </button>
                {aiConfidence && <AIRing score={aiConfidence} />}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 mt-3 sm:mt-0">
                <ReactionPulse articleId={id || title} />
                <div className="w-px h-3 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleSpeak}
                    className={`p-2 rounded-xl transition-all ${speaking ? 'bg-telangana-green text-dark-bg' : 'hover:bg-white/10 text-text-muted hover:text-white'}`}
                  >
                    <Icons.Sound className="w-3.5 h-3.5" />
                  </button>
                  <ShareWhatsApp type="custom" customTitle={title} customLink={link} />
                </div>
              </div>
            </div>
          </div>

          {/* IMAGE AREA */}
          {finalImage && (
            <div className="w-full sm:w-28 sm:h-28 lg:w-40 lg:h-40 shrink-0 rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.05] relative shadow-2xl">
               <img
                src={finalImage}
                alt={title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>
      </article>

      {modalOpen && <ArticleModal article={news} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default NewsCard;
