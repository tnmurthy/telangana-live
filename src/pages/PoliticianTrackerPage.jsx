import { useState } from 'react';
import { mlas, mps } from '../data/politiciansData';

function accountabilityScore(p) {
  const attendance = p.assemblyAttendance;
  const funds = p.fundsUtilized;
  const questions = Math.min(100, p.questionsRaised);
  return Math.round((attendance + funds + questions) / 3);
}

function InitialsAvatar({ name, color }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ backgroundColor: color + '33', border: `2px solid ${color}66` }}>
      <span style={{ color }}>{initials}</span>
    </div>
  );
}

function ScoreRing({ score }) {
  const color = score >= 80 ? 'text-telangana-green' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${color}`}>{score}</div>
      <div className="text-[10px] text-text-muted">Score</div>
    </div>
  );
}

export default function PoliticianTrackerPage() {
  const [tab, setTab] = useState('mlas');
  const [partyFilter, setPartyFilter] = useState('All');

  const data = tab === 'mlas' ? mlas : mps;
  const parties = ['All', ...new Set(data.map(p => p.party))];

  const filtered = (partyFilter === 'All' ? data : data.filter(p => p.party === partyFilter))
    .map(p => ({ ...p, score: accountabilityScore(p) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🏛️</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-live bg-purple-500/20 text-purple-300 border border-purple-500/30">Accountability</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Politician Tracker</h2>
          <p className="text-text-secondary font-medium italic">Telangana MLAs & MPs Performance · Assembly 2026</p>
          <p className="text-[11px] text-text-muted mt-2">Source: Telangana Legislative Assembly · Attendance & Fund Utilisation records</p>
        </div>
      </div>

      {/* Score Methodology */}
      <div className="glass-card section-block bg-purple-500/5 border border-purple-500/20">
        <h3 className="label-xs mb-3">📐 Accountability Score Formula</h3>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xl mb-1">📅</div>
            <div className="text-white font-semibold">Assembly Attendance %</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xl mb-1">💰</div>
            <div className="text-white font-semibold">MLA Fund Utilised %</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xl mb-1">❓</div>
            <div className="text-white font-semibold">Questions Raised ÷10</div>
          </div>
        </div>
        <p className="text-[11px] text-text-muted mt-3 text-center">Score = Average of three metrics (0–100)</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => { setTab('mlas'); setPartyFilter('All'); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'mlas' ? 'bg-telangana-green text-dark-bg' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
          🏛️ MLAs ({mlas.length})
        </button>
        <button onClick={() => { setTab('mps'); setPartyFilter('All'); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'mps' ? 'bg-telangana-green text-dark-bg' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
          🇮🇳 MPs ({mps.length})
        </button>
      </div>

      {/* Party Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {parties.map(party => (
          <button key={party}
            onClick={() => setPartyFilter(party)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              partyFilter === party ? 'bg-telangana-green text-dark-bg' : 'bg-white/5 text-text-muted hover:bg-white/10'
            }`}>
            {party}
          </button>
        ))}
      </div>

      {/* Politician Cards */}
      <div className="space-y-4">
        {filtered.map((p, i) => (
          <div key={p.name} className="widget-card hover-lift p-4">
            <div className="flex items-start gap-3">
              <div className="relative">
                <InitialsAvatar name={p.name} color={p.partyColor} />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-dark-bg border border-white/10 flex items-center justify-center text-[10px] font-bold text-text-muted">
                  #{i + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-white text-sm">{p.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                    style={{ backgroundColor: p.partyColor + '40', border: `1px solid ${p.partyColor}60`, color: p.partyColor }}>
                    {p.party}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">{p.constituency} · Since {p.since}</p>
              </div>
              <ScoreRing score={p.score} />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Attendance', value: `${p.assemblyAttendance}%`, emoji: '📅' },
                { label: 'Questions', value: p.questionsRaised, emoji: '❓' },
                { label: 'Bills', value: p.billsIntroduced, emoji: '📋' },
                { label: 'Fund Used', value: `${p.fundsUtilized}%`, emoji: '💰' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-2">
                  <div className="text-sm font-bold text-white">{s.value}</div>
                  <div className="text-[9px] text-text-muted mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <a href={`tel:${p.contact.phone}`} className="text-xs text-telangana-green hover:underline">📞 {p.contact.phone}</a>
              <span className="text-[11px] text-text-muted">Fund: ₹{p.fundsTotal} Cr</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
