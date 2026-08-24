import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { FileText, Upload, LayoutDashboard, CalendarDays, Image, Megaphone, BookOpen, Download } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminDataTable } from '../admin/AdminDataTable'
import { AdminModal } from '../admin/AdminModal'
import { AdminStatusMessages } from './AdminStatusMessages'
import { useAdminStatus } from '../../../hooks/useAdminStatus'
import { inputStyle, handleFocus, handleBlur } from '../../../utils/admin-ui-helpers'
import * as documentService from '../../../services/document.service'
import { logError } from '../../../lib/logger'
import { getDocumentSignedUrl as getStorageSignedUrl } from '../../../lib/storage'

export interface DocumentsAdminPageProps {
  onLogout: () => void
  adminUser: { initials: string; name: string; email: string } | null
}

interface FormData {
  title: string
  description: string
  category: string
  file_path: string
  file_name: string
  file_size?: number
  mime_type: string
  file_extension: string
  is_public: boolean
  published_at: string
  expires_at: string
}

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  category: 'otros',
  file_path: '',
  file_name: '',
  file_size: undefined,
  mime_type: '',
  file_extension: '',
  is_public: false,
  published_at: '',
  expires_at: '',
}

const CATEGORY_OPTIONS = [
  { value: 'excusas', label: 'Excusas' },
  { value: 'permisos', label: 'Permisos' },
  { value: 'circulares', label: 'Circulares' },
  { value: 'formatos', label: 'Formatos' },
  { value: 'guias', label: 'Guías' },
  { value: 'comunicados', label: 'Comunicados' },
  { value: 'institucional', label: 'Institucional' },
  { value: 'otros', label: 'Otros' },
] as const

