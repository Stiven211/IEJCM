/**
 * Traduce los errores de Supabase/Postgres a algo que el administrador pueda
 * actuar, en vez de un "no se pudo guardar" que no dice nada.
 *
 * Antes, un INSERT rechazado por un CHECK llegaba al panel como un fallo
 * generico. El unico rastro era la consola del navegador, con un codigo de
 * Postgres que solo el desarrollador sabe leer.
 */

type ErrorLike = {
  code?: string
  message?: string
  details?: string | null
  hint?: string | null
}

/** Codigos de Postgres que el administrador puede resolver sin programador. */
const EXPLICACIONES: Record<string, string> = {
  '23514': 'Alguno de los campos tiene un valor que no esta permitido. Revisa el tipo y la prioridad.',
  '23502': 'Falta un campo obligatorio. Todos los campos marcados como obligatorios se deben llenar.',
  '23503': 'No se pudo guardar: hace falta un registro previo del que este depende.',
  '23505': 'Ya existe un registro con esos datos.',
  '22001': 'Alguno de los textos es mas largo de lo permitido.',
  '22007': 'El formato de un campo no es valido.',
  '22P02': 'Alguno de los campos de texto no tiene el formato esperado.',
  '42501': 'Tu sesion expiro. Cierra sesion y vuelve a entrar para volver a guardar.',
  PGRST301: 'Tu sesion expiro. Cierra sesion y vuelve a entrar para volver a guardar.',
}

/** Errores de sesion: en estos casos reintentar con un token nuevo sirve. */
export function esErrorDeSesion(err: unknown): boolean {
  const e = err as ErrorLike
  if (!e) return false
  if (e.code === '42501' || e.code === 'PGRST301') return true
  const m = (e.message ?? '').toLowerCase()
  return m.includes('jwt') || m.includes('token') || m.includes('row-level security')
}

/** Mensaje para mostrarle al administrador. Nunca lanza. */
export function mensajeDeError(err: unknown, fallback: string): string {
  const e = err as ErrorLike
  if (!e) return fallback

  const explicacion = e.code ? EXPLICACIONES[e.code] : undefined
  const base = explicacion ?? fallback

  // El texto crudo de Postgres ayuda mucho cuando el CHECK no esta en la lista,
  // asi que se anexa cuando aporta algo que la explicacion no cubre.
  const crudo = (e.message ?? '').trim()
  if (crudo && !explicacion && /check constraint|not-null|invalid input/i.test(crudo)) {
    return `${base} (${crudo})`
  }

  return base
}