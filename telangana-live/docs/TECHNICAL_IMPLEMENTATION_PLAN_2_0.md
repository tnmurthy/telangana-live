# Section 4: Feature-by-Feature Technical Implementation Plan

This section provides a surgical breakdown of the 14 core features of Telangana.live 2.0, ensuring architectural consistency with Section 1 (System Architecture) and Section 2 (Database Schema).

---

## 1. My Area Personalization (Session + DB)
- **Purpose & User Story**: Provide a "Home" context for every user. *As a user, I want the app to remember my Ward/Mandal so I see relevant local updates immediately.*
- **Data Sources**: Internal `profiles` and `areas` tables. Browser `localStorage` for guest sessions.
- **API Endpoints**: 
    - `GET /api/user/profile`: Fetch region_id and preferences.
    - `PATCH /api/user/profile`: Update region_id or preferences.
- **Backend Logic**: Middleware to inject `area_id` into queries if session exists; fall back to IP-based geolocation for guests.
- **Database Tables**: `public.profiles`, `public.areas`.
- **Caching Strategy**: Redis `user_session:{id}` (TTL: 24h) to avoid repeated DB lookups for region context.
- **Frontend Components**: `LocationPicker` (Bottom Sheet), `ProfileHeader`.
- **Integration**: Sets the global `AreaContext` used by all other components.
- **Error Handling**: Fallback to "State-wide" view if location is unavailable or invalid.

## 2. Water Updates (Dynamic Schedule Mapping)
- **Purpose & User Story**: Real-time water supply tracking. *As a resident, I want to know exactly when water will be supplied to my ward today.*
- **Data Sources**: HMWSSB (Hyderabad Water Board) website scrapers, manual entry for rural Mandals.
- **API Endpoints**: `GET /api/civic/water?area_id={uuid}`.
- **Backend Logic**: Python scraper parses HMWSSB schedule; AI normalizes varied timing strings into `water_schedules` table.
- **Database Tables**: `public.water_schedules`, `public.areas`.
- **Caching Strategy**: Redis `water_sched:{area_id}` (TTL: 1h).
- **Frontend Components**: `CountdownTimer`, `WeeklyCalendarGrid`.
- **Integration**: Filtered by "My Area" `area_id`.
- **Error Handling**: Display "Schedule Unavailable" with a "Report Status" button if scraper fails.

## 3. Power Outages (Real-time Alert Ingestion)
- **Purpose & User Story**: Outage transparency. *As a citizen, I want to know if my power cut is a scheduled maintenance or an unplanned fault.*
- **Data Sources**: TSSPDCL / TSNPDCL API/Scrapers, Twitter (X) monitoring for emergency alerts.
- **API Endpoints**: `GET /api/civic/power?area_id={uuid}`.
- **Backend Logic**: FastAPI agent monitors utility Twitter handles and websites; categorizes as 'planned' or 'unplanned'.
- **Database Tables**: `public.power_outages`.
- **Caching Strategy**: Redis `power_status:{area_id}` (TTL: 5m - High frequency).
- **Frontend Components**: `LiveStatusMap` (SVG), `MaintenanceCard`.
- **Integration**: Push notifications triggered when a new outage record is created for a user's `area_id`.
- **Error Handling**: Use "Community Reported" status if official data is missing but multiple users report an outage.

## 4. SOS Directory (Geo-aware Contacts)
- **Purpose & User Story**: Instant help. *As a person in distress, I need one-tap access to the nearest police station or hospital.*
- **Data Sources**: SCR (State Crime Records), Health Dept registry, Google Places API (for proximity).
- **API Endpoints**: `GET /api/civic/emergency?lat={lat}&lng={lng}&category={cat}`.
- **Backend Logic**: PostGIS query in Supabase to find nearest 3 stations/hospitals based on user coords.
- **Database Tables**: `public.emergency_contacts`.
- **Caching Strategy**: Redis `emergency_dir:{area_id}` (TTL: 24h).
- **Frontend Components**: `SOSButton` (High-priority), `CategoryDialGrid`.
- **Integration**: Defaults to "My Area" contacts but allows GPS-based overrides.
- **Error Handling**: Hardcoded "State-wide" helplines (100, 108) always visible as fallback.

