import { supabase } from '../lib/supabase'

export interface GalleryItem {
  id: string
  title: string
  description?: string
  image_url: string
  category?: string
  display_order?: number
  created_at?: string
}

const STORAGE_BUCKET = 'gallery'

export async function getAllGalleryItems() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    throw error
  }

  return (data || []) as GalleryItem[]
}

export async function getGalleryItemById(id: string) {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as GalleryItem | null
}

export async function createGalleryItem(payload: Omit<GalleryItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('gallery')
    .insert([payload])
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as GalleryItem
}

export async function updateGalleryItem(id: string, payload: Omit<GalleryItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('gallery')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as GalleryItem
}

export async function removeGalleryItem(id: string) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}

export async function uploadGalleryImage(file: File) {
  const ext = file.name.split('.').pop() || 'bin'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
