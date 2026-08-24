import { memo } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Announcement } from '../../../services/announcement.service'

const TRANSITION = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'

interface HomeAnnouncementsProps {
  announcements: Announcement[]
  onViewAll: () => void
}

export const HomeAnnouncements = memo(function HomeAnnouncements({ announcements, onViewAll }: HomeAnnouncementsProps) {
  if (announcements.length === 0) return null

  return (
    <section id="avisos" className="fade-in-up" style={{ padding: 'clamp(48px, 7vw, 80px) 24px', backgroundColor: '#FFFFFF', animationDelay: '50ms' }}>
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
            onClick={onViewAll}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#991B1B', border: '1.5px solid #991B1B', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: TRANSITION }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = '#991B1B'; b.style.color = '#FFFFFF' }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = 'transparent'; b.style.color = '#991B1B' }}
            onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
          >
            Ver todos <ArrowRight size={15} />
          </button>
        </div>

        <div className="fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', animationDelay: '150ms' }}>
          {announcements.map(ann => (
            <div key={ann.id} style={{ backgroundColor: '#F8F8F8', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '20px', transition: TRANSITION }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)' }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}>
              <div style={{ fontSize: '13px', color: '#5A7A5A', marginBottom: '8px' }}>
                {ann.start_date ? new Date(ann.start_date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(ann.created_at || '').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', lineHeight: 1.35 }}>{ann.title}</h3>
              <p style={{ fontSize: '14px', color: '#4A5E4A', lineHeight: 1.7, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ann.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})
