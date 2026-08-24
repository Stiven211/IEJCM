import { memo } from 'react'
import { ArrowRight } from 'lucide-react'
import { EventCard } from '../EventCard'
import type { Event } from '../../types'

const TRANSITION = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'

interface HomeEventsProps {
  events: Event[]
  onViewAll: () => void
  onEventClick: (id: string) => void
}

export const HomeEvents = memo(function HomeEvents({ events, onViewAll, onEventClick }: HomeEventsProps) {
  return (
    <section id="eventos" className="fade-in-up" style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#F8F8F8', animationDelay: '150ms' }}>
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
            onClick={onViewAll}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#006400', border: '1.5px solid #006400', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: TRANSITION }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = '#006400'; b.style.color = '#FFFFFF' }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = 'transparent'; b.style.color = '#006400' }}
            onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
          >
            Ver todos <ArrowRight size={15} />
          </button>
        </div>

        <div className="fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', animationDelay: '200ms' }}>
          {events.map(event => (
            <EventCard key={event.id} event={event} onClick={() => onEventClick(event.id)} />
          ))}
        </div>
      </div>
    </section>
  )
})
