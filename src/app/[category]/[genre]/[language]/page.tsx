import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import {
  CATEGORY_LABELS, CATEGORY_GENRES, GENRE_LABELS,
  DISPLAY_LANGUAGE_LABELS, DISPLAY_LANGUAGE_GROUPS,
  VALID_CATEGORIES, toSlug, fromSlug, getLanguageLabel,
} from '@/lib/data'
import type { Category, Genre, DisplayLanguageGroup } from '@/lib/data'
import { getSongsByCategoryGenreAndLanguageGroup } from '@/lib/songs'
import SongCard from '@/components/SongCard'
import type { Metadata } from 'next'

interface Props { params: Promise<{ category: string; genre: string; language: string }> }

export function generateStaticParams() {
  const params: { category: string; genre: string; language: string }[] = []
  for (const category of VALID_CATEGORIES) {
    for (const genre of CATEGORY_GENRES[category]) {
      for (const lang of DISPLAY_LANGUAGE_GROUPS) {
        params.push({ category: toSlug(category), genre: toSlug(genre), language: lang })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: catSlug, genre: genSlug, language } = await params
  const category = fromSlug(catSlug) as Category
  const genre = fromSlug(genSlug) as Genre
  const langLabel = DISPLAY_LANGUAGE_LABELS[language as DisplayLanguageGroup] ?? language
  return { title: `${langLabel} ${GENRE_LABELS[genre]} — Music Instincts` }
}

export default async function LanguagePage({ params }: Props) {
  const { category: catSlug, genre: genSlug, language } = await params
  const category = fromSlug(catSlug) as Category
  const genre = fromSlug(genSlug) as Genre
  const langGroup = language as DisplayLanguageGroup

  if (!VALID_CATEGORIES.includes(category) || !CATEGORY_GENRES[category].includes(genre) || !DISPLAY_LANGUAGE_GROUPS.includes(langGroup)) {
    notFound()
  }

  const songs = await getSongsByCategoryGenreAndLanguageGroup(category, genre, langGroup)
  const otherLanguages = langGroup === 'other'
    ? Array.from(new Set(songs.map((s) => getLanguageLabel(s.language))))
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link href={`/${toSlug(category)}`} className="hover:text-text-secondary transition-colors">
          {CATEGORY_LABELS[category]}
        </Link>
        <span>/</span>
        <Link href={`/${toSlug(category)}/${toSlug(genre)}`} className="hover:text-text-secondary transition-colors">
          {GENRE_LABELS[genre]}
        </Link>
        <span>/</span>
        <span className="text-text-primary">{DISPLAY_LANGUAGE_LABELS[langGroup]}</span>
      </div>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          {DISPLAY_LANGUAGE_LABELS[langGroup]}{' '}
          <span className="text-accent-yellow">{GENRE_LABELS[genre]}</span>
        </h1>
        {langGroup === 'other' && otherLanguages.length > 0 && (
          <p className="text-text-muted text-sm mt-1">{otherLanguages.join(' · ')}</p>
        )}
        <p className="text-text-muted mt-2 text-sm">{songs.length} composition{songs.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Language switcher */}
      <div className="flex flex-wrap gap-2 mb-8">
        {DISPLAY_LANGUAGE_GROUPS.map((lang) => (
          <Link
            key={lang}
            href={`/${toSlug(category)}/${toSlug(genre)}/${lang}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              lang === langGroup
                ? 'bg-accent-yellow text-bg-primary border-accent-yellow'
                : 'border-border-subtle text-text-secondary hover:text-text-primary hover:border-border'
            }`}
          >
            {DISPLAY_LANGUAGE_LABELS[lang]}
          </Link>
        ))}
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <div className="text-4xl mb-4">♪</div>
          <p>No compositions yet in this language.</p>
          <p className="text-sm mt-2">Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  )
}
