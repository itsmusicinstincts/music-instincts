'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { SONGS, GENRE_LABELS, LANGUAGE_LABELS, GENRE_LANGUAGES } from '@/lib/data'
import type { Genre, Language } from '@/lib/data'
import SongCard from '@/components/SongCard'

const ALL_GENRES = Object.keys(GENRE_LABELS) as Genre[]

export default function LibraryPage() {
  const [activeGenre, setActiveGenre] = useState<Genre | 'all'>('all')
  const [activeLang, setActiveLang] = useState<Language | 'all'>('all')
  const [query, setQuery] = useState('')

  const availableLanguages: Language[] =
    activeGenre === 'all'
      ? (Array.from(new Set(SONGS.map((s) => s.language))) as Language[])
      : GENRE_LANGUAGES[activeGenre]

  const filtered = SONGS.filter((s) => {
    if (activeGenre !== 'all' && s.genre !== activeGenre) return false
    if (activeLang !== 'all' && s.language !== activeLang) return false
    if (query) {
      const q = query.toLowerCase()
      return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    }
    return true
  })

  function handleGenreChange(g: Genre | 'all') {
    setActiveGenre(g)
    setActiveLang('all')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-text-primary">Library</h1>
        <p className="text-text-secondary mt-2">All compositions by Music Instincts</p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search compositions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-bg-card border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors"
        />
      </div>

      {/* Genre tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleGenreChange('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            activeGenre === 'all'
              ? 'bg-accent-yellow text-bg-primary border-accent-yellow'
              : 'border-border-subtle text-text-secondary hover:text-text-primary hover:border-border bg-transparent'
          }`}
        >
          All
        </button>
        {ALL_GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreChange(genre)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeGenre === genre
                ? 'bg-accent-yellow text-bg-primary border-accent-yellow'
                : 'border-border-subtle text-text-secondary hover:text-text-primary hover:border-border bg-transparent'
            }`}
          >
            {GENRE_LABELS[genre]}
          </button>
        ))}
      </div>

      {/* Language sub-tabs */}
      {activeGenre !== 'all' && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveLang('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeLang === 'all'
                ? 'text-accent-yellow bg-accent-yellow/10'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            All Languages
          </button>
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeLang === lang
                  ? 'text-accent-yellow bg-accent-yellow/10'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>
      )}
      {activeGenre === 'all' && <div className="mb-8" />}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <div className="text-4xl mb-4">♪</div>
          <p>No compositions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-text-muted">{filtered.length} composition{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  )
}
