import { RefreshCw } from 'lucide-react'

interface LoadErrorStateProps {
  message: string
  onRetry: () => void
}

export function LoadErrorState({ message, onRetry }: LoadErrorStateProps) {
  return (
    <div role="alert" style={{ textAlign: 'center', padding: '64px 24px', color: '#7F1D1D' }}>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#991B1B' }}>{message}</div>
      <button
        type="button"
        onClick={onRetry}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: '#991B1B', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        <RefreshCw size={15} /> Reintentar
      </button>
    </div>
  )
}
