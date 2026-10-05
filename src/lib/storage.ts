import { supabase } from './supabase'
import { logError } from './logger'

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024
const MAX_DOCUMENT_FILE_SIZE = 20 * 1024 * 1024

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '')

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
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

const IMAGE_MIME_TO_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/jpg': ['jpg', 'jpeg'],
  'image/pjpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/x-png': ['png'],
  'image/webp': ['webp'],
}

const DOCUMENT_MIME_TO_EXTENSIONS: Record<string, string[]> = {
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
}

function getFileExtension(file: File): string {
  const name = file.name
  const lastDot = name.lastIndexOf('.')
  if (lastDot === -1 || lastDot === name.length - 1) {
    return ''
  }
  return name.slice(lastDot + 1).toLowerCase()
}

export function validateImageFile(file: File): void {
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

  const validExts = IMAGE_MIME_TO_EXTENSIONS[mime]
  if (!validExts || !validExts.includes(ext)) {
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

  const validExts = DOCUMENT_MIME_TO_EXTENSIONS[mime]
  if (!validExts || !validExts.includes(ext)) {
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

const STORAGE_URL_PATTERN =
  /^https?:\/\/[^/]+\/storage\/v1\/object\/(?:public|sign)\/([^/?#]+)\/(.+)$/

/**
 * Normaliza cualquier valor de asset a un path de Storage.
 * Acepta un path desnudo o una URL absoluta de Storage (public/sign) y
 * devuelve solo el path, para poder pasarlo a upload/remove sin ambiguedad.
 */
export function toStoragePath(bucket: string, value: string | null | undefined): string {
  if (!value) return ''

  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('data:')) return trimmed

  const match = STORAGE_URL_PATTERN.exec(trimmed)
  if (match) {
    const urlBucket = match[1]
    const path = decodeURIComponent(match[2])
    return urlBucket === bucket ? path : ''
  }

  return trimmed.replace(/^\/+/, '')
}

/**
 * Convierte un valor de asset en algo que se pueda usar como src de <img>.
 * Las filas que guardan un path desnudo se resuelven contra el bucket publico.
 * Las URLs absolutas y los data: URL se devuelven tal cual.
 */
export function resolveAssetUrl(bucket: string, value: string | null | undefined): string {
  if (!value) return ''

  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('data:') || /^(?:https?:)?\/\//i.test(trimmed)) return trimmed

  return getStoragePublicUrl(bucket, toStoragePath(bucket, trimmed))
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
  const normalized = toStoragePath(bucket, path)
  if (!normalized || normalized.startsWith('data:')) return

  const { error } = await supabase.storage.from(bucket).remove([normalized])

  if (error) {
    logError(error, { action: 'deleteFromStorage', bucket, path: normalized })
    throw error
  }
}

export async function getDocumentSignedUrl(bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600)

  if (error) {
    logError(error)
    throw error
  }

  // createSignedUrl devuelve una RUTA relativa:
  //   /object/sign/documents/documents/123.pdf?token=...
  // Si se usa tal cual como href, el navegador la pide contra el origen del
  // sitio, el catch-all de Vercel (/.* -> index.html) responde el HTML del SPA
  // y el usuario se descarga un index.html renombrado a .pdf en vez del
  // documento. Por eso se devuelve absoluta.
  return data.signedUrl.startsWith('/')
    ? `${SUPABASE_URL}${data.signedUrl}`
    : data.signedUrl
}
