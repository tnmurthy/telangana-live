import { useState } from 'react';
import { pdsShops, rationCategories } from '../data/pdsData';

const commodityColors = {
  Rice: 'bg-amber-500/15 text-amber-300',
  Wheat: 'bg-yellow-500/15 text-yellow-300',
  Sugar: 'bg-pink-500/15 text-pink-300',
  Kerosene: 'bg-orange-500/15 text-orange-300',
  'Palm Oil': 'bg-green-500/15 text-green-300',
};

function QuotaBar({ pct }) {
  const color = pct >= 80 ? 'bg-telangana-green' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] text-text-muted mb-1">
        <span>Available Quota</span>
        <span className={pct >= 80 ? 'text-telangana-green' : pct >= 60 ? 'text-yellow-400' : 'text-red-400'}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function RationPDSPage() {
  const [search, setSearch] = useState('');

  const filtered = pdsShops.filter(s =>
    s.area.toLowerCase().includes(search.toLowerCase()) ||
    s.circle.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🌾</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-live bg-amber-500/20 text-amber-300 border border-amber-500/30">EPDS</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Ration / PDS Finder</h2>
          <p className="text-text-secondary font-medium italic">Fair Price Shops · Hyderabad 2026</p>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <a href="tel:1967" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all">
              📞 EPDS Helpline: 1967
            </a>
          </div>
        </div>
      </div>

      {/* Ration Card Types */}
      <div className="glass-card section-block">
        <h3 className="label-xs mb-4">🪪 Ration Card Entitlements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rationCategories.map(cat => (
            <div key={cat.id} className={`p-3 rounded-xl border ${cat.bgClass}`}>
              <p className={`text-sm font-bold ${cat.textClass}`}>{cat.label}</p>
              <p className="text-xs text-text-muted mt-1">{cat.entitlement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search area, circle or shop name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-telangana-green/50 text-sm"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Shops', value: pdsShops.length, emoji: '🏪' },
          { label: 'Avg. Quota', value: `${Math.round(pdsShops.reduce((s, x) => s + x.availableQuota, 0) / pdsShops.length)}%`, emoji: '📦' },
          { label: 'Circles', value: [...new Set(pdsShops.map(s => s.circle))].length, emoji: '🗺️' },
        ].map(s => (
          <div key={s.label} className="widget-card p-3 text-center">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-lg font-bold gold-text">{s.value}</div>
            <div className="text-[10px] text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Shop Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((shop, i) => (
          <div key={i} className="widget-card hover-lift p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-white text-sm">{shop.name}</h4>
                <p className="text-[11px] text-text-muted mt-0.5">{shop.area} · {shop.circle}</p>
              </div>
              <span className="text-[10px] font-mono text-heritage-gold">#{shop.shopNumber}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-text-muted">Dealer: </span>
                <span className="text-white font-medium">{shop.dealerName}</span>
              </div>
              <div>
                <span className="text-text-muted">⏰ </span>
                <span className="text-white">{shop.timings}</span>
              </div>
            </div>

            <QuotaBar pct={shop.availableQuota} />

            <div className="flex flex-wrap gap-1.5 pt-1">
              {shop.commodities.map(c => (
                <span key={c} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${commodityColors[c] || 'bg-white/10 text-white'}`}>{c}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <a href={`tel:${shop.phone}`} className="text-xs text-telangana-green hover:underline font-medium">📞 {shop.phone}</a>
              <span className="text-[10px] text-text-muted/60">Updated {new Date(shop.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm">No shops found for "{search}"</p>
        </div>
      )}

      <div className="glass-card section-block bg-amber-500/5 border border-amber-500/20 text-center">
        <p className="text-xs text-text-secondary">Data sourced from Telangana Civil Supplies Dept · EPDS Portal · Helpline: <strong className="text-white">1967</strong></p>
      </div>
    </div>
  );
}
