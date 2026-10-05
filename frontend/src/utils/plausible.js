// Cookieless analytics via Plausible (no cookie banner needed for it).
// Off until VITE_PLAUSIBLE_DOMAIN is set in the build environment, because
// the domain must first be added to a Plausible account. The script follows
// client-side route changes on its own.

const SCRIPT_SRC = 'https://plausible.io/js/script.js';

/** Adds the Plausible script once. Returns true when it was added. */
export function loadPlausible(domain, doc = globalThis.document) {
    if (!domain || !doc) return false;
    if (doc.querySelector(`script[src="${SCRIPT_SRC}"]`)) return false;
    const script = doc.createElement('script');
    script.defer = true;
    script.src = SCRIPT_SRC;
    script.setAttribute('data-domain', domain);
    doc.head.appendChild(script);
    return true;
}
