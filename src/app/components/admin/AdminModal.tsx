
import { useCallback, useEffect, useId, useRef } from 'react'
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
  const titleId = useId()
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current = document.activeElement as HTMLElement

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    const focusTarget = closeButtonRef.current ?? panelRef.current
    focusTarget?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedRef.current?.focus()
    }
  }, [open, saving, onClose])

  const handleOverlayMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !saving) {
      onClose()
    }
  }, [onClose, saving])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={handleOverlayMouseDown}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(4px)' }}
    >
      <div ref={panelRef} tabIndex={-1} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '92vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.28)' }}>
        <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
          <h2 id={titleId} style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A1A', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
          <button ref={closeButtonRef} onClick={onClose} disabled={saving} aria-label="Cerrar ventana" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '7px', border: 'none', backgroundColor: '#F0F4F0', cursor: saving ? 'not-allowed' : 'pointer', color: '#5A7A5A', opacity: saving ? 0.6 : 1 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {children}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', padding: '16px 28px 22px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <button onClick={onClose} disabled={saving} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.13)', backgroundColor: '#FFFFFF', color: '#1A1A1A', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
            {cancelLabel}
          </button>
          <button onClick={onSave} disabled={saving} aria-busy={saving} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: saving ? '#CCCCCC' : '#006400', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '7px', transition: 'background 0.2s' }} onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22' }} onMouseLeave={e => { if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400' }}>
            <Check size={15} />
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

