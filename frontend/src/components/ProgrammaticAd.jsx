import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SPONSORS = [
    {
        title: "T-Fiber Broadband",
        description: "Connecting every household in Telangana with high-speed fiber internet. Plans start at ₹399/month.",
        cta: "Apply Now",
        link: "https://tfiber.telangana.gov.in",
        image: "🌐",
        color: "from-blue-600 to-cyan-500"
    },
    {
        title: "T-Hub Hyderabad",
        description: "World's largest innovation hub. Scale your startup with top mentors, corporate partners, and global investors.",
        cta: "Join Cohort",
        link: "https://t-hub.co",
        image: "🚀",
        color: "from-purple-600 to-indigo-500"
    },
    {
        title: "Telangana Tourism",
        description: "Discover the majestic Kakatiya temples, scenic waterfalls, and historic Hyderabad. Plan your heritage trail today.",
        cta: "Explore Guides",
        link: "https://tourism.telangana.gov.in",
        image: "🕌",
        color: "from-amber-500 to-orange-600"
    }
];

export default function ProgrammaticAd({ className = "", mode = "sponsor", adSlot = "8472910394" }) {
    const [loading, setLoading] = useState(true);
    const [ad, setAd] = useState(null);
    const [adSenseFailed, setAdSenseFailed] = useState(false);
    const location = useLocation();

    // Exclude ads on critical civic and emergency routes
    const isCriticalRoute = [
        '/emergency',
        '/weather',
        '/health',
        '/reservoirs'
    ].some(route => location.pathname.startsWith(route));

    useEffect(() => {
        if (isCriticalRoute) return;

        // Load sponsor card if sponsor mode or if AdSense fallback is active
        const randomSponsor = SPONSORS[Math.floor(Math.random() * SPONSORS.length)];
        setAd(randomSponsor);

        if (mode === 'adsense') {
            const timer = setTimeout(() => {
                try {
                    // Check if AdSense script is present and not blocked
                    if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                        setLoading(false);
                    } else {
                        // Failed to find adsbygoogle (likely adblocker)
                        setAdSenseFailed(true);
                        setLoading(false);
                    }
                } catch (e) {
                    console.warn("AdSense push failed, falling back to direct partner slot.", e);
                    setAdSenseFailed(true);
                    setLoading(false);
                }
            }, 300);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isCriticalRoute, mode, location.pathname]);

    if (isCriticalRoute) {
        return null;
    }

    const showAdSense = mode === 'adsense' && !adSenseFailed;

    return (
        <div className={`glass-card relative overflow-hidden flex flex-col justify-between p-5 min-h-[220px] border border-white/[0.08] rounded-2xl bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:border-white/15 ${className}`}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-990/80 backdrop-blur-sm z-10">
                    <div className="w-8 h-8 rounded-full border-2 border-heritage-gold/20 border-t-heritage-gold animate-spin mb-2"></div>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Connecting Ad Network...</span>
                </div>
            ) : null}

            {showAdSense ? (
                <div className="w-full flex flex-col items-center justify-center min-h-[180px] bg-black/20 rounded-xl p-2 border border-white/5">
                    <div className="w-full text-right mb-1">
                        <span className="text-[8px] text-text-muted uppercase tracking-wider">Programmatic Ad</span>
                    </div>
                    {/* Google AdSense Responsive Unit */}
                    <ins className="adsbygoogle w-full block"
                         data-ad-client="ca-pub-9647354789964102"
                         data-ad-slot={adSlot}
                         data-ad-format="auto"
                         data-full-width-responsive="true"
                         style={{ display: 'block', minHeight: '150px' }}></ins>
                </div>
            ) : (
                ad && (
                    <>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] px-2 py-0.5 rounded bg-heritage-gold/10 text-heritage-gold font-bold uppercase tracking-wider border border-heritage-gold/20">
                                Sponsored Partner
                            </span>
                            <span className="text-[18px] p-1.5 rounded-lg bg-white/5 border border-white/10">{ad.image}</span>
                        </div>

                        <div className="flex-1 mb-4">
                            <h4 className="text-sm font-bold text-white mb-1.5 hover:text-heritage-gold transition-colors duration-300 flex items-center gap-1.5">
                                {ad.title}
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            </h4>
                            <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                {ad.description}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <a
                                href={ad.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r ${ad.color || 'from-heritage-gold to-yellow-500'} rounded-xl hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300`}
                            >
                                {ad.cta} ↗
                            </a>
                        </div>
                    </>
                )
            )}
        </div>
    );
}
