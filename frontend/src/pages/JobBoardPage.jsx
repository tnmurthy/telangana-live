import { useState } from 'react';
import { jobs, jobCategories } from '../data/jobsData';

function daysUntil(dateStr) {
  const diff = (new Date(dateStr) - new Date('2026-04-04')) / (1000 * 60 * 60 * 24);
  return Math.ceil(diff);
}

function formatSalary(min, max) {
  if (min >= 100000) return `₹${(min / 100000).toFixed(1)}L – ₹${(max / 100000).toFixed(1)}L/yr`;
  return `₹${(min / 1000).toFixed(0)}K – ₹${(max / 1000).toFixed(0)}K/mo`;
}

const typeColors = {
  Government: 'bg-blue-500/15 text-blue-300',
  IT: 'bg-purple-500/15 text-purple-300',
  PSU: 'bg-green-500/15 text-green-300',
};

export default function JobBoardPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = jobs.filter(j => {
    const matchCat = activeCategory === 'All' ||
      (activeCategory === 'Government' && j.type === 'Government') ||
      (activeCategory === 'IT' && j.type === 'IT') ||
      (activeCategory === 'Banking' && j.category === 'Banking') ||
      (activeCategory === 'Railway' && j.category === 'Railway') ||
      j.category === activeCategory;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.organization.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const sortedJobs = [...filtered].sort((a, b) => {
    if (a.is_sponsored && !b.is_sponsored) return -1;
    if (!a.is_sponsored && b.is_sponsored) return 1;
    return 0;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">💼</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-live bg-telangana-green/20 text-telangana-green border border-telangana-green/30">Live Openings</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Jobs Board</h2>
          <p className="text-text-secondary font-medium italic">Government · IT · Banking · Railway · Defence · Telangana 2026</p>
          <div className="mt-3">
            <a href="https://www.tspsc.gov.in" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-telangana-green/10 border border-telangana-green/20 text-telangana-green text-xs font-bold hover:bg-telangana-green/20 transition-all">
              🔗 TSPSC Official Website ↗
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Jobs', value: jobs.length, emoji: '📋' },
          { label: 'Total Posts', value: jobs.reduce((s, j) => s + j.posts, 0).toLocaleString('en-IN'), emoji: '👥' },
          { label: 'Closing Soon', value: jobs.filter(j => daysUntil(j.lastDate) <= 7).length, emoji: '⏰' },
        ].map(s => (
          <div key={s.label} className="widget-card p-3 text-center">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="text-lg font-bold gold-text">{s.value}</div>
            <div className="text-[10px] text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search jobs or organizations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-telangana-green/50 text-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {jobCategories.map(cat => (
          <button key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-telangana-green text-dark-bg'
                : 'bg-white/5 text-text-muted hover:bg-white/10'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {sortedJobs.map(job => {
          const days = daysUntil(job.lastDate);
          const isUrgent = days <= 7;
          const isToday = days === 0;
          return (
            <div key={job.id} className={`widget-card hover-lift p-4 ${
              job.is_sponsored 
                ? 'border-heritage-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.15)] bg-heritage-gold/[0.02]' 
                : isUrgent 
                  ? 'border-red-500/30' 
                  : 'border-white/5'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {job.is_sponsored && (
                      <span className="badge-live bg-heritage-gold/25 text-heritage-gold border border-heritage-gold/45 font-extrabold uppercase tracking-wider text-[8px]">
                        ★ Sponsored
                      </span>
                    )}
                    {isToday && <span className="badge-live bg-red-500/20 text-red-400 border border-red-500/30">Last date today!</span>}
                    {!isToday && isUrgent && <span className="badge-live bg-orange-500/20 text-orange-400 border border-orange-500/30">⏰ {days}d left</span>}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${typeColors[job.type] || 'bg-white/10 text-white'}`}>{job.type}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm leading-tight">{job.title}</h4>
                  <p className="text-xs text-telangana-green font-semibold mt-0.5">{job.organization}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold gold-text">{job.posts.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-text-muted">posts</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-text-muted">
                <span>🎓 {job.qualification.length > 40 ? job.qualification.substring(0, 40) + '…' : job.qualification}</span>
                <span>📍 {job.location}</span>
                <span>💰 {formatSalary(job.salaryMin, job.salaryMax)}</span>
                <span className={isUrgent ? 'text-red-400 font-semibold' : ''}>
                  📅 Last: {new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5">
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-telangana-green/10 border border-telangana-green/20 text-telangana-green text-xs font-bold hover:bg-telangana-green/20 transition-all">
                  Apply Now ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm">No jobs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
