import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Search, Calendar } from 'lucide-react'
import { EventCard } from './EventCard'
import * as eventService from '../../services/event.service'
import type { Event } from '../types'

type FilterTab = 'upcoming' | 'this-month' | 'past'

export function EventsPage() {
  const navigate = useNavigate()
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await eventService.getAllEvents()
        setAllEvents(data)
      } catch (err) {
        console.error('Error cargando eventos:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const counts = useMemo(() => ({
    upcoming: allEvents.filter(e => new Date(e.date + 'T00:00:00') >= today).length,
    'this-month': allEvents.filter(e => {
      const d = new Date(e.date + 'T00:00:00')
      const now = new Date()
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    }).length,
    past: allEvents.filter(e => new Date(e.date + 'T00:00:00') < today).length,
  }), [allEvents, today])

  const filteredEvents = useMemo(() => {
    let list = [...allEvents]

    if (activeFilter === 'upcoming') {
      list = list.filter(e => new Date(e.date + 'T00:00:00') >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (activeFilter === 'this-month') {
      list = list.filter(e => {
        const d = new Date(e.date + 'T00:00:00')
        const now = new Date()
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else {
      list = list.filter(e => new Date(e.date + 'T00:00:00') < today)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      )
    }

    if (categoryFilter !== 'all') {
      list = list.filter(e => e.category === categoryFilter)
    }

    return list
  }, [allEvents, activeFilter, searchQuery, categoryFilter, today])

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'upcoming', label: 'Próximos' },
    { key: 'this-month', label: 'Este mes' },
    { key: 'past', label: 'Pasados' },
  ]

  return (
    <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#006400', padding: 'clamp(48px, 6vw, 80px) 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '12px', letterSpacing: '0.03em' }}>
            Inicio / Eventos
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Eventos Institucionales
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, maxWidth: '540px', lineHeight: 1.7 }}>
            Mantente al día con las actividades académicas, culturales, deportivas e institucionales del colegio.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '28px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '4px', gap: '2px' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: activeFilter === tab.key ? '#006400' : 'transparent',
                  color: activeFilter === tab.key ? '#FFFFFF' : '#5A7A5A',
                  fontSize: '14px',
                  fontWeight: activeFilter === tab.key ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {tab.label}
                <span style={{
                  backgroundColor: activeFilter === tab.key ? 'rgba(255,255,255,0.22)' : '#F0F4F0',
                  color: activeFilter === tab.key ? '#FFFFFF' : '#5A7A5A',
                  borderRadius: '12px',
                  padding: '1px 7px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#5A7A5A', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '34px', paddingRight: '12px', height: '40px', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#FFFFFF', outline: 'none', fontFamily: 'inherit', minWidth: '200px', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.09)'}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{ height: '40px', padding: '0 12px', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#FFFFFF', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
            >
              <option value="all">Todas las categorías</option>
              <option value="academic">Académico</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Deportivo</option>
              <option value="institutional">Institucional</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '24px', color: '#5A7A5A', fontSize: '14px' }}>
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#5A7A5A' }}>Cargando eventos...</div>
        ) : filteredEvents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => navigate(`/eventos/${event.id}`)} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#5A7A5A' }}>
            <Calendar size={52} style={{ color: '#C8E6C9', margin: '0 auto 18px' }} />
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1A1A1A' }}>No se encontraron eventos</div>
            <div style={{ fontSize: '14px' }}>Intenta con otros filtros o términos de búsqueda.</div>
          </div>
        )}
      </div>
    </div>
  )
}
