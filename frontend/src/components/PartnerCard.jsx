import { useState } from 'react';

export default function PartnerCard({ partner }) {
    // Mock DNA match percentage for the Pomelli aesthetic
    const [dnaMatch] = useState(() => Math.floor(Math.random() * 15) + 85);

    return (
        <div className="glass-card overflow-hidden hover-lift flex flex-col h-full border border-white/[0.08] group relative">
            {/* Premium Gradient Glow Backlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-heritage-gold/5 via-transparent to-telangana-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            {/* Image section with Premium Badging */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent"></div>

                {/* Verified DNA Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse-live"></div>
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Business DNA Verified</span>
                </div>

                {/* DNA Match Percentage (Pomelli Style) */}
                <div className="absolute bottom-4 right-4 bg-heritage-gold/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-heritage-gold/30 shadow-2xl">
                    <p className="text-[9px] text-dark-bg font-black uppercase tracking-tighter leading-none mb-0.5">Brand Sync</p>
                    <p className="text-sm text-dark-bg font-black leading-none">{dnaMatch}% Match</p>
                </div>
            </div>

            {/* Content section */}
            <div className="p-6 flex flex-col flex-1 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-text-muted font-bold uppercase tracking-widest border border-white/5">
                        {partner.category}
                    </span>
                </div>

                <h4 className="font-heading font-black text-xl text-white mb-3 tracking-tight group-hover:text-heritage-gold transition-colors duration-300">
                    {partner.name}
                </h4>

                <p className="text-sm text-text-secondary mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {partner.description}
                </p>

                {/* DNA Progress Bar (Visual decoration) */}
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-gradient-to-r from-heritage-gold to-white rounded-full" style={{ width: `${dnaMatch}%` }}></div>
                </div>

                <a
                    href={partner.link}
                    className="w-full py-3.5 rounded-2xl bg-white text-dark-bg text-[11px] font-black uppercase tracking-[0.2em] text-center hover:bg-heritage-gold transition-all shadow-xl active:scale-[0.98]"
                >
                    {partner.cta}
                </a>
            </div>
        </div>
    );
}

