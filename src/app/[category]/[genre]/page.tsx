import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import {
  CATEGORY_LABELS, CATEGORY_GENRES, GENRE_LABELS,
  DISPLAY_LANGUAGE_GROUPS, DISPLAY_LANGUAGE_LABELS,
  VALID_CATEGORIES, toSlug, fromSlug, getLanguageLabel,
} from '@/lib/data'
import type { Category, Genre } from '@/lib/data'
import { getSongsByCategoryAndGenre } from '@/lib/songs'
import SongCard from '@/components/SongCard'
import type { Metadata } from 'next'

interface Props { params: Promise<{ category: string; genre: string }> }

export function generateStaticParams() {
  const params: { category: string; genre: string }[] = []
  for (const category of VALID_CATEGORIES) {
    for (const genre of CATEGORY_GENRES[category]) {
      params.push({ category: toSlug(category), genre: toSlug(genre) })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: catSlug, genre: genSlug } = await params
  const category = fromSlug(catSlug) as Category
  const genre = fromSlug(genSlug) as Genre
  if (!VALID_CATEGORIES.includes(category)) return {}
  return { title: `${GENRE_LABELS[genre] ?? genre} — ${CATEGORY_LABELS[category]} — Music Instincts` }
}

export default async function GenrePage({ params }: Props) {
  const { category: catSlug, genre: genSlug } = await params
  const category = fromSlug(catSlug) as Category
  const genre = fromSlug(genSlug) as Genre

  if (!VALID_CATEGORIES.includes(category) || !CATEGORY_GENRES[category].includes(genre)) notFound()

  const songs = await getSongsByCategoryAndGenre(category, genre)

  const categorySlug = toSlug(category)
  const genreSlug = toSlug(genre)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/${categorySlug}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors mb-8"
      >
        <ChevronLeft size={16} /> {CATEGORY_LABELS[category]}
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          {GENRE_LABELS[genre]}{' '}
          <span className="text-text-muted font-normal text-xl">/ {CATEGORY_LABELS[category]}</span>
        </h1>
        <p className="text-text-muted mt-2 text-sm">{songs.length} composition{songs.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Language sub-tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {DISPLAY_LANGUAGE_GROUPS.map((lang) => {
          const count = songs.filter((s) => {
            if (lang === 'other') return s.language !== 'hindi' && s.language !== 'tamil'
            return s.language === lang
          }).length
          if (count === 0) return null
          return (
            <Link
              key={lang}
              href={`/${categorySlug}/${genreSlug}/${lang}`}
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-yellow/40 transition-colors"
            >
              {DISPLAY_LANGUAGE_LABELS[lang]} ({count})
            </Link>
          )
        })}
      </div>

      {/* Songs grouped by language */}
      {DISPLAY_LANGUAGE_GROUPS.map((lang) => {
        const langSongs = songs.filter((s) => {
          if (lang === 'other') return s.language !== 'hindi' && s.language !== 'tamil'
          return s.language === lang
        })
        if (langSongs.length === 0) return null

        const otherLangNames = lang === 'other'
          ? Array.from(new Set(langSongs.map((s) => getLanguageLabel(s.language ?? '')).filter(Boolean))).join(', ')
          : ''

        return (
          <section key={lang} className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">
                {DISPLAY_LANGUAGE_LABELS[lang]}
                {otherLangNames && (
                  <span className="ml-2 text-sm font-normal text-text-muted">({otherLangNames})</span>
                )}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {langSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </section>
        )
      })}

      {songs.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          <div className="text-4xl mb-4">♪</div>
          <p>No compositions yet in this category.</p>
        </div>
      )}
    </div>
  )
}
