import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface UseIsAdminResult {
  isAdmin: boolean
  loading: boolean
  error: string | null
}

export function useIsAdmin(): UseIsAdminResult {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAdmin = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: queryError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle()

      if (queryError) {
        setError(queryError.message)
        setIsAdmin(false)
      } else {
        setIsAdmin(data?.role === 'admin')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!mounted) return

      if (user) {
        await checkAdmin(user.id)
      } else {
        setIsAdmin(false)
        setLoading(false)
      }
    }

    load()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return

      if (session?.user) {
        checkAdmin(session.user.id)
      } else {
        setIsAdmin(false)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [checkAdmin])

  return { isAdmin, loading, error }
}
