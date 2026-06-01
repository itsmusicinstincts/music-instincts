import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Music } from 'lucide-react'
import { SONGS, GENRE_LABELS, getLanguageLabel } from '@/lib/data'
import { getSongBySlug, getAllSongs, getLyricsForSong, getOtherVersions } from '@/lib/songs'
import SongTabs from '@/components/SongTabs'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const songs = await getAllSongs().catch(() => SONGS)
  return songs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const song = await getSongBySlug(slug)
  if (!song) return {}
  return {
    title: `${song.title}${song.version_label ? ` (${song.version_label})` : ''} — Music Instincts`,
    description: song.description,
  }
}

const GENRE_BADGE: Record<string, string> = {
  spiritual:           'bg-violet-500/15 text-violet-300 border-violet-500/25',
  filmy:               'bg-blue-500/15 text-blue-300 border-blue-500/25',
  semi_classical:      'bg-amber-500/15 text-amber-300 border-amber-500/25',
  original:            'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  bollywood_recreated: 'bg-pink-500/15 text-pink-300 border-pink-500/25',
}

export default async function SongPage({ params }: Props) {
  const { slug } = await params
  const [song, allSongs] = await Promise.all([getSongBySlug(slug), getAllSongs().catch(() => SONGS)])
  if (!song) notFound()

  const [lyrics, otherVersions] = await Promise.all([
    song.lyric_id ? getLyricsForSong(song.lyric_id) : Promise.resolve(undefined),
    song.lyric_id ? getOtherVersions(song.lyric_id, song.id) : Promise.resolve([]),
  ])

  const related = allSongs
    .filter((s) => s.id !== song.id && !otherVersions.find((v) => v.id === s.id) && (s.genre === song.genre || s.language === song.language))
    .slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link href="/library" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors mb-8">
        <ChevronLeft size={16} /> Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title block */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`genre-badge border ${GENRE_BADGE[song.genre] ?? 'bg-white/10 text-white/70 border-white/20'}`}>
                {GENRE_LABELS[song.genre]}
              </span>
              <span className="genre-badge border border-border-subtle text-text-secondary bg-bg-elevated">
                {getLanguageLabel(song.language)}
              </span>
              {song.version_label && (
                <span className="genre-badge border border-accent-yellow/30 text-accent-yellow/80 bg-accent-yellow/5">
                  {song.version_label}
                </span>
              )}
              {song.year && <span className="text-xs text-text-muted">{song.year}</span>}
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary">{song.title}</h1>
            <p className="text-sm text-text-muted mt-2 flex items-center gap-1.5">
              <Music size={12} /> {song.composer}
            </p>
          </div>

          {/* Tabs: Video / Lyrics / Versions */}
          <SongTabs
            song={song}
            lyrics={lyrics}
            otherVersions={otherVersions}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Song details */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
            <h2 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-muted">Genre</dt>
                <dd className="text-text-primary font-medium">{GENRE_LABELS[song.genre]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Language</dt>
                <dd className="text-text-primary font-medium">{getLanguageLabel(song.language)}</dd>
              </div>
              {song.version_label && (
                <div className="flex justify-between">
                  <dt className="text-text-muted">Version</dt>
                  <dd className="text-text-primary font-medium">{song.version_label}</dd>
                </div>
              )}
              {song.year && (
                <div className="flex justify-between">
                  <dt className="text-text-muted">Year</dt>
                  <dd className="text-text-primary font-medium">{song.year}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-text-muted">Composer</dt>
                <dd className="text-text-primary font-medium">{song.composer}</dd>
              </div>
              {lyrics?.author_name && (
                <div className="flex justify-between">
                  <dt className="text-text-muted">Lyricist</dt>
                  <dd className="text-text-primary font-medium">{lyrics.author_name}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Related songs */}
          {related.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-3">More Like This</h2>
              <div className="space-y-1">
                {related.map((s) => (
                  <Link key={s.id} href={`/song/${s.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-elevated transition-colors group">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-bg-card">
                      <img src={s.thumbnail_url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{s.title}</p>
                      <p className="text-xs text-text-muted">{getLanguageLabel(s.language)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
