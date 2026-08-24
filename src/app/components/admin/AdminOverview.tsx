import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, BookOpen, CalendarDays, FileText, Image, Mail, Megaphone, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router'
import * as eventService from '../../../services/event.service'
import * as galleryService from '../../../services/gallery.service'
import * as announcementService from '../../../services/announcement.service'
import * as documentService from '../../../services/document.service'
import * as contactService from '../../../services/contact.service'
import * as schoolInfoService from '../../../services/schoolInfo.service'
import { logError } from '../../../lib/logger'

interface AdminOverviewProps {
  eventsCount: number
}

type OverviewState = { status: 'loading' } | { status: 'success'; value: string } | { status: 'error' }

interface OverviewCard {
  key: string
  label: string
  description: string
  to: string
  icon: typeof CalendarDays
  state: OverviewState
}

export function AdminOverview({ eventsCount }: AdminOverviewProps) {
  const navigate = useNavigate()
  const [overview, setOverview] = useState<Record<string, OverviewState>>({
    gallery: { status: 'loading' },
    announcements: { status: 'loading' },
    documents: { status: 'loading' },
    messages: { status: 'loading' },
    schoolInfo: { status: 'loading' },
  })

  const loadOverview = useCallback(async () => {
    setOverview(current => Object.fromEntries(Object.keys(current).map(key => [key, { status: 'loading' }])))
    const results = await Promise.allSettled([
      galleryService.getAllGalleryItems(false),
      announcementService.getAllAnnouncements(false),
      documentService.getAllDocuments(false),
      contactService.getContactMessages(),
      schoolInfoService.getSchoolInfo(),
    ])
    const keys = ['gallery', 'announcements', 'documents', 'messages', 'schoolInfo']
    const next: Record<string, OverviewState> = {}
    results.forEach((result, index) => {
      const key = keys[index]
      if (result.status === 'fulfilled') {
        const value = Array.isArray(result.value) ? String(result.value.length) : result.value ? 'Disponible' : 'Sin registro'
        next[key] = { status: 'success', value }
      } else {
        next[key] = { status: 'error' }
        logError(result.reason, { action: 'loadAdminOverview', module: key })
      }
    })
    setOverview(next)
  }, [])

  useEffect(() => { loadOverview() }, [loadOverview])

  const cards: OverviewCard[] = [
    { key: 'events', label: 'Eventos', description: 'Total administrativo', to: '/admin', icon: CalendarDays, state: { status: 'success', value: String(eventsCount) } },
    { key: 'gallery', label: 'Galería', description: 'Total administrativo', to: '/admin/gallery', icon: Image, state: overview.gallery },
    { key: 'announcements', label: 'Avisos', description: 'Total administrativo', to: '/admin/announcements', icon: Megaphone, state: overview.announcements },
    { key: 'documents', label: 'Documentos', description: 'Total administrativo', to: '/admin/documents', icon: FileText, state: overview.documents },
    { key: 'messages', label: 'Mensajes', description: 'Bandeja administrativa', to: '/admin/contact-messages', icon: Mail, state: overview.messages },
    { key: 'schoolInfo', label: 'Información institucional', description: 'Estado del registro', to: '/admin/school-info', icon: BookOpen, state: overview.schoolInfo },
  ]

  return (
    <section aria-labelledby="admin-overview-title" style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <div>
          <h2 id="admin-overview-title" style={{ margin: 0, color: '#1A1A1A', fontSize: '20px', fontWeight: 800 }}>Resumen administrativo</h2>
          <p style={{ margin: '5px 0 0', color: '#5A7A5A', fontSize: '13px' }}>Accesos y estados de las áreas de gestión.</p>
        </div>
        <button type="button" onClick={loadOverview} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '7px', padding: '8px 11px', backgroundColor: '#FFFFFF', color: '#3A4E3A', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}><RefreshCw size={14} /> Actualizar resumen</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {cards.map(({ key, label, description, to, icon: Icon, state }) => (
          <button key={key} type="button" onClick={() => navigate(to)} style={{ textAlign: 'left', backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '16px', cursor: 'pointer', fontFamily: 'inherit', color: '#1A1A1A' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <Icon size={18} color="#006400" />
              <ArrowRight size={15} color="#5A7A5A" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '12px', color: '#5A7A5A' }}>{description}</div>
            <div aria-live="polite" style={{ marginTop: '12px', fontSize: '24px', fontWeight: 800, color: state.status === 'error' ? '#991B1B' : '#006400' }}>
              {state.status === 'loading' ? '...' : state.status === 'error' ? 'Error' : state.value}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
