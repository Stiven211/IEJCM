import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { GraduationCap, MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react'
import { TikTokIcon } from './ui/TikTokIcon'
import * as schoolInfoService from '../../services/schoolInfo.service'
import { ResilientImage } from './ui/ResilientImage'

const TRANSITION = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'

export function Footer() {
  const [info, setInfo] = useState<schoolInfoService.SchoolInfo | null>(null)

  useEffect(() => {
    let cancelled = false
    schoolInfoService.getSchoolInfo().then(data => {
      if (!cancelled && data) setInfo(data)
    })
    return () => { cancelled = true }
  }, [])

  const schoolName = info?.school_name || 'Colegio José Celestino Mutis'
  const address = info?.address || ''
  const phone = info?.phone || ''
  const email = info?.email || ''
  const facebook = info?.facebook || ''
  const instagram = info?.instagram || ''
  const youtube = info?.youtube || ''

  const contactLines = [
    ...(address ? [{ Icon: MapPin, text: address }] : []),
    ...(phone ? phone.split('\n').map(line => ({ Icon: Phone, text: line })) : []),
    ...(email ? email.split('\n').map(line => ({ Icon: Mail, text: line })) : []),
  ]

  const socials = [
    ...(facebook ? [{ Icon: Facebook, href: facebook }] : []),
    ...(instagram ? [{ Icon: Instagram, href: instagram }] : []),
    ...(youtube ? [{ Icon: TikTokIcon, href: youtube, label: 'TikTok' }] : []),
  ]

  return (
    <footer style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              {info?.logo_url ? (
                <ResilientImage
                  src={info.logo_url}
                  alt={schoolName}
                  fallbackLabel="Logo institucional no disponible"
                  decoding="async"
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, backgroundColor: '#006400' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <div style={{ width: 40, height: 40, backgroundColor: '#006400', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <GraduationCap size={20} color="#FFFFFF" />
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.3 }}>{schoolName}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>San José del Guaviare</div>
              </div>
              </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.85, marginBottom: '24px' }}>
              {info?.history ? info.history.split('\n')[0] : ''}
            </p>
             <div style={{ display: 'flex', gap: '10px' }}>
               {socials.map(({ Icon, href }, i) => (
                 <a
                   key={i}
                   href={href}
                   target="_blank"
                   rel="noreferrer"
                   style={{ width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: TRANSITION, textDecoration: 'none' }}
                   onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(0,100,0,0.5)'}
                   onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.07)'}
                 >
                   <Icon size={15} color="rgba(255,255,255,0.6)" />
                 </a>
               ))}
             </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '11px', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4CAF50' }}>Navegación</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Avisos', to: '/avisos' },
                { label: 'Sobre Nosotros', to: '/nosotros' },
                { label: 'Eventos', to: '/eventos' },
                { label: 'Galería', to: '/galeria' },
                { label: 'Documentos', to: '/documentos' },
                { label: 'Contacto', to: '/contacto' },
                { label: 'Acceso Administrativo', to: '/admin' },
              ].map(item => (
                <li key={item.label}>
                   <Link
                     to={item.to}
                     style={{ color: 'rgba(255,255,255,0.52)', textDecoration: 'none', fontSize: '14px', transition: TRANSITION }}
                     onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF'}
                     onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.52)'}
                   >
                     {item.label}
                   </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '11px', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4CAF50' }}>Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {contactLines.map(({ Icon, text }, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Icon size={14} style={{ color: '#228B22', flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ color: 'rgba(255,255,255,0.52)', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '11px', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4CAF50' }}>Horario</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <Clock size={14} style={{ color: '#228B22', flexShrink: 0, marginTop: '3px' }} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '3px' }}>Jornada Mañana (Lun–Vie)</div>
                <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>6:30 AM — 1:00 PM</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '3px' }}>Jornada Tarde (Lun–Vie)</div>
                <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px' }}>1:00 PM — 6:00 PM</div>
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(34,139,34,0.12)', border: '1px solid rgba(34,139,34,0.25)', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ color: '#4CAF50', fontSize: '11px', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secretaría</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Lun–Vie: 7:00 AM – 4:00 PM</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            © 2026 {schoolName}. Todos los derechos reservados.
          </div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>
            NIT: 892.099.311-7 · DANE: 150001006434
          </div>
        </div>
      </div>
    </footer>
  )
}
