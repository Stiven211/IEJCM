import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Save, BookOpen, LayoutDashboard, CalendarDays, Image, Megaphone, Upload, FileText } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminStatusMessages } from './AdminStatusMessages'
import { useAdminStatus } from '../../../hooks/useAdminStatus'
import * as schoolInfoService from '../../../services/schoolInfo.service'
import { inputStyle, handleFocus, handleBlur } from '../../../utils/admin-ui-helpers'
import { logError } from '../../../lib/logger'
import { ResilientImage } from '../ui/ResilientImage'


export interface SchoolInfoAdminPageProps {
  onLogout: () => void
  adminUser: { initials: string; name: string; email: string } | null
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
  hero_title: string
  hero_subtitle: string
  hero_badge: string
  hero_badge_color: string
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
  hero_title: '',
  hero_subtitle: '',
  hero_badge: 'cerrado',
  hero_badge_color: '#991B1B',
}

const BADGE_STATES = {
  abierto: { label: 'Abierto', text: 'Año Escolar 2026 — Inscripciones Abiertas', color: '#006400', bg: '#E8F5E9' },
  cerrado: { label: 'Cerrado', text: 'Año Escolar 2026 — Inscripciones Cerradas', color: '#991B1B', bg: '#FEF2F2' },
} as const

type BadgeState = 'abierto' | 'cerrado'

export function SchoolInfoAdminPage({ onLogout, adminUser }: SchoolInfoAdminPageProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)

  const { successMsg, errorMsg, showSuccess, showError } = useAdminStatus()

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
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_badge: data.hero_badge || '',
          hero_badge_color: data.hero_badge_color || '#991B1B',
        })
      }
    } catch (err) {
      logError(err, { action: 'fetchSchoolInfo' })
      showError('No se pudo cargar la información institucional.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await schoolInfoService.upsertSchoolInfo(formData)
      showSuccess('Información institucional actualizada exitosamente.')
    } catch (err) {
      logError(err, { action: 'saveSchoolInfo' })
      showError('No se pudo guardar la información. Intente de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    try {
      const url = await schoolInfoService.uploadSchoolInfoMedia(file)
      setFormData(prev => ({ ...prev, logo_url: url }))
    } catch (err) {
      logError(err, { action: 'uploadSchoolLogo' })
      showError('No se pudo subir el logo. Intente de nuevo.')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingHero(true)
    try {
      const url = await schoolInfoService.uploadSchoolInfoMedia(file)
      setFormData(prev => ({ ...prev, hero_image_url: url }))
    } catch (err) {
      logError(err, { action: 'uploadSchoolHeroImage' })
      showError('No se pudo subir la imagen principal. Intente de nuevo.')
    } finally {
      setUploadingHero(false)
    }
  }

  if (loading) {
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
          { label: 'Documentos', icon: FileText, to: '/admin/documents' },
        ]}
        user={adminUser!}
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
          <AdminStatusMessages successMsg={successMsg} errorMsg={errorMsg} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>Datos básicos</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Nombre del colegio *</label>
                  <input type="text" value={formData.school_name} onChange={e => updateField('school_name', e.target.value)} placeholder="Ej: Colegio José Celestino Mutis" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Título del Hero</label>
                  <input type="text" value={formData.hero_title} onChange={e => updateField('hero_title', e.target.value)} placeholder="Ej: Educando para Transformar el Futuro" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Subtítulo del Hero</label>
                  <input type="text" value={formData.hero_subtitle} onChange={e => updateField('hero_subtitle', e.target.value)} placeholder="Ej: Formando el talento de la Amazonía" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Estado del badge</label>
                   <div style={{ display: 'flex', gap: '12px' }}>
                     {(['abierto', 'cerrado'] as BadgeState[]).map(state => {
                       const bs = BADGE_STATES[state]
                       return (
                         <button
                           key={state}
                           type="button"
                           onClick={() => {
                             updateField('hero_badge', bs.text)
                             updateField('hero_badge_color', bs.color)
                           }}
                           style={{
                             flex: 1,
                             padding: '10px 16px',
                             borderRadius: '8px',
                             border: formData.hero_badge === bs.text ? '2px solid #1A1A1A' : '2px solid rgba(0,0,0,0.1)',
                             backgroundColor: bs.bg,
                             color: '#FFFFFF',
                             fontSize: '13px',
                             fontWeight: 600,
                             cursor: 'pointer',
                             fontFamily: 'inherit',
                             transition: 'all 0.2s',
                           }}
                         >
                           {bs.label}
                         </button>
                       )
                     })}
                   </div>
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
                 <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>TikTok</label>
                   <input type="url" value={formData.youtube} onChange={e => updateField('youtube', e.target.value)} placeholder="https://tiktok.com/@..." style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Logo</label>
                  <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: '1.5px dashed rgba(0,0,0,0.18)', borderRadius: '8px', backgroundColor: '#F8F8F8', color: '#1A1A1A', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  >
                    <Upload size={16} /> {uploadingLogo ? 'Subiendo logo...' : formData.logo_url ? 'Cambiar logo' : 'Seleccionar logo'}
                  </button>
                  {formData.logo_url && (
                    <div style={{ marginTop: '8px', width: 80, height: 80, borderRadius: '8px', overflow: 'hidden', backgroundColor: '#E8F5E9' }}>
                       <ResilientImage src={formData.logo_url} alt="Logo preview" fallbackLabel="Logo no disponible" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Imagen principal (Hero)</label>
                  <input ref={heroInputRef} type="file" accept="image/*" onChange={handleHeroUpload} style={{ display: 'none' }} />
                  <button
                    type="button"
                    onClick={() => heroInputRef.current?.click()}
                    disabled={uploadingHero}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 14px', border: '1.5px dashed rgba(0,0,0,0.18)', borderRadius: '8px', backgroundColor: '#F8F8F8', color: '#1A1A1A', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  >
                    <Upload size={16} /> {uploadingHero ? 'Subiendo imagen...' : formData.hero_image_url ? 'Cambiar imagen principal' : 'Seleccionar imagen principal'}
                  </button>
                  {formData.hero_image_url && (
                    <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', height: 160, backgroundColor: '#E8F5E9' }}>
                       <ResilientImage src={formData.hero_image_url} alt="Hero preview" fallbackLabel="Imagen principal no disponible" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
