import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ChevronDown, BookOpen, Users, Award, TrendingUp, ArrowRight, MapPin, Phone, Mail, Send, Check } from 'lucide-react'
import { EventCard } from './EventCard'
import * as eventService from '../../services/event.service'
import * as galleryService from '../../services/gallery.service'
import * as announcementService from '../../services/announcement.service'
import { EVENTS } from '../data/events'

const FALLBACK_GALLERY: galleryService.GalleryItem[] = [
  { id: 'fb1', title: 'Estudiantes en el patio', description: '', image_url: 'https://images.unsplash.com/photo-1553777907-f5dbbbb44d7c?w=800&h=600&fit=crop&auto=format', category: '', display_order: 1, created_at: '' },
  { id: 'fb2', title: 'Docente y estudiantes', description: '', image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&h=300&fit=crop&auto=format', category: '', display_order: 2, created_at: '' },
  { id: 'fb3', title: 'Actividades deportivas', description: '', image_url: 'https://images.unsplash.com/photo-1700914299961-d8f91559d85d?w=500&h=300&fit=crop&auto=format', category: '', display_order: 3, created_at: '' },
  { id: 'fb4', title: 'Ceremonia de graduación', description: '', image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=300&fit=crop&auto=format', category: '', display_order: 4, created_at: '' },
  { id: 'fb5', title: 'Aula de clases', description: '', image_url: 'https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=500&h=300&fit=crop&auto=format', category: '', display_order: 5, created_at: '' },
  { id: 'fb6', title: 'Festival Cultural', description: '', image_url: 'https://images.unsplash.com/photo-1719241368157-7c78535f3a92?w=500&h=300&fit=crop&auto=format', category: '', display_order: 6, created_at: '' },
]

export function HomePage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<eventService.Event[]>([])
  const [gallery, setGallery] = useState<galleryService.GalleryItem[]>([])
  const [announcements, setAnnouncements] = useState<announcementService.Announcement[]>([])
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [ev, gal, ann] = await Promise.all([
          eventService.getAllEvents(),
          galleryService.getAllGalleryItems(),
          announcementService.getAllAnnouncements(),
        ])
        setEvents(ev.length ? ev : EVENTS)
        setGallery(gal.length ? gal : FALLBACK_GALLERY)
        setAnnouncements(ann)
      } catch (err) {
        console.error('Error cargando datos del Home:', err)
        setEvents(EVENTS)
        setGallery(FALLBACK_GALLERY)
        setAnnouncements([])
      }
    }
    load()
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingEvents = events
    .filter(e => new Date(e.date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const recentGallery = gallery
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 6)

  const activeAnnouncements = announcements
    .filter(a => a.is_published !== false)
    .slice(0, 3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4500)
  }

  return (
    <div>
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
        .gallery-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .gallery-img:hover { transform: scale(1.05); }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden', backgroundColor: '#002200' }}>
        <img
          src="https://images.unsplash.com/photo-1553777907-f5dbbbb44d7c?w=1920&h=1080&fit=crop&auto=format"
          alt="Estudiantes del colegio"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.32 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(140deg, rgba(0,30,0,0.96) 0%, rgba(0,80,0,0.72) 55%, rgba(0,40,0,0.88) 100%)' }} />

        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(80px,10vw,120px) 24px clamp(60px,8vw,80px)', color: '#FFFFFF' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '24px', padding: '8px 18px', marginBottom: '28px', backdropFilter: 'blur(6px)' }}>
            <span style={{ width: 8, height: 8, backgroundColor: '#4ADE80', borderRadius: '50%', boxShadow: '0 0 8px #4ADE80' }} />
            <span style={{ fontSize: '13px', letterSpacing: '0.04em' }}>Año Escolar 2026 — Inscripciones Abiertas</span>
          </div>

          <h1 style={{ fontSize: 'clamp(38px, 6.5vw, 76px)', fontWeight: 800, lineHeight: 1.06, maxWidth: '740px', marginBottom: '24px', letterSpacing: '-0.025em' }}>
            Educando para<br />
            <span style={{ color: '#86EFAC' }}>Transformar</span><br />
            el Futuro
          </h1>

          <p style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', color: 'rgba(255,255,255,0.72)', maxWidth: '560px', marginBottom: '44px', lineHeight: 1.78 }}>
            Institución educativa con más de 45 años formando ciudadanos íntegros y comprometidos con el desarrollo de San José del Guaviare y la Amazonía colombiana.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/eventos')}
              style={{ backgroundColor: '#FFFFFF', color: '#006400', border: 'none', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.01em', transition: 'all 0.2s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#E8F5E9'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'}
            >
              Ver Eventos <ArrowRight size={16} />
            </button>
            <button
              onClick={() => document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ backgroundColor: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.4)', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.01em', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.8)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)'}
            >
              Sobre el Colegio
            </button>
          </div>
        </div>

        <div
          onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.38)', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '10px', letterSpacing: '0.12em' }}>DESPLAZAR</span>
          <ChevronDown size={17} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" style={{ backgroundColor: '#006400', color: '#FFFFFF', padding: '36px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
          {[
            { value: '45+', label: 'Años de Trayectoria', emoji: '🏫' },
            { value: '1,200+', label: 'Estudiantes Activos', emoji: '🎓' },
            { value: '80+', label: 'Docentes Calificados', emoji: '👩‍🏫' },
            { value: '5', label: 'Premios Nacionales', emoji: '🏆' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center', padding: '12px 8px' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>{stat.emoji}</div>
              <div style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.68)', marginTop: '8px', letterSpacing: '0.02em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AVISOS IMPORTANTES ── */}
      {activeAnnouncements.length > 0 && (
        <section style={{ padding: 'clamp(48px, 7vw, 80px) 24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-block', backgroundColor: '#FEF2F2', color: '#991B1B', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
                  Avisos importantes
                </div>
                <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.02em', margin: 0 }}>
                  Mantente informado
                </h2>
              </div>
              <button
                onClick={() => {}}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#991B1B', border: '1.5px solid #991B1B', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = '#991B1B'; b.style.color = '#FFFFFF' }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = 'transparent'; b.style.color = '#991B1B' }}
              >
                Ver todos <ArrowRight size={15} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {activeAnnouncements.map(ann => (
                <div key={ann.id} style={{ backgroundColor: '#F8F8F8', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#5A7A5A', marginBottom: '8px' }}>
                    {ann.published_at ? new Date(ann.published_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(ann.created_at || '').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', lineHeight: 1.35 }}>{ann.title}</h3>
                  <p style={{ fontSize: '14px', color: '#4A5E4A', lineHeight: 1.7, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SOBRE NOSOTROS ── */}
      <section id="sobre-nosotros" style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>
              Sobre Nosotros
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#1A1A1A', marginBottom: '20px', lineHeight: 1.18, letterSpacing: '-0.02em' }}>
              Formando el talento<br />
              <span style={{ color: '#006400' }}>de la Amazonía</span>
            </h2>
            <p style={{ color: '#4A5E4A', lineHeight: 1.85, marginBottom: '18px', fontSize: '16px' }}>
              xxx
            </p>
            <p style={{ color: '#4A5E4A', lineHeight: 1.85, marginBottom: '32px', fontSize: '16px' }}>
             xxx
            </p>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
               {[
                 { icon: BookOpen, text: 'Modelo pedagógico constructivista y por competencias' },
                 { icon: Users, text: 'Comunidad educativa activa de más de 3,500 personas' },
                 { icon: Award, text: 'Reconocida por el MEN con ISCE sobresaliente' },
                 { icon: TrendingUp, text: 'Programa PRAE premiado a nivel regional' },
               ].map(({ icon: Icon, text }) => (
                 <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: 36, height: 36, backgroundColor: '#E8F5E9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <Icon size={17} style={{ color: '#006400' }} />
                   </div>
                   <span style={{ color: '#3A4E3A', fontSize: '14px', lineHeight: 1.5 }}>{text}</span>
                 </div>
               ))}
             </div>

             <button
               onClick={() => {}}
               style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '13px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', marginTop: '8px' }}
               onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
               onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
             >
               Conocer más <ArrowRight size={15} />
             </button>
           </div>

          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#E8F5E9' }}>
              <img
                src="https://images.unsplash.com/photo-1727518493216-d75fcdb3f2b2?w=800&h=600&fit=crop&auto=format"
                alt="Estudiantes del Colegio"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '4/3' }}
              />
            </div>
            <div style={{ position: 'absolute', bottom: -20, left: -20, backgroundColor: '#006400', color: '#FFFFFF', borderRadius: '12px', padding: '16px 22px', boxShadow: '0 10px 32px rgba(0,100,0,0.35)' }}>
              <div style={{ fontSize: '30px', fontWeight: 800, lineHeight: 1 }}>48°</div>
              <div style={{ fontSize: '13px', opacity: 0.82, marginTop: '4px' }}>Aniversario 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRÓXIMOS EVENTOS ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#F8F8F8' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-block', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
                Agenda
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
                Próximos Eventos
              </h2>
            </div>
            <button
              onClick={() => navigate('/eventos')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#006400', border: '1.5px solid #006400', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = '#006400'; b.style.color = '#FFFFFF' }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = 'transparent'; b.style.color = '#006400' }}
            >
              Ver todos <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => navigate(`/eventos/${event.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERÍA ── */}
      <section style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-block', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
              Galería
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.02em', margin: 0 }}>
              Nuestra Comunidad en Imágenes
            </h2>
            <button
              onClick={() => {}}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '13px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', marginTop: '24px' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
            >
              Ver galería <ArrowRight size={15} />
            </button>
          </div>

          <div className="jcm-gallery">
            {recentGallery.map((item, i) => (
              <div key={item.id} className={i === 0 ? 'jcm-gallery-large' : ''} style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#E8F5E9', minHeight: '220px' }}>
                <img src={item.image_url} alt={item.title} className="gallery-img" style={{ minHeight: '220px' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: '#006400', padding: 'clamp(64px, 9vw, 100px) 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', color: '#FFFFFF' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em', lineHeight: 1.18 }}>
            ¿Listo para unirte a nuestra<br />familia educativa?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '17px', lineHeight: 1.78, marginBottom: '40px' }}>
            Las inscripciones para el año escolar 2027 estarán abiertas en octubre de 2026. Contáctanos para más información sobre el proceso de matrícula.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ backgroundColor: '#FFFFFF', color: '#006400', border: 'none', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#E8F5E9'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'}
            >
              Contáctanos
            </button>
            <button
              onClick={() => navigate('/eventos')}
              style={{ backgroundColor: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.4)', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.85)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)'}
            >
              Ver Eventos
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section id="contacto" style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#F8F8F8' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-block', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
              Contacto
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.02em', margin: 0 }}>
              Ponte en Contacto con Nosotros
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '28px' }}>Información de Contacto</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                {[
                  { Icon: MapPin, title: 'Dirección', content: 'Calle 8 #12-45, San José del Guaviare\nGuaviare, Colombia' },
                  { Icon: Phone, title: 'Teléfonos', content: '+57 *********\n+57 *********' },
                  { Icon: Mail, title: 'Correo Electrónico', content: 'rectoria@jcmutis.edu.co\nsecretaria@jcmutis.edu.co' },
                ].map(({ Icon, title, content }) => (
                  <div key={title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: 42, height: 42, backgroundColor: '#E8F5E9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} style={{ color: '#006400' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A1A', marginBottom: '4px' }}>{title}</div>
                      <div style={{ color: '#5A7A5A', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '250px', border: '1px solid rgba(0,100,0,0.1)' }}>
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14095.75967167216!2d-72.65122506261227!3d2.5586275951603885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e17769a18ff5b9d%3A0xa248bbbbb0ee26b4!2sColegio%20Jos%C3%A9%20Celestino%20Mutis!5e1!3m2!1ses-419!2sco!4v1780669704802!5m2!1ses-419!2sco" 
      width="100%" 
      height="100%" 
      style={{ border: 0 }} 
      allowFullScreen="" 
      loading="lazy" 
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '36px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>Envíanos un Mensaje</h3>
              <p style={{ color: '#5A7A5A', fontSize: '14px', marginBottom: '28px', lineHeight: 1.65 }}>
                Responderemos en un plazo máximo de 24 horas hábiles.
              </p>

              {sent ? (
                <div style={{ backgroundColor: '#E8F5E9', border: '1px solid rgba(0,100,0,0.3)', borderRadius: '12px', padding: '32px 20px', textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, backgroundColor: '#006400', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Check size={24} color="#FFFFFF" />
                  </div>
                  <div style={{ color: '#006400', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>¡Mensaje enviado!</div>
                  <div style={{ color: '#5A7A5A', fontSize: '14px' }}>Te responderemos pronto.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {[
                    { label: 'Nombre completo', key: 'name', type: 'text', placeholder: 'Tu nombre completo' },
                    { label: 'Correo electrónico', key: 'email', type: 'email', placeholder: 'tu@correo.com' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>{label}</label>
                      <input
                        type={type}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        required
                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#F8F8F8', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                        onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'}
                        onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.11)'}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Mensaje</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Escribe tu mensaje aquí..."
                      required
                      rows={5}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#F8F8F8', outline: 'none', boxSizing: 'border-box', resize: 'vertical', transition: 'border-color 0.2s' }}
                      onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = '#006400'}
                      onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(0,0,0,0.11)'}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '13px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
                  >
                    <Send size={16} /> Enviar Mensaje
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
