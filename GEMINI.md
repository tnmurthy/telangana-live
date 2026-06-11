## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current

---

## Civic Portal Architecture & UX Mandates

When building or modifying components for Telangana.live, strictly adhere to the following principles derived from global civic portal research:

### 1. Data & Architecture
- **Once-Only Principle:** Never require the user to input data they have already provided. Build connectors to existing state services (GHMC, TS-bPASS, MeeSeva) rather than creating siloed data stores.
- **Geospatial & Hyper-Local:** All new features must be context-aware. If adding alerts, news, or services, rely on PostGIS / Supabase location logic to filter content by the user's specific district, ward, or zip code.
- **Life-Event Bundling:** Do not organize the UI by government department (e.g., "Transport Dept"). Organize by citizen intent (e.g., "Plan Trip", "Start a Business", "New Homeowner").

### 2. UI/UX & GIGW 3.0 Compliance
- **WCAG 2.1 AA:** Ensure high contrast, keyboard navigability, and screen-reader compatibility (ARIA labels) for every component.
- **Progressive Disclosure:** Avoid information overload. Use step-by-step wizards (like DigiLocker) instead of long scrolling forms.
- **Mobile-First PWA:** Design components assuming the user is on a low-end smartphone with a variable network connection.
- **Multilingual Support:** All UI text must be structured to eventually support English, Telugu, and Urdu.

### 3. AI & "Agentic" Features
- **Proactive, not Reactive:** Transition features from static dashboards to proactive alerts (e.g., "Your property tax is due" instead of just a tax portal link).
- **Generative Assistance:** Where possible, use LLMs (like Gemini) to summarize long civic documents, meeting minutes, or legal text into plain, actionable language.
