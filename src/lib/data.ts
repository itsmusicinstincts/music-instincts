export type Category = 'original_compositions' | 'video_edits'
export type Genre = 'filmy' | 'spiritual' | 'semi_classical' | 'original' | 'bollywood_recreated'
export type Language = string

export interface Lyric {
  id: string
  title?: string
  content: string
  language: Language
  author_name?: string
  lyricist_id?: string
  agreed_to_showcase: boolean
  status: 'draft' | 'pending_review' | 'approved' | 'rejected'
  // mood / genre tags — stored as array, displayed as #hashtags
  mood_tags?: string[]
  // versioning — all versions of the same lyric share a lyric_group_id
  lyric_group_id?: string
  version_name?: string   // e.g. "Draft 1", "Final", "Hindi Version"
  version_number?: number
  created_at?: string
  updated_at?: string
}

// ─── Mood tag definitions ─────────────────────────────────────────────────────

export interface MoodTag {
  id: string
  label: string
  color: string          // accent hex (for dynamic styling)
  bg: string             // translucent fill
  prompt: string         // writing-pad placeholder guidance
  inspiration: string    // example couplet shown in the pad
}

export const MOOD_TAGS: MoodTag[] = [
  {
    id: 'romantic',
    label: 'Romantic',
    color: '#d4617a',
    bg: 'rgba(212,97,122,0.12)',
    prompt: 'Weave love, longing, and tender feelings into every line…',
    inspiration: '"Tere bina zindagi se koi shikwa to nahin, tere bina zindagi bhi lekin zindagi to nahin"',
  },
  {
    id: 'sad',
    label: 'Sad',
    color: '#5b8db8',
    bg: 'rgba(91,141,184,0.12)',
    prompt: 'Give voice to grief, loss, and the things left unsaid…',
    inspiration: '"Dil hi to hai, na sang-o-khisht, dard se bhar na aaye kyun"',
  },
  {
    id: 'happy',
    label: 'Happy',
    color: '#c49b0a',
    bg: 'rgba(196,155,10,0.12)',
    prompt: 'Celebrate joy, laughter, and all the bright moments…',
    inspiration: '"Aaj mere yaar ki shaadi hai, dil mein ujaala aaya hai"',
  },
  {
    id: 'uplifting',
    label: 'Uplifting',
    color: '#4a9b5f',
    bg: 'rgba(74,155,95,0.12)',
    prompt: 'Inspire with hope, courage, and the strength to rise again…',
    inspiration: '"Kar har maidan fateh, jo bhi ho mushkil raah"',
  },
  {
    id: 'sufi',
    label: 'Sufi',
    color: '#8b5bbf',
    bg: 'rgba(139,91,191,0.12)',
    prompt: 'Explore divine love, mysticism, and the longing of the soul…',
    inspiration: '"Maula mere maula, dil ka diya jalao — is andheri raat mein"',
  },
  {
    id: 'fast',
    label: 'Fast',
    color: '#c06030',
    bg: 'rgba(192,96,48,0.12)',
    prompt: 'Punchy, rapid-fire lines — every word earns its place…',
    inspiration: '"Bhaag bhaag DK Bose, DK Bose, DK Bose"',
  },
  {
    id: 'dance',
    label: 'Dance',
    color: '#b0306a',
    bg: 'rgba(176,48,106,0.12)',
    prompt: 'Rhythmic, energetic words made for movement and celebration…',
    inspiration: '"Tune maari entriyaan, dil mein baji ghantiyaan"',
  },
  {
    id: 'rain',
    label: 'Rain',
    color: '#3a7aaa',
    bg: 'rgba(58,122,170,0.12)',
    prompt: 'Capture the romance and melancholy of rainfall…',
    inspiration: '"Rimjhim gire saawan, sulag sulag jaaye man"',
  },
]

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
  // lyric association
  lyric_id?: string
  version_label?: string   // e.g. "Hindi Original", "Tamil Version"
  // streaming
  youtube_url?: string
  spotify_url?: string
  apple_music_url?: string
  soundcloud_url?: string
  video_embed_url?: string
  thumbnail_url: string
  featured: boolean
  status?: 'published' | 'draft'
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
}

export function getLanguageLabel(language: Language): string {
  return LANGUAGE_LABELS[language?.toLowerCase()] ?? language ?? 'Unknown'
}

// ─── Taxonomy ─────────────────────────────────────────────────────────────────

export const CATEGORY_GENRES: Record<Category, Genre[]> = {
  original_compositions: ['filmy', 'spiritual', 'semi_classical'],
  video_edits: ['original', 'bollywood_recreated'],
}

export const DISPLAY_LANGUAGE_GROUPS = ['hindi', 'tamil', 'other'] as const
export type DisplayLanguageGroup = typeof DISPLAY_LANGUAGE_GROUPS[number]

export const DISPLAY_LANGUAGE_LABELS: Record<DisplayLanguageGroup, string> = {
  hindi: 'Hindi',
  tamil: 'Tamil',
  other: 'Other',
}

export function getDisplayGroup(language: Language): DisplayLanguageGroup {
  const l = language?.toLowerCase() ?? ''
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

function ytThumb(videoId: string, quality: 'maxres' | 'hq' = 'hq') {
  const file = quality === 'maxres' ? 'maxresdefault.jpg' : 'hqdefault.jpg'
  return `https://img.youtube.com/vi/${videoId}/${file}`
}

// Shared lyric IDs so Sharanam versions are linked
const SHARANAM_LYRIC_ID = 'static-lyric-sharanam'

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
    lyric_id: SHARANAM_LYRIC_ID,
    version_label: 'Tamil Original',
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
    lyric_id: SHARANAM_LYRIC_ID,
    version_label: 'Hindi Version',
    youtube_url: 'https://youtu.be/3qH6La5daLI',
    video_embed_url: 'https://www.youtube.com/embed/3qH6La5daLI',
    thumbnail_url: ytThumb('3qH6La5daLI', 'hq'),
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
    thumbnail_url: ytThumb('mcXB0G5Diq4', 'hq'),
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

// Static fallback lyrics (empty — use portal or Supabase to add real content)
export const LYRICS: Lyric[] = []

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
  category: Category, genre: Genre, group: DisplayLanguageGroup
): Song[] {
  return SONGS.filter((s) => {
    if (s.category !== category || s.genre !== genre) return false
    return getDisplayGroup(s.language) === group
  })
}

export function getOtherVersions(lyricId: string, currentSongId: string): Song[] {
  return SONGS.filter((s) => s.lyric_id === lyricId && s.id !== currentSongId)
}

export function getLyricsById(lyricId: string): Lyric | undefined {
  return LYRICS.find((l) => l.id === lyricId)
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
      s.composer.toLowerCase().includes(q)
  )
}
