import { useState, useMemo, useEffect } from 'react';
import { meesevaCategories } from '../data/meesevaData';
import newsData from '../data/news.json';
import { Icons } from '../components/Icons';
import { trackEvent } from '../hooks/usePageTracking';

// Custom inline SVGs for categories or UI elements not in standard Icons.jsx
const CustomIcons = {
  Map: (props) => (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  CreditCard: (props) => (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  User: (props) => (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  ExternalLink: (props) => (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  ),
  Phone: (props) => (
    <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
};

const getCategoryIcon = (iconName, className) => {
  if (Icons[iconName]) return Icons[iconName]({ className });
  if (CustomIcons[iconName]) return CustomIcons[iconName]({ className });
  return <Icons.Info className={className} />;
};

export default function MeeSevaPage() {

  // States
  const [selectedCategory, setSelectedCategory] = useState('certificates');
  const [offeringsSearch, setOfferingsSearch] = useState('');
  const [expandedOffering, setExpandedOffering] = useState(null);

  // Track category changes
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    trackEvent('meeseva_category_change', { category_id: catId });
  };

  // Track searches (debounced)
  useEffect(() => {
    if (offeringsSearch.length > 2) {
      const timer = setTimeout(() => {
        trackEvent('meeseva_offering_search', { search_term: offeringsSearch });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [offeringsSearch]);



  // Filtered offerings based on selected category & search
  const filteredOfferings = useMemo(() => {
    const category = meesevaCategories.find(c => c.id === selectedCategory);
    if (!category) return [];

    if (!offeringsSearch.trim()) return category.offerings;

    const q = offeringsSearch.toLowerCase();
    return category.offerings.filter(o => 
      o.name.toLowerCase().includes(q) || 
      o.documents.some(d => d.toLowerCase().includes(q))
    );
  }, [selectedCategory, offeringsSearch]);


  // MeeSeva related news
  const correlatedNews = useMemo(() => {
    const keywords = ['meeseva', 'certificate', 'aadhaar link', 'pds card', 'encumbrance', 'tsspdcl online'];
    return newsData.filter(n => {
      const text = `${n.title} ${n.description || ''}`.toLowerCase();
      return keywords.some(k => text.includes(k));
    }).slice(0, 3);
  }, []);


  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto px-4 mt-6 animate-fade-in">
      {/* Premium Hero Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-white/5 bg-gradient-to-br from-dark-bg via-white/[0.02] to-dark-bg">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-[0.03] pointer-events-none select-none">🏛️</div>
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-telangana-green/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-live bg-telangana-green/15 text-green-400 border border-telangana-green/25">MeeSeva Online</span>
              <span className="text-xs text-text-muted">TS ESD Project</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight leading-tight">
              MeeSeva Citizen Portal
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
              Access digital government services in Telangana. Download application forms, view documents checklist, find nearby authorised centres, and track your application status.
            </p>
          </div>
          
          <div className="flex-shrink-0 bg-white/[0.02] border border-white/5 rounded-2xl p-4 backdrop-blur-xl md:max-w-xs w-full">
            <h4 className="text-[10px] font-black uppercase text-heritage-gold tracking-widest mb-2">📞 Official Assistance</h4>
            <p className="text-xs font-bold text-white">ESD Helpline: 1100 / 1800-425-1110</p>
            <p className="text-[10px] text-text-muted mt-1">Timings: 10:00 AM - 05:30 PM (Sunday General Holiday)</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Offerings Directory (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Services & Offerings</h2>
              <p className="text-xs text-text-muted mt-0.5">Explore required documents and process details</p>
            </div>
            
            {/* Offering Search */}
            <div className="relative w-48 sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">🔍</span>
              <input
                type="text"
                placeholder="Search services..."
                value={offeringsSearch}
                onChange={e => setOfferingsSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-telangana-green/45 placeholder:text-text-muted"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.04]">
            {meesevaCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  handleCategoryChange(cat.id);
                  setExpandedOffering(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black shadow-lg scale-[1.02]'
                    : 'bg-white/[0.02] border border-white/[0.05] text-text-muted hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {getCategoryIcon(cat.icon, "w-4 h-4")}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Offerings List Accordion */}
          <div className="space-y-3">
            {filteredOfferings.length > 0 ? (
              filteredOfferings.map((offering, idx) => {
                const isExpanded = expandedOffering === idx;
                return (
                  <div 
                    key={idx} 
                    className={`glass-card overflow-hidden transition-all duration-300 border ${
                      isExpanded ? 'border-telangana-green/30 bg-white/[0.01]' : 'border-white/[0.04] bg-white/[0.005]'
                    }`}
                  >
                    {/* Header Button */}
                    <button
                      onClick={() => setExpandedOffering(isExpanded ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 group"
                    >
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-telangana-green transition-colors duration-300">
                          {offering.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1.5 text-[10px] text-text-muted font-medium">
                          <span className="flex items-center gap-1">
                            ⏱️ Timeline: <strong className="text-white/80">{offering.timeline}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            💳 Service Fee: <strong className="text-white/80">{offering.fee}</strong>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180 text-telangana-green' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-white/[0.04] space-y-4 animate-slide-down">
                        {/* Documents Checklist */}
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-heritage-gold tracking-wider mb-2">
                            📋 Required Documents Check
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {offering.documents.map((doc, docIdx) => (
                              <li key={docIdx} className="flex items-start gap-2 text-xs text-text-secondary leading-normal">
                                <span className="text-telangana-green mt-0.5 font-bold">✓</span>
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 pt-2">
                          <a
                            href={offering.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-telangana-green/15 border border-telangana-green/35 text-telangana-green hover:bg-telangana-green/25 text-xs font-bold transition-all"
                          >
                            Apply via Official Portal
                            {CustomIcons.ExternalLink({ className: "w-3 h-3" })}
                          </a>
                          <button
                            onClick={() => {
                              // Auto pre-populate search in center locator
                              const locatorSection = document.getElementById('locator-section');
                              if (locatorSection) {
                                locatorSection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-bold text-text-secondary hover:bg-white/[0.08] hover:text-white transition-all"
                          >
                            Find Nearest Centre
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center glass-card border border-white/[0.04]">
                <span className="text-2xl">🔍</span>
                <p className="text-sm text-text-muted mt-2">No offerings matched "{offeringsSearch}"</p>
                <button onClick={() => setOfferingsSearch('')} className="text-xs text-telangana-green mt-1 font-bold underline">
                  Clear search
                </button>
              </div>
            )}
          </div>
          
          {/* Related MeeSeva Alerts / News */}
          {correlatedNews.length > 0 && (
            <div className="glass-card p-4 border border-white/[0.04] space-y-3 mt-6">
              <h3 className="text-xs font-black uppercase text-heritage-gold tracking-widest">
                📢 MeeSeva Service Alerts & News
              </h3>
              <div className="divide-y divide-white/[0.04]">
                {correlatedNews.map((news, nIdx) => (
                  <div key={nIdx} className="py-3 first:pt-0 last:pb-0">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{news.title}</h4>
                    <p className="text-[10px] text-text-muted line-clamp-2 mt-1">{news.description}</p>
                    <div className="flex items-center justify-between text-[9px] text-text-muted/60 mt-1.5">
                      <span>Source: {news.source || 'Local Intelligence'}</span>
                      <span>{new Date(news.published).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column - status and centres. The tracker used to make up a
            status from the application number and the locator listed centres
            with invented phone numbers, ratings and reviews (TL-44). */}
        <div className="space-y-8">
          <a
            href="https://ts.meeseva.telangana.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-5 border border-white/[0.04] block hover:border-telangana-green/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🪪</span>
              <div>
                <h3 className="font-bold text-white text-sm">Track your application ↗</h3>
                <p className="text-[10px] text-text-muted">Check status on the official MeeSeva portal</p>
              </div>
            </div>
          </a>

          <a
            id="locator-section"
            href="https://www.google.com/maps/search/MeeSeva+centre+near+me"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-5 border border-white/[0.04] block hover:border-telangana-green/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📍</span>
              <div>
                <h3 className="font-bold text-white text-sm">Find a MeeSeva centre near you ↗</h3>
                <p className="text-[10px] text-text-muted">Opens Google Maps</p>
              </div>
            </div>
          </a>
        </div>

      </div>
    </div>
  );
}
