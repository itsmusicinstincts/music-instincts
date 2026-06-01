import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { Song } from '@/lib/data'
import { GENRE_LABELS, getLanguageLabel } from '@/lib/data'

interface Props {
  song: Song
  /** slim horizontal layout for related / sidebar lists */
  compact?: boolean
}

const GENRE_COLORS: Record<string, string> = {
  spiritual:           'bg-violet-500/20 text-violet-300 border-violet-500/30',
  filmy:               'bg-blue-500/20 text-blue-300 border-blue-500/30',
  semi_classical:      'bg-amber-500/20 text-amber-300 border-amber-500/30',
  original:            'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  bollywood_recreated: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
}

// Small platform indicator dots shown on card hover
function PlatformDot({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    youtube:     'bg-[#FF0000]',
    spotify:     'bg-[#1DB954]',
    apple_music: 'bg-gradient-to-br from-[#FC5C7D] to-[#6A82FB]',
    soundcloud:  'bg-[#FF5500]',
  }
  return (
    <div className={`w-2 h-2 rounded-full ${colors[platform] ?? 'bg-white/40'}`} title={platform} />
  )
}

export default function SongCard({ song, compact = false }: Props) {
  if (compact) {
    return (
      <Link href={`/song/${song.slug}`} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-bg-elevated transition-colors">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-bg-card">
          <Image src={song.thumbnail_url} alt={song.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{song.title}</p>
          {song.version_label && (
            <p className="text-xs text-accent-yellow/70 truncate">{song.version_label}</p>
          )}
          <p className="text-xs text-text-muted">{getLanguageLabel(song.language)} · {GENRE_LABELS[song.genre]}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/song/${song.slug}`} className="group block">
      {/* Cinematic square card */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-bg-card">
        {/* Thumbnail — zooms gently on hover */}
        <Image
          src={song.thumbnail_url}
          alt={song.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Always-on gradient — bottom heavy */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/0" />

        {/* Top-left genre badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${GENRE_COLORS[song.genre] ?? 'bg-white/10 text-white/70 border-white/20'}`}>
            {GENRE_LABELS[song.genre]}
          </span>
        </div>

        {/* Centre play button — appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 ease-out">
            <Play size={22} className="text-white fill-white ml-1" />
          </div>
        </div>

        {/* Bottom info — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs text-white/55 font-medium">{getLanguageLabel(song.language)}</span>
            {song.version_label && (
              <>
                <span className="text-white/30 text-xs">·</span>
                <span className="text-xs text-accent-yellow/75">{song.version_label}</span>
              </>
            )}
          </div>
          <h3 className="font-display text-lg font-semibold text-white leading-snug">{song.title}</h3>

          {/* Platform dots — fade in on hover */}
          <div className="flex items-center gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {song.youtube_url     && <PlatformDot platform="youtube" />}
            {song.spotify_url     && <PlatformDot platform="spotify" />}
            {song.apple_music_url && <PlatformDot platform="apple_music" />}
            {song.soundcloud_url  && <PlatformDot platform="soundcloud" />}
            {(song.youtube_url || song.spotify_url || song.apple_music_url || song.soundcloud_url) && (
              <span className="text-[10px] text-white/40 ml-1">Available on</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
