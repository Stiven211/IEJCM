
import { supabase } from '../lib/supabase'
import type { Event } from '../../app/types'

export async function getAllEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
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
    throw error
  }

  return data as Event | null
}

export async function createEvent(payload: Omit<Event, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('events')
    .insert([payload])
    .select('*')
    .single()

  if (error) {
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
    throw error
  }
}

