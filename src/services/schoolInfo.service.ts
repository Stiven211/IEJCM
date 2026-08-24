import { supabase } from '../lib/supabase'
import { uploadToStorage } from '../lib/storage'
import { logError } from '../lib/logger'
import type { SchoolInfo } from '../app/types'

export type { SchoolInfo }

export async function getSchoolInfo() {
  const { data, error } = await supabase
    .from('school_info')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    logError(error)
    throw error
  }

  return data as SchoolInfo | null
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

  if (existing?.id) {
    const { data, error } = await supabase
      .from('school_info')
      .update({ ...payload, updated_at: updatedAt })
      .eq('id', existing.id)
      .select('*')
      .single()

    if (error) {
      logError(error)
      throw error
    }

    return data as SchoolInfo
  }

  const { data, error } = await supabase
    .from('school_info')
    .insert([{ ...payload, updated_at: updatedAt }])
    .select('*')
    .single()

  if (error) {
    logError(error)
    throw error
  }

  return data as SchoolInfo
}

export async function uploadSchoolInfoMedia(file: File) {
  return uploadToStorage('school-info', file)
}
