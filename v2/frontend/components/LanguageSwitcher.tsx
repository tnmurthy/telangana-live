'use client';

import { useLocale } from '@/lib/LocaleContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
      {[
        { code: 'en', label: 'EN' },
        { code: 'te', label: 'తె' },
        { code: 'ur', label: 'اردو' }
      ].map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code as any)}
          className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
            locale === lang.code 
              ? 'bg-emerald-500 text-slate-950 shadow-md' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
