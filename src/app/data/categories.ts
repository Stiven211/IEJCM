import type { Event } from '../types'

export const CATEGORY_LABELS: Record<Event['category'], string> = {
  academic: 'Académico',
  cultural: 'Cultural',
  sports: 'Deportivo',
  institutional: 'Institucional',
}

export const CATEGORY_COLORS: Record<Event['category'], { bg: string; text: string }> = {
  academic: { bg: '#006400', text: '#FFFFFF' },
  cultural: { bg: '#92400E', text: '#FFFFFF' },
  sports: { bg: '#1E40AF', text: '#FFFFFF' },
  institutional: { bg: '#5B21B6', text: '#FFFFFF' },
}
