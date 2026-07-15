import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from './Icons';
import alertsData from '../data/alerts.json';

// Deliberately restrained so this doesn't become the "annoying banner nobody
// reads": only critical/high severity surfaces here at all, capped at 2, and
// dismissal is per-session (component state, not persisted) so a real
// emergency isn't permanently hidden by an accidental or stale dismissal.
const BANNER_SEVERITIES = ['critical', 'high'];
const MAX_BANNER_ALERTS = 2;
const SEVERITY_ORDER = { critical: 0, high: 1 };

const SEVERITY_STYLE = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  high:     { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
};

export default function AlertsBanner() {
  const [dismissedIds, setDismissedIds] = useState(new Set());

  const alerts = useMemo(() => {
    return [...alertsData]
      .filter(a => BANNER_SEVERITIES.includes(a.severity))
      .sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9))
      .slice(0, MAX_BANNER_ALERTS);
  }, []);

  const visible = alerts.filter(a => !dismissedIds.has(a.id));

  if (visible.length === 0) return null;

  const dismiss = (id) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="space-y-2 animate-fade-in">
      {visible.map(alert => {
        const style = SEVERITY_STYLE[alert.severity] || SEVERITY_STYLE.high;
        return (
          <div
            key={alert.id}
            className={`glass-card p-3 border ${style.border} ${style.bg} flex items-center gap-3`}
          >
            <Icons.Warning className={`w-5 h-5 shrink-0 ${style.text}`} />
            <Link to="/alerts" className="flex-1 min-w-0 group">
              <p className="text-sm font-semibold text-white group-hover:text-heritage-gold transition-colors truncate">
                {alert.title}
              </p>
            </Link>
            <Link
              to="/alerts"
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shrink-0 ${style.bg} ${style.text} border ${style.border}`}
            >
              Details
            </Link>
            <button
              onClick={() => dismiss(alert.id)}
              aria-label="Dismiss alert"
              className="p-1 text-white/30 hover:text-white/70 transition-colors shrink-0"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
