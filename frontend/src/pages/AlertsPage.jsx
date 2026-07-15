import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Icons } from '../components/Icons';
import alertsData from '../data/alerts.json';

const SEVERITY_META = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  high:     { label: 'High',     color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  medium:   { label: 'Medium',   color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  low:      { label: 'Low',      color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
};

const TYPE_META = {
  flood:             { icon: 'WaterDrop', label: 'Flood' },
  natural_disaster:  { icon: 'Warning', label: 'Natural Disaster' },
  emergency:         { icon: 'Fire', label: 'Emergency' },
  weather:           { icon: 'Cloud', label: 'Weather' },
  strike:            { icon: 'Warning', label: 'Bandh / Strike' },
  road_closure:      { icon: 'Bus', label: 'Road Closure' },
  power_outage:      { icon: 'Power', label: 'Power Outage' },
  water_supply:      { icon: 'WaterDrop', label: 'Water Supply' },
};

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

function timeAgo(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = Date.now() - then;
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function AlertCard({ alert }) {
  const sev = SEVERITY_META[alert.severity] || SEVERITY_META.low;
  const type = TYPE_META[alert.type] || { icon: 'Warning', label: alert.type };
  const Icon = Icons[type.icon] || Icons.Warning;

  return (
    <a
      href={alert.sourceLink || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={`glass-card p-4 border ${sev.border} hover-lift block group`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${sev.bg} ${sev.color} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${sev.bg} ${sev.color}`}>
              {sev.label}
            </span>
            <span className="text-[10px] text-text-muted">{type.label}</span>
            {alert.region && alert.region !== 'Telangana' && (
              <span className="text-[10px] text-text-muted">&middot; {alert.region}</span>
            )}
          </div>
          <p className="text-sm font-semibold text-white group-hover:text-heritage-gold transition-colors leading-snug">
            {alert.title}
          </p>
          {alert.description && (
            <p className="text-xs text-text-secondary mt-1 line-clamp-2">{alert.description}</p>
          )}
          <p className="text-[10px] text-text-muted mt-2">{timeAgo(alert.publishedAt || alert.createdAt)}</p>
        </div>
      </div>
    </a>
  );
}

export default function AlertsPage() {
  const [severityFilter, setSeverityFilter] = useState('all');

  const alerts = useMemo(() => {
    const sorted = [...alertsData].sort(
      (a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9)
    );
    if (severityFilter === 'all') return sorted;
    return sorted.filter(a => a.severity === severityFilter);
  }, [severityFilter]);

  const counts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0 };
    alertsData.forEach(a => { if (c[a.severity] !== undefined) c[a.severity]++; });
    return c;
  }, []);

  return (
    <div className="space-y-8 pb-20 animate-in">
      <Helmet>
        <title>Local Alerts - Telangana.live</title>
        <meta name="description" content="Real-time civic alerts for Telangana: floods, power and water outages, road closures, bandhs, and weather warnings." />
      </Helmet>

      <div className="glass-card p-5">
        <div className="flex items-start gap-4">
          <span className="text-3xl">&#9888;&#65039;</span>
          <div>
            <h1 className="text-lg font-black text-white">Local Alerts</h1>
            <p className="text-xs text-text-muted mt-1">
              Civic disruptions detected from local news &mdash; floods, power &amp; water outages, road closures, bandhs, and weather warnings.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'critical', 'high', 'medium', 'low'].map(key => (
          <button
            key={key}
            onClick={() => setSeverityFilter(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
              severityFilter === key
                ? 'bg-white text-black'
                : 'bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10'
            }`}
          >
            {key === 'all' ? `All (${alertsData.length})` : `${SEVERITY_META[key].label} (${counts[key]})`}
          </button>
        ))}
      </div>

      {alerts.length === 0 ? (
        <div className="glass-card p-10 text-center space-y-3">
          <span className="text-5xl">&#x2705;</span>
          <p className="text-base font-bold text-white">No active alerts</p>
          <p className="text-sm text-text-muted">
            {severityFilter === 'all'
              ? "Nothing disruptive detected right now. We'll refresh this every couple of hours."
              : 'No alerts at this severity right now. Try a different filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
        </div>
      )}

      <p className="text-[10px] text-text-muted text-center">
        Alerts are detected automatically from local news and may occasionally be imprecise. For emergencies, always call 112.
      </p>
    </div>
  );
}
