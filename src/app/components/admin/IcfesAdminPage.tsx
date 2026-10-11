import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import {
  LayoutDashboard,
  CalendarDays,
  Image,
  Megaphone,
  BookOpen,
  FileText,
  Award,
} from 'lucide-react'
import * as icfesService from '../../../services/icfes.service'
import type { IcfesGrade } from '../../types'
import { ICFES_GRADES } from '../../types'
import { logError } from '../../../lib/logger'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminModal } from './AdminModal'
import { AdminDataTable } from './AdminDataTable'
import { AdminStatusMessages } from './AdminStatusMessages'
import { useAdminStatus } from '../../../hooks/useAdminStatus'
import { ResilientImage } from '../ui/ResilientImage'
import { mensajeDeError, esErrorDeSesion } from '../../lib/adminErrors'

interface IcfesAdminPageProps {
  onLogout: () => void
  adminUser?: string
}

interface FormData {
  full_name: string
  score: string
  grade: string
  active: boolean
}

const EMPTY_FORM: FormData = {
  full_name: '',
  score: '',
  grade: '',
  active: true,
}

// image/* en vez de una lista cerrada: en Android e iOS una lista muy concreta
// hace que el selector no deje elegir la foto de la galeria del telefono. El
// filtro real lo hace validateImageFile.
const IMAGE_INPUT_ACCEPT = 'image/*,.jpg,.jpeg,.png,.webp,.heic,.heif'

function punto(value: number | string | null | undefined): string {
  return Number(value || 0).toFixed(1)
}

function inicial(nombre: string | null | undefined): string {
  return (nombre || '').trim().charAt(0).toUpperCase() || '?'
}

