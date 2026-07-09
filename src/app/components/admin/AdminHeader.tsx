
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
    <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', position: 'sticky', top: 0, zIndex: 10 }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 2px', letterSpacing: '-0.01em' }}>{title}</h1>
        <p style={{ color: '#5A7A5A', fontSize: '13px', margin: 0 }}>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={onViewSite}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: '#5A7A5A', border: '1px solid rgba(0,0,0,0.1)', padding: '8px 14px', borderRadius: '7px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <Eye size={14} /> Ver sitio
        </button>
        <button
          onClick={onPrimaryAction}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '9px 18px', borderRadius: '7px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
        >
          <Plus size={16} /> {primaryButtonText}
        </button>
      </div>
    </div>
  )
}

