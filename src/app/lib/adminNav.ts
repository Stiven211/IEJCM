import {
  LayoutDashboard,
  CalendarDays,
  Image,
  Megaphone,
  Award,
  BookOpen,
  FileText,
} from 'lucide-react'
import type { AdminSidebarSection } from '../components/admin/AdminSidebar'

/**
 * Menu lateral del panel de administracion, en una sola parte.
 *
 * Antes cada pantalla traia su propia copia de esta lista: siete archivos con
 * las mismas siete entradas. Agregar ICFES hubo que tocar dos de los siete a
 * mano, y el resto quedo sin la entrada. Centralizarla evita que vuelva a
 * pasar, y que dos pantallas muestren menus distintos.
 */
export const ADMIN_NAV_SECTIONS: AdminSidebarSection[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Eventos', icon: CalendarDays, to: '/admin/events' },
  { label: 'Galería', icon: Image, to: '/admin/gallery' },
  { label: 'Avisos', icon: Megaphone, to: '/admin/announcements' },
  { label: 'ICFES', icon: Award, to: '/admin/icfes' },
  { label: 'Información Institucional', icon: BookOpen, to: '/admin/school-info' },
  { label: 'Documentos', icon: FileText, to: '/admin/documents' },
]
