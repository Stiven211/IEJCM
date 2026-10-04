import { supabase } from '../lib/supabase'
import { uploadToStorage, deleteFromStorage, resolveAssetUrl, toStoragePath } from '../lib/storage'
import { logError } from '../lib/logger'
import type { SchoolInfo } from '../app/types'

export type { SchoolInfo }

const STORAGE_BUCKET = 'school-info'
const SCHOOL_INFO_CACHE_KEY = 'iejcm:school-info'
const SCHOOL_INFO_CACHE_TTL = 5 * 60 * 1000

const MEDIA_FIELDS = ['logo_url', 'hero_image_url'] as const

function withResolvedMedia(info: SchoolInfo): SchoolInfo {
  const next = { ...info }
  for (const field of MEDIA_FIELDS) {
    next[field] = resolveAssetUrl(STORAGE_BUCKET, info[field])
  }
  return next
}

function withStoredMedia<T extends Record<string, unknown>>(payload: T): T {
  const next = { ...payload }
  for (const field of MEDIA_FIELDS) {
    if (field in next) {
      next[field] = toStoragePath(STORAGE_BUCKET, next[field] as string)
    }
  }
  return next
}

export async function getSchoolInfo() {
  if (typeof window !== 'undefined') {
    const cached = window.sessionStorage.getItem(SCHOOL_INFO_CACHE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { expiresAt: number; data: SchoolInfo | null }
        if (parsed.expiresAt > Date.now()) return parsed.data
        window.sessionStorage.removeItem(SCHOOL_INFO_CACHE_KEY)
      } catch {
        window.sessionStorage.removeItem(SCHOOL_INFO_CACHE_KEY)
      }
    }
  }

  const { data, error } = await supabase
    .from('school_info')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    logError(error)
    throw error
  }

  const schoolInfo = data ? withResolvedMedia(data as SchoolInfo) : null
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(SCHOOL_INFO_CACHE_KEY, JSON.stringify({ expiresAt: Date.now() + SCHOOL_INFO_CACHE_TTL, data: schoolInfo }))
  }
  return schoolInfo
}

export async function upsertSchoolInfo(payload: Omit<SchoolInfo, 'id' | 'updated_at'>) {
  const { data: existing, error: fetchError } = await supabase
    .from('school_info')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (fetchError) {
    logError(fetchError)
    throw fetchError
  }

  const updatedAt = new Date().toISOString()
  const stored = withStoredMedia(payload as unknown as Record<string, unknown>) as typeof payload

  if (existing?.id) {
    const { data, error } = await supabase
      .from('school_info')
      .update({ ...stored, updated_at: updatedAt })
      .eq('id', existing.id)
      .select('*')
      .single()

    if (error) {
      logError(error)
      throw error
    }

    if (typeof window !== 'undefined') window.sessionStorage.removeItem(SCHOOL_INFO_CACHE_KEY)
    return withResolvedMedia(data as SchoolInfo)
  }

  const { data, error } = await supabase
    .from('school_info')
    .insert([{ ...stored, updated_at: updatedAt }])
    .select('*')
    .single()

  if (error) {
    logError(error)
    throw error
  }

  if (typeof window !== 'undefined') window.sessionStorage.removeItem(SCHOOL_INFO_CACHE_KEY)
  return withResolvedMedia(data as SchoolInfo)
}

export async function uploadSchoolInfoMedia(file: File) {
  return uploadToStorage(STORAGE_BUCKET, file)
}

/** Borra del bucket un archivo que ya no referencia ningun campo de school_info. */
export async function removeSchoolInfoMedia(path: string) {
  await deleteFromStorage(STORAGE_BUCKET, path)
}
