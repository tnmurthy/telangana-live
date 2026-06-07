'use client';

import { useState } from 'react';
import CivicCard from '@/components/ui/CivicCard';

export default function SchemesPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    occupation: '',
    land_acres: 0,
    annual_income: 0,
    caste_category: ''
  });
  const [results, setResults] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/schemes/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      setResults(data);
      setStep(3);
    } catch (error) {
      console.error('Failed to check schemes');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">SCHEMES FINDER</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Find government benefits you qualify for</p>
      </header>

      {step === 1 && (
        <CivicCard className="p-8 space-y-6" accentColor="green">
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Step 1: Primary Occupation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Farmer', 'Student', 'Employee', 'Self-Employed', 'Unemployed'].map(occ => (
                <button
                  key={occ}
                  onClick={() => {
                    setProfile({ ...profile, occupation: occ.toLowerCase() });
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border transition-all text-left font-bold ${
                    profile.occupation === occ.toLowerCase() 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>
        </CivicCard>
      )}

      {step === 2 && (
        <CivicCard className="p-8 space-y-6" accentColor="green">
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Step 2: Economic Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Annual Family Income (₹)</label>
                <input
                  type="number"
                  onChange={(e) => setProfile({ ...profile, annual_income: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-900"
                  placeholder="e.g. 150000"
                />
              </div>
              {profile.occupation === 'farmer' && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Land Owned (Acres)</label>
                  <input
                    type="number"
                    onChange={(e) => setProfile({ ...profile, land_acres: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-900"
                    placeholder="e.g. 5"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setStep(1)} className="flex-grow py-3 rounded-lg border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Back</button>
              <button 
                onClick={handleCheck}
                disabled={isChecking}
                className="flex-grow py-3 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-md"
              >
                {isChecking ? 'Checking...' : 'Find Schemes'}
              </button>
            </div>
          </div>
        </CivicCard>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
            Your Eligibility Results
            <button onClick={() => setStep(1)} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Restart Quiz</button>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {results.length > 0 ? results.map((res, idx) => (
              <CivicCard key={idx} className={`${res.is_eligible ? 'bg-white' : 'bg-slate-50/50 opacity-75'}`} accentColor={res.is_eligible ? 'green' : 'amber'}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">{res.scheme_id.replace(/-/g, ' ')}</h3>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{res.estimated_benefit}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-sm ${res.is_eligible ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {res.is_eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {res.matching_criteria.map((c: string) => (
                      <span key={c} className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1 uppercase">
                        ✅ {c}
                      </span>
                    ))}
                    {res.missing_criteria.map((c: string) => (
                      <span key={c} className="text-[10px] font-bold px-2 py-1 rounded-md bg-red-50 text-red-700 border border-red-100 flex items-center gap-1 uppercase">
                        ❌ {c}
                      </span>
                    ))}
                  </div>
                  {res.is_eligible && (
                    <button className="w-full py-2 rounded-lg bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all mt-4">
                      How to Apply →
                    </button>
                  )}
                </div>
              </CivicCard>
            )) : (
              <CivicCard className="p-12 text-center text-slate-400 italic">
                No matching schemes found for your current profile.
              </CivicCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
