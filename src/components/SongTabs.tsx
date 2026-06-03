'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Film, AlignLeft, Layers, ExternalLink, Hash } from 'lucide-react'
import type { Song, Lyric } from '@/lib/data'
import { MOOD_TAGS } from '@/lib/data'
import VideoEmbed from './VideoEmbed'
import StreamingButtons from './StreamingButtons'
import SongCard from './SongCard'

interface Props {
  song: Song
  lyrics?: Lyric
  otherVersions: Song[]
  initialTab?: 'video' | 'lyrics' | 'versions'
}

const TABS = [
  { id: 'video',    label: 'Video',    Icon: Film },
  { id: 'lyrics',   label: 'Lyrics',   Icon: AlignLeft },
  { id: 'versions', label: 'Versions', Icon: Layers },
] as const

type TabId = typeof TABS[number]['id']

export default function SongTabs({ song, lyrics, otherVersions, initialTab = 'video' }: Props) {
  const [active, setActive] = useState<TabId>(initialTab)

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-8 bg-bg-elevated rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id
          const hasBadge = id === 'versions' && otherVersions.length > 0
          const noLyrics = id === 'lyrics' && !lyrics
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-bg-card text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon size={14} />
              {label}
              {hasBadge && (
                <span className="text-[10px] bg-accent-yellow text-bg-primary rounded-full px-1.5 py-0.5 font-bold leading-none">
                  {otherVersions.length}
                </span>
              )}
              {noLyrics && (
                <span className="text-[10px] bg-bg-primary text-text-muted rounded-full px-1.5 py-0.5 leading-none border border-border-subtle">
                  add
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Video tab */}
      {active === 'video' && (
        <div className="space-y-6">
          {song.video_embed_url && (
            <VideoEmbed url={song.video_embed_url} title={song.title} />
          )}
          {!song.video_embed_url && (
            <div className="aspect-video rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted">
              <div className="text-center">
                <Film size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No video embed available</p>
              </div>
            </div>
          )}
          {(song.youtube_url || song.spotify_url || song.apple_music_url || song.soundcloud_url) && (
            <div>
              <p className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">Stream or Watch</p>
              <StreamingButtons
                youtube_url={song.youtube_url}
                spotify_url={song.spotify_url}
                apple_music_url={song.apple_music_url}
                soundcloud_url={song.soundcloud_url}
                size="md"
              />
            </div>
          )}
          {song.description && (
            <p className="text-text-secondary leading-relaxed border-t border-border-subtle pt-6">{song.description}</p>
          )}
        </div>
      )}

      {/* Lyrics tab */}
      {active === 'lyrics' && (
        <div>
          {lyrics ? (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                {lyrics.author_name && (
                  <p className="text-xs text-text-muted">
                    Lyrics by <span className="text-text-secondary font-medium">{lyrics.author_name}</span>
                    {lyrics.version_name && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-accent-yellow/10 text-accent-yellow/80 border border-accent-yellow/20">
                        {lyrics.version_name}
                      </span>
                    )}
                  </p>
                )}
                {/* Mood hashtags */}
                {(lyrics.mood_tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <Hash size={11} className="text-text-muted" />
                    {(lyrics.mood_tags ?? []).map(tag => {
                      const mood = MOOD_TAGS.find(m => m.id === tag)
                      return (
                        <span key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full border font-medium"
                          style={mood ? { color: mood.color, borderColor: `${mood.color}40`, background: mood.bg } : {
                            color: 'var(--text-muted)', borderColor: 'var(--border-subtle)', background: 'transparent'
                          }}
                        >
                          #{tag}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="bg-bg-elevated border border-border-subtle rounded-2xl p-6 md:p-8">
                <pre className="text-sm text-text-secondary font-sans whitespace-pre-wrap leading-loose tracking-wide">
                  {lyrics.content}
                </pre>
              </div>
              {lyrics.agreed_to_showcase && (
                <p className="text-xs text-text-muted mt-3 flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500/20 border border-green-500/40 inline-flex items-center justify-center text-green-400 text-[8px] font-bold">✓</span>
                  Lyricist has consented to public display
                </p>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-border-subtle rounded-2xl p-10 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-text-primary font-semibold mb-2">Lyrics not yet added</h3>
              <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
                Are you the lyricist for this composition? Log in to the portal and contribute your lyrics.
              </p>
              <Link
                href={`/portal/lyrics/write?songId=${song.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-yellow text-bg-primary font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Write Lyrics via Portal
                <ExternalLink size={14} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Versions tab */}
      {active === 'versions' && (
        <div>
          {otherVersions.length > 0 ? (
            <>
              <p className="text-sm text-text-secondary mb-6">
                These compositions share the same lyrics — different arrangements, same soul.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherVersions.map((v) => (
                  <SongCard key={v.id} song={v} />
                ))}
              </div>
            </>
          ) : (
            <div className="border-2 border-dashed border-border-subtle rounded-2xl p-10 text-center text-text-muted">
              <Layers size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No other versions yet.</p>
              <p className="text-xs mt-1 opacity-60">Remixes and alternate arrangements will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
