import { supabase } from '../lib/supabase'
import { uploadToStorage } from '../lib/storage'
import { logError } from '../lib/logger'
import type { GalleryItem } from '../app/types'

export type { GalleryItem }

const STORAGE_BUCKET = 'gallery'

export async function getAllGalleryItems(activeOnly = true) {
  let query = supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('active', true)
  }

  const { data, error } = await query

  if (error) {
    logError(error)
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
    logError(error)
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
    logError(error)
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
    logError(error)
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
    logError(error)
    throw error
  }
}

export async function uploadGalleryImage(file: File) {
  return uploadToStorage(STORAGE_BUCKET, file)
}
