-- Telangana.live Content Management Tables for Supabase
-- Run this SQL in your Supabase SQL editor to create the schema

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id BIGSERIAL PRIMARY KEY,
  title TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  content TEXT,
  source_url TEXT,
  generated_code TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  token_usage INTEGER DEFAULT 0
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  agent TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details TEXT,
  tokens_used INTEGER DEFAULT 0
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_activity_agent ON activity_log(agent);
CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON activity_log(timestamp DESC);

-- Enable RLS (Row Level Security) - optional
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Enable read access for all users" ON content;
CREATE POLICY "Enable read access for all users" ON content
  FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Enable read access for logs" ON activity_log;
CREATE POLICY "Enable read access for logs" ON activity_log
  FOR SELECT USING (true);

-- Grant permissions (optional)
GRANT SELECT ON content TO anon;
GRANT SELECT ON activity_log TO anon;

-- ==============================================================================
-- FRONTEND DATA TABLES
-- ==============================================================================

-- Create citizen_reports table
CREATE TABLE IF NOT EXISTS citizen_reports (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  ward TEXT,
  corporation TEXT,
  status TEXT DEFAULT 'pending_moderation',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency_status table (Single row configuration)
CREATE TABLE IF NOT EXISTS emergency_status (
  id INTEGER PRIMARY KEY DEFAULT 1,
  active BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'none',
  severity TEXT DEFAULT 'low',
  message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create power_alerts table
CREATE TABLE IF NOT EXISTS power_alerts (
  id BIGSERIAL PRIMARY KEY,
  area TEXT NOT NULL,
  from_time TEXT NOT NULL,
  to_time TEXT NOT NULL,
  reason TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create public read policies
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE power_alerts ENABLE ROW LEVEL SECURITY;

-- Allow public read of approved reports
DROP POLICY IF EXISTS "Enable read access for approved reports" ON citizen_reports;
CREATE POLICY "Enable read access for approved reports" ON citizen_reports
  FOR SELECT USING (status = 'approved');

-- Allow public insert of new reports
DROP POLICY IF EXISTS "Enable insert access for public" ON citizen_reports;
CREATE POLICY "Enable insert access for public" ON citizen_reports
  FOR INSERT WITH CHECK (true);

-- Allow public read of emergency status and power alerts
DROP POLICY IF EXISTS "Enable read access for emergency" ON emergency_status;
CREATE POLICY "Enable read access for emergency" ON emergency_status FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for power alerts" ON power_alerts;
CREATE POLICY "Enable read access for power alerts" ON power_alerts FOR SELECT USING (true);

-- Grant anon permissions
GRANT SELECT, INSERT ON citizen_reports TO anon;
GRANT SELECT ON emergency_status TO anon;
GRANT SELECT ON power_alerts TO anon;
