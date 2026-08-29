import { useState, useEffect, useCallback, memo, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './components/HomePage'
import { AboutPage } from './components/AboutPage'
import { ContactPage } from './components/ContactPage'
import { EventsPage } from './components/EventsPage'
import { EventDetailPage } from './components/EventDetailPage'
import { AdminLogin } from './components/AdminLogin'
import { DocumentsPage } from './components/DocumentsPage'
import { NotFoundPage } from './components/NotFoundPage'
import { supabase } from '../lib/supabase'
import { useIsAdmin } from '../hooks/useIsAdmin'

const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const GalleryAdminPage = lazy(() => import('./components/admin/GalleryAdminPage').then(m => ({ default: m.GalleryAdminPage })))
const AnnouncementAdminPage = lazy(() => import('./components/admin/AnnouncementAdminPage').then(m => ({ default: m.AnnouncementAdminPage })))
const SchoolInfoAdminPage = lazy(() => import('./components/admin/SchoolInfoAdminPage').then(m => ({ default: m.SchoolInfoAdminPage })))
const DocumentsAdminPage = lazy(() => import('./components/admin/DocumentsAdminPage').then(m => ({ default: m.DocumentsAdminPage })))
const ContactMessagesAdminPage = lazy(() => import('./components/admin/ContactMessagesAdminPage').then(m => ({ default: m.ContactMessagesAdminPage })))
const AnnouncementsPage = lazy(() => import('./components/AnnouncementsPage').then(m => ({ default: m.AnnouncementsPage })))
const GalleryPage = lazy(() => import('./components/GalleryPage').then(m => ({ default: m.GalleryPage })))

function LoadingFallback() {
  return (
    <div role="status" aria-live="polite" aria-label="Cargando contenido" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: '#5A7A5A' }}>
      <span>Cargando...</span>
    </div>
  )
}

function AdminAccessDenied() {
  return (
    <div role="alert" aria-live="assertive" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#5A7A5A', padding: '24px', textAlign: 'center' }}>
      <div aria-hidden="true" style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>
        Acceso restringido
      </p>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1A1A1A', marginBottom: '8px' }}>Acceso denegado</h1>
      <p style={{ fontSize: '14px', maxWidth: '400px', lineHeight: 1.6 }}>
        No tienes permisos para acceder al panel administrativo. Si crees que esto es un error, contacta al administrador del sistema.
      </p>
    </div>
  )
}

const MemoizedNavbar = memo(Navbar)
const MemoizedFooter = memo(Footer)

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MemoizedNavbar />
      <main style={{ flex: 1, scrollMarginTop: '70px' }}>
        {children}
      </main>
      <MemoizedFooter />
    </div>
  )
}

function getUserInitials(email: string | null) {
  if (!email) return 'A'
  const prefix = email.split('@')[0]
  return prefix.charAt(0).toUpperCase()
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useIsAdmin()

  if (loading) {
    return <LoadingFallback />
  }

  if (!isAdmin) {
    return <AdminAccessDenied />
  }

  return <>{children}</>
}

export default function App() {
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => { subscription.unsubscribe() }
  }, [])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const adminUser = user ? {
    initials: getUserInitials(user.email ?? null),
    name: user.email ?? '',
    email: user.email ?? '',
  } : null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/eventos" element={<Layout><EventsPage /></Layout>} />
        <Route path="/eventos/:id" element={<Layout><EventDetailPage /></Layout>} />
        <Route path="/nosotros" element={<Layout><AboutPage /></Layout>} />
        <Route path="/avisos" element={<Layout><Suspense fallback={<LoadingFallback />}><AnnouncementsPage /></Suspense></Layout>} />
        <Route path="/galeria" element={<Layout><Suspense fallback={<LoadingFallback />}><GalleryPage /></Suspense></Layout>} />
        <Route path="/documentos" element={<Layout><DocumentsPage /></Layout>} />
        <Route path="/contacto" element={<Layout><ContactPage /></Layout>} />
        <Route
          path="/admin"
          element={
            user
              ? (
                <ProtectedAdminRoute>
                  <Suspense fallback={<LoadingFallback />}><AdminDashboard onLogout={handleLogout} adminUser={adminUser} /></Suspense>
                </ProtectedAdminRoute>
              )
              : <AdminLogin />
          }
        />
        <Route
          path="/admin/gallery"
          element={
            user
              ? (
                <ProtectedAdminRoute>
                  <Suspense fallback={<LoadingFallback />}><GalleryAdminPage onLogout={handleLogout} adminUser={adminUser} /></Suspense>
                </ProtectedAdminRoute>
              )
              : <AdminLogin />
          }
        />
        <Route
          path="/admin/announcements"
          element={
            user
              ? (
                <ProtectedAdminRoute>
                  <Suspense fallback={<LoadingFallback />}><AnnouncementAdminPage onLogout={handleLogout} adminUser={adminUser} /></Suspense>
                </ProtectedAdminRoute>
              )
              : <AdminLogin />
          }
        />
        <Route
          path="/admin/school-info"
          element={
            user
              ? (
                <ProtectedAdminRoute>
                  <Suspense fallback={<LoadingFallback />}><SchoolInfoAdminPage onLogout={handleLogout} adminUser={adminUser} /></Suspense>
                </ProtectedAdminRoute>
              )
              : <AdminLogin />
          }
        />
        <Route
          path="/admin/documents"
          element={
            user
              ? (
                <ProtectedAdminRoute>
                  <Suspense fallback={<LoadingFallback />}><DocumentsAdminPage onLogout={handleLogout} adminUser={adminUser} /></Suspense>
                </ProtectedAdminRoute>
              )
              : <AdminLogin />
          }
        />
        <Route
          path="/admin/contact-messages"
          element={
            user
              ? (
                <ProtectedAdminRoute>
                  <Suspense fallback={<LoadingFallback />}><ContactMessagesAdminPage onLogout={handleLogout} adminUser={adminUser} /></Suspense>
                </ProtectedAdminRoute>
              )
              : <AdminLogin />
          }
        />
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
