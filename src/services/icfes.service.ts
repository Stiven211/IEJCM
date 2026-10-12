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
 * Agrupa los estudiantes por año de examen, del año más reciente al más
 * antiguo, y dentro de cada año de mayor a menor puntaje.
 *
 * Devuelve el primer estudiante de cada grupo como `mejor`, que es el que la
 * página pública destaca.
 */
export interface IcfesGrupo {
  year: number | null
  students: IcfesStudent[]
  mejor: IcfesStudent
}

export function agruparPorAno(estudiantes: IcfesStudent[]): IcfesGrupo[] {
  const porAno = new Map<number | null, IcfesStudent[]>()

  for (const e of estudiantes) {
    const clave = e.exam_year ?? null
    const lista = porAno.get(clave)
    if (lista) lista.push(e)
    else porAno.set(clave, [e])
  }

  return [...porAno.entries()]
    .sort((a, b) => {
      // Sin año va de último, para que no separe los años que sí tienen.
      if (a[0] === null) return 1
      if (b[0] === null) return -1
      return b[0] - a[0]
    })
    .map(([year, lista]) => {
      const ordenados = [...lista].sort(
        (x, y) => Number(y.score || 0) - Number(x.score || 0),
      )
      return { year, students: ordenados, mejor: ordenados[0] }
    })
}

/**
 * Limpia y valida los datos antes de mandarlos a la base.
 *
 * El puntaje llega como string desde los <input>, y la base lo espera
 * entero: mandarlo crudo falla con un 400 que el administrador no puede
 * interpretar.
 *
 * Devuelve null si todo esta bien, o el mensaje de error si no.
 */
export function validarEstudiante(payload: {
  full_name: string
  score: number | string
  grade?: IcfesGrade | null
  exam_year?: number | null
}): string | null {
  const nombre = (payload.full_name ?? '').trim()
  if (!nombre) return 'El estudiante necesita un nombre.'

  const puntaje = Number(payload.score)
  if (Number.isNaN(puntaje)) return 'El puntaje debe ser un número.'
  if (!Number.isInteger(puntaje)) return 'El puntaje debe ser un número entero, sin decimales.'
  if (puntaje < 0 || puntaje > 500) {
    return `El puntaje ${puntaje} está fuera de la escala. El Saber 11 se califica de 0 a 500.`
  }

  if (payload.exam_year != null && payload.exam_year !== '') {
    const ano = Number(payload.exam_year)
    if (!Number.isInteger(ano)) return 'El año del examen debe ser un número entero.'
    if (ano < 2000 || ano > 2100) return 'El año del examen debe estar entre 2000 y 2100.'
  }

  return null
}

function normalizePayload(payload: {
  full_name: string
  score: number | string
  grade?: IcfesGrade | null
  exam_year?: number | null
  photo_url?: string | null
  active?: boolean
}) {
  const ano = payload.exam_year === '' || payload.exam_year == null ? null : Number(payload.exam_year)

  return {
    full_name: (payload.full_name ?? '').trim(),
    score: Math.round(Number(payload.score)),
    exam_year: ano,
    grade: payload.grade || null,
    photo_url: payload.photo_url
      ? toStoragePath(STORAGE_BUCKET, payload.photo_url)
      : null,
    active: payload.active ?? true,
  }
}

/**
 * Estudiantes para el sitio publico. Solo los activos, ordenados por año y
 * luego por puntaje, que es como se leen los resultados de varias temporadas.
 */
export async function getIcfesStudents(activeOnly = true) {
  let query = supabase
    .from('icfes_students')
    .select('*')
    .order('exam_year', { ascending: false, nullsFirst: false })
    .order('score', { ascending: false })

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
  exam_year?: number | null
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
    exam_year?: number | null
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
