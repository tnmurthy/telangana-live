# SEO & Growth Audit - Telangana.live

## Executive Summary
This audit was performed autonomously to identify SEO bottlenecks and growth opportunities for Telangana.live. The platform has strong functionality but lacks fundamental SEO features needed for organic discovery.

## Findings

### 🔴 HIGH Severity
1. **Missing Meta Tags & OpenGraph Data (`index.html`)**
   - **Issue:** No `<meta name="description">`, `og:title`, `og:description`, `og:image`, or Twitter cards. Social sharing will look broken (no previews), and search engines lack context.
   - **Recommendation:** Add comprehensive static meta tags to the HTML head.

2. **Missing `robots.txt`**
   - **Issue:** No `robots.txt` in the `public/` directory. Search engine crawlers (Googlebot, Bingbot) don't have instructions on what to crawl or where the sitemap is.
   - **Recommendation:** Create `frontend/public/robots.txt` allowing all crawlers and pointing to the sitemap.

3. **Missing `sitemap.xml`**
   - **Issue:** No sitemap available. Given this is a React SPA, search engines will struggle to discover deep pages (like `/news`, `/weather`, `/fuel`).
   - **Recommendation:** Create a static `sitemap.xml` in the `public/` directory with the core app routes.

### 🟡 MEDIUM Severity
4. **Missing Structured Data (JSON-LD)**
   - **Issue:** No schema markup for Google's Knowledge Graph.
   - **Recommendation:** Add a `WebSite` and `NewsMediaOrganization` JSON-LD script to the head.

5. **Dynamic Meta Tags (React Helmet)**
   - **Issue:** Because it's a SPA (Single Page Application), the title doesn't change when navigating between routes. 
   - **Recommendation:** Implement `react-helmet` or similar to dynamically update the document title and meta description based on the route (e.g., "Fuel Prices - Telangana.live").

### 🟢 LOW Severity
6. **Heading Hierarchy (H1/H2)**
   - **Issue:** Needs a manual check to ensure exactly one `<h1>` per view, logically followed by `<h2>`s.

---
## Action Plan
1. **Implemented now:** Added Meta/OG tags to `index.html`.
2. **Implemented now:** Created `robots.txt`.
3. **Implemented now:** Created basic `sitemap.xml` covering main routes.
