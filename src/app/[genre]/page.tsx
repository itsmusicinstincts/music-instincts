import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { GENRE_LABELS, LANGUAGE_LABELS, GENRE_LANGUAGES } from '@/lib/data'
import type { Genre, Language } from '@/lib/data'
import { getSongsByGenre } from '@/lib/songs'
import SongCard from '@/components/SongCard'
import type { Metadata } from 'next'

const VALID_GENRES: Genre[] = ['spiritual', 'filmy', 'semi_classical']

interface Props {
  params: { genre: string }
}

export function generateStaticParams() {
  return VALID_GENRES.map((genre) => ({ genre }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const genre = params.genre as Genre
  if (!VALID_GENRES.includes(genre)) return {}
  return { title: `${GENRE_LABELS[genre]} — Music Instincts` }
}

export default async function GenrePage({ params }: Props) {
  const genre = params.genre as Genre
  if (!VALID_GENRES.includes(genre)) notFound()

  const songs = await getSongsByGenre(genre)
  const languages = GENRE_LANGUAGES[genre]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-text-primary">{GENRE_LABELS[genre]}</h1>
        <p className="text-text-muted mt-2 text-sm">{songs.length} composition{songs.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Language sub-sections */}
      {languages.map((lang) => {
          const langSongs = songs.filter((s) => s.genre === genre && s.language === lang)
        if (langSongs.length === 0) return null
        return (
          <section key={lang} className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">{LANGUAGE_LABELS[lang as Language]}</h2>
              <Link
                href={`/${genre}/${lang}`}
                className="text-sm text-accent-yellow hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                View all <ChevronRight size={14} />
              </Link>
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
          <p>No compositions yet. Check back soon.</p>
        </div>
      )}
    </div>
  )
}
