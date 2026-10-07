/**
 * Convierte entre lo que devuelve Postgres y lo que quiere un <input type="date">.
 *
 * El problema: `documents.published_at` y `expires_at` son `timestamptz`, asi que
 * PostgREST los devuelve como "2026-10-07T00:00:00+00:00". Ese valor se metia
 * tal cual en el estado del formulario y de ahi al input, que exige
 * "yyyy-MM-dd". React avisaba por consola en cada repintado.
 *
 * Ojo con las zonas: se usa el dia en UTC, que es como esta guardado el dato.
 * Convertir a hora local correria el dia hacia atras en Colombia (UTC-5).
 */

/** "2026-10-07T00:00:00+00:00", "2026-10-07", Date o null -> "2026-10-07". */
export function aFechaInput(valor: string | Date | null | undefined): string {
  if (!valor) return ''

  if (valor instanceof Date) {
    if (Number.isNaN(valor.getTime())) return ''
    return valor.toISOString().slice(0, 10)
  }

  const texto = String(valor).trim()
  if (!texto) return ''

  // Ya viene en el formato que quiere el input.
  const corto = /^(\d{4}-\d{2}-\d{2})$/.exec(texto)
  if (corto) return corto[1]

  const conHora = /^(\d{4}-\d{2}-\d{2})[T ]/.exec(texto)
  if (conHora) return conHora[1]

  // Ultimo recurso: parsear y tomar la parte de la fecha en UTC.
  const d = new Date(texto)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

/** "2026-10-07" -> "2026-10-07T00:00:00+00:00", para mandarlo a un timestamptz. */
export function deFechaInput(valor: string): string | undefined {
  const limpio = (valor ?? '').trim()
  if (!limpio) return undefined
  if (/^\d{4}-\d{2}-\d{2}$/.test(limpio)) return `${limpio}T00:00:00+00:00`
  return limpio
}