export function DocumentsAdminPage({ onLogout, adminUser }: DocumentsAdminPageProps) {
  const navigate = useNavigate()
  const [items, setItems] = useState<documentService.Document[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editingItem, setEditingItem] = useState<documentService.Document | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { successMsg, errorMsg, showSuccess, showError } = useAdminStatus()

  const fetchItems = async () => {
    setLoading(true)
    try {
      const data = await documentService.getAllDocuments(false)
      setItems(data)
    } catch (err) {
      logError(err, { action: 'fetchDocuments' })
      showError('No se pudieron cargar los documentos. Intente de nuevo.')
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

  const openEdit = (item: documentService.Document) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category || 'otros',
      file_path: item.file_path,
      file_name: item.file_name,
      file_size: item.file_size,
      mime_type: item.mime_type,
      file_extension: item.file_extension,
      is_public: item.is_public || false,
      published_at: item.published_at || '',
      expires_at: item.expires_at || '',
    })
    setModalMode('edit')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await documentService.uploadDocument(file)
      setFormData(prev => ({
        ...prev,
        file_path: url,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        file_extension: file.name.split('.').pop()?.toLowerCase() || '',
      }))
    } catch (err) {
      logError(err, { action: 'uploadDocument' })
      showError('No se pudo subir el documento. Intente de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (item: documentService.Document) => {
    setDownloadingId(item.id)
    try {
      const url = await getStorageSignedUrl('documents', item.file_path)
      const link = document.createElement('a')
      link.href = url
      link.download = item.file_name || `${item.title}.${item.file_extension || 'bin'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      logError(err, { action: 'downloadDocument' })
      showError('No se pudo descargar el documento.')
    } finally {
      setDownloadingId(null)
    }
  }

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      if (modalMode === 'create') {
        if (!formData.file_path) {
          showError('Debe seleccionar un archivo.')
          setSaving(false)
          return
        }
        await documentService.createDocument(
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            file_path: formData.file_path,
            file_name: formData.file_name,
            file_size: formData.file_size,
            mime_type: formData.mime_type,
            file_extension: formData.file_extension,
            is_public: formData.is_public,
            published_at: formData.published_at || undefined,
            expires_at: formData.expires_at || undefined,
          },
          { name: formData.file_name, type: formData.mime_type } as File
        )
        showSuccess('Documento creado exitosamente.')
      } else if (modalMode === 'edit' && editingItem) {
        const payload: Partial<FormData> = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          is_public: formData.is_public,
          published_at: formData.published_at || undefined,
          expires_at: formData.expires_at || undefined,
        }

        if (formData.file_path && formData.file_path !== editingItem.file_path) {
          payload.file_path = formData.file_path
          payload.file_name = formData.file_name
          payload.file_size = formData.file_size
          payload.mime_type = formData.mime_type
          payload.file_extension = formData.file_extension
        }

        await documentService.updateDocument(editingItem.id, payload)
        showSuccess('Documento actualizado exitosamente.')
      }
      setModalMode(null)
      fetchItems()
    } catch (err) {
      logError(err, { action: 'saveDocument' })
      showError('No se pudo guardar el documento. Intente de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await documentService.removeDocument(id)
      showSuccess('Documento eliminado correctamente.')
    } catch (err) {
      logError(err, { action: 'deleteDocument' })
      showError('No se pudo eliminar el documento. Intente de nuevo.')
    }
    setDeleteConfirmId(null)
    fetchItems()
  }

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const getCategoryLabel = (category: string) => {
    const option = CATEGORY_OPTIONS.find(opt => opt.value === category)
    return option?.label || category
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
          title="Documentos Administrativos"
          primaryButtonText="Nuevo Documento"
          onPrimaryAction={openCreate}
          onViewSite={() => navigate('/')}
        />

        <div style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
          <AdminStatusMessages successMsg={successMsg} errorMsg={errorMsg} />

          <AdminDataTable
            columns={[
              { key: 'title', header: 'Título', render: (item: documentService.Document) => (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#5A7A5A', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.file_name}</div>
                </div>
              ) },
              { key: 'category', header: 'Categoría', render: (item: documentService.Document) => (
                <div style={{ fontSize: '14px', color: '#3A4E3A' }}>{getCategoryLabel(item.category)}</div>
              ) },
              { key: 'is_public', header: 'Visibilidad', render: (item: documentService.Document) => (
                <span style={{ backgroundColor: item.is_public ? '#E8F5E9' : '#FEF2F2', color: item.is_public ? '#006400' : '#DC2626', borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {item.is_public ? 'Público' : 'Privado'}
                </span>
              ) },
              { key: 'date', header: 'Publicación', render: (item: documentService.Document) => {
                const d = item.published_at ? new Date(item.published_at) : new Date(item.created_at || '')
                return <div style={{ fontSize: '14px', color: '#3A4E3A', whiteSpace: 'nowrap' }}>{d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              } },
              { key: 'download', header: 'Archivo', render: (item: documentService.Document) => (
                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  disabled={downloadingId === item.id}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#FFFFFF', color: '#1A1A1A', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <Download size={14} />
                  {downloadingId === item.id ? 'Generando...' : 'Descargar'}
                </button>
              ) },
            ]}
            data={items}
            loading={loading}
            emptyMessage="No hay documentos creados."
            loadingMessage="Cargando documentos..."
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
        title={modalMode === 'create' ? 'Nuevo Documento' : 'Editar Documento'}
        onClose={() => setModalMode(null)}
        onSave={handleSave}
        saveLabel={modalMode === 'create' ? 'Crear' : 'Guardar Cambios'}
        cancelLabel="Cancelar"
        saving={saving}
      >
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Título *</label>
          <input type="text" value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="Ej: Formato de excusa médica" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Descripción</label>
          <textarea value={formData.description} onChange={e => updateField('description', e.target.value)} placeholder="Descripción del documento..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Categoría *</label>
          <select value={formData.category} onChange={e => updateField('category', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={handleFocus} onBlur={handleBlur}>
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Archivo {modalMode === 'create' ? '*' : ''}</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: '1.5px dashed rgba(0,0,0,0.18)', borderRadius: '8px', backgroundColor: '#F8F8F8', color: '#1A1A1A', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
          >
            <Upload size={16} /> {uploading ? 'Subiendo...' : formData.file_name ? 'Cambiar archivo' : 'Seleccionar archivo'}
          </button>
          {formData.file_path && (
            <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '13px' }}>
              📄 {formData.file_name} {formData.file_size ? `(${(formData.file_size / 1024).toFixed(1)} KB)` : ''}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Fecha de publicación</label>
            <input type="date" value={formData.published_at} onChange={e => updateField('published_at', e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Fecha de vencimiento</label>
            <input type="date" value={formData.expires_at} onChange={e => updateField('expires_at', e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
          <input
            type="checkbox"
            id="document-public"
            checked={formData.is_public}
            onChange={e => updateField('is_public', e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#006400' }}
          />
          <label htmlFor="document-public" style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', cursor: 'pointer' }}>Documento público (visible sin autenticación)</label>
        </div>
      </AdminModal>
    </div>
  )
}
