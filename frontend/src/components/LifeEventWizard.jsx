import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Life-event journeys
//
// Each journey pivots the user away from browsing departmental service lists
// and toward a single guided path for a real-world event ("I just moved",
// "I just bought a home"). To keep the person from getting distracted or
// lost mid-flow:
//   - Only ONE journey is active on screen at a time (chosen up front).
//   - Each topic step has exactly one primary action (an in-app guide link,
//     not a scatter of external tabs) and must be explicitly acknowledged
//     with a checkbox before "Continue" unlocks - no accidental skipping.
//   - A subtle "choose a different journey" link is always available, but
//     it is never presented as an equally-weighted competing choice.
// ---------------------------------------------------------------------------

const JOURNEYS = {
  resident: {
    label: 'New Resident',
    description: "Just moved to Telangana? Set up utilities and transfer your identity documents.",
    icon: 'Sparkles',
  },
  homeowner: {
    label: 'New Homeowner',
    description: 'Just bought a home? Confirm land records, register property tax, and set up utilities - in the right order.',
    icon: 'Building',
  },
};

function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map(i => (
        <div key={i} className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${i <= current ? 'bg-telangana-green' : 'bg-transparent'}`}
            style={{ width: i <= current ? '100%' : '0%' }}
          />
        </div>
      ))}
    </div>
  );
}

function StepFooter({ onBack, onContinue, backDisabled, continueDisabled, continueLabel = 'Continue', helperText }) {
  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={backDisabled}
          className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            backDisabled ? 'opacity-0 cursor-default' : 'text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30'
          }`}
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={continueDisabled}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 ${
            continueDisabled
              ? 'bg-white/10 text-white/30 cursor-not-allowed'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {continueLabel}
          {continueLabel === 'Continue' && <Icons.ArrowRight className="w-4 h-4" />}
        </button>
      </div>
      {helperText && continueDisabled && (
        <p className="text-xs text-white/40 text-right mt-2">{helperText}</p>
      )}
    </div>
  );
}

// A single "read the guide, then confirm you've done it" topic step,
// shared by every journey so each step in the wizard behaves identically.
function TopicStep({ eyebrow, title, body, guideHref, guideLabel, secondaryHref, secondaryLabel, checked, onCheck, checkLabel }) {
  return (
    <div className="animate-fade-in space-y-5">
      <p className="text-xs font-bold uppercase tracking-widest text-telangana-green">{eyebrow}</p>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{body}</p>

      <Link
        to={guideHref}
        className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-telangana-green/50 hover:bg-white/10 transition-colors group"
      >
        <div className="p-2 bg-telangana-green/20 text-telangana-green rounded-lg group-hover:scale-110 transition-transform">
          <Icons.FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm">{guideLabel}</h4>
          <p className="text-xs text-white/60">Full step-by-step guide, opens in this app</p>
        </div>
        <Icons.ArrowRight className="w-4 h-4 text-white/30 group-hover:text-telangana-green transition-colors" />
      </Link>

      {secondaryHref && (
        <Link
          to={secondaryHref}
          className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-telangana-blue/50 hover:bg-white/10 transition-colors group"
        >
          <div className="p-2 bg-telangana-blue/20 text-telangana-blue rounded-lg group-hover:scale-110 transition-transform">
            <Icons.FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm">{secondaryLabel}</h4>
            <p className="text-xs text-white/60">Full step-by-step guide, opens in this app</p>
          </div>
          <Icons.ArrowRight className="w-4 h-4 text-white/30 group-hover:text-telangana-blue transition-colors" />
        </Link>
      )}

      <label className="flex items-start gap-3 p-4 rounded-xl bg-black/20 border border-white/10 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-telangana-green"
        />
        <span className="text-sm text-white/80">{checkLabel}</span>
      </label>
    </div>
  );
}

