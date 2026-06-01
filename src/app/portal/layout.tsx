'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Music, LayoutDashboard, PenLine } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const isLoginPage = pathname === '/portal/login'

  useEffect(() => {
    if (isLoginPage) { setChecking(false); return }
    if (!supabase) { router.replace('/portal/login'); return }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/portal/login')
      } else {
        setEmail(session.user.email ?? null)
        setChecking(false)
      }
    })
  }, [pathname, isLoginPage, router])

  async function handleLogout() {
    await supabase?.auth.signOut()
    router.replace('/portal/login')
  }

  if (checking && !isLoginPage) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 rounded-full border-2 border-accent-yellow/40 border-t-accent-yellow animate-spin" />
          Verifying session…
        </div>
      </div>
    )
  }

  if (isLoginPage) return <>{children}</>

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Portal top bar */}
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-primary/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-xs font-bold tracking-widest text-text-primary">MUSIC</div>
              <div className="text-[10px] tracking-[0.3em] text-accent-yellow">INSTINCTS</div>
            </Link>
            <span className="text-border-subtle">|</span>
            <span className="text-xs font-semibold tracking-widest text-accent-yellow uppercase">Portal</span>
          </div>
          <nav className="flex items-center gap-1">
            <Link href="/portal/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${pathname === '/portal/dashboard' ? 'text-accent-yellow bg-accent-yellow/10' : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'}`}>
              <LayoutDashboard size={13} /> Dashboard
            </Link>
            <Link href="/portal/lyrics/new"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${pathname.startsWith('/portal/lyrics') ? 'text-accent-yellow bg-accent-yellow/10' : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'}`}>
              <PenLine size={13} /> Add Lyrics
            </Link>
            <div className="w-px h-4 bg-border-subtle mx-1" />
            {email && <span className="text-xs text-text-muted hidden sm:block">{email}</span>}
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-text-secondary hover:bg-bg-elevated transition-colors ml-1">
              <LogOut size={13} /> Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
