'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'

interface SongOption { id: string; slug: string; title: string; language: string }

interface Props {
  songs: SongOption[]
  defaultSongSlug?: string
  userId: string
}

export default function SubmitLyricsForm({ songs, defaultSongSlug, userId }: Props) {
  const router = useRouter()
  const defaultSong = songs.find((s) => s.slug === defaultSongSlug)

  const [songId, setSongId] = useState(defaultSong?.id ?? '')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState(defaultSong?.language ?? '')
  const [agreed, setAgreed] = useState(false)
  const [versionNote, setVersionNote] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) { setError('Please confirm copyright ownership.'); return }
    if (!songId) { setError('Please select a song.'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: insertError } = await supabase.from('lyrics').insert({
      song_id: songId,
      lyricist_id: userId,
      title: title || null,
      content,
      language: language || 'hindi',
      status: 'pending',
      copyright_agreed: true,
      admin_notes: versionNote || null,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-green-400" />
        </div>
        <h2 className="font-display text-xl font-semibold text-text-primary mb-2">Lyrics submitted!</h2>
        <p className="text-text-secondary mb-6 text-sm">Your submission is under review. We&apos;ll update the song page once approved.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setDone(false); setContent(''); setTitle('') }} className="px-5 py-2 rounded-full border border-border-subtle text-text-secondary hover:text-text-primary text-sm transition-colors">
            Submit Another
          </button>
          <button onClick={() => router.push('/friends/dashboard')} className="px-5 py-2 rounded-full bg-accent-yellow text-bg-primary text-sm font-semibold hover:opacity-90 transition-opacity">
            View Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Song selector */}
      <div>
        <label className="text-xs font-medium text-text-muted uppercase tracking-widest block mb-1.5">Song *</label>
        <select
          required value={songId} onChange={(e) => {
            setSongId(e.target.value)
            const s = songs.find((s) => s.id === e.target.value)
            if (s) setLanguage(s.language)
          }}
          className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary focus:outline-none focus:border-accent-yellow/50 transition-colors"
        >
          <option value="">— Select a song —</option>
          {songs.map((s) => (
            <option key={s.id} value={s.id}>{s.title} ({s.language})</option>
          ))}
        </select>
      </div>

      {/* Lyrics title */}
      <div>
        <label className="text-xs font-medium text-text-muted uppercase tracking-widest block mb-1.5">Lyrics Title / Version <span className="normal-case text-text-muted">(optional)</span></label>
        <input
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sharanam — Hindi translation"
          className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors"
        />
      </div>

      {/* Language */}
      <div>
        <label className="text-xs font-medium text-text-muted uppercase tracking-widest block mb-1.5">Language *</label>
        <input
          type="text" required value={language} onChange={(e) => setLanguage(e.target.value)}
          placeholder="e.g. hindi, tamil, sanskrit, english"
          className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors"
        />
      </div>

      {/* Lyrics content */}
      <div>
        <label className="text-xs font-medium text-text-muted uppercase tracking-widest block mb-1.5">Lyrics *</label>
        <textarea
          required rows={14} value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="Paste or write the full lyrics here…"
          className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors font-mono text-sm leading-relaxed resize-none"
        />
        <div className="text-right text-xs text-text-muted mt-1">{content.length} chars</div>
      </div>

      {/* Version notes */}
      <div>
        <label className="text-xs font-medium text-text-muted uppercase tracking-widest block mb-1.5">Notes for reviewer <span className="normal-case text-text-muted">(optional)</span></label>
        <input
          type="text" value={versionNote} onChange={(e) => setVersionNote(e.target.value)}
          placeholder="e.g. This is a transliteration of the Tamil version"
          className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors"
        />
      </div>

      {/* Copyright agreement */}
      <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl border border-border-subtle hover:border-border bg-bg-card transition-colors">
        <div
          onClick={() => setAgreed(!agreed)}
          className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${agreed ? 'bg-accent-yellow border-accent-yellow' : 'border-border-subtle group-hover:border-border'}`}
        >
          {agreed && <Check size={12} className="text-bg-primary" />}
        </div>
        <span className="text-sm text-text-secondary leading-snug">
          I confirm that I wrote these lyrics or have the rights to submit them, and I agree to Music Instincts publishing them with credit to me.
        </span>
      </label>

      <button
        type="submit" disabled={loading}
        className="w-full py-3 rounded-full bg-accent-yellow text-bg-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Submit for Review
      </button>
    </form>
  )
}
