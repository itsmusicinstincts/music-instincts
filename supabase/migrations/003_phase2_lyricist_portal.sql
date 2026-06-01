-- ============================================================
-- Migration 003: Phase 2 — Lyricist portal + lyric versioning
-- Run in Supabase → SQL Editor → New Query
-- ============================================================

-- 1. Lyricist profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS lyricist_profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name   TEXT NOT NULL,
  bio            TEXT,
  website        TEXT,
  agreed_to_terms BOOLEAN DEFAULT FALSE,
  role           TEXT DEFAULT 'lyricist' CHECK (role IN ('lyricist', 'admin')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Expand songs table: versioning support
ALTER TABLE songs
  ADD COLUMN IF NOT EXISTS lyric_group_id UUID,       -- shared across versions
  ADD COLUMN IF NOT EXISTS version_label  TEXT;       -- e.g. 'Hindi Original', 'Tamil Version'

-- Link the two Sharanam versions together
DO $$
DECLARE grp UUID := gen_random_uuid();
BEGIN
  UPDATE songs SET lyric_group_id = grp, version_label = 'Hindi Original'
    WHERE slug = 'sharanam-hindi';
  UPDATE songs SET lyric_group_id = grp, version_label = 'Tamil Version'
    WHERE slug = 'sharanam-tamil';
END $$;

-- 3. Expand lyrics table: add submission metadata
ALTER TABLE lyrics
  ADD COLUMN IF NOT EXISTS title           TEXT,
  ADD COLUMN IF NOT EXISTS lyricist_id     UUID REFERENCES lyricist_profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status          TEXT DEFAULT 'approved'
                                           CHECK (status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS copyright_agreed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS admin_notes     TEXT,
  ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMPTZ DEFAULT NOW();

-- Drop old language_type constraint if it exists (language is now free text)
ALTER TABLE lyrics ALTER COLUMN language TYPE TEXT;

-- 4. Row Level Security

-- lyricist_profiles: anyone can read, owner can update their own
ALTER TABLE lyricist_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable" ON lyricist_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON lyricist_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON lyricist_profiles
  FOR UPDATE USING (auth.uid() = id);

-- lyrics: published lyrics readable by all, pending only by author + admin
ALTER TABLE lyrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved lyrics are public" ON lyrics
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Lyricists can see own submissions" ON lyrics
  FOR SELECT USING (auth.uid() = lyricist_id);

CREATE POLICY "Lyricists can insert" ON lyrics
  FOR INSERT WITH CHECK (auth.uid() = lyricist_id AND copyright_agreed = true);

CREATE POLICY "Lyricists can update own pending lyrics" ON lyrics
  FOR UPDATE USING (auth.uid() = lyricist_id AND status = 'pending');

-- Admin policy: service role bypasses RLS automatically.
-- To grant a specific user admin access, set their role in lyricist_profiles:
--   UPDATE lyricist_profiles SET role = 'admin' WHERE id = '<your-user-id>';

-- 5. Function: auto-update updated_at on lyrics change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lyrics_updated_at
  BEFORE UPDATE ON lyrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AFTER RUNNING: make yourself admin
-- 1. Sign up at /friends/signup with your email
-- 2. Run: UPDATE lyricist_profiles SET role = 'admin' WHERE id = auth.uid();
--    OR find your user ID in Authentication → Users and run:
--    UPDATE lyricist_profiles SET role = 'admin' WHERE id = '<your-uuid>';
-- ============================================================
