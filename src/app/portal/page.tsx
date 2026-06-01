'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PortalRoot() {
  const router = useRouter()
  useEffect(() => {
    if (!supabase) { router.replace('/portal/login'); return }
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? '/portal/dashboard' : '/portal/login')
    })
  }, [router])
  return null
}
