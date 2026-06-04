import { useState } from 'react'
import { useNavigate } from 'react-router'
import { GraduationCap, Eye, EyeOff, Lock, Mail, BookOpen, Users, Award, Shield } from 'lucide-react'

interface AdminLoginProps {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 850))

    if (email === 'admin@jcmutis.edu.co' && password === 'admin123') {
      onLogin()
      navigate('/admin')
    } else {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    }
    setLoading(false)
  }

  const features = [
    { icon: BookOpen, text: 'Crear y editar eventos institucionales' },
    { icon: Users, text: 'Gestionar el calendario académico' },
    { icon: Award, text: 'Publicar información para la comunidad' },
    { icon: Shield, text: 'Acceso seguro y controlado' },
  ]

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
            <GraduationCap size={30} color="#FFFFFF" />
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
            {features.map(({ icon: Icon, text }) => (
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
              <GraduationCap size={26} color="#FFFFFF" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>Colegio José Celestino Mutis</div>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1A1A1A', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Iniciar Sesión
          </h2>
          <p style={{ color: '#5A7A5A', fontSize: '14px', marginBottom: '32px' }}>
            Ingresa tus credenciales para acceder al panel de administración.
          </p>

          <div style={{ backgroundColor: '#E8F5E9', border: '1px solid rgba(0,100,0,0.18)', borderRadius: '8px', padding: '12px 14px', marginBottom: '28px', fontSize: '13px', color: '#2E6B2E', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>Demo:</span> admin@jcmutis.edu.co / admin123
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', fontSize: '14px', color: '#B91C1C', lineHeight: 1.5 }}>
              {error}
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
                  placeholder="admin@jcmutis.edu.co"
                  required
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
                  style={{ width: '100%', paddingLeft: '40px', paddingRight: '44px', height: '46px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#FFFFFF', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.11)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5A7A5A', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#228B22' : '#006400',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                opacity: loading ? 0.85 : 1,
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22' }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400' }}
            >
              {loading ? 'Verificando credenciales...' : 'Ingresar al Panel →'}
            </button>
          </form>

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
