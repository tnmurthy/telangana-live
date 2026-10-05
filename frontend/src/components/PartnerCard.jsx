// A paid area-page spotlight from data/partners.js. Always labelled
// "Sponsored". It used to show a randomly generated brand-match percentage
// and a "verified" badge, neither of which measured anything
// (docs/DATA_STANDARDS.md).
export default function PartnerCard({ partner, variant = 'default' }) {
    const isDistrict = variant === 'district';
    const shellClass = isDistrict
        ? 'rounded-3xl border border-white/10 bg-[#15181d] overflow-hidden shadow-xl'
        : 'glass-card overflow-hidden hover-lift border border-white/[0.08]';

    return (
        <div className={`${shellClass} flex flex-col h-full group relative`}>
            {partner.image && (
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={partner.image}
                        alt={partner.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent"></div>
                </div>
            )}

            <div className={`${isDistrict ? 'p-4 sm:p-5' : 'p-6'} flex flex-col flex-1 relative z-10`}>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] bg-heritage-gold/10 px-2 py-1 rounded-md text-heritage-gold font-bold uppercase tracking-widest border border-heritage-gold/20">
                        Sponsored
                    </span>
                    {partner.category && (
                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-text-muted font-bold uppercase tracking-widest border border-white/5">
                            {partner.category}
                        </span>
                    )}
                </div>

                <h4 className="font-heading font-black text-lg sm:text-xl text-white mb-3 tracking-tight group-hover:text-heritage-gold transition-colors duration-300">
                    {partner.name}
                </h4>

                <p className="text-sm text-text-secondary mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {partner.description}
                </p>

                <a
                    href={partner.link}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-white text-dark-bg text-[11px] font-black uppercase tracking-[0.2em] text-center hover:bg-heritage-gold transition-all shadow-xl active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
                >
                    {partner.cta}
                </a>
            </div>
        </div>
    );
}
