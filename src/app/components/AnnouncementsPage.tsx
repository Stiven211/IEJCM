import { useState, useEffect } from 'react'
import * as announcementService from '../../services/announcement.service'

export function AnnouncementsPage() {
  const [items, setItems] = useState<announcementService.Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await announcementService.getAllAnnouncements()
        setItems(data.filter(a => a.active !== false))
      } catch (err) {
        console.error('Error cargando avisos:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) 24px' }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#FEF2F2', color: '#991B1B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
          Avisos importantes
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, color: '#1A1A1A', margin: 0 }}>
          Todos los avisos
        </h1>
      </div>

      {loading ? (
        <div style={{ color: '#5A7A5A' }}>Cargando avisos...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#5A7A5A' }}>No hay avisos activos en este momento.</div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {items.map(item => (
            <div key={item.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '24px' }}>
              <div style={{ fontSize: '13px', color: '#5A7A5A', marginBottom: '8px' }}>
                {item.published_at ? new Date(item.published_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(item.created_at || '').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px', lineHeight: 1.35 }}>{item.title}</h2>
              <p style={{ fontSize: '15px', color: '#4A5E4A', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
