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

  // Extract region from path for context
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

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_320px] gap-8">
        {/* Left Sidebar - Hidden on mobile */}
        <LeftSidebar />

        {/* Central Feed - Scrollable Middle Column */}
        <section className="flex-grow space-y-6 animate-fade-in custom-scrollbar">
          <CrisisDashboard currentRegion={currentRegion === 'general' ? 'hyderabad' : currentRegion} />
          <HeatwavePanel />
          {children}
        </section>

        {/* Right Sidebar - Hidden on Tab/Mobile */}
        <RightSidebar />
      </main>
    </div>
  );
};

export default MainLayout;
