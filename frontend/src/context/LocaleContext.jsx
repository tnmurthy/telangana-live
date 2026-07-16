import { createContext, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { translations, SUPPORTED_LOCALES, LOCALE_META } from '../i18n/translations';

const LocaleContext = createContext(null);

// Locale is derived from the URL path itself (first segment), not from a
// route param - this lets a single LocaleProvider wrap the whole app once
// (inside AppContent, which already calls useLocation) instead of having to
// wrap every single <Route> element individually.
export function detectLocale(pathname) {
  const first = pathname.split('/').filter(Boolean)[0];
  return SUPPORTED_LOCALES.includes(first) ? first : 'en';
}

export function stripLocalePrefix(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (SUPPORTED_LOCALES.includes(segments[0])) {
    return '/' + segments.slice(1).join('/');
  }
  return pathname || '/';
}

function getNested(obj, dottedKey) {
  return dottedKey.split('.').reduce((node, part) => (node == null ? undefined : node[part]), obj);
}

export function LocaleProvider({ children }) {
  const location = useLocation();
  const locale = detectLocale(location.pathname);

  const value = useMemo(() => {
    const t = (key) => {
      const hit = getNested(translations[locale], key);
      if (hit !== undefined) return hit;
      // Fall back to English for any key not yet translated in this locale,
      // rather than showing a raw key or blank string.
      const fallback = getNested(translations.en, key);
      return fallback !== undefined ? fallback : key;
    };

    // Builds a same-page link in the CURRENT locale. path must start with '/'.
    const localizedPath = (path) => (locale === 'en' ? path : `/${locale}${path}`);

    return { locale, localeMeta: LOCALE_META[locale], t, localizedPath };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}
