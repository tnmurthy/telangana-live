import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-telangana-green/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

      <div className="z-10 max-w-2xl w-full space-y-12">
        {/* Brand Reveal */}
        <div className="flex flex-col items-center space-y-6 animate-fade-in-up">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-telangana-green rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 transform hover:scale-105 transition-transform duration-500">
            <Icons.Govt className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white">
              telangana<span className="text-telangana-green font-black">.live</span>
            </h1>
            <p className="text-text-muted text-lg font-medium tracking-widest uppercase">
              2026 Civic Intelligence Portal
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in-up delay-200">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Under Development
            </div>
            
            <h2 className="text-3xl font-semibold text-white leading-tight">
              Preparing for the <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 font-bold">State-Wide Launch</span>
            </h2>
            
            <p className="text-text-muted leading-relaxed max-w-md mx-auto">
              We are currently recalibrating data for the 2026 trifurcation. 
              Real-time governance for Hyderabad, Cyberabad, and Malkajgiri is arriving soon.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/hyderabad" 
                className="px-8 py-4 bg-white text-dark-bg rounded-2xl font-bold hover:bg-emerald-50 transform hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-white/5 active:scale-95"
              >
                Explore Beta (Dev)
              </Link>
              <button 
                className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                Get WhatsApp Alerts
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-text-muted/40 text-xs font-medium uppercase tracking-[0.2em] animate-fade-in delay-500">
          © 2026 Telangana Civic Infrastructure · Internal Build v0.9.4
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
