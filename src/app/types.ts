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
  created_at?: string
}