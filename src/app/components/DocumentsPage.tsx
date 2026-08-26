import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, FileText } from 'lucide-react'
import { DocumentCard } from './home/DocumentCard'
import { DocumentsSkeleton } from './ui/DocumentsSkeleton'
import { LoadErrorState } from './ui/LoadErrorState'
import * as documentService from '../../services/document.service'
import type { Document } from '../../types'
import { logError } from '../../lib/logger'
import { CATEGORY_OPTIONS } from './home/DocumentCategory'

const TRANSITION = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'

export function DocumentsPage() {
  const [allDocuments, setAllDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todos')

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await documentService.getPublicDocuments()
      setAllDocuments(data)
    } catch (err) {
      setError(true)
      logError(err, { action: 'loadDocuments', page: 'documents' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filteredDocuments = useMemo(() => {
    let list = [...allDocuments]

    if (categoryFilter !== 'todos') {
      list = list.filter(d => d.category === categoryFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.file_name.toLowerCase().includes(q)
      )
    }

    return list
  }, [allDocuments, categoryFilter, searchQuery])

  return (
    <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#006400', padding: 'clamp(48px, 6vw, 80px) 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '12px', letterSpacing: '0.03em' }}>
            Inicio / Documentos
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Documentos Administrativos
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, maxWidth: '540px', lineHeight: 1.7 }}>
            Consulta circulares, formatos, guías y demás documentos institucionales.
          </p>
        </div>
      </div>

      <div className="fade-in-up" style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 24px', animationDelay: '80ms' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '28px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <label htmlFor="documents-search" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Buscar documentos</label>
              <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#5A7A5A', pointerEvents: 'none' }} />
              <input
                id="documents-search"
                type="text"
                placeholder="Buscar documentos..."
                aria-label="Buscar documentos por título, descripción o nombre"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '34px', paddingRight: '12px', height: '40px', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#FFFFFF', outline: 'none', fontFamily: 'inherit', minWidth: '200px', boxSizing: 'border-box', transition: TRANSITION }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#006400'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(0,0,0,0.09)'}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{ height: '40px', padding: '0 12px', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '8px', fontSize: '14px', color: '#1A1A1A', backgroundColor: '#FFFFFF', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', transition: TRANSITION }}
              onFocus={e => (e.currentTarget as HTMLSelectElement).style.borderColor = '#006400'}
              onBlur={e => (e.currentTarget as HTMLSelectElement).style.borderColor = 'rgba(0,0,0,0.09)'}
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '24px', color: '#5A7A5A', fontSize: '14px' }}>
          {filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''} encontrado{filteredDocuments.length !== 1 ? 's' : ''}
        </div>

        <div aria-busy={loading}>
        {loading ? (
          <DocumentsSkeleton />
        ) : error ? (
          <LoadErrorState message="No se pudieron cargar los documentos." onRetry={load} />
        ) : filteredDocuments.length > 0 ? (
          <div className="fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', animationDelay: '120ms' }}>
            {filteredDocuments.map(document => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#5A7A5A' }}>
            <FileText size={52} style={{ color: '#C8E6C9', margin: '0 auto 18px' }} />
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#1A1A1A' }}>No se encontraron documentos</div>
            <div style={{ fontSize: '14px' }}>Intenta con otros filtros o términos de búsqueda.</div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
