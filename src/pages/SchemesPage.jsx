import { useState } from 'react';
import { schemes, schemeCategories } from '../data/schemesData';

const statusBadge = { active: 'bg-telangana-green/15 text-telangana-green border-telangana-green/20' };

export default function SchemesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = schemes.filter(s => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.benefit.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categoryCount = (cat) =>
    cat === 'All' ? schemes.length : schemes.filter(s => s.category === cat).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🏛️</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-live bg-telangana-green/20 text-telangana-green border border-telangana-green/30">14 Schemes</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Government Schemes</h2>
          <p className="text-text-secondary font-medium italic">
            Telangana & Central Welfare Schemes — Agriculture · Housing · Education · Health · Employment
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="https://telangana.gov.in" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-telangana-green/10 border border-telangana-green/20 text-telangana-green text-xs font-bold hover:bg-telangana-green/20 transition-all">
              🔗 Telangana Gov Portal ↗
            </a>
            <a href="https://india.gov.in/my-government/welfare-schemes" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-heritage-gold/10 border border-heritage-gold/20 text-heritage-gold text-xs font-bold hover:bg-heritage-gold/20 transition-all">
              🔗 Central Schemes ↗
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Schemes', value: schemes.filter(s => s.status === 'active').length, emoji: '✅' },
          { label: 'Categories', value: schemeCategories.length - 1, emoji: '📂' },
          { label: 'Total Beneficiaries', value: '2 Cr+', emoji: '👥' },
        ].map(stat => (
          <div key={stat.label} className="widget-card text-center py-4 hover-lift">
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <input
          type="text"
          placeholder="Search schemes by name, benefit, department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-heritage-gold/40 focus:ring-1 focus:ring-heritage-gold/20 transition-all"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {schemeCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              activeCategory === cat
                ? 'bg-telangana-green text-white border-telangana-green shadow-lg shadow-telangana-green/20'
                : 'bg-white/[0.04] text-text-muted border-white/[0.06] hover:border-telangana-green/30 hover:text-white'
            }`}
          >
            {cat} <span className="opacity-60 ml-1">({categoryCount(cat)})</span>
          </button>
        ))}
      </div>

      {/* Scheme Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-text-muted">No schemes found for &quot;{search}&quot;</p>
          </div>
        )}
        {filtered.map(scheme => (
          <div
            key={scheme.id}
            className="glass-card hover-lift cursor-pointer transition-all duration-300"
            onClick={() => setExpanded(expanded === scheme.id ? null : scheme.id)}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="text-3xl flex-shrink-0 mt-0.5">{scheme.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-white font-bold text-base leading-tight">{scheme.name}</h3>
                      <span className={`badge-live border text-[10px] ${statusBadge[scheme.status]}`}>
                        {scheme.status}
                      </span>
                      <span className="badge-live bg-white/[0.04] text-text-muted border border-white/[0.06] text-[10px]">
                        {scheme.category}
                      </span>
                    </div>
                    <p className="text-heritage-gold text-sm font-semibold mb-1">{scheme.benefit}</p>
                    <p className="text-text-muted text-xs">{scheme.department}</p>
                  </div>
                </div>
                <div className={`text-text-muted transition-transform duration-300 flex-shrink-0 mt-1 ${expanded === scheme.id ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === scheme.id && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4 animate-in">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Eligibility</p>
                    <p className="text-text-secondary text-sm">{scheme.eligibility}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Documents Required</p>
                    <ul className="space-y-1">
                      {scheme.documents.map((doc, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-telangana-green/60 flex-shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>📅 Since {scheme.launchedYear}</span>
                      <span>•</span>
                      <span>👥 {scheme.beneficiaries}</span>
                    </div>
                    <a
                      href={scheme.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-telangana-green/10 border border-telangana-green/30 text-telangana-green text-xs font-bold hover:bg-telangana-green/20 transition-all"
                    >
                      Apply / Know More ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Help Banner */}
      <div className="glass-card p-5 border-telangana-green/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-white font-semibold mb-1">Need help applying?</p>
            <p className="text-text-secondary text-sm">
              Visit your nearest MeeSeva Centre, Gram Panchayat office, or Hyderabad One Centre.
              Bring original Aadhaar + documents for any scheme application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
