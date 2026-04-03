import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { EmergencyProvider } from './context/EmergencyProvider';
import { useEmergency } from './hooks/useEmergency';
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

// Loading Fallback
const LoadingScreen = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-fade-in">
    <div className="w-12 h-12 border-4 border-telangana-green/20 border-t-telangana-green rounded-full animate-spin"></div>
    <p className="text-text-muted text-sm font-medium tracking-wide uppercase">Calibrating 2026 Data...</p>
  </div>
);

function EmergencyToggle() {
  const { isEmergencyActive, activateEmergency, deactivateEmergency } = useEmergency();
  return (
    <button
      onClick={() => isEmergencyActive ? deactivateEmergency() : activateEmergency('heatwave')}
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
              {isSplash ? (
                <Route path="/" element={<SplashScreen />} />
              ) : (
                <>
                  <Route path="/dashboard" element={<HomePage />} />
                  <Route path="/rates/gold" element={<GoldLandingPage />} />
                  <Route path="/rates/fuel" element={<FuelLandingPage />} />
                  <Route path="/transport/metro" element={<TransportLandingPage />} />
                  <Route path="/health/basthi-dawakhana" element={<HealthLandingPage />} />
                  <Route path="/news" element={<NewsListingPage />} />
                  <Route path="/admin/cockpit" element={<ContentAdminCockpit />} />
                  <Route path="/ai-pulse" element={<AIPulsePage />} />
                  <Route path="/:region" element={<SubRegionPage />} />
                  <Route path="*" element={<NotFound />} />
                </>
              )}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </MainLayout>

      {!isSplash && <Footer />}
      {!isSplash && <BottomNav />}
      {!isSplash && <EmergencyToggle />}
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
