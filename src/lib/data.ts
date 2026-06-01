export type Category = 'original_compositions' | 'video_edits'
export type Genre = 'filmy' | 'spiritual' | 'semi_classical' | 'original' | 'bollywood_recreated'
// Language stored in DB — 'hindi' | 'tamil' | anything else is grouped as 'Other'
export type Language = string

export interface Song {
  id: string
  slug: string
  title: string
  composer: string
  description: string
  category: Category
  genre: Genre
  language: Language
  year?: number
  youtube_url?: string
  spotify_url?: string
  apple_music_url?: string
  soundcloud_url?: string
  video_embed_url?: string
  thumbnail_url: string
  featured: boolean
  lyrics?: string
}

// ─── Labels ───────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<Category, string> = {
  original_compositions: 'Original Compositions',
  video_edits: 'Video Edits',
}

export const GENRE_LABELS: Record<Genre, string> = {
  filmy: 'Filmy',
  spiritual: 'Spiritual',
  semi_classical: 'Semi Classical / Ghazals',
  original: 'Original',
  bollywood_recreated: 'Bollywood Recreated',
}

export const LANGUAGE_LABELS: Record<string, string> = {
  hindi: 'Hindi',
  tamil: 'Tamil',
  english: 'English',
  sanskrit: 'Sanskrit',
  telugu: 'Telugu',
  malayalam: 'Malayalam',
  kannada: 'Kannada',
  punjabi: 'Punjabi',
  other: 'Other',
}

export function getLanguageLabel(language: Language): string {
  return LANGUAGE_LABELS[language.toLowerCase()] ?? language
}

// ─── Taxonomy ─────────────────────────────────────────────────────────────────

export const CATEGORY_GENRES: Record<Category, Genre[]> = {
  original_compositions: ['filmy', 'spiritual', 'semi_classical'],
  video_edits: ['original', 'bollywood_recreated'],
}

// Display language groups — Hindi, Tamil, Other (catch-all)
export const DISPLAY_LANGUAGE_GROUPS = ['hindi', 'tamil', 'other'] as const
export type DisplayLanguageGroup = typeof DISPLAY_LANGUAGE_GROUPS[number]

export const DISPLAY_LANGUAGE_LABELS: Record<DisplayLanguageGroup, string> = {
  hindi: 'Hindi',
  tamil: 'Tamil',
  other: 'Other',
}

export function getDisplayGroup(language: Language): DisplayLanguageGroup {
  const l = language.toLowerCase()
  if (l === 'hindi') return 'hindi'
  if (l === 'tamil') return 'tamil'
  return 'other'
}

// ─── URL slug helpers ─────────────────────────────────────────────────────────

export function toSlug(value: string): string {
  return value.replace(/_/g, '-')
}

export function fromSlug(slug: string): string {
  return slug.replace(/-/g, '_')
}

export const VALID_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]
export const VALID_GENRES = Object.keys(GENRE_LABELS) as Genre[]

// ─── Seed data ────────────────────────────────────────────────────────────────

// maxresdefault (1280×720) only exists for videos uploaded at 1080p+.
// hqdefault (480×360) is always available for any public video.
function ytThumb(videoId: string, quality: 'maxres' | 'hq' = 'hq') {
  const file = quality === 'maxres' ? 'maxresdefault.jpg' : 'hqdefault.jpg'
  return `https://img.youtube.com/vi/${videoId}/${file}`
}

export const SONGS: Song[] = [
  {
    id: '1',
    slug: 'sharanam-tamil',
    title: 'Sharanam',
    composer: 'Music Instincts',
    description: 'A heartfelt devotional composition in Tamil, seeking divine refuge.',
    category: 'original_compositions',
    genre: 'spiritual',
    language: 'tamil',
    youtube_url: 'https://youtu.be/Gk_Cl9fks20',
    video_embed_url: 'https://www.youtube.com/embed/Gk_Cl9fks20',
    thumbnail_url: ytThumb('Gk_Cl9fks20', 'maxres'),
    featured: true,
  },
  {
    id: '2',
    slug: 'sharanam-hindi',
    title: 'Sharanam',
    composer: 'Music Instincts',
    description: 'A devotional composition in Hindi, an offering of surrender and peace.',
    category: 'original_compositions',
    genre: 'spiritual',
    language: 'hindi',
    youtube_url: 'https://youtu.be/3qH6La5daLI',
    video_embed_url: 'https://www.youtube.com/embed/3qH6La5daLI',
    thumbnail_url: ytThumb('3qH6La5daLI'),
    featured: true,
  },
  {
    id: '3',
    slug: 'om-sanskrit',
    title: 'OM',
    composer: 'Music Instincts',
    description: 'A meditative Sanskrit composition centred on the primordial sound of the universe.',
    category: 'original_compositions',
    genre: 'spiritual',
    language: 'sanskrit',
    youtube_url: 'https://youtu.be/JfRyM9vEOWg',
    video_embed_url: 'https://www.youtube.com/embed/JfRyM9vEOWg',
    thumbnail_url: ytThumb('JfRyM9vEOWg', 'maxres'),
    featured: true,
  },
  {
    id: '4',
    slug: 'thalapathi-tamil',
    title: 'Thalapathi',
    composer: 'Music Instincts',
    description: 'A powerful Tamil film composition that captures the spirit of a legend.',
    category: 'original_compositions',
    genre: 'filmy',
    language: 'tamil',
    youtube_url: 'https://youtu.be/mcXB0G5Diq4',
    video_embed_url: 'https://www.youtube.com/embed/mcXB0G5Diq4',
    thumbnail_url: ytThumb('mcXB0G5Diq4'),
    featured: false,
  },
  {
    id: '5',
    slug: 'happy-pongal-bro-tamil',
    title: 'Happy Pongal Bro',
    composer: 'Music Instincts',
    description: 'A joyful Tamil celebration song for the harvest festival of Pongal.',
    category: 'original_compositions',
    genre: 'filmy',
    language: 'tamil',
    youtube_url: 'https://youtu.be/2-azyFgLFSA',
    video_embed_url: 'https://www.youtube.com/embed/2-azyFgLFSA',
    thumbnail_url: ytThumb('2-azyFgLFSA', 'maxres'),
    featured: false,
  },
]

// ─── Query helpers ────────────────────────────────────────────────────────────

export function getSongBySlug(slug: string): Song | undefined {
  return SONGS.find((s) => s.slug === slug)
}

export function getSongsByCategory(category: Category): Song[] {
  return SONGS.filter((s) => s.category === category)
}

export function getSongsByGenre(genre: Genre): Song[] {
  return SONGS.filter((s) => s.genre === genre)
}

export function getSongsByCategoryAndGenre(category: Category, genre: Genre): Song[] {
  return SONGS.filter((s) => s.category === category && s.genre === genre)
}

export function getSongsByCategoryGenreAndLanguageGroup(
  category: Category,
  genre: Genre,
  group: DisplayLanguageGroup
): Song[] {
  return SONGS.filter((s) => {
    if (s.category !== category || s.genre !== genre) return false
    return getDisplayGroup(s.language) === group
  })
}

export function getFeaturedSongs(): Song[] {
  return SONGS.filter((s) => s.featured)
}

export function searchSongs(query: string): Song[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return SONGS.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.composer.toLowerCase().includes(q) ||
      (s.lyrics && s.lyrics.toLowerCase().includes(q))
  )
}
