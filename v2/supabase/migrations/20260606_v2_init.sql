-- 1. Ensure extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Ensure Areas Hierarchy exists (The foundation for area_id)
CREATE TABLE IF NOT EXISTS public.areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('district', 'mandal', 'ward', 'village', 'assembly_constituency', 'parliamentary_constituency')),
    parent_id UUID REFERENCES public.areas(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FUNCTION: Force add area_id to any table
-- This handles cases where "CREATE TABLE IF NOT EXISTS" skips a table that is missing the column
CREATE OR REPLACE FUNCTION add_area_id_if_missing(t_name text) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=t_name AND column_name='area_id') THEN
        EXECUTE 'ALTER TABLE public.' || quote_ident(t_name) || ' ADD COLUMN area_id UUID REFERENCES public.areas(id) ON DELETE CASCADE';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Create/Repair Tables
CREATE TABLE IF NOT EXISTS public.water_schedules (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), day_of_week INT, start_time TIME);
SELECT add_area_id_if_missing('water_schedules');

CREATE TABLE IF NOT EXISTS public.power_outages (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), type TEXT, status TEXT);
SELECT add_area_id_if_missing('power_outages');

CREATE TABLE IF NOT EXISTS public.citizen_reports (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT, description TEXT);
SELECT add_area_id_if_missing('citizen_reports');

CREATE TABLE IF NOT EXISTS public.news (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT, content TEXT);
SELECT add_area_id_if_missing('news');

CREATE TABLE IF NOT EXISTS public.officials (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name TEXT, role TEXT);
SELECT add_area_id_if_missing('officials');

-- 5. Now safely create the indexes that were failing
CREATE INDEX IF NOT EXISTS idx_water_area_day ON public.water_schedules(area_id);
CREATE INDEX IF NOT EXISTS idx_power_area_active ON public.power_outages(area_id);
CREATE INDEX IF NOT EXISTS idx_reports_area_id ON public.citizen_reports(area_id);
CREATE INDEX IF NOT EXISTS idx_news_area_id ON public.news(area_id);
CREATE INDEX IF NOT EXISTS idx_officials_area_id ON public.officials(area_id);

-- 6. Cleanup function
DROP FUNCTION add_area_id_if_missing(text);

-- 7. Add RAG Knowledge Base
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Final RLS
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Access" ON public.areas;
CREATE POLICY "Public Read Access" ON public.areas FOR SELECT USING (true);
