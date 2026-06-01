'use client'

import { useState } from 'react'
import { Check, X, ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'

interface Submission {
  id: string
  title: string | null
  content: string
  language: string
  status: string
  admin_notes: string | null
  created_at: string
  copyright_agreed: boolean
  songs: { id: string; slug: string; title: string } | null
  lyricist_profiles: { display_name: string } | null
}

interface SongOption {
  id: string
  slug: string
  title: string
  lyric_group_id: string | null
  version_label: string | null
}

interface Props {
  submissions: Submission[]
  songs: SongOption[]
}

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-500/10 text-amber-300 border-amber-500/20',
  approved: 'bg-green-500/10 text-green-300 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-300 border-red-500/20',
}

export default function AdminActions({ submissions: initial, songs }: Props) {
  const [items, setItems] = useState(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  const visible = filter === 'all' ? items : items.filter((s) => s.status === filter)

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setLoading(id)
    const supabase = createClient()
    const { error } = await supabase
      .from('lyrics')
      .update({ status, admin_notes: notes[id] ?? null })
      .eq('id', id)

    if (!error) {
      setItems((prev) => prev.map((s) => s.id === id ? { ...s, status, admin_notes: notes[id] ?? null } : s))
    }
    setLoading(null)
  }

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${filter === f ? 'bg-accent-yellow text-bg-primary border-accent-yellow' : 'border-border-subtle text-text-secondary hover:text-text-primary'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16 text-text-muted">No {filter === 'all' ? '' : filter} submissions.</div>
      )}

      <div className="space-y-3">
        {visible.map((sub) => {
          const isOpen = expanded === sub.id
          return (
            <div key={sub.id} className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[sub.status]}`}>{sub.status}</span>
                    <span className="font-medium text-text-primary text-sm truncate">{sub.title ?? '(untitled)'}</span>
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    {sub.songs?.title && <span>Song: <strong className="text-text-secondary">{sub.songs.title}</strong> · </span>}
                    By <strong className="text-text-secondary">{sub.lyricist_profiles?.display_name ?? 'unknown'}</strong>
                    {' · '}{sub.language}{' · '}{new Date(sub.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button onClick={() => setExpanded(isOpen ? null : sub.id)} className="text-text-muted hover:text-text-secondary transition-colors p-1 shrink-0">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div className="px-4 pb-4 border-t border-border-subtle pt-4 space-y-4">
                  <pre className="text-sm text-text-secondary font-sans whitespace-pre-wrap leading-loose bg-bg-elevated rounded-lg p-4 max-h-64 overflow-y-auto">
                    {sub.content}
                  </pre>

                  {/* Admin notes */}
                  <div>
                    <label className="text-xs text-text-muted uppercase tracking-widest block mb-1.5">Admin Notes (shown to lyricist on rejection)</label>
                    <input
                      type="text"
                      value={notes[sub.id] ?? sub.admin_notes ?? ''}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                      placeholder="Reason for rejection, or feedback…"
                      className="w-full px-3 py-2 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50"
                    />
                  </div>

                  {/* Actions */}
                  {sub.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(sub.id, 'approved')}
                        disabled={loading === sub.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm hover:bg-green-500/20 transition-colors disabled:opacity-50"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus(sub.id, 'rejected')}
                        disabled={loading === sub.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  )}

                  {sub.status !== 'pending' && (
                    <button
                      onClick={() => updateStatus(sub.id, sub.status === 'approved' ? 'rejected' : 'approved')}
                      disabled={loading === sub.id}
                      className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                    >
                      Change to {sub.status === 'approved' ? 'rejected' : 'approved'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
