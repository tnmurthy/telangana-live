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
CREATE POLICY "Enable read access for all users" ON content
  FOR SELECT USING (status = 'active');

CREATE POLICY "Enable read access for logs" ON activity_log
  FOR SELECT USING (true);

-- Grant permissions (optional)
GRANT SELECT ON content TO anon;
GRANT SELECT ON activity_log TO anon;
