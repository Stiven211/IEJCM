import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Image, Upload, LayoutDashboard, CalendarDays, Megaphone, BookOpen, FileText } from 'lucide-react'
import { AdminSidebar } from '../admin/AdminSidebar'
import { AdminHeader } from '../admin/AdminHeader'
import { AdminDataTable } from '../admin/AdminDataTable'
import { AdminModal } from '../admin/AdminModal'
import { AdminStatusMessages } from './AdminStatusMessages'
import { useAdminStatus } from '../../../hooks/useAdminStatus'
import * as galleryService from '../../../services/gallery.service'
import { logError } from '../../../lib/logger'
import { ResilientImage } from '../ui/ResilientImage'

export interface GalleryAdminPageProps {
  onLogout: () => void
  adminUser: { initials: string; name: string; email: string } | null
}

interface FormData {
  title: string
  description: string
  image_url: string
  category: string
  active: boolean
}

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  image_url: '',
  category: '',
  active: true,
}

export function GalleryAdminPage({ onLogout, adminUser }: GalleryAdminPageProps) {
  const navigate = useNavigate()
  const [items, setItems] = useState<galleryService.GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editingItem, setEditingItem] = useState<galleryService.GalleryItem | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { successMsg, errorMsg, showSuccess, showError } = useAdminStatus()

  const fetchItems = async () => {
    setLoading(true)
    try {
       const data = await galleryService.getAllGalleryItems(false)
      setItems(data)
    } catch (err) {
      logError(err, { action: 'fetchGallery' })
      showError('No se pudieron cargar las imágenes. Intente de nuevo.')
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
    setPreview(null)
    setModalMode('create')
  }

  const openEdit = (item: galleryService.GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      category: item.category || '',
      active: item.active !== false,
    })
    setPreview(item.image_url || null)
    setModalMode('edit')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await galleryService.uploadGalleryImage(file)
      setFormData(prev => ({ ...prev, image_url: url }))
      setPreview(url)
    } catch (err) {
      logError(err, { action: 'uploadGalleryImage' })
      showError('No se pudo subir la imagen. Intente de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modalMode === 'create') {
        await galleryService.createGalleryItem(formData)
        showSuccess('Imagen creada exitosamente.')
      } else if (modalMode === 'edit' && editingItem) {
        await galleryService.updateGalleryItem(editingItem.id, formData)
        showSuccess('Imagen actualizada exitosamente.')
      }
      setModalMode(null)
      fetchItems()
    } catch (err) {
      logError(err, { action: 'saveGalleryItem' })
      showError('No se pudo guardar la imagen. Intente de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await galleryService.removeGalleryItem(id)
      showSuccess('Imagen eliminada correctamente.')
    } catch (err) {
      logError(err, { action: 'deleteGalleryItem' })
      showError('No se pudo eliminar la imagen. Intente de nuevo.')
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
          title="Galería"
          primaryButtonText="Nueva Imagen"
          onPrimaryAction={openCreate}
          onViewSite={() => navigate('/')}
        />

        <div style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
          <AdminStatusMessages successMsg={successMsg} errorMsg={errorMsg} />

          <AdminDataTable
            columns={[
               { key: 'image', header: 'Imagen', render: (item: galleryService.GalleryItem) => (
                 item.image_url ? (
                   <ResilientImage src={item.image_url} alt={item.title} fallbackLabel="Imagen no disponible" decoding="async" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: '6px', backgroundColor: '#E8F5E9' }} />
                 ) : (
                   <div style={{ width: 60, height: 40, backgroundColor: '#E8F5E9', borderRadius: '6px' }} />
                 )
               ) },
              { key: 'title', header: 'Título', render: (item: galleryService.GalleryItem) => (
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>{item.title}</div>
              ) },
              { key: 'category', header: 'Categoría', render: (item: galleryService.GalleryItem) => (
                <div style={{ fontSize: '14px', color: '#3A4E3A' }}>{item.category || '-'}</div>
              ) },
              { key: 'active', header: 'Activo', render: (item: galleryService.GalleryItem) => (
                <span style={{ backgroundColor: item.active !== false ? '#E8F5E9' : '#FEF2F2', color: item.active !== false ? '#006400' : '#DC2626', borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {item.active !== false ? 'Activo' : 'Inactivo'}
                </span>
              ) },
            ]}
            data={items}
            loading={loading}
            emptyMessage="No hay imágenes en la galería."
            loadingMessage="Cargando galería..."
            getItemKey={(item) => item.id}
            onEdit={openEdit}
            onDeleteRequest={setDeleteConfirmId}
            onDeleteConfirmed={handleDelete}
            onDeleteCancelled={() => setDeleteConfirmId(null)}
            deleteConfirmId={deleteConfirmId}
          />
        </div>
      </div>

      <AdminModal
        open={!!modalMode}
        title={modalMode === 'create' ? 'Nueva Imagen' : 'Editar Imagen'}
        onClose={() => { setModalMode(null); setPreview(null) }}
        onSave={handleSave}
        saveLabel={modalMode === 'create' ? 'Crear' : 'Guardar Cambios'}
        cancelLabel="Cancelar"
        saving={saving}
      >
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Título *</label>
          <input type="text" value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="Ej: Festival Cultural" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF', color: '#1A1A1A', transition: 'border-color 0.2s' }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'} onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.11)'} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Descripción</label>
          <textarea value={formData.description} onChange={e => updateField('description', e.target.value)} placeholder="Descripción de la imagen..." rows={3} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF', color: '#1A1A1A', resize: 'vertical', transition: 'border-color 0.2s' }} onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = '#006400'} onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(0,0,0,0.11)'} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Imagen *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: '1.5px dashed rgba(0,0,0,0.18)', borderRadius: '8px', backgroundColor: '#F8F8F8', color: '#1A1A1A', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
          >
            <Upload size={16} /> {uploading ? 'Subiendo...' : formData.image_url ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </button>
          {(formData.image_url || preview) && (
            <div style={{ marginTop: '12px', borderRadius: '7px', overflow: 'hidden', height: '140px', backgroundColor: '#E8F5E9' }}>
               <ResilientImage src={formData.image_url} alt="Preview" fallbackLabel="Vista previa no disponible" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Categoría</label>
          <input type="text" value={formData.category} onChange={e => updateField('category', e.target.value)} placeholder="Ej: cultural" style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', backgroundColor: '#FFFFFF', color: '#1A1A1A', transition: 'border-color 0.2s' }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'} onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.11)'} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
          <input
            type="checkbox"
            id="gallery-active"
            checked={formData.active}
            onChange={e => updateField('active', e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#006400' }}
          />
          <label htmlFor="gallery-active" style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', cursor: 'pointer' }}>Imagen activa (visible en la página)</label>
        </div>
      </AdminModal>
    </div>
  )
}
