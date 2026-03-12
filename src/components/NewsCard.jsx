import React from 'react';
import { Icons } from './Icons';
import ShareWhatsApp from './ShareWhatsApp';

const NewsCard = ({ news }) => {
  const { title, link, source, published, description, region, category, ai_summary, tags } = news;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-telangana-green/30 transition-all duration-300 backdrop-blur-sm p-5 flex flex-col h-full">
      {/* Category & Region Badges */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full bg-telangana-green/20 text-telangana-green text-[10px] font-bold uppercase tracking-wider">
          {category}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-white/5 text-text-muted text-[10px] font-medium tracking-wide">
          {region}
        </span>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-telangana-green transition-colors">
          <a href={link} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h3>

        {/* AI Summary Highlight */}
        {ai_summary && (
          <div className="mb-3 p-3 rounded-xl bg-telangana-green/5 border-l-2 border-telangana-green italic text-sm text-telangana-green/90 leading-relaxed font-light">
            {ai_summary}
          </div>
        )}

        <p className="text-text-muted text-sm line-clamp-3 mb-4 leading-relaxed font-light">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-tighter opacity-70">Source</span>
          <span className="text-xs text-white/80 font-semibold">{source}</span>
        </div>
        
        <div className="flex items-center gap-3">
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
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            title="Read Full Article"
          >
            <Icons.ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Published Date */}
      <div className="absolute top-5 right-5 text-[10px] text-text-muted font-medium font-mono opacity-50">
        {published}
      </div>
    </div>
  );
};

export default NewsCard;
