import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { EmergencyProvider } from './context/EmergencyProvider';
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
    <div className="min-h-screen">
      <MainLayout isEmergencyActive={isEmergencyActive}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/rates/gold" element={<GoldLandingPage />} />
              <Route path="/rates/fuel" element={<FuelLandingPage />} />
              <Route path="/transport/metro" element={<TransportLandingPage />} />
              <Route path="/health/basthi-dawakhana" element={<HealthLandingPage />} />
              <Route path="/news" element={<NewsListingPage />} />
              <Route path="/admin/cockpit" element={<ContentAdminCockpit />} />
              <Route path="/ai-pulse" element={<AIPulsePage />} />
              <Route path="/emergency-contacts" element={<EmergencyContactsPage />} />
              <Route path="/emergency" element={<EmergencyContactsPage />} />
              <Route path="/water-supply" element={<WaterSupplyPage />} />
              <Route path="/ration-pds" element={<RationPDSPage />} />
              <Route path="/jobs" element={<JobBoardPage />} />
              <Route path="/events" element={<CalendarPage />} />
              <Route path="/budget" element={<BudgetTrackerPage />} />
              <Route path="/politicians" element={<PoliticianTrackerPage />} />
              <Route path="/property-tax" element={<PropertyTaxPage />} />
              <Route path="/schemes" element={<SchemesPage />} />
              <Route path="/report" element={<ReportingLandingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/weather/forecast" element={<WeatherForecastPage />} />
              <Route path="/weather" element={<WeatherForecastPage />} />
              <Route path="/reservoirs" element={<ReservoirsPage />} />
              <Route path="/parks" element={<ParksPage />} />
              <Route path="/farmers" element={<FarmerPage />} />
              <Route path="/meeseva" element={<MeeSevaPage />} />
              <Route path="/classifieds" element={<ClassifiedsPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
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
  );
}

export default function App() {
  return (
    <EmergencyProvider>
      <AppContent />
    </EmergencyProvider>
  );
}

