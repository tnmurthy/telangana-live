'use client';

import { useState } from 'react';
import GlassCard from './ui/GlassCard';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ur', name: 'Urdu', native: 'اردو' }
];

export default function LocaleSwitcher() {
  const [currentLocale, setCurrentLocale] = useState('en');

  return (
    <div className="flex gap-2 p-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setCurrentLocale(lang.code)}
          className={`px-4 py-2 rounded-lg transition-all border text-sm font-medium ${
            currentLocale === lang.code
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs opacity-70 uppercase tracking-tighter">{lang.name}</span>
            <span className="text-sm font-bold">{lang.native}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
