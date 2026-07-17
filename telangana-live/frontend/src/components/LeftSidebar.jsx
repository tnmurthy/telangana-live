import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icons } from './Icons';

const NavItem = ({ to, icon, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `nav-item ${isActive ? 'active' : ''}`
    }
  >
    <span className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
      {icon}
    </span>
    <span className="flex-grow truncate">{label}</span>
    {badge && (
      <span className="badge-live bg-telangana-green/15 text-telangana-green border border-telangana-green/20">
        {badge}
      </span>
    )}
  </NavLink>
);

const SidebarSection = ({ title, children }) => (
  <div className="space-y-0.5">
    {title && (
      <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted/80">{title}</p>
    )}
    {children}
  </div>
);

const LeftSidebar = () => {
  return (
    <aside className="w-[240px] hidden lg:flex flex-col sticky top-[7.5rem] h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
      <nav className="space-y-5 pb-10">
        {/* Main Feed */}
        <SidebarSection>
          <NavItem to="/dashboard" icon={<Icons.Info size="sm" />} label="Top Stories" />
          <NavItem to="/news" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5" /></svg>} label="All News" />
        </SidebarSection>

        <div className="divider mx-3" />

        {/* Regions */}
        <SidebarSection title="Local Pulse">
          <NavItem to="/hyderabad" icon={<Icons.Building size="sm" />} label="Hyderabad" />
          <NavItem to="/cyberabad" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm1.5-12h7.5v7.5h-7.5V7.5Z" /></svg>} label="Cyberabad" />
          <NavItem to="/malkajgiri" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>} label="Malkajgiri" />
          <NavItem to="/warangal" icon={<Icons.Heritage size="sm" />} label="Warangal" />
          <NavItem to="/karimnagar" icon={<Icons.Building size="sm" />} label="Karimnagar" />
        </SidebarSection>

        <div className="divider mx-3" />

        {/* Categories */}
        <SidebarSection title="Categories">
          <NavItem to="/rates/gold" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} label="Market Rates" badge="Live" />
          <NavItem to="/transport/metro" icon={<Icons.Bus size="sm" />} label="Transport" />
          <NavItem to="/health/basthi-dawakhana" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>} label="Health" />
          <NavItem to="/health/blood-banks" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3s4 4.5 4 8.25A4 4 0 0 1 8 11.25C8 7.5 12 3 12 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.5 14.5A3.5 3.5 0 0 0 12 18a3.5 3.5 0 0 0 3.5-3.5" /></svg>} label="Blood Banks" badge="Live" />
          <NavItem to="/ai-pulse" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>} label="AI Pulse" />
        </SidebarSection>

        <div className="divider mx-3" />

        {/* Civic */}
        <SidebarSection title="Civic">
          <NavItem to="/report" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>} label="Report Issue" />
          <NavItem to="/classifieds" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72L4.318 3.44A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72m-13.5 8.65h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .415.336.75.75.75Z" /></svg>} label="Hyper-Local Market" />
          <NavItem to="/dashboard#poll" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>} label="Citizen Poll" />
        </SidebarSection>

        <div className="divider mx-3" />

        {/* City Services */}
        <SidebarSection title="City Services">
          <NavItem to="/emergency-contacts" icon={<Icons.Emergency size="sm" />} label="Emergency Contacts" />
          <NavItem to="/water-supply" icon={<Icons.WaterDrop size="sm" />} label="Water Schedule" />
          <NavItem to="/ration-pds" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21V9.75M3.284 14.253A9.004 9.004 0 0 1 12 3c2.208 0 4.256.793 5.86 2.114M18.75 8.25c.002-.224-.005-.45-.02-.676M4.5 12h15" /></svg>} label="Ration / PDS" />
          <NavItem to="/meeseva" icon={<Icons.FileText size="sm" />} label="MeeSeva Portal" />
          <NavItem to="/jobs" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4V14.15m16.5 0c0-1.224-1.008-2.25-2.25-2.25H6c-1.242 0-2.25 1.026-2.25 2.25m16.5 0V8.625c0-.621-.504-1.125-1.125-1.125H4.875c-.621 0-1.125.504-1.125 1.125v5.525M8.25 21V8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21" /></svg>} label="Jobs Board" />
          <NavItem to="/events" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>} label="Holidays" />
          <NavItem to="/budget" icon={<Icons.TrendingUp size="sm" />} label="Budget Tracker" />
          <NavItem to="/politicians" icon={<Icons.Building size="sm" />} label="Politicians" />
          <NavItem to="/schemes" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" /></svg>} label="Gov Schemes" />
          <NavItem to="/property-tax" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>} label="Property Tax" />
        </SidebarSection>

        <div className="divider mx-3" />

        {/* Nature & Environment */}
        <SidebarSection title="Environment">
          <NavItem to="/weather/forecast" icon={<Icons.Cloud size="sm" />} label="Weather Forecast" badge="30-Day" />
          <NavItem to="/reservoirs" icon={<Icons.WaterDrop size="sm" />} label="Reservoir Levels" />
          <NavItem to="/parks" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10.5m0 0a3 3 0 1 0-3-3M12 10.5a3 3 0 1 1 3-3M9.75 15.75a3 3 0 1 0-6 0c0 .878.377 1.668.98 2.213M3.75 15.75H12m0 0h8.25m0 0a3 3 0 1 0-6 0c0 .878.377 1.668.98 2.213" /></svg>} label="Parks & Crowds" />
          <NavItem to="/farmers" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3c-3 3-3 8 0 11M12 7c3 2 3 6 0 9" /></svg>} label="Farmer Portal" />
        </SidebarSection>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
