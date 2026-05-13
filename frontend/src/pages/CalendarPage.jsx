import { useState } from 'react';
import { holidays2026, upcomingFestivals } from '../data/calendarData';

const typeColors = {
  National: { bg: 'bg-orange-500/10 border-orange-500/20', badge: 'bg-orange-500/20 text-orange-300', dot: 'bg-orange-400' },
  State: { bg: 'bg-telangana-green/10 border-telangana-green/20', badge: 'bg-telangana-green/20 text-telangana-green', dot: 'bg-telangana-green' },
  Bank: { bg: 'bg-blue-500/10 border-blue-500/20', badge: 'bg-blue-500/20 text-blue-300', dot: 'bg-blue-400' },
  Optional: { bg: 'bg-purple-500/10 border-purple-500/20', badge: 'bg-purple-500/20 text-purple-300', dot: 'bg-purple-400' },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function googleCalUrl(h) {
  const d = h.date.replace(/-/g, '');
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(h.name)}&dates=${d}/${d}&details=${encodeURIComponent(h.description)}`;
}

export default function CalendarPage() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'National', 'State', 'Bank', 'Optional'];

  const filtered = filter === 'All' ? holidays2026 : holidays2026.filter(h => h.type === filter);

  const byMonth = MONTHS.map((month, idx) => ({
    month,
    holidays: filtered.filter(h => new Date(h.date).getMonth() === idx),
  })).filter(m => m.holidays.length > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🎉</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-live bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30">2026</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Festival & Holiday Calendar</h2>
          <p className="text-text-secondary font-medium italic">Telangana Public Holidays, Festivals & State Celebrations · 2026</p>
        </div>
      </div>

      {/* Upcoming Festivals */}
      <div className="glass-card section-block">
        <h3 className="label-xs mb-4">⏳ Coming Up Next</h3>
        <div className="space-y-3">
          {upcomingFestivals.map((h, i) => {
            const styles = typeColors[h.type] || typeColors.Optional;
            return (
              <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border ${styles.bg}`}>
                <div className="text-3xl">{h.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{h.name}</p>
                  <p className="text-[11px] text-text-muted">{new Date(h.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold gold-text">{h.daysFromNow}</div>
                  <div className="text-[10px] text-text-muted">days</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {filters.slice(1).map(f => {
          const s = typeColors[f];
          return (
            <div key={f} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              <span className="text-xs text-text-muted">{f}</span>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f ? 'bg-telangana-green text-dark-bg' : 'bg-white/5 text-text-muted hover:bg-white/10'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Month by Month */}
      <div className="space-y-6">
        {byMonth.map(({ month, holidays }) => (
          <div key={month} className="glass-card section-block">
            <h3 className="label-xs mb-4">📅 {month} 2026</h3>
            <div className="space-y-2">
              {holidays.map((h, i) => {
                const styles = typeColors[h.type] || typeColors.Optional;
                const dateObj = new Date(h.date);
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${styles.bg} group`}>
                    <div className="text-2xl">{h.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-white">{h.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${styles.badge}`}>{h.type}</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                      <p className="text-xs text-text-muted/80 mt-1">{h.description}</p>
                    </div>
                    <a href={googleCalUrl(h)} target="_blank" rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-[10px] text-telangana-green hover:underline whitespace-nowrap">
                      + Cal ↗
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card section-block bg-telangana-green/5 border border-telangana-green/20 text-center">
        <p className="text-xs text-text-secondary">Holidays as notified by Telangana State Government · 2026. Dates subject to official gazette confirmation.</p>
      </div>
    </div>
  );
}
