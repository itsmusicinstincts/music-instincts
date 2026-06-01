-- ============================================================
-- Migration 002: Category structure + language/genre expansion
-- Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- 1. Add new genre values (safe – IF NOT EXISTS prevents errors on re-run)
DO $$ BEGIN
  ALTER TYPE genre_type ADD VALUE IF NOT EXISTS 'original';
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TYPE genre_type ADD VALUE IF NOT EXISTS 'bollywood_recreated';
EXCEPTION WHEN others THEN NULL; END $$;

-- 2. Create category enum
DO $$ BEGIN
  CREATE TYPE category_type AS ENUM ('original_compositions', 'video_edits');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Add category column (defaults to original_compositions for existing rows)
ALTER TABLE songs
  ADD COLUMN IF NOT EXISTS category category_type NOT NULL DEFAULT 'original_compositions';

-- 4. Migrate existing songs – all current songs are Original Compositions
UPDATE songs SET category = 'original_compositions';

-- 5. Fix the OM song: language stays 'sanskrit', category = original_compositions, genre = spiritual
--    (already correct; just confirm)
UPDATE songs
SET genre    = 'spiritual',
    language = 'sanskrit',
    category = 'original_compositions'
WHERE slug = 'om-sanskrit';

-- 6. Rebuild full-text search vector to pick up any new fields
UPDATE songs
SET search_vector = to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(composer, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(language, ''));

-- ============================================================
-- HOW TO ADD VIDEO EDITS in the future (no code changes needed)
-- ============================================================
-- In Supabase Table Editor, set:
--   category = 'video_edits'
--   genre    = 'original'            OR  'bollywood_recreated'
--   language = 'hindi' | 'tamil' | 'sanskrit' | 'english' | ...
--
-- The site will automatically group any non-hindi / non-tamil
-- language under the "Other" tab, showing its real label.
-- ============================================================
