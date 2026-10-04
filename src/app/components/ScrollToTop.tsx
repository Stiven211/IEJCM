import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * React Router no restaura el scroll por su cuenta: al navegar conserva el
 * offset de la pagina anterior, asi que desde una pagina larga se terminaba
 * siempre al final (footer) de la nueva.
 *
 * Se monta dentro del <BrowserRouter> pero FUERA de los <Suspense> de las rutas
 * lazy, para que el reseteo ocurra en el cambio de ruta y no espere a que
 * cargue el chunk.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 'instant' y no 'auto': globals.css define html { scroll-behavior: smooth },
    // que animaria el salto y dejaria al usuario viendo el recorrido de abajo.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}
