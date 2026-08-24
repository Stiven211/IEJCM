import { supabase } from '../lib/supabase'
import { uploadDocumentToStorage, deleteFromStorage, getDocumentSignedUrl as getStorageSignedUrl } from '../lib/storage'
import { logError } from '../lib/logger'
import type { Document } from '../app/types'

export type { Document }

const STORAGE_BUCKET = 'documents'

export async function getPublicDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('is_public', true)
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    logError(error)
    throw error
  }

  return (data || []) as Document[]
}

export async function getAllDocuments(publicOnly = false) {
  let query = supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  if (publicOnly) {
    query = query.eq('is_public', true)
  }

  const { data, error } = await query

  if (error) {
    logError(error)
    throw error
  }

  return (data || []) as Document[]
}

export async function getDocumentById(id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    logError(error)
    throw error
  }

  return data as Document | null
}

export async function getDocumentsByCategory(category: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    logError(error)
    throw error
  }

  return (data || []) as Document[]
}

export async function getDocumentSignedUrl(document: Document) {
  if (!document.is_public) {
    throw new Error('Documento privado.')
  }

  if (document.expires_at && new Date(document.expires_at) <= new Date()) {
    throw new Error('Documento vencido.')
  }

  return getStorageSignedUrl(STORAGE_BUCKET, document.file_path)
}

export async function createDocument(payload: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'created_by'>, file: File) {
  const filePath = await uploadDocumentToStorage(STORAGE_BUCKET, file)

  const { data, error } = await supabase
    .from('documents')
    .insert([{ ...payload, file_path: filePath }])
    .select('*')
    .single()

  if (error) {
    logError(error)
    await deleteFromStorage(STORAGE_BUCKET, filePath).catch(storageError => {
      logError(storageError, { action: 'createDocumentStorageCleanup', path: filePath })
    })
    throw error
  }

  return data as Document
}

export async function updateDocument(id: string, payload: Partial<Omit<Document, 'id' | 'created_at' | 'updated_at' | 'created_by'>>, file?: File) {
  let filePath = payload.file_path

  if (file) {
    filePath = await uploadDocumentToStorage(STORAGE_BUCKET, file)
  }

  const { data, error } = await supabase
    .from('documents')
    .update({ ...payload, file_path: filePath })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    logError(error)
    if (file) {
      await deleteFromStorage(STORAGE_BUCKET, filePath).catch(storageError => {
        logError(storageError, { action: 'updateDocumentStorageCleanup', path: filePath })
      })
    }
    throw error
  }

  if (file && data?.file_path && data.file_path !== filePath) {
    await deleteFromStorage(STORAGE_BUCKET, data.file_path).catch(storageError => {
      logError(storageError, { action: 'updateDocumentOldStorageCleanup', path: data.file_path })
    })
  }

  return data as Document
}

export async function removeDocument(id: string) {
  const { data, error: fetchError } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) {
    logError(fetchError)
    throw fetchError
  }

  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  if (deleteError) {
    logError(deleteError)
    throw deleteError
  }

  if (data?.file_path) {
    try {
      await deleteFromStorage(STORAGE_BUCKET, data.file_path)
    } catch (storageError) {
      logError(storageError, { action: 'removeDocumentStorageCleanup', documentId: id, path: data.file_path })
    }
  }
}

export async function uploadDocument(file: File) {
  return uploadDocumentToStorage(STORAGE_BUCKET, file)
}
