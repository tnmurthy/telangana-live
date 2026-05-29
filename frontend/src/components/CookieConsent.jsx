import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-dark-bg-secondary border-t border-white/10 p-4 shadow-2xl animate-slide-up">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-text-muted">
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies as detailed in our <a href="/privacy" className="text-telangana-green hover:underline">Privacy Policy</a>.
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={handleAccept}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-telangana-green text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
