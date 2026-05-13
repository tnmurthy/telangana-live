import { useState } from 'react';
import { mockReports, reportCategories, statusSteps } from '../data/reportingData';
import { trifurcationBoundaries } from '../data/reportingData';

export default function GrievanceDashboard() {
    const [filterCorp, setFilterCorp] = useState('all');
    const corps = Object.entries(trifurcationBoundaries);

    const filtered = filterCorp === 'all'
        ? mockReports
        : mockReports.filter(r => r.corporation === trifurcationBoundaries[filterCorp]?.shortName);

    const stats = {
        total: filtered.length,
        reported: filtered.filter(r => r.status === 'reported').length,
        assigned: filtered.filter(r => r.status === 'assigned').length,
        resolved: filtered.filter(r => r.status === 'resolved').length,
    };

    const catLookup = Object.fromEntries(reportCategories.map(c => [c.id, c]));

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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Reports', val: stats.total, icon: '📊', color: 'text-white' },
                    { label: 'Pending', val: stats.reported, icon: '📝', color: 'text-amber-400' },
                    { label: 'Assigned', val: stats.assigned, icon: '👷', color: 'text-blue-400' },
                    { label: 'Resolved', val: stats.resolved, icon: '✅', color: 'text-success' },
                ].map(s => (
                    <div key={s.label} className="glass-card p-4 text-center">
                        <span className="text-2xl">{s.icon}</span>
                        <p className={`text-3xl font-black mt-2 ${s.color}`}>{s.val}</p>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Accountability Tracker */}
            <div className="glass-card section-block">
                <h3 className="label-xs mb-4 flex items-center justify-between">
                    <span>📋 Accountability Tracker</span>
                    <span className="text-success text-[10px]">Resolution Rate: {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%</span>
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {filtered.map(report => {
                        const cat = catLookup[report.category];
                        const stepIdx = statusSteps.findIndex(s => s.key === report.status);
                        const progress = ((stepIdx + 1) / statusSteps.length) * 100;

                        return (
                            <div key={report.id} className="detail-box">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: `${cat?.color}20` }}>
                                        {cat?.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white font-bold truncate">{report.description}</p>
                                        <p className="text-[10px] text-text-muted">🏛️ {report.corporation} · Ward {report.ward} · {report.date}</p>
                                    </div>
                                </div>
                                {/* Progress Bar */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${report.status === 'resolved' ? 'bg-success' : report.status === 'assigned' ? 'bg-blue-400' : 'bg-amber-400'}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: report.status === 'resolved' ? '#22C55E' : report.status === 'assigned' ? '#60A5FA' : '#FBBF24' }}>
                                        {report.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
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
