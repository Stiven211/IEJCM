# TASK-006 — Accesibilidad y diseño responsive

## 1. Resumen de cambios y archivos modificados

Se implementaron mejoras de accesibilidad y diseño responsive en 8 archivos del proyecto, sin modificar la lógica de datos, autenticación, permisos ni funcionalidades aprobadas.

**Archivos modificados:**
- `src/app/App.tsx` — LoadingFallback con `role="status"` y `aria-live`, AdminAccessDenied con jerarquía semántica mejorada
- `src/app/components/Navbar.tsx` — Menú móvil con gestión de foco, Escape, scroll lock y atributos ARIA
- `src/app/components/AdminDashboard.tsx` — Grids de formularios responsive, labels asociados con `htmlFor`/`id`
- `src/app/components/admin/AdminModal.tsx` — Modal accesible con focus trap, Escape, scroll lock y retorno de foco
- `src/app/components/admin/AdminDataTable.tsx` — Tabla accesible con `scope="col"`, nombres descriptivos, scroll accesible
- `src/app/components/admin/AdminHeader.tsx` — Header responsive con wrap en móvil
- `src/app/components/admin/AdminSidebar.tsx` — Focus trap en menú móvil, `role="dialog"`, foco inicial en botón cerrar
- `src/styles/globals.css` — Estilos `:focus-visible`, soporte responsive, `prefers-reduced-motion` conservado

## 2. Comportamiento de teclado y foco

