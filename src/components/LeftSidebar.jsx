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
    <span className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
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
        </SidebarSection>

        <div className="divider mx-3" />

        {/* Categories */}
        <SidebarSection title="Categories">
          <NavItem to="/rates/gold" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} label="Market Rates" badge="Live" />
          <NavItem to="/transport/metro" icon={<Icons.Bus size="sm" />} label="Transport" />
          <NavItem to="/health/basthi-dawakhana" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>} label="Health" />
          <NavItem to="/ai-pulse" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>} label="AI Pulse" />
        </SidebarSection>

        <div className="divider mx-3" />

        {/* Civic */}
        <SidebarSection title="Civic">
          <NavItem to="/report" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>} label="Report Issue" />
          <NavItem to="/dashboard#poll" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>} label="Citizen Poll" />
        </SidebarSection>

        <div className="divider mx-3" />

        {/* City Services */}
        <SidebarSection title="City Services">
          <NavItem to="/emergency-contacts" icon={<span className="text-base">🆘</span>} label="Emergency Contacts" />
          <NavItem to="/water-supply" icon={<span className="text-base">💧</span>} label="Water Schedule" />
          <NavItem to="/ration-pds" icon={<span className="text-base">🌾</span>} label="Ration / PDS" />
          <NavItem to="/jobs" icon={<span className="text-base">💼</span>} label="Jobs Board" />
          <NavItem to="/events" icon={<span className="text-base">🎉</span>} label="Holidays" />
          <NavItem to="/budget" icon={<span className="text-base">📊</span>} label="Budget Tracker" />
          <NavItem to="/politicians" icon={<span className="text-base">🏛️</span>} label="Politicians" />
          <NavItem to="/property-tax" icon={<span className="text-base">🏠</span>} label="Property Tax" />
        </SidebarSection>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