## 5. Schemes Finder (Eligibility Logic Engine)
- **Purpose & User Story**: Benefit discovery. *As a farmer, I want to find which government schemes I qualify for based on my land and income.*
- **Data Sources**: Telangana State Portal, Government G.O.s (Government Orders).
- **API Endpoints**: `POST /api/schemes/check-eligibility` (Payload: age, income, category, etc.).
- **Backend Logic**: Logic engine matches user profile JSON against `eligibility_json` in the DB.
- **Database Tables**: `public.government_schemes`.
- **Caching Strategy**: Static cache for schemes; query results not cached (personalized).
- **Frontend Components**: `EligibilityQuiz` (Multi-step form), `SchemeCard`.
- **Integration**: Profiles can save "Eligible Schemes" to their dashboard.
- **Error Handling**: AI-generated "How to Apply" guide if official link is broken.

## 6. News Feed (AI Classifier + Scraper)
- **Purpose & User Story**: Localized information. *As a resident, I want to read news that specifically mentions my Mandal or District.*
- **Data Sources**: TOI, Hans India, Eenadu, Sakshi (RSS + Scrapers).
- **API Endpoints**: `GET /api/civic/news?region_id={uuid}`.
- **Backend Logic**: Gemini Flash summarizes articles and tags them with `region_id` based on location mentions.
- **Database Tables**: `public.news`.
- **Caching Strategy**: Vercel Data Cache (ISR) for feed; Redis `news_trending` (TTL: 30m).
- **Frontend Components**: `InfiniteNewsFeed`, `AISummaryBadge`.
- **Integration**: Primary feed is filtered by "My Area" District.
- **Error Handling**: Deduplication logic prevents same story from multiple sources.

## 7. Jobs & Notifications (Push API + Matching)
- **Purpose & User Story**: Livelihood hub. *As a job seeker, I want to see vacancies within a 10km radius of my home.*
- **Data Sources**: TSPSC, Private job boards, LinkedIn API, Local business submissions.
- **API Endpoints**: `GET /api/jobs?area_id={uuid}&radius=10`.
- **Backend Logic**: Daily scraper for TSPSC; matching engine sends WebPush alerts for "Featured" jobs.
- **Database Tables**: `public.jobs`.
- **Caching Strategy**: Redis `job_count:{area_id}` (TTL: 12h).
- **Frontend Components**: `JobSearchCard`, `ApplyNowButton`.
- **Integration**: "My Area" settings define the default job search radius.
- **Error Handling**: Verification badge for "Official" govt jobs to prevent scams.

## 8. Ward/Mandal Dashboard (Civic API Gateway)
- **Purpose & User Story**: Localized performance view. *As a citizen, I want to see the overall health of my ward (cleanliness, lighting, water).*
- **Data Sources**: Aggregated data from features 2, 3, 4, 9, 14.
- **API Endpoints**: `GET /api/civic/dashboard/{area_id}`.
- **Backend Logic**: Aggregates `public_works` progress and `citizen_reports` status for a specific `area_id`.
- **Database Tables**: `areas`, `public_works`, `profiles`.
- **Caching Strategy**: Redis `dashboard_stats:{area_id}` (TTL: 1h).
- **Frontend Components**: `GovernanceScoreCard`, `InfraStatusChecklist`.
- **Integration**: The default view of the "My Area" tab.
- **Error Handling**: Show "Under Construction" if specific ward data is sparse.

## 9. Complaint Routing (NLP to District Dept)
- **Purpose & User Story**: Direct accountability. *As a citizen, I want to report a pothole and have it automatically sent to the right department.*
- **Data Sources**: User-submitted photos/text.
- **API Endpoints**: `POST /api/civic/report`.
- **Backend Logic**: NLP (Gemini) classifies report into 'Roads', 'Sanitation', etc., and routes to department email/API.
- **Database Tables**: `public.citizen_reports` (Reference Section 2).
- **Caching Strategy**: None (Transactional).
- **Frontend Components**: `CameraCapture`, `ReportForm`.
- **Integration**: Reports are tagged with user's current `area_id`.
- **Error Handling**: Offline sync for reports made in low-connectivity areas.

