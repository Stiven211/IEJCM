import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { logError } from '../../lib/logger'
import { useIsAdmin } from '../../hooks/useIsAdmin'

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockedOut, setLockedOut] = useState(false)

  useEffect(() => {
    return () => {
      setAttempts(0)
      setLockedOut(false)
    }
  }, [])

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) {
      const timer = setTimeout(() => {
        setAttempts(0)
        setLockedOut(false)
      }, LOCKOUT_DURATION)
      return () => clearTimeout(timer)
    }
  }, [attempts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setLoading(false)
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedOut(true)
        setPassword('')
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } else {
        setError('Correo o contraseña incorrectos.')
      }
      return
    }

    const { data: { user: loggedUser } } = await supabase.auth.getUser()

    if (!loggedUser) {
      setLoading(false)
      setError('No se pudo verificar la sesión.')
      return
    }

    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', loggedUser.id)
      .maybeSingle()

    setLoading(false)

    if (roleError || roleData?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('Acceso denegado. Solo administradores.')
      return
    }

    navigate('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#F8F8F8' }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex"
        style={{
          width: '44%',
          backgroundColor: '#006400',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 56px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ width: 60, height: 60, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <Lock size={30} color="#FFFFFF" />
          </div>

          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Panel Administrativo
          </div>

          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 800, lineHeight: 1.18, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Colegio José<br />Celestino Mutis
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.78, marginBottom: '44px' }}>
            Gestiona los eventos institucionales del colegio de manera fácil, segura y eficiente.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: Lock, text: 'Acceso seguro y controlado' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="rgba(255,255,255,0.85)" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '56px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
            San José del Guaviare, Colombia · Fundado 1978
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: 52, height: 52, backgroundColor: '#006400', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Lock size={26} color="#FFFFFF" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>Colegio José Celestino Mutis</div>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1A1A1A', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Iniciar Sesión
          </h2>
          <p style={{ color: '#5A7A5A', fontSize: '14px', marginBottom: '32px' }}>
            Ingresa tus credenciales para acceder al panel de administración.
          </p>

          {lockedOut ? (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '16px 20px', marginBottom: '24px', textAlign: 'center' }}>
              <div style={{ color: '#DC2626', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                Acceso denegado.
              </div>
              <div style={{ color: '#5A7A5A', fontSize: '13px', lineHeight: 1.6 }}>
                Has superado el número máximo de intentos permitidos.
              </div>
              <div style={{ color: '#5A7A5A', fontSize: '13px', lineHeight: 1.6, marginTop: '8px' }}>
                Si necesitas acceso comunícate con el administrador del sistema.
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', fontSize: '14px', color: '#DC2626', lineHeight: 1.5 }}>
                  {error}
                </div>
              )}

              {attempts > 0 && attempts < MAX_ATTEMPTS && (
                <div style={{ backgroundColor: '#FFFBEB', border: '1px solid rgba(220,180,0,0.25)', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#92400E', lineHeight: 1.5 }}>
                  Intento {attempts} de {MAX_ATTEMPTS}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>
                    Correo electrónico
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5A7A5A', pointerEvents: 'none' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      disabled={lockedOut}
                      style={{ width: '100%', paddingLeft: '40px', paddingRight: '14px', height: '46px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#FFFFFF', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.11)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5A7A5A', pointerEvents: 'none' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={lockedOut}
                      style={{ width: '100%', paddingLeft: '40px', paddingRight: '44px', height: '46px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#FFFFFF', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.11)'}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={lockedOut}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5A7A5A', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || lockedOut}
                  style={{
                    backgroundColor: loading || lockedOut ? '#228B22' : '#006400',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: loading || lockedOut ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    opacity: loading || lockedOut ? 0.85 : 1,
                  }}
                  onMouseEnter={e => { if (!loading && !lockedOut) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22' }}
                  onMouseLeave={e => { if (!loading && !lockedOut) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400' }}
                >
                  {loading ? 'Verificando...' : 'Ingresar →'}
                </button>
              </form>
            </>
          )}

          <button
            onClick={() => navigate('/')}
            style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '24px', color: '#5A7A5A', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#006400'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#5A7A5A'}
          >
            ← Volver al sitio web
          </button>
        </div>
      </div>
    </div>
  )
}