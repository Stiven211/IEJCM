
import { useState } from 'react'
import { MapPin, Clock } from 'lucide-react'
import type { Event } from '../types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/categories'

interface EventCardProps {
  event: Event
  onClick: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const [hovered, setHovered] = useState(false)

  const date = new Date(event.date + 'T00:00:00')
  const day = date.getDate()
  const month = date.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '').toUpperCase()
  const year = date.getFullYear()

  const catColor = CATEGORY_COLORS[event.category]
  const catLabel = CATEGORY_LABELS[event.category]

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1.5px solid ${hovered ? '#006400' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: hovered ? '0 10px 36px rgba(0,100,0,0.13)' : '0 2px 10px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden', backgroundColor: '#E8F5E9', flexShrink: 0 }}>
        <img
          src={event.image}
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.45s ease',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)' }} />

        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          backgroundColor: '#006400',
          color: '#FFFFFF',
          borderRadius: '9px',
          padding: '8px 12px',
          textAlign: 'center',
          minWidth: '52px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
        }}>
          <div style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1 }}>{day}</div>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', marginTop: '2px', opacity: 0.88 }}>
            {month} {year}
          </div>
        </div>

        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          backgroundColor: catColor.bg,
          color: catColor.text,
          borderRadius: '20px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.03em',
        }}>
          {catLabel}
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          margin: '0 0 10px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#1A1A1A',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {event.title}
        </h3>

        <p style={{
          margin: '0 0 16px',
          fontSize: '13px',
          color: '#5A7A5A',
          lineHeight: 1.7,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {event.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#5A7A5A', fontSize: '13px' }}>
            <Clock size={13} style={{ flexShrink: 0, color: '#006400' }} />
            <span>{event.time}{event.endTime ? ` — ${event.endTime}` : ''}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#5A7A5A', fontSize: '13px' }}>
            <MapPin size={13} style={{ flexShrink: 0, color: '#006400' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</span>
          </div>
        </div>

        <button
          style={{
            width: '100%',
            backgroundColor: hovered ? '#006400' : 'transparent',
            color: hovered ? '#FFFFFF' : '#006400',
            border: '1.5px solid #006400',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.28s ease',
            letterSpacing: '0.01em',
            fontFamily: 'inherit',
          }}
        >
          Ver más →
        </button>
      </div>
    </div>
  )
}

