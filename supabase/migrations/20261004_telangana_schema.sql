-- telangana.live data, in its own schema inside the shared "Talia" Supabase
-- project (moved 2026-10-04 from the paused project xgzxbenwlcmqtloajroi).
--
-- Built from what the code actually reads and writes:
--   frontend  citizen_reports, smart_classifieds, emergency_status, content
--   backend   content, civic_correlations, activity_log, topic_queue
--   workflow  news_articles (backend/scripts/news_aggregation.py)
--
-- Access model: the browser uses the anon key, so every table has RLS.
-- anon may read only what the site shows and may insert only a pending
-- citizen report or an unfeatured classified. Everything else is written by
-- backend jobs with the service_role key, which bypasses RLS.

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS telangana;
GRANT USAGE ON SCHEMA telangana TO anon, authenticated, service_role;

-- ── Citizen reports (public submits, moderators approve) ───────────────────
CREATE TABLE telangana.citizen_reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category    TEXT NOT NULL,
    description TEXT NOT NULL CHECK (char_length(description) <= 2000),
    lat         DOUBLE PRECISION,
    lng         DOUBLE PRECISION,
    ward        TEXT,
    corporation TEXT,
    status      TEXT NOT NULL DEFAULT 'pending_moderation'
                CHECK (status IN ('pending_moderation', 'approved', 'rejected', 'resolved')),
    photo_url   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON telangana.citizen_reports (status, created_at DESC);

-- ── Classifieds ────────────────────────────────────────────────────────────
CREATE TABLE telangana.smart_classifieds (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    description     TEXT CHECK (char_length(description) <= 2000),
    category        TEXT NOT NULL,
    price           NUMERIC,
    lat             DOUBLE PRECISION,
    lng             DOUBLE PRECISION,
    ward            TEXT,
    whatsapp_number TEXT,
    image_url       TEXT,
    status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'removed')),
    is_featured     BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT now() + interval '7 days'
);
CREATE INDEX ON telangana.smart_classifieds (status, created_at DESC);

-- ── Emergency banner: a single row, id = 1 ─────────────────────────────────
CREATE TABLE telangana.emergency_status (
    id         INT PRIMARY KEY CHECK (id = 1),
    active     BOOLEAN NOT NULL DEFAULT false,
    type       TEXT NOT NULL DEFAULT 'none',
    severity   TEXT NOT NULL DEFAULT 'low',
    message    TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO telangana.emergency_status (id) VALUES (1);

-- ── Content pipeline (backend agents; StoriesBar reads published rows) ─────
CREATE TABLE telangana.content (
    id               BIGSERIAL PRIMARY KEY,
    title            TEXT UNIQUE NOT NULL,
    category         TEXT NOT NULL,
    content          TEXT,
    source_url       TEXT,
    generated_code   TEXT,
    status           TEXT DEFAULT 'active',
    token_usage      INTEGER DEFAULT 0,
    civic_tags       TEXT[] DEFAULT '{}',
    entities         JSONB DEFAULT '{}'::jsonb,
    district         VARCHAR(100),
    vector_embedding extensions.vector(768),
    created_at       TIMESTAMPTZ DEFAULT now(),
    updated_at       TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON telangana.content (status, updated_at DESC);
CREATE INDEX ON telangana.content (category);

CREATE TABLE telangana.civic_correlations (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id        BIGINT REFERENCES telangana.content(id) ON DELETE CASCADE,
    entity_type       VARCHAR(50) NOT NULL,
    entity_id         VARCHAR(100) NOT NULL,
    correlation_score DOUBLE PRECISION DEFAULT 1.0,
    is_active         BOOLEAN DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON telangana.civic_correlations (entity_type, entity_id);
CREATE INDEX ON telangana.civic_correlations (content_id);

CREATE TABLE telangana.activity_log (
    id          BIGSERIAL PRIMARY KEY,
    agent       TEXT NOT NULL,
    action      TEXT NOT NULL,
    status      TEXT NOT NULL,
    details     TEXT,
    tokens_used INTEGER DEFAULT 0,
    timestamp   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE telangana.topic_queue (
    id           BIGSERIAL PRIMARY KEY,
    topic        TEXT NOT NULL,
    category     TEXT,
    content_type TEXT,
    status       TEXT NOT NULL DEFAULT 'pending',
    created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── News archive (news_aggregation.py upserts on id) ───────────────────────
CREATE TABLE telangana.news_articles (
    id                        TEXT PRIMARY KEY,
    title                     TEXT NOT NULL,
    link                      TEXT,
    source                    TEXT,
    published                 TEXT,
    description               TEXT,
    category                  TEXT,
    region                    TEXT,
    image_url                 TEXT,
    ai_summary                TEXT,
    tags                      TEXT[] DEFAULT '{}',
    correlated_civic_entities JSONB,
    created_at                TIMESTAMPTZ DEFAULT now()
);

-- ── Privileges + RLS ───────────────────────────────────────────────────────
GRANT ALL ON ALL TABLES IN SCHEMA telangana TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA telangana TO service_role;
GRANT SELECT ON telangana.citizen_reports, telangana.smart_classifieds,
                telangana.emergency_status, telangana.content,
                telangana.civic_correlations, telangana.news_articles
      TO anon, authenticated;
GRANT INSERT ON telangana.citizen_reports, telangana.smart_classifieds TO anon, authenticated;

ALTER TABLE telangana.citizen_reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.smart_classifieds  ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.emergency_status   ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.content            ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.civic_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.activity_log       ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.topic_queue        ENABLE ROW LEVEL SECURITY;
ALTER TABLE telangana.news_articles      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read approved reports" ON telangana.citizen_reports
    FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "submit pending report" ON telangana.citizen_reports
    FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending_moderation');

CREATE POLICY "read live classifieds" ON telangana.smart_classifieds
    FOR SELECT TO anon, authenticated USING (status = 'active' AND expires_at > now());
CREATE POLICY "post unfeatured classified" ON telangana.smart_classifieds
    FOR INSERT TO anon, authenticated WITH CHECK (status = 'active' AND is_featured = false);

CREATE POLICY "read emergency status" ON telangana.emergency_status
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read published content" ON telangana.content
    FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "read active correlations" ON telangana.civic_correlations
    FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "read news" ON telangana.news_articles
    FOR SELECT TO anon, authenticated USING (true);
-- activity_log, topic_queue: service_role only (no anon policy).

-- Realtime: the site subscribes to these two.
ALTER PUBLICATION supabase_realtime ADD TABLE telangana.citizen_reports, telangana.emergency_status;
