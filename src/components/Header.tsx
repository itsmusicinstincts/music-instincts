'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { CATEGORY_GENRES, GENRE_LABELS, CATEGORY_LABELS, toSlug } from '@/lib/data'
import type { Category } from '@/lib/data'

const CATEGORIES: Category[] = ['original_compositions', 'video_edits']

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdown, setDropdown] = useState<Category | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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
          <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
            <Link
              href="/library"
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                pathname === '/library' ? 'text-accent-yellow bg-accent-yellow/10' : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              Library
            </Link>

            {CATEGORIES.map((cat) => {
              const catSlug = toSlug(cat)
              const isActive = pathname.startsWith(`/${catSlug}`)
              const isOpen = dropdown === cat
              return (
                <div key={cat} className="relative">
                  <button
                    onClick={() => setDropdown(isOpen ? null : cat)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive ? 'text-accent-yellow bg-accent-yellow/10' : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-bg-card border border-border-subtle rounded-xl shadow-lg py-1 z-50">
                      <Link
                        href={`/${catSlug}`}
                        onClick={() => setDropdown(null)}
                        className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                      >
                        All {CATEGORY_LABELS[cat]}
                      </Link>
                      <div className="border-t border-border-subtle my-1" />
                      {CATEGORY_GENRES[cat].map((genre) => (
                        <Link
                          key={genre}
                          href={`/${catSlug}/${toSlug(genre)}`}
                          onClick={() => setDropdown(null)}
                          className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                        >
                          {GENRE_LABELS[genre]}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors" aria-label="Search">
              <Search size={18} />
            </Link>
            <Link href="/friends" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-yellow text-bg-primary text-xs font-semibold transition-opacity hover:opacity-90">
              <Music size={12} /> Friends
            </Link>
            <button className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-subtle bg-bg-primary">
          <div className="px-4 py-3 space-y-1">
            <Link href="/library" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated">Library</Link>
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <Link href={`/${toSlug(cat)}`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:bg-bg-elevated">
                  {CATEGORY_LABELS[cat]}
                </Link>
                {CATEGORY_GENRES[cat].map((genre) => (
                  <Link key={genre} href={`/${toSlug(cat)}/${toSlug(genre)}`} onClick={() => setMobileOpen(false)} className="block pl-6 pr-3 py-1.5 rounded-md text-sm text-text-muted hover:text-text-secondary hover:bg-bg-elevated">
                    {GENRE_LABELS[genre]}
                  </Link>
                ))}
              </div>
            ))}
            <Link href="/friends" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm text-accent-yellow font-medium">
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
