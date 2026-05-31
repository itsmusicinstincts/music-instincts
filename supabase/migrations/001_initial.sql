-- Music Instincts — Phase 1 schema

create type genre_type as enum ('spiritual', 'filmy', 'semi_classical');
create type language_type as enum ('hindi', 'tamil', 'english', 'sanskrit');

create table songs (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  composer     text not null default 'Music Instincts',
  description  text,
  genre        genre_type not null,
  language     language_type not null,
  year         int,
  youtube_url       text,
  spotify_url       text,
  apple_music_url   text,
  soundcloud_url    text,
  video_embed_url   text,
  thumbnail_url     text,
  featured     boolean default false,
  status       text default 'published' check (status in ('published', 'draft')),
  created_at   timestamptz default now()
);

create table lyrics (
  id         uuid primary key default gen_random_uuid(),
  song_id    uuid references songs(id) on delete cascade,
  language   language_type not null,
  content    text not null,
  created_at timestamptz default now()
);

-- Full-text search index on lyrics
alter table lyrics add column search_vector tsvector
  generated always as (to_tsvector('english', content)) stored;
create index lyrics_search_idx on lyrics using gin(search_vector);

-- Full-text search index on songs
alter table songs add column search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(composer, ''))
  ) stored;
create index songs_search_idx on songs using gin(search_vector);

-- Waitlist table for Friends portal
create table waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

-- Seed songs
insert into songs (slug, title, composer, description, genre, language, youtube_url, video_embed_url, thumbnail_url, featured) values
  ('sharanam-tamil',       'Sharanam',         'Music Instincts', 'A heartfelt devotional composition in Tamil, seeking divine refuge.',                                   'spiritual',    'tamil',    'https://youtu.be/Gk_Cl9fks20',  'https://www.youtube.com/embed/Gk_Cl9fks20',  'https://img.youtube.com/vi/Gk_Cl9fks20/maxresdefault.jpg',  true),
  ('sharanam-hindi',       'Sharanam',         'Music Instincts', 'A devotional composition in Hindi, an offering of surrender and peace.',                               'spiritual',    'hindi',    'https://youtu.be/3qH6La5daLI',  'https://www.youtube.com/embed/3qH6La5daLI',  'https://img.youtube.com/vi/3qH6La5daLI/maxresdefault.jpg',  true),
  ('om-sanskrit',          'OM',               'Music Instincts', 'A meditative Sanskrit composition centred on the primordial sound of the universe.',                   'spiritual',    'sanskrit', 'https://youtu.be/JfRyM9vEOWg',  'https://www.youtube.com/embed/JfRyM9vEOWg',  'https://img.youtube.com/vi/JfRyM9vEOWg/maxresdefault.jpg',  true),
  ('thalapathi-tamil',     'Thalapathi',       'Music Instincts', 'A powerful Tamil film composition that captures the spirit of a legend.',                              'filmy',        'tamil',    'https://youtu.be/mcXB0G5Diq4',  'https://www.youtube.com/embed/mcXB0G5Diq4',  'https://img.youtube.com/vi/mcXB0G5Diq4/maxresdefault.jpg',  false),
  ('happy-pongal-bro-tamil','Happy Pongal Bro','Music Instincts', 'A joyful Tamil celebration song for the harvest festival of Pongal.',                                  'filmy',        'tamil',    'https://youtu.be/2-azyFgLFSA',  'https://www.youtube.com/embed/2-azyFgLFSA',  'https://img.youtube.com/vi/2-azyFgLFSA/maxresdefault.jpg',  false);
