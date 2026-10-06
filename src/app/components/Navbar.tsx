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

/**
 * La home carga su contenido de forma asincrona (Supabase + rutas lazy), asi que
 * calcular el offset una sola vez despues de navegar deja al usuario en una
 * posicion incorrecta: las secciones que quedan por encima del destino todavia
 * no tienen su altura definitiva: crecen despues y empujan el destino.
 *
 * Antes se resolvia con un ResizeObserver que se rendia a los 600ms de
 * inactividad. Si los datos tardaban mas, el observer ya estaba desconectado
 * cuando llegaban y el destino quedaba corrido.
 *
 * Ahora son tres fases explicitas:
 *   1. espera     -> el destino aun no esta en el DOM
 *   2. animacion  -> un unico scroll suave, el que percibe el usuario
 *   3. correccion -> mientras el layout siga creciendo, ajustes instantaneos y
 *                    silenciosos. Se espera a que termine la animacion para no
 *                    cancelarse entre si.
 *
 * El ajuste instantaneo es a proposito: globals.css pone html { scroll-behavior:
 * smooth }, asi que un scrollBy normal seria otra animacion y nunca alcanzaria
 * el destino. El usuario solo ve la de la fase 2.
 */
type HashScrollPhase = 'espera' | 'animacion' | 'correccion'

function scrollToSectionWhenSettled(hash: string, quietMs = 500, maxMs = 9000) {
  const started = Date.now()
  let raf = 0
  let phase: HashScrollPhase = 'espera'
  let lastScrollY = window.scrollY
  let lastTop: number | null = null
  let stableSince = Date.now()

  const stop = () => cancelAnimationFrame(raf)

  const tick = () => {
    if (Date.now() - started > maxMs) {
      stop()
      return
    }

    const target = document.getElementById(hash)
    if (!target) {
      raf = requestAnimationFrame(tick)
      return
    }

    const top = target.getBoundingClientRect().top

    if (phase === 'espera') {
      phase = 'animacion'
      lastScrollY = window.scrollY
      stableSince = Date.now()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      raf = requestAnimationFrame(tick)
      return
    }

    if (phase === 'animacion') {
      // No corregir mientras el scroll suave sigue en marcha.
      const y = window.scrollY
      if (Math.abs(y - lastScrollY) > 1) {
        lastScrollY = y
        stableSince = Date.now()
      }
      if (Date.now() - stableSince >= 250) {
        phase = 'correccion'
        lastTop = target.getBoundingClientRect().top
        stableSince = Date.now()
      }
      raf = requestAnimationFrame(tick)
      return
    }

    // El destino se movio: llego contenido de las secciones de arriba.
    if (lastTop !== null && Math.abs(top - lastTop) > 1) {
      lastTop = top
      stableSince = Date.now()
    }

    if (Math.abs(top) > 1) {
      window.scrollBy({ top, behavior: 'instant' as ScrollBehavior })
      lastTop = 0
      stableSince = Date.now()
      raf = requestAnimationFrame(tick)
      return
    }

    if (Date.now() - stableSince >= quietMs) {
      stop()
      return
    }

    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)
}

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
      // Al cambiar de ruta, ScrollToTop lleva el scroll a 0; despues hay que
      // llevar el usuario a la seccion, no dejarlo arriba.
      if (location.pathname !== '/') {
        navigate('/')
        requestAnimationFrame(() => scrollToSectionWhenSettled(hash))
      } else {
        scrollToSectionWhenSettled(hash)
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

        <div className="desktop-nav" style={{ alignItems: 'center', gap: '4px' }}>
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

        </div>

        <button
          className="mobile-nav-toggle"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '8px',
            alignItems: 'center',
            transition: TRANSITION,
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div
          className="mobile-nav-panel"
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
        </div>
      )}
    </header>
  )
}
