
import { supabase } from '../lib/supabase'

export interface Announcement {
  id: string
  title: string
  content: string
  category?: string
  active?: boolean
  published_at?: string
  created_at?: string
}

export async function getAllAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data || []) as Announcement[]
}

export async function getAnnouncementById(id: string) {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as Announcement | null
}

export async function createAnnouncement(payload: Omit<Announcement, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('announcements')
    .insert([payload])
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as Announcement
}

export async function updateAnnouncement(id: string, payload: Omit<Announcement, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('announcements')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as Announcement
}

export async function removeAnnouncement(id: string) {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}

