import { useState } from 'react';
import { waterSchedules, waterAlerts } from '../data/waterSupplyData';

const DAY_SHORT = { Monday: 'M', Tuesday: 'T', Wednesday: 'W', Thursday: 'Th', Friday: 'F', Saturday: 'Sa', Sunday: 'Su', Daily: 'All' };
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const severityStyle = {
  high: 'border-red-500/50 bg-red-500/10 text-red-300',
  medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
  low: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
};

const freqBadge = {
  Daily: 'bg-telangana-green/20 text-telangana-green',
  'Alternate Days': 'bg-blue-500/20 text-blue-300',
  'Twice Weekly': 'bg-purple-500/20 text-purple-300',
};

export default function WaterSupplyPage() {
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(false);

  const filtered = waterSchedules.filter(s =>
    s.area.toLowerCase().includes(search.toLowerCase()) ||
    s.zone.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubscribe = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 glass-card px-4 py-3 text-sm font-semibold text-telangana-green border border-telangana-green/30 shadow-xl animate-in">
          🔔 Notifications coming soon!
        </div>
      )}

      {/* Hero */}
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">💧</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-live bg-blue-500/20 text-blue-300 border border-blue-500/30">HMWSSB</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Water Supply Schedule</h2>
          <p className="text-text-secondary font-medium italic">GHMC Zone-wise Supply Timings · Hyderabad 2026</p>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <a href="tel:155313" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold hover:bg-blue-500/20 transition-all">
              📞 Helpline: 155313
            </a>
            <button onClick={handleSubscribe}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-telangana-green/10 border border-telangana-green/20 text-telangana-green text-xs font-bold hover:bg-telangana-green/20 transition-all">
              🔔 Subscribe to Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Active Disruptions */}
      <div className="space-y-3">
        <h3 className="label-xs">⚠️ Active Supply Disruptions</h3>
        {waterAlerts.map((alert, i) => (
          <div key={i} className={`p-4 rounded-xl border ${severityStyle[alert.severity]}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold">{alert.area}</p>
                <p className="text-xs mt-1 opacity-80">{alert.message}</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide whitespace-nowrap">
                Until {new Date(alert.until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search area or zone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-telangana-green/50 text-sm"
        />
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((s, i) => (
          <div key={i} className="widget-card hover-lift p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-white text-sm">{s.area}</h4>
                <p className="text-[11px] text-text-muted mt-0.5">{s.zone} · {s.corporation}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${freqBadge[s.frequency] || 'bg-white/10 text-white'}`}>
                {s.frequency}
              </span>
            </div>

            {/* Day chips */}
            <div className="flex gap-1 flex-wrap">
              {s.supplyDays[0] === 'Daily'
                ? ALL_DAYS.map(d => (
                    <span key={d} className="w-7 h-7 flex items-center justify-center rounded-full bg-telangana-green/20 text-telangana-green text-[10px] font-bold">
                      {DAY_SHORT[d]}
                    </span>
                  ))
                : ALL_DAYS.map(d => (
                    <span key={d} className={`w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-bold ${s.supplyDays.includes(d) ? 'bg-telangana-green/20 text-telangana-green' : 'bg-white/5 text-text-muted'}`}>
                      {DAY_SHORT[d]}
                    </span>
                  ))
              }
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">⏰ {s.timings}</span>
              <span className="text-[10px] text-text-muted/60">Updated {new Date(s.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm">No areas matching "{search}"</p>
        </div>
      )}

      <div className="glass-card section-block bg-blue-500/5 border border-blue-500/20 text-center">
        <p className="text-xs text-text-secondary">Data sourced from HMWSSB · For real-time updates call <strong className="text-white">155313</strong></p>
      </div>
    </div>
  );
}
