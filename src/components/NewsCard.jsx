import { useState, useCallback } from 'react';
import { Icons } from './Icons';
import ShareWhatsApp from './ShareWhatsApp';
import ArticleModal from './ArticleModal';
import { formatRelativeTime } from '../utils/timeUtils';
import { useAppContext } from '../context/AppContext';

/* ─── Animated Waveform (voice active indicator) ─────────────── */
function Waveform() {
  return (
    <span className="flex items-end gap-[2px] h-4">
      {[1, 2, 3, 4, 3].map((d, i) => (
        <span
          key={i}
          className="w-[2px] bg-telangana-green rounded-full animate-waveform"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </span>
  );
}

/* ─── AI Confidence Ring ─────────────────────────────────────── */
function AIRing({ score = 78 }) {
  const r = 10;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <span className="flex items-center gap-1" title={`AI confidence: ${score}%`}>
      <svg width="26" height="26" viewBox="0 0 26 26" className="-rotate-90">
        <circle cx="13" cy="13" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="13" cy="13" r={r} fill="none"
          stroke="#00a86b" strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-[9px] font-bold text-telangana-green">{score}%</span>
    </span>
  );
}

/* ─── Share Buttons ──────────────────────────────────────────── */
function ShareButtons({ title, link, summary }) {
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(`📰 ${title}\n${link}`);

  const copyLink = async () => {
    await navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* WhatsApp */}
      <ShareWhatsApp type="custom" customTitle={`📰 ${title}`} customContent={summary || ''} customLink={link} />
      {/* Twitter/X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${text}`}
        target="_blank" rel="noopener noreferrer"
        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-sky-500/20 text-text-muted hover:text-sky-400 transition-all duration-200"
        title="Share on X / Twitter"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
        </svg>
      </a>
      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title)}`}
        target="_blank" rel="noopener noreferrer"
        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-blue-500/20 text-text-muted hover:text-blue-400 transition-all duration-200"
        title="Share on Telegram"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 1 0 24 12 12.013 12.013 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </a>
      {/* Copy */}
      <button
        onClick={copyLink}
        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white transition-all duration-200"
        title="Copy link"
      >
        {copied
          ? <svg className="w-3.5 h-3.5 text-telangana-green" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
        }
      </button>
    </div>
  );
}

/* ─── Main NewsCard ──────────────────────────────────────────── */
const NewsCard = ({ news, variant = 'standard' }) => {
  const { title, link, source, published, description, region, category, ai_summary, image_url } = news;
  const [speaking, setSpeaking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { recordRead } = useAppContext();

  const relTime = formatRelativeTime(published);

  // Derive a deterministic confidence score from the title length (demo; replace with real field)
  const aiConfidence = ai_summary ? Math.min(98, 60 + (title.length % 39)) : null;

  const handleSpeak = useCallback(() => {
    if (!window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utt = new SpeechSynthesisUtterance(`${title}. ${ai_summary || description || ''}`);
    utt.lang = 'en-IN';
    utt.rate = 0.95;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
    setSpeaking(true);
  }, [speaking, title, ai_summary, description]);

  const handleOpenModal = () => {
    recordRead();
    setModalOpen(true);
  };

  return (
    <>
      <article
        className="group relative overflow-hidden rounded-2xl
                   bg-white/[0.03] border border-white/[0.06]
                   hover:border-telangana-green/20 transition-all duration-500
                   hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/20
                   backdrop-blur-sm"
      >
        {/* Shimmer border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-telangana-green/10 to-transparent animate-card-shimmer" />
        </div>

        <div className={`flex flex-col ${variant !== 'compact' ? 'md:flex-row' : ''}`}>
          {/* Image / Thumbnail */}
          <div className={`relative overflow-hidden ${variant === 'compact' ? 'h-36' : 'h-40 md:h-auto md:w-44 lg:w-52'} shrink-0`}>
            {image_url ? (
              <img
                src={image_url}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/[0.04] to-white/[0.01] flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <svg className="w-6 h-6 text-text-muted/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5" /></svg>
                </div>
              </div>
            )}
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-0.5 rounded-md bg-dark-bg/80 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-[0.1em] border border-white/10">
                {category}
              </span>
            </div>
            {/* Voice active indicator */}
            {speaking && (
              <div className="absolute bottom-3 right-3 bg-dark-bg/80 backdrop-blur-sm rounded-lg px-2 py-1.5">
                <Waveform />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-grow flex flex-col p-4 lg:p-5 min-w-0">
            {/* Source & Time */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-telangana-green uppercase tracking-wider">{source}</span>
              <span className="w-1 h-1 rounded-full bg-white/15" />
              <span className="text-[10px] text-text-muted font-medium" title={published}>{relTime}</span>
            </div>

            {/* Headline */}
            <h3
              className="text-[15px] lg:text-base font-bold text-white mb-2 leading-snug
                         group-hover:text-telangana-green-light transition-colors duration-300 line-clamp-2 cursor-pointer"
              onClick={handleOpenModal}
            >
              {title}
            </h3>

            {/* AI Summary with confidence ring */}
            {ai_summary && (
              <div className="mb-3 px-3 py-2.5 rounded-xl bg-telangana-green/[0.04] border-l-2 border-telangana-green/40">
                <div className="flex items-start gap-2">
                  <svg className="w-3 h-3 text-telangana-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                  <p className="text-xs text-text-secondary leading-relaxed font-light italic flex-grow">{ai_summary}</p>
                  {aiConfidence !== null && <AIRing score={aiConfidence} />}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-text-muted text-xs line-clamp-2 mb-4 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              {description}
            </p>

            {/* Footer Actions */}
            <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] text-text-muted font-semibold uppercase tracking-widest flex items-center gap-1.5">
                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                {region}
              </span>

              <div className="flex items-center gap-1.5">
                {/* Voice readout */}
                <button
                  onClick={handleSpeak}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    speaking
                      ? 'bg-telangana-green/20 text-telangana-green'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white'
                  }`}
                  title={speaking ? 'Stop reading' : 'Read aloud'}
                >
                  🔊
                </button>
                {/* Reader view */}
                <button
                  onClick={handleOpenModal}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white transition-all duration-200"
                  title="Reader view"
                >
                  <Icons.ExternalLink className="w-3.5 h-3.5" />
                </button>
                {/* Share */}
                <ShareButtons title={title} link={link} summary={ai_summary || description} />
              </div>
            </div>
          </div>
        </div>
      </article>

      {modalOpen && <ArticleModal article={news} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default NewsCard;

