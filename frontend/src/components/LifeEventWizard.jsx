import React, { useState } from 'react';
import { Icons } from './Icons';
import { Link } from 'react-router-dom';

export default function LifeEventWizard() {
  const [step, setStep] = useState(1);
  const [district, setDistrict] = useState('');

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="glass-card border border-white/10 shadow-2xl relative overflow-hidden mb-8">
      {/* Background glow effects for liquid-glass theme */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-telangana-blue/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-telangana-green/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
      
      <div className="p-6 md:p-8 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/10 rounded-xl text-white backdrop-blur-xl border border-white/20">
            <Icons.Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">New Resident Setup</h2>
            <p className="text-sm text-text-secondary">Your step-by-step guide to settling in Telangana.</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  i <= step ? 'bg-telangana-green' : 'bg-transparent'
                }`}
                style={{ width: i <= step ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Step 1: Introduction */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-white">Welcome to Telangana!</h3>
            <p className="text-text-secondary leading-relaxed">
              Moving to a new state involves a lot of moving parts. We've bundled everything you need into a simple, guided process.
              From setting up your utilities to transferring your official identity documents, we'll walk you through it.
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4">
              <div className="text-telangana-blue mt-1">
                <Icons.Info className="w-5 h-5" />
              </div>
              <p className="text-sm text-white/80">
                This process takes about 5 minutes and will give you a personalized checklist for your new home.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Location & Utilities */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-white">Location & Utilities</h3>
            <p className="text-text-secondary leading-relaxed">
              Select your district to get specific utility setup links (Water & Power).
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Select District</label>
                <select 
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-telangana-blue transition-colors appearance-none"
                >
                  <option value="" disabled>Choose your new district...</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Rangareddy">Rangareddy</option>
                  <option value="Medchal-Malkajgiri">Medchal-Malkajgiri</option>
                  <option value="Warangal">Warangal</option>
                  <option value="Karimnagar">Karimnagar</option>
                  <option value="Other">Other District</option>
                </select>
              </div>

              {district && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 animate-fade-in">
                  <a href="https://www.tssouthernpower.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors group">
                    <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg group-hover:scale-110 transition-transform">
                      <Icons.Power className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">Electricity Setup</h4>
                      <p className="text-xs text-white/60">TGSPDCL New Connection</p>
                    </div>
                  </a>
                  <a href="https://hyderabadwater.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors group">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                      <Icons.WaterDrop className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">Water Connection</h4>
                      <p className="text-xs text-white/60">HMWSSB Portal</p>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Identity & Civic */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-white">Identity & Civic Setup</h3>
            <p className="text-text-secondary leading-relaxed">
              Access MeeSeva services to update your address on official documents and register for civic services.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="https://ts.meeseva.telangana.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-telangana-blue/50 hover:bg-white/10 transition-colors group">
                <div className="p-2 bg-white/10 text-white rounded-lg group-hover:scale-110 transition-transform">
                  <Icons.FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Aadhaar Update</h4>
                  <p className="text-xs text-white/60">Update Address via MeeSeva</p>
                </div>
              </a>
              <a href="https://ts.meeseva.telangana.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-telangana-green/50 hover:bg-white/10 transition-colors group">
                <div className="p-2 bg-white/10 text-white rounded-lg group-hover:scale-110 transition-transform">
                  <Icons.Govt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Voter ID Transfer</h4>
                  <p className="text-xs text-white/60">Electoral Roll Update</p>
                </div>
              </a>
            </div>
            <div className="bg-telangana-green/20 border border-telangana-green/30 p-4 rounded-xl flex items-start gap-3 mt-4">
              <Icons.Check className="w-6 h-6 text-telangana-green shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-bold text-sm">You're all set!</h4>
                <p className="text-white/70 text-xs mt-1">
                  Keep this checklist handy. You can always find more services in the Civic Action Hub.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              step === 1 
                ? 'opacity-0 cursor-default' 
                : 'text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30'
            }`}
          >
            Back
          </button>
          
          <button 
            onClick={step === 3 ? () => setStep(1) : nextStep}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm bg-white text-black hover:bg-gray-200 transition-all active:scale-95"
          >
            {step === 3 ? 'Restart Guide' : 'Continue'}
            {step !== 3 && <Icons.ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
