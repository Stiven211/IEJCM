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
 * Lleva la vista a una seccion de la home (`/#galeria`, `/#avisos`, ...)
 * incluso cuando se llega desde otra ruta.
 *
 * El problema: la home arma su alto despues de que empiezan a llegar los
 * datos de Supabase, asi que las secciones que quedan por encima del destino
 * crecen cuando ya se calculo el offset y empujan el destino.
 *
 * La version anterior de esto usaba un bucle con requestAnimationFrame que
 * corrigia la posicion en cada frame. Parecia funcionar pero congelaba la
 * pagina: si el destino no era alcanzable por tope del documento, la
 * correccion nunca convergia y el bucle scrolleaba al usuario durante 9
 * segundos, sin dejarle desplazar ni arriba ni abajo.
 *
* Ahora son tres pasos con tres salidas de emergencia:
 *   - un unico scroll suave (el unico que el usuario percibe)
 *   - se espera a que la home deje de crecer, y solo entonces se corrige
 *   - se aborta si el usuario scrollea a mano, si no se puede avanzar mas, o
 *     si se agotan los intentos. Nunca se bloquea la pagina.
 *
 * La correccion respeta el scroll-margin-top del elemento (70px en
 * globals.css), para no dejar el titulo de la seccion debajo del header fijo.
 */
function scrollToSectionWhenSettled(hash: string) {
  const MAX_MS = 9000
  const QUIET_MS = 600
  const STEP = 120

  let finished = false
  let timer: number | undefined

  // Cortafuegos 1: si el usuario toca el scroll, se cancela todo. Antes que
  // acertar el pixel exacto, no bloquearle la pagina.
  const onUserInput = () => cancel()

  const cancel = () => {
    if (finished) return
    finished = true
    if (timer !== undefined) window.clearTimeout(timer)
    window.removeEventListener('wheel', onUserInput)
    window.removeEventListener('touchstart', onUserInput)
    window.removeEventListener('keydown', onUserInput)
  }

  window.addEventListener('wheel', onUserInput, { passive: true })
  window.addEventListener('touchstart', onUserInput, { passive: true })
  window.addEventListener('keydown', onUserInput)

  const marginOf = (el: Element) => {
    const value = parseFloat(getComputedStyle(el).scrollMarginTop || '0')
    return Number.isFinite(value) ? value : 0
  }

  const wait = (ms: number) =>
    new Promise<void>(resolve => {
      timer = window.setTimeout(resolve, ms)
    })

  const run = async () => {
    const started = Date.now()

    // Paso 1: esperar a que la ruta lazy renderice la seccion destino.
    let target: HTMLElement | null = null
    while (!target && Date.now() - started < 4000) {
      target = document.getElementById(hash)
      if (!target) await wait(100)
    }
    if (!target || finished) return cancel()

// Paso 2: el unico scroll suave, el que percibe el usuario.
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // Ventana de calma antes de empezar a sondear. El scroll suave necesita
    // frames del compositor, y el bucle de sondeo compite por el hilo
    // principal: medir desde el primer frame lo deja sin frames y se ve como
    // un salto seco. 450ms es lo que tarda el scroll suave en completarse.
    await wait(450)

    // Paso 3: esperar a que el layout se estabilice y ajustar si quedo corrido.
    let previousTop = target.getBoundingClientRect().top
    let quietSince = Date.now()
    let corrections = 0

    while (Date.now() - started < MAX_MS && corrections < 3 && !finished) {
      await wait(STEP)

      const element = document.getElementById(hash)
      if (!element) break

      const top = element.getBoundingClientRect().top

      // El destino se movio: sigue llegando contenido de arriba. Se sigue
      // esperando. Esto tambien cubre el scroll suave en curso.
      if (Math.abs(top - previousTop) > 1) {
        previousTop = top
        quietSince = Date.now()
        continue
      }

      if (Date.now() - quietSince < QUIET_MS) continue

      const expected = marginOf(element)
      const offset = top - expected
      if (Math.abs(offset) <= 2) break

      const before = window.scrollY
      window.scrollBy({ top: offset, behavior: 'instant' as ScrollBehavior })
      corrections++

      // Cortafuegos 2: la pagina no se movio, estamos en el tope del documento.
      // No hay nada mas que ajustar y seguir insistiendo congelaria al usuario.
      if (Math.abs(window.scrollY - before) < 1) break

      previousTop = expected
      quietSince = Date.now()
    }

    cancel()
  }

  void run()
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
