import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
        });
      }
    } else if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
      });
    }
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
      });
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-dark-bg-secondary border-t border-white/10 p-4 shadow-2xl animate-slide-up">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-text-muted">
          We use cookies to analyze traffic and measure engagement in accordance with India&apos;s DPDP Act. By clicking &quot;Accept All&quot;, you consent to our use of analytics cookies as detailed in our <a href="/privacy" className="text-telangana-green hover:underline">Privacy Policy</a>.
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={handleReject}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white/10 text-text-secondary rounded-lg hover:bg-white/15 transition-colors"
          >
            Essential Only
          </button>
          <button 
            onClick={handleAccept}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-telangana-green text-slate-950 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
