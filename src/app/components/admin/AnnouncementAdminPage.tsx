import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { LayoutDashboard, CalendarDays, Image, Megaphone, BookOpen, FileText } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminDataTable } from './AdminDataTable'
import { AdminModal } from './AdminModal'
import { AdminStatusMessages } from './AdminStatusMessages'
import { useAdminStatus } from '../../../hooks/useAdminStatus'
import { inputStyle, handleFocus, handleBlur } from '../../../utils/admin-ui-helpers'
import * as announcementService from '../../../services/announcement.service'
import { logError } from '../../../lib/logger'

export interface AnnouncementAdminPageProps {
  onLogout: () => void
  adminUser: { initials: string; name: string; email: string } | null
}

interface FormData {
  title: string
  description: string
  type: string
  priority: string
  active: boolean
  start_date: string
  end_date: string
}

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  type: '',
  priority: '',
  active: true,
  start_date: '',
  end_date: '',
}

export function AnnouncementAdminPage({ onLogout, adminUser }: AnnouncementAdminPageProps) {
  const navigate = useNavigate()
  const [items, setItems] = useState<announcementService.Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editingItem, setEditingItem] = useState<announcementService.Announcement | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const { successMsg, errorMsg, showSuccess, showError } = useAdminStatus()

  const fetchItems = async () => {
    setLoading(true)
    try {
      const data = await announcementService.getAllAnnouncements(false)
      setItems(data)
    } catch (err) {
      logError(err, { action: 'fetchAnnouncements' })
      showError('No se pudieron cargar los avisos. Intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const openCreate = () => {
    setFormData(EMPTY_FORM)
    setEditingItem(null)
    setModalMode('create')
  }

  const openEdit = (item: announcementService.Announcement) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type || '',
      priority: item.priority || '',
      active: item.active !== false,
      start_date: item.start_date || '',
      end_date: item.end_date || '',
    })
    setModalMode('edit')
  }

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modalMode === 'create') {
         await announcementService.createAnnouncement({
           title: formData.title,
           description: formData.description,
           type: formData.type || undefined,
           priority: formData.priority || undefined,
           active: formData.active,
           start_date: formData.start_date || undefined,
           end_date: formData.end_date || undefined,
         })
        showSuccess('Aviso creado exitosamente.')
      } else if (modalMode === 'edit' && editingItem) {
         await announcementService.updateAnnouncement(editingItem.id, {
           title: formData.title,
           description: formData.description,
           type: formData.type || undefined,
           priority: formData.priority || undefined,
           active: formData.active,
           start_date: formData.start_date || undefined,
           end_date: formData.end_date || undefined,
         })
        showSuccess('Aviso actualizado exitosamente.')
      }
      setModalMode(null)
      fetchItems()
    } catch (err) {
      logError(err, { action: 'saveAnnouncement' })
      showError('No se pudo guardar el aviso. Intente de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await announcementService.removeAnnouncement(id)
      showSuccess('Aviso eliminado correctamente.')
    } catch (err) {
      logError(err, { action: 'deleteAnnouncement' })
      showError('No se pudo eliminar el aviso. Intente de nuevo.')
    }
    setDeleteConfirmId(null)
    fetchItems()
  }

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
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
        <AdminHeader
          title="Avisos"
          primaryButtonText="Nuevo Aviso"
          onPrimaryAction={openCreate}
          onViewSite={() => navigate('/')}
        />

        <div style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
          <AdminStatusMessages successMsg={successMsg} errorMsg={errorMsg} />

          <AdminDataTable
            columns={[
               { key: 'title', header: 'Título', render: (item: announcementService.Announcement) => (
                 <div>
                   <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '2px' }}>{item.title}</div>
                   <div style={{ fontSize: '12px', color: '#5A7A5A', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>
                 </div>
               ) },
               { key: 'type', header: 'Tipo', render: (item: announcementService.Announcement) => (
                 <div style={{ fontSize: '14px', color: '#3A4E3A' }}>{item.type || '-'}</div>
               ) },
              { key: 'active', header: 'Activo', render: (item: announcementService.Announcement) => (
                <span style={{ backgroundColor: item.active !== false ? '#E8F5E9' : '#FEF2F2', color: item.active !== false ? '#006400' : '#DC2626', borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {item.active !== false ? 'Activo' : 'Inactivo'}
                </span>
              ) },
               { key: 'date', header: 'Inicio', render: (item: announcementService.Announcement) => {
                 const d = item.start_date ? new Date(item.start_date) : new Date(item.created_at || '')
                 return <div style={{ fontSize: '14px', color: '#3A4E3A', whiteSpace: 'nowrap' }}>{d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
               } },
            ]}
            data={items}
            loading={loading}
            emptyMessage="No hay avisos creados."
            loadingMessage="Cargando avisos..."
            getItemKey={(item) => item.id}
            onEdit={openEdit}
            onDeleteRequest={setDeleteConfirmId}
            onDeleteConfirmed={handleDelete}
            onDeleteCancelled={() => setDeleteConfirmId(null)}
            deleteConfirmId={deleteConfirmId}
          />
        </div>

        <AdminModal
          open={!!modalMode}
          title={modalMode === 'create' ? 'Nuevo Aviso' : 'Editar Aviso'}
          onClose={() => setModalMode(null)}
          onSave={handleSave}
          saveLabel={modalMode === 'create' ? 'Crear' : 'Guardar Cambios'}
          cancelLabel="Cancelar"
          saving={saving}
        >
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Título *</label>
            <input type="text" value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="Ej: Inicio de matrículas 2026" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Descripción *</label>
            <textarea value={formData.description} onChange={e => updateField('description', e.target.value)} placeholder="Escribe la descripción del aviso..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Tipo</label>
              <input type="text" value={formData.type} onChange={e => updateField('type', e.target.value)} placeholder="Ej: general" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Prioridad</label>
              <input type="text" value={formData.priority} onChange={e => updateField('priority', e.target.value)} placeholder="Ej: alta" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Fecha de inicio</label>
              <input type="date" value={formData.start_date} onChange={e => updateField('start_date', e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Fecha de fin</label>
              <input type="date" value={formData.end_date} onChange={e => updateField('end_date', e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="announcement-active"
              checked={formData.active}
              onChange={e => updateField('active', e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#006400' }}
            />
            <label htmlFor="announcement-active" style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', cursor: 'pointer' }}>Aviso activo</label>
          </div>
        </AdminModal>
      </div>
    </div>
  )
}
