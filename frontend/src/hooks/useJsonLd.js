import { useEffect } from 'react';

/**
 * Custom hook to dynamically inject JSON-LD structured schema markup into the HTML head.
 * Handles lifecycle by adding the script on mount and removing it on unmount.
 * 
 * @param {Object} schema - The Schema.org structured data object.
 * @param {string} id - A unique ID for the script tag to prevent duplicates.
 */
export default function useJsonLd(schema, id) {
  useEffect(() => {
    if (!schema) return;

    // Remove existing script if it matches the same ID
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema, id]);
}