export function IcfesAdminPage({ onLogout, adminUser }: IcfesAdminPageProps) {
  const navigate = useNavigate()
  const [items, setItems] = useState<icfesService.IcfesStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editingItem, setEditingItem] = useState<icfesService.IcfesStudent | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  const { successMsg, errorMsg, showSuccess, showError } = useAdminStatus()

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = await icfesService.getIcfesStudents(false)
      setItems(data)
    } catch (err) {
      logError(err, { action: 'fetchIcfesStudents' })
      showError(mensajeDeError(err, 'No se pudieron cargar los estudiantes.'))
    } finally {
      setLoading(false)
    }
    // showError viene de useAdminStatus y cambia en cada render; incluirlo
    // haria que el efecto se dispare en bucle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const clearPendingPhoto = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setNewFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingItem(null)
    setFormData(EMPTY_FORM)
    clearPendingPhoto()
  }

  const openCreate = () => {
    setFormData(EMPTY_FORM)
    setEditingItem(null)
    clearPendingPhoto()
    setModalMode('create')
  }

  const openEdit = (item: icfesService.IcfesStudent) => {
    setEditingItem(item)
    setFormData({
      full_name: item.full_name,
      score: String(item.score ?? ''),
      grade: item.grade || '',
      active: item.active !== false,
    })
    clearPendingPhoto()
    setModalMode('edit')
  }

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const pickPhoto = () => fileInputRef.current?.click()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const url = URL.createObjectURL(file)
    previewUrlRef.current = url
    setPreview(url)
    setNewFile(file)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // El puntaje viene de un input de texto. Se pasa por Number porque la
      // base lo espera numerico; mandarlo crudo daria un 400 sin explicar.
      const score = Number(formData.score)
      if (formData.score.trim() === '' || Number.isNaN(score)) {
        showError('El puntaje debe ser un número entre 0 y 500.')
        return
      }
      if (score < 0 || score > 500) {
        showError(`El puntaje ${score} está fuera de la escala. El Saber 11 se califica de 0 a 500.`)
        return
      }
      if (!formData.full_name.trim()) {
        showError('El estudiante necesita un nombre.')
        return
      }

      let photoPath: string | null = editingItem?.photo_url || null
      if (newFile) {
        photoPath = await icfesService.uploadIcfesPhoto(newFile)
      }

      const payload = {
        full_name: formData.full_name,
        score,
        grade: (formData.grade || null) as IcfesGrade | null,
        photo_url: photoPath,
        active: formData.active,
      }

      if (modalMode === 'create') {
        await icfesService.createIcfesStudent(payload)
        showSuccess('Estudiante agregado.')
      } else if (modalMode === 'edit' && editingItem) {
        await icfesService.updateIcfesStudent(editingItem.id, payload)
        showSuccess('Estudiante actualizado.')
      }
      closeModal()
      fetchItems()
    } catch (err) {
      logError(err, { action: 'saveIcfesStudent' })
      showError(mensajeDeError(err, 'No se pudo guardar el estudiante.'))
      if (esErrorDeSesion(err)) setTimeout(() => window.location.reload(), 2500)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await icfesService.removeIcfesStudent(id)
      setDeleteConfirmId(null)
      showSuccess('Estudiante eliminado.')
      fetchItems()
    } catch (err) {
      logError(err, { action: 'deleteIcfesStudent' })
      showError(mensajeDeError(err, 'No se pudo eliminar el estudiante.'))
      if (esErrorDeSesion(err)) setTimeout(() => window.location.reload(), 2500)
    }
  }

  const fotoPrevia = preview || editingItem?.photo_url || null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAF8' }}>
      <AdminSidebar
        sections={[
          { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
          { label: 'Eventos', icon: CalendarDays, to: '/admin/events' },
          { label: 'Galería', icon: Image, to: '/admin/gallery' },
          { label: 'Avisos', icon: Megaphone, to: '/admin/announcements' },
          { label: 'ICFES', icon: Award, to: '/admin/icfes' },
          { label: 'Información Institucional', icon: BookOpen, to: '/admin/school-info' },
          { label: 'Documentos', icon: FileText, to: '/admin/documents' },
        ]}
        user={adminUser!}
        onLogout={onLogout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <AdminHeader
          title="Mejores estudiantes ICFES"
          primaryButtonText="Agregar Estudiante"
          onPrimaryAction={openCreate}
          onViewSite={() => navigate('/icfes')}
        />

        <div style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
          <AdminStatusMessages successMsg={successMsg} errorMsg={errorMsg} />

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '12px',
              padding: '16px 18px',
              marginBottom: '18px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>
              Aquí se cargan los estudiantes. Para encender o apagar la sección en el sitio público, ve
              a Información Institucional.
            </div>
            <div style={{ fontSize: '13px', color: '#3A4E3A', lineHeight: 1.55 }}>
              El interruptor de la sección está en Información Institucional, bloque "Sección de ICFES".
              While esté apagada, los estudiantes quedan guardados pero el sitio no los muestra.
            </div>
          </div>

          <AdminDataTable
            columns={[
              {
                key: 'photo',
                header: 'Foto',
                render: (item: icfesService.IcfesStudent) =>
                  item.photo_url ? (
                    <ResilientImage
                      src={item.photo_url}
                      alt={item.full_name}
                      fallbackLabel="Sin foto"
                      decoding="async"
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        backgroundColor: '#E8F5E9',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: '#E8F5E9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#006400',
                      }}
                    >
                      {inicial(item.full_name)}
                    </div>
                  ),
              },
              {
                key: 'full_name',
                header: 'Estudiante',
                render: (item: icfesService.IcfesStudent) => (
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>
                    {item.full_name}
                  </div>
                ),
              },
              {
                key: 'score',
                header: 'Puntaje',
                render: (item: icfesService.IcfesStudent) => (
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#006400',
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  >
                    {punto(item.score)}
                  </div>
                ),
              },
              {
                key: 'grade',
                header: 'Grado',
                render: (item: icfesService.IcfesStudent) => (
                  <div style={{ fontSize: '14px', color: '#3A4E3A' }}>{item.grade || '-'}</div>
                ),
              },
              {
                key: 'active',
                header: 'Publicado',
                render: (item: icfesService.IcfesStudent) => (
                  <span
                    style={{
                      backgroundColor: item.active ? '#E8F5E9' : '#FEF2F2',
                      color: item.active ? '#006400' : '#DC2626',
                      borderRadius: '12px',
                      padding: '3px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.active ? 'Publicado' : 'Oculto'}
                  </span>
                ),
              },
            ]}
            data={items}
            loading={loading}
            emptyMessage="No hay estudiantes cargados todavía."
            loadingMessage="Cargando estudiantes..."
            getItemKey={(item) => item.id}
            onEdit={openEdit}
            onDeleteRequest={setDeleteConfirmId}
            onDeleteConfirmed={handleDelete}
            onDeleteCancelled={() => setDeleteConfirmId(null)}
            deleteConfirmId={deleteConfirmId}
          />
        </div>
      </div>

      <AdminModal
        open={!!modalMode}
        title={modalMode === 'create' ? 'Agregar Estudiante' : 'Editar Estudiante'}
        onClose={closeModal}
        onSave={handleSave}
        saveLabel={modalMode === 'create' ? 'Crear' : 'Guardar Cambios'}
        cancelLabel="Cancelar"
        saving={saving}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1A1A1A',
                marginBottom: '6px',
              }}
            >
              Foto
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {fotoPrevia ? (
                <ResilientImage
                  src={fotoPrevia}
                  alt="Vista previa"
                  decoding="async"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: '50%',
                    backgroundColor: '#E8F5E9',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: '#E8F5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#006400',
                  }}
                >
                  {inicial(formData.full_name)}
                </div>
              )}
              <button
                type="button"
                onClick={pickPhoto}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #006400',
                  background: '#FFFFFF',
                  color: '#006400',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {fotoPrevia ? 'Cambiar foto' : 'Subir foto'}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_INPUT_ACCEPT}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1A1A1A',
                marginBottom: '6px',
              }}
            >
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              placeholder="Nombre y apellidos"
              style={{
                width: '100%',
                padding: '11px 12px',
                border: '1px solid rgba(0,0,0,0.14)',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '6px',
                }}
              >
                Puntaje
              </label>
              <input
                type="number"
                value={formData.score}
                onChange={(e) => updateField('score', e.target.value)}
                placeholder="0 a 500"
                min={0}
                max={500}
                step="0.1"
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid rgba(0,0,0,0.14)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '6px',
                }}
              >
                Grado
              </label>
              <select
                value={formData.grade}
                onChange={(e) => updateField('grade', e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid rgba(0,0,0,0.14)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                <option value="">Sin especificar</option>
                {ICFES_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              fontSize: '13px',
              color: '#1A1A1A',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => updateField('active', e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            Publicado en el sitio
          </label>
          <p style={{ margin: '-8px 0 0 25px', fontSize: '12px', color: '#6B7280' }}>
            Si lo desmarcas, el estudiante queda cargado pero no aparece. Sirve para publicar de a poco.
          </p>
        </div>
      </AdminModal>
    </div>
  )
}