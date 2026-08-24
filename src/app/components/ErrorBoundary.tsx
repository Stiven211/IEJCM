import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
          backgroundColor: '#F8F8F8',
          color: '#1A1A1A',
          fontFamily: 'inherit',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: 'clamp(32px, 5vw, 48px)',
            maxWidth: '520px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              margin: '0 auto 20px',
            }}>
              !
            </div>
            <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, margin: '0 0 12px', color: '#1A1A1A' }}>
              Algo salió mal
            </h1>
            <p style={{ fontSize: '15px', color: '#5A7A5A', lineHeight: 1.7, margin: '0 0 28px' }}>
              La aplicación encontró un error inesperado. Puedes intentar recargar la página para continuar.
            </p>
            <button
              onClick={this.handleRetry}
              style={{
                backgroundColor: '#006400',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
              onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
              onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
