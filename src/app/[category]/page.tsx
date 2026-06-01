import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {
  CATEGORY_LABELS, CATEGORY_GENRES, GENRE_LABELS,
  DISPLAY_LANGUAGE_GROUPS, DISPLAY_LANGUAGE_LABELS,
  VALID_CATEGORIES, toSlug, fromSlug,
} from '@/lib/data'
import type { Category, Genre, Song } from '@/lib/data'
import { getSongsByCategory } from '@/lib/songs'
import SongCard from '@/components/SongCard'
import type { Metadata } from 'next'

interface Props { params: Promise<{ category: string }> }

export function generateStaticParams() {
  return VALID_CATEGORIES.map((c) => ({ category: toSlug(c) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlugParam } = await params
  const category = fromSlug(categorySlugParam) as Category
  if (!VALID_CATEGORIES.includes(category)) return {}
  return { title: `${CATEGORY_LABELS[category]} — Music Instincts` }
}

const CATEGORY_ICONS: Record<Category, string> = {
  original_compositions: '🎵',
  video_edits: '🎬',
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlugParam } = await params
  const category = fromSlug(categorySlugParam) as Category
  if (!VALID_CATEGORIES.includes(category)) notFound()

  const allSongs = await getSongsByCategory(category)
  const genres = CATEGORY_GENRES[category]

  const songsByGenre: Record<Genre, Song[]> = {} as Record<Genre, Song[]>
  for (const genre of genres) {
    songsByGenre[genre] = allSongs.filter((s) => s.genre === genre)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="text-2xl mb-2">{CATEGORY_ICONS[category]}</div>
        <h1 className="font-display text-3xl font-bold text-text-primary">{CATEGORY_LABELS[category]}</h1>
        <p className="text-text-muted mt-2 text-sm">{allSongs.length} composition{allSongs.length !== 1 ? 's' : ''}</p>
      </div>

      {genres.map((genre) => {
        const genreSongs = songsByGenre[genre]
        if (genreSongs.length === 0) return null
        return (
          <section key={genre} className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold text-text-primary font-display">{GENRE_LABELS[genre]}</h2>
                <div className="flex gap-2 mt-2">
                  {DISPLAY_LANGUAGE_GROUPS.map((lang) => {
                    const count = genreSongs.filter((s) =>
                      lang === 'other' ? s.language !== 'hindi' && s.language !== 'tamil' : s.language === lang
                    ).length
                    if (count === 0) return null
                    return (
                      <Link key={lang} href={`/${toSlug(category)}/${toSlug(genre)}/${lang}`}
                        className="text-xs px-3 py-1 rounded-full border border-border-subtle text-text-secondary hover:border-accent-yellow/40 hover:text-accent-yellow transition-colors"
                      >
                        {DISPLAY_LANGUAGE_LABELS[lang]} ({count})
                      </Link>
                    )
                  })}
                </div>
              </div>
              <Link href={`/${toSlug(category)}/${toSlug(genre)}`} className="text-sm text-accent-yellow hover:opacity-80 flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {genreSongs.slice(0, 3).map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </section>
        )
      })}

      {allSongs.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          <div className="text-4xl mb-4">♪</div>
          <p>No compositions yet. Check back soon.</p>
        </div>
      )}
    </div>
  )
}
