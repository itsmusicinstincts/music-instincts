'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { label: 'Library', href: '/library' },
  { label: 'Filmy', href: '/filmy' },
  { label: 'Spiritual', href: '/spiritual' },
  { label: 'Semi Classical', href: '/semi_classical' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-primary/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <LogoMark />
            <div className="hidden sm:block">
              <div className="text-sm font-bold tracking-widest text-text-primary leading-none">MUSIC</div>
              <div className="text-xs font-light tracking-[0.3em] text-accent-yellow leading-none mt-0.5">INSTINCTS</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'text-accent-yellow bg-accent-yellow/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </Link>
            <Link
              href="/friends"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-yellow text-bg-primary text-xs font-semibold transition-opacity hover:opacity-90"
            >
              <Music size={12} />
              Friends
            </Link>
            <button
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-border-subtle bg-bg-primary">
          <div className="px-4 py-3 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'text-accent-yellow bg-accent-yellow/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/friends"
              onClick={() => setOpen(false)}
              className="block mt-2 px-3 py-2 rounded-md text-sm text-accent-yellow font-medium"
            >
              Friends of Music Instincts
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

function LogoMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="16" fill="#111114" />
      <g opacity="0.12">
        <line x1="-30" y1="78" x2="230" y2="78" stroke="white" strokeWidth="1.5" transform="rotate(-10 100 100)" />
        <line x1="-30" y1="92" x2="230" y2="92" stroke="white" strokeWidth="1.5" transform="rotate(-10 100 100)" />
        <line x1="-30" y1="106" x2="230" y2="106" stroke="white" strokeWidth="1.5" transform="rotate(-10 100 100)" />
        <line x1="-30" y1="120" x2="230" y2="120" stroke="white" strokeWidth="1.5" transform="rotate(-10 100 100)" />
        <line x1="-30" y1="134" x2="230" y2="134" stroke="white" strokeWidth="1.5" transform="rotate(-10 100 100)" />
      </g>
      <text x="18" y="150" fontFamily="Georgia, serif" fontSize="118" fontWeight="700" fill="#F5C200">M</text>
      <rect x="150" y="46" width="11" height="108" rx="3" fill="white" />
      <rect x="142" y="46" width="27" height="11" rx="3" fill="white" />
      <rect x="142" y="143" width="27" height="11" rx="3" fill="white" />
    </svg>
  )
}
