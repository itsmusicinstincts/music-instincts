'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PortalLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  // If already logged in, redirect
  useEffect(() => {
    supabase?.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/portal/dashboard')
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) { setError('Supabase is not configured.'); return }
    setLoading(true)
    setError(null)

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) { setError(err.message); setLoading(false); return }
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) { setError(err.message); setLoading(false); return }
      // After signup, show confirmation note
      setError(null)
      setLoading(false)
      setMode('login')
      return
    }

    router.replace('/portal/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-xl font-bold tracking-widest text-text-primary font-display">MUSIC</div>
            <div className="text-sm tracking-[0.35em] text-accent-yellow">INSTINCTS</div>
          </Link>
          <p className="text-text-muted text-sm mt-4">Collaborator Portal</p>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-2xl p-7 shadow-2xl">
          <h1 className="text-lg font-semibold text-text-primary mb-6">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h1>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 rounded-xl p-3 mb-5 text-sm text-red-300">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-accent-yellow text-bg-primary font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-bg-primary/30 border-t-bg-primary animate-spin" /> Signing in…</>
              ) : (
                <><Music size={14} /> {mode === 'login' ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border-subtle text-center">
            {mode === 'login' ? (
              <p className="text-xs text-text-muted">
                New collaborator?{' '}
                <button onClick={() => setMode('signup')} className="text-accent-yellow hover:opacity-80 font-medium">
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-text-muted">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-accent-yellow hover:opacity-80 font-medium">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          <Link href="/" className="hover:text-text-secondary transition-colors">← Back to Music Instincts</Link>
        </p>
      </div>
    </div>
  )
}
