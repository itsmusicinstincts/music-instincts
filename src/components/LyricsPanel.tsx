'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ScrollText, Pen, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  songSlug: string
  lyrics?: string
}

export default function LyricsPanel({ songSlug, lyrics }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-border-subtle overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-bg-card hover:bg-bg-elevated transition-colors"
      >
        <div className="flex items-center gap-2">
          <ScrollText size={15} className="text-accent-yellow" />
          <span className="text-sm font-semibold text-text-primary">Lyrics</span>
          {!lyrics && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20">
              Be the first to add
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
      </button>

      {/* Body */}
      {open && (
        <div className="bg-bg-elevated border-t border-border-subtle">
          {lyrics ? (
            <div className="px-5 py-5">
              <pre className="text-sm text-text-secondary font-sans whitespace-pre-wrap leading-loose">
                {lyrics}
              </pre>
              <div className="mt-6 pt-5 border-t border-border-subtle flex items-center justify-between">
                <p className="text-xs text-text-muted italic">Know a different version of these lyrics?</p>
                <Link
                  href={`/friends/submit?song=${songSlug}`}
                  className="text-xs text-accent-yellow hover:opacity-80 transition-opacity flex items-center gap-1"
                >
                  <Pen size={11} /> Submit correction
                </Link>
              </div>
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center mx-auto mb-4">
                <Pen size={22} className="text-accent-yellow" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">No lyrics yet</h3>
              <p className="text-sm text-text-secondary mb-5 max-w-xs mx-auto">
                Are you a lyricist? Join the Friends of Music Instincts community and submit the lyrics for this song.
              </p>
              <Link
                href={`/friends/submit?song=${songSlug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-yellow text-bg-primary text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Pen size={14} /> Submit Lyrics
              </Link>
              <p className="text-xs text-text-muted mt-4">
                Already a member?{' '}
                <Link href="/friends/login" className="text-accent-yellow hover:opacity-80">Sign in</Link>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
