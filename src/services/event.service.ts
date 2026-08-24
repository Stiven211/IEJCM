import { supabase } from '../lib/supabase'
import { uploadToStorage } from '../lib/storage'
import { logError } from '../lib/logger'
import type { Event } from '../app/types'

export type { Event }

const STORAGE_BUCKET = 'events'

export async function getAllEvents(activeOnly = true) {
  let query = supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (activeOnly) {
    query = query.eq('active', true)
  }

  const { data, error } = await query

  if (error) {
    logError(error)
    throw error
  }

  return (data || []) as Event[]
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    logError(error)
    throw error
  }

  return data as Event | null
}

export async function getRelatedEvents(category: string, excludeId: string, limit = 3) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .neq('id', excludeId)
    .order('date', { ascending: true })
    .limit(limit)

  if (error) {
    logError(error)
    throw error
  }

  return (data || []) as Event[]
}

export async function createEvent(payload: Omit<Event, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('events')
    .insert([payload])
    .select('*')
    .single()

  if (error) {
    logError(error)
    throw error
  }

  return data as Event
}

export async function updateEvent(id: string, payload: Omit<Event, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    logError(error)
    throw error
  }

  return data as Event
}

export async function removeEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    logError(error)
    throw error
  }
}

export async function uploadEventImage(file: File) {
  return uploadToStorage(STORAGE_BUCKET, file)
}
