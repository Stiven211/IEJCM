import { useState, useCallback, useRef, useEffect } from 'react'

const SUCCESS_DURATION = 3000
const ERROR_DURATION = 5000

export interface AdminStatus {
  successMsg: string
  errorMsg: string
  showSuccess: (msg: string) => void
  showError: (msg: string) => void
}

export function useAdminStatus(): AdminStatus {
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const successTimerRef = useRef<number | null>(null)
  const errorTimerRef = useRef<number | null>(null)

  const showSuccess = useCallback((msg: string) => {
    if (successTimerRef.current) window.clearTimeout(successTimerRef.current)
    setSuccessMsg(msg)
    successTimerRef.current = window.setTimeout(() => setSuccessMsg(''), SUCCESS_DURATION)
  }, [])

  const showError = useCallback((msg: string) => {
    if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current)
    setErrorMsg(msg)
    errorTimerRef.current = window.setTimeout(() => setErrorMsg(''), ERROR_DURATION)
  }, [])

  useEffect(() => {
    return () => {
      if (successTimerRef.current) window.clearTimeout(successTimerRef.current)
      if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current)
    }
  }, [])

  return { successMsg, errorMsg, showSuccess, showError }
}
