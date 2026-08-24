import { supabase } from './supabase'
import { logError } from './logger'

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024
const MAX_DOCUMENT_FILE_SIZE = 20 * 1024 * 1024

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
])

const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  'pdf',
  'doc',
  'docx',
])

const IMAGE_MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const DOCUMENT_MIME_TO_EXTENSION: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

function getFileExtension(file: File): string {
  const name = file.name
  const lastDot = name.lastIndexOf('.')
  if (lastDot === -1 || lastDot === name.length - 1) {
    return ''
  }
  return name.slice(lastDot + 1).toLowerCase()
}

function validateImageFile(file: File): void {
  if (file.size === 0) {
    throw new Error('El archivo está vacío.')
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error('El archivo supera el tamaño máximo permitido de 5 MB.')
  }

  const mime = file.type.toLowerCase()
  if (!ALLOWED_IMAGE_MIME_TYPES.has(mime)) {
    throw new Error('Tipo de archivo no permitido.')
  }

  const ext = getFileExtension(file)
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    throw new Error('Extensión de archivo no permitida.')
  }

  if (IMAGE_MIME_TO_EXTENSION[mime] !== ext) {
    throw new Error('La extensión no coincide con el tipo de archivo.')
  }
}

function validateDocumentFile(file: File): void {
  if (file.size === 0) {
    throw new Error('El archivo está vacío.')
  }

  if (file.size > MAX_DOCUMENT_FILE_SIZE) {
    throw new Error('El archivo supera el tamaño máximo permitido de 20 MB.')
  }

  const mime = file.type.toLowerCase()
  if (!ALLOWED_DOCUMENT_MIME_TYPES.has(mime)) {
    throw new Error('Tipo de archivo no permitido. Solo PDF, DOC y DOCX.')
  }

  const ext = getFileExtension(file)
  if (!ALLOWED_DOCUMENT_EXTENSIONS.has(ext)) {
    throw new Error('Extensión de archivo no permitida. Solo .pdf, .doc y .docx.')
  }

  if (DOCUMENT_MIME_TO_EXTENSION[mime] !== ext) {
    throw new Error('La extensión no coincide con el tipo de archivo.')
  }
}

export function generateStoragePath(file: File): string {
  const ext = getFileExtension(file) || 'bin'
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
}

export function generateDocumentPath(file: File): string {
  const ext = getFileExtension(file) || 'bin'
  return `documents/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
}

export function getStoragePublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadToStorage(bucket: string, file: File): Promise<string> {
  validateImageFile(file)

  const path = generateStoragePath(file)

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    logError(error)
    throw error
  }

  return path
}

export async function uploadDocumentToStorage(bucket: string, file: File): Promise<string> {
  validateDocumentFile(file)

  const path = generateDocumentPath(file)

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    logError(error)
    throw error
  }

  return path
}

export async function deleteFromStorage(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    logError(error)
    throw error
  }
}

export async function getDocumentSignedUrl(bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600)

  if (error) {
    logError(error)
    throw error
  }

  return data.signedUrl
}
