import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('tg-theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('tg-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // District personalization
  const [myDistrict, setMyDistrict] = useState(() => localStorage.getItem('tg-district') || '');
  const [showDistrictPrompt, setShowDistrictPrompt] = useState(() => !localStorage.getItem('tg-district'));

  const saveDistrict = useCallback((district) => {
    setMyDistrict(district);
    localStorage.setItem('tg-district', district);
    setShowDistrictPrompt(false);
  }, []);

  const dismissDistrictPrompt = useCallback(() => {
    setShowDistrictPrompt(false);
    localStorage.setItem('tg-district', ''); // mark as dismissed
  }, []);

  // Reading streak
  const [streak, setStreak] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('tg-streak') || '{}');
      const today = new Date().toDateString();
      return { count: data.count || 0, today: data.today || '', reads: data.reads || 0, ...data };
    } catch { return { count: 0, today: '', reads: 0 }; }
  });

  const recordRead = useCallback(() => {
    setStreak(prev => {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let newCount = prev.count;
      let newReads = (prev.today === today ? prev.reads : 0) + 1;

      if (prev.today !== today) {
        newCount = prev.today === yesterday ? prev.count + 1 : 1;
      }

      const next = { count: newCount, today, reads: newReads };
      localStorage.setItem('tg-streak', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      searchQuery, setSearchQuery,
      myDistrict, saveDistrict,
      showDistrictPrompt, dismissDistrictPrompt,
      streak, recordRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
