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
  content: string
  category?: string
  active?: boolean
  published_at?: string
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
  updated_at: string
}
