import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Multi-layer Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-telangana-green/8 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[250px] h-[250px] bg-heritage-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="z-10 max-w-lg w-full space-y-10">
        {/* Brand Reveal */}
        <div className="flex flex-col items-center space-y-5 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-telangana-green rounded-2xl flex items-center justify-center shadow-2xl shadow-telangana-green/25 hover:scale-105 transition-transform duration-500 ring-1 ring-white/10">
            <Icons.Govt className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
              telangana<span className="green-text font-black">.live</span>
            </h1>
            <p className="text-text-muted text-sm font-medium tracking-[0.2em] uppercase">
              2026 Civic Intelligence Portal
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-card p-8 animate-in delay-200">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.18em]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live · 2026
            </div>

            <h2 className="text-2xl font-semibold text-white leading-tight font-heading">
              Real-time Governance for <br />
              <span className="green-text font-bold">Hyderabad &amp; Telangana</span>
            </h2>

            <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
              News, water schedules, emergency contacts, jobs, ration, government schemes — everything citizens need, in one place.
            </p>

            {/* Quick stat pills */}
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {[
                { icon: '📰', label: 'Live News' },
                { icon: '💧', label: 'Water Updates' },
                { icon: '🆘', label: 'SOS Contacts' },
                { icon: '📋', label: '14 Gov Schemes' },
              ].map(({ icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-secondary font-medium">
                  <span>{icon}</span>{label}
                </span>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                className="px-7 py-3.5 bg-gradient-to-r from-telangana-green to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-telangana-green/20 transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95 text-sm"
              >
                Explore Dashboard →
              </Link>
              <Link
                to="/schemes"
                className="px-7 py-3.5 bg-white/[0.05] text-white border border-white/[0.08] rounded-xl font-bold hover:bg-white/[0.08] hover:border-white/[0.12] transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95 text-sm"
              >
                Government Schemes
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-text-muted/30 text-[10px] font-medium uppercase tracking-[0.2em] animate-in delay-500">
          © 2026 Telangana Civic Infrastructure · v1.0
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
