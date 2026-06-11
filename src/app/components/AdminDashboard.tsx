import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  GraduationCap, LayoutDashboard, CalendarDays, LogOut,
  Plus, Edit2, Trash2, Search, X, Check, AlertTriangle, Eye,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Event } from '../types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/events'

interface AdminDashboardProps {
  onLogout: () => void
}

type ModalMode = 'create' | 'edit' | null

const EMPTY_FORM: Omit<Event, 'id' | 'created_at'> = {
  title: '',
  description: '',
  fullDescription: '',
  date: '',
  time: '',
  endTime: '',
  location: '',
  category: 'academic',
  image: '',
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
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      showError('No se pudieron cargar los eventos. Intente de nuevo.')
    } else {
      setEvents(data || [])
    }

    setLoading(false)
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
    })
    setModalMode('edit')
  }

  const handleSave = async () => {
    if (modalMode === 'create') {
      const { error } = await supabase.from('events').insert([formData])
      if (error) {
        console.error('Error creating event:', error)
        showError('No se pudo crear el evento. Intente de nuevo.')
      } else {
        showSuccess('Evento creado exitosamente.')
      }
    } else if (modalMode === 'edit' && editingEvent) {
      const { error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', editingEvent.id)
      if (error) {
        console.error('Error updating event:', error)
        showError('No se pudo actualizar el evento. Intente de nuevo.')
      } else {
        showSuccess('Evento actualizado exitosamente.')
      }
    }
    setModalMode(null)
    fetchEvents()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) {
      console.error('Error deleting event:', error)
      showError('No se pudo eliminar el evento. Intente de nuevo.')
    } else {
      showSuccess('Evento eliminado correctamente.')
    }
    setDeleteConfirmId(null)
    fetchEvents()
  }

  const updateField = <K extends keyof Omit<Event, 'id' | 'created_at'>>(key: K, value: Omit<Event, 'id' | 'created_at'>[K]) => {
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
      {/* Sidebar */}
      <div className="hidden md:flex" style={{ width: '240px', backgroundColor: '#006400', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '28px 20px 22px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={20} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px', lineHeight: 1.3 }}>Admin Panel</div>
              <div style={{ color: 'rgba(255,255,255,0.48)', fontSize: '11px' }}>J.C. Mutis</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 12px', flex: 1 }}>
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: CalendarDays, label: 'Eventos', active: false },
          ].map(({ icon: Icon, label, active }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', backgroundColor: active ? 'rgba(255,255,255,0.14)' : 'transparent', color: active ? '#FFFFFF' : 'rgba(255,255,255,0.56)', marginBottom: '2px', cursor: 'pointer', fontSize: '14px', fontWeight: active ? 600 : 400, transition: 'background 0.2s' }}>
              <Icon size={16} />
              {label}
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginBottom: '6px' }}>
            <div style={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>A</span>
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>Administrador</div>
              <div style={{ color: 'rgba(255,255,255,0.44)', fontSize: '11px' }}>admin@jcmutis.edu.co</div>
            </div>
          </div>
          <button
            onClick={() => { onLogout(); navigate('/') }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', backgroundColor: 'rgba(220,38,38,0.12)', color: 'rgba(248,113,113,0.9)', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(220,38,38,0.2)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(220,38,38,0.12)'}
          >
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 2px', letterSpacing: '-0.01em' }}>Panel de Eventos</h1>
            <p style={{ color: '#5A7A5A', fontSize: '13px', margin: 0 }}>Colegio José Celestino Mutis · San José del Guaviare</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: '#5A7A5A', border: '1px solid rgba(0,0,0,0.1)', padding: '8px 14px', borderRadius: '7px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Eye size={14} /> Ver sitio
            </button>
            <button
              onClick={openCreate}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '9px 18px', borderRadius: '7px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
            >
              <Plus size={16} /> Nuevo Evento
            </button>
          </div>
        </div>

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
              />
            </div>
            <span style={{ color: '#5A7A5A', fontSize: '13px', whiteSpace: 'nowrap' }}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <div style={{ padding: '48px', textAlign: 'center', color: '#5A7A5A', fontSize: '14px' }}>
                  Cargando eventos...
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '620px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8F8F8', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                      {['Título', 'Fecha', 'Categoría', 'Estado', 'Acciones'].map(col => (
                        <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A7A5A', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#5A7A5A', fontSize: '14px' }}>
                          No se encontraron eventos.
                        </td>
                      </tr>
                    ) : filtered.map((event, idx) => {
                      const status = getStatus(event.date)
                      const catColor = CATEGORY_COLORS[event.category]
                      const eventDate = new Date(event.date + 'T00:00:00')

                      return deleteConfirmId === event.id ? (
                        <tr key={event.id} style={{ backgroundColor: '#FEF2F2' }}>
                          <td colSpan={5} style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <AlertTriangle size={15} style={{ color: '#DC2626', flexShrink: 0 }} />
                              <span style={{ fontSize: '14px', color: '#1A1A1A', flex: 1 }}>
                                ¿Eliminar <strong>"{event.title}"</strong>? Esta acción no se puede deshacer.
                              </span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => setDeleteConfirmId(null)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.14)', backgroundColor: '#FFFFFF', color: '#1A1A1A', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                                  Cancelar
                                </button>
                                <button onClick={() => handleDelete(event.id)} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                  Sí, eliminar
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr
                          key={event.id}
                          style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F9FBF9'}
                          onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '2px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
                            <div style={{ fontSize: '12px', color: '#5A7A5A', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</div>
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: '14px', color: '#3A4E3A', whiteSpace: 'nowrap' }}>
                            {eventDate.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            <span style={{ backgroundColor: catColor.bg, color: catColor.text, borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {CATEGORY_LABELS[event.category]}
                            </span>
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            <span style={{ backgroundColor: status.bg, color: status.text, borderRadius: '12px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {status.label}
                            </span>
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => openEdit(event)}
                                title="Editar"
                                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#006400', transition: 'all 0.15s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#E8F5E9'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#006400' }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)' }}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(event.id)}
                                title="Eliminar"
                                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#DC2626', transition: 'all 0.15s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#DC2626' }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '92vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.28)' }}>
            <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A1A', margin: 0, letterSpacing: '-0.01em' }}>
                {modalMode === 'create' ? '+ Crear Nuevo Evento' : 'Editar Evento'}
              </h2>
              <button
                onClick={() => setModalMode(null)}
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '7px', border: 'none', backgroundColor: '#F0F4F0', cursor: 'pointer', color: '#5A7A5A' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

              {/* Image URL */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>URL de imagen</label>
                <input type="url" value={formData.image} onChange={e => updateField('image', e.target.value)} placeholder="https://images.unsplash.com/..." style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                {formData.image && (
                  <div style={{ marginTop: '8px', borderRadius: '7px', overflow: 'hidden', height: '110px', backgroundColor: '#E8F5E9' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: '4px' }}>
                <button
                  onClick={() => setModalMode(null)}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.13)', backgroundColor: '#FFFFFF', color: '#1A1A1A', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isFormValid}
                  style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: isFormValid ? '#006400' : '#CCCCCC', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, cursor: isFormValid ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '7px', transition: 'background 0.2s' }}
                  onMouseEnter={e => { if (isFormValid) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22' }}
                  onMouseLeave={e => { if (isFormValid) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400' }}
                >
                  <Check size={15} />
                  {modalMode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
