import { budgetDepts, budgetYear, totalBudgetCr, totalSpentCr } from '../data/budgetData';

const statusColors = {
  completed: 'bg-telangana-green/20 text-telangana-green',
  ongoing: 'bg-blue-500/20 text-blue-300',
  delayed: 'bg-red-500/20 text-red-400',
};

const statusEmoji = { completed: '✅', ongoing: '🔄', delayed: '⚠️' };

function ProgressBar({ spent, total }) {
  const pct = Math.min(100, Math.round((spent / total) * 100));
  const color = pct >= 75 ? 'bg-telangana-green' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-muted">₹{spent.toLocaleString('en-IN')} Cr spent</span>
        <span className={pct >= 75 ? 'text-telangana-green' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'}>{pct}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function BudgetTrackerPage() {
  const overallPct = Math.round((totalSpentCr / totalBudgetCr) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">📊</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-live bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30">{budgetYear}</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Budget Tracker</h2>
          <p className="text-text-secondary font-medium italic">Telangana State Budget Utilisation · FY {budgetYear}</p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="glass-card section-block border border-telangana-green/20">
        <h3 className="label-xs mb-4">💰 Overall Budget Utilisation</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold gold-text">₹{(totalBudgetCr / 1000).toFixed(0)}K Cr</p>
            <p className="text-[11px] text-text-muted">Total Budget</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-telangana-green">₹{(totalSpentCr / 1000).toFixed(0)}K Cr</p>
            <p className="text-[11px] text-text-muted">Spent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-heritage-gold">{overallPct}%</p>
            <p className="text-[11px] text-text-muted">Utilised</p>
          </div>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-telangana-green rounded-full" style={{ width: `${overallPct}%` }} />
        </div>
        <p className="text-[11px] text-text-muted mt-2 text-center">
          ₹{((totalBudgetCr - totalSpentCr) / 1000).toFixed(0)}K Cr remaining · Source: Telangana Finance Department
        </p>
      </div>

      {/* Department Cards */}
      <div className="space-y-4">
        <h3 className="label-xs">🏛️ Department-wise Utilisation</h3>
        {budgetDepts.map((dept, i) => (
          <div key={i} className="widget-card hover-lift p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{dept.emoji}</span>
                <div>
                  <h4 className="font-bold text-white text-sm">{dept.name}</h4>
                  <p className="text-[11px] text-text-muted">Allocation: ₹{dept.allocationCr.toLocaleString('en-IN')} Cr</p>
                </div>
              </div>
            </div>

            <ProgressBar spent={dept.spentCr} total={dept.allocationCr} />

            <div className="space-y-1.5">
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Key Projects</p>
              {dept.projects.map((p, j) => (
                <div key={j} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs">{statusEmoji[p.status]}</span>
                    <span className="text-xs text-text-secondary truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-text-muted">₹{p.amount.toLocaleString('en-IN')} Cr</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${statusColors[p.status]}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card section-block bg-heritage-gold/5 border border-heritage-gold/20 text-center">
        <p className="text-xs text-text-secondary">Data sourced from <strong className="text-white">Telangana Finance Department</strong> · Budget FY {budgetYear} · Figures in Crore INR</p>
      </div>
    </div>
  );
}
