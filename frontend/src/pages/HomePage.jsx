import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { newsService } from '../services/newsService';
import NewsCard from '../components/NewsCard';
import { Icons } from '../components/Icons';
import StoriesBar from '../components/StoriesBar';
import DistrictOnboarding from '../components/DistrictOnboarding';
import { SkeletonFeed } from '../components/SkeletonCard';
import { useAppContext } from '../context/AppContext';
import { useEmergency } from '../hooks/useEmergency';
import { Link } from 'react-router-dom';
import useJsonLd from '../hooks/useJsonLd';
import LifeEventWizard from '../components/LifeEventWizard';
import AlertsBanner from '../components/AlertsBanner';
import ProgrammaticAd from '../components/ProgrammaticAd';
import QuickActionTile from '../components/QuickActionTile';


const CATEGORIES = [
  { id: 'All', label: 'Briefing' },
  { id: 'Telangana', label: 'Telangana' },
  { id: 'Safety', label: 'Security' },
  { id: 'Govt', label: 'Civic' },
  { id: 'Business', label: 'Market' },
  { id: 'Transit', label: 'Transit' },
];

const PAGE_SIZE = 8;

const FeedSection = ({ title, items, icon, delay = '0ms' }) => (
  <section className="space-y-6 animate-liquid-in" style={{ animationDelay: delay }}>
    <div className="flex items-center gap-4 px-2">
      <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white">
        {icon}
      </div>
      <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
    </div>
    
    <div className="flex flex-col gap-6">
      {items.map((news, idx) => (
        <NewsCard key={news.link || idx} news={news} />
      ))}
    </div>
  </section>
);

