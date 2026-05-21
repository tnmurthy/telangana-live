import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function estimateReadTime(text = '') {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ArticleModal({ article, onClose }) {
  const [fontSize, setFontSize] = useState(15);
  const backdropRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    if (!article) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.description || article.ai_summary || "",
      "datePublished": article.published,
      "author": {
        "@type": "Organization",
        "name": article.source
      },
      "publisher": {
        "@type": "Organization",
        "name": "Telangana Live",
        "logo": {
          "@type": "ImageObject",
          "url": "https://telangana.live/favicon.svg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": article.link || "https://telangana.live"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'news-article-jsonld';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('news-article-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [article]);

  if (!article) return null;
  const { title, source, published, description, ai_summary, link, category, region } = article;
  const readTime = estimateReadTime((description || '') + ' ' + (ai_summary || ''));

  return (
    <motion.div
      ref={backdropRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === backdropRef.current) onClose(); }}
    >
      <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="w-full sm:max-w-2xl max-h-[90dvh] overflow-y-auto
                     bg-dark-bg-secondary border border-white/[0.08] rounded-t-3xl sm:rounded-3xl
                     shadow-2xl custom-scrollbar"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-telangana-green/15 text-telangana-green text-[9px] font-bold uppercase tracking-wider">
                {category}
              </span>
              <span className="text-[10px] text-text-muted">· {readTime} min read</span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Font size controls */}
              <button onClick={() => setFontSize(f => Math.max(12, f - 1))}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/10 text-text-muted
                           hover:text-white transition-colors text-sm font-bold flex items-center justify-center">
                A
              </button>
              <button onClick={() => setFontSize(f => Math.min(20, f + 1))}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/10 text-text-muted
                           hover:text-white transition-colors text-base font-bold flex items-center justify-center">
                A
              </button>
              <button onClick={onClose}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/10 text-text-muted
                           hover:text-white transition-colors flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-5 space-y-4">
            {/* Meta */}
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <span className="font-bold text-telangana-green uppercase">{source}</span>
              <span>·</span>
              <span>{region}</span>
              <span>·</span>
              <span>{published}</span>
            </div>

            {/* Title */}
            <h1 className="text-xl font-black text-white leading-tight" style={{ fontSize: `${fontSize + 5}px` }}>
              {title}
            </h1>

            {/* AI Summary */}
            {ai_summary && (
              <div className="flex gap-2.5 p-3.5 rounded-xl bg-telangana-green/[0.06] border border-telangana-green/20">
                <svg className="w-4 h-4 text-telangana-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                <p className="text-sm text-text-secondary italic leading-relaxed" style={{ fontSize: `${fontSize - 1}px` }}>
                  {ai_summary}
                </p>
              </div>
            )}

            {/* Body */}
            {description && (
              <p className="text-text-secondary leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                {description}
              </p>
            )}

            {/* CTA */}
            <div className="pt-4 border-t border-white/[0.05]">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-telangana-green
                           hover:text-telangana-green-light transition-colors"
              >
                Read Full Article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
}
