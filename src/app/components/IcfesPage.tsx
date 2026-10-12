import { useState, useEffect, useCallback, useMemo } from 'react'
import { Award, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import * as icfesService from '../../services/icfes.service'
import * as schoolInfoService from '../../services/schoolInfo.service'
import { LoadErrorState } from './ui/LoadErrorState'
import { ResilientImage } from './ui/ResilientImage'
import { logError } from '../../lib/logger'

/**
 * Pagina publica de la temporada de ICFES.
 *
 * Si el administrador apaga el interruptor, esta pagina responde "no
 * disponible" en vez de redirigir: una URL compartida por WhatsApp puede
 * quedar dando vueltas, y el 404Layout comun no explica nada.
 */
export function IcfesPage() {
  const [students, setStudents] = useState<icfesService.IcfesStudent[]>([])
  const [texto, setTexto] = useState('')
  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      // school_info y los estudiantes van en paralelo: son independientes.
      const [info, lista] = await Promise.all([
        schoolInfoService.getSchoolInfo(),
        icfesService.getIcfesStudents(),
      ])
      setVisible(info?.icfes_visible === true)
      setTexto(info?.icfes_text || '')
      setStudents(lista)
    } catch (err) {
      setError(true)
      logError(err, { action: 'loadIcfesPage', page: 'icfes' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Un bloque por año de examen. El agrupado vive en el servicio para que el
  // orden sea el mismo en el panel y en la pagina.
  const grupos = useMemo(() => icfesService.agruparPorAno(students), [students])

  if (loading) {
    return (
      <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>Cargando...</div>
      </div>
    )
  }

  if (error) {
    return <LoadErrorState onRetry={load} title="No se pudo cargar la información del ICFES" />
  }

  if (!visible) {
    return (
      <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '520px', textAlign: 'center', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '40px 28px' }}>
          <Award size={40} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 10px' }}>
            Sección no disponible
          </h1>
          <p style={{ fontSize: '14px', color: '#3A4E3A', lineHeight: 1.6, margin: '0 0 22px' }}>
            La temporada de ICFES no está publicada en este momento. Vuelve a consultar más adelante.
          </p>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 22px', borderRadius: '8px', background: '#006400', color: '#FFFFFF', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh' }}>
      {/* Encabezado */}
      <div style={{ backgroundColor: '#006400', padding: 'clamp(48px, 6vw, 80px) 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '12px', letterSpacing: '0.03em' }}>
            Inicio / ICFES
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            ICFES · Examen de Estado Saber 11
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(15px, 1.8vw, 18px)', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
            Toda la información de la temporada y los mejores resultados del colegio.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(28px, 4vw, 48px) 24px' }}>
        {/* Texto del colegio */}
        {texto.trim() && (
          <section
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '12px',
              padding: 'clamp(22px, 3vw, 34px)',
              marginBottom: 'clamp(28px, 4vw, 44px)',
              borderLeft: '4px solid #006400',
            }}
          >
            <div
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: 'clamp(15px, 1.6vw, 17px)',
                color: '#1A1A1A',
                lineHeight: 1.75,
                fontFamily: 'inherit',
                margin: 0,
              }}
            >
              {texto}
            </div>
          </section>
        )}

        {/* Mejores estudiantes, agrupados por año de examen. */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: 'clamp(20px, 3vw, 30px)', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', fontWeight: 800, color: '#1A1A1A', margin: 0, letterSpacing: '-0.01em' }}>
              Mejores estudiantes
            </h2>
            {students.length > 0 && (
              <span style={{ fontSize: '13px', color: '#6B7280' }}>
                {students.length} {students.length === 1 ? 'estudiante' : 'estudiantes'}
                {grupos.length > 1 ? ` · ${grupos.length} temporadas` : ''}
              </span>
            )}
          </div>

          {students.length === 0 ? (
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '44px 24px', textAlign: 'center' }}>
              <Award size={36} color="#9CA3AF" style={{ margin: '0 auto 14px' }} />
              <p style={{ fontSize: '15px', color: '#3A4E3A', margin: 0 }}>
                Todavía no hay resultados publicados.
              </p>
            </div>
          ) : (
            grupos.map((grupo) => (
              <div key={grupo.year ?? 'sin-ano'} style={{ marginBottom: 'clamp(28px, 4vw, 44px)' }}>
                {/* Encabezado del año. Sirve para comparar temporadas: cada
                    bloque es un examen distinto. */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    marginBottom: 'clamp(16px, 2.5vw, 22px)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 'clamp(18px, 2.2vw, 24px)',
                      fontWeight: 800,
                      color: '#006400',
                      margin: 0,
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {grupo.year ?? 'Sin año'}
                  </h3>
                  <span style={{ flex: 1, height: '1px', background: 'rgba(0,100,0,0.18)' }} />
                  <span style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                    {grupo.students.length}{' '}
                    {grupo.students.length === 1 ? 'estudiante' : 'estudiantes'}
                  </span>
                </div>

                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: 'clamp(16px, 2vw, 24px)',
                  }}
                >
                  {grupo.students.map((estudiante) => {
                    const esMejor = estudiante.id === grupo.mejor.id

                    return (
                      <li
                        key={estudiante.id}
                        style={{
                          background: '#FFFFFF',
                          border: esMejor
                            ? '2px solid #006400'
                            : '1px solid rgba(0,0,0,0.08)',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          // El mejor del año crece un poco y se levanta: se
                          // distingue sin gritar ni romper la retícula.
                          transform: esMejor ? 'scale(1.03)' : 'none',
                          boxShadow: esMejor
                            ? '0 10px 28px rgba(0,100,0,0.18)'
                            : 'none',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                      >
                        {/* Foto. Si no hay foto, la inicial: una tarjeta con un
                            hueco gris se ve como un error de carga. */}
                        <div style={{ background: '#E8F5E9', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          {esMejor && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#006400',
                                color: '#FFFFFF',
                                borderRadius: '20px',
                                padding: '5px 12px',
                                fontSize: '12px',
                                fontWeight: 700,
                              }}
                            >
                              <Award size={13} />
                              Mejor del año
                            </span>
                          )}

                          {estudiante.photo_url ? (
                            <ResilientImage
                              src={estudiante.photo_url}
                              alt={estudiante.full_name}
                              decoding="async"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '48px', fontWeight: 800, color: '#006400', opacity: 0.55 }}>
                              {(estudiante.full_name || '').trim().charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div style={{ padding: '18px 20px 22px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                          <div style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.35 }}>
                            {estudiante.full_name}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: 'auto' }}>
                            {estudiante.grade ? (
                              <span style={{ background: '#E8F5E9', color: '#006400', borderRadius: '12px', padding: '4px 12px', fontSize: '13px', fontWeight: 600 }}>
                                {estudiante.grade}
                              </span>
                            ) : (
                              <span />
                            )}
                            {/* Entero: "356", no "356.0". */}
                            <span
                              style={{
                                fontSize: esMejor ? '26px' : '22px',
                                fontWeight: 800,
                                color: '#006400',
                                fontFamily: 'ui-monospace, monospace',
                                letterSpacing: '-0.02em',
                              }}
                            >
                              {Math.round(Number(estudiante.score || 0))}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}
