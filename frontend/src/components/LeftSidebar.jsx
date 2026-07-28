import React, { useId, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Icons } from './Icons';

const StrokeIcon = ({ children }) => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">{children}</svg>;
const icons = {
  news: <StrokeIcon><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5" /></StrokeIcon>,
  city: <StrokeIcon><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm1.5-12h7.5v7.5h-7.5V7.5Z" /></StrokeIcon>,
  home: <StrokeIcon><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></StrokeIcon>,
  rates: <StrokeIcon><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></StrokeIcon>,
  health: <StrokeIcon><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></StrokeIcon>,
  alert: <StrokeIcon><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></StrokeIcon>,
  book: <StrokeIcon><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></StrokeIcon>,
};

const NavItem = ({ to, icon, label, badge }) => (
  <NavLink to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
    <span className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">{icon}</span>
    <span className="flex-grow truncate">{label}</span>
    {badge && <span className="badge-live bg-telangana-green/15 text-telangana-green border border-telangana-green/20">{badge}</span>}
  </NavLink>
);

const SidebarSection = ({ title, children, collapsible = false, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const generatedId = useId();
  const id = `sidebar-section-${generatedId.replace(/:/g, '')}`;

  if (!collapsible) return <div className="space-y-0.5">{title && <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted/80">{title}</p>}{children}</div>;

  return (
    <div className="space-y-0.5">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)} className="flex w-full items-center justify-between px-3 pt-1 pb-2 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted/80 transition-colors hover:text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-telangana-green focus-visible:outline-offset-2 lg:pointer-events-none motion-reduce:transition-none">
        {title}<ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-150 lg:hidden ${open ? 'rotate-180' : ''} motion-reduce:transition-none`} />
      </button>
      <div id={id} className={open ? 'block' : 'hidden lg:block'}>{children}</div>
    </div>
  );
};

const LeftSidebar = () => (
  <aside className="flex w-full flex-col rounded-card border border-white/[0.06] bg-surface p-3 lg:sticky lg:top-[7.5rem] lg:h-[calc(100vh-8rem)] lg:w-[240px] lg:overflow-y-auto lg:border-0 lg:bg-transparent lg:p-0 lg:pr-2 custom-scrollbar">
    <nav className="space-y-4 lg:space-y-5 pb-2 lg:pb-10" aria-label="Primary navigation">
      <SidebarSection title="Always visible">
        <NavItem to="/hyderabad" icon={<Icons.Building size="sm" />} label="Hyderabad" />
        <NavItem to="/cyberabad" icon={icons.city} label="Cyberabad" />
        <NavItem to="/malkajgiri" icon={icons.home} label="Malkajgiri" />
        <NavItem to="/warangal" icon={<Icons.Heritage size="sm" />} label="Warangal" />
        <NavItem to="/karimnagar" icon={<Icons.Building size="sm" />} label="Karimnagar" />
        <NavItem to="/dashboard" icon={<Icons.Info size="sm" />} label="Top Stories" />
        <NavItem to="/news" icon={icons.news} label="All News" />
        <NavItem to="/services" icon={icons.book} label="Services Directory" />
        <NavItem to="/report" icon={icons.alert} label="Report Issue" />
      </SidebarSection>

      <div className="divider mx-3" />

      <SidebarSection title="Money & Rates" collapsible defaultOpen={false}>
        <NavItem to="/rates/gold" icon={icons.rates} label="Market Rates" badge="Live" />
        <NavItem to="/property-tax" icon={icons.home} label="Property Tax" />
        <NavItem to="/budget" icon={<Icons.TrendingUp size="sm" />} label="Budget Tracker" />
      </SidebarSection>

      <SidebarSection title="Government & Civic" collapsible defaultOpen={false}>
        <NavItem to="/meeseva" icon={<Icons.FileText size="sm" />} label="MeeSeva Portal" />
        <NavItem to="/schemes" icon={<Icons.FileText size="sm" />} label="Gov Schemes" />
        <NavItem to="/government" icon={<Icons.Govt size="sm" />} label="Government Directory" />
        <NavItem to="/politicians" icon={<Icons.Building size="sm" />} label="Politicians" />
        <NavItem to="/dashboard#poll" icon={<Icons.TrendingUp size="sm" />} label="Citizen Poll" />
      </SidebarSection>

      <SidebarSection title="Daily Life" collapsible defaultOpen={false}>
        <NavItem to="/transport/metro" icon={<Icons.Bus size="sm" />} label="Transport" />
        <NavItem to="/health/basthi-dawakhana" icon={icons.health} label="Health" />
        <NavItem to="/ration-pds" icon={<Icons.Govt size="sm" />} label="Ration / PDS" />
        <NavItem to="/water-supply" icon={<Icons.WaterDrop size="sm" />} label="Water Schedule" />
        <NavItem to="/jobs" icon={<Icons.Briefcase size="sm" />} label="Jobs Board" />
        <NavItem to="/classifieds" icon={<Icons.Building size="sm" />} label="Hyper-Local Market" />
      </SidebarSection>

      <SidebarSection title="Environment" collapsible defaultOpen={false}>
        <NavItem to="/weather/forecast" icon={<Icons.Cloud size="sm" />} label="Weather Forecast" badge="30-Day" />
        <NavItem to="/reservoirs" icon={<Icons.WaterDrop size="sm" />} label="Reservoir Levels" />
        <NavItem to="/parks" icon={<Icons.Heritage size="sm" />} label="Parks & Crowds" />
        <NavItem to="/farmers" icon={<Icons.Heritage size="sm" />} label="Farmer Portal" />
      </SidebarSection>

      <SidebarSection title="More" collapsible defaultOpen={false}>
        <NavItem to="/ai-pulse" icon={<Icons.AI size="sm" />} label="AI Pulse" />
        <NavItem to="/events" icon={<Icons.FileText size="sm" />} label="Holidays" />
        <NavItem to="/emergency-contacts" icon={<Icons.Emergency size="sm" />} label="Emergency Contacts" />
      </SidebarSection>
    </nav>
  </aside>
);

export default LeftSidebar;
