-- =============================================
-- Plantfolio Database Schema - Initial Setup
-- =============================================
-- This migration creates all tables, indexes, and RLS policies
-- for the Plantfolio application.
--
-- To run: Copy and paste this entire file into the Supabase SQL Editor
-- =============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: plants
-- =============================================
-- Stores plant metadata synced from Planta API
-- Primary source: Planta API, updated nightly

CREATE TABLE IF NOT EXISTS plants (
  id TEXT PRIMARY KEY,                    -- Planta's unique plant ID
  "customName" TEXT,                      -- User-defined name (from Planta)
  "commonName" TEXT,                      -- Common plant name (from Planta)
  "scientificName" TEXT,                  -- Scientific name (from Planta)
  location TEXT,                          -- Where plant is located (from Planta)
  planta_image_updated_at TIMESTAMPTZ,    -- When Planta last updated the photo
  last_synced_at TIMESTAMPTZ,             -- When this plant was last synced
  created_at TIMESTAMPTZ DEFAULT NOW()    -- When record was created
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_plants_last_synced ON plants(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_plants_common_name ON plants("commonName");

-- =============================================
-- TABLE: photos
-- =============================================
-- Stores all plant photos with timeline history
-- Photos come from Planta API sync or manual uploads

CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "plantId" TEXT NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  url TEXT NOT NULL,                      -- Supabase Storage URL
  date TIMESTAMPTZ NOT NULL,              -- When photo was taken/updated
  source TEXT NOT NULL CHECK (source IN ('planta', 'manual_upload')),
  created_at TIMESTAMPTZ DEFAULT NOW()    -- When record was created in DB
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_photos_plant_id ON photos("plantId");
CREATE INDEX IF NOT EXISTS idx_photos_date ON photos(date DESC);
CREATE INDEX IF NOT EXISTS idx_photos_plant_date ON photos("plantId", date DESC);

-- =============================================
-- TABLE: tokens
-- =============================================
-- Stores Planta API authentication tokens
-- Should only ever have ONE row (enforced by trigger below)

CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure only one row exists in tokens table
CREATE OR REPLACE FUNCTION enforce_single_token_row()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM tokens) >= 1 AND TG_OP = 'INSERT' THEN
    RAISE EXCEPTION 'Only one row allowed in tokens table. Use UPDATE instead.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_token_row
  BEFORE INSERT ON tokens
  FOR EACH ROW
  EXECUTE FUNCTION enforce_single_token_row();

-- =============================================
-- TABLE: sync_logs
-- =============================================
-- Logs all sync job executions for monitoring and debugging

CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
  plants_checked INTEGER DEFAULT 0,
  photos_added INTEGER DEFAULT 0,
  errors JSONB,                           -- Array of error objects
  duration_ms INTEGER                     -- How long sync took
);

-- Index for monitoring recent syncs
CREATE INDEX IF NOT EXISTS idx_sync_logs_synced_at ON sync_logs(synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
-- Enable RLS on all tables
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Plants: Allow public read access
CREATE POLICY "Allow public read access to plants"
  ON plants FOR SELECT
  TO anon, authenticated
  USING (true);

-- Photos: Allow public read access
CREATE POLICY "Allow public read access to photos"
  ON photos FOR SELECT
  TO anon, authenticated
  USING (true);

-- Tokens: NO public access (only service role via API routes)
-- No policies needed - will be accessed via service role key only

-- Sync Logs: NO public access (only service role for monitoring)
-- No policies needed - will be accessed via service role key only

-- =============================================
-- INITIAL DATA (Optional)
-- =============================================
-- Insert placeholder token row (you'll update this after Planta auth)
-- This prevents the "no rows" error and can be updated via SQL or API

INSERT INTO tokens (access_token, refresh_token, expires_at)
VALUES (
  'PLACEHOLDER_ACCESS_TOKEN',
  'PLACEHOLDER_REFRESH_TOKEN',
  NOW() + INTERVAL '1 hour'
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these after migration to verify setup:

-- Check all tables exist:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public';

-- Check policies:
-- SELECT schemaname, tablename, policyname 
-- FROM pg_policies 
-- WHERE schemaname = 'public';

