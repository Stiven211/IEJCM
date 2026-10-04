import { supabase } from '../lib/supabase'
import { uploadToStorage, deleteFromStorage, resolveAssetUrl, toStoragePath } from '../lib/storage'
import { logError } from '../lib/logger'
import type { GalleryItem } from '../app/types'

export type { GalleryItem }

const STORAGE_BUCKET = 'gallery'

function withResolvedImage(item: GalleryItem): GalleryItem {
  return { ...item, image_url: resolveAssetUrl(STORAGE_BUCKET, item.image_url) }
}

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

  return ((data || []) as GalleryItem[]).map(withResolvedImage)
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

  return data ? withResolvedImage(data as GalleryItem) : null
}

export async function createGalleryItem(payload: Omit<GalleryItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('gallery')
    .insert([{ ...payload, image_url: toStoragePath(STORAGE_BUCKET, payload.image_url) }])
    .select('*')
    .single()

  if (error) {
    logError(error)
    throw error
  }

  return withResolvedImage(data as GalleryItem)
}

export async function updateGalleryItem(id: string, payload: Omit<GalleryItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('gallery')
    .update({ ...payload, image_url: toStoragePath(STORAGE_BUCKET, payload.image_url) })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    logError(error)
    throw error
  }

  return withResolvedImage(data as GalleryItem)
}

export async function removeGalleryItem(id: string) {
  const { data, error: fetchError } = await supabase
    .from('gallery')
    .select('image_url')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) {
    logError(fetchError)
    throw fetchError
  }

  const { error: deleteError } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id)

  if (deleteError) {
    logError(deleteError)
    throw deleteError
  }

  if (data?.image_url) {
    try {
      await deleteFromStorage('gallery', data.image_url)
    } catch (storageError) {
      logError(storageError, { action: 'removeGalleryItemStorageCleanup', galleryId: id, path: data.image_url })
    }
  }
}

export async function uploadGalleryImage(file: File) {
  return uploadToStorage(STORAGE_BUCKET, file)
}
