import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Save, AlertTriangle, Check, BookOpen, LayoutDashboard, CalendarDays, Image, Megaphone } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import * as schoolInfoService from '../../../services/schoolInfo.service'

export interface SchoolInfoAdminPageProps {
  onLogout: () => void
}

interface FormData {
  school_name: string
  history: string
  mission: string
  vision: string
  address: string
  phone: string
  email: string
  facebook: string
  instagram: string
  youtube: string
  logo_url: string
  hero_image_url: string
}

const EMPTY_FORM: FormData = {
  school_name: '',
  history: '',
  mission: '',
  vision: '',
  address: '',
  phone: '',
  email: '',
  facebook: '',
  instagram: '',
  youtube: '',
  logo_url: '',
  hero_image_url: '',
}

export function SchoolInfoAdminPage({ onLogout }: SchoolInfoAdminPageProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fetchInfo = async () => {
    setLoading(true)
    try {
      const data = await schoolInfoService.getSchoolInfo()
      if (data) {
        setFormData({
          school_name: data.school_name || '',
          history: data.history || '',
          mission: data.mission || '',
          vision: data.vision || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          youtube: data.youtube || '',
          logo_url: data.logo_url || '',
          hero_image_url: data.hero_image_url || '',
        })
      }
    } catch (err) {
      console.error('Error fetching school info:', err)
      showError('No se pudo cargar la información institucional.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const showError = (msg: string) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(''), 5000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await schoolInfoService.upsertSchoolInfo(formData)
      showSuccess('Información institucional actualizada exitosamente.')
    } catch (err) {
      console.error('Error saving school info:', err)
      showError('No se pudo guardar la información. Intente de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#006400'
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(0,0,0,0.11)'
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F0F4F0' }}>
        <AdminSidebar
          sections={[
            { label: 'Dashboard', icon: BookOpen, to: '/admin' },
            { label: 'Eventos', icon: BookOpen, to: '/admin' },
            { label: 'Galería', icon: BookOpen, to: '/admin/gallery' },
            { label: 'Avisos', icon: BookOpen, to: '/admin/announcements' },
            { label: 'Información Institucional', icon: BookOpen, to: '/admin/school-info' },
          ]}
          user={{ initials: 'A', name: 'Administrador', email: 'admin@jcmutis.edu.co' }}
          onLogout={onLogout}
        />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A7A5A' }}>Cargando información...</div>
      </div>
    )
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <AdminHeader
          title="Información Institucional"
          primaryButtonText="Guardar Cambios"
          onPrimaryAction={handleSave}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>Datos básicos</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Nombre del colegio *</label>
                  <input type="text" value={formData.school_name} onChange={e => updateField('school_name', e.target.value)} placeholder="Ej: Colegio José Celestino Mutis" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Dirección</label>
                  <input type="text" value={formData.address} onChange={e => updateField('address', e.target.value)} placeholder="Calle 8 #12-45, San José del Guaviare" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Teléfono</label>
                    <input type="text" value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+57 300 123 4567" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Correo electrónico</label>
                    <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="rectoria@jcmutis.edu.co" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>Redes sociales</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Facebook</label>
                  <input type="url" value={formData.facebook} onChange={e => updateField('facebook', e.target.value)} placeholder="https://facebook.com/..." style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Instagram</label>
                  <input type="url" value={formData.instagram} onChange={e => updateField('instagram', e.target.value)} placeholder="https://instagram.com/..." style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>YouTube</label>
                  <input type="url" value={formData.youtube} onChange={e => updateField('youtube', e.target.value)} placeholder="https://youtube.com/..." style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>Misión y Visión</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Misión</label>
                  <textarea value={formData.mission} onChange={e => updateField('mission', e.target.value)} placeholder="Misión del colegio..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Visión</label>
                  <textarea value={formData.vision} onChange={e => updateField('vision', e.target.value)} placeholder="Visión del colegio..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>Historia</h3>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Historia institucional</label>
                <textarea value={formData.history} onChange={e => updateField('history', e.target.value)} placeholder="Historia del colegio..." rows={6} style={{ ...inputStyle, resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>Multimedia</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>URL Logo</label>
                  <input type="url" value={formData.logo_url} onChange={e => updateField('logo_url', e.target.value)} placeholder="https://..." style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  {formData.logo_url && (
                    <div style={{ marginTop: '8px', width: 80, height: 80, borderRadius: '8px', overflow: 'hidden', backgroundColor: '#E8F5E9' }}>
                      <img src={formData.logo_url} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>URL Imagen principal (Hero)</label>
                  <input type="url" value={formData.hero_image_url} onChange={e => updateField('hero_image_url', e.target.value)} placeholder="https://..." style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  {formData.hero_image_url && (
                    <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', height: 160, backgroundColor: '#E8F5E9' }}>
                      <img src={formData.hero_image_url} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: saving ? '#CCCCCC' : '#006400', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22' }}
                onMouseLeave={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400' }}
              >
                <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}