import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { Song } from '@/lib/data'
import { GENRE_LABELS, getLanguageLabel } from '@/lib/data'
import StreamingLinks from './StreamingLinks'

const GENRE_COLORS: Record<string, string> = {
  spiritual: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  filmy: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  semi_classical: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  original: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  bollywood_recreated: 'bg-pink-500/15 text-pink-300 border-pink-500/25',
}

interface Props {
  song: Song
  variant?: 'default' | 'compact'
}

export default function SongCard({ song, variant = 'default' }: Props) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/song/${song.slug}`}
        className="flex items-center gap-4 p-3 rounded-lg bg-bg-card border border-border-subtle hover:border-border hover:bg-bg-elevated transition-all group"
      >
        <div className="relative shrink-0 w-14 h-14 rounded-md overflow-hidden bg-bg-elevated">
          <Image
            src={song.thumbnail_url}
            alt={song.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play size={16} className="text-white fill-white" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-text-primary truncate">{song.title}</div>
          <div className="text-xs text-text-muted mt-0.5">{getLanguageLabel(song.language)}</div>
        </div>
        <span className={`ml-auto shrink-0 genre-badge border ${GENRE_COLORS[song.genre]}`}>
          {GENRE_LABELS[song.genre]}
        </span>
      </Link>
    )
  }

  return (
    <div className="group flex flex-col rounded-xl overflow-hidden bg-bg-card border border-border-subtle hover:border-border transition-all">
      {/* Thumbnail */}
      <Link href={`/song/${song.slug}`} className="relative aspect-video overflow-hidden bg-bg-elevated">
        <Image
          src={song.thumbnail_url}
          alt={song.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-accent-yellow/90 flex items-center justify-center">
            <Play size={20} className="text-bg-primary fill-bg-primary ml-0.5" />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/song/${song.slug}`} className="font-display text-base font-semibold text-text-primary hover:text-accent-yellow transition-colors leading-snug">
              {song.title}
            </Link>
            <span className={`shrink-0 genre-badge border ${GENRE_COLORS[song.genre]}`}>
                        {getLanguageLabel(song.language)}
                      </span>
          </div>
          <div className="text-xs text-text-muted mt-1">{song.composer}</div>
        </div>

        {song.description && (
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{song.description}</p>
        )}

        <div className="mt-auto pt-2">
          <StreamingLinks
            youtube_url={song.youtube_url}
            spotify_url={song.spotify_url}
            apple_music_url={song.apple_music_url}
            soundcloud_url={song.soundcloud_url}
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}
