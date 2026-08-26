
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { GraduationCap, LogOut, Mail, Menu, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface AdminSidebarSection {
  label: string
  icon: LucideIcon
  to: string
}

export interface AdminSidebarUser {
  initials: string
  name: string
  email: string
}

export interface AdminSidebarProps {
  sections: AdminSidebarSection[]
  user: AdminSidebarUser
  onLogout: () => void
}

export function AdminSidebar({ sections, user, onLogout }: AdminSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const navigationSections = [...sections, { label: 'Mensajes', icon: Mail, to: '/admin/contact-messages' }]
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)

  const closeMobileMenu = () => {
    setMobileOpen(false)
    mobileTriggerRef.current?.focus()
  }

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobileMenu()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [currentPath])

  const navigateMobile = (to: string) => {
    navigate(to)
    closeMobileMenu()
  }

  const renderNavigation = (mobile = false) => navigationSections.map(({ label, icon: Icon, to }) => {
    const active = currentPath === to || (to !== '/admin' && currentPath.startsWith(to))
    return (
      <button
        key={label}
        type="button"
        aria-current={active ? 'page' : undefined}
        onClick={() => { if (!active) void (mobile ? navigateMobile(to) : navigate(to)) }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
          borderRadius: '8px', backgroundColor: active ? 'rgba(255,255,255,0.14)' : 'transparent',
          color: active ? '#FFFFFF' : 'rgba(255,255,255,0.56)', marginBottom: '2px', cursor: 'pointer',
          fontSize: '14px', fontWeight: active ? 600 : 400, transition: 'background 0.2s',
          border: 'none', textAlign: 'left', fontFamily: 'inherit',
        }}
      >
        <Icon size={16} />
        {label}
      </button>
    )
  })

  return (
    <>
      <button
        ref={mobileTriggerRef}
        type="button"
        aria-label="Abrir menú administrativo"
        aria-expanded={mobileOpen}
        aria-controls="admin-mobile-menu"
        onClick={() => setMobileOpen(true)}
        className="md:hidden"
        style={{ position: 'fixed', top: '14px', left: '14px', zIndex: 120, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: '8px', backgroundColor: '#006400', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <>
          <button type="button" aria-label="Cerrar menú administrativo" onClick={closeMobileMenu} className="md:hidden" style={{ position: 'fixed', inset: 0, zIndex: 130, border: 'none', backgroundColor: 'rgba(0,0,0,0.45)', cursor: 'pointer' }} />
          <aside id="admin-mobile-menu" aria-label="Navegación administrativa" className="md:hidden" style={{ position: 'fixed', inset: '0 auto 0 0', zIndex: 140, width: 'min(82vw, 300px)', backgroundColor: '#006400', display: 'flex', flexDirection: 'column', boxShadow: '8px 0 24px rgba(0,0,0,0.22)', overflowY: 'auto' }}>
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} color="#FFFFFF" />
                <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px' }}>Admin Panel</span>
              </div>
              <button type="button" aria-label="Cerrar menú administrativo" onClick={closeMobileMenu} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: '7px', backgroundColor: 'rgba(255,255,255,0.12)', color: '#FFFFFF', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <nav style={{ padding: '16px 12px', flex: 1 }}>{renderNavigation(true)}</nav>
            <div style={{ padding: '14px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, padding: '10px 12px' }}>{user.name}</div>
              <button type="button" onClick={() => { onLogout(); closeMobileMenu() }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', backgroundColor: 'rgba(220,38,38,0.12)', color: 'rgba(248,113,113,0.9)', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}><LogOut size={14} /> Cerrar Sesión</button>
            </div>
          </aside>
        </>
      )}

    <div className="hidden md:flex" style={{ width: '240px', backgroundColor: '#006400', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ padding: '28px 20px 22px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '13px', lineHeight: 1.3 }}>Admin Panel</div>
            <div style={{ color: 'rgba(255,255,255,0.48)', fontSize: '11px' }}>J.C. Mutis</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 12px', flex: 1 }}>
        {renderNavigation()}
      </div>

      <div style={{ padding: '14px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginBottom: '6px' }}>
          <div style={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{user.initials}</span>
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>{user.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.44)', fontSize: '11px' }}>{user.email}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(220,38,38,0.12)',
            color: 'rgba(248,113,113,0.9)',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(220,38,38,0.2)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(220,38,38,0.12)'}
        >
          <LogOut size={14} /> Cerrar Sesión
        </button>
      </div>
    </div>
    </>
  )
}

