import { memo } from 'react'
import { MapPin, Phone, Mail, Send, Check, Facebook, Instagram } from 'lucide-react'
import { TikTokIcon } from '../ui/TikTokIcon'
import type { SchoolInfo } from '../../../services/schoolInfo.service'

const TRANSITION = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'

interface HomeContactProps {
  schoolInfo: SchoolInfo | null
  form: { name: string; email: string; message: string }
  sent: boolean
  submitting: boolean
  submitError: string | null
  onFormChange: (field: string, value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>
}

export const HomeContact = memo(function HomeContact({ schoolInfo, form, sent, submitting, submitError, onFormChange, onSubmit }: HomeContactProps) {
  const address = schoolInfo?.address || ''
  const phone = schoolInfo?.phone || ''
  const email = schoolInfo?.email || ''
  const facebook = schoolInfo?.facebook || ''
  const instagram = schoolInfo?.instagram || ''
  const youtube = schoolInfo?.youtube || ''

  return (
    <section id="contacto" className="fade-in-up" style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#F8F8F8', animationDelay: '300ms' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '12px' }}>
            Contacto
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.02em', margin: 0 }}>
            Ponte en Contacto con Nosotros
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '28px' }}>Información de Contacto</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {[
                 { Icon: MapPin, title: 'Dirección', content: address || 'No disponible' },
                 { Icon: Phone, title: 'Teléfonos', content: phone || 'No disponible' },
                 { Icon: Mail, title: 'Correo Electrónico', content: email || 'No disponible' },
                ...(facebook ? [{ Icon: Facebook, title: 'Facebook', content: facebook }] : []),
                ...(instagram ? [{ Icon: Instagram, title: 'Instagram', content: instagram }] : []),
                ...(youtube ? [{ Icon: TikTokIcon, title: 'TikTok', content: youtube }] : []),
              ].map(({ Icon, title, content }) => (
                <div key={title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: 42, height: 42, backgroundColor: '#E8F5E9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} style={{ color: '#006400' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1A1A', marginBottom: '4px' }}>{title}</div>
                    <div style={{ color: '#5A7A5A', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{content}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderRadius: '12px', overflow: 'hidden', height: '250px', border: '1px solid rgba(0,100,0,0.1)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14095.75967167216!2d-72.65122506261227!3d2.5586275951603885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e17769a18ff5b9d%3A0xa248bbbbb0ee26b4!2sColegio%20Jos%C3%A9%20Celestino%20Mutis!5e1!3m2!1ses-419!2sco!4v1780669704802!5m2!1ses-419!2sco"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '36px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>Envíanos un Mensaje</h3>
            <p style={{ color: '#5A7A5A', fontSize: '14px', marginBottom: '28px', lineHeight: 1.65 }}>
              Déjanos tu mensaje y el colegio podrá revisarlo desde su bandeja administrativa.
            </p>

            {sent ? (
              <div role="status" aria-live="polite" style={{ backgroundColor: '#E8F5E9', border: '1px solid rgba(0,100,0,0.3)', borderRadius: '12px', padding: '32px 20px', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, backgroundColor: '#006400', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={24} color="#FFFFFF" />
                </div>
                <div style={{ color: '#006400', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>¡Mensaje recibido!</div>
                <div style={{ color: '#5A7A5A', fontSize: '14px' }}>El colegio puede revisar tu mensaje desde su bandeja administrativa.</div>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1 }} />
                {[
                  { label: 'Nombre completo', key: 'name', type: 'text', placeholder: 'Tu nombre completo' },
                  { label: 'Correo electrónico', key: 'email', type: 'email', placeholder: 'tu@correo.com' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                      <label htmlFor={`contact-${key}`} style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>{label}</label>
                     <input
                        id={`contact-${key}`}
                       type={type}
                       value={form[key as keyof typeof form]}
                       onChange={e => onFormChange(key, e.target.value)}
                       placeholder={placeholder}
                       required
                       maxLength={key === 'name' ? 120 : 254}
                       style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#F8F8F8', outline: 'none', boxSizing: 'border-box', transition: TRANSITION }}
                       onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'}
                       onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.11)'}
                     />
                  </div>
                ))}
                <div>
                  <label htmlFor="contact-message" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>Mensaje</label>
                   <textarea
                    id="contact-message"
                     value={form.message}
                     onChange={e => onFormChange('message', e.target.value)}
                     placeholder="Escribe tu mensaje aquí..."
                     required
                     maxLength={4000}
                     rows={5}
                     style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(0,0,0,0.11)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#F8F8F8', outline: 'none', boxSizing: 'border-box', resize: 'vertical', transition: TRANSITION }}
                     onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = '#006400'}
                     onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(0,0,0,0.11)'}
                   />
                </div>
                {submitError && <div role="alert" aria-live="assertive" style={{ backgroundColor: '#FEF2F2', border: '1px solid rgba(220,38,38,0.25)', borderRadius: '8px', padding: '10px 12px', color: '#991B1B', fontSize: '13px' }}>{submitError}</div>}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '13px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: TRANSITION }}
                  onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22' }}
                  onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400' }}
                  onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
                  onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
                >
                  <Send size={16} /> {submitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})
