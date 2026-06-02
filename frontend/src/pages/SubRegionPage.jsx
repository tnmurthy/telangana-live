import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { IndianRupee, Cloud, TriangleAlert, TrainFront, Phone, Hospital } from 'lucide-react';
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

const CollapsibleSection = ({ title, icon, children, defaultOpen = false }) => {
    return (
        <details className="group bg-white dark:bg-card border border-border rounded-2xl shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-300" open={defaultOpen}>
            <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-lg text-text select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                    {icon && <span className="text-telangana-green">{icon}</span>}
                    {title}
                </div>
                <span className="transition-transform duration-300 group-open:-rotate-180 text-text-muted">
                    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
            </summary>
            <div className="p-5 pt-0 border-t border-border mt-2 animate-in slide-in-from-top-2 fade-in duration-300">
                {children}
            </div>
        </details>
    );
};

const regionMetadata = {
    hyderabad: {
        title: 'Hyderabad Central',
        subtitle: 'Heritage, Old City & Residual GHMC Focus',
        icon: 'Heritage',
        district: 'Hyderabad'
    },
    cyberabad: {
        title: 'Cyberabad IT Corridor',
        subtitle: 'CMC - Madhapur, Gachibowli & Hitech City Focus',
        icon: 'AI',
        district: 'Cyberabad'
    },
    malkajgiri: {
        title: 'Malkajgiri Residential',
        subtitle: 'MMC - East Hyderabad & Residential Focus',
        icon: 'Building',
        district: 'Malkajgiri'
    },
    warangal: {
        title: 'Warangal Heritage City',
        subtitle: 'Kakatiya Heritage, GWMC Civic & Tri-Cities Focus',
        icon: 'Heritage',
        district: 'Warangal'
    },
    karimnagar: {
        title: 'Karimnagar Smart City',
        subtitle: 'Granite Hub & Karimnagar Municipal Corporation Focus',
        icon: 'Building',
        district: 'Karimnagar'
    },
    nizamabad: {
        title: 'Nizamabad Indur',
        subtitle: 'Agriculture Hub & Nizamabad Municipal Corporation Focus',
        icon: 'Location',
        district: 'Nizamabad'
    },
    khammam: {
        title: 'Khammam Fort City',
        subtitle: 'Stambhadri Heritage & Khammam Municipal Corporation Focus',
        icon: 'Heritage',
        district: 'Khammam'
    },
    nalgonda: {
        title: 'Nalgonda',
        subtitle: 'Nagarjuna Sagar & Local Civic Updates',
        icon: 'WaterDrop',
        district: 'Nalgonda'
    },
    mahbubnagar: {
        title: 'Mahbubnagar',
        subtitle: 'Palamuru & Local Development Updates',
        icon: 'Building',
        district: 'Mahbubnagar'
    }
};

export default function SubRegionPage() {
    const { region } = useParams();

    if (region && !regionMetadata[region]) {
        return <NotFound />;
    }

    const meta = regionMetadata[region] || regionMetadata.hyderabad;
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

    useJsonLd(breadcrumbSchema, `breadcrumb-subregion-${region || 'hyderabad'}`);
    useJsonLd(localAreaSchema, `area-subregion-${region || 'hyderabad'}`);

    const regionNews = useMemo(() => {
        const district = meta.district.toLowerCase();
        
        // Define localized keywords for fallback filtering
        const keywordsMap = {
            hyderabad: ['hyderabad', 'charminar', 'mehdipatnam', 'secunderabad', 'old city', 'ghmc'],
            cyberabad: ['cyberabad', 'hitech city', 'gachibowli', 'madhapur', 'kondapur', 'knowledge city', 'it corridor'],
            malkajgiri: ['malkajgiri', 'alwal', 'kukatpally', 'kapra', 'uppal', 'quthbullapur', 'medchal'],
            warangal: ['warangal', 'hanmakonda', 'kazipet', 'kakatiya', 'gwmc', 'tri-cities'],
            karimnagar: ['karimnagar', 'smart city', 'granite'],
            nizamabad: ['nizamabad', 'indur', 'bodhan', 'armur'],
            khammam: ['khammam', 'stambhadri', 'bhadrachalam', 'kothagudem'],
            nalgonda: ['nalgonda', 'nagarjuna sagar', 'miryalaguda', 'suryapet'],
            mahbubnagar: ['mahbubnagar', 'palamuru', 'jadcherla', 'narayanpet']
        };
        const keywords = keywordsMap[district] || [district];

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
    }, [meta.district]);

    const localSources = districtNewsSources[meta.district] || [];

    return (
        <div className="space-y-8 sm:space-y-10 animate-fade-in">
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
                    <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">
                        {meta.title}
                    </h2>
                    <p className="text-text-secondary font-medium italic">
                        {meta.subtitle}
                    </p>
                </div>
            </div>

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

            {/* Collapsible Local Utilities & Data */}
            <div className="space-y-4">
                <CollapsibleSection title="Daily Rates & Fuel" icon={<IndianRupee className="w-5 h-5" />} defaultOpen={true}>
                    <DailyRatesDashboard />
                </CollapsibleSection>

                <CollapsibleSection title="Weather & Environment" icon={<Cloud className="w-5 h-5" />}>
                    <WeatherCard selectedDistrict={meta.district} />
                </CollapsibleSection>

                <CollapsibleSection title="Power & Tariffs" icon={<TriangleAlert className="w-5 h-5" />}>
                    <PowerTariffCard />
                </CollapsibleSection>

                <CollapsibleSection title="Local Transport" icon={<TrainFront className="w-5 h-5" />}>
                    <MetroCard />
                </CollapsibleSection>

                <CollapsibleSection title="Healthcare Finder" icon={<Hospital className="w-5 h-5" />}>
                    <BasthiDawakhana />
                </CollapsibleSection>

                <CollapsibleSection title="Services Directory" icon={<Phone className="w-5 h-5" />}>
                    <ServicesDirectory />
                </CollapsibleSection>
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
        </div>
    );
}
