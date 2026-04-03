import React from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import DateTimeBar from './DateTimeBar';
import NewsTicker from './NewsTicker';
import { useLocation } from 'react-router-dom';

import CrisisDashboard from './CrisisDashboard';
import HeatwavePanel from './HeatwavePanel';

const MainLayout = ({ children, isEmergencyActive }) => {
  const location = useLocation();
  const isSplash = location.pathname === '/';

  const pathParts = location.pathname.split('/');
  const currentRegion = pathParts[1] || 'hyderabad';

  if (isSplash) return <>{children}</>;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isEmergencyActive ? 'bg-red-950/30' : 'bg-dark-bg'}`}>
      <Header />
      <DateTimeBar />
      <div id="ticker-section">
        <NewsTicker />
      </div>

      <main className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_300px] gap-6 lg:gap-7">
          {/* Left Sidebar - Hidden on mobile */}
          <LeftSidebar />

          {/* Central Feed */}
          <section className="min-w-0 space-y-6 animate-fade-in">
            <CrisisDashboard currentRegion={currentRegion === 'general' ? 'hyderabad' : currentRegion} />
            <HeatwavePanel />
            {children}
          </section>

          {/* Right Sidebar - Hidden on Tab/Mobile */}
          <RightSidebar />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
