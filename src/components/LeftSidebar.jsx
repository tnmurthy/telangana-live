import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icons } from './Icons';

const NavItem = ({ to, icon, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
        isActive
          ? 'bg-telangana-green/10 text-telangana-green font-bold'
          : 'text-text-secondary hover:bg-white/5 hover:text-white'
      }`
    }
  >
    <span className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity">
      {icon}
    </span>
    <span className="text-sm tracking-wide flex-grow">{label}</span>
    {badge && (
      <span className="text-[10px] bg-telangana-green text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">
        {badge}
      </span>
    )}
  </NavLink>
);

const LeftSidebar = () => {
  return (
    <aside className="w-64 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-4 custom-scrollbar">
      <div className="space-y-6 pb-10">
        {/* Main Feed Section */}
        <div className="space-y-1">
          <NavItem to="/dashboard" icon={<Icons.Info size="sm" />} label="Top stories" />
          <NavItem to="/for-you" icon={<Icons.Info size="sm" />} label="For you" />
          <NavItem to="/following" icon={<Icons.Info size="sm" />} label="Following" />
        </div>

        <hr className="border-white/5 mx-4" />

        {/* Regions Section */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Local Pulse</p>
          <NavItem to="/hyderabad" icon={<Icons.Building size="sm" />} label="Hyderabad" />
          <NavItem to="/cyberabad" icon={<Icons.Info size="sm" />} label="Cyberabad" />
          <NavItem to="/malkajgiri" icon={<Icons.Info size="sm" />} label="Malkajgiri" />
        </div>

        <hr className="border-white/5 mx-4" />

        {/* Categories Section */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Categories</p>
          <NavItem to="/rates/gold" icon={<Icons.Info size="sm" />} label="Market Rates" badge="Live" />
          <NavItem to="/transport/metro" icon={<Icons.Bus size="sm" />} label="Transport" />
          <NavItem to="/health/basthi-dawakhana" icon={<Icons.Info size="sm" />} label="Health" />
          <NavItem to="/ai-pulse" icon={<Icons.Info size="sm" />} label="AI Pulse" />
        </div>

        <hr className="border-white/5 mx-4" />

        {/* Civic Section */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Civic Participation</p>
          <NavItem to="/report" icon={<Icons.Info size="sm" />} label="Report Issue" />
          <NavItem to="/dashboard#poll" icon={<Icons.Info size="sm" />} label="Citizen Poll" />
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
