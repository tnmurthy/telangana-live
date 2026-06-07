# Telangana.live v2 (Next.js + FastAPI)

## Development Setup

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend (Next.js 15)
```bash
cd frontend
npm install
npm run dev
```

### 3. Database (Supabase)
Run the migration in `supabase/migrations/20260606_v2_init.sql` via the Supabase SQL Editor.

## Features Implemented (100% Completion)
- [x] **My Area Personalization**: persistent region selection and context.
- [x] **AI Assistant**: RAG pipeline with Gemini 1.5 Flash for civic Q&A.
- [x] **Schemes Finder**: Complex logic engine for benefit eligibility.
- [x] **Water Updates**: Dynamic supply scheduling and countdown timers.
- [x] **Power Outages**: Real-time grid alerts and ETA restoration board.
- [x] **SOS Directory**: Geo-aware emergency contacts and one-tap dialing.
- [x] **News Feed**: AI-classified regional updates with pulse scoring.
- [x] **Jobs board**: Matched career opportunities with salary indicators.
- [x] **Ward/Mandal Dashboard**: Aggregated command center for local citizens.
- [x] **Complaint Routing**: AI-driven grievance classification and tracking.
- [x] **Transport Layer**: Live arrival board for Metro and Bus services.
- [x] **Hyperlocal Alerts**: Geofenced broadcast system for official warnings.
- [x] **Public Works Tracker**: Milestone-based infrastructure transparency.
- [x] **District Dashboards**: Aggregated metrics for all 33 districts.

