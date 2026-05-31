import { supabase } from './supabase'
import {
  SONGS,
  getSongBySlug as staticGetSongBySlug,
  getSongsByGenre as staticGetSongsByGenre,
  getSongsByGenreAndLanguage as staticGetSongsByGenreAndLanguage,
  getFeaturedSongs as staticGetFeaturedSongs,
  searchSongs as staticSearchSongs,
} from './data'
import type { Song, Genre, Language } from './data'

function mapRow(row: Record<string, unknown>): Song {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    composer: (row.composer as string) ?? 'Music Instincts',
    description: (row.description as string) ?? '',
    genre: row.genre as Genre,
    language: row.language as Language,
    year: row.year as number | undefined,
    youtube_url: row.youtube_url as string | undefined,
    spotify_url: row.spotify_url as string | undefined,
    apple_music_url: row.apple_music_url as string | undefined,
    soundcloud_url: row.soundcloud_url as string | undefined,
    video_embed_url: row.video_embed_url as string | undefined,
    thumbnail_url: (row.thumbnail_url as string) ?? '',
    featured: (row.featured as boolean) ?? false,
    lyrics: row.lyrics as string | undefined,
  }
}

export async function getAllSongs(): Promise<Song[]> {
  if (!supabase) return SONGS
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  if (error || !data) return SONGS
  return data.map(mapRow)
}

export async function getSongBySlug(slug: string): Promise<Song | undefined> {
  if (!supabase) return staticGetSongBySlug(slug)
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error || !data) return staticGetSongBySlug(slug)
  return mapRow(data)
}

export async function getSongsByGenre(genre: Genre): Promise<Song[]> {
  if (!supabase) return staticGetSongsByGenre(genre)
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('genre', genre)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  if (error || !data) return staticGetSongsByGenre(genre)
  return data.map(mapRow)
}

export async function getSongsByGenreAndLanguage(genre: Genre, language: Language): Promise<Song[]> {
  if (!supabase) return staticGetSongsByGenreAndLanguage(genre, language)
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('genre', genre)
    .eq('language', language)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  if (error || !data) return staticGetSongsByGenreAndLanguage(genre, language)
  return data.map(mapRow)
}

export async function getFeaturedSongs(): Promise<Song[]> {
  if (!supabase) return staticGetFeaturedSongs()
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('featured', true)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  if (error || !data) return staticGetFeaturedSongs()
  return data.map(mapRow)
}

export async function searchSongs(query: string): Promise<Song[]> {
  if (!supabase) return staticSearchSongs(query)
  const q = query.trim()
  if (!q) return []
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('status', 'published')
    .or(`title.ilike.%${q}%,description.ilike.%${q}%,composer.ilike.%${q}%`)
    .order('created_at', { ascending: false })
  if (error || !data) return staticSearchSongs(query)
  return data.map(mapRow)
}
