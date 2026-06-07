'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AreaContextType {
  selectedArea: any | null;
  setArea: (area: any) => void;
  isLoading: boolean;
}

const AreaContext = createContext<AreaContextType | undefined>(undefined);

export function AreaProvider({ children }: { children: React.ReactNode }) {
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('tl-selected-area');
    if (saved) {
      setSelectedArea(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const setArea = (area: any) => {
    setSelectedArea(area);
    localStorage.setItem('tl-selected-area', JSON.stringify(area));
  };

  return (
    <AreaContext.Provider value={{ selectedArea, setArea, isLoading }}>
      {children}
    </AreaContext.Provider>
  );
}

export function useArea() {
  const context = useContext(AreaContext);
  if (context === undefined) {
    throw new Error('useArea must be used within an AreaProvider');
  }
  return context;
}
