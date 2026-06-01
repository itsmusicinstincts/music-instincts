import Link from 'next/link'
import { Music } from 'lucide-react'
import { CATEGORY_LABELS, CATEGORY_GENRES, GENRE_LABELS, toSlug } from '@/lib/data'
import type { Category } from '@/lib/data'

const CATEGORIES: Category[] = ['original_compositions', 'video_edits']

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-lg font-bold tracking-widest text-text-primary font-display">MUSIC</div>
            <div className="text-sm tracking-[0.3em] text-accent-yellow">INSTINCTS</div>
            <p className="mt-4 text-sm text-text-muted leading-relaxed">
              Original compositions and video edits spanning Spiritual, Filmy, and Semi Classical genres.
            </p>
          </div>

          {/* Category columns */}
          {CATEGORIES.map((cat) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">
                {CATEGORY_LABELS[cat]}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${toSlug(cat)}`} className="text-text-secondary hover:text-accent-yellow transition-colors">
                    All {CATEGORY_LABELS[cat]}
                  </Link>
                </li>
                {CATEGORY_GENRES[cat].map((genre) => (
                  <li key={genre}>
                    <Link href={`/${toSlug(cat)}/${toSlug(genre)}`} className="text-text-secondary hover:text-accent-yellow transition-colors">
                      {GENRE_LABELS[genre]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Collaborate */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">Collaborate</h3>
            <p className="text-sm text-text-secondary mb-4">
              Are you a lyricist? Join the Friends of Music Instincts community.
            </p>
            <Link
              href="/friends"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow text-bg-primary text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Music size={14} /> Join the Community
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <span>© {new Date().getFullYear()} Music Instincts. All rights reserved.</span>
          <span>musicinstincts.com</span>
        </div>
      </div>
    </footer>
  )
}
