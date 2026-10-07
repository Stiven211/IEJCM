import { useState, useEffect, useMemo, memo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { HomeHero } from './home/HomeHero'
import { HomeAnnouncements } from './home/HomeAnnouncements'
import { HomeAbout } from './home/HomeAbout'
import { HomeEvents } from './home/HomeEvents'
import { HomeGallery } from './home/HomeGallery'
import { HomeCTA } from './home/HomeCTA'
import { HomeContact } from './home/HomeContact'
import type { Event } from '../types'
import * as eventService from '../../services/event.service'
import * as galleryService from '../../services/gallery.service'
import * as announcementService from '../../services/announcement.service'
import * as schoolInfoService from '../../services/schoolInfo.service'
import { logError } from '../../lib/logger'
import { isAnnouncementCurrent } from '../../utils/announcementDates'
import * as contactService from '../../services/contact.service'

const MemoizedHomeHero = memo(HomeHero)
const MemoizedHomeAnnouncements = memo(HomeAnnouncements)
const MemoizedHomeAbout = memo(HomeAbout)
const MemoizedHomeEvents = memo(HomeEvents)
const MemoizedHomeGallery = memo(HomeGallery)
const MemoizedHomeCTA = memo(HomeCTA)
const MemoizedHomeContact = memo(HomeContact)

export function HomePage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [gallery, setGallery] = useState<galleryService.GalleryItem[]>([])
  const [announcements, setAnnouncements] = useState<announcementService.Announcement[]>([])
  const [schoolInfo, setSchoolInfo] = useState<schoolInfoService.SchoolInfo | null>(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [heroDataReady, setHeroDataReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const timerRef = useRef<number | null>(null)

  const schoolName = schoolInfo?.school_name || 'Colegio José Celestino Mutis'
  // Sin imagen de portada el hero usa su propio fondo verde (HomeHero).
  // Antes caia a una foto de Unsplash de un casino: sin conexion, school_info
  // no carga y el visitante del colegio veia una mesa de juego de fondo. Y al
  // ser una URL remota, tampoco cargaba sin internet.
  const heroImage = schoolInfo?.hero_image_url || ''
  const heroTitle = schoolInfo?.hero_title || ''
  const heroSubtitle = schoolInfo?.hero_subtitle || ''
  const history = schoolInfo?.history || ''
  const aboutText = history
  const heroBadge = schoolInfo?.hero_badge || 'Año Escolar 2026 — Inscripciones Abiertas'
  const heroBadgeColor = schoolInfo?.hero_badge_color || '#991B1B'

  useEffect(() => {
    mountedRef.current = true
    setImageLoaded(false)
    setImageFailed(false)
    const img = new Image()
    img.src = heroImage
    const markLoaded = () => { if (mountedRef.current) { setImageLoaded(true); setImageFailed(false) } }
    const markFailed = () => { if (mountedRef.current) { setImageLoaded(false); setImageFailed(true) } }
    img.onload = markLoaded
    img.onerror = markFailed
    if (img.complete) {
      if (img.naturalWidth > 0) markLoaded()
      else markFailed()
    }
    return () => {
      mountedRef.current = false
    }
  }, [heroImage])

  useEffect(() => {
    if (heroDataReady && (imageLoaded || imageFailed || !heroImage)) {
      setHeroLoaded(true)
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setShowOverlay(false), 520)
      return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current)
      }
    }
  }, [heroDataReady, imageLoaded, imageFailed, heroImage])

  useEffect(() => {
    const load = async () => {
      try {
        const [evResult, galResult, annResult, infoResult] = await Promise.allSettled([
          eventService.getAllEvents(),
          galleryService.getAllGalleryItems(),
          announcementService.getAllAnnouncements(),
          schoolInfoService.getSchoolInfo(),
        ])

        const errors: string[] = []

        if (evResult.status === 'fulfilled') {
          setEvents(evResult.value.filter(e => e.active !== false))
        } else {
          errors.push('eventos')
          logError(evResult.reason, { action: 'loadHomeData', section: 'events' })
        }

        if (galResult.status === 'fulfilled') {
          setGallery(galResult.value)
        } else {
          errors.push('galería')
          logError(galResult.reason, { action: 'loadHomeData', section: 'gallery' })
        }

        if (annResult.status === 'fulfilled') {
          setAnnouncements(annResult.value)
        } else {
          errors.push('avisos')
          logError(annResult.reason, { action: 'loadHomeData', section: 'announcements' })
        }

        if (infoResult.status === 'fulfilled') {
          setSchoolInfo(infoResult.value)
        } else {
          errors.push('información institucional')
          logError(infoResult.reason, { action: 'loadHomeData', section: 'schoolInfo' })
        }

        setHeroDataReady(true)

        if (errors.length > 0) {
          // El detalle de que modulos fallaron va al log, no a pantalla:
          // el aviso al visitante es generico (ver el banner de arriba).
          logError(new Error(`Secciones con fallo: ${errors.join(', ')}`), {
            action: 'loadHomeData',
            sections: errors,
          })
          setLoadError('contenido incompleto')
        }
      } catch (err) {
        setHeroDataReady(true)
        logError(err, { action: 'loadHomeData', section: 'general' })
        setLoadError('Error general al cargar la página.')
      }
    }
    load()
  }, [])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const upcomingEvents = useMemo(() => {
    return events
      .filter(e => new Date(e.date + 'T00:00:00') >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)
  }, [events, today])

  const recentGallery = useMemo(() => {
    return gallery
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 6)
  }, [gallery])

  const activeAnnouncements = useMemo(() => {
    return announcements
      .filter(a => a.active !== false && isAnnouncementCurrent(a))
      .slice(0, 3)
  }, [announcements])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting || new FormData(e.currentTarget).get('website')) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await contactService.createContactMessage(form)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setSent(false), 4500)
    } catch (err) {
      logError(err, { action: 'submitContactMessage', page: 'home' })
      setSubmitError('No se pudo guardar el mensaje. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }, [form, submitting])

  const handleFormChange = useCallback((field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
  }, [])

  return (
    <div>
      {/* Aviso de contenido incompleto.

        Antes se renderizaba con marginBottom: '-16px', o sea encima del hero,
        y decia "No se pudo cargar: eventos, galería, avisos, información
        institucional", que es vocabulario interno: un padre no sabe que son
        "eventos" ni "avisos".

        Ahora va sobre el hero sin superponerse, con un mensaje entendible y
        un boton para reintentar. OfflineBanner cubre el caso sin conexion,
        que es el motivo mas comun. */}
      {loadError && (
        <div style={{ backgroundColor: '#FFF7ED', borderBottom: '1px solid rgba(180,83,9,0.18)', padding: '10px 20px', color: '#7C2D12', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span>No pudimos cargar toda la información del colegio.</span>
          <button
            onClick={() => window.location.reload()}
            style={{ background: 'none', border: '1px solid rgba(180,83,9,0.35)', borderRadius: '6px', color: '#7C2D12', cursor: 'pointer', padding: '4px 12px', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit' }}
          >
            Reintentar
          </button>
          <button onClick={() => setLoadError(null)} aria-label="Cerrar aviso" style={{ background: 'none', border: 'none', color: '#7C2D12', cursor: 'pointer', fontSize: '17px', lineHeight: 1, padding: '0 2px', fontFamily: 'inherit' }}>×</button>
        </div>
      )}

      <MemoizedHomeHero
        schoolName={schoolName}
        heroImage={heroImage}
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        heroBadge={heroBadge}
        heroBadgeColor={heroBadgeColor}
        aboutText={aboutText}
         history={history}
         heroLoaded={heroLoaded}
        showOverlay={showOverlay}
        onViewEvents={() => navigate('/eventos')}
        onScrollToAbout={() => document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' })}
      />

      <MemoizedHomeAnnouncements
        announcements={activeAnnouncements}
        onViewAll={() => navigate('/avisos')}
      />

      <MemoizedHomeAbout
        schoolInfo={schoolInfo}
        onLearnMore={() => navigate('/nosotros')}
      />

      <MemoizedHomeEvents
        events={upcomingEvents}
        onViewAll={() => navigate('/eventos')}
        onEventClick={(id) => navigate(`/eventos/${id}`)}
      />

      <MemoizedHomeGallery
        items={recentGallery}
        onViewGallery={() => navigate('/galeria')}
      />

      <MemoizedHomeCTA
        onContact={() => navigate('/contacto')}
        onViewEvents={() => navigate('/eventos')}
      />

      <MemoizedHomeContact
        schoolInfo={schoolInfo}
        form={form}
        sent={sent}
        submitting={submitting}
        submitError={submitError}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
