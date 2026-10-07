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
 * Lleva la vista a una seccion de la home (#galeria, #avisos, ...) incluso
 * cuando se llega desde otra ruta.
 *
 * El problema: la home arma su alto despues de que empiezan a llegar los
 * datos de Supabase, asi que las secciones que quedan por encima del destino
 * crecen cuando ya se calculo el offset y empujan el destino.
 *
 * La primera version corrigia la posicion con un bucle de requestAnimationFrame.
 * Congelaba la pagina: si el destino no era alcanzable por tope del documento
 * nunca convergia y el bucle scrolleaba al usuario durante 9 segundos.
 *
 * La segunda esperaba y luego corregia con scrollBy instantaneo. Ya no
 * congelaba, pero perdia la animacion: el ajuste instantaneo cancelaba el
 * scroll suave y ademas competia con el por el hilo principal.
 *
 * Ahora es al reves: se espera a que la home se estabilice y se hace UN solo
 * scroll suave. Sin correcciones instantaneas, sin saltos, y la animacion no
 * tiene contra que pelear porque no hay nada moviendose al mismo tiempo.
 *
 * Si pese a eso quedara corrido, se repite el scroll suave una vez, nunca un
 * salto instantaneo: eso era justo lo que se veia mal.
 *
 * Salidas de emergencia: si el usuario scrollea a mano se cancela todo, y
 * hay topes de tiempo y de espera. Antes que acertar el pixel exacto, no
 * bloquearle la pagina.
 */
function scrollToSectionWhenSettled(hash: string) {
  const TARGET_WAIT = 8000
  const SETTLE_WAIT = 2000
  const QUIET = 250
  const POLL = 80
  const ATTEMPTS = 3

  let finished = false
  let timer: number | undefined

  const cancel = () => {
    if (finished) return
    finished = true
    if (timer !== undefined) window.clearTimeout(timer)
    window.removeEventListener('wheel', onUserInput)
    window.removeEventListener('touchstart', onUserInput)
    window.removeEventListener('keydown', onUserInput)
  }

  const onUserInput = () => cancel()

  window.addEventListener('wheel', onUserInput, { passive: true })
  window.addEventListener('touchstart', onUserInput, { passive: true })
  window.addEventListener('keydown', onUserInput)

  const wait = (ms: number) =>
    new Promise<void>(resolve => {
      timer = window.setTimeout(resolve, ms)
    })

  const scrollSuave = () => {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

const run = async () => {
    const started = Date.now()

    // 1. esperar a que la ruta lazy renderice la seccion destino. Presupuesto
    //    propio y generoso: si la seccion no aparece nunca, antes se cancelaba
    //    en silencio y el click no hacia nada, que era el peor fallo posible.
    let target: HTMLElement | null = null
    while (!target && Date.now() - started < TARGET_WAIT) {
      target = document.getElementById(hash)
      if (!target) await wait(100)
    }
    if (!target || finished) return cancel()

    // 2. esperar a que la home deje de crecer. Es lo que hace que el scroll
    //    suave no se cancele: no hay nada mas moviendose al mismo tiempo. El
    //    presupuesto corre desde que el destino existe, no desde el click.
    const settleStarted = Date.now()
    let previousTop: number | null = null
    let quietSince = Date.now()
    while (Date.now() - settleStarted < SETTLE_WAIT && !finished) {
      await wait(POLL)
      const element = document.getElementById(hash)
      if (!element) break

      const top = element.getBoundingClientRect().top
      if (previousTop === null || Math.abs(top - previousTop) > 1) {
        previousTop = top
        quietSince = Date.now()
        continue
      }
      if (Date.now() - quietSince >= QUIET) break
    }
    if (finished) return cancel()

    // 3. un scroll suave, y si el destino quedara corrido se repite. Nunca un
    //    salto instantaneo: eso era justo lo que se veia mal.
    for (let intento = 0; intento < ATTEMPTS; intento++) {
      if (finished) return cancel()

      scrollSuave()
      await wait(900)
      if (finished) return cancel()

      const element = document.getElementById(hash)
      if (!element) break

      const margin = parseFloat(getComputedStyle(element).scrollMarginTop || '0')
      const offset = element.getBoundingClientRect().top - (Number.isFinite(margin) ? margin : 0)
      if (Math.abs(offset) <= 8) break
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
