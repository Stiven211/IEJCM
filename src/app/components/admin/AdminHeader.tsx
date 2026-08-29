
import { Eye, Plus } from 'lucide-react'

export interface AdminHeaderProps {
  title: string
  subtitle?: string
  primaryButtonText: string
  onPrimaryAction: () => void
  onViewSite: () => void
}

export function AdminHeader({
  title,
  subtitle = 'Colegio José Celestino Mutis · San José del Guaviare',
  primaryButtonText,
  onPrimaryAction,
  onViewSite,
}: AdminHeaderProps) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: 'clamp(12px, 2vw, 18px) clamp(16px, 3vw, 28px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ minWidth: 0, flex: '1 1 200px' }}>
        <h1 style={{ fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: 800, color: '#1A1A1A', margin: '0 0 2px', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h1>
        <p style={{ color: '#5A7A5A', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={onViewSite}
          aria-label="Ver sitio público"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: '#5A7A5A', border: '1px solid rgba(0,0,0,0.1)', padding: '8px 14px', borderRadius: '7px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
        >
          <Eye size={14} aria-hidden="true" /> <span className="hidden sm:inline">Ver sitio</span>
        </button>
        <button
          onClick={onPrimaryAction}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '9px 18px', borderRadius: '7px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
        >
          <Plus size={16} aria-hidden="true" /> {primaryButtonText}
        </button>
      </div>
    </div>
  )
}

