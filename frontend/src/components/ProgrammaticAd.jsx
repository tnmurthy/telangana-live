import { useState, useEffect } from 'react';

const MOCK_ADS = [
    {
        title: "T-Fiber Broadband",
        description: "Connecting every household in Telangana with high-speed fiber internet. Plans start at ₹399/month.",
        cta: "Apply Now",
        link: "https://tfiber.telangana.gov.in",
        image: "🌐"
    },
    {
        title: "T-Hub Hyderabad",
        description: "World's largest innovation hub. Scale your startup with top mentors, corporate partners, and global investors.",
        cta: "Join Cohort",
        link: "https://t-hub.co",
        image: "🚀"
    },
    {
        title: "Telangana Tourism",
        description: "Discover the majestic Kakatiya temples, scenic waterfalls, and historic Hyderabad. Plan your heritage trail today.",
        cta: "Explore Guides",
        link: "https://tourism.telangana.gov.in",
        image: "🕌"
    }
];

export default function ProgrammaticAd({ className = "" }) {
    const [loading, setLoading] = useState(true);
    const [ad, setAd] = useState(null);

    useEffect(() => {
        const randomAd = MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)];
        setAd(randomAd);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`glass-card relative overflow-hidden flex flex-col justify-between p-5 min-h-[200px] border border-white/[0.08] rounded-2xl bg-white/[0.02] backdrop-blur-md transition-all duration-300 ${className}`}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10">
                    <div className="w-8 h-8 rounded-full border-2 border-heritage-gold/20 border-t-heritage-gold animate-spin mb-2"></div>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Loading Partner Content...</span>
                </div>
            ) : null}

            {ad && (
                <>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-heritage-gold/15 text-heritage-gold font-bold uppercase tracking-wider border border-heritage-gold/20">
                            Sponsored Partner
                        </span>
                        <span className="text-[18px]">{ad.image}</span>
                    </div>

                    <div className="flex-1 mb-4">
                        <h4 className="text-sm font-bold text-white mb-1.5 hover:text-heritage-gold transition-colors duration-300">
                            {ad.title}
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
                            className="w-full inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-heritage-gold to-yellow-500 rounded-xl hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300"
                        >
                            {ad.cta}
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}
