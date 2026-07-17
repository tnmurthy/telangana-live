import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, BadgeInfo, HeartPulse, MapPinned, Search, TriangleAlert } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { bloodBanks, bloodGroups, getBloodAlertsForDistrict, getBloodBanksForDistrict } from '../data/bloodBankData';
import districtsData from '../data/districts.json';

const STATUS_STYLES = {
  critical: 'bg-red-500/15 text-red-300 border-red-500/25',
  urgent: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  stable: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
};

function getStockStatus(units) {
  if (units <= 2) return { label: 'Critical', tone: 'critical' };
  if (units <= 5) return { label: 'Low', tone: 'urgent' };
  return { label: 'Available', tone: 'stable' };
}

function BloodBankCard({ bank, groupFilter }) {
  const visibleGroups = groupFilter && groupFilter !== 'All' ? [groupFilter] : bloodGroups;
  const totalUnits = visibleGroups.reduce((sum, group) => sum + (bank.stock[group] || 0), 0);
  const status = getStockStatus(totalUnits);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 hover:bg-white/[0.05] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">{bank.name}</h4>
          <p className="text-xs text-text-muted mt-1">{bank.area} · {bank.district}</p>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${STATUS_STYLES[status.tone]}`}>
          {status.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {visibleGroups.map((group) => {
          const units = bank.stock[group] || 0;
          const tone = units <= 2 ? 'bg-red-500/10 text-red-200 border-red-500/20' : units <= 5 ? 'bg-amber-500/10 text-amber-200 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20';
          return (
            <span key={group} className={`text-[10px] px-2 py-1 rounded-md border ${tone}`}>
              {group} {units}u
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-text-muted">{bank.category}</span>
        <a href="tel:104" className="text-telangana-green hover:underline font-medium">
          Check via 104 / 108
        </a>
      </div>

      <p className="mt-2 text-[11px] text-text-muted leading-relaxed">{bank.contact}</p>
      <p className="mt-1 text-[11px] text-text-muted/80">{bank.lastUpdated}</p>
    </article>
  );
}

function RequirementAlert({ alert }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{alert.district}</p>
          <p className="text-xs text-text-muted mt-1">{alert.facility}</p>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${STATUS_STYLES[alert.priority] || STATUS_STYLES.urgent}`}>
          {alert.priority}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
        <HeartPulse className="w-4 h-4 text-rose-300" />
        <span>{alert.group}</span>
        <span>·</span>
        <span>{alert.unitsNeeded} units needed</span>
      </div>
      <p className="mt-2 text-[11px] text-text-muted">{alert.note}</p>
    </div>
  );
}

export default function BloodBankAlerts({ districtOverride = '' }) {
  const { myDistrict } = useAppContext();
  const district = districtOverride || myDistrict || 'Telangana';
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');

  const districtOptions = useMemo(() => ([
    { label: 'Telangana', path: '/health/blood-banks' },
    ...Object.entries(districtsData).map(([slug, meta]) => ({
      label: meta.district,
      path: `/${slug}`,
    })),
  ]), []);

  const banks = useMemo(() => {
    const scopedBanks = district === 'Telangana' ? bloodBanks : getBloodBanksForDistrict(district);
    const needle = search.trim().toLowerCase();
    return scopedBanks.filter((bank) => {
      const haystack = `${bank.name} ${bank.area} ${bank.district}`.toLowerCase();
      return !needle || haystack.includes(needle);
    });
  }, [district, search]);

  const alerts = useMemo(() => getBloodAlertsForDistrict(district), [district]);

  const summary = useMemo(() => {
    const totals = bloodGroups.reduce((acc, group) => {
      acc[group] = banks.reduce((sum, bank) => sum + (bank.stock[group] || 0), 0);
      return acc;
    }, {});
    const critical = bloodGroups.filter(group => (totals[group] || 0) <= 2).length;
    return { totals, critical };
  }, [banks]);

  return (
    <section className="animate-fade-in">
      <div className="section-header">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <TriangleAlert className="w-5 h-5 text-rose-300" />
            Blood Banks
          </h2>
          <p className="section-subtitle">District-level stock and requirement alerts across Telangana</p>
        </div>
        <span className="date-badge">Seeded operational signal</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="space-y-4">
          <div className="glass-card section-block">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <MapPinned className="w-4 h-4 text-telangana-green" />
                  <span>{district}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <BadgeInfo className="w-4 h-4" />
                  <span>Use 104 / 108 to confirm before dispatch</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Banks</p>
                  <p className="mt-2 text-xl font-bold text-white">{banks.length}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Alerts</p>
                  <p className="mt-2 text-xl font-bold text-white">{alerts.length}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Critical groups</p>
                  <p className="mt-2 text-xl font-bold text-white">{summary.critical}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Scope</p>
                  <p className="mt-2 text-xl font-bold text-white">{district === 'Telangana' ? 'Statewide' : 'District'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card section-block">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search blood bank, area, district"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-telangana-green/40"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', ...bloodGroups].map((group) => (
                  <button
                    key={group}
                    onClick={() => setGroupFilter(group)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      groupFilter === group
                        ? 'bg-telangana-green/15 text-green-200 border-telangana-green/30'
                        : 'bg-white/[0.04] text-text-muted border-white/10 hover:text-white'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map((bank) => (
              <BloodBankCard key={bank.id} bank={bank} groupFilter={groupFilter} />
            ))}
            {banks.length === 0 && (
              <div className="md:col-span-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-text-muted">
                No blood bank entries matched this filter.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card section-block">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <h3 className="label-xs">Requirement Alerts</h3>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <RequirementAlert key={alert.id} alert={alert} />
              ))}
              {alerts.length === 0 && (
                <p className="text-sm text-text-muted">No district-specific shortages flagged right now.</p>
              )}
            </div>
          </div>

          <div className="glass-card section-block">
            <h3 className="label-xs mb-3">District selector</h3>
            <div className="flex flex-wrap gap-2">
              {districtOptions.slice(0, 12).map((option) => (
                <Link
                  key={option.path}
                  to={option.path}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    district === option.label
                      ? 'bg-rose-500/15 text-rose-200 border-rose-500/25'
                      : 'bg-white/[0.04] text-text-muted border-white/10 hover:text-white'
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