export default function LifeEventWizard() {
  const [journey, setJourney] = useState(null); // null | 'resident' | 'homeowner'
  const [step, setStep] = useState(1);

  // --- Resident journey state (unchanged behavior from the original wizard) ---
  const [district, setDistrict] = useState('');

  // --- Homeowner journey state ---
  const [landDone, setLandDone] = useState(false);
  const [taxDone, setTaxDone] = useState(false);
  const [utilitiesDone, setUtilitiesDone] = useState(false);

  const residentTotalSteps = 3;
  const homeownerTotalSteps = 5;
  const totalSteps = journey === 'homeowner' ? homeownerTotalSteps : residentTotalSteps;

  const chooseJourney = (key) => {
    setJourney(key);
    setStep(1);
  };

  const backToSelection = () => {
    setJourney(null);
    setStep(1);
    setDistrict('');
    setLandDone(false);
    setTaxDone(false);
    setUtilitiesDone(false);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const headerCopy = useMemo(() => {
    if (journey === 'homeowner') {
      return { title: 'New Homeowner Checklist', subtitle: 'Your step-by-step guide to settling into your new property.' };
    }
    if (journey === 'resident') {
      return { title: 'New Resident Setup', subtitle: 'Your step-by-step guide to settling in Telangana.' };
    }
    return { title: 'Life Event Guides', subtitle: 'Tell us what brings you here and we\u2019ll walk you through it, one step at a time.' };
  }, [journey]);

  return (
    <div className="glass-card border border-white/10 shadow-2xl relative overflow-hidden mb-8">
      {/* Background glow effects for liquid-glass theme */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-telangana-blue/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-telangana-green/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      <div className="p-6 md:p-8 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/10 rounded-xl text-white backdrop-blur-xl border border-white/20">
            {journey === 'homeowner' ? <Icons.Building className="w-6 h-6" /> : <Icons.Sparkles className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{headerCopy.title}</h2>
            <p className="text-sm text-text-secondary">{headerCopy.subtitle}</p>
          </div>
        </div>

        {journey && <ProgressBar current={step} total={totalSteps} />}

        {/* --- Journey picker (entry point) --- */}
        {!journey && (
          <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(JOURNEYS).map(([key, j]) => {
              const Icon = Icons[j.icon];
              return (
                <button
                  key={key}
                  onClick={() => chooseJourney(key)}
                  className="text-left flex flex-col gap-3 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-telangana-green/50 hover:bg-white/10 transition-colors group"
                >
                  <div className="p-2.5 w-fit bg-white/10 text-white rounded-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-base">{j.label}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{j.description}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* --- Resident journey (unchanged) --- */}
        {journey === 'resident' && step === 1 && (
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

        {journey === 'resident' && step === 2 && (
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

        {journey === 'resident' && step === 3 && (
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

        {/* --- Homeowner journey --- */}
        {journey === 'homeowner' && step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-white">Welcome, new homeowner!</h3>
            <p className="text-text-secondary leading-relaxed">
              Getting a new property fully set up means three things, done in a specific order: confirm the land records are
              correct, register the property tax in your name, then set up water and electricity. Doing it out of order
              usually means backtracking, so we'll walk you through it one step at a time.
            </p>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-4">
              <div className="text-telangana-blue mt-1">
                <Icons.Info className="w-5 h-5" />
              </div>
              <p className="text-sm text-white/80">
                This takes about 10 minutes. Tick off each step as you complete it before moving to the next one.
              </p>
            </div>
          </div>
        )}

        {journey === 'homeowner' && step === 2 && (
          <TopicStep
            eyebrow="Step 1 of 3"
            title="Confirm your land records on Dharani"
            body="Before anything else, make sure the property's Record of Rights (RoR) on Dharani correctly shows you as the owner. This is the foundation everything else depends on."
            guideHref="/services/land-property/land-records-dharani"
            guideLabel="Land Records \u2013 Dharani Portal Guide"
            checked={landDone}
            onCheck={setLandDone}
            checkLabel="I've checked my land records on Dharani"
          />
        )}

        {journey === 'homeowner' && step === 3 && (
          <TopicStep
            eyebrow="Step 2 of 3"
            title="Register your property tax"
            body="With ownership confirmed, register the property for tax under your name. Utility providers will often ask for this before approving a new connection."
            guideHref="/services/bills-taxes/property-tax"
            guideLabel="Property Tax Payment Guide"
            checked={taxDone}
            onCheck={setTaxDone}
            checkLabel="I've registered my property tax"
          />
        )}

        {journey === 'homeowner' && step === 4 && (
          <TopicStep
            eyebrow="Step 3 of 3"
            title="Set up water & electricity"
            body="Last step: get your utility connections set up in your name using your confirmed land and tax records."
            guideHref="/services/bills-taxes/water-bill-payment"
            guideLabel="Water Bill Payment & Connection Guide"
            secondaryHref="/services/bills-taxes/electricity-bill-payment"
            secondaryLabel="Electricity Bill Payment & Connection Guide"
            checked={utilitiesDone}
            onCheck={setUtilitiesDone}
            checkLabel="I've set up my water and electricity connections"
          />
        )}

        {journey === 'homeowner' && step === 5 && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-xl font-bold text-white">You're all set!</h3>
            <p className="text-text-secondary leading-relaxed">Here's your completed homeowner checklist:</p>
            <ul className="space-y-2">
              {[
                { label: 'Land records confirmed on Dharani', done: landDone },
                { label: 'Property tax registered', done: taxDone },
                { label: 'Water & electricity connections set up', done: utilitiesDone },
              ].map(item => (
                <li key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  {item.done
                    ? <Icons.Check className="w-5 h-5 text-telangana-green shrink-0" />
                    : <span className="w-5 h-5 rounded-full border border-white/20 shrink-0" />}
                  <span className={`text-sm ${item.done ? 'text-white' : 'text-white/40'}`}>{item.label}</span>
                </li>
              ))}
            </ul>
            <div className="bg-telangana-green/20 border border-telangana-green/30 p-4 rounded-xl flex items-start gap-3 mt-4">
              <Icons.Check className="w-6 h-6 text-telangana-green shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-bold text-sm">Welcome home!</h4>
                <p className="text-white/70 text-xs mt-1">
                  Keep this checklist handy. You can always find more services in the Civic Action Hub.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- Navigation --- */}
        {journey && (
          <>
            <StepFooter
              onBack={prevStep}
              onContinue={step === totalSteps ? backToSelection : nextStep}
              backDisabled={step === 1}
              continueDisabled={
                journey === 'homeowner' &&
                ((step === 2 && !landDone) || (step === 3 && !taxDone) || (step === 4 && !utilitiesDone))
              }
              continueLabel={step === totalSteps ? 'Restart Guide' : 'Continue'}
              helperText="Check the box above once you've reviewed this step to continue."
            />
            <button
              onClick={backToSelection}
              className="text-xs text-white/40 hover:text-white/70 transition-colors mt-4"
            >
              &larr; Choose a different journey
            </button>
          </>
        )}
      </div>
    </div>
  );
}
