
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './components/HomePage'
import { EventsPage } from './components/EventsPage'
import { EventDetailPage } from './components/EventDetailPage'
import { AdminLogin } from './components/AdminLogin'
import { AdminDashboard } from './components/AdminDashboard'
import { GalleryAdminPage } from './components/admin/GalleryAdminPage'
import { AnnouncementAdminPage } from './components/admin/AnnouncementAdminPage'
import { AnnouncementsPage } from './components/AnnouncementsPage'
import { GalleryPage } from './components/GalleryPage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    try { return sessionStorage.getItem('jcmutis_admin') === 'true' }
    catch { return false }
  })

  const handleLogin = () => {
    try { sessionStorage.setItem('jcmutis_admin', 'true') } catch {}
    setIsAdmin(true)
  }

  const handleLogout = () => {
    try { sessionStorage.removeItem('jcmutis_admin') } catch {}
    setIsAdmin(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/eventos" element={<Layout><EventsPage /></Layout>} />
        <Route path="/eventos/:id" element={<Layout><EventDetailPage /></Layout>} />
        <Route
          path="/admin"
          element={
            isAdmin
              ? <AdminDashboard onLogout={handleLogout} />
              : <AdminLogin onLogin={handleLogin} />
          }
        />
        <Route
          path="/admin/gallery"
          element={
            isAdmin
              ? <GalleryAdminPage onLogout={handleLogout} />
              : <AdminLogin onLogin={handleLogin} />
          }
        />
        <Route
          path="/admin/announcements"
          element={
            isAdmin
              ? <AnnouncementAdminPage onLogout={handleLogout} />
              : <AdminLogin onLogin={handleLogin} />
          }
        />
        <Route path="/avisos" element={<Layout><AnnouncementsPage /></Layout>} />
        <Route path="/galeria" element={<Layout><GalleryPage /></Layout>} />
        <Route path="*" element={<Layout><HomePage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

