-- Add external_links column to events table to support multiple dynamic links
ALTER TABLE events ADD COLUMN external_links JSONB DEFAULT '[]'::jsonb;

-- Optional: You can also keep the old columns for now to avoid breaking existing data, 
-- or you can migrate them with a script like this (run manually if needed):
-- UPDATE events SET external_links = jsonb_build_array(
--   CASE WHEN ticket_link IS NOT NULL THEN jsonb_build_object('type', 'Ticket', 'url', ticket_link) ELSE NULL END,
--   CASE WHEN google_form_link IS NOT NULL THEN jsonb_build_object('type', 'Google Form', 'url', google_form_link) ELSE NULL END,
--   CASE WHEN youtube_url IS NOT NULL THEN jsonb_build_object('type', 'YouTube', 'url', youtube_url) ELSE NULL END
-- ) - NULL;
