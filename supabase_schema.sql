-- Enable RLS
-- Members table
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  profile_text TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  external_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  venue TEXT,
  ticket_link TEXT,
  google_form_link TEXT,
  youtube_url TEXT,
  external_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can read
CREATE POLICY "Allow public read-only access for members" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for events" ON events FOR SELECT USING (true);

-- Policies: Only authenticated users (Admin) can insert/update/delete
CREATE POLICY "Allow admin all access for members" ON members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all access for events" ON events FOR ALL USING (auth.role() = 'authenticated');

-- Storage buckets (You need to create these manually in Supabase UI or use API)
-- Bucket: backgrounds (public)
-- Bucket: members (public)
