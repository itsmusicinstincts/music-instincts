import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import AdminActions from '@/components/AdminActions'
import { ShieldCheck } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/friends/login?redirectTo=/admin')

  const { data: profile } = await supabase
    .from('lyricist_profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') redirect('/friends/dashboard')

  // Fetch all lyrics submissions with song and lyricist info
  const { data: submissions } = await supabase
    .from('lyrics')
    .select('id, title, content, language, status, admin_notes, created_at, copyright_agreed, songs(id, slug, title), lyricist_profiles(display_name)')
    .order('created_at', { ascending: false })

  // Fetch all songs for linking
  const { data: songs } = await supabase
    .from('songs').select('id, slug, title, lyric_group_id, version_label').eq('status', 'published').order('title')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-accent-yellow" />
          <h1 className="font-display text-2xl font-bold text-text-primary">Admin Panel</h1>
        </div>
        <Link href="/friends/dashboard" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
          ← Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex gap-6 text-sm">
          <span className="text-text-muted">Total: <strong className="text-text-primary">{submissions?.length ?? 0}</strong></span>
          <span className="text-amber-400">Pending: <strong>{submissions?.filter((s) => s.status === 'pending').length ?? 0}</strong></span>
          <span className="text-green-400">Approved: <strong>{submissions?.filter((s) => s.status === 'approved').length ?? 0}</strong></span>
          <span className="text-red-400">Rejected: <strong>{submissions?.filter((s) => s.status === 'rejected').length ?? 0}</strong></span>
        </div>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
  <AdminActions submissions={(submissions ?? []) as any[]} songs={songs ?? []} />
    </div>
  )
}