export default function HomePage() {
  const { searchQuery, myDistrict, followed } = useAppContext();
  const { isEmergencyActive, activateEmergency } = useEmergency();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);
  const dashboardSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Telangana.live Dashboard",
    "url": "https://telangana.live/dashboard",
    "description": "Live civic dashboard for Hyderabad and Telangana with real-time news, water, power, rates, services and alerts.",
    "about": {
      "@type": "GovernmentOrganization",
      "name": "Telangana.live Civic Intelligence Portal"
    }
  };
  const dashboardFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the Telangana.live dashboard?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is the main live civic briefing page for Hyderabad and Telangana, combining news, alerts, daily rates and essential public services."
        }
      },
      {
        "@type": "Question",
        "name": "Does the dashboard include district updates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. It highlights local district updates and links into the existing district pages for city and district-specific context."
        }
      },
      {
        "@type": "Question",
        "name": "Can I find emergency and civic actions here?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The dashboard surfaces emergency alerts, citizen grievance actions, classifieds and civic service shortcuts."
        }
      }
    ]
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://telangana.live/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Dashboard",
        "item": "https://telangana.live/dashboard"
      }
    ]
  };

  useJsonLd(breadcrumbSchema, 'breadcrumb-home');
  useJsonLd(dashboardSchema, 'dashboard-webpage-schema');
  useJsonLd(dashboardFaqSchema, 'dashboard-faq-schema');

  useEffect(() => {
    let isMounted = true;
    const loadNews = async () => {
      setLoading(true);
      const data = await newsService.fetchAllNews({ limit: 100 });
      if (isMounted) {
        setNewsData(data || []);
        // Optional slight delay for smooth UI transition
        setTimeout(() => setLoading(false), 300);
      }
    };
    loadNews();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, searchQuery]);

  const filteredNews = useMemo(() => {
    let items = [...newsData];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(n =>
        n.title.toLowerCase().includes(q) ||
        (n.description || '').toLowerCase().includes(q)
      );
    }
    
    if (activeCategory !== 'All') {
      if (activeCategory.toLowerCase() === 'telangana') {
        items = items.filter(n => (n.region || '').toLowerCase() === 'telangana');
      } else {
        items = items.filter(n => (n.category || '').toLowerCase() === activeCategory.toLowerCase());
      }
    }

    return items.sort((a, b) => {
      const aFollowed = followed.topics.includes(a.category) || followed.regions.includes(a.region);
      const bFollowed = followed.topics.includes(b.category) || followed.regions.includes(b.region);
      if (aFollowed && !bFollowed) return -1;
      if (!aFollowed && bFollowed) return 1;
      return new Date(b.published) - new Date(a.published);
    });
  }, [newsData, searchQuery, activeCategory, followed]);

  const myDistrictNews = useMemo(() => {
    if (!myDistrict) return [];
    return filteredNews.filter(n =>
      (n.region || '').toLowerCase().includes(myDistrict.toLowerCase()) ||
      (n.description || '').toLowerCase().includes(myDistrict.toLowerCase())
    );
  }, [filteredNews, myDistrict]);

  const feedNews = useMemo(() => filteredNews.slice(0, page * PAGE_SIZE), [filteredNews, page]);

  const loadMore = useCallback(() => {
    if (page * PAGE_SIZE < filteredNews.length) {
      setPage(p => p + 1);
    }
  }, [page, filteredNews.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (loading) {
    return (
      <div className="space-y-12 pb-20 max-w-5xl mx-auto px-4 mt-8">
        <div className="liquid-glass h-56 w-full animate-pulse" />
        <SkeletonFeed count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto px-4 mt-6">
      <Helmet>
        <title>Telangana.live - Real-Time Civic Intelligence Dashboard</title>
        <meta name="description" content="Live dashboard for Hyderabad and Telangana. Real-time news, water schedules, power alerts, daily rates, and essential civic services." />
        <link rel="canonical" href="https://telangana.live/dashboard" />
        <meta property="og:title" content="Telangana.live - Real-Time Civic Intelligence Dashboard" />
        <meta property="og:description" content="Live dashboard for Hyderabad and Telangana. Real-time news, water schedules, power alerts, and daily rates." />
        <meta property="og:url" content="https://telangana.live/dashboard" />
        <meta name="twitter:title" content="Telangana.live - Real-Time Civic Intelligence Dashboard" />
      </Helmet>
      {/* Liquid Header section */}
      <section className="animate-liquid-in">
        <StoriesBar />
      </section>

      <AlertsBanner />

      {/* Prominent Civic Action Hub */}
      <section className="animate-fade-in delay-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/report" className="glass-card p-6 border border-white/10 hover:border-telangana-green/50 hover:bg-white/5 transition-all group flex items-start gap-4 shadow-xl">
            <div className="p-3 bg-telangana-green/20 rounded-xl text-telangana-green group-hover:scale-110 transition-transform">
              <Icons.Location className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-1 group-hover:text-telangana-green transition-colors">Citizen Grievances</h3>
              <p className="text-sm text-text-secondary leading-snug">Drop a pin to report potholes, water leaks, or power outages directly to GHMC.</p>
            </div>
          </Link>
          
          <div 
            onClick={() => !isEmergencyActive && activateEmergency('flood')}
            className={`glass-card p-6 border transition-all group flex items-start gap-4 shadow-xl cursor-pointer ${isEmergencyActive ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 hover:border-red-500/30 hover:bg-white/5'}`}
          >
            <div className={`p-3 rounded-xl transition-transform ${isEmergencyActive ? 'bg-red-500 text-white animate-pulse' : 'bg-red-500/20 text-red-400 group-hover:scale-110'}`}>
              <Icons.Emergency className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg font-black mb-1 transition-colors ${isEmergencyActive ? 'text-red-400' : 'text-white group-hover:text-red-400'}`}>
                Crisis Dashboard {isEmergencyActive && '(Active)'}
              </h3>
              <p className="text-sm text-text-secondary leading-snug">
                {isEmergencyActive ? 'Live emergency alerts are currently active at the top of your screen.' : 'No active emergencies. Click to run a system simulation.'}
              </p>
            </div>
          </div>
          
          {/* Smart Classifieds Link */}
          <Link to="/classifieds" className="glass-card p-6 border border-white/10 hover:border-yellow-500/50 hover:bg-white/5 transition-all group flex items-start gap-4 shadow-xl md:col-span-2">
            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-500 group-hover:scale-110 transition-transform">
              <Icons.Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-1 group-hover:text-yellow-500 transition-colors">Hyper-Local Market</h3>
              <p className="text-sm text-text-secondary leading-snug">Buy, sell, or trade directly with neighbors in your ward. AI-powered smart classifieds via WhatsApp.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Programmatic / Sponsorship Placement */}
      <section className="animate-fade-in delay-150">
        <ProgrammaticAd mode="sponsor" className="w-full !min-h-[140px]" />
      </section>

      {/* Floating Category Pill */}
      <section className="sticky top-[100px] z-40 py-4 pointer-events-none">
        <div className="border border-white/10 bg-slate-900 px-2 py-1.5 inline-flex gap-1.5 pointer-events-auto mx-auto rounded-2xl shadow-xl shadow-black/50">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ${
                activeCategory === cat.id
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <DistrictOnboarding />

      <section className="space-y-3" aria-labelledby="quick-actions-heading">
        <div>
          <h2 id="quick-actions-heading" className="text-xl font-black text-white">Quick actions</h2>
          <p className="mt-1 text-sm text-text-secondary">Go straight to the civic tools you use most.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <QuickActionTile to="/services" icon={<Icons.FileText />} label="Services Directory" description="Find civic guides" />
          <QuickActionTile to="/meeseva" icon={<Icons.FileText />} label="MeeSeva Portal" description="Apply for services" />
          <QuickActionTile to="/report" icon={<Icons.Emergency />} label="Report Issue" description="Raise a civic concern" />
          <QuickActionTile to="/rates/gold" icon={<Icons.TrendingUp />} label="Market Rates" description="Check daily prices" />
        </div>
      </section>

      {/* Life Event Wizard (New Resident Setup) */}
      <section className="animate-fade-in delay-200">
        <LifeEventWizard />
      </section>

      {/* Local District Briefing */}
      {activeCategory === 'All' && myDistrict && myDistrictNews.length > 0 && (
        <FeedSection
          title={`${myDistrict} Updates`}
          items={myDistrictNews.slice(0, 4)}
          icon={<Icons.Location className="w-6 h-6 text-telangana-green" />}
          delay="50ms"
        />
      )}

      {/* Main Intelligence Feed */}
      <FeedSection
        title={activeCategory === 'All' ? 'Intelligence Dashboard' : activeCategory}
        items={feedNews}
        icon={<Icons.AI className="w-6 h-6" />}
        delay="100ms"
      />

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-24 flex items-center justify-center">
        {page * PAGE_SIZE < filteredNews.length && (
          <div className="flex flex-col items-center gap-4 text-white/30">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Synching with live grid</span>
          </div>
        )}
      </div>

      <section className="space-y-4 animate-fade-in delay-175">
        <div>
          <h2 className="text-xl font-black text-white">What the dashboard covers</h2>
          <p className="mt-1 text-sm text-text-secondary">A single entry point for live Telangana information, practical civic tools and district context.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h3 className="font-bold text-white">Live civic briefing</h3><p className="mt-2 text-sm leading-6 text-text-secondary">Breaking news, alerts, weather, rates and utility signals are grouped into one fast-loading feed.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h3 className="font-bold text-white">District-aware context</h3><p className="mt-2 text-sm leading-6 text-text-secondary">The page adapts to your district and links into the existing district pages for deeper local coverage.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h3 className="font-bold text-white">Civic actions</h3><p className="mt-2 text-sm leading-6 text-text-secondary">Citizen grievances, emergency flows and service shortcuts stay visible so users can act quickly.</p></div>
        </div>
      </section>

      <section className="space-y-4">
        <div><h2 className="text-xl font-black text-white">Common questions</h2><p className="mt-1 text-sm text-text-secondary">Quick answers for people using the Telangana.live dashboard.</p></div>
        <div className="grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h3 className="font-bold text-white">What should I use this page for?</h3><p className="mt-2 text-sm leading-6 text-text-secondary">Use it as the default civic home for Telangana: latest updates, local district context, emergency signals and quick service entry points.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h3 className="font-bold text-white">Where do I find my district feed?</h3><p className="mt-2 text-sm leading-6 text-text-secondary">Use the district onboarding and local briefing sections to jump into your district page and see the most relevant updates.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><h3 className="font-bold text-white">Is this an official government site?</h3><p className="mt-2 text-sm leading-6 text-text-secondary">No. Telangana.live is an independent civic guide that points you to official portals and services.</p></div>
        </div>
      </section>
    </div>
  );
}
