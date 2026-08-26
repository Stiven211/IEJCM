import { useState, useEffect, useRef, useCallback } from 'react'
import * as schoolInfoService from '../../services/schoolInfo.service'
import { HomeContact } from './home/HomeContact'
import { ContactSkeleton } from './ui/ContactSkeleton'
import { LoadErrorState } from './ui/LoadErrorState'
import { logError } from '../../lib/logger'
import * as contactService from '../../services/contact.service'

export function ContactPage() {
  const [schoolInfo, setSchoolInfo] = useState<schoolInfoService.SchoolInfo | null>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const timerRef = useRef<number | null>(null)

  const loadInfo = useCallback(async () => {
    setLoading(true)
    setError(false)
    const cancelled = false
    try {
      const data = await schoolInfoService.getSchoolInfo()
      if (!cancelled) setSchoolInfo(data)
    } catch (err) {
      if (!cancelled) setError(true)
      logError(err, { action: 'loadSchoolInfo', page: 'contact' })
    } finally {
      if (!cancelled) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInfo()
  }, [loadInfo])

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting || new FormData(e.currentTarget).get('website')) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await contactService.createContactMessage(form)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setSent(false), 4500)
    } catch (err) {
      logError(err, { action: 'submitContactMessage', page: 'contact' })
      setSubmitError('No se pudo guardar el mensaje. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
  }

  return (
    <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#006400', padding: 'clamp(48px, 6vw, 80px) 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '12px', letterSpacing: '0.03em' }}>
            Inicio / Contacto
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Contacto
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, maxWidth: '540px', lineHeight: 1.7 }}>
            Ponte en contacto con nosotros. Responderemos en un plazo máximo de 24 horas hábiles.
          </p>
        </div>
      </div>
      <div aria-busy={loading}>
        {loading ? <ContactSkeleton /> : error ? <LoadErrorState message="No se pudo cargar la información de contacto." onRetry={loadInfo} /> : <HomeContact schoolInfo={schoolInfo} form={form} sent={sent} submitting={submitting} submitError={submitError} onFormChange={handleFormChange} onSubmit={handleSubmit} />}
      </div>
    </div>
  )
}
