import { useState } from 'react';
import { taxZones, usageTypes, exampleProperties } from '../data/propertyTaxData';

export default function PropertyTaxPage() {
  const [area, setArea] = useState('');
  const [zone, setZone] = useState('A');
  const [usage, setUsage] = useState('residential');
  const [floors, setFloors] = useState(1);

  const selectedZone = taxZones.find(z => z.zone === zone) || taxZones[0];
  const selectedUsage = usageTypes.find(u => u.id === usage) || usageTypes[0];

  const areaNum = parseFloat(area) || 0;
  const annualTax = Math.round(areaNum * selectedZone.ratePerSqFt * selectedUsage.factor * floors);
  const halfYearlyTax = Math.round(annualTax / 2);
  const monthlyTax = Math.round(annualTax / 12);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🏠</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-live bg-orange-500/20 text-orange-300 border border-orange-500/30">GHMC</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Property Tax Calculator</h2>
          <p className="text-text-secondary font-medium italic">GHMC Annual Property Tax Estimation · Hyderabad 2026</p>
        </div>
      </div>

      {/* Calculator */}
      <div className="glass-card section-block space-y-5">
        <h3 className="label-xs">🧮 Calculate Your Property Tax</h3>

        {/* Plinth Area */}
        <div>
          <label className="text-xs text-text-muted font-semibold uppercase tracking-wider block mb-2">Plinth Area (sq ft)</label>
          <input
            type="number"
            min={0}
            placeholder="e.g. 1200"
            value={area}
            onChange={e => setArea(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-telangana-green/50 text-sm"
          />
        </div>

        {/* Zone Selector */}
        <div>
          <label className="text-xs text-text-muted font-semibold uppercase tracking-wider block mb-2">Tax Zone</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {taxZones.map(z => (
              <button key={z.zone}
                onClick={() => setZone(z.zone)}
                className={`p-2.5 rounded-xl border text-center transition-all ${zone === z.zone ? 'bg-telangana-green/20 border-telangana-green/40 text-telangana-green' : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'}`}>
                <div className="text-sm font-bold">Zone {z.zone}</div>
                <div className="text-[10px] mt-0.5">₹{z.ratePerSqFt}/sqft</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-2">📍 {selectedZone.areas}</p>
        </div>

        {/* Usage Type */}
        <div>
          <label className="text-xs text-text-muted font-semibold uppercase tracking-wider block mb-2">Usage Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {usageTypes.map(u => (
              <button key={u.id}
                onClick={() => setUsage(u.id)}
                className={`p-3 rounded-xl border text-center transition-all ${usage === u.id ? 'bg-telangana-green/20 border-telangana-green/40 text-telangana-green' : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'}`}>
                <div className="text-xl mb-1">{u.emoji}</div>
                <div className="text-xs font-semibold">{u.label}</div>
                <div className="text-[10px] mt-0.5">{u.factor}x rate</div>
              </button>
            ))}
          </div>
        </div>

        {/* Floors */}
        <div>
          <label className="text-xs text-text-muted font-semibold uppercase tracking-wider block mb-2">Number of Floors</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setFloors(Math.max(1, floors - 1))} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">−</button>
            <span className="text-2xl font-bold text-white w-8 text-center">{floors}</span>
            <button onClick={() => setFloors(floors + 1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">+</button>
          </div>
        </div>

        {/* Result */}
        {areaNum > 0 && (
          <div className="bg-telangana-green/10 border border-telangana-green/30 rounded-2xl p-5 space-y-3">
            <h4 className="label-xs text-telangana-green">💡 Estimated Tax</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xl font-bold gold-text">₹{annualTax.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-text-muted">Annual</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xl font-bold text-telangana-green">₹{halfYearlyTax.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-text-muted">Half-Yearly</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-xl font-bold text-text-secondary">₹{monthlyTax.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-text-muted">Monthly</div>
              </div>
            </div>
            <p className="text-[11px] text-text-muted text-center">
              {areaNum} sqft × ₹{selectedZone.ratePerSqFt}/sqft × {selectedUsage.factor}x ({selectedUsage.label}) × {floors} floor{floors > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <a href="https://www.ghmc.gov.in/propertytax.aspx" target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-telangana-green/10 border border-telangana-green/20 text-telangana-green text-sm font-bold hover:bg-telangana-green/20 transition-all">
            💳 Pay Online ↗
          </a>
          <a href="https://www.ghmc.gov.in/propertytax.aspx" target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-text-secondary text-sm font-bold hover:bg-white/10 transition-all">
            📋 Check Arrears ↗
          </a>
        </div>
      </div>

      {/* Zone Rate Table */}
      <div className="glass-card section-block">
        <h3 className="label-xs mb-4">🗺️ Zone-wise Rate Card</h3>
        <div className="space-y-2">
          {taxZones.map(z => (
            <div key={z.zone} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div>
                <span className="text-sm font-bold text-white">Zone {z.zone}</span>
                <span className="ml-2 text-xs text-text-muted">{z.label}</span>
                <p className="text-[11px] text-text-muted mt-0.5">{z.areas}</p>
              </div>
              <span className="text-sm font-bold gold-text">₹{z.ratePerSqFt}/sqft</span>
            </div>
          ))}
        </div>
      </div>

      {/* Example Properties */}
      <div className="glass-card section-block">
        <h3 className="label-xs mb-4">📋 Example Properties</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                {['Property', 'Area', 'Zone', 'Usage', 'Annual Tax'].map(h => (
                  <th key={h} className="pb-2 text-left text-text-muted font-semibold pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {exampleProperties.map((p, i) => (
                <tr key={i}>
                  <td className="py-2.5 pr-3 text-text-secondary">{p.description}</td>
                  <td className="py-2.5 pr-3 text-white">{p.area.toLocaleString('en-IN')} sqft</td>
                  <td className="py-2.5 pr-3 text-telangana-green font-bold">Zone {p.zone}</td>
                  <td className="py-2.5 pr-3 text-text-secondary capitalize">{p.usage}</td>
                  <td className="py-2.5 font-bold gold-text">₹{p.annualTax.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-text-muted mt-3">* These are estimates. Actual tax may vary based on age, exemptions and GHMC assessment.</p>
      </div>

      <div className="glass-card section-block bg-orange-500/5 border border-orange-500/20 text-center">
        <p className="text-xs text-text-secondary">Rates based on GHMC Property Tax Schedule 2025-26 · For exact figures visit <strong className="text-white">ghmc.gov.in</strong></p>
      </div>
    </div>
  );
}
