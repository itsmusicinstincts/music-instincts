export type Genre = 'spiritual' | 'filmy' | 'semi_classical'
export type Language = 'hindi' | 'tamil' | 'english' | 'sanskrit'

export interface Song {
  id: string
  slug: string
  title: string
  composer: string
  description: string
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

export const GENRE_LABELS: Record<Genre, string> = {
  spiritual: 'Spiritual',
  filmy: 'Filmy',
  semi_classical: 'Semi Classical / Ghazals',
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  hindi: 'Hindi',
  tamil: 'Tamil',
  english: 'English',
  sanskrit: 'Sanskrit',
}

export const GENRE_LANGUAGES: Record<Genre, Language[]> = {
  filmy: ['hindi', 'tamil', 'english'],
  spiritual: ['hindi', 'tamil', 'sanskrit'],
  semi_classical: ['hindi', 'tamil'],
}

function ytThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export const SONGS: Song[] = [
  {
    id: '1',
    slug: 'sharanam-tamil',
    title: 'Sharanam',
    composer: 'Music Instincts',
    description: 'A heartfelt devotional composition in Tamil, seeking divine refuge.',
    genre: 'spiritual',
    language: 'tamil',
    youtube_url: 'https://youtu.be/Gk_Cl9fks20',
    video_embed_url: 'https://www.youtube.com/embed/Gk_Cl9fks20',
    thumbnail_url: ytThumb('Gk_Cl9fks20'),
    featured: true,
  },
  {
    id: '2',
    slug: 'sharanam-hindi',
    title: 'Sharanam',
    composer: 'Music Instincts',
    description: 'A devotional composition in Hindi, an offering of surrender and peace.',
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
    genre: 'spiritual',
    language: 'sanskrit',
    youtube_url: 'https://youtu.be/JfRyM9vEOWg',
    video_embed_url: 'https://www.youtube.com/embed/JfRyM9vEOWg',
    thumbnail_url: ytThumb('JfRyM9vEOWg'),
    featured: true,
  },
  {
    id: '4',
    slug: 'thalapathi-tamil',
    title: 'Thalapathi',
    composer: 'Music Instincts',
    description: 'A powerful Tamil film composition that captures the spirit of a legend.',
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
    genre: 'filmy',
    language: 'tamil',
    youtube_url: 'https://youtu.be/2-azyFgLFSA',
    video_embed_url: 'https://www.youtube.com/embed/2-azyFgLFSA',
    thumbnail_url: ytThumb('2-azyFgLFSA'),
    featured: false,
  },
]

export function getSongBySlug(slug: string): Song | undefined {
  return SONGS.find((s) => s.slug === slug)
}

export function getSongsByGenre(genre: Genre): Song[] {
  return SONGS.filter((s) => s.genre === genre)
}

export function getSongsByGenreAndLanguage(genre: Genre, language: Language): Song[] {
  return SONGS.filter((s) => s.genre === genre && s.language === language)
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
