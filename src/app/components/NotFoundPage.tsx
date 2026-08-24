import { useNavigate } from 'react-router'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px', backgroundColor: '#F8F8F8', color: '#1A1A1A', textAlign: 'center' }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#E8F5E9',
        color: '#006400',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
      }}>
        <span style={{ fontSize: '32px', fontWeight: 800 }}>404</span>
      </div>
      <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, margin: '0 0 12px', color: '#1A1A1A' }}>
        Página no encontrada
      </h1>
      <p style={{ fontSize: '15px', color: '#5A7A5A', lineHeight: 1.7, maxWidth: '420px', margin: '0 0 32px' }}>
        La página que buscas no existe o fue movida. Puedes volver al inicio o regresar a la página anterior.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: 'transparent',
            color: '#006400',
            border: '1.5px solid #006400',
            padding: '10px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = '#006400'; b.style.color = '#FFFFFF' }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = 'transparent'; b.style.color = '#006400' }}
          onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
          onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
        >
          ← Volver atrás
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#006400',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
          onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
          onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
        >
          <Home size={16} /> Ir al inicio
        </button>
      </div>
    </div>
  )
}
