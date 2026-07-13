import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to track page views and custom events for GA4/GTM in a React SPA.
 * Handles the virtual pageview issue with React Router.
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Standard GA4 Page View Tracking
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    // Google Tag Manager Datalayer Push
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'virtual_page_view',
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);
}

/**
 * Helper function to track custom monetization/engagement events
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
  
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
  }
};
