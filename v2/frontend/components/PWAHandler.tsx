'use client';

import { useEffect } from 'react';

export default function PWAHandler() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('✅ Service Worker Registered:', reg.scope))
        .catch((err) => console.error('❌ Service Worker Error:', err));
    }
  }, []);

  return null;
}