- **Foco visible consistente**: Se añadió `:focus-visible` con outline verde institucional (#006400) y offset de 2px
- **Focus trap en modal**: El AdminModal ahora atrapa el foco dentro del panel, con navegación circular con Tab/Shift+Tab
- **Foco inicial**: Al abrir el modal, el foco se mueve al botón de cerrar; al abrir el menú móvil, al primer enlace/botón de cerrar
- **Retorno de foco**: Al cerrar modal o menú móvil, el foco regresa al elemento que lo abrió
- **Navegación por teclado**: Todos los controles interactivos son accesibles con Tab y activables con Enter/Space

## 3. Comportamiento del modal y del drawer

**AdminModal:**
- `role="dialog"` y `aria-modal="true"` en el overlay
- `aria-labelledby` conectado al título h2 mediante `useId()`
- Botón de cerrar con `aria-label="Cerrar ventana"` y referencia para foco inicial
- Cierre con Escape (deshabilitado durante guardado)
- Bloqueo del scroll del body mientras está abierto
- Retorno del foco al elemento que abrió el modal
- `aria-busy` en botón de guardar durante el proceso
- Protección contra doble envío (botones deshabilitados durante guardado)
- Overlay no cierra al hacer clic dentro del contenido del panel

**Navbar móvil:**
- `role="dialog"`, `aria-modal="true"`, `aria-label` descriptivo
- `aria-expanded` y `aria-controls` en el botón disparador
- Foco inicial en el primer enlace al abrir
- Cierre con Escape, al seleccionar enlace o al navegar
- Bloqueo del scroll del body restaurado al cerrar
- Foco regresa al botón disparador al cerrar

**AdminSidebar móvil:**
- Focus trap con Tab/Shift+Tab circular
- Foco inicial en el botón de cerrar al abrir
- `role="dialog"`, `aria-modal="true"` en el aside
- Cierre con Escape, backdrop o selección de enlace
- Bloqueo del scroll del body restaurado al cerrar

## 4. Cambios de tablas, formularios y responsive

**AdminDataTable:**
- `scope="col"` en todos los encabezados de columna
- Encabezado "Acciones" añadido para la columna de acciones
- Scroll horizontal con `role="region"`, `aria-label` descriptivo y `tabIndex={0}` para accesibilidad por teclado
- Nombres de editar/eliminar incluyen el elemento: `aria-label={`Editar ${itemName}`}`
- Confirmación de eliminación con `role="alert"` y `aria-live="assertive"`
- Iconos decorativos marcados con `aria-hidden="true"`

**Formularios (AdminDashboard):**
- Todos los inputs tienen labels asociados mediante `htmlFor`/`id`
- Grids de 3 y 2 columnas ahora usan `repeat(auto-fit, minmax(min(100%, 200px), 1fr))` para apilarse en móvil
- Select de categoría con `minHeight: 42px` para tamaño táctil razonable
- Input de búsqueda con contador de resultados con `aria-live="polite"`

**AdminHeader:**
- Padding responsive con `clamp()`
- Título y subtítulo con `text-overflow: ellipsis` para evitar desbordamiento
- Botones con `flexShrink: 0` para no comprimirse
- Botón "Ver sitio" con `aria-label` y texto visible en pantallas mayores

## 5. Rutas y tamaños revisados

**Revisión estática realizada** (QA visual pendiente por falta de navegador compartido).

El código fue revisado para asegurar funcionamiento en:
- 320 px — Móvil pequeño
- 375 px — Móvil estándar
- 768 px — Tablet
- 1024 px — Desktop pequeño
- 1440 px — Desktop grande

**Rutas públicas verificadas estáticamente:**
- `/`, `/nosotros`, `/contacto`, `/avisos`, `/eventos`, `/galeria`, `/documentos`

**Rutas administrativas verificadas estáticamente:**
- `/admin`, `/admin/gallery`, `/admin/announcements`, `/admin/documents`, `/admin/contact-messages`, `/admin/school-info`

## 6. QA visual realizado o limitaciones

**Limitaciones:** No se dispone de navegador compartido para QA visual. Se realizó revisión estática del código verificando:
- Atributos ARIA correctos
- Estructura semántica apropiada
- Media queries y responsive design
- No se inventaron resultados visuales

**Pendiente para TASK-007:**
- QA visual en navegador real a 320, 375, 768, 1024 y 1440 px
- Prueba de lector de pantalla con NVDA/VoiceOver
- Verificación de contraste de color automatizada

## 7. Resultados exactos de typecheck, lint, build y diff check

```
typecheck: PASS (tsc --noEmit, sin errores)
lint: PASS (0 errores, 5 warnings documentados)
build: PASS (vite build completado exitosamente)
git diff --check: PASS (sin errores de whitespace)
```

## 8. Warnings restantes

Los 5 warnings de `react-hooks/exhaustive-deps` preexistentes se conservan:

```
src/app/components/AdminDashboard.tsx:94:6
src/app/components/admin/AnnouncementAdminPage.tsx:65:6
src/app/components/admin/DocumentsAdminPage.tsx:88:6
src/app/components/admin/GalleryAdminPage.tsx:64:6
src/app/components/admin/SchoolInfoAdminPage.tsx:110:6
```

No se añadieron nuevos warnings.

## 9. Comprobación de secretos

```
git ls-files | Select-String -Pattern '(^|[\\/])\.env($|\.)|secret|credential|private-key'
```

Salida: `.env.example` (archivo template, no contiene secretos)

No se incluyeron archivos `.env`, tokens, claves, `node_modules`, `dist` ni logs.

## 10. Confirmación de límites

- No se modificaron Supabase, SQL, Storage, Auth, RLS, migraciones, políticas, buckets ni datos
- No se tocó `src/lib/database.sql`
- No se modificaron TASK-004, TASK-005, TASK-005B ni TASK-005C
- No se cambiaron servicios, tipos de dominio, consultas, rutas, callbacks ni permisos
- No se inició TASK-007
- No se modificó el formulario de contacto ni su persistencia
- No se cambió la lógica de eventos, galería, avisos, hero, imágenes o documentos
- No se instalaron dependencias nuevas ni se configuró ESLint
- No se usó `any`, `@ts-ignore`, `@ts-nocheck`, `eslint-disable` global ni `|| true`
- No se hizo deploy, force push ni fusión a `main`
- No se subieron `.env`, tokens, claves, `node_modules`, `dist` ni logs

## 11. Estado final de Git

```
Rama: feat/task-006-accessibility-responsive
Archivos modificados: 8 (dentro del límite de 20)
Cambios: 292 inserciones, 79 eliminaciones
```

## 12. Commit y push

```
Commit: feat: improve accessibility and responsive layout
Rama: feat/task-006-accessibility-responsive
Push: origin/feat/task-006-accessibility-responsive
```

## 13. Pendientes para TASK-007

- QA visual en navegador real a múltiples resoluciones
- Pruebas con lector de pantalla (NVDA, VoiceOver)
- Verificación de contraste de color automatizada
- Considerar añadir `aria-describedby` al modal cuando exista descripción real
- Evaluar skip links para navegación por teclado
- Considerar pruebas automatizadas de accesibilidad (axe-core, lighthouse)
