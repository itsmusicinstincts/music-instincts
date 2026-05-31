import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GENRE_LABELS, LANGUAGE_LABELS, GENRE_LANGUAGES } from '@/lib/data'
import type { Genre, Language } from '@/lib/data'
import { getSongsByGenreAndLanguage } from '@/lib/songs'
import SongCard from '@/components/SongCard'
import type { Metadata } from 'next'

const VALID_GENRES: Genre[] = ['spiritual', 'filmy', 'semi_classical']

interface Props {
  params: { genre: string; language: string }
}

export function generateStaticParams() {
  const params: { genre: string; language: string }[] = []
  for (const genre of VALID_GENRES) {
    for (const lang of GENRE_LANGUAGES[genre]) {
      params.push({ genre, language: lang })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const genre = params.genre as Genre
  const language = params.language as Language
  if (!VALID_GENRES.includes(genre)) return {}
  return {
    title: `${LANGUAGE_LABELS[language]} ${GENRE_LABELS[genre]} — Music Instincts`,
  }
}

export default async function GenreLanguagePage({ params }: Props) {
  const genre = params.genre as Genre
  const language = params.language as Language

  if (!VALID_GENRES.includes(genre) || !GENRE_LANGUAGES[genre]?.includes(language)) {
    notFound()
  }

  const songs = await getSongsByGenreAndLanguage(genre, language)
  const siblingLanguages = GENRE_LANGUAGES[genre]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/${genre}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        {GENRE_LABELS[genre]}
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary">
          {LANGUAGE_LABELS[language]}{' '}
          <span className="text-accent-yellow">{GENRE_LABELS[genre]}</span>
        </h1>
        <p className="text-text-muted mt-2 text-sm">{songs.length} composition{songs.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Language switcher */}
      <div className="flex flex-wrap gap-2 mb-8">
        {siblingLanguages.map((lang) => (
          <Link
            key={lang}
            href={`/${genre}/${lang}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              lang === language
                ? 'bg-accent-yellow text-bg-primary border-accent-yellow'
                : 'border-border-subtle text-text-secondary hover:text-text-primary hover:border-border'
            }`}
          >
            {LANGUAGE_LABELS[lang]}
          </Link>
        ))}
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <div className="text-4xl mb-4">♪</div>
          <p>No compositions yet in this category.</p>
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
