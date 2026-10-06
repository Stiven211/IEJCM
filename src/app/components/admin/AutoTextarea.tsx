import { useEffect, useRef, type CSSProperties, type FocusEventHandler } from 'react'

interface AutoTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Filas minimas. El alto crece solo a partir de ahi. */
  minRows?: number
  maxRows?: number
  inputStyle?: CSSProperties
  onFocus?: FocusEventHandler<HTMLTextAreaElement>
  onBlur?: FocusEventHandler<HTMLTextAreaElement>
  'aria-label'?: string
}

/**
 * Textarea que crece con el contenido.
 *
 * Con rows fijos, un texto largo queda cortado dentro de la caja: habia que
 * scrollear dentro de un area de ~100px para leer la mision completa, y al
 * editar no se ve lo que se esta escribiendo. Se mide el alto real del
 * elemento (scrollHeight) y se aplica como height.
 */
export function AutoTextarea({
  value,
  onChange,
  placeholder,
  minRows = 4,
  maxRows = 24,
  inputStyle,
  onFocus,
  onBlur,
  'aria-label': ariaLabel,
}: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = ref.current
    if (!el) return
    // Hay que ponerlo en 'auto' antes de medir. Si no, scrollHeight sigue
    // reflejando el alto actual y el campo no crece nunca.
    el.style.height = 'auto'
    // El tope lo aplica maxHeight en el style; si el texto lo excede aparece
    // la barra de scroll, en vez de un bloque infinito.
    el.style.height = el.scrollHeight + 'px'
  }

  useEffect(() => {
    resize()
  }, [value])

  useEffect(() => {
    // Al cambiar el ancho de la ventana el texto se re-ajusta: hay que recalcular
    const onWindowResize = () => resize()
    window.addEventListener('resize', onWindowResize)
    return () => window.removeEventListener('resize', onWindowResize)
  }, [])

  const lineHeight = 22

  return (
    <textarea
      ref={ref}
      aria-label={ariaLabel}
      value={value}
      placeholder={placeholder}
      rows={minRows}
      onChange={e => {
        onChange(e.target.value)
        resize()
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        ...inputStyle,
        resize: 'vertical',
        minHeight: minRows * lineHeight + 18 + 'px',
        maxHeight: maxRows * lineHeight + 18 + 'px',
        overflowY: 'auto',
        height: 'auto',
      }}
    />
  )
}
