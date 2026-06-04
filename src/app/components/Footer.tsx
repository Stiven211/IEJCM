import { Link } from 'react-router'
import { GraduationCap, MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: 40, height: 40, backgroundColor: '#006400', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GraduationCap size={20} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.3 }}>Colegio José Celestino Mutis</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>San José del Guaviare</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.85, marginBottom: '24px' }}>
              Formando ciudadanos íntegros y comprometidos con el desarrollo de San José del Guaviare desde 1978.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{ width: 34, height: 34, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(0,100,0,0.5)'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.07)'}
                >
                  <Icon size={15} color="rgba(255,255,255,0.6)" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '11px', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4CAF50' }}>Navegación</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {[
                { label: 'Inicio', to: '/' },
                { label: 'Eventos', to: '/eventos' },
                { label: 'Sobre Nosotros', to: '/#sobre-nosotros' },
                { label: 'Contacto', to: '/#contacto' },
                { label: 'Acceso Administrativo', to: '/admin' },
              ].map(item => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    style={{ color: 'rgba(255,255,255,0.52)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#FFFFFF'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.52)'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '11px', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4CAF50' }}>Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { Icon: MapPin, text: 'Calle 8 #12-45, San José del Guaviare, Guaviare, Colombia' },
                { Icon: Phone, text: '(608) 584-0000\n(608) 584-0001 (Ext. 102)' },
                { Icon: Mail, text: 'rectoria@jcmutis.edu.co\nsecretaria@jcmutis.edu.co' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Icon size={14} style={{ color: '#228B22', flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ color: 'rgba(255,255,255,0.52)', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '11px', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4CAF50' }}>Horario</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <Clock size={14} style={{ color: '#228B22', flexShrink: 0, marginTop: '3px' }} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '3px' }}>Jornada Mañana (Lun–Vie)</div>
                <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>6:30 AM — 1:00 PM</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '3px' }}>Jornada Tarde (Lun–Vie)</div>
                <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px' }}>1:00 PM — 6:00 PM</div>
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(34,139,34,0.12)', border: '1px solid rgba(34,139,34,0.25)', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ color: '#4CAF50', fontSize: '11px', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secretaría</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Lun–Vie: 7:00 AM – 4:00 PM</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            © 2026 Colegio José Celestino Mutis. Todos los derechos reservados.
          </div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>
            NIT: 892.099.311-7 · DANE: 150001006434
          </div>
        </div>
      </div>
    </footer>
  )
}
