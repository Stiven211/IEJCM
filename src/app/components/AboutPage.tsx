import { useState, useEffect, useCallback } from 'react'
import * as schoolInfoService from '../../services/schoolInfo.service'
import { HomeAbout } from './home/HomeAbout'
import { AboutSkeleton } from './ui/AboutSkeleton'
import { LoadErrorState } from './ui/LoadErrorState'
import { logError } from '../../lib/logger'

export function AboutPage() {
  const [schoolInfo, setSchoolInfo] = useState<schoolInfoService.SchoolInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadInfo = useCallback(async () => {
    setLoading(true)
    setError(false)
    let cancelled = false
    try {
      const data = await schoolInfoService.getSchoolInfo()
      if (!cancelled) setSchoolInfo(data)
    } catch (err) {
      if (!cancelled) setError(true)
      logError(err, { action: 'loadSchoolInfo', page: 'about' })
    } finally {
      if (!cancelled) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInfo()
  }, [loadInfo])

  return (
    <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#006400', padding: 'clamp(48px, 6vw, 80px) 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '12px', letterSpacing: '0.03em' }}>
            Inicio / Sobre Nosotros
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Sobre Nosotros
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, maxWidth: '540px', lineHeight: 1.7 }}>
            Conoce nuestra historia, misión y visión. Formando el talento de la Amazonía desde 1978.
          </p>
        </div>
      </div>
      <div aria-busy={loading}>
        {loading ? <AboutSkeleton /> : error ? <LoadErrorState message="No se pudo cargar la información institucional." onRetry={loadInfo} /> : <HomeAbout schoolInfo={schoolInfo} />}
      </div>
    </div>
  )
}
