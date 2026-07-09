
import { X, Check } from 'lucide-react'

export interface AdminModalProps {
  open: boolean
  title: string
  onClose: () => void
  onSave: () => void
  saveLabel: string
  cancelLabel?: string
  saving?: boolean
  children: React.ReactNode
}

export function AdminModal({
  open,
  title,
  onClose,
  onSave,
  saveLabel,
  cancelLabel = 'Cancelar',
  saving = false,
  children,
}: AdminModalProps) {
  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '92vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.28)' }}>
        <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A1A', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '7px', border: 'none', backgroundColor: '#F0F4F0', cursor: 'pointer', color: '#5A7A5A' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {children}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.07)', marginTop: '4px' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.13)', backgroundColor: '#FFFFFF', color: '#1A1A1A', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {cancelLabel}
          </button>
          <button onClick={onSave} disabled={saving} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: saving ? '#CCCCCC' : '#006400', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '7px', transition: 'background 0.2s' }} onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22' }} onMouseLeave={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400' }}>
            <Check size={15} />
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