## 10. Transport Layer (Metro/Bus Live Data)
- **Purpose & User Story**: Commute planning. *As a commuter, I want to see the next Bus/Metro timings for my usual route.*
- **Data Sources**: TSRTC (Bus), L&T Metro API, Google Transit.
- **API Endpoints**: `GET /api/transport/route/{id}`.
- **Backend Logic**: Real-time fetch from transit APIs; fallback to static `transport_info` schedule.
- **Database Tables**: `public.transport_info`.
- **Caching Strategy**: Redis `transit_live:{route_id}` (TTL: 1m).
- **Frontend Components**: `MetroTimeline`, `BusRouteCard`.
- **Integration**: "My Area" context highlights the nearest Metro/Bus stops.
- **Error Handling**: Display "Service Alert" if transit APIs are unresponsive.

## 11. Hyperlocal Alerts (Geofenced Push)
- **Purpose & User Story**: Immediate safety. *As a resident, I want an instant alert if there is a flood warning or a traffic diversion in my street.*
- **Data Sources**: IMD (Weather), Traffic Police alerts.
- **API Endpoints**: `POST /api/alerts/broadcast`.
- **Backend Logic**: Matches alert `region_id` with user `region_id` in `profiles` and triggers Firebase Cloud Messaging (FCM).
- **Database Tables**: `public.cached_external_data`, `public.profiles`.
- **Caching Strategy**: None (Low latency priority).
- **Frontend Components**: `EmergencyBanner` (Sticky), `PushNotificationPopup`.
- **Integration**: Only alerts relevant to the user's "My Area" (or current GPS) are shown.
- **Error Handling**: Use SMS fallback for "Critical" (Red) alerts if WebPush fails.

## 12. District Dashboards (Aggregated Stats)
- **Purpose & User Story**: Macro performance. *As a journalist/official, I want to compare the progress of public works across all districts.*
- **Data Sources**: Aggregate stats from all Mandals in a District.
- **API Endpoints**: `GET /api/districts/stats`.
- **Backend Logic**: SQL `GROUP BY district_id` on `public_works` and `citizen_reports`.
- **Database Tables**: `areas`, `public_works`.
- **Caching Strategy**: Redis `district_rankings` (TTL: 24h).
- **Frontend Components**: `DistrictComparisonChart`, `Leaderboard`.
- **Integration**: Navigable from the main sidebar.
- **Error Handling**: Data normalization to ensure fair comparisons between rural and urban districts.

## 13. AI Assistant (RAG on Scheme/Contact DB)
- **Purpose & User Story**: Natural language help. *As a user, I want to ask "Who is the corporator of Madhapur?" and get a direct answer.*
- **Data Sources**: All tables in Section 2.
- **API Endpoints**: `POST /api/ai/chat`.
- **Backend Logic**: Retrieval Augmented Generation (RAG) using Supabase Vector (pgvector) on scheme and contact data.
- **Database Tables**: Vectorized versions of `government_schemes` and `emergency_contacts`.
- **Caching Strategy**: Redis `chat_history:{user_id}`.
- **Frontend Components**: `FloatingChatBot`, `QuickSuggestions`.
- **Integration**: Always "Area-aware"; answers are contextualized to the user's saved location.
- **Error Handling**: "I don't know" fallback with a link to the official directory.

## 14. Public Works Tracker (Milestone Verification)
- **Purpose & User Story**: Corruption monitoring. *As a citizen, I want to see if the road work my tax paid for is actually progressing as claimed.*
- **Data Sources**: Govt tender portals, News reports, User-uploaded "Verification" photos.
- **API Endpoints**: `GET /api/works?area_id={uuid}`.
- **Backend Logic**: Aggregates official budget data with community-submitted "progress photos".
- **Database Tables**: `public.public_works`.
- **Caching Strategy**: Redis `works_milestones:{id}` (TTL: 12h).
- **Frontend Components**: `ProgressBar`, `BeforeAfterGallery`.
- **Integration**: Pinned to the "Ward Dashboard" of the user's area.
- **Error Handling**: "Data Dispute" flag if user photos significantly contradict official status.
