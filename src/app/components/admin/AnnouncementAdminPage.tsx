import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Plus, AlertTriangle, Check } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminDataTable } from './AdminDataTable'
import { AdminModal } from './AdminModal'
import * as announcementService from '../../services/announcement.service'

export interface AnnouncementAdminPageProps {
  onLogout: () => void
}

interface FormData {
  title: string
  content: string
  category: string
  active: boolean
  published_at: string
}

const EMPTY_FORM: FormData = {
  title: '',
  content: '',
  category: '',
  active: true,
  published_at: '',
}

export function AnnouncementAdminPage({ onLogout }: AnnouncementAdminPageProps) {
  const navigate = useNavigate()
  const [items, setItems] = useState<announcementService.Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editingItem, setEditingItem] = useState<announcementService.Announcement | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const data = await announcementService.getAllAnnouncements()
      setItems(data)
    } catch (err) {
      console.error('Error fetching announcements:', err)
      showError('No se pudieron cargar los avisos. Intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const showError = (msg: string) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(''), 5000)
  }

  const openCreate = () => {
    setFormData(EMPTY_FORM)
    setEditingItem(null)
    setModalMode('create')
  }

  const openEdit = (item: announcementService.Announcement) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content || '',
      category: item.category || '',
      active: item.active !== false,
      published_at: item.published_at || '',
    })
    setModalMode('edit')
  }

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await announcementService.createAnnouncement({
          title: formData.title,
          content: formData.content,
          category: formData.category || undefined,
          active: formData.active,
          published_at: formData.published_at || undefined,
        })
        showSuccess('Aviso creado exitosamente.')
      } else if (modalMode === 'edit' && editingItem) {
        await announcementService.updateAnnouncement(editingItem.id, {
          title: formData.title,
          content: formData.content,
          category: formData.category || undefined,
          active: formData.active,
          published_at: formData.published_at || undefined,
        })
        showSuccess('Aviso actualizado exitosamente.')
      }
    } catch (err) {
      console.error('Error saving announcement:', err)
      showError('No se pudo guardar el aviso. Intente de nuevo.')
    }
    setModalMode(null)
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    try {
      await announcementService.removeAnnouncement(id)
      showSuccess('Aviso eliminado correctamente.')
    } catch (err) {
      console.error('Error deleting announcement:', err)
      showError('No se pudo eliminar el aviso. Intente de nuevo.')
    }
    setDeleteConfirmId(null)
    fetchItems()
  }

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const isFormValid = formData.title.trim() && formData.content.trim()

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid rgba(0,0,0,0.11)',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
    transition: 'border-color 0.2s',
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#006400'
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(0,0,0,0.11)'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F4F0' }}>
      <AdminSidebar
        sections={[
          { label: 'Dashboard', icon: Plus, active: false, onClick: () => {} },
          { label: 'Eventos', icon: Plus, active: false, onClick: () => {} },
          { label: 'Galería', icon: Plus, active: false, onClick: () => {} },
          { label: 'Avisos', icon: Plus, active: true, onClick: () => {} },
        ]}
        user={{ initials: 'A', name: 'Administrador', email: 'admin@jcmutis.edu.co' }}
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
          {successMsg && (
            <div style={{ backgroundColor: '#E8F5E9', border: '1px solid rgba(0,100,0,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#006400', fontSize: '14px', fontWeight: 600 }}>
              <Check size={16} /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
              <AlertTriangle size={16} /> {errorMsg}
            </div>
          )}

          <AdminDataTable
            columns={[
              { key: 'title', header: 'Título', render: (item: announcementService.Announcement) => (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#5A7A5A', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.content}</div>
                </div>
              ) },
              { key: 'category', header: 'Categoría', render: (item: announcementService.Announcement) => (
                <div style={{ fontSize: '14px', color: '#3A4E3A' }}>{item.category || '-'}</div>
              ) },
              { key: 'active', header: 'Activo', render: (item: announcementService.Announcement) => (
                <span style={{ backgroundColor: item.active !== false ? '#E8F5E9' : '#FEF2F2', color: item.active !== false ? '#006400' : '#DC2626', borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {item.active !== false ? 'Activo' : 'Inactivo'}
                </span>
              ) },
              { key: 'date', header: 'Publicado', render: (item: announcementService.Announcement) => {
                const d = item.published_at ? new Date(item.published_at) : new Date(item.created_at || '')
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
        >
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Título *</label>
            <input type="text" value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="Ej: Inicio de matrículas 2026" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Contenido *</label>
            <textarea value={formData.content} onChange={e => updateField('content', e.target.value)} placeholder="Escribe el contenido del aviso..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Categoría</label>
              <input type="text" value={formData.category} onChange={e => updateField('category', e.target.value)} placeholder="Ej: general" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Fecha de publicación</label>
              <input type="date" value={formData.published_at} onChange={e => updateField('published_at', e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
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
