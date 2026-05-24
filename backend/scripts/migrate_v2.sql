-- Migration script for Phase 1: Schema Extensions and Civic Correlations
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Alter content table to add new columns
ALTER TABLE content ADD COLUMN IF NOT EXISTS civic_tags TEXT[] DEFAULT '{}';
ALTER TABLE content ADD COLUMN IF NOT EXISTS entities JSONB DEFAULT '{}'::jsonb;
ALTER TABLE content ADD COLUMN IF NOT EXISTS district VARCHAR(100);
ALTER TABLE content ADD COLUMN IF NOT EXISTS vector_embedding vector(768);

-- Create civic_correlations table
CREATE TABLE IF NOT EXISTS civic_correlations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id BIGINT REFERENCES content(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  correlation_score DOUBLE PRECISION DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create performance indexes for civic_correlations
CREATE INDEX IF NOT EXISTS idx_correlations_entity ON civic_correlations(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_correlations_content ON civic_correlations(content_id);

-- Create HNSW index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_content_vector ON content USING hnsw (vector_embedding vector_cosine_ops);

-- Enable Row-Level Security (RLS)
ALTER TABLE civic_correlations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON civic_correlations
  FOR SELECT USING (is_active = true);

-- Grant select permission to anonymous users
GRANT SELECT ON civic_correlations TO anon;
