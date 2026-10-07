import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

/**
 * Aviso de "sin conexion", global a todas las rutas.
 *
 * Sin internet, Supabase no responde: la base devuelve null y el site queda
 * vacio. Ademas los recursos externos (fuentes, imagenes remotas) tampoco
 * cargan. Antes no se avisaba de nada y solo aparecia un error tecnico.
 *
 * Se oculta solo cuando navigator.onLine vuelve a true, sin recargar.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false,
  )

  useEffect(() => {
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    // el estado inicial puede quedar viejo si el navegador cambia de estado
    // mientras la pagina estaba en segundo plano
    const sync = () => setOffline(!navigator.onLine)
    document.addEventListener('visibilitychange', sync)

    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '10px 20px',
        backgroundColor: '#78350F',
        color: '#FEF3C7',
        fontSize: '14px',
        textAlign: 'center',
      }}
    >
      <WifiOff size={16} style={{ flexShrink: 0 }} />
      <span>
        Sin conexión a internet. Puede que falte información en algunas secciones.
      </span>
    </div>
  )
}