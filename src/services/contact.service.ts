import { supabase } from '../lib/supabase'
import { logError } from '../lib/logger'
import type { ContactMessage, ContactMessageStatus } from '../app/types'

export type { ContactMessage, ContactMessageStatus }

const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 254
const MAX_MESSAGE_LENGTH = 4000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface CreateContactMessageInput {
  name: string
  email: string
  message: string
}

function validateInput(input: CreateContactMessageInput): CreateContactMessageInput {
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  const message = input.message.trim()

  if (!name || name.length > MAX_NAME_LENGTH) throw new Error('Revisa el nombre ingresado.')
  if (!EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL_LENGTH) throw new Error('Revisa el correo electrónico ingresado.')
  if (!message || message.length > MAX_MESSAGE_LENGTH) throw new Error('Revisa el mensaje ingresado.')

  return { name, email, message }
}

export async function createContactMessage(input: CreateContactMessageInput): Promise<void> {
  const validated = validateInput(input)
  const { error } = await supabase
    .from('contact_messages')
    .insert(validated)

  if (error) {
    logError(error, { action: 'createContactMessage' })
    throw new Error('No se pudo guardar el mensaje. Intenta de nuevo.')
  }

}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, message, status, created_at, read_at')
    .order('created_at', { ascending: false })

  if (error) {
    logError(error, { action: 'getContactMessages' })
    throw new Error('No se pudieron cargar los mensajes.')
  }

  return (data || []) as ContactMessage[]
}

export async function updateContactMessageStatus(id: string, status: ContactMessageStatus): Promise<ContactMessage> {
  const readAt = status === 'new' ? null : new Date().toISOString()
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status, read_at: readAt })
    .eq('id', id)
    .select('id, name, email, message, status, created_at, read_at')
    .single()

  if (error) {
    logError(error, { action: 'updateContactMessageStatus', status })
    throw new Error('No se pudo actualizar el estado.')
  }

  return data as ContactMessage
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (error) {
    logError(error, { action: 'deleteContactMessage' })
    throw new Error('No se pudo eliminar el mensaje.')
  }
}