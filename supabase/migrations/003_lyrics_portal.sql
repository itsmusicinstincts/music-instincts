-- ============================================================
-- Migration 003: Lyric-song relationship + portal support
-- Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- 1. Drop the old one-way link (song_id on lyrics was v1 thinking)
ALTER TABLE lyrics DROP COLUMN IF EXISTS song_id;

-- 2. Enhance the lyrics table with portal fields
ALTER TABLE lyrics
  ADD COLUMN IF NOT EXISTS title        text,
  ADD COLUMN IF NOT EXISTS author_name  text,
  ADD COLUMN IF NOT EXISTS lyricist_id  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS agreed_to_showcase boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS status       text NOT NULL DEFAULT 'approved'
    CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected'));

-- Remove the old language enum constraint, allow free text language
ALTER TABLE lyrics DROP COLUMN IF EXISTS language;
ALTER TABLE lyrics ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'hindi';

-- 3. Add lyric_id and version_label to songs (the new direction of the relationship)
ALTER TABLE songs
  ADD COLUMN IF NOT EXISTS lyric_id      uuid REFERENCES lyrics(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS version_label text;

-- 4. Seed: link the two Sharanam songs to the same lyric (creates a shared lyric record)
DO $$
DECLARE
  sharanam_lyric_id uuid;
BEGIN
  -- Create the shared Sharanam lyric
  INSERT INTO lyrics (title, language, content, agreed_to_showcase, status)
  VALUES ('Sharanam', 'hindi', '(Lyrics to be added via the Portal)', true, 'approved')
  RETURNING id INTO sharanam_lyric_id;

  -- Link both Sharanam songs to it
  UPDATE songs SET lyric_id = sharanam_lyric_id, version_label = 'Hindi Version'
    WHERE slug = 'sharanam-hindi';
  UPDATE songs SET lyric_id = sharanam_lyric_id, version_label = 'Tamil Original'
    WHERE slug = 'sharanam-tamil';
END $$;

-- 5. Enable Row Level Security so lyricists only see their own drafts
ALTER TABLE lyrics ENABLE ROW LEVEL SECURITY;

-- Public can read approved lyrics
CREATE POLICY IF NOT EXISTS "public_read_approved_lyrics"
  ON lyrics FOR SELECT
  USING (status = 'approved');

-- Authenticated users can insert (for lyricists submitting)
CREATE POLICY IF NOT EXISTS "auth_insert_lyrics"
  ON lyrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Owners can update their own lyrics
CREATE POLICY IF NOT EXISTS "auth_update_own_lyrics"
  ON lyrics FOR UPDATE
  TO authenticated
  USING (lyricist_id = auth.uid() OR lyricist_id IS NULL);

-- 6. Rebuild search vector on songs to include version_label
UPDATE songs
SET search_vector = to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(composer, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(language, '') || ' ' ||
      coalesce(version_label, ''));

-- ============================================================
-- HOW TO USE
-- ============================================================
-- After running this migration:
--
-- 1. Go to https://music-instincts.vercel.app/portal
-- 2. Click "Create an account" with your email + password
-- 3. Your first login is automatically the admin
-- 4. From the Dashboard, click "Add Lyrics" next to any song
-- 5. Paste the lyrics, agree to showcase, and save
--
-- To link Remixes / Versions:
--   - First add lyrics to the original song (creates a lyric record)
--   - Then go to the remix/other-version song → Add Lyrics
--   - Choose "Link Existing" tab → select the original lyric
--   - Both songs now show each other under the "Versions" tab
-- ============================================================
