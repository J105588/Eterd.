-- Migration to migrate legacy social links to the new external_links JSONB column and then drop the old columns

-- 1. Migrate existing data from old columns to external_links for any members that haven't been migrated yet
UPDATE members 
SET external_links = (
  SELECT jsonb_agg(elem)
  FROM (
    -- Keep any existing dynamic links
    SELECT jsonb_array_elements(COALESCE(external_links, '[]'::jsonb)) as elem
    UNION ALL
    -- Append legacy links if they exist and aren't empty
    SELECT jsonb_build_object('type', 'X', 'url', twitter_url) WHERE twitter_url IS NOT NULL AND twitter_url != ''
    UNION ALL
    SELECT jsonb_build_object('type', 'Instagram', 'url', instagram_url) WHERE instagram_url IS NOT NULL AND instagram_url != ''
    UNION ALL
    SELECT jsonb_build_object('type', 'YouTube', 'url', youtube_url) WHERE youtube_url IS NOT NULL AND youtube_url != ''
    UNION ALL
    SELECT jsonb_build_object('type', 'niconico', 'url', niconico_url) WHERE niconico_url IS NOT NULL AND niconico_url != ''
  ) s
)
WHERE 
  twitter_url IS NOT NULL AND twitter_url != '' OR 
  instagram_url IS NOT NULL AND instagram_url != '' OR 
  youtube_url IS NOT NULL AND youtube_url != '' OR 
  niconico_url IS NOT NULL AND niconico_url != '';

-- 2. Drop the old columns now that data has been moved
ALTER TABLE members 
DROP COLUMN IF EXISTS twitter_url,
DROP COLUMN IF EXISTS instagram_url,
DROP COLUMN IF EXISTS niconico_url,
DROP COLUMN IF EXISTS youtube_url;
