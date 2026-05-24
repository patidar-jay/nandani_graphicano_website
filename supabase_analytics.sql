-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- If you already created the table before, run the ALTER statements at the bottom instead.

-- ═══════════════════════════════════════
-- OPTION 1: FRESH INSTALL (first time)
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS page_analytics (
    id BIGSERIAL PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    device TEXT DEFAULT 'desktop',
    browser TEXT DEFAULT 'unknown',
    is_returning BOOLEAN DEFAULT false,
    session_duration INTEGER DEFAULT 0,
    sections_viewed JSONB DEFAULT '{}',
    page_path TEXT DEFAULT '/',
    screen_width INTEGER DEFAULT 0,
    country TEXT DEFAULT 'Unknown',
    region TEXT DEFAULT 'Unknown',
    city TEXT DEFAULT 'Unknown'
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_analytics_created ON page_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON page_analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_country ON page_analytics(country);
CREATE INDEX IF NOT EXISTS idx_analytics_city ON page_analytics(city);

-- Enable RLS
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (visitors)
CREATE POLICY "Allow anonymous inserts" ON page_analytics
    FOR INSERT WITH CHECK (true);

-- Allow anyone to SELECT (admin dashboard)
CREATE POLICY "Allow authenticated reads" ON page_analytics
    FOR SELECT USING (true);


-- ═══════════════════════════════════════
-- OPTION 2: UPGRADE (if table exists already)
-- Run these if you already created the table before
-- ═══════════════════════════════════════
-- ALTER TABLE page_analytics ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'Unknown';
-- ALTER TABLE page_analytics ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Unknown';
-- CREATE INDEX IF NOT EXISTS idx_analytics_country ON page_analytics(country);
-- CREATE INDEX IF NOT EXISTS idx_analytics_city ON page_analytics(city);
