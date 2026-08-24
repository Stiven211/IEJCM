import { useCallback, useEffect, useState } from 'react'
import { Archive, Check, LayoutDashboard, CalendarDays, Image, Megaphone, BookOpen, FileText, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminStatusMessages } from './AdminStatusMessages'
import { LoadErrorState } from '../ui/LoadErrorState'
import { useAdminStatus } from '../../../hooks/useAdminStatus'
import * as contactService from '../../../services/contact.service'
import type { ContactMessage, ContactMessageStatus } from '../../types'
import { logError } from '../../../lib/logger'

export interface ContactMessagesAdminPageProps {
  onLogout: () => void
  adminUser: { initials: string; name: string; email: string } | null
}

const STATUS_LABELS: Record<ContactMessageStatus, string> = { new: 'Nuevo', read: 'Leído', archived: 'Archivado' }

export function ContactMessagesAdminPage({ onLogout, adminUser }: ContactMessagesAdminPageProps) {
  const navigate = useNavigate()
  const [items, setItems] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { successMsg, errorMsg, showSuccess, showError } = useAdminStatus()

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      setItems(await contactService.getContactMessages())
    } catch (err) {
      setError(true)
      logError(err, { action: 'loadContactMessages' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id: string, status: ContactMessageStatus) => {
    setSavingId(id)
    try {
      const updated = await contactService.updateContactMessageStatus(id, status)
      setItems(current => current.map(item => item.id === id ? updated : item))
      showSuccess('Estado actualizado.')
    } catch (err) {
      logError(err, { action: 'updateContactMessageStatus' })
      showError('No se pudo actualizar el mensaje.')
    } finally {
      setSavingId(null)
    }
  }

  const remove = async (id: string) => {
    setSavingId(id)
    try {
      await contactService.deleteContactMessage(id)
      setItems(current => current.filter(item => item.id !== id))
      showSuccess('Mensaje eliminado.')
    } catch (err) {
      logError(err, { action: 'deleteContactMessage' })
      showError('No se pudo eliminar el mensaje.')
    } finally {
      setSavingId(null)
      setDeleteId(null)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F4F0' }}>
      <AdminSidebar
        sections={[
          { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
          { label: 'Eventos', icon: CalendarDays, to: '/admin' },
          { label: 'Galería', icon: Image, to: '/admin/gallery' },
          { label: 'Avisos', icon: Megaphone, to: '/admin/announcements' },
          { label: 'Información Institucional', icon: BookOpen, to: '/admin/school-info' },
          { label: 'Documentos', icon: FileText, to: '/admin/documents' },
        ]}
        user={adminUser!}
        onLogout={onLogout}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <AdminHeader title="Mensajes de contacto" primaryButtonText="Ver sitio" onPrimaryAction={() => navigate('/contacto')} onViewSite={() => navigate('/')} />
        <div style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
          <AdminStatusMessages successMsg={successMsg} errorMsg={errorMsg} />
          {loading ? (
            <div aria-busy="true" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#5A7A5A' }}>Cargando mensajes...</div>
          ) : error ? (
            <LoadErrorState message="No se pudieron cargar los mensajes." onRetry={load} />
          ) : items.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '64px 24px', textAlign: 'center', color: '#5A7A5A' }}>No hay mensajes de contacto.</div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {items.map(item => (
                <article key={item.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px', opacity: item.status === 'archived' ? 0.72 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '16px', color: '#1A1A1A' }}>{item.name}</h2>
                      <a href={`mailto:${item.email}`} style={{ color: '#006400', fontSize: '13px' }}>{item.email}</a>
                    </div>
                    <div style={{ color: '#5A7A5A', fontSize: '13px' }}>{new Date(item.created_at).toLocaleString('es-CO')}</div>
                  </div>
                  <p style={{ whiteSpace: 'pre-wrap', color: '#3A4E3A', lineHeight: 1.65, margin: '0 0 16px' }}>{item.message}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: item.status === 'new' ? '#FEF2F2' : '#E8F5E9', color: item.status === 'new' ? '#991B1B' : '#006400', borderRadius: '12px', padding: '4px 10px', fontSize: '12px', fontWeight: 600 }}>{STATUS_LABELS[item.status]}</span>
                    {item.status === 'new' && <button type="button" disabled={savingId === item.id} onClick={() => updateStatus(item.id, 'read')} style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', padding: '7px 10px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '7px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}><Check size={14} /> Marcar leído</button>}
                    {item.status !== 'archived' && <button type="button" disabled={savingId === item.id} onClick={() => updateStatus(item.id, 'archived')} style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', padding: '7px 10px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '7px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}><Archive size={14} /> Archivar</button>}
                    {deleteId === item.id ? <><button type="button" onClick={() => remove(item.id)} disabled={savingId === item.id} style={{ padding: '7px 10px', border: 'none', borderRadius: '7px', backgroundColor: '#DC2626', color: '#FFFFFF', cursor: 'pointer' }}>Confirmar eliminación</button><button type="button" onClick={() => setDeleteId(null)} style={{ padding: '7px 10px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '7px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>Cancelar</button></> : <button type="button" aria-label="Eliminar mensaje" title="Eliminar mensaje" onClick={() => setDeleteId(item.id)} style={{ display: 'inline-flex', padding: '7px', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '7px', backgroundColor: '#FFFFFF', color: '#DC2626', cursor: 'pointer' }}><Trash2 size={14} /></button>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
