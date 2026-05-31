'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-sm text-accent-yellow">
        <span>✓</span>
        <span>You&apos;re on the list! We&apos;ll be in touch.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-full bg-bg-card border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-yellow/50 transition-colors"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-full bg-accent-yellow text-bg-primary text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Notify Me
      </button>
    </form>
  )
}
