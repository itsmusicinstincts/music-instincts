import Link from 'next/link'
import { Music } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="text-lg font-bold tracking-widest text-text-primary font-display">MUSIC</div>
            <div className="text-sm tracking-[0.3em] text-accent-yellow">INSTINCTS</div>
            <p className="mt-4 text-sm text-text-muted leading-relaxed">
              Original compositions spanning Spiritual, Filmy, and Semi Classical genres across Hindi, Tamil, Sanskrit and English.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-text-muted uppercase mb-4">Browse</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'All Compositions', href: '/library' },
                { label: 'Filmy', href: '/filmy' },
                { label: 'Spiritual', href: '/spiritual' },
                { label: 'Semi Classical', href: '/semi_classical' },
                { label: 'Search Lyrics', href: '/search' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-secondary hover:text-accent-yellow transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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
              <Music size={14} />
              Join the Community
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
