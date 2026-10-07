import type { Announcement } from '../types'

/**
 * Valores admitidos por los CHECK de Postgres en la tabla `announcements`.
 *
 * NO son una invencion: son exactamente lo que acepta la base. Estaban en un
 * <input type="text"> libre, asi que escribir "General" con mayuscula, o
 * "matrícula" con tilde, hacia fallar el INSERT con un 400 que el panel
 * mostraba como un generico "no se pudo guardar", sin decir por que.
 *
 * Si se cambia el CHECK en la base, hay que cambiar esta lista.
 */

export const ANNOUNCEMENT_TYPES: { value: string; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'matricula', label: 'Matrícula' },
  { value: 'evento', label: 'Evento' },
  { value: 'suspension', label: 'Suspensión' },
  { value: 'importante', label: 'Importante' },
]

export const ANNOUNCEMENT_PRIORITIES: { value: string; label: string }[] = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
]

export const ANNOUNCEMENT_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  ANNOUNCEMENT_TYPES.map((o) => [o.value, o.label]),
)

export const ANNOUNCEMENT_PRIORITY_LABELS: Record<string, string> = Object.fromEntries(
  ANNOUNCEMENT_PRIORITIES.map((o) => [o.value, o.label]),
)

/** Los valores admitidos, para validar antes de pegarle a la base. */
const TIPOS = new Set(ANNOUNCEMENT_TYPES.map((o) => o.value))
const PRIORIDADES = new Set(ANNOUNCEMENT_PRIORITIES.map((o) => o.value))

/**
 * Normaliza lo que el admin escribio. Tolera mayusculas, espacios y tildes
 * ("  Matrícula " -> "matricula"), porque el CHECK exige minusculas exactas.
 * Si el valor no corresponde a ninguna opcion devuelve null, para que el
 * formulario avise en vez de dejar que Postgres rechace el INSERT.
 */
export function normalizarTipoAnnouncement(valor: string): string | null {
  const limpio = (valor ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (!limpio) return null
  if (TIPOS.has(limpio)) return limpio
  const porEtiqueta = ANNOUNCEMENT_TYPES.find((o) => o.label.toLowerCase() === limpio)
  return porEtiqueta ? porEtiqueta.value : null
}

export function normalizarPrioridadAnnouncement(valor: string): string | null {
  const limpio = (valor ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (!limpio) return null
  if (PRIORIDADES.has(limpio)) return limpio
  const porEtiqueta = ANNOUNCEMENT_PRIORITIES.find((o) => o.label.toLowerCase() === limpio)
  return porEtiqueta ? porEtiqueta.value : null
}

/** Etiqueta legible de un aviso ya guardado, con reserva si el dato es raro. */
export function etiquetaTipo(valor?: string): string {
  if (!valor) return 'General'
  return ANNOUNCEMENT_TYPE_LABELS[valor] ?? valor
}

export function etiquetaPrioridad(valor?: string): string {
  if (!valor) return 'Media'
  return ANNOUNCEMENT_PRIORITY_LABELS[valor] ?? valor
}

export type { Announcement }