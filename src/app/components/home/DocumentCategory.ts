export const CATEGORY_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'excusas', label: 'Excusas' },
  { value: 'permisos', label: 'Permisos' },
  { value: 'circulares', label: 'Circulares' },
  { value: 'formatos', label: 'Formatos' },
  { value: 'guias', label: 'Guías' },
  { value: 'comunicados', label: 'Comunicados' },
  { value: 'institucional', label: 'Institucional' },
  { value: 'otros', label: 'Otros' },
] as const

export type Category = typeof CATEGORY_OPTIONS[number]['value']

export function getCategoryLabel(category: string): string {
  const option = CATEGORY_OPTIONS.find(opt => opt.value === category)
  return option?.label || category
}
