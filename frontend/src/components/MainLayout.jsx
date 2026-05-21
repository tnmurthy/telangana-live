import React, { useEffect, useState } from 'react';
import Header from './Header';
import BreakingNewsBanner from './BreakingNewsBanner';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import DateTimeBar from './DateTimeBar';
import NewsTicker from './NewsTicker';
import { useLocation } from 'react-router-dom';

import CrisisDashboard from './CrisisDashboard';
import HeatwavePanel from './HeatwavePanel';
import EmergencySimulator from './EmergencySimulator';
import { WidgetErrorBoundary } from './ErrorBoundary';
import { useEmergency } from '../hooks/useEmergency';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { isEmergencyActive, emergencyType } = useEmergency();
  const isSplash = location.pathname === '/';

  const [showTopAd, setShowTopAd] = useState(true);
  const [showBottomAd, setShowBottomAd] = useState(true);

  const excludedPaths = [
    '/emergency-contacts',
    '/weather/forecast',
    '/health/basthi-dawakhana'
  ];
  const showAds = !excludedPaths.includes(location.pathname);

  const pathParts = location.pathname.split('/');
  const currentRegion = pathParts[1] || 'hyderabad';

  // Apply global emergency theme classes to the root element
  useEffect(() => {
    const root = document.documentElement;
    // Remove existing emergency classes
    root.classList.remove('theme-emergency-heatwave', 'theme-emergency-flood', 'theme-emergency-critical', 'emergency-active');
    
    if (isEmergencyActive) {
      root.classList.add('emergency-active');
      if (emergencyType === 'heatwave') root.classList.add('theme-emergency-heatwave');
      else if (emergencyType === 'flood') root.classList.add('theme-emergency-flood');
      else root.classList.add('theme-emergency-critical');
    }
  }, [isEmergencyActive, emergencyType]);

  if (isSplash) return <>{children}</>;

  const getEmergencyBg = () => {
    if (!isEmergencyActive) return 'bg-dark-bg';
    if (emergencyType === 'heatwave') return 'bg-orange-950/20';
    if (emergencyType === 'coldwave') return 'bg-blue-950/20';
    if (emergencyType === 'flood') return 'bg-cyan-950/20';
    return 'bg-red-950/20';
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${getEmergencyBg()} ${isEmergencyActive ? 'emergency-pulse' : ''}`}>
      {showAds && showTopAd && (
        <div className="hidden md:flex items-center justify-between px-6 py-2.5 bg-slate-950/80 border-b border-white/10 backdrop-blur-md text-xs z-[100] relative">
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 rounded bg-heritage-gold/20 text-heritage-gold font-bold uppercase tracking-wider border border-heritage-gold/30">
              Sponsored
            </span>
            <span className="text-text-secondary">
              High-speed fiber broadband across Telangana. Get connected with <strong className="text-white">T-Fiber Broadband</strong> today starting at ₹399/mo.
            </span>
            <a href="https://tfiber.telangana.gov.in" target="_blank" rel="noopener noreferrer" className="text-heritage-gold hover:underline font-bold ml-2">
              Apply Now &rarr;
            </a>
          </div>
          <button 
            onClick={() => setShowTopAd(false)} 
            className="text-text-muted hover:text-white p-1 rounded hover:bg-white/10 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <Header />
      <BreakingNewsBanner />
      <DateTimeBar />
      <div id="ticker-section">
        <WidgetErrorBoundary name="News Ticker">
          <NewsTicker />
        </WidgetErrorBoundary>
      </div>

      <main className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_300px] gap-6 lg:gap-7">
          <LeftSidebar />

          <section className="min-w-0 space-y-6 animate-fade-in">
            <WidgetErrorBoundary name="Crisis Dashboard">
              <CrisisDashboard currentRegion={currentRegion === 'general' ? 'hyderabad' : currentRegion} />
            </WidgetErrorBoundary>
            
            {emergencyType === 'heatwave' && (
              <WidgetErrorBoundary name="Heatwave Panel">
                <HeatwavePanel />
              </WidgetErrorBoundary>
            )}

            {children}
          </section>

          <WidgetErrorBoundary name="Right Sidebar">
            <RightSidebar />
          </WidgetErrorBoundary>
        </div>
      </main>

      {/* Secret Emergency Simulator for Testing */}
      <EmergencySimulator />

      {/* Mobile Sticky Bottom Ad */}
      {showAds && showBottomAd && (
        <div className="md:hidden fixed bottom-[74px] left-4 right-4 z-[100] glass-card p-3.5 border border-white/[0.08] bg-slate-950/95 shadow-2xl rounded-2xl flex items-center justify-between animate-slide-up">
          <div className="flex-1 mr-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[8px] px-1 py-0.2 rounded bg-heritage-gold/20 text-heritage-gold font-bold uppercase border border-heritage-gold/30">
                Partner
              </span>
              <span className="text-[10px] font-bold text-white">T-Hub Hyderabad</span>
            </div>
            <p className="text-[10px] text-text-secondary leading-tight line-clamp-2">
              World's largest innovation hub. Scale your startup with top mentors and investors.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://t-hub.co" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 text-[10px] font-bold text-slate-950 bg-heritage-gold rounded-lg shadow-sm whitespace-nowrap">
              Join Hub
            </a>
            <button 
              onClick={() => setShowBottomAd(false)} 
              className="text-text-muted hover:text-white p-1 rounded hover:bg-white/10 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
