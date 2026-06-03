-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 004: Mood tags & lyric versioning
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add mood_tags column (array of text, e.g. ['romantic', 'sufi'])
ALTER TABLE lyrics
  ADD COLUMN IF NOT EXISTS mood_tags text[] DEFAULT '{}';

-- 2. Versioning: lyric_group_id links all versions of the same lyric together
--    The first version has lyric_group_id = its own id.
--    New versions share the same lyric_group_id.
ALTER TABLE lyrics
  ADD COLUMN IF NOT EXISTS lyric_group_id uuid REFERENCES lyrics(id) ON DELETE SET NULL;

-- 3. Human-readable version name chosen by the author (e.g. "Draft 1", "Final")
ALTER TABLE lyrics
  ADD COLUMN IF NOT EXISTS version_name text DEFAULT 'Draft';

-- 4. Auto-incrementing version number within the group (set by application code)
ALTER TABLE lyrics
  ADD COLUMN IF NOT EXISTS version_number int DEFAULT 1;

-- 5. updated_at for tracking last edits
ALTER TABLE lyrics
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Trigger to keep updated_at fresh on every update
CREATE OR REPLACE FUNCTION update_lyrics_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lyrics_updated_at ON lyrics;
CREATE TRIGGER lyrics_updated_at
  BEFORE UPDATE ON lyrics
  FOR EACH ROW EXECUTE FUNCTION update_lyrics_updated_at();

-- 6. Index for efficient version group lookups
CREATE INDEX IF NOT EXISTS idx_lyrics_lyric_group_id ON lyrics(lyric_group_id);

-- 7. Index for mood tag filtering (GIN on array column)
CREATE INDEX IF NOT EXISTS idx_lyrics_mood_tags ON lyrics USING GIN(mood_tags);

-- 8. Back-fill: for existing lyrics that have no lyric_group_id, set it to their own id
UPDATE lyrics SET lyric_group_id = id WHERE lyric_group_id IS NULL;
