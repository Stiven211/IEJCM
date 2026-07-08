import { useState, useEffect } from 'react'
import * as galleryService from '../../services/gallery.service'

export function GalleryPage() {
  const [items, setItems] = useState<galleryService.GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await galleryService.getAllGalleryItems()
        setItems(data)
      } catch (err) {
        console.error('Error cargando galería:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) 24px' }}>
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
          Galería
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, color: '#1A1A1A', margin: 0 }}>
          Nuestra Comunidad en Imágenes
        </h1>
      </div>

      {loading ? (
        <div style={{ color: '#5A7A5A', textAlign: 'center' }}>Cargando galería...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#5A7A5A', textAlign: 'center' }}>No hay imágenes en la galería.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {items.map(item => (
            <div key={item.id} style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#E8F5E9', aspectRatio: '4/3' }}>
              <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
