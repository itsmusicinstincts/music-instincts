'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PenLine, CheckCircle2, XCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getAllSongsAdmin, getAllLyrics } from '@/lib/songs'
import { GENRE_LABELS, getLanguageLabel } from '@/lib/data'
import type { Song, Lyric } from '@/lib/data'

interface SongWithLyric extends Song {
  lyric?: Lyric
}

export default function PortalDashboard() {
  const [songs, setSongs] = useState<SongWithLyric[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    const [allSongs, allLyrics] = await Promise.all([getAllSongsAdmin(), getAllLyrics()])
    const lyricMap = new Map(allLyrics.map((l) => [l.id, l]))
    setSongs(allSongs.map((s) => ({ ...s, lyric: s.lyric_id ? lyricMap.get(s.lyric_id) : undefined })))
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  function refresh() { setRefreshing(true); load() }

  const songsWithLyrics = songs.filter((s) => s.lyric)
  const songsMissingLyrics = songs.filter((s) => !s.lyric)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">{songs.length} compositions · {songsWithLyrics.length} have lyrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refresh} disabled={refreshing}
            className="p-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-colors disabled:opacity-50">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <Link href="/portal/lyrics/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-yellow text-bg-primary text-sm font-semibold hover:opacity-90 transition-opacity">
            <PenLine size={14} /> Add Lyrics
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-bg-elevated animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Songs missing lyrics */}
          {songsMissingLyrics.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold tracking-widest text-amber-400/70 uppercase mb-3 flex items-center gap-2">
                <XCircle size={13} /> Needs Lyrics ({songsMissingLyrics.length})
              </h2>
              <div className="border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle">
                {songsMissingLyrics.map((song) => (
                  <SongRow key={song.id} song={song} />
                ))}
              </div>
            </section>
          )}

          {/* Songs with lyrics */}
          {songsWithLyrics.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold tracking-widest text-green-400/70 uppercase mb-3 flex items-center gap-2">
                <CheckCircle2 size={13} /> Has Lyrics ({songsWithLyrics.length})
              </h2>
              <div className="border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle">
                {songsWithLyrics.map((song) => (
                  <SongRow key={song.id} song={song} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function SongRow({ song }: { song: SongWithLyric }) {
  const hasLyric = Boolean(song.lyric)
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-bg-primary hover:bg-bg-elevated/50 transition-colors">
      {/* Thumbnail */}
      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-bg-elevated">
        {song.thumbnail_url && (
          <img src={song.thumbnail_url} alt={song.title} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary truncate">{song.title}</p>
          {song.version_label && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-yellow/10 text-accent-yellow/80 border border-accent-yellow/20 shrink-0">
              {song.version_label}
            </span>
          )}
        </div>
        <p className="text-xs text-text-muted">
          {GENRE_LABELS[song.genre]} · {getLanguageLabel(song.language)}
          {song.lyric?.author_name && <> · Lyrics: <span className="text-text-secondary">{song.lyric.author_name}</span></>}
        </p>
      </div>

      {/* Status badge */}
      <div className="shrink-0">
        {hasLyric ? (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle2 size={10} /> Lyrics added
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <XCircle size={10} /> No lyrics
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/song/${song.slug}`} target="_blank"
          className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-colors" title="View on site">
          <ExternalLink size={13} />
        </Link>
        <Link
          href={`/portal/lyrics/new?songId=${song.id}&songTitle=${encodeURIComponent(song.title)}`}
          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-yellow/30 transition-colors"
        >
          <PenLine size={11} /> {hasLyric ? 'Edit' : 'Add'}
        </Link>
      </div>
    </div>
  )
}
