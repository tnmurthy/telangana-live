import React from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import DateTimeBar from './DateTimeBar';
import NewsTicker from './NewsTicker';
import { useLocation } from 'react-router-dom';

import CrisisDashboard from './CrisisDashboard';
import HeatwavePanel from './HeatwavePanel';
import { WidgetErrorBoundary } from './ErrorBoundary';
import { useEmergency } from '../hooks/useEmergency';

const MainLayout = ({ children, isEmergencyActive }) => {
  const location = useLocation();
  const { emergencyType } = useEmergency();
  const isSplash = location.pathname === '/';

  const pathParts = location.pathname.split('/');
  const currentRegion = pathParts[1] || 'hyderabad';

  if (isSplash) return <>{children}</>;

  const getEmergencyBg = () => {
    if (!isEmergencyActive) return 'bg-dark-bg';
    if (emergencyType === 'heatwave') return 'bg-orange-950/30';
    if (emergencyType === 'coldwave') return 'bg-blue-950/30';
    if (emergencyType === 'flood') return 'bg-cyan-950/30';
    return 'bg-red-950/30'; // fallback
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${getEmergencyBg()}`}>
      <Header />
      <DateTimeBar />
      <div id="ticker-section">
        <WidgetErrorBoundary name="News Ticker">
          <NewsTicker />
        </WidgetErrorBoundary>
      </div>

      <main className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_300px] gap-6 lg:gap-7">
          {/* Left Sidebar - Hidden on mobile */}
          <LeftSidebar />

          {/* Central Feed */}
          <section className="min-w-0 space-y-6 animate-fade-in">
            <WidgetErrorBoundary name="Crisis Dashboard">
              <CrisisDashboard currentRegion={currentRegion === 'general' ? 'hyderabad' : currentRegion} />
            </WidgetErrorBoundary>
            <WidgetErrorBoundary name="Heatwave Panel">
              <HeatwavePanel />
            </WidgetErrorBoundary>
            {children}
          </section>

          {/* Right Sidebar - Hidden on Tab/Mobile */}
          <WidgetErrorBoundary name="Right Sidebar">
            <RightSidebar />
          </WidgetErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
