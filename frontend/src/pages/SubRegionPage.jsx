import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { partners } from '../data/partners';
import PartnerCard from '../components/PartnerCard';
import DailyRatesDashboard from '../components/DailyRatesDashboard';
import WeatherCard from '../components/WeatherCard';
import BasthiDawakhana from '../components/BasthiDawakhana';
import MetroCard from '../components/MetroCard';
import useJsonLd from '../hooks/useJsonLd';
import NewsCard from '../components/NewsCard';
import newsData from '../data/news.json';
import PowerTariffCard from '../components/PowerTariffCard';
import ServicesDirectory from '../components/ServicesDirectory';
import OdopWidget from '../components/OdopWidget';
import NotFound from './NotFound';
import { districtNewsSources } from '../data/districtNewsSources';
import odopData from '../data/odopData.json';
import districtsData from '../data/districts.json';

export default function SubRegionPage() {
    const { region } = useParams();

    if (region && !districtsData[region]) {
        return <NotFound />;
    }

    const meta = districtsData[region] || districtsData.hyderabad;
    const regionPartners = partners[region] || [];

    // dynamic Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://telangana.live/dashboard"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": meta.title,
                "item": `https://telangana.live/${region || 'hyderabad'}`
            }
        ]
    };

    // dynamic Local Region Schema
    const localAreaSchema = {
        "@context": "https://schema.org",
        "@type": "AdministrativeArea",
        "name": meta.title,
        "description": meta.subtitle,
        "containedInPlace": {
            "@type": "State",
            "name": "Telangana",
            "sameAs": "https://en.wikipedia.org/wiki/Telangana"
        },
        "identifier": meta.district
    };

    const districtFaqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What does the ${meta.title} page cover?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `It covers local news, civic updates, public services, weather, rates and district-specific context for ${meta.district}.`
                }
            },
            {
                "@type": "Question",
                "name": `Can I find services for ${meta.district} here?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes. The page surfaces service directories, health, utilities and local support tools relevant to ${meta.district}.`
                }
            },
            {
                "@type": "Question",
                "name": `Is this the official district website?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Telangana.live is an independent civic guide that organizes local information and links to official sources."
                }
            }
        ]
    };

    useJsonLd(breadcrumbSchema, `breadcrumb-subregion-${region || 'hyderabad'}`);
    useJsonLd(localAreaSchema, `area-subregion-${region || 'hyderabad'}`);
    useJsonLd(districtFaqSchema, `faq-subregion-${region || 'hyderabad'}`);

    const regionNews = useMemo(() => {
        const district = meta.district.toLowerCase();
        const keywords = meta.keywords || [district];

        // 1. Filter articles explicitly matching region name OR containing key keywords
        let matched = newsData.filter(item => {
            const itemRegion = (item.region || '').toLowerCase();
            const itemTitle = (item.title || '').toLowerCase();
            const itemDesc = (item.description || '').toLowerCase();
            
            if (itemRegion === district) return true;
            return keywords.some(kw => itemTitle.includes(kw) || itemDesc.includes(kw));
        });

        // 2. Pad with general Telangana articles if we have less than 4 items
        if (matched.length < 4) {
            const matchedLinks = new Set(matched.map(m => m.link));
            const generalArticles = newsData.filter(item => {
                if (matchedLinks.has(item.link)) return false;
                return (item.region || '').toLowerCase() === 'telangana';
            });
            matched = [...matched, ...generalArticles];
        }

        return matched.slice(0, 6);
    }, [meta]);

    const localSources = districtNewsSources[meta.district] || [];

    return (
        <div className="space-y-12 lg:space-y-16 animate-fade-in p-2 md:p-4 pb-24 max-w-7xl mx-auto">
            <Helmet>
                <title>{meta.title} News & Local Updates - Telangana.live</title>
                <meta name="description" content={`Get the latest ${meta.title} news today, civic updates, daily rates, power cuts, and local services in ${meta.district}.`} />
                <meta name="keywords" content={`${meta.district} news, ${meta.district} local updates, ${meta.district} news today, ${meta.district} power cuts, Telangana news`} />
                
                {/* Open Graph / Social Media Meta Tags */}
                <meta property="og:title" content={`${meta.title} News & Local Updates - Telangana.live`} />
                <meta property="og:description" content={`Get the latest ${meta.title} news today, civic updates, daily rates, power cuts, and local services in ${meta.district}.`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://telangana.live/${region || 'hyderabad'}`} />
                <meta property="og:site_name" content="Telangana.live" />
                
                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${meta.title} News & Local Updates`} />
                <meta name="twitter:description" content={`Get the latest ${meta.title} news today, civic updates, daily rates, power cuts, and local services in ${meta.district}.`} />
                
                {/* Canonical URL */}
                <link rel="canonical" href={`https://telangana.live/${region || 'hyderabad'}`} />
            </Helmet>
            {/* Region Header */}
            <div className="glass-card section-block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                    {Icons[meta.icon] && Icons[meta.icon]({ className: "w-32 h-32" })}
                </div>
                <div className="relative z-10">
                    <h1 className="section-title text-3xl sm:text-4xl gold-text mb-2">
                        {meta.title}
                    </h1>
                    <p className="text-text-secondary font-medium italic">
                        {meta.subtitle}
                    </p>
                </div>
            </div>

            <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
                    <div>
                        <h2 className="text-xl font-black text-white">District overview</h2>
                        <p className="mt-2 text-sm leading-7 text-text-secondary">
                            {meta.title} brings together district news, civic services, local utilities and actionable public information for {meta.district}.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-white/[0.04] p-3">
                            <strong className="block text-xl text-white">Local</strong>
                            <span className="text-[10px] uppercase tracking-wider text-text-muted">News & services</span>
                        </div>
                        <div className="rounded-xl bg-white/[0.04] p-3">
                            <strong className="block text-xl text-white">Official</strong>
                            <span className="text-[10px] uppercase tracking-wider text-text-muted">Sources linked</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Local Pride: ODOP Widget */}
            {odopData && odopData[meta.district] && (
                <OdopWidget data={odopData[meta.district]} />
            )}

            {/* Partner Spotlight Section */}
            <section id="spotlight">
                <div className="section-header">
                    <div>
                        <h3 className="section-title flex items-center gap-2">
                            <span className="text-heritage-gold animate-pulse-live">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                            </span> Partner Spotlight
                        </h3>
                        <p className="section-subtitle">Local businesses & services in {meta.title}</p>
                    </div>
                    <span className="date-badge">Sponsored</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {regionPartners.map(partner => (
                        <PartnerCard key={partner.id} partner={partner} />
                    ))}
                </div>
            </section>

            {/* Local Utilities & Data */}
            <section className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] via-white/[0.03] to-telangana-green/[0.03] p-4 sm:p-5 lg:p-6 shadow-2xl shadow-black/10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-black text-white">Local utility snapshot</h2>
                        <p className="mt-1 text-sm text-text-secondary">
                            Daily rates, weather and power data presented in a consistent district surface.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-telangana-green/10 text-telangana-green border border-telangana-green/20">
                            Live district view
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-heritage-gold/10 text-heritage-gold border border-heritage-gold/20">
                            Civic utilities
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
                    <div className="rounded-3xl border border-white/[0.08] bg-[#0f1626]/80 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                        <DailyRatesDashboard />
                    </div>
                    <div className="rounded-3xl border border-white/[0.08] bg-[#0f1626]/80 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                        <WeatherCard selectedDistrict={meta.district} />
                    </div>
                    <div className="rounded-3xl border border-white/[0.08] bg-[#0f1626]/80 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                        <PowerTariffCard />
                    </div>
                </div>
            </section>

            <div className="space-y-6 lg:space-y-8 mb-12">
                <MetroCard />
                <BasthiDawakhana region={meta.district} />
                <ServicesDirectory region={meta.district} />
            </div>

            {/* Local News Feed */}
            <section id="local-news" className="space-y-6">
                <div className="section-header flex items-center justify-between">
                    <div>
                        <h3 className="section-title flex items-center gap-2">
                            <span>
                                <svg className="w-5 h-5 text-telangana-green" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5" /></svg>
                            </span> <span className="gold-text">Local News</span>
                        </h3>
                        <p className="section-subtitle">Real-time civic & community updates for {meta.title}</p>
                    </div>
                </div>

                {localSources.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs font-bold text-text-muted my-auto mr-2 uppercase tracking-widest">Live Sources:</span>
                        {localSources.map(src => (
                            <span key={src.id} className="text-xs font-semibold px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-telangana-green-light flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${src.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                {src.name} <span className="text-white/30 text-[10px] uppercase ml-1">({src.type})</span>
                            </span>
                        ))}
                    </div>
                )}

                {regionNews.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {regionNews.map((news, idx) => (
                            <NewsCard key={news.link || idx} news={news} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3 rounded-2xl bg-white/5 border border-dashed border-white/10">
                        <div className="p-3 rounded-full bg-white/5 text-text-muted">
                            <Icons.Info className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-white font-bold text-sm">No local updates yet</h4>
                            <p className="text-text-muted text-xs">
                                Check back shortly for automated news reports.
                            </p>
                        </div>
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-black text-white">District questions</h2>
                    <p className="mt-1 text-sm text-text-secondary">Quick answers for readers landing directly on the district page.</p>
                </div>
                <div className="grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                        <h3 className="font-bold text-white">Why is this page useful?</h3>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">It acts as the district-specific homepage for users who want news, utilities, and services without searching the whole site.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                        <h3 className="font-bold text-white">What kind of updates appear here?</h3>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">Local news, civic utility dashboards, district-linked services and support sources tied to {meta.district}.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
