import { getDailyShloka } from '../data/shlokas';

export default function DailyShloka() {
    const shloka = getDailyShloka();

    return (
        <div className="glass-card overflow-hidden animate-fade-in relative">
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-heritage-gold/50 to-transparent" />

            <div className="section-block">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-heritage-gold/10 flex items-center justify-center text-base">🙏</div>
                    <h3 className="font-heading font-bold gold-text text-sm tracking-tight">Daily Shloka</h3>
                </div>

                {/* Sanskrit */}
                <blockquote className="text-base sm:text-lg font-semibold text-white mb-3 leading-relaxed border-l-2 border-heritage-gold/30 pl-4">
                    {shloka.sanskrit}
                </blockquote>

                {/* Telugu */}
                <p className="text-sm text-text-secondary mb-2.5 pl-4 leading-relaxed">
                    <span className="gold-text font-semibold text-xs uppercase tracking-wider">తెలుగు</span>
                    <br />
                    {shloka.telugu}
                </p>

                {/* English */}
                <p className="text-xs text-text-muted italic pl-4 mb-3 leading-relaxed">"{shloka.meaning}"</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                    <span className="text-[10px] text-text-muted font-medium">📖 {shloka.source}</span>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`${shloka.sanskrit}\n\n${shloka.telugu}\n\n— ${shloka.source}\n\nvia telangana.live`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-green-400/80 hover:text-green-300 transition-all duration-300 px-2 py-1 rounded-lg hover:bg-green-400/10">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.113 1.519 5.845L.034 24l6.325-1.655A11.927 11.927 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82a9.796 9.796 0 01-5.285-1.539l-.38-.225-3.94 1.033 1.052-3.844-.248-.394A9.795 9.795 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82S21.82 6.578 21.82 12 17.422 21.82 12 21.82z" />
                        </svg>
                        Share
                    </a>
                </div>
            </div>
        </div>
    );
}
