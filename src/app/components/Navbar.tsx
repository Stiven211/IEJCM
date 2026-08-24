import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { Menu, X, GraduationCap } from 'lucide-react'
import * as schoolInfoService from '../../services/schoolInfo.service'
import { ResilientImage } from './ui/ResilientImage'

const NAV_LINKS = [
  { to: '/#inicio', label: 'Inicio', isHash: true },
  { to: '/#avisos', label: 'Avisos', isHash: true },
  { to: '/#sobre-nosotros', label: 'Sobre Nosotros', isHash: true },
  { to: '/#eventos', label: 'Eventos', isHash: true },
  { to: '/#galeria', label: 'Galería', isHash: true },
  { to: '/documentos', label: 'Documentos' },
  { to: '/#contacto', label: 'Contacto', isHash: true },
]

const TRANSITION = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [schoolName, setSchoolName] = useState('Colegio José Celestino Mutis')
  const [schoolInfo, setSchoolInfo] = useState<schoolInfoService.SchoolInfo | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let cancelled = false
    schoolInfoService.getSchoolInfo().then(data => {
      if (!cancelled && data) {
        setSchoolInfo(data)
        if (data.school_name) setSchoolName(data.school_name)
      }
    })
    return () => { cancelled = true }
  }, [])

  const handleNavClick = (to: string, isHash?: boolean) => {
    setMenuOpen(false)
    if (isHash) {
      const hash = to.replace('/#', '')
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(to)
    }
  }

  const isActive = (to: string, isHash: boolean) => {
    if (isHash) return false
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#006400',
      boxShadow: '0 2px 20px rgba(0,0,0,0.18)',
    }}>
      <nav style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
          {schoolInfo?.logo_url ? (
            <ResilientImage
              src={schoolInfo.logo_url}
              alt={schoolName}
              fallbackLabel="Logo institucional no disponible"
              decoding="async"
              style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, backgroundColor: '#FFFFFF' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div style={{
              width: 42,
              height: 42,
              backgroundColor: '#FFFFFF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <GraduationCap size={22} style={{ color: '#006400' }} />
            </div>
          )}
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              {schoolName}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', letterSpacing: '0.04em' }}>
              San José del Guaviare · Est. 1978
            </div>
          </div>
        </Link>

        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '4px' }}>
          {NAV_LINKS.map(link => {
            const active = isActive(link.to, link.isHash)
            return (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to, link.isHash)}
                style={{
                  background: active ? 'rgba(255,255,255,0.18)' : 'none',
                  border: 'none',
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  transition: TRANSITION,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.1)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)'
                  }
                }}
                onMouseDown={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)' }}
                onMouseUp={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
              >
                {link.label}
              </button>
            )
          })}

          <div style={{ width: 1, height: 22, backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />

          <button
            onClick={() => navigate('/admin')}
            style={{
              border: '1px solid rgba(255,255,255,0.35)',
              color: 'rgba(255,255,255,0.85)',
              backgroundColor: 'transparent',
              padding: '7px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: TRANSITION,
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.12)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)'
            }}
            onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)'}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
          >
            Acceso Admin
          </button>
        </div>

        <button
          className="md:hidden"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            transition: TRANSITION,
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: '#004d00',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '12px',
            animation: 'fadeInDown 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {NAV_LINKS.map(link => (
            <button
              key={link.to}
              onClick={() => handleNavClick(link.to, link.isHash)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '13px 24px',
                color: '#FFFFFF',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: TRANSITION,
              }}
              onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'}
              onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
            >
              {link.label}
            </button>
          ))}
          <div style={{ padding: '12px 24px 0' }}>
            <button
              onClick={() => { navigate('/admin'); setMenuOpen(false) }}
              style={{
                width: '100%',
                border: '1px solid rgba(255,255,255,0.35)',
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                padding: '11px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: TRANSITION,
              }}
              onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)'}
              onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
            >
              Acceso Admin
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
