import { supabase } from './supabase'
import { logError } from './logger'

// Una foto de celular moderno pesa entre 3 y 8 MB, y un PDF oficial del colegio
// puede pasar de 10 MB. Con 5 MB y 20 MB el administrador no podia subir nada
// desde el movil, que es justo desde donde se hace.
const MAX_IMAGE_FILE_SIZE = 15 * 1024 * 1024
const MAX_DOCUMENT_FILE_SIZE = 40 * 1024 * 1024

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '')

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
  'image/webp',
  // HEIC es el formato por defecto de la camara del iPhone. Sin esto, elegir
  // una foto desde el movil caia en "Tipo de archivo no permitido".
  'image/heic',
  'image/heif',
])

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'heic',
  'heif',
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
  'image/heic': ['heic'],
  'image/heif': ['heif', 'heic'],
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

function formatMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}

export function validateImageFile(file: File): void {
  if (file.size === 0) {
    throw new Error('El archivo está vacío.')
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error(
      `La imagen pesa ${formatMb(file.size)} y el máximo es ${formatMb(MAX_IMAGE_FILE_SIZE)}. ` +
        'Tómala con menos resolución o elige una más liviana.',
    )
  }

  const mime = (file.type || '').toLowerCase()
  const ext = getFileExtension(file)

  if (!ALLOWED_IMAGE_MIME_TYPES.has(mime)) {
    // El caso real de celular: HEIC/HEIF no siempre llega con su tipo MIME,
    // pero sí con la extensión. Si la extensión es válida, se acepta.
    if (ext && ALLOWED_IMAGE_EXTENSIONS.has(ext)) return
    throw new Error(
      `Tipo de archivo no permitido (${file.type || 'desconocido'}). Usa una imagen JPG, PNG o WebP.`,
    )
  }

  if (ext && !ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    throw new Error(`Extensión de archivo no permitida (.${ext}).`)
  }

  const validExts = IMAGE_MIME_TO_EXTENSIONS[mime]
  if (validExts && ext && !validExts.includes(ext)) {
    // Formatos viejos de iPhone: .heif con tipo image/heif, o al reves.
    const esVarianteDeIphone = (mime === 'image/heif' || mime === 'image/heic') && (ext === 'heif' || ext === 'heic')
    if (!esVarianteDeIphone) {
      throw new Error(`La extensión .${ext} no coincide con el tipo de archivo.`)
    }
  }
}

function validateDocumentFile(file: File): void {
  if (file.size === 0) {
    throw new Error('El archivo está vacío.')
  }

  if (file.size > MAX_DOCUMENT_FILE_SIZE) {
    throw new Error(
      `El documento pesa ${formatMb(file.size)} y el máximo es ${formatMb(MAX_DOCUMENT_FILE_SIZE)}.`,
    )
  }

  const mime = (file.type || '').toLowerCase()
  const ext = getFileExtension(file)

  if (!ALLOWED_DOCUMENT_MIME_TYPES.has(mime)) {
    throw new Error(
      `Tipo de archivo no permitido (${file.type || 'desconocido'}). Solo PDF, DOC y DOCX.`,
    )
  }

  if (!ALLOWED_DOCUMENT_EXTENSIONS.has(ext)) {
    throw new Error(`Extensión de archivo no permitida (.${ext}). Solo .pdf, .doc y .docx.`)
  }

  const validExts = DOCUMENT_MIME_TO_EXTENSIONS[mime]
  if (validExts && !validExts.includes(ext)) {
    throw new Error(`La extensión .${ext} no coincide con el tipo de archivo.`)
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

/** Lado mayor, en pixeles, de la version comprimida. */
const MAX_IMAGE_SIDE = 1920
/** Si el archivo original ya pesa menos que esto, no se toca. */
const COMPRESS_BELOW_BYTES = 700 * 1024

/**
 * Reduce una imagen antes de subirla.
 *
 * Sin esto, una foto de celular de 8 MB tinha que pasar el filtro de tamano y
 * dependia de que la red del colegio aguantara. Con esto se reescala a 1920 px
 * del lado mayor y se guarda en JPEG, que para una foto del colegio es de sobra
 * y pesa una fraccion.
 *
 * Si algo falla (formato que el navegador no dibuja, canvas no disponible) se
 * devuelve el archivo original: comprimir es una mejora, nunca un requisito.
 */
export async function comprimirImagen(file: File): Promise<File> {
  if (typeof document === 'undefined') return file

  const mime = (file.type || '').toLowerCase()
  if (mime !== 'image/jpeg' && mime !== 'image/png' && mime !== 'image/webp') return file
  if (file.size <= COMPRESS_BELOW_BYTES) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height))
    const ancho = Math.max(1, Math.round(bitmap.width * scale))
    const alto = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = ancho
    canvas.height = alto
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }
    // El canvas no pone fondo: los PNG con transparencia se volverian negros.
    ctx.drawImage(bitmap, 0, 0, ancho, alto)
    bitmap.close()

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.85),
    )
    if (!blob || blob.size >= file.size) return file

    const nombre = file.name.replace(/\.[^.]+$/, '') || 'imagen'
    return new File([blob], `${nombre}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file
  }
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

  // Se valida antes de comprimir (para avisar de un tipo no permitido sin
  // gastarse un decode) y se sube ya comprimido.
  const listo = await comprimirImagen(file)

  const path = generateStoragePath(listo)

  const { error } = await supabase.storage.from(bucket).upload(path, listo, {
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
