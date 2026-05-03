'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface UseUserReturn {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAuthenticated: boolean
  isInstructor: boolean
  isAdmin: boolean
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const fetchUserAndProfile = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()

      if (currentUser) {
        setUser(currentUser)

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        setProfile(profileData as Profile | null)
      }

      setLoading(false)
    }

    fetchUserAndProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(profileData as Profile | null)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    isInstructor: profile?.role === 'INSTRUCTOR' || profile?.role === 'ADMIN',
    isAdmin: profile?.role === 'ADMIN',
  }
}