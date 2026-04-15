-- Migration: Enhanced Controls for Item and Page Visibility
-- Date: 2024-04-15

-- 1. Add is_public to items
ALTER TABLE IF EXISTS members ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- 2. Create site_settings table (Single row)
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    show_about BOOLEAN DEFAULT true,
    show_members BOOLEAN DEFAULT true,
    show_events BOOLEAN DEFAULT true,
    show_contact BOOLEAN DEFAULT true,
    show_privacy BOOLEAN DEFAULT true,
    show_terms BOOLEAN DEFAULT true,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Seed initial settings
INSERT INTO site_settings (id, show_about, show_members, show_events, show_contact)
VALUES (1, true, true, true, true)
ON CONFLICT (id) DO NOTHING;

-- RLS for site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
