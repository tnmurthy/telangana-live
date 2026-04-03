import React from 'react';
import { Icons } from './Icons';
import ShareWhatsApp from './ShareWhatsApp';

const NewsCard = ({ news, variant = 'standard' }) => {
  const { title, link, source, published, description, region, category, ai_summary, image_url } = news;

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white/[0.04] border border-white/5 hover:border-telangana-green/30 transition-all duration-500 hover:shadow-2xl hover:shadow-telangana-green/5 p-4 lg:p-6 flex flex-col md:flex-row gap-5 ${variant === 'compact' ? 'md:flex-col' : ''}`}>
      
      {/* Optional Image / Icon */}
      <div className={`shrink-0 w-full md:w-32 lg:w-40 h-32 rounded-xl bg-white/5 overflow-hidden border border-white/5 relative group-hover:scale-[1.02] transition-transform duration-500 ${!image_url ? 'flex items-center justify-center' : ''}`}>
        {image_url ? (
          <img src={image_url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-4xl opacity-20">📰</div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="px-1.5 py-0.5 rounded-md bg-telangana-green/80 text-white text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-telangana-green uppercase tracking-tighter hover:underline cursor-pointer">{source}</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-tight">{published}</span>
        </div>

        <h3 className="text-base lg:text-lg font-bold text-white mb-2 leading-tight group-hover:text-telangana-green transition-colors decoration-telangana-green/30 decoration-2 underline-offset-4 line-clamp-2">
          <a href={link} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h3>

        {/* AI Summary Shadow Box */}
        {ai_summary && (
          <div className="mb-3 p-3 rounded-xl bg-white/[0.03] border-l-2 border-telangana-green italic text-xs text-text-secondary leading-relaxed font-light">
            <span className="font-black text-[10px] text-telangana-green uppercase mr-1 not-italic tracking-widest">AI Pulse:</span>
            {ai_summary}
          </div>
        )}

        <p className="text-text-muted text-xs lg:text-sm line-clamp-2 mb-4 leading-relaxed font-light opacity-80 group-hover:opacity-100 transition-opacity">
          {description}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-1">
            <Icons.Info size="xs" className="opacity-50" /> {region}
          </span>
          
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
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
              title="Full Coverage"
            >
              <Icons.ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
