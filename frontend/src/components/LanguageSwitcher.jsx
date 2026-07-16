import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { LOCALE_META } from '../i18n/translations';
import { stripLocalePrefix } from '../context/LocaleContext';

const ORDER = ['en', 'te', 'ur'];

export default function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const switchTo = (target) => {
    const basePath = stripLocalePrefix(location.pathname);
    const newPath = target === 'en' ? basePath : `/${target}${basePath}`;
    navigate(newPath + location.search + location.hash);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 hover:bg-white/5 rounded-xl text-text-muted hover:text-white transition-all duration-200 flex items-center gap-1"
        title={t('common.language')}
        aria-label={t('common.language')}
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
        </svg>
        <span className="text-[10px] font-bold uppercase hidden sm:inline">{locale}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-dark-bg border border-white/10 shadow-xl overflow-hidden z-50 animate-fade-in">
          {ORDER.map((code) => (
            <button
              key={code}
              onClick={() => switchTo(code)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                locale === code ? 'bg-telangana-green/10 text-telangana-green font-semibold' : 'text-white/80 hover:bg-white/5'
              }`}
            >
              <span>{LOCALE_META[code].native}</span>
              {locale === code && <span className="text-xs">&#10003;</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
