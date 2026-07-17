-- Telangana.live 2.0 Relational Database Schema
-- Optimized for Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. GEOGRAPHIC AREAS (Hierarchy: District -> Mandal -> Ward/Village)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('district', 'mandal', 'ward', 'village')),
    parent_id UUID REFERENCES public.areas(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, type, parent_id)
);

CREATE INDEX idx_areas_parent_id ON public.areas(parent_id);
CREATE INDEX idx_areas_type ON public.areas(type);

-- ==============================================================================
-- 2. USER PROFILES (Linked to Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    region_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_region_id ON public.profiles(region_id);

-- ==============================================================================
-- 3. WATER SCHEDULES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.water_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
    timing TEXT NOT NULL, -- e.g., "6:00 AM - 8:00 AM"
    frequency TEXT NOT NULL, -- e.g., "Daily", "Alternate Days"
    notes TEXT,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_water_area_id ON public.water_schedules(area_id);

-- ==============================================================================
-- 4. POWER OUTAGES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.power_outages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'unplanned', 'restored')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_power_area_id ON public.power_outages(area_id);
CREATE INDEX idx_power_status ON public.power_outages(status);

-- ==============================================================================
-- 5. EMERGENCY CONTACTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID REFERENCES public.areas(id) ON DELETE CASCADE, -- NULL for state-wide
    category TEXT NOT NULL, -- e.g., "Police", "Fire", "Ambulance", "Women Helpline"
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emergency_area_id ON public.emergency_contacts(area_id);
CREATE INDEX idx_emergency_category ON public.emergency_contacts(category);

-- ==============================================================================
-- 6. GOVERNMENT SCHEMES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.government_schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE,
    description TEXT,
    benefits TEXT,
    eligibility_json JSONB DEFAULT '{}'::jsonb,
    apply_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. NEWS (Hyper-local)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    ai_score NUMERIC DEFAULT 0,
    source_url TEXT,
    image_url TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_news_region_id ON public.news(region_id);
CREATE INDEX idx_news_category ON public.news(category);
CREATE INDEX idx_news_published_at ON public.news(published_at DESC);

-- ==============================================================================
-- 8. JOBS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    company TEXT NOT NULL,
    location_text TEXT,
    salary_range TEXT,
    description TEXT,
    apply_url TEXT,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_jobs_area_id ON public.jobs(area_id);
CREATE INDEX idx_jobs_category ON public.jobs(category);

-- ==============================================================================
-- 9. LOCAL EVENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.local_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    datetime TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_area_id ON public.local_events(area_id);
CREATE INDEX idx_events_datetime ON public.local_events(datetime);

-- ==============================================================================
-- 10. PUBLIC WORKS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.public_works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'in_progress', 'completed', 'halted')),
    budget NUMERIC,
    timeline TEXT, -- e.g., "Jan 2024 - Dec 2024"
    contractor TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_works_area_id ON public.public_works(area_id);
CREATE INDEX idx_works_status ON public.public_works(status);

-- ==============================================================================
-- 11. TRANSPORT INFO
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transport_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id TEXT NOT NULL, -- e.g., "Bus 218", "Metro Red Line"
    type TEXT NOT NULL CHECK (type IN ('bus', 'metro', 'train', 'other')),
    origin TEXT,
    destination TEXT,
    schedule JSONB DEFAULT '[]'::jsonb,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transport_route ON public.transport_info(route_id);
CREATE INDEX idx_transport_type ON public.transport_info(type);

-- ==============================================================================
-- 12. CACHED EXTERNAL DATA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cached_external_data (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cache_expires ON public.cached_external_data(expires_at);

-- ==============================================================================
-- 13. AUDIT LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_user ON public.audit_logs(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.power_outages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cached_external_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies
CREATE POLICY "Public Read Access for Areas" ON public.areas FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Water" ON public.water_schedules FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Power" ON public.power_outages FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Emergency" ON public.emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Schemes" ON public.government_schemes FOR SELECT USING (true);
CREATE POLICY "Public Read Access for News" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Events" ON public.local_events FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Works" ON public.public_works FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Transport" ON public.transport_info FOR SELECT USING (true);

-- 2. Profile Policies (Users can only read/edit their own profile)
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Area-based RLS Example (Optional: If we want to restrict certain news to residents)
-- CREATE POLICY "News visible to area residents" ON public.news 
-- FOR SELECT USING (region_id IN (SELECT region_id FROM profiles WHERE id = auth.uid()));

-- 4. Service Role / Admin write access (General pattern)
-- (Supabase service_role bypasses RLS by default, but we can add specific policies for admin users if needed)

-- ==============================================================================
-- FUNCTIONS AND TRIGGERS
-- ==============================================================================

-- Function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON public.areas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cache_updated_at BEFORE UPDATE ON public.cached_external_data FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
