# Music Instincts

Website for [musicinstincts.com](https://musicinstincts.com) — original compositions spanning Spiritual, Filmy, and Semi Classical genres across Hindi, Tamil, Sanskrit and English.

## Quick Start

### 1. Install Node.js

Download and install from [nodejs.org](https://nodejs.org) (choose the LTS version).

### 2. Install dependencies

Open Terminal, navigate to this folder, and run:

```bash
cd ~/Documents/music-instincts
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Adding New Songs (No Coding Required)

### Option A — Edit the data file directly

Open `src/lib/data.ts` and add a new entry to the `SONGS` array. Copy an existing song object and update the fields:

- `slug` — URL-friendly unique ID (e.g. `my-new-song-tamil`)
- `title` — Song name
- `genre` — `spiritual` | `filmy` | `semi_classical`
- `language` — `hindi` | `tamil` | `english` | `sanskrit`
- `youtube_url` — Full YouTube URL (e.g. `https://youtu.be/VIDEOID`)
- `video_embed_url` — `https://www.youtube.com/embed/VIDEOID` (replace VIDEOID)
- `thumbnail_url` — `https://img.youtube.com/vi/VIDEOID/maxresdefault.jpg`
- `featured` — `true` to show on home page, `false` otherwise

### Option B — Use Supabase (recommended for many songs)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run `supabase/migrations/001_initial.sql` in the SQL editor
4. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL and anon key
5. Add songs directly in the Supabase table editor (looks like a spreadsheet)

---

## Deploying to Vercel

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add environment variables (if using Supabase):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy — your site will be live in ~2 minutes

### Connecting musicinstincts.com

In Vercel → Project → Settings → Domains:
1. Add `musicinstincts.com`
2. Vercel will show you two DNS records to add (A record + CNAME)
3. Log into your domain registrar and add those records
4. DNS propagates in 5–60 minutes — site is live at musicinstincts.com

---

## Project Structure

```
src/
  app/
    page.tsx              ← Home page
    library/page.tsx      ← Browse all compositions
    [genre]/page.tsx      ← Genre page (e.g. /spiritual)
    [genre]/[language]/   ← Genre + Language (e.g. /spiritual/tamil)
    song/[slug]/page.tsx  ← Song detail page
    search/page.tsx       ← Search by title or lyrics
    friends/page.tsx      ← Friends of Music Instincts teaser
  components/
    Header.tsx
    Footer.tsx
    SongCard.tsx
    VideoEmbed.tsx
    StreamingLinks.tsx
  lib/
    data.ts               ← All song data (edit this to add songs)
    supabase.ts           ← Supabase client (optional)
supabase/
  migrations/001_initial.sql  ← Database schema
```
