import React from 'react';
import { Icons } from './Icons';
import ShareWhatsApp from './ShareWhatsApp';

const NewsCard = ({ news, variant = 'standard' }) => {
  const { title, link, source, published, description, region, category, ai_summary, image_url } = news;

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-telangana-green/20 transition-all duration-500 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/20">
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
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col p-4 lg:p-5 min-w-0">
          {/* Source & Time */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-telangana-green uppercase tracking-wider">{source}</span>
            <span className="w-1 h-1 rounded-full bg-white/15"></span>
            <span className="text-[10px] text-text-muted font-medium">{published}</span>
          </div>

          {/* Headline */}
          <h3 className="text-[15px] lg:text-base font-bold text-white mb-2 leading-snug group-hover:text-telangana-green-light transition-colors duration-300 line-clamp-2">
            <a href={link} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          </h3>

          {/* AI Summary */}
          {ai_summary && (
            <div className="mb-3 px-3 py-2.5 rounded-xl bg-telangana-green/[0.04] border-l-2 border-telangana-green/40">
              <div className="flex items-start gap-1.5">
                <svg className="w-3 h-3 text-telangana-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                <p className="text-xs text-text-secondary leading-relaxed font-light italic">{ai_summary}</p>
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

            <div className="flex items-center gap-2">
              <ShareWhatsApp
                type="custom"
                customTitle={`📰 ${title}`}
                customContent={ai_summary || description}
                customLink={link}
              />
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white transition-all duration-200"
                title="Full Coverage"
              >
                <Icons.ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
