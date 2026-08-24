import { Check, AlertTriangle } from 'lucide-react'

export interface AdminStatusMessagesProps {
  successMsg: string
  errorMsg: string
}

export function AdminStatusMessages({ successMsg, errorMsg }: AdminStatusMessagesProps) {
  return (
    <>
      {successMsg && (
        <div style={{ backgroundColor: '#E8F5E9', border: '1px solid rgba(0,100,0,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#006400', fontSize: '14px', fontWeight: 600 }}>
          <Check size={16} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
          <AlertTriangle size={16} /> {errorMsg}
        </div>
      )}
    </>
  )
}
