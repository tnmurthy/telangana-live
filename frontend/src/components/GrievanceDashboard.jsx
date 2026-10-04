import { useEffect, useState } from 'react';
import { reportCategories, trifurcationBoundaries } from '../data/reportingData';
import { citizenReportsService } from '../services/citizenReportsService';

// Published citizen reports only (approved = open, resolved). It used to show
// 8 invented reports with an invented reported/assigned/resolved lifecycle;
// reports have no "assigned" stage, so none is shown (TL-19).

const STATUS_META = {
    approved: { label: 'Open', color: '#FBBF24' },
    resolved: { label: 'Resolved', color: '#22C55E' },
};

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function GrievanceDashboard() {
    const [reports, setReports] = useState(null);
    const [filterCorp, setFilterCorp] = useState('all');
    const corps = Object.entries(trifurcationBoundaries);

    useEffect(() => {
        let active = true;
        citizenReportsService.getPublishedReports().then((rows) => {
            if (active) setReports(rows);
        });
        return () => { active = false; };
    }, []);

    const loading = reports === null;
    const all = reports || [];
    const filtered = filterCorp === 'all'
        ? all
        : all.filter((r) => r.corporation === trifurcationBoundaries[filterCorp]?.shortName);

    const stats = {
        total: filtered.length,
        open: filtered.filter((r) => r.status === 'approved').length,
        resolved: filtered.filter((r) => r.status === 'resolved').length,
    };
    const catLookup = Object.fromEntries(reportCategories.map((c) => [c.id, c]));

    return (
        <div className="space-y-6">
            {/* Corporation Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilterCorp('all')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filterCorp === 'all' ? 'bg-white text-dark-bg' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
                >
                    All Corporations
                </button>
                {corps.map(([key, corp]) => (
                    <button
                        key={key}
                        onClick={() => setFilterCorp(key)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${filterCorp === key ? 'text-dark-bg' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
                        style={filterCorp === key ? { backgroundColor: corp.color } : {}}
                    >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: corp.color }}></span>
                        {corp.shortName}
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Published Reports', val: stats.total, icon: '📊', color: 'text-white' },
                    { label: 'Open', val: stats.open, icon: '📝', color: 'text-amber-400' },
                    { label: 'Resolved', val: stats.resolved, icon: '✅', color: 'text-success' },
                ].map((s) => (
                    <div key={s.label} className="glass-card p-4 text-center">
                        <span className="text-2xl">{s.icon}</span>
                        <p className={`text-3xl font-black mt-2 ${s.color}`}>{loading ? '—' : s.val}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Accountability Tracker */}
            <div className="glass-card section-block">
                <h3 className="label-xs mb-4 flex items-center justify-between">
                    <span>📋 Accountability Tracker</span>
                    {stats.total > 0 && (
                        <span className="text-success text-[10px]">
                            Resolution Rate: {Math.round((stats.resolved / stats.total) * 100)}%
                        </span>
                    )}
                </h3>

                {loading && <p className="text-sm text-text-muted">Loading reports…</p>}
                {!loading && filtered.length === 0 && (
                    <p className="text-sm text-text-muted">
                        No published citizen reports {filterCorp === 'all' ? 'yet' : 'for this corporation yet'}.
                        Reports appear here after moderation; drop a pin on the map above to file one.
                    </p>
                )}

                {filtered.length > 0 && (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {filtered.map((report) => {
                            const cat = catLookup[report.category];
                            const status = STATUS_META[report.status] || STATUS_META.approved;
                            return (
                                <div key={report.id} className="detail-box">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: `${cat?.color || '#ffffff'}20` }}>
                                            {cat?.icon || '📍'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-bold truncate">{report.description}</p>
                                            <p className="text-[10px] text-text-muted">
                                                🏛️ {report.corporation || '—'}{report.ward ? ` · Ward ${report.ward}` : ''} · {formatDate(report.created_at)}
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: status.color }}>
                                            {status.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Official Portal Deep Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="https://prajavani.telangana.gov.in/" target="_blank" rel="noopener noreferrer" className="glass-card p-5 text-center hover-lift border border-white/5 group">
                    <span className="text-3xl block mb-3">🏛️</span>
                    <p className="text-sm font-bold text-white group-hover:text-heritage-gold transition-colors">Prajavani (CPGRAMS-TS)</p>
                    <p className="text-[10px] text-text-muted mt-1">Official Grievance Redressal Portal</p>
                </a>
                <a href="https://www.meeseva.telangana.gov.in/" target="_blank" rel="noopener noreferrer" className="glass-card p-5 text-center hover-lift border border-white/5 group">
                    <span className="text-3xl block mb-3">📋</span>
                    <p className="text-sm font-bold text-white group-hover:text-heritage-gold transition-colors">MeeSeva Portal</p>
                    <p className="text-[10px] text-text-muted mt-1">Government Services & Certificates</p>
                </a>
            </div>
        </div>
    );
}
