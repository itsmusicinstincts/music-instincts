import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Music } from 'lucide-react'
import { SONGS, GENRE_LABELS, LANGUAGE_LABELS } from '@/lib/data'
import { getSongBySlug, getAllSongs } from '@/lib/songs'
import VideoEmbed from '@/components/VideoEmbed'
import StreamingLinks from '@/components/StreamingLinks'
import SongCard from '@/components/SongCard'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const songs = await getAllSongs().catch(() => SONGS)
  return songs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const song = await getSongBySlug(params.slug)
  if (!song) return {}
  return {
    title: `${song.title} — Music Instincts`,
    description: song.description,
  }
}

const GENRE_BADGE = {
  spiritual: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  filmy: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  semi_classical: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
}

export default async function SongPage({ params }: Props) {
  const [song, allSongs] = await Promise.all([getSongBySlug(params.slug), getAllSongs().catch(() => SONGS)])
  if (!song) notFound()

  const related = allSongs.filter((s) => s.id !== song.id && (s.genre === song.genre || s.language === song.language)).slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link
        href="/library"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors mb-8"
      >
        <ChevronLeft size={16} /> Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video */}
          {song.video_embed_url && <VideoEmbed url={song.video_embed_url} title={song.title} />}

          {/* Title block */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`genre-badge border ${GENRE_BADGE[song.genre]}`}>{GENRE_LABELS[song.genre]}</span>
              <span className="genre-badge border border-border-subtle text-text-secondary bg-bg-elevated">{LANGUAGE_LABELS[song.language]}</span>
              {song.year && <span className="text-xs text-text-muted">{song.year}</span>}
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary">{song.title}</h1>
            <p className="text-sm text-text-muted mt-1 flex items-center gap-1.5">
              <Music size={12} /> {song.composer}
            </p>
          </div>

          {/* Description */}
          {song.description && (
            <p className="text-text-secondary leading-relaxed">{song.description}</p>
          )}

          {/* Streaming */}
          <div>
            <h2 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-3">Listen On</h2>
            <StreamingLinks
              youtube_url={song.youtube_url}
              spotify_url={song.spotify_url}
              apple_music_url={song.apple_music_url}
              soundcloud_url={song.soundcloud_url}
            />
          </div>

          {/* Lyrics */}
          {song.lyrics ? (
            <div>
              <h2 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">Lyrics</h2>
              <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
                <pre className="text-sm text-text-secondary font-sans whitespace-pre-wrap leading-relaxed">
                  {song.lyrics}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-bg-card border border-border-subtle rounded-xl p-6 text-center">
              <p className="text-sm text-text-muted mb-3">Lyrics not yet available for this composition.</p>
              <Link
                href="/friends"
                className="inline-flex items-center gap-1.5 text-sm text-accent-yellow hover:opacity-80 transition-opacity"
              >
                <Music size={14} />
                Submit lyrics via Friends of Music Instincts
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-bg-card border border-border-subtle rounded-xl p-5">
            <h3 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-muted text-xs">Genre</dt>
                <dd className="text-text-primary font-medium">{GENRE_LABELS[song.genre]}</dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Language</dt>
                <dd className="text-text-primary font-medium">{LANGUAGE_LABELS[song.language]}</dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Composer</dt>
                <dd className="text-text-primary font-medium">{song.composer}</dd>
              </div>
              {song.year && (
                <div>
                  <dt className="text-text-muted text-xs">Year</dt>
                  <dd className="text-text-primary font-medium">{song.year}</dd>
                </div>
              )}
            </dl>
          </div>

          {related.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-3">Related</h3>
              <div className="space-y-2">
                {related.map((s) => (
                  <SongCard key={s.id} song={s} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
