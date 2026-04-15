-- Migration: Add artist slugs and initialize storage buckets
-- Date: 2024-04-15

-- 1. Add slug to members table
-- Slugs allow for user-friendly URLs like /members/hanako
ALTER TABLE members ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- index for performance on slug lookups
CREATE INDEX IF NOT EXISTS idx_members_slug ON members(slug);

-- 2. Initialize Storage Buckets
-- This fixes the "Bucket not found" error
-- Note: inserting directly into storage.buckets is the standard SQL way in Supabase
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('members', 'members', true),
  ('events', 'events', true),
  ('backgrounds', 'backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Policies (if not already set via UI)
-- Allow public read access to all buckets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id IN ('members', 'events', 'backgrounds') );

-- Allow authenticated users (Admin) to upload files
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK ( 
  bucket_id IN ('members', 'events', 'backgrounds') AND 
  auth.role() = 'authenticated' 
);

-- Allow authenticated users to delete their own uploads or anything in these buckets
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (
  bucket_id IN ('members', 'events', 'backgrounds') AND 
  auth.role() = 'authenticated'
);
