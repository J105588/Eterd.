-- Migration: Enhanced Schema for Members and Events
-- Description: Adds social links, event descriptions, and storage bucket documentation.

-- 1. Update Members Table
ALTER TABLE members ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS niconico_url TEXT;

-- 2. Update Events Table
ALTER TABLE events ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- 3. Storage Buckets Documentation
-- Note: These must be created in the Supabase Dashboard > Storage.
-- Be sure to set them to "Public" and enable appropriate RLS policies.
-- Required Buckets:
--   - 'members': For talent profile images
--   - 'events': For flyer and event images
--   - 'backgrounds': For high-quality site wallpapers

-- Example RLS Policy for Public Read Access (Run this for each bucket if needed):
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'members');
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'events');
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'backgrounds');
