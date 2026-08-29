
import { useRef } from 'react'
import { Edit2, Trash2, AlertTriangle } from 'lucide-react'

export interface AdminDataTableColumn<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
}

export interface AdminDataTableProps<T> {
  columns: AdminDataTableColumn<T>[]
  data: T[]
  loading: boolean
  emptyMessage: string
  loadingMessage?: string
  getItemKey: (item: T, index: number) => string
  onEdit: (item: T) => void
  onDeleteRequest: (id: string) => void
  onDeleteConfirmed: (id: string) => void
  onDeleteCancelled: () => void
  deleteConfirmId: string | null
}

const TABLE_WRAPPER_ID = 'admin-data-table-wrapper'

export function AdminDataTable<T extends { title?: string }>({
  columns,
  data,
  loading,
  emptyMessage,
  loadingMessage = 'Cargando...',
  getItemKey,
  onEdit,
  onDeleteRequest,
  onDeleteConfirmed,
  onDeleteCancelled,
  deleteConfirmId,
}: AdminDataTableProps<T>) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  const getItemName = (item: T): string => {
    const title = item.title
    if (typeof title === 'string' && title.trim().length > 0) return title.trim()
    return 'este elemento'
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div ref={scrollWrapperRef} id={TABLE_WRAPPER_ID} role="region" aria-label="Tabla de datos con desplazamiento horizontal" tabIndex={0} style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {loading ? (
          <div role="status" aria-live="polite" style={{ padding: '48px', textAlign: 'center', color: '#5A7A5A', fontSize: '14px' }}>
            {loadingMessage}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '620px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8F8F8', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                {columns.map(col => (
                  <th key={col.key} scope="col" style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A7A5A', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                    {col.header}
                  </th>
                ))}
                <th scope="col" style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A7A5A', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ padding: '48px', textAlign: 'center', color: '#5A7A5A', fontSize: '14px' }}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : data.map((item, idx) => {
                const isDeleting = deleteConfirmId === getItemKey(item, idx)
                const baseKey = getItemKey(item, idx)
                const itemName = getItemName(item)

                if (isDeleting) {
                  return (
                    <tr key={`delete-${baseKey}`} style={{ backgroundColor: '#FEF2F2' }}>
                      <td colSpan={columns.length + 1} style={{ padding: '14px 16px' }}>
                        <div role="alert" aria-live="assertive" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <AlertTriangle size={15} style={{ color: '#DC2626', flexShrink: 0 }} aria-hidden="true" />
                          <span style={{ fontSize: '14px', color: '#1A1A1A', flex: 1, minWidth: '200px' }}>
                            ¿Eliminar <strong>"{itemName}"</strong>? Esta acción no se puede deshacer.
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button ref={cancelButtonRef} onClick={onDeleteCancelled} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.14)', backgroundColor: '#FFFFFF', color: '#1A1A1A', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                              Cancelar
                            </button>
                            <button onClick={() => onDeleteConfirmed(baseKey)} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                              Sí, eliminar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr
                    key={baseKey}
                    style={{ borderBottom: idx < data.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F9FBF9'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'}
                  >
                    {columns.map(col => (
                      <td key={col.key} style={{ padding: '13px 16px' }}>
                        {col.render ? col.render(item) : null}
                      </td>
                    ))}
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => onEdit(item)}
                          aria-label={`Editar ${itemName}`}
                          title={`Editar ${itemName}`}
                          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#006400', transition: 'all 0.15s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#E8F5E9'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#006400' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)' }}
                        >
                          <Edit2 size={14} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => onDeleteRequest(baseKey)}
                          aria-label={`Eliminar ${itemName}`}
                          title={`Eliminar ${itemName}`}
                          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#FFFFFF', cursor: 'pointer', color: '#DC2626', transition: 'all 0.15s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#DC2626' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)' }}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

