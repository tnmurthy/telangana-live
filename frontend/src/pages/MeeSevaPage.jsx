import { useState, useMemo, useEffect } from 'react';
import { meesevaCategories, meesevaCentres } from '../data/meesevaData';
import newsData from '../data/news.json';
import { useAppContext } from '../context/AppContext';
import { Icons } from '../components/Icons';

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
  const { myDistrict } = useAppContext();
  
  // States
  const [selectedCategory, setSelectedCategory] = useState('certificates');
  const [offeringsSearch, setOfferingsSearch] = useState('');
  const [expandedOffering, setExpandedOffering] = useState(null);
  
  const [locatorDistrict, setLocatorDistrict] = useState(myDistrict || 'Hyderabad');
  const [locatorSearch, setLocatorSearch] = useState('');
  
  const [trackingId, setTrackingId] = useState('');
  const [trackedStatus, setTrackedStatus] = useState(null);
  const [isTrackLoading, setIsTrackLoading] = useState(false);

  // Sync locator district when context district changes
  useEffect(() => {
    if (myDistrict) {
      setLocatorDistrict(myDistrict);
    }
  }, [myDistrict]);

  // Unique list of districts for centres locator
  const availableDistricts = useMemo(() => {
    return [...new Set(meesevaCentres.map(c => c.district))].sort();
  }, []);

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

  // Filtered MeeSeva centres
  const filteredCentres = useMemo(() => {
    let centres = meesevaCentres.filter(c => c.district.toLowerCase() === locatorDistrict.toLowerCase());
    
    if (locatorSearch.trim()) {
      const q = locatorSearch.toLowerCase();
      centres = centres.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.locality.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.pincode.includes(q)
      );
    }
    
    return centres;
  }, [locatorDistrict, locatorSearch]);

  // MeeSeva related news
  const correlatedNews = useMemo(() => {
    const keywords = ['meeseva', 'certificate', 'aadhaar link', 'pds card', 'encumbrance', 'tsspdcl online'];
    return newsData.filter(n => {
      const text = `${n.title} ${n.description || ''}`.toLowerCase();
      return keywords.some(k => text.includes(k));
    }).slice(0, 3);
  }, []);

  // Handle mock tracking submission
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsTrackLoading(true);
    setTrackedStatus(null);

    // Simulate server response time
    setTimeout(() => {
      setIsTrackLoading(false);
      // Deterministic mock stages based on number length/hash
      const idStr = trackingId.toUpperCase();
      const code = idStr.replace(/[^A-Z0-9]/g, '');
      const num = code.length > 0 ? code.charCodeAt(code.length - 1) % 4 : 2;
      
      const stages = [
        { title: 'Application Submitted', date: 'May 22, 2026', desc: 'Received at MeeSeva counter & registered in portal.', status: 'completed' },
        { title: 'Documents Verified', date: 'May 24, 2026', desc: 'Mandal Revenue Inspector verified all submitted certificates.', status: num >= 1 ? 'completed' : 'active' },
        { title: 'Officer Approval', date: num >= 2 ? 'May 25, 2026' : '--', desc: 'Pending signature of the Tahsildar / Authorised Officer.', status: num === 1 ? 'active' : num >= 2 ? 'completed' : 'pending' },
        { title: 'Certificate Issued', date: num >= 3 ? 'May 26, 2026' : '--', desc: 'Download PDF online or collect at centre.', status: num === 2 ? 'active' : num >= 3 ? 'completed' : 'pending' }
      ];

      setTrackedStatus({
        id: idStr,
        stageIndex: num,
        stages: stages,
        applicant: 'S. Ramakrishna Rao',
        service: 'Integrated Caste & Community Certificate'
      });
    }, 850);
  };

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
                  setSelectedCategory(cat.id);
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

        {/* Right Column - Status Tracker & Centres Locator (1 Col wide on desktop) */}
        <div className="space-y-8">
          
          {/* Tracker Widget */}
          <div className="glass-card p-5 border border-white/[0.04] space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🪪</span>
              <div>
                <h3 className="font-bold text-white text-sm">Application Status Tracker</h3>
                <p className="text-[10px] text-text-muted">Track certificates or utility records</p>
              </div>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter App No. (e.g. TS-RE-1029)"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-telangana-green/50"
                required
              />
              <button
                type="submit"
                disabled={isTrackLoading}
                className="px-4 py-2 rounded-lg bg-telangana-green hover:bg-telangana-green-hover text-black text-xs font-black transition-all flex items-center justify-center min-w-[70px]"
              >
                {isTrackLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : 'Track'}
              </button>
            </form>

            {/* Tracked Results Output */}
            {trackedStatus && (
              <div className="border-t border-white/[0.04] pt-4 space-y-4 animate-fade-in">
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-xs space-y-1">
                  <p className="text-text-muted">Application ID: <strong className="text-white">{trackedStatus.id}</strong></p>
                  <p className="text-text-muted">Applicant: <strong className="text-white">{trackedStatus.applicant}</strong></p>
                  <p className="text-text-muted">Service: <strong className="text-white/80">{trackedStatus.service}</strong></p>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-6 space-y-4 border-l border-white/[0.08] ml-2.5">
                  {trackedStatus.stages.map((stage, sIdx) => {
                    const isCompleted = stage.status === 'completed';
                    const isActive = stage.status === 'active';
                    
                    return (
                      <div key={sIdx} className="relative">
                        {/* Bullet indicator */}
                        <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isCompleted
                            ? 'bg-telangana-green border-telangana-green text-black text-[9px] font-bold'
                            : isActive
                              ? 'bg-dark-bg border-telangana-green animate-pulse'
                              : 'bg-dark-bg border-white/20'
                        }`}>
                          {isCompleted && '✓'}
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-telangana-green" />}
                        </div>
                        
                        {/* Title and details */}
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-xs font-bold ${
                              isCompleted ? 'text-white' : isActive ? 'text-telangana-green' : 'text-text-muted'
                            }`}>
                              {stage.title}
                            </h4>
                            <span className="text-[9px] text-text-muted/60">{stage.date}</span>
                          </div>
                          <p className="text-[10px] text-text-muted/80 mt-0.5 leading-normal">{stage.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Centres Locator Widget */}
          <div id="locator-section" className="glass-card p-5 border border-white/[0.04] space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📍</span>
                <div>
                  <h3 className="font-bold text-white text-sm">MeeSeva Centre Locator</h3>
                  <p className="text-[10px] text-text-muted">Find nearby authorised counters</p>
                </div>
              </div>
              
              {/* Context preference indicator */}
              {myDistrict && locatorDistrict.toLowerCase() === myDistrict.toLowerCase() && (
                <span className="text-[9px] font-black uppercase text-telangana-green px-1.5 py-0.5 rounded bg-telangana-green/10 border border-telangana-green/20">
                  {myDistrict}
                </span>
              )}
            </div>

            {/* Filter and Search controls */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={locatorDistrict}
                  onChange={e => setLocatorDistrict(e.target.value)}
                  className="w-1/2 px-2.5 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-telangana-green/50"
                >
                  {availableDistricts.map(dist => (
                    <option key={dist} value={dist} className="bg-dark-bg text-white">
                      {dist} District
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  placeholder="Filter locality / PIN..."
                  value={locatorSearch}
                  onChange={e => setLocatorSearch(e.target.value)}
                  className="w-1/2 px-2.5 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-telangana-green/50"
                />
              </div>
            </div>

            {/* Centres List */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredCentres.length > 0 ? (
                filteredCentres.map(centre => (
                  <div key={centre.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-white">{centre.name}</h4>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-normal">{centre.address}</p>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-black whitespace-nowrap bg-white/5 border border-white/10 text-heritage-gold">
                        ★ {centre.rating}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-white/[0.03]">
                      <span>🕒 {centre.hours}</span>
                      <span>📞 {centre.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <a
                        href={`tel:${centre.phone.replace(/[^0-9]/g, '')}`}
                        className="flex-1 py-1 rounded bg-white/[0.03] hover:bg-white/[0.08] text-white/90 text-center font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all"
                      >
                        {CustomIcons.Phone({ className: "w-3 h-3 text-text-muted" })}
                        Call Centre
                      </a>
                      <a
                        href={centre.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1 rounded bg-telangana-green/10 hover:bg-telangana-green/20 text-telangana-green text-center font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all"
                      >
                        Directions
                        {CustomIcons.ExternalLink({ className: "w-3 h-3" })}
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-text-muted text-xs border border-dashed border-white/10 rounded-xl">
                  No centres found for "{locatorSearch}" in {locatorDistrict} District.
                </div>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
