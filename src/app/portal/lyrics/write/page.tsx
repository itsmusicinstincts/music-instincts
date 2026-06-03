'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Save, Plus, CheckCircle2, AlertCircle, Loader2,
  ChevronDown, Hash, Clock, AlignLeft, Link2, X
} from 'lucide-react'
import { MOOD_TAGS, LANGUAGE_LABELS } from '@/lib/data'
import type { Lyric } from '@/lib/data'
import {
  getAllSongsAdmin,
  createLyric, createLyricVersion, updateLyric,
  getLyricById, getVersionsForLyric, linkLyricToSong,
} from '@/lib/songs'
import type { Song } from '@/lib/data'

// ─── Constants ────────────────────────────────────────────────────────────────

const LANGUAGES = ['hindi', 'tamil', 'sanskrit', 'english', 'telugu', 'malayalam', 'kannada', 'punjabi', 'other']

const CUSTOM_TAG_MAX = 5

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}
function lineCount(text: string) {
  return text ? text.split('\n').length : 0
}
function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MoodPill({ mood, selected, onClick }: { mood: typeof MOOD_TAGS[number]; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={selected ? { borderColor: mood.color, background: mood.bg, color: mood.color } : {}}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 select-none
        ${selected
          ? 'ring-1'
          : 'border-border-subtle text-text-muted hover:border-border hover:text-text-secondary bg-transparent'
        }`}
    >
      #{mood.label.toLowerCase()}
    </button>
  )
}

function StatusBadge({ state }: { state: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (state === 'idle') return null
  if (state === 'saving') return (
    <span className="flex items-center gap-1.5 text-xs text-text-muted">
      <Loader2 size={12} className="animate-spin" /> Saving…
    </span>
  )
  if (state === 'saved') return (
    <span className="flex items-center gap-1.5 text-xs text-green-400">
      <CheckCircle2 size={12} /> Saved
    </span>
  )
  return (
    <span className="flex items-center gap-1.5 text-xs text-red-400">
      <AlertCircle size={12} /> Save failed
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function WritePadPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const initLyricId = searchParams.get('lyricId') ?? ''
  const initSongId  = searchParams.get('songId') ?? ''

  // Data
  const [songs, setSongs] = useState<Song[]>([])
  const [versions, setVersions] = useState<Lyric[]>([])
  const [currentLyricId, setCurrentLyricId] = useState(initLyricId)
  const [lyricGroupId, setLyricGroupId] = useState<string | undefined>()

  // Form state
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('hindi')
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [versionName, setVersionName] = useState('Draft 1')
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [customTags, setCustomTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [linkSongId, setLinkSongId] = useState(initSongId)
  const [songVersionLabel, setSongVersionLabel] = useState('')

  // UI state
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showVersionPanel, setShowVersionPanel] = useState(false)
  const [showLinkPanel, setShowLinkPanel] = useState(false)
  const [newVersionMode, setNewVersionMode] = useState(false)

  // Primary mood for theming (first selected)
  const primaryMood = MOOD_TAGS.find(m => selectedMoods[0] === m.id)

  // ─── Load data ──────────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      const [allSongs] = await Promise.all([getAllSongsAdmin()])
      setSongs(allSongs)

      if (initLyricId) {
        const lyric = await getLyricById(initLyricId)
        if (lyric) {
          setTitle(lyric.title ?? '')
          setLanguage(lyric.language ?? 'hindi')
          setContent(lyric.content ?? '')
          setAuthorName(lyric.author_name ?? '')
          setVersionName(lyric.version_name ?? 'Draft 1')
          setSelectedMoods((lyric.mood_tags ?? []).filter(t => MOOD_TAGS.find(m => m.id === t)))
          setCustomTags((lyric.mood_tags ?? []).filter(t => !MOOD_TAGS.find(m => m.id === t)))
          setAgreed(lyric.agreed_to_showcase ?? false)
          setLyricGroupId(lyric.lyric_group_id)

          if (lyric.lyric_group_id) {
            const vers = await getVersionsForLyric(lyric.lyric_group_id)
            setVersions(vers)
          }
        }
      }
      setLoading(false)
    }
    load()
  }, [initLyricId])

  // ─── Mood tag helpers ────────────────────────────────────────────────────────

  function toggleMood(id: string) {
    setSelectedMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  function addCustomTag() {
    const tag = customTagInput.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (!tag || customTags.includes(tag) || customTags.length >= CUSTOM_TAG_MAX) return
    setCustomTags(prev => [...prev, tag])
    setCustomTagInput('')
  }

  function removeCustomTag(tag: string) {
    setCustomTags(prev => prev.filter(t => t !== tag))
  }

  const allMoodTags = [...selectedMoods, ...customTags]

  // ─── Save ────────────────────────────────────────────────────────────────────

  const handleSave = useCallback(async (asNewVersion = false) => {
    if (!content.trim()) return
    setSaveState('saving')

    const payload = {
      title: title || undefined,
      content: content.trim(),
      language,
      author_name: authorName || undefined,
      mood_tags: allMoodTags,
      agreed_to_showcase: agreed,
      status: 'approved' as const,
      version_name: versionName || 'Draft',
      version_number: asNewVersion ? (versions.length + 1) : undefined,
    }

    try {
      let saved: Lyric | null = null

      if (!currentLyricId || asNewVersion) {
        if (asNewVersion && lyricGroupId) {
          saved = await createLyricVersion(lyricGroupId, payload)
        } else {
          saved = await createLyric(payload)
          if (saved) setLyricGroupId(saved.lyric_group_id)
        }
        if (saved) {
          setCurrentLyricId(saved.id)
          setNewVersionMode(false)
          // Refresh versions
          if (saved.lyric_group_id) {
            const vers = await getVersionsForLyric(saved.lyric_group_id)
            setVersions(vers)
          }
          // Update URL without reload
          const url = new URL(window.location.href)
          url.searchParams.set('lyricId', saved.id)
          window.history.replaceState({}, '', url.toString())
        }
      } else {
        saved = await updateLyric(currentLyricId, payload)
      }

      // Link to song if requested
      if (saved && linkSongId) {
        await linkLyricToSong(linkSongId, saved.id, songVersionLabel || undefined)
      }

      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 3000)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 4000)
    }
  }, [content, title, language, authorName, allMoodTags, agreed, versionName, currentLyricId, lyricGroupId, linkSongId, songVersionLabel, versions.length])

  // ─── Load a specific version ──────────────────────────────────────────────────

  function loadVersion(v: Lyric) {
    setCurrentLyricId(v.id)
    setTitle(v.title ?? '')
    setLanguage(v.language ?? 'hindi')
    setContent(v.content ?? '')
    setAuthorName(v.author_name ?? '')
    setVersionName(v.version_name ?? 'Draft')
    setSelectedMoods((v.mood_tags ?? []).filter(t => MOOD_TAGS.find(m => m.id === t)))
    setCustomTags((v.mood_tags ?? []).filter(t => !MOOD_TAGS.find(m => m.id === t)))
    setAgreed(v.agreed_to_showcase ?? false)
    setShowVersionPanel(false)
    const url = new URL(window.location.href)
    url.searchParams.set('lyricId', v.id)
    window.history.replaceState({}, '', url.toString())
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-text-muted gap-3">
        <Loader2 size={20} className="animate-spin" /> Loading pad…
      </div>
    )
  }

  const padBorderColor = primaryMood?.color ?? 'var(--border-subtle, #2a2a35)'
  const padBg = primaryMood?.bg ?? 'transparent'

  return (
    <div className="max-w-3xl">
      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button onClick={() => router.push('/portal/dashboard')}
          className="text-sm text-text-muted hover:text-text-secondary transition-colors">
          ← Dashboard
        </button>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Lyric title…"
            className="w-full bg-transparent border-none text-lg font-semibold text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <StatusBadge state={saveState} />

        {/* Versions button */}
        {versions.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowVersionPanel(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-xs text-text-secondary hover:text-text-primary hover:border-border transition-colors"
            >
              <Clock size={12} />
              {versions.length} version{versions.length !== 1 ? 's' : ''}
              <ChevronDown size={11} className={showVersionPanel ? 'rotate-180' : ''} />
            </button>
            {showVersionPanel && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-bg-card border border-border-subtle rounded-xl shadow-2xl z-30 py-1 overflow-hidden">
                {versions.map(v => (
                  <button key={v.id} onClick={() => loadVersion(v)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-bg-elevated transition-colors ${v.id === currentLyricId ? 'bg-accent-yellow/5' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${v.id === currentLyricId ? 'text-accent-yellow' : 'text-text-primary'}`}>
                        {v.version_name || `Version ${v.version_number ?? ''}`}
                      </span>
                      {v.id === currentLyricId && (
                        <span className="text-[10px] text-accent-yellow bg-accent-yellow/10 px-1.5 py-0.5 rounded-full">current</span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">
                      {wordCount(v.content ?? '')} words · {formatDate(v.created_at)}
                    </div>
                  </button>
                ))}
                <div className="border-t border-border-subtle mt-1 pt-1 px-2 pb-1">
                  <button
                    onClick={() => { setNewVersionMode(true); setVersionName(`Draft ${versions.length + 1}`); setShowVersionPanel(false) }}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-colors"
                  >
                    <Plus size={11} /> Save current as new version
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Link to song */}
        <button
          onClick={() => setShowLinkPanel(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
            linkSongId
              ? 'border-accent-yellow/40 text-accent-yellow bg-accent-yellow/5'
              : 'border-border-subtle text-text-secondary hover:border-border'
          }`}
        >
          <Link2 size={12} />
          {linkSongId ? (songs.find(s => s.id === linkSongId)?.title ?? 'Linked') : 'Link to Song'}
        </button>
      </div>

      {/* ── Link to song panel ── */}
      {showLinkPanel && (
        <div className="mb-4 p-4 bg-bg-elevated border border-border-subtle rounded-xl">
          <p className="text-xs text-text-muted mb-3">Link these lyrics to a song on the site</p>
          <div className="flex gap-3 flex-wrap">
            <select
              value={linkSongId}
              onChange={e => setLinkSongId(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 bg-bg-card border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-yellow/50"
            >
              <option value="">— No song link —</option>
              {songs.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} · {s.language}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={songVersionLabel}
              onChange={e => setSongVersionLabel(e.target.value)}
              placeholder="Version label, e.g. Hindi Original"
              className="flex-1 min-w-0 px-3 py-2 bg-bg-card border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50"
            />
          </div>
        </div>
      )}

      {/* ── Language + metadata row ── */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">Language</span>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="appearance-none bg-bg-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-yellow/50"
          >
            {LANGUAGES.map(l => (
              <option key={l} value={l}>{LANGUAGE_LABELS[l] ?? l}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">Lyricist</span>
          <input
            type="text"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="Author name…"
            className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 w-36"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">Version</span>
          <input
            type="text"
            value={versionName}
            onChange={e => setVersionName(e.target.value)}
            className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-yellow/50 w-28"
          />
        </div>
      </div>

      {/* ── Mood / genre tags ── */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <Hash size={13} className="text-text-muted" />
          <span className="text-xs font-medium text-text-secondary">Mood & Genre Tags</span>
          <span className="text-xs text-text-muted">(select multiple)</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {MOOD_TAGS.map(mood => (
            <MoodPill
              key={mood.id}
              mood={mood}
              selected={selectedMoods.includes(mood.id)}
              onClick={() => toggleMood(mood.id)}
            />
          ))}
        </div>
        {/* Custom tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {customTags.map(tag => (
            <span key={tag}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-border-subtle text-text-secondary bg-bg-elevated">
              #{tag}
              <button onClick={() => removeCustomTag(tag)} className="text-text-muted hover:text-text-primary ml-0.5">
                <X size={10} />
              </button>
            </span>
          ))}
          {customTags.length < CUSTOM_TAG_MAX && (
            <div className="flex items-center gap-1">
              <span className="text-text-muted text-xs">#</span>
              <input
                type="text"
                value={customTagInput}
                onChange={e => setCustomTagInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addCustomTag() } }}
                placeholder="custom tag…"
                className="bg-transparent border-none text-xs text-text-secondary placeholder:text-text-muted focus:outline-none w-24"
              />
              {customTagInput && (
                <button onClick={addCustomTag}
                  className="text-[10px] text-accent-yellow hover:opacity-80 px-1.5 py-0.5 rounded bg-accent-yellow/10">
                  add
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Writing pad ── */}
      <div
        className="rounded-2xl overflow-hidden transition-all duration-500"
        style={{ border: `1.5px solid ${padBorderColor}`, background: padBg }}
      >
        {/* Inspiration strip — shown when a mood is selected */}
        {primaryMood && (
          <div className="px-5 pt-4 pb-2 border-b"
            style={{ borderColor: `${primaryMood.color}22` }}>
            <p className="text-xs italic"
              style={{ color: primaryMood.color, opacity: 0.75 }}>
              {primaryMood.inspiration}
            </p>
            <p className="text-[11px] mt-1"
              style={{ color: primaryMood.color, opacity: 0.5 }}>
              {primaryMood.prompt}
            </p>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={primaryMood?.prompt ?? 'Start writing your lyrics here…\n\nLet the words flow — every great song begins with a single line.'}
          className="w-full bg-transparent px-5 py-4 text-sm text-text-primary placeholder:text-text-muted leading-loose tracking-wide resize-none focus:outline-none font-mono"
          style={{ minHeight: 380 }}
        />

        {/* Pad footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t"
          style={{ borderColor: `${padBorderColor}33` }}>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span><span className="text-text-secondary font-medium">{wordCount(content)}</span> words</span>
            <span><span className="text-text-secondary font-medium">{lineCount(content)}</span> lines</span>
            <span><span className="text-text-secondary font-medium">{content.length}</span> chars</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            {allMoodTags.map(tag => (
              <span key={tag} style={{ color: MOOD_TAGS.find(m => m.id === tag)?.color ?? 'inherit' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Agree + save ── */}
      <div className="mt-5 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-yellow-400 rounded" />
          <span className="text-sm text-text-secondary leading-relaxed">
            I agree to showcase these lyrics publicly on Music Instincts and confirm I have the rights to submit them.
          </span>
        </label>

        <div className="flex items-center gap-3 flex-wrap">
          {newVersionMode ? (
            <>
              <div className="flex items-center gap-2 text-xs text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/20 px-3 py-1.5 rounded-lg">
                <Plus size={12} /> Saving as new version: "{versionName}"
              </div>
              <button onClick={() => setNewVersionMode(false)}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => { setNewVersionMode(true); setVersionName(`Draft ${versions.length + 1}`) }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-subtle text-xs text-text-secondary hover:text-text-primary hover:border-border transition-colors"
            >
              <Plus size={13} /> New Version
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave(newVersionMode)}
            disabled={!content.trim() || saveState === 'saving'}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent-yellow text-bg-primary font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity ml-auto"
          >
            {saveState === 'saving'
              ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
              : <><Save size={14} /> {newVersionMode ? 'Save New Version' : (currentLyricId ? 'Update' : 'Save')}</>
            }
          </button>
        </div>

        {saveState === 'saved' && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle2 size={13} />
            Saved{linkSongId ? ` and linked to ${songs.find(s => s.id === linkSongId)?.title ?? 'song'}` : ''}
          </div>
        )}
      </div>

      {/* ── All hashtags preview ── */}
      {allMoodTags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border-subtle">
          <p className="text-xs text-text-muted mb-2 flex items-center gap-1.5">
            <Hash size={11} /> Hashtags for this lyric
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-bg-elevated border border-border-subtle text-text-secondary">
              #{language}
            </span>
            {allMoodTags.map(tag => {
              const mood = MOOD_TAGS.find(m => m.id === tag)
              return (
                <span key={tag}
                  className="text-xs px-2 py-1 rounded-full border"
                  style={mood ? { color: mood.color, borderColor: `${mood.color}40`, background: mood.bg } : {}}
                >
                  #{tag}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
