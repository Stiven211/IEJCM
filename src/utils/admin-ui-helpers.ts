export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid rgba(0,0,0,0.11)',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#FFFFFF',
  color: '#1A1A1A',
  transition: 'border-color 0.2s',
}

export const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = '#006400'
}

export const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.borderColor = 'rgba(0,0,0,0.11)'
}
