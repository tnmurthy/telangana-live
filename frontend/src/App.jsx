import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { EmergencyProvider } from './context/EmergencyProvider';
import { LocaleProvider } from './context/LocaleContext';
import { SUPPORTED_LOCALES } from './i18n/translations';
import { useEmergency } from './hooks/useEmergency';
import { usePageTracking } from './hooks/usePageTracking';
import Header from './components/Header';
import DateTimeBar from './components/DateTimeBar';
import CrisisDashboard from './components/CrisisDashboard';
import NewsTicker from './components/NewsTicker';
import HeatwavePanel from './components/HeatwavePanel';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import { Icons } from './components/Icons';
import MainLayout from './components/MainLayout';
import BreakingNewsBanner from './components/BreakingNewsBanner';
import PulseCounter from './components/PulseCounter';
import StickyAnchorAd from './components/StickyAnchorAd';
import CookieConsent from './components/CookieConsent';
import ProactiveAlerts from './components/ProactiveAlerts';

// Lazy loading for production grade performance
const HomePage = lazy(() => import('./pages/HomePage'));
const SplashScreen = lazy(() => import('./pages/SplashScreen'));
const SubRegionPage = lazy(() => import('./pages/SubRegionPage'));
const GoldLandingPage = lazy(() => import('./pages/GoldLandingPage'));
const FuelLandingPage = lazy(() => import('./pages/FuelLandingPage'));
const TransportLandingPage = lazy(() => import('./pages/TransportLandingPage'));
const HealthLandingPage = lazy(() => import('./pages/HealthLandingPage'));
const NewsListingPage = lazy(() => import('./pages/NewsListingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ContentAdminCockpit = lazy(() => import('./pages/ContentAdminCockpit'));
const AIPulsePage = lazy(() => import('./pages/AIPulsePage'));
const EmergencyContactsPage = lazy(() => import('./pages/EmergencyContactsPage'));
const WaterSupplyPage = lazy(() => import('./pages/WaterSupplyPage'));
const RationPDSPage = lazy(() => import('./pages/RationPDSPage'));
const JobBoardPage = lazy(() => import('./pages/JobBoardPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const PanchangPage = lazy(() => import('./pages/PanchangPage'));
const BudgetTrackerPage = lazy(() => import('./pages/BudgetTrackerPage'));
const PoliticianTrackerPage = lazy(() => import('./pages/PoliticianTrackerPage'));
const PropertyTaxPage = lazy(() => import('./pages/PropertyTaxPage'));
const SchemesPage = lazy(() => import('./pages/SchemesPage'));
const ReportingLandingPage = lazy(() => import('./pages/ReportingLandingPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const WeatherForecastPage = lazy(() => import('./pages/WeatherForecastPage'));
const ReservoirsPage = lazy(() => import('./pages/ReservoirsPage'));
const ParksPage = lazy(() => import('./pages/ParksPage'));
const FarmerPage = lazy(() => import('./pages/FarmerPage'));
const MeeSevaPage = lazy(() => import('./pages/MeeSevaPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const ClassifiedsPage = lazy(() => import('./pages/ClassifiedsPage'));
const HackOfTheDayPage = lazy(() => import('./pages/HackOfTheDayPage'));
const StatnosticsPage = lazy(() => import('./pages/StatnosticsPage'));
const DeepDivesPage = lazy(() => import('./pages/DeepDivesPage'));
const ServicesDirectoryPage = lazy(() => import('./pages/ServicesDirectoryPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const GovernmentDirectoryPage = lazy(() => import('./pages/GovernmentDirectoryPage'));

// Loading Fallback
const LoadingScreen = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-fade-in">
    <div className="w-12 h-12 border-4 border-telangana-green/20 border-t-telangana-green rounded-full animate-spin"></div>
    <p className="text-text-muted text-sm font-medium tracking-wide uppercase">Calibrating 2026 Data...</p>
  </div>
);

function EmergencyToggle() {
  const { isEmergencyActive, emergencyType, activateEmergency, deactivateEmergency } = useEmergency();
  
  const handleToggle = () => {
    if (!isEmergencyActive) return activateEmergency('heatwave');
    if (emergencyType === 'heatwave') return activateEmergency('coldwave');
    if (emergencyType === 'coldwave') return activateEmergency('flood');
    return deactivateEmergency();
  };

  return (
    <button
      onClick={handleToggle}
      className={`fixed top-24 right-4 z-[60] px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 ${isEmergencyActive
        ? 'bg-red-500 text-white animate-pulse-live'
        : 'bg-white/10 text-text-muted hover:bg-red-500/20 hover:text-red-300 border border-white/10'
        }`}
      title="Toggle Emergency Mode (Demo)"
    >
      <Icons.Emergency className={`w-3.5 h-3.5 ${isEmergencyActive ? 'animate-pulse' : ''}`} />
      {isEmergencyActive ? 'Active' : 'Emergency'}
    </button>
  );
}

// Every route below is defined ONCE here, then mounted both at its plain path
// (default, English, no prefix) and again under each supported locale prefix
// (/te/..., /ur/...) via the loop in <Routes> below. This keeps the route
// table DRY instead of hand-duplicating ~35 <Route> elements per locale.
// Locale itself is detected from the URL by <LocaleProvider> (pathname-based,
// not a route param), so the exact same page component renders either way -
// only the surrounding chrome (nav, footer, language switcher) changes
// language for now. Content translation is a separate, later phase.
const routeDefs = [
  { path: '/dashboard', element: <HomePage /> },
  { path: '/rates/gold', element: <GoldLandingPage /> },
  { path: '/rates/fuel', element: <FuelLandingPage /> },
  { path: '/transport/metro', element: <TransportLandingPage /> },
  { path: '/health/basthi-dawakhana', element: <HealthLandingPage /> },
  { path: '/news', element: <NewsListingPage /> },
  { path: '/admin/cockpit', element: <ContentAdminCockpit /> },
  { path: '/ai-pulse', element: <AIPulsePage /> },
  { path: '/emergency-contacts', element: <EmergencyContactsPage /> },
  { path: '/emergency', element: <EmergencyContactsPage /> },
  { path: '/water-supply', element: <WaterSupplyPage /> },
  { path: '/ration-pds', element: <RationPDSPage /> },
  { path: '/jobs', element: <JobBoardPage /> },
  { path: '/events', element: <CalendarPage /> },
  { path: '/panchang', element: <PanchangPage /> },
  { path: '/budget', element: <BudgetTrackerPage /> },
  { path: '/politicians', element: <PoliticianTrackerPage /> },
  { path: '/property-tax', element: <PropertyTaxPage /> },
  { path: '/schemes', element: <SchemesPage /> },
  { path: '/report', element: <ReportingLandingPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/weather/forecast', element: <WeatherForecastPage /> },
  { path: '/weather', element: <WeatherForecastPage /> },
  { path: '/reservoirs', element: <ReservoirsPage /> },
  { path: '/parks', element: <ParksPage /> },
  { path: '/farmers', element: <FarmerPage /> },
  { path: '/meeseva', element: <MeeSevaPage /> },
  { path: '/classifieds', element: <ClassifiedsPage /> },
  { path: '/hacks', element: <HackOfTheDayPage /> },
  { path: '/insights', element: <StatnosticsPage /> },
  { path: '/deep-dives', element: <DeepDivesPage /> },
  { path: '/privacy', element: <PrivacyPolicy /> },
  { path: '/terms', element: <TermsOfService /> },
  { path: '/services', element: <ServicesDirectoryPage /> },
  { path: '/services/:category/:slug', element: <ServiceDetailPage /> },
  { path: '/alerts', element: <AlertsPage /> },
  { path: '/government', element: <GovernmentDirectoryPage /> },
];

function AppContent() {
  const { isEmergencyActive } = useEmergency();
  const location = useLocation();
  usePageTracking(); // Fires GA4 synthetic page views on route change

  // Scroll to hash or top on route change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  const isSplash = location.pathname === '/';

  return (
    <LocaleProvider>
      <div className="min-h-screen">
        <MainLayout isEmergencyActive={isEmergencyActive}>
          <ProactiveAlerts />
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<SplashScreen />} />

                {/* Default (English, unprefixed) routes */}
                {routeDefs.map((r) => (
                  <Route key={r.path} path={r.path} element={r.element} />
                ))}

                {/* Same routes again, once per supported locale prefix */}
                {SUPPORTED_LOCALES.flatMap((lang) => [
                  <Route key={`${lang}-root`} path={`/${lang}`} element={<HomePage />} />,
                  ...routeDefs.map((r) => (
                    <Route key={`${lang}-${r.path}`} path={`/${lang}${r.path}`} element={r.element} />
                  )),
                ])}

                <Route path="/:region" element={<SubRegionPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </MainLayout>

        {!isSplash && <Footer />}
        {!isSplash && <BottomNav />}
        <div className="hidden lg:block">
          {!isSplash && <EmergencyToggle />}
          {!isSplash && <PulseCounter />}
          {!isSplash && <StickyAnchorAd />}
        </div>
        <CookieConsent />
      </div>
    </LocaleProvider>
  );
}

export default function App() {
  return (
    <EmergencyProvider>
      <AppContent />
    </EmergencyProvider>
  );
}
