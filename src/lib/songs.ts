import { supabase } from './supabase'
import {
  SONGS, LYRICS,
  getSongBySlug as staticGetBySlug,
  getFeaturedSongs as staticGetFeatured,
  getSongsByCategory as staticGetByCategory,
  getSongsByCategoryAndGenre as staticGetByCategoryAndGenre,
  getSongsByCategoryGenreAndLanguageGroup as staticGetByCategoryGenreAndGroup,
  getOtherVersions as staticGetOtherVersions,
  getLyricsById as staticGetLyricsById,
  searchSongs as staticSearch,
} from './data'
import type { Song, Lyric, Category, Genre, DisplayLanguageGroup } from './data'

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
    lyric_id: row.lyric_id as string | undefined,
    version_label: row.version_label as string | undefined,
    youtube_url: row.youtube_url as string | undefined,
    spotify_url: row.spotify_url as string | undefined,
    apple_music_url: row.apple_music_url as string | undefined,
    soundcloud_url: row.soundcloud_url as string | undefined,
    video_embed_url: row.video_embed_url as string | undefined,
    thumbnail_url: (row.thumbnail_url as string) ?? '',
    featured: (row.featured as boolean) ?? false,
    status: (row.status as Song['status']) ?? 'published',
  }
}

function mapLyricRow(row: Record<string, unknown>): Lyric {
  return {
    id: row.id as string,
    title: row.title as string | undefined,
    content: row.content as string,
    language: row.language as string,
    author_name: row.author_name as string | undefined,
    lyricist_id: row.lyricist_id as string | undefined,
    agreed_to_showcase: (row.agreed_to_showcase as boolean) ?? false,
    status: (row.status as Lyric['status']) ?? 'draft',
    mood_tags: (row.mood_tags as string[]) ?? [],
    lyric_group_id: row.lyric_group_id as string | undefined,
    version_name: row.version_name as string | undefined,
    version_number: row.version_number as number | undefined,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  }
}

// ─── Song queries ─────────────────────────────────────────────────────────────

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
  if (group === 'hindi') query = query.eq('language', 'hindi')
  else if (group === 'tamil') query = query.eq('language', 'tamil')
  else query = query.not('language', 'in', '(hindi,tamil)')
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error || !data) return staticGetByCategoryGenreAndGroup(category, genre, group)
  return data.map(mapRow)
}

// ─── Lyric queries ────────────────────────────────────────────────────────────

export async function getLyricsForSong(lyricId: string): Promise<Lyric | undefined> {
  if (!supabase) return staticGetLyricsById(lyricId)
  const { data, error } = await supabase
    .from('lyrics').select('*').eq('id', lyricId).eq('status', 'approved').single()
  if (error || !data) return staticGetLyricsById(lyricId)
  return mapLyricRow(data)
}

export async function getOtherVersions(lyricId: string, currentSongId: string): Promise<Song[]> {
  if (!supabase) return staticGetOtherVersions(lyricId, currentSongId)
  const { data, error } = await supabase
    .from('songs').select('*').eq('lyric_id', lyricId).neq('id', currentSongId).eq('status', 'published')
  if (error || !data) return staticGetOtherVersions(lyricId, currentSongId)
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

// ─── Portal queries (no status filter — for admin) ────────────────────────────

export async function getAllSongsAdmin(): Promise<Song[]> {
  if (!supabase) return SONGS
  const { data, error } = await supabase
    .from('songs').select('*').order('created_at', { ascending: false })
  if (error || !data) return SONGS
  return data.map(mapRow)
}

export async function getAllLyrics(): Promise<Lyric[]> {
  if (!supabase) return LYRICS
  const { data, error } = await supabase
    .from('lyrics').select('*').order('created_at', { ascending: false })
  if (error || !data) return LYRICS
  return data.map(mapLyricRow)
}

export async function createLyric(lyric: Omit<Lyric, 'id' | 'created_at' | 'updated_at'>): Promise<Lyric | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('lyrics').insert([lyric]).select().single()
  if (error || !data) return null
  const mapped = mapLyricRow(data)
  // First version: set lyric_group_id = own id
  if (!mapped.lyric_group_id) {
    await supabase.from('lyrics').update({ lyric_group_id: mapped.id }).eq('id', mapped.id)
    mapped.lyric_group_id = mapped.id
  }
  return mapped
}

export async function updateLyric(lyricId: string, updates: Partial<Omit<Lyric, 'id' | 'created_at'>>): Promise<Lyric | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('lyrics').update(updates).eq('id', lyricId).select().single()
  if (error || !data) return null
  return mapLyricRow(data)
}

export async function getLyricById(lyricId: string): Promise<Lyric | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('lyrics').select('*').eq('id', lyricId).single()
  if (error || !data) return null
  return mapLyricRow(data)
}

export async function getVersionsForLyric(lyricGroupId: string): Promise<Lyric[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('lyrics').select('*').eq('lyric_group_id', lyricGroupId)
    .order('version_number', { ascending: true })
  if (error || !data) return []
  return data.map(mapLyricRow)
}

export async function createLyricVersion(lyricGroupId: string, lyric: Omit<Lyric, 'id' | 'created_at' | 'updated_at' | 'lyric_group_id'>): Promise<Lyric | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('lyrics').insert([{ ...lyric, lyric_group_id: lyricGroupId }]).select().single()
  if (error || !data) return null
  return mapLyricRow(data)
}

export async function linkLyricToSong(songId: string, lyricId: string, versionLabel?: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('songs')
    .update({ lyric_id: lyricId, version_label: versionLabel ?? null })
    .eq('id', songId)
  return !error
}
