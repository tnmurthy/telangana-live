'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'te' | 'ur';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const DICTIONARY: Record<Locale, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    water: "Water Supply",
    power: "Power Status",
    jobs: "Career Hub",
    news: "Civic Pulse",
    assistant: "AI Assistant",
    report: "Report Issue",
    sos: "Emergency",
    select_area: "Select Your Area"
  },
  te: {
    dashboard: "డాష్‌బోర్డ్",
    water: "నీటి సరఫరా",
    power: "విద్యుత్ స్థితి",
    jobs: "కెరీర్ హబ్",
    news: "సివిక్ పల్స్",
    assistant: "AI సహాయకుడు",
    report: "సమస్యను నివేదించండి",
    sos: "అత్యవసర పరిస్థితి",
    select_area: "మీ ప్రాంతాన్ని ఎంచుకోండి"
  },
  ur: {
    dashboard: "ڈیش بورڈ",
    water: "پانی کی فراہمی",
    power: "بجلی کی صورتحال",
    jobs: "کیریئر حب",
    news: "سوک پلس",
    assistant: "AI اسسٹنٹ",
    report: "مسئلہ رپورٹ کریں",
    sos: "ہنگامی صورتحال",
    select_area: "اپنا علاقہ منتخب کریں"
  }
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tl-locale') as Locale;
    if (saved && ['en', 'te', 'ur'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('tl-locale', l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr';
  };

  const t = (key: string) => DICTIONARY[locale][key] || key;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
