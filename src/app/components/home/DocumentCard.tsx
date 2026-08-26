import { memo } from 'react'
import { FileText, Calendar, Download } from 'lucide-react'
import type { Document } from '../../types'
import { getCategoryLabel } from './DocumentCategory'

interface DocumentCardProps {
  document: Document
  onDownload?: (document: Document) => void
}

export const DocumentCard = memo(function DocumentCard({ document, onDownload }: DocumentCardProps) {
  const publishedDate = document.published_at ? new Date(document.published_at) : new Date(document.created_at || '')

  const handleClick = () => {
    if (!document.is_public) return
    if (onDownload) {
      onDownload(document)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      role={document.is_public ? 'button' : undefined}
      tabIndex={document.is_public ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.5px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        cursor: document.is_public ? 'pointer' : 'default',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '8px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={20} style={{ color: '#006400' }} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#006400', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {getCategoryLabel(document.category)}
            </div>
          </div>
        </div>

        <h3 style={{
          margin: '0 0 10px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#1A1A1A',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {document.title}
        </h3>

        <p style={{
          margin: '0 0 16px',
          fontSize: '13px',
          color: '#5A7A5A',
          lineHeight: 1.7,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {document.description || 'Sin descripción.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#5A7A5A', fontSize: '13px', marginBottom: '18px' }}>
          <Calendar size={13} style={{ color: '#006400' }} />
          <span>{publishedDate.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {document.is_public ? (
            <span style={{
              backgroundColor: '#E8F5E9',
              color: '#006400',
              borderRadius: '12px',
              padding: '3px 10px',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              Público
            </span>
          ) : (
            <span style={{
              backgroundColor: '#F0F4F0',
              color: '#3A4E3A',
              borderRadius: '12px',
              padding: '3px 10px',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
            }}>
              {document.file_extension}
            </span>
          )}
          <span style={{
            backgroundColor: '#F0F4F0',
            color: '#3A4E3A',
            borderRadius: '12px',
            padding: '3px 10px',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
          }}>
            {document.file_extension}
          </span>
          {document.is_public && (
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#006400', fontSize: '12px', fontWeight: 600 }}>
              <Download size={14} /> Descargar
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

DocumentCard.displayName = 'DocumentCard'
