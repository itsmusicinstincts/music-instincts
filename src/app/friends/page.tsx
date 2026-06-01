import Link from 'next/link'
import { Mic2, ScrollText, Star, ArrowRight, Check, Music } from 'lucide-react'

const BENEFITS = [
  { icon: <ScrollText size={20} />, title: 'Submit Lyrics', desc: 'Add lyrics for existing compositions and get credited on the site.' },
  { icon: <Music size={20} />, title: 'Multiple Versions', desc: 'Submit different language or remix versions of the same song.' },
  { icon: <Star size={20} />, title: 'Get Credited', desc: 'Your name appears on every song page where your lyrics are used.' },
  { icon: <Mic2 size={20} />, title: 'Collaborate', desc: 'Work directly with Music Instincts on future original compositions.' },
]

const STEPS = [
  { n: '01', title: 'Create an account', desc: 'Sign up with your email — free, takes 30 seconds.' },
  { n: '02', title: 'Agree to terms', desc: 'Confirm you own the lyrics or have rights to share them.' },
  { n: '03', title: 'Submit lyrics', desc: 'Choose a song, write or paste lyrics, hit submit.' },
  { n: '04', title: 'Go live', desc: 'After review, your lyrics appear on the song page with your credit.' },
]

export default function FriendsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-yellow/30 bg-accent-yellow/5 text-accent-yellow text-xs font-semibold tracking-widest uppercase mb-6">
          <Mic2 size={12} /> Friends of Music Instincts
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary leading-tight mb-4">
          Lyrics meet <span className="text-accent-yellow">Composition</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          A community for lyricists and collaborators. Submit lyrics, get credited, and be part of the Music Instincts journey.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link href="/friends/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-yellow text-bg-primary font-semibold hover:opacity-90 transition-opacity">
            Join Now — It&apos;s Free <ArrowRight size={16} />
          </Link>
          <Link href="/friends/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-text-secondary hover:text-text-primary hover:border-border-subtle transition-colors">
            Sign In
          </Link>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {BENEFITS.map((b) => (
          <div key={b.title} className="p-6 rounded-2xl bg-bg-card border border-border-subtle hover:border-accent-yellow/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center text-accent-yellow mb-4 group-hover:bg-accent-yellow/20 transition-colors">
              {b.icon}
            </div>
            <h3 className="font-semibold text-text-primary mb-1">{b.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="font-display text-2xl font-semibold text-text-primary text-center mb-10">How It Works</h2>
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-accent-yellow">{s.n}</span>
              </div>
              <div className="pt-1.5">
                <h3 className="font-semibold text-text-primary">{s.title}</h3>
                <p className="text-sm text-text-secondary mt-0.5">{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && <div className="ml-5 mt-10 w-px h-6 bg-border-subtle absolute" />}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-bg-card border border-border-subtle p-8 text-center staff-bg">
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-3">Ready to collaborate?</h2>
        <p className="text-text-secondary mb-6">Join the growing community of lyricists on Music Instincts.</p>
        <Link href="/friends/signup" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent-yellow text-bg-primary font-semibold hover:opacity-90 transition-opacity">
          Create Your Account <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
