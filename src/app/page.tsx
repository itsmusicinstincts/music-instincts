import Link from 'next/link'
import { Music, ChevronRight, Mic2, Globe } from 'lucide-react'
import { GENRE_LABELS, GENRE_LANGUAGES, LANGUAGE_LABELS, SONGS } from '@/lib/data'
import type { Genre } from '@/lib/data'
import { getFeaturedSongs, getAllSongs } from '@/lib/songs'
import SongCard from '@/components/SongCard'

const GENRE_ICONS: Record<Genre, React.ReactNode> = {
  spiritual: <span className="text-2xl">🕉</span>,
  filmy: <span className="text-2xl">🎬</span>,
  semi_classical: <span className="text-2xl">🎼</span>,
}

const GENRE_DESCS: Record<Genre, string> = {
  spiritual: 'Devotional compositions in Hindi, Tamil and Sanskrit',
  filmy: 'Film-inspired originals in Tamil, Hindi and English',
  semi_classical: 'Ghazals, easy listening and semi-classical in Hindi and Tamil',
}

export default async function HomePage() {
  const [featured, allSongs] = await Promise.all([getFeaturedSongs(), getAllSongs()])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden staff-bg border-b border-border-subtle">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* decorative music notes */}
          <MusicNotesBg />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-yellow/30 bg-accent-yellow/5 text-accent-yellow text-xs font-medium mb-6">
              <Music size={12} />
              Original Compositions
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight">
              Where Music{' '}
              <span className="text-accent-yellow">Finds</span>
              <br />
              Its Soul
            </h1>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed">
              Explore original compositions spanning Spiritual, Filmy, and Semi Classical genres — in Hindi, Tamil, Sanskrit and English.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-yellow text-bg-primary font-semibold hover:opacity-90 transition-opacity"
              >
                Browse Library
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-text-secondary hover:text-text-primary hover:border-border transition-colors"
              >
                Search Lyrics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-text-primary">Featured</h2>
            <p className="text-sm text-text-muted mt-1">Handpicked compositions</p>
          </div>
          <Link href="/library" className="text-sm text-accent-yellow hover:opacity-80 transition-opacity flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Genre tiles */}
      <section className="border-t border-border-subtle bg-bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-8">Browse by Genre</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(Object.keys(GENRE_LABELS) as Genre[]).map((genre) => {
              const count = allSongs.filter((s) => s.genre === genre).length
              return (
                <Link
                  key={genre}
                  href={`/${genre}`}
                  className="group p-6 rounded-xl bg-bg-card border border-border-subtle hover:border-accent-yellow/40 hover:bg-bg-elevated transition-all"
                >
                  <div className="mb-3">{GENRE_ICONS[genre]}</div>
                  <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-accent-yellow transition-colors">
                    {GENRE_LABELS[genre]}
                  </h3>
                  <p className="text-sm text-text-muted mt-1 mb-3">{GENRE_DESCS[genre]}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {GENRE_LANGUAGES[genre].map((lang) => (
                      <span key={lang} className="text-xs px-2 py-0.5 rounded bg-bg-elevated text-text-secondary border border-border-subtle">
                        {LANGUAGE_LABELS[lang]}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">{count} composition{count !== 1 ? 's' : ''}</span>
                    <ChevronRight size={14} className="text-text-muted group-hover:text-accent-yellow transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Friends CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-bg-card border border-border-subtle p-8 md:p-12 staff-bg">
          <div className="relative max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center">
                <Mic2 size={18} className="text-accent-yellow" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-accent-yellow uppercase">Friends of Music Instincts</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-3">
              Are you a Lyricist?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Collaborate with Music Instincts. Submit your lyrics, get credited, and be part of a growing community of artists and composers.
            </p>
            <Link
              href="/friends"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-yellow text-bg-primary font-semibold hover:opacity-90 transition-opacity"
            >
              <Globe size={16} />
              Learn More — Coming Soon
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function MusicNotesBg() {
  const notes = ['♩', '♪', '♫', '♬', '𝄞', '𝄢']
  const positions = [
    { top: '10%', left: '5%', size: 24, opacity: 0.04, rotate: -15 },
    { top: '60%', left: '2%', size: 40, opacity: 0.03, rotate: 20 },
    { top: '20%', left: '80%', size: 32, opacity: 0.04, rotate: -8 },
    { top: '70%', left: '75%', size: 48, opacity: 0.03, rotate: 10 },
    { top: '40%', left: '55%', size: 20, opacity: 0.05, rotate: -20 },
    { top: '85%', left: '40%', size: 36, opacity: 0.03, rotate: 5 },
    { top: '5%', left: '45%', size: 28, opacity: 0.04, rotate: -12 },
    { top: '50%', left: '90%', size: 22, opacity: 0.04, rotate: 18 },
  ]
  return (
    <>
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute select-none pointer-events-none text-white"
          style={{
            top: pos.top,
            left: pos.left,
            fontSize: pos.size,
            opacity: pos.opacity,
            transform: `rotate(${pos.rotate}deg)`,
          }}
        >
          {notes[i % notes.length]}
        </div>
      ))}
    </>
  )
}
