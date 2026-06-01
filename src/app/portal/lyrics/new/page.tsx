'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, ChevronDown, Loader2, Layers } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getAllSongsAdmin, getAllLyrics, createLyric, linkLyricToSong } from '@/lib/songs'
import { GENRE_LABELS, getLanguageLabel } from '@/lib/data'
import type { Song, Lyric } from '@/lib/data'

type FlowMode = 'write-new' | 'link-existing'

export default function NewLyricsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const prefillSongId = searchParams.get('songId') ?? ''
  const prefillSongTitle = searchParams.get('songTitle') ?? ''

  const [songs, setSongs] = useState<Song[]>([])
  const [existingLyrics, setExistingLyrics] = useState<Lyric[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [flowMode, setFlowMode] = useState<FlowMode>('write-new')
  const [selectedSongId, setSelectedSongId] = useState(prefillSongId)
  const [selectedLyricId, setSelectedLyricId] = useState('')
  const [versionLabel, setVersionLabel] = useState('')
  const [title, setTitle] = useState(prefillSongTitle)
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [language, setLanguage] = useState('')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    async function load() {
      const [s, l] = await Promise.all([getAllSongsAdmin(), getAllLyrics()])
      setSongs(s)
      setExistingLyrics(l)
      // Pre-fill language from selected song
      if (prefillSongId) {
        const song = s.find((x) => x.id === prefillSongId)
        if (song) setLanguage(song.language)
      }
      setLoading(false)
    }
    load()
  }, [prefillSongId])

  // Keep language in sync when song selection changes
  useEffect(() => {
    if (selectedSongId) {
      const song = songs.find((s) => s.id === selectedSongId)
      if (song) setLanguage(song.language)
    }
  }, [selectedSongId, songs])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) { setError('Supabase not configured.'); return }
    if (!selectedSongId) { setError('Please select a song.'); return }
    if (flowMode === 'write-new' && !content.trim()) { setError('Please enter the lyrics.'); return }
    if (flowMode === 'link-existing' && !selectedLyricId) { setError('Please select an existing lyric.'); return }
    if (flowMode === 'write-new' && !agreed) { setError('Please agree to showcase the lyrics.'); return }

    setSubmitting(true)
    setError(null)

    try {
      let lyricId = selectedLyricId

      if (flowMode === 'write-new') {
        const newLyric = await createLyric({
          title: title || undefined,
          content: content.trim(),
          language,
          author_name: authorName || undefined,
          agreed_to_showcase: agreed,
          status: 'approved', // admin submitting = auto-approved
        })
        if (!newLyric) throw new Error('Failed to create lyric record.')
        lyricId = newLyric.id
      }

      const linked = await linkLyricToSong(selectedSongId, lyricId, versionLabel || undefined)
      if (!linked) throw new Error('Failed to link lyric to song.')

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-text-muted gap-3">
        <Loader2 size={18} className="animate-spin" /> Loading…
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={28} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary font-display mb-2">Lyrics saved!</h2>
        <p className="text-text-muted mb-8">The lyrics have been linked to the song and are now visible on the site.</p>
        <div className="flex justify-center gap-3">
          <Link href="/portal/dashboard"
            className="px-5 py-2.5 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary text-sm transition-colors">
            Back to Dashboard
          </Link>
          <button onClick={() => { setSuccess(false); setContent(''); setAgreed(false); setVersionLabel('') }}
            className="px-5 py-2.5 rounded-xl bg-accent-yellow text-bg-primary font-semibold text-sm hover:opacity-90 transition-opacity">
            Add Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/portal/dashboard" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-text-primary font-display mt-3">Add Lyrics</h1>
        <p className="text-text-muted text-sm mt-1">Link lyrics to a composition. You can write new lyrics or link existing ones.</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 rounded-xl p-3 mb-6 text-sm text-red-300">
          <AlertCircle size={15} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Song selector */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Song *</label>
          <div className="relative">
            <select
              value={selectedSongId}
              onChange={(e) => setSelectedSongId(e.target.value)}
              required
              className="w-full appearance-none px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent-yellow/50 transition-colors pr-10"
            >
              <option value="">— Select a song —</option>
              {songs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} · {getLanguageLabel(s.language)} ({GENRE_LABELS[s.genre]})
                  {s.lyric_id ? ' ✓' : ''}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Version label */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Version Label <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={versionLabel}
            onChange={(e) => setVersionLabel(e.target.value)}
            placeholder="e.g. Hindi Original, Tamil Version, Acoustic"
            className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors"
          />
          <p className="text-xs text-text-muted mt-1">This label is displayed on the song card and detail page.</p>
        </div>

        {/* Flow mode toggle */}
        <div className="flex rounded-xl border border-border-subtle overflow-hidden">
          <button type="button" onClick={() => setFlowMode('write-new')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${flowMode === 'write-new' ? 'bg-accent-yellow text-bg-primary' : 'text-text-muted hover:text-text-secondary bg-bg-elevated'}`}>
            ✏️ Write New Lyrics
          </button>
          <button type="button" onClick={() => setFlowMode('link-existing')}
            disabled={existingLyrics.length === 0}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 ${flowMode === 'link-existing' ? 'bg-accent-yellow text-bg-primary' : 'text-text-muted hover:text-text-secondary bg-bg-elevated'}`}>
            <Layers size={13} className="inline mr-1.5" />Link Existing
          </button>
        </div>

        {/* Write new lyrics */}
        {flowMode === 'write-new' && (
          <div className="space-y-4 bg-bg-elevated/50 border border-border-subtle rounded-2xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Title (optional)</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Lyric title…"
                  className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Language</label>
                <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)}
                  placeholder="hindi, tamil, sanskrit…"
                  className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Lyricist / Author (optional)</label>
              <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Name of the lyricist"
                className="w-full px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Lyrics *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder="Paste or type the lyrics here…"
                className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors resize-none leading-relaxed font-mono"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-yellow-400 rounded" />
              <span className="text-sm text-text-secondary leading-relaxed">
                I agree to showcase these lyrics publicly on Music Instincts and confirm I have the rights to submit them.
              </span>
            </label>
          </div>
        )}

        {/* Link existing lyric */}
        {flowMode === 'link-existing' && (
          <div className="bg-bg-elevated/50 border border-border-subtle rounded-2xl p-5">
            <p className="text-xs text-text-muted mb-3">
              Link a song to an already-existing lyric record. Useful for connecting remixes and alternate arrangements to the same lyrics.
            </p>
            <label className="block text-xs font-medium text-text-secondary mb-2">Select Existing Lyric *</label>
            <div className="relative">
              <select value={selectedLyricId} onChange={(e) => setSelectedLyricId(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-accent-yellow/50 transition-colors pr-10">
                <option value="">— Select a lyric —</option>
                {existingLyrics.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title || '(untitled)'} · {getLanguageLabel(l.language)}
                    {l.author_name ? ` · by ${l.author_name}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/portal/dashboard"
            className="px-5 py-2.5 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary text-sm transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-yellow text-bg-primary font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity">
            {submitting ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Lyrics'}
          </button>
        </div>
      </form>
    </div>
  )
}
