import { supabase } from '../lib/supabase'
import { uploadToStorage, deleteFromStorage, resolveAssetUrl, toStoragePath } from '../lib/storage'
import { logError } from '../lib/logger'
import type { IcfesStudent, IcfesGrade } from '../app/types'

export type { IcfesStudent }

const STORAGE_BUCKET = 'icfes'

function withResolvedPhoto(student: IcfesStudent): IcfesStudent {
  return {
    ...student,
    photo_url: student.photo_url ? resolveAssetUrl(STORAGE_BUCKET, student.photo_url) : null,
  }
}

/**
 * Limpia y valida los datos antes de mandarlos a la base.
 *
 * El puntaje llega como string desde los <input>, y la base lo espera
 * numerico: mandarlo crudo falla con un 400 que el administrador no puede
 * interpretar. Convertirlo aqui y avisar con un mensaje claro es la misma
 * idea que se aplico en los tipos de aviso.
 *
 * Devuelve null si todo esta bien, o el mensaje de error si no.
 */
export function validarEstudiante(payload: {
  full_name: string
  score: number | string
  grade?: IcfesGrade | null
}): string | null {
  const nombre = (payload.full_name ?? '').trim()
  if (!nombre) return 'El estudiante necesita un nombre.'

  const puntaje = Number(payload.score)
  if (Number.isNaN(puntaje)) return 'El puntaje debe ser un número.'
  if (puntaje < 0 || puntaje > 500) {
    return `El puntaje ${puntaje} está fuera de la escala. El Saber 11 se califica de 0 a 500.`
  }

  return null
}

function normalizePayload(payload: {
  full_name: string
  score: number | string
  grade?: IcfesGrade | null
  photo_url?: string | null
  active?: boolean
}) {
  return {
    full_name: (payload.full_name ?? '').trim(),
    score: Number(payload.score),
    grade: payload.grade || null,
    photo_url: payload.photo_url
      ? toStoragePath(STORAGE_BUCKET, payload.photo_url)
      : null,
    active: payload.active ?? true,
  }
}

/**
 * Estudiantes para el sitio publico. Solo los activos, y de mayor a menor
 * puntaje: es como el colegio presenta a los destacados.
 */
export async function getIcfesStudents(activeOnly = true) {
  let query = supabase.from('icfes_students').select('*').order('score', { ascending: false })

  if (activeOnly) {
    query = query.eq('active', true)
  }

  const { data, error } = await query

  if (error) {
    logError(error)
    throw error
  }

  return ((data || []) as IcfesStudent[]).map(withResolvedPhoto)
}

export async function createIcfesStudent(payload: {
  full_name: string
  score: number | string
  grade?: IcfesGrade | null
  photo_url?: string | null
  active?: boolean
}) {
  const error = validarEstudiante(payload)
  if (error) throw new Error(error)

  const { data, error: insertError } = await supabase
    .from('icfes_students')
    .insert([normalizePayload(payload)])
    .select('*')
    .single()

  if (insertError) {
    logError(insertError)
    throw insertError
  }

  return withResolvedPhoto(data as IcfesStudent)
}

export async function updateIcfesStudent(
  id: string,
  payload: {
    full_name: string
    score: number | string
    grade?: IcfesGrade | null
    photo_url?: string | null
    active?: boolean
  },
) {
  const error = validarEstudiante(payload)
  if (error) throw new Error(error)

  const { data, error: updateError } = await supabase
    .from('icfes_students')
    .update(normalizePayload(payload))
    .eq('id', id)
    .select('*')
    .single()

  if (updateError) {
    logError(updateError)
    throw updateError
  }

  return withResolvedPhoto(data as IcfesStudent)
}

/**
 * Borra el estudiante y tambien su foto de Storage.
 *
 * Si la foto no se puede borrar, el estudiante ya esta borrado de la base:
 * se avisa en el log pero no se falla la operacion, para que el administrador
 * no quede con un error por un archivo huerfano.
 */
export async function removeIcfesStudent(id: string) {
  const { data, error: fetchError } = await supabase
    .from('icfes_students')
    .select('photo_url')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) {
    logError(fetchError)
    throw fetchError
  }

  const { error: deleteError } = await supabase.from('icfes_students').delete().eq('id', id)

  if (deleteError) {
    logError(deleteError)
    throw deleteError
  }

  if (data?.photo_url) {
    try {
      await deleteFromStorage(STORAGE_BUCKET, data.photo_url)
    } catch (storageError) {
      logError(storageError, { action: 'removeIcfesStudentPhoto', studentId: id, path: data.photo_url })
    }
  }
}

export async function uploadIcfesPhoto(file: File) {
  return uploadToStorage(STORAGE_BUCKET, file)
}
