import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Music Instincts',
  description: 'Original compositions by Music Instincts — Spiritual, Filmy, Semi Classical across Hindi, Tamil, Sanskrit and English.',
  metadataBase: new URL('https://musicinstincts.com'),
  openGraph: {
    title: 'Music Instincts',
    description: 'Original compositions — Spiritual, Filmy, Semi Classical.',
    url: 'https://musicinstincts.com',
    siteName: 'Music Instincts',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
