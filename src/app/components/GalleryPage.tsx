import { useState, useEffect, useCallback } from 'react'
import * as galleryService from '../../services/gallery.service'
import { GallerySkeleton } from './ui/GallerySkeleton'
import { LoadErrorState } from './ui/LoadErrorState'
import { logError } from '../../lib/logger'
import { ResilientImage } from './ui/ResilientImage'

export function GalleryPage() {
  const [items, setItems] = useState<galleryService.GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await galleryService.getAllGalleryItems()
      setItems(data)
    } catch (err) {
      setError(true)
      logError(err, { action: 'loadGallery', page: 'gallery' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) 24px' }}>
      <div className="fade-in-up" style={{ marginBottom: '48px', textAlign: 'center', animationDelay: '80ms' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
          Galería
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, color: '#1A1A1A', margin: 0 }}>
          Nuestra Comunidad en Imágenes
        </h1>
      </div>

      <div aria-busy={loading}>
      {loading ? (
        <GallerySkeleton />
      ) : error ? (
        <LoadErrorState message="No se pudo cargar la galería." onRetry={load} />
      ) : items.length === 0 ? (
        <div className="fade-in" style={{ color: '#5A7A5A', textAlign: 'center' }}>No hay imágenes en la galería.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {items.map((item, i) => (
            <div key={item.id} className="fade-in-up" style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#E8F5E9', aspectRatio: '4/3', animationDelay: `${i * 60 + 120}ms` }}>
              <ResilientImage src={item.image_url} alt={item.title} fallbackLabel="Imagen de galería no disponible" loading="lazy" decoding="async" onLoad={e => (e.currentTarget.style.opacity = '1')} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0, transition: 'opacity 300ms ease' }} />
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
