'use client'

import { useState, useDeferredValue } from 'react'
import { Search } from 'lucide-react'
import { searchSongs } from '@/lib/data'
import SongCard from '@/components/SongCard'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const results = deferred.trim().length > 1 ? searchSongs(deferred) : []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-3">Search</h1>
        <p className="text-text-secondary">Search by song title, composer, or lyrics</p>
      </div>

      {/* Search input */}
      <div className="relative mb-10">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          autoFocus
          placeholder="Try a song title or a line of lyrics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl bg-bg-card border border-border-subtle text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors"
        />
      </div>

      {/* Results */}
      {deferred.trim().length > 1 ? (
        results.length > 0 ? (
          <>
            <p className="text-xs text-text-muted mb-5">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{deferred}&rdquo;</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {results.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <div className="text-4xl mb-4">♪</div>
            <p>No results for &ldquo;{deferred}&rdquo;</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        )
      ) : (
        <div className="text-center py-16 text-text-muted">
          <div className="text-5xl mb-4 opacity-20">𝄞</div>
          <p className="text-sm">Start typing to search compositions and lyrics</p>
        </div>
      )}
    </div>
  )
}
