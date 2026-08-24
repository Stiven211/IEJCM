import { useState, useEffect, useCallback } from 'react'
import * as announcementService from '../../services/announcement.service'
import { AnnouncementsSkeleton } from './ui/AnnouncementsSkeleton'
import { LoadErrorState } from './ui/LoadErrorState'
import { logError } from '../../lib/logger'
import { isAnnouncementCurrent } from '../../utils/announcementDates'

export function AnnouncementsPage() {
  const [items, setItems] = useState<announcementService.Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await announcementService.getAllAnnouncements()
      setItems(data.filter(a => a.active !== false && isAnnouncementCurrent(a)))
    } catch (err) {
      setError(true)
      logError(err, { action: 'loadAnnouncements', page: 'announcements' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) 24px' }}>
      <div className="fade-in-up" style={{ marginBottom: '48px', animationDelay: '80ms' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#FEF2F2', color: '#991B1B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
          Avisos importantes
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, color: '#1A1A1A', margin: 0 }}>
          Todos los avisos
        </h1>
      </div>

      <div aria-busy={loading}>
      {loading ? (
        <AnnouncementsSkeleton />
      ) : error ? (
        <LoadErrorState message="No se pudieron cargar los avisos." onRetry={load} />
      ) : items.length === 0 ? (
        <div className="fade-in" style={{ color: '#5A7A5A' }}>No hay avisos activos en este momento.</div>
      ) : (
        <div className="fade-in-up" style={{ display: 'grid', gap: '20px', animationDelay: '120ms' }}>
          {items.map(item => (
            <div key={item.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '24px', transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)' }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)' }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}>
              <div style={{ fontSize: '13px', color: '#5A7A5A', marginBottom: '8px' }}>
                {item.start_date ? new Date(item.start_date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(item.created_at || '').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px', lineHeight: 1.35 }}>{item.title}</h2>
              <p style={{ fontSize: '15px', color: '#4A5E4A', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{item.description}</p>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
