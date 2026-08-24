export interface Event {
  id: string
  title: string
  description: string
  fullDescription?: string
  date: string
  time: string
  endTime?: string
  location: string
  category: 'academic' | 'cultural' | 'sports' | 'institutional'
  image?: string
  active?: boolean
  created_at?: string
}

export interface GalleryItem {
  id: string
  title: string
  description?: string
  image_url: string
  category?: string
  active?: boolean
  created_at?: string
}

export interface Announcement {
  id: string
  title: string
  description: string
  type?: string
  priority?: string
  start_date?: string
  end_date?: string
  active?: boolean
  created_at?: string
}

export interface SchoolInfo {
  id: string
  school_name: string
  history: string
  mission: string
  vision: string
  address: string
  phone: string
  email: string
  facebook: string
  instagram: string
  youtube: string
  logo_url: string
  hero_image_url: string
  hero_badge: string
  hero_badge_color: string
  hero_title: string
  hero_subtitle: string
  updated_at: string
}

export interface Document {
  id: string
  title: string
  description: string
  category: 'excusas' | 'permisos' | 'circulares' | 'formatos' | 'guias' | 'comunicados' | 'institucional' | 'otros'
  file_path: string
  file_name: string
  file_size?: number
  mime_type: string
  file_extension: string
  is_public: boolean
  published_at?: string
  expires_at?: string
  created_at?: string
  updated_at?: string
  created_by: string
}

export type ContactMessageStatus = 'new' | 'read' | 'archived'

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: ContactMessageStatus
  created_at: string
  read_at: string | null
}
