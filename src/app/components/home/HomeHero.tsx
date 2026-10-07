import { memo, useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { HeroSkeleton } from '../ui/HeroSkeleton'
import { ResilientImage } from '../ui/ResilientImage'

const TRANSITION = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'

interface HomeHeroProps {
  schoolName: string
  heroImage: string
  heroTitle: string
  heroSubtitle: string
  heroBadge: string
  heroBadgeColor: string
  aboutText: string
  history: string
  heroLoaded: boolean
  showOverlay: boolean
  onViewEvents: () => void
  onScrollToAbout: () => void
}

export const HomeHero = memo(function HomeHero({
  schoolName,
  heroImage,
  heroTitle,
  heroSubtitle,
  heroBadge,
  heroBadgeColor,
   aboutText,
   history,
   heroLoaded,
  showOverlay,
  onViewEvents,
  onScrollToAbout,
}: HomeHeroProps) {
  const description = history || heroSubtitle || aboutText

  // El contenido no puede depender solo de heroLoaded, que lo dispara el
  // onLoad de la foto. Sin conexion hay dos formas de quedarse invisible:
  //   - no hay imagen configurada: nunca hay onLoad
  //   - la URL viene de la cache de sessionStorage pero la foto no carga:
  //     tampoco hay onLoad, hay onError
  const [imagenFallida, setImagenFallida] = useState(false)
  const contenidoVisible = heroLoaded || imagenFallida || !heroImage

  return (
    <section id="inicio" aria-label={schoolName} style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden', backgroundColor: '#002200' }}>
      {/* Si no hay imagen configurada no se dibuja nada: el fondo verde del
          contenedor y los velos de abajo ya forman el hero. Antes se caia a
          una foto de Unsplash de un casino, que sin conexion era lo unico que
          se veia.

          Si hay URL pero la foto no carga, el fallback de ResilientImage
          tambien tiene que ser invisible: su caja verde clara tapaba el hero. */}
      {heroImage && (
        <ResilientImage
          src={heroImage}
          alt=""
          fallbackLabel=""
          fallbackStyle={{ backgroundColor: 'transparent', minHeight: 0 }}
          onError={() => setImagenFallida(true)}
          decoding="async"
          fetchPriority="high"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.68 }}
        />
      )}
      {/* Dos velos superpuestos, no uno opaco.
          Antes: imagen en opacity 0.32 + gradiente de 0.72-0.96 => la foto
          quedaba al 3-9% de visibilidad y el hero se veía como un verde solido.
          Ahora la foto se ve (apagada, ~26%) y el texto sigue con contraste:
            - capa vertical: baja el brillo del cielo (arriba es casi blanco)
            - capa horizontal: fuerte a la izquierda, donde vive el texto,
              y se abre a la derecha para que se vea la foto
          Valores revisados a pedido del colegio: mas oscuro que la primera
          version, sin volver a tapar la imagen. Contraste medido sobre los
          pixeles compuestos, no estimado. */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,24,0,0.78) 0%, rgba(0,24,0,0.48) 32%, rgba(0,24,0,0.82) 100%), linear-gradient(100deg, rgba(0,22,0,0.94) 0%, rgba(0,22,0,0.86) 38%, rgba(0,22,0,0.62) 70%, rgba(0,22,0,0.42) 100%)' }} />

      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(80px,10vw,120px) 24px clamp(60px,8vw,80px)', color: '#FFFFFF', opacity: contenidoVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <div className="fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '24px', padding: '8px 18px', marginBottom: '28px', backdropFilter: 'blur(6px)', animationDelay: '100ms' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', boxShadow: '0 0 8px ' + heroBadgeColor, backgroundColor: heroBadgeColor }} />
          <span style={{ fontSize: '13px', letterSpacing: '0.04em', color: '#FFFFFF' }}>{heroBadge}</span>
        </div>

        <h1 className="fade-in-up" style={{ fontSize: 'clamp(38px, 6.5vw, 76px)', fontWeight: 800, lineHeight: 1.06, maxWidth: '740px', marginBottom: '24px', letterSpacing: '-0.025em', animationDelay: '180ms', textShadow: '0 2px 18px rgba(0,20,0,0.55), 0 1px 3px rgba(0,20,0,0.4)' }}>
          {heroTitle || 'Educando para'}
          <br />
          <span style={{ color: '#86EFAC' }}>{heroSubtitle || 'Transformar'}</span>
          <br />
          el Futuro
        </h1>

        <p className="fade-in-up" style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', color: 'rgba(255,255,255,0.88)', maxWidth: '560px', marginBottom: '44px', lineHeight: 1.78, animationDelay: '240ms' }}>
          {description}
        </p>

        <div className="fade-in-up" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', animationDelay: '300ms' }}>
          <button
            onClick={onViewEvents}
            style={{ backgroundColor: '#FFFFFF', color: '#006400', border: 'none', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.01em', transition: TRANSITION, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#E8F5E9'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'}
            onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
          >
            Ver Eventos <ArrowRight size={16} />
          </button>
          <button
            onClick={onScrollToAbout}
            style={{ backgroundColor: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.4)', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.01em', fontFamily: 'inherit', transition: TRANSITION }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.8)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)'}
            onMouseDown={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'scale(0.97)'; b.style.borderColor = 'rgba(255,255,255,1)' }}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
          >
            Sobre el Colegio
          </button>
        </div>
      </div>

      <div
        onClick={onScrollToAbout}
        role="button"
        tabIndex={0}
        aria-label="Desplazar hacia abajo"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onScrollToAbout() } }}
        className="fade-in-up"
        style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.38)', cursor: 'pointer', opacity: contenidoVisible ? 1 : 0, transition: 'opacity 0.5s ease', animationDelay: '400ms', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}
      >
        <span style={{ fontSize: '10px', letterSpacing: '0.12em' }}>DESPLAZAR</span>
        <ChevronDown size={17} />
      </div>

      {showOverlay && (
         <HeroSkeleton
           badge={heroBadge}
           badgeColor={heroBadgeColor}
           title={heroTitle || 'Educando para'}
           subtitle={heroSubtitle || 'Transformar'}
           description={description}
           visible={showOverlay}
         />
      )}
    </section>
  )
})
