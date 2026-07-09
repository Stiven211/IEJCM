import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import {
  GraduationCap, LayoutDashboard, CalendarDays, Image, Megaphone, BookOpen, LogOut,
  Edit2, Trash2, Search, Check, AlertTriangle, Upload,
} from 'lucide-react'
import * as eventService from '../../services/event.service'
import type { Event } from '../types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/categories'
import { AdminSidebar } from './admin/AdminSidebar'
import { AdminHeader } from './admin/AdminHeader'
import { AdminDataTable } from './admin/AdminDataTable'
import { AdminModal } from './admin/AdminModal'

interface AdminDashboardProps {
  onLogout: () => void
}

type ModalMode = 'create' | 'edit' | null

interface FormData {
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  endTime: string
  location: string
  category: Event['category']
  image: string
  active: boolean
}

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  fullDescription: '',
  date: '',
  time: '',
  endTime: '',
  location: '',
  category: 'academic',
  image: '',
  active: true,
}

const TODAY = new Date('2026-06-01T00:00:00')

function getStatus(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  if (d < TODAY) return { label: 'Pasado', bg: '#F5F3FF', text: '#5B21B6' }
  if (d.getFullYear() === 2026 && d.getMonth() === 5) return { label: 'Este mes', bg: '#FFFBEB', text: '#92400E' }
  return { label: 'Próximo', bg: '#E8F5E9', text: '#006400' }
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await eventService.getAllEvents()
      setEvents(data)
    } catch (err) {
      console.error('Error fetching events:', err)
      showError('No se pudieron cargar los eventos. Intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
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
    setEditingEvent(null)
    setPreview(null)
    setModalMode('create')
  }

  const openEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      fullDescription: event.fullDescription || '',
      date: event.date,
      time: event.time,
      endTime: event.endTime || '',
      location: event.location,
      category: event.category,
      image: event.image || '',
      active: event.active !== false,
    })
    setPreview(event.image || null)
    setModalMode('edit')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await eventService.uploadEventImage(file)
      setFormData(prev => ({ ...prev, image: url }))
      setPreview(url)
    } catch (err) {
      console.error('Error uploading image:', err)
      showError('No se pudo subir la imagen. Intente de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await eventService.createEvent(formData)
        showSuccess('Evento creado exitosamente.')
      } else if (modalMode === 'edit' && editingEvent) {
        await eventService.updateEvent(editingEvent.id, formData)
        showSuccess('Evento actualizado exitosamente.')
      }
    } catch (err) {
      console.error('Error saving event:', err)
      showError('No se pudo guardar el evento. Intente de nuevo.')
    }
    setModalMode(null)
    fetchEvents()
  }

  const handleDelete = async (id: string) => {
    try {
      await eventService.removeEvent(id)
      showSuccess('Evento eliminado correctamente.')
    } catch (err) {
      console.error('Error deleting event:', err)
      showError('No se pudo eliminar el evento. Intente de nuevo.')
    }
    setDeleteConfirmId(null)
    fetchEvents()
  }

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: events.length,
    upcoming: events.filter(e => new Date(e.date + 'T00:00:00') >= TODAY).length,
    thisMonth: events.filter(e => {
      const d = new Date(e.date + 'T00:00:00')
      return d.getFullYear() === 2026 && d.getMonth() === 5
    }).length,
    past: events.filter(e => new Date(e.date + 'T00:00:00') < TODAY).length,
  }

  const isFormValid = formData.title.trim() && formData.date && formData.time.trim() && formData.location.trim()

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
          { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
          { label: 'Eventos', icon: CalendarDays, to: '/admin' },
          { label: 'Galería', icon: Image, to: '/admin/gallery' },
          { label: 'Avisos', icon: Megaphone, to: '/admin/announcements' },
          { label: 'Información Institucional', icon: BookOpen, to: '/admin/school-info' },
        ]}
        user={{ initials: 'A', name: 'Administrador', email: 'admin@jcmutis.edu.co' }}
        onLogout={onLogout}
      />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <AdminHeader
          title="Panel de Eventos"
          primaryButtonText="Nuevo Evento"
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

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Eventos', value: stats.total, accent: '#006400' },
              { label: 'Próximos', value: stats.upcoming, accent: '#1E40AF' },
              { label: 'Este mes', value: stats.thisMonth, accent: '#92400E' },
              { label: 'Pasados', value: stats.past, accent: '#5B21B6' },
            ].map(stat => (
              <div key={stat.label} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: stat.accent, lineHeight: 1, marginBottom: '8px' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: '#5A7A5A' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', maxWidth: '380px', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#5A7A5A', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Buscar evento por título o ubicación..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '34px', paddingRight: '12px', height: '40px', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#FFFFFF', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.09)'}
              />
            </div>
            <span style={{ color: '#5A7A5A', fontSize: '13px', whiteSpace: 'nowrap' }}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          <AdminDataTable
            columns={[
              { key: 'title', header: 'Evento', render: (item: Event) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#E8F5E9' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A7A5A', fontSize: '10px', fontWeight: 700 }}>IMG</div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#5A7A5A' }}>{item.location}</div>
                  </div>
                </div>
              ) },
              { key: 'date', header: 'Fecha', render: (item: Event) => {
                const status = getStatus(item.date)
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '13px', color: '#3A4E3A', whiteSpace: 'nowrap' }}>{new Date(item.date + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div style={{ alignSelf: 'flex-start', backgroundColor: status.bg, color: status.text, borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{status.label}</div>
                  </div>
                )
              } },
              { key: 'category', header: 'Categoría', render: (item: Event) => (
                <div style={{ fontSize: '13px', color: '#3A4E3A' }}>{CATEGORY_LABELS[item.category] || item.category}</div>
              ) },
              { key: 'active', header: 'Activo', render: (item: Event) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.active !== false ? '#006400' : '#DC2626' }} />
                  <span style={{ fontSize: '13px', color: item.active !== false ? '#006400' : '#DC2626', fontWeight: 600 }}>{item.active !== false ? 'Activo' : 'Inactivo'}</span>
                </div>
              ) },
            ]}
            data={filtered}
            loading={loading}
            emptyMessage="No se encontraron eventos."
            loadingMessage="Cargando eventos..."
            getItemKey={(item) => item.id}
            onEdit={openEdit}
            onDeleteRequest={setDeleteConfirmId}
            onDeleteConfirmed={handleDelete}
            onDeleteCancelled={() => setDeleteConfirmId(null)}
            deleteConfirmId={deleteConfirmId}
          />
        </div>

        {/* Create / Edit Modal */}
        <AdminModal
          open={!!modalMode}
          title={modalMode === 'create' ? '+ Crear Nuevo Evento' : 'Editar Evento'}
          onClose={() => { setModalMode(null); setPreview(null) }}
          onSave={handleSave}
          saveLabel={modalMode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
          cancelLabel="Cancelar"
          saving={false}
        >
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Título del evento *</label>
            <input type="text" value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="Ej: Feria de la Ciencia 2026" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          {/* Short description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Descripción breve *</label>
            <textarea value={formData.description} onChange={e => updateField('description', e.target.value)} placeholder="Resumen del evento (máx. 150 caracteres)" rows={2} style={{ ...inputStyle, resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          {/* Full description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Descripción completa</label>
            <textarea value={formData.fullDescription} onChange={e => updateField('fullDescription', e.target.value)} placeholder="Descripción detallada del evento. Puedes usar líneas en blanco para separar párrafos." rows={6} style={{ ...inputStyle, resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          {/* Date, Time, End Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Fecha *</label>
              <input type="date" value={formData.date} onChange={e => updateField('date', e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Hora inicio *</label>
              <input type="text" value={formData.time} onChange={e => updateField('time', e.target.value)} placeholder="8:00 AM" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Hora fin</label>
              <input type="text" value={formData.endTime} onChange={e => updateField('endTime', e.target.value)} placeholder="12:00 PM" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>

          {/* Location + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Ubicación *</label>
              <input type="text" value={formData.location} onChange={e => updateField('location', e.target.value)} placeholder="Ej: Patio Central de la Institución" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Categoría</label>
              <select value={formData.category} onChange={e => updateField('category', e.target.value as Event['category'])} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={handleFocus} onBlur={handleBlur}>
                <option value="academic">Académico</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Deportivo</option>
                <option value="institutional">Institucional</option>
              </select>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Imagen del evento</label>
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
              <Upload size={16} /> {uploading ? 'Subiendo...' : formData.image ? 'Cambiar imagen' : 'Seleccionar imagen'}
            </button>
            {(formData.image || preview) && (
              <div style={{ marginTop: '12px', borderRadius: '7px', overflow: 'hidden', height: '140px', backgroundColor: '#E8F5E9' }}>
                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}
          </div>

          {/* Active */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <input
              type="checkbox"
              id="event-active"
              checked={formData.active}
              onChange={e => updateField('active', e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#006400' }}
            />
            <label htmlFor="event-active" style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', cursor: 'pointer' }}>Evento activo</label>
          </div>
        </AdminModal>
      </div>
    </div>
  )
}
