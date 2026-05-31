import Link from 'next/link'
import { Mic2, Music, FileText, CheckCircle, Globe, ArrowRight } from 'lucide-react'
import WaitlistForm from '@/components/WaitlistForm'

const BENEFITS = [
  {
    icon: <Music size={18} className="text-accent-yellow" />,
    title: 'Get Published',
    desc: 'Your approved lyrics appear on musicinstincts.com alongside the official composition.',
  },
  {
    icon: <FileText size={18} className="text-accent-yellow" />,
    title: 'Full Attribution',
    desc: 'Every submission carries your name. Your creative contribution is always credited.',
  },
  {
    icon: <CheckCircle size={18} className="text-accent-yellow" />,
    title: 'Contract Pathway',
    desc: 'Exceptional work may lead to a formal contract and commercial collaboration.',
  },
  {
    icon: <Globe size={18} className="text-accent-yellow" />,
    title: 'Global Reach',
    desc: 'Music Instincts reaches audiences across India and around the world.',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Sign Up', desc: 'Create your Friends account with your email address.' },
  { step: '02', title: 'Submit Lyrics', desc: 'Choose a composition and submit your lyrics with a copyright declaration.' },
  { step: '03', title: 'Review', desc: 'The Music Instincts team reviews your submission for quality and originality.' },
  { step: '04', title: 'Go Live', desc: 'Approved lyrics are published on the song page with full attribution to you.' },
]

export default function FriendsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-subtle staff-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent-yellow/10 border border-accent-yellow/25 flex items-center justify-center">
                <Mic2 size={18} className="text-accent-yellow" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-accent-yellow uppercase">Friends of Music Instincts</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary leading-tight">
              Collaborate with<br />
              <span className="text-accent-yellow">Music Instincts</span>
            </h1>
            <p className="mt-5 text-lg text-text-secondary leading-relaxed">
              Are you a lyricist? Join our growing community of creative collaborators. Submit lyrics, get credited, and be part of something timeless.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-yellow/10 border border-accent-yellow/30 text-accent-yellow font-semibold text-sm">
                <Music size={16} />
                Portal Opening Soon
              </div>
              <span className="text-sm text-text-muted">Leave your email to be first in</span>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-3">Join the Waitlist</h2>
          <p className="text-text-secondary mb-6 text-sm">We&apos;ll notify you the moment the Friends portal goes live.</p>
          <WaitlistForm />
        </div>
      </section>


      {/* Benefits */}
      <section className="border-t border-border-subtle bg-bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="font-display text-2xl font-semibold text-text-primary mb-8 text-center">Why Join?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="p-5 rounded-xl bg-bg-card border border-border-subtle">
                <div className="w-9 h-9 rounded-lg bg-accent-yellow/10 border border-accent-yellow/15 flex items-center justify-center mb-4">
                  {b.icon}
                </div>
                <h3 className="font-semibold text-text-primary text-sm mb-1">{b.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} className="relative flex flex-col items-start">
              <div className="text-4xl font-bold text-accent-yellow/20 font-display mb-3">{step.step}</div>
              <h3 className="font-semibold text-text-primary mb-1">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <ArrowRight size={16} className="hidden lg:block absolute -right-3 top-8 text-border" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Back to library CTA */}
      <section className="border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">Explore the current catalog while you wait.</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm text-text-secondary hover:text-text-primary hover:border-accent-yellow/40 transition-colors"
          >
            Browse Library <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}

