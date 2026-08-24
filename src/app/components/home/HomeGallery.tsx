import { memo } from 'react'
import { ArrowRight } from 'lucide-react'
import type { GalleryItem } from '../../../services/gallery.service'
import { ResilientImage } from '../ui/ResilientImage'

interface HomeGalleryProps {
  items: GalleryItem[]
  onViewGallery: () => void
}

export const HomeGallery = memo(function HomeGallery({ items, onViewGallery }: HomeGalleryProps) {
  return (
    <section id="galeria" className="fade-in-up" style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#FFFFFF', animationDelay: '200ms' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
            Galería
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.02em', margin: 0 }}>
            Nuestra Comunidad en Imágenes
          </h2>
          <button
            onClick={onViewGallery}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '13px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', marginTop: '24px' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
          >
            Ver galería <ArrowRight size={15} />
          </button>
        </div>

        <div className="jcm-gallery">
          {items.map((item, i) => (
            <div key={item.id} className={`fade-in-up ${i === 0 ? 'jcm-gallery-large' : ''}`} style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#E8F5E9', minHeight: '220px', animationDelay: `${i * 60 + 120}ms` }}>
              <ResilientImage src={item.image_url} alt={item.title} fallbackLabel="Imagen de galería no disponible" className="gallery-img" loading="lazy" decoding="async" onLoad={e => (e.currentTarget.style.opacity = '1')} style={{ minHeight: '220px', opacity: 0 }} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .jcm-gallery {
          display: grid;
          gap: 12px;
          grid-template-columns: 1.5fr 1fr 1fr;
          grid-template-rows: 260px 260px;
        }
        .jcm-gallery-large { grid-row: span 2; }
        @media (max-width: 900px) {
          .jcm-gallery {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
          }
          .jcm-gallery-large { grid-row: span 1; }
        }
        @media (max-width: 550px) {
          .jcm-gallery { grid-template-columns: 1fr; }
        }
        .gallery-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; will-change: transform; }
        .gallery-img:hover { transform: scale(1.05); }
      `}</style>
    </section>
  )
})
