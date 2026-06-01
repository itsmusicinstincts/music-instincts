import { supabase } from './supabase'
import {
  SONGS,
  getSongBySlug as staticGetBySlug,
  getFeaturedSongs as staticGetFeatured,
  getSongsByCategory as staticGetByCategory,
  getSongsByCategoryAndGenre as staticGetByCategoryAndGenre,
  getSongsByCategoryGenreAndLanguageGroup as staticGetByCategoryGenreAndGroup,
  searchSongs as staticSearch,
  getDisplayGroup,
} from './data'
import type { Song, Category, Genre, DisplayLanguageGroup } from './data'

function mapRow(row: Record<string, unknown>): Song {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    composer: (row.composer as string) ?? 'Music Instincts',
    description: (row.description as string) ?? '',
    category: (row.category as Category) ?? 'original_compositions',
    genre: row.genre as Genre,
    language: row.language as string,
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
    .from('songs').select('*').eq('status', 'published').order('created_at', { ascending: false })
  if (error || !data) return SONGS
  return data.map(mapRow)
}

export async function getSongBySlug(slug: string): Promise<Song | undefined> {
  if (!supabase) return staticGetBySlug(slug)
  const { data, error } = await supabase
    .from('songs').select('*').eq('slug', slug).eq('status', 'published').single()
  if (error || !data) return staticGetBySlug(slug)
  return mapRow(data)
}

export async function getFeaturedSongs(): Promise<Song[]> {
  if (!supabase) return staticGetFeatured()
  const { data, error } = await supabase
    .from('songs').select('*').eq('featured', true).eq('status', 'published').order('created_at', { ascending: false })
  if (error || !data) return staticGetFeatured()
  return data.map(mapRow)
}

export async function getSongsByCategory(category: Category): Promise<Song[]> {
  if (!supabase) return staticGetByCategory(category)
  const { data, error } = await supabase
    .from('songs').select('*').eq('category', category).eq('status', 'published').order('created_at', { ascending: false })
  if (error || !data) return staticGetByCategory(category)
  return data.map(mapRow)
}

export async function getSongsByCategoryAndGenre(category: Category, genre: Genre): Promise<Song[]> {
  if (!supabase) return staticGetByCategoryAndGenre(category, genre)
  const { data, error } = await supabase
    .from('songs').select('*').eq('category', category).eq('genre', genre).eq('status', 'published').order('created_at', { ascending: false })
  if (error || !data) return staticGetByCategoryAndGenre(category, genre)
  return data.map(mapRow)
}

export async function getSongsByCategoryGenreAndLanguageGroup(
  category: Category, genre: Genre, group: DisplayLanguageGroup
): Promise<Song[]> {
  if (!supabase) return staticGetByCategoryGenreAndGroup(category, genre, group)
  let query = supabase.from('songs').select('*').eq('category', category).eq('genre', genre).eq('status', 'published')
  if (group === 'hindi') {
    query = query.eq('language', 'hindi')
  } else if (group === 'tamil') {
    query = query.eq('language', 'tamil')
  } else {
    query = query.not('language', 'in', '(hindi,tamil)')
  }
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error || !data) return staticGetByCategoryGenreAndGroup(category, genre, group)
  return data.map(mapRow)
}

export async function searchSongs(query: string): Promise<Song[]> {
  if (!supabase) return staticSearch(query)
  const q = query.trim()
  if (!q) return []
  const { data, error } = await supabase
    .from('songs').select('*').eq('status', 'published')
    .or(`title.ilike.%${q}%,description.ilike.%${q}%,composer.ilike.%${q}%`)
    .order('created_at', { ascending: false })
  if (error || !data) return staticSearch(query)
  return data.map(mapRow)
}
