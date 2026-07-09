import { supabase } from '../lib/supabase'

export interface SchoolInfo {
  id: string
  school_name: string
  history: string
  mission: string
  vision: string
  address: string
  phone: string
  email: string
  facebook: string
  instagram: string
  youtube: string
  logo_url: string
  hero_image_url: string
  hero_badge: string
  hero_badge_color: string
  updated_at: string
}

export async function getSchoolInfo() {
  const { data, error } = await supabase
    .from('school_info')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as SchoolInfo | null
}

export async function upsertSchoolInfo(payload: Omit<SchoolInfo, 'id' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('school_info')
    .upsert([{ ...payload, updated_at: new Date().toISOString() }])
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as SchoolInfo
}

export async function uploadSchoolInfoMedia(file: File) {
  const ext = file.name.split('.').pop() || 'bin'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from('school-info').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from('school-info').getPublicUrl(path)
  return data.publicUrl
}
