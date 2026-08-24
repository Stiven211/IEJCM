# TASK-000 — Auditoría de estabilización global del proyecto IEJCM

Fecha de auditoría: 2026-08-22  
Alcance: inspección local no destructiva. No se modificó código funcional, no se ejecutó SQL, no se cambiaron tablas, policies, buckets ni datos remotos.

## 1. Rama y working tree

- Rama activa: `stiven`, siguiendo `origin/stiven`, con `[ahead 5]`.
- `git status --short --branch`: mostró la cabecera `## stiven...origin/stiven [ahead 5]` y las rutas modificadas/no trackeadas del working tree.
- `git status --porcelain=v2`: muestra un working tree con cambios previos: 36 rutas modificadas/eliminadas y múltiples rutas no trackeadas, entre ellas `src/app/components/`, `src/services/`, `src/lib/` y `scripts/`.
- `git diff --stat`: 36 archivos con diferencias, 1.628 inserciones y 1.250 eliminaciones.
- La auditoría no atribuye esos cambios al trabajo de esta Task ni los revierte.

## 2. Comandos ejecutados y resultados

| Comando | Resultado |
|---|---|
| `git status --short --branch` | PASS. Rama `stiven`; la salida breve no listó rutas, aunque el formato v2 y `git diff --stat` sí evidencian cambios locales. |
| `git diff --stat` | PASS como comprobación. Detectó 36 archivos modificados/eliminados; no se modificó nada durante la auditoría. |
| `npm run build` | PASS. Vite 6.3.5 transformó 1.704 módulos y terminó con `built in 2m 41s`. |
| `npx tsc --noEmit` | PASS. Código de salida 0, sin diagnóstico. |
| `npm run typecheck` | NO DISPONIBLE. El script no existe en `package.json`. |
| `npm run lint` | NO DISPONIBLE. El script no existe en `package.json`. |
| Inspección de imports relativos | PASS en resolución de build. No se detectaron rutas relativas rotas en los módulos incluidos por Vite. |

No se ejecutaron migraciones ni consultas contra Supabase.

## 3. Matriz de hallazgos

| ID | severidad | archivo/línea | evidencia | impacto | recomendación | Task sugerida |
|---|---|---|---|---|---|---|
| H-001 | Alta | [src/app/components/HomePage.tsx](src/app/components/HomePage.tsx#L87) | Se invoca `logError(...)` en cinco ramas, pero el archivo no importa `logError`; el símbolo solo está definido en `src/lib/logger.ts`. | Si falla una carga del Home, el manejador puede lanzar `ReferenceError` y ocultar el diagnóstico/estado de error. El build y TypeScript actuales no lo detectan. | Importar y usar el logger con su contrato actual; añadir una prueba de rechazo de carga. | TASK-001 |
| H-002 | Alta | [src/app/components/home/HomeHero.tsx](src/app/components/home/HomeHero.tsx#L50), [src/app/components/HomePage.tsx](src/app/components/HomePage.tsx#L62) | El contenido del hero tiene `opacity: 0` hasta que `schoolInfo` e imagen lleguen; la precarga solo marca éxito en `onload` y no tiene `onerror`. | Un error de `school_info` o una imagen inaccesible puede dejar el hero invisible indefinidamente. | Separar estado de datos e imagen, definir fallback visible y estado de error/reintento. | TASK-003 |
| H-003 | Alta | [src/app/components/ContactPage.tsx](src/app/components/ContactPage.tsx#L13), [src/app/components/AboutPage.tsx](src/app/components/AboutPage.tsx#L10) | Las promesas de `getSchoolInfo()` no tienen `catch`; `ContactPage` y `AboutPage` solo liberan `loading` dentro de `then`. | Un error remoto deja la pantalla en skeleton indefinido y produce rechazo no manejado; el usuario no distingue error de carga. | Añadir estado de error, reintento y transición garantizada de carga. | TASK-002 |
| H-004 | Media | [src/services/announcement.service.ts](src/services/announcement.service.ts#L8), [src/app/components/AnnouncementsPage.tsx](src/app/components/AnnouncementsPage.tsx#L13) | `getAllAnnouncements()` filtra solo `active=true`; la página vuelve a filtrar `active`, pero no aplica `start_date` ni `end_date`. Home también limita por activo sin vigencia temporal. | Avisos activos pero vencidos, o aún no iniciados, pueden publicarse. | Centralizar la regla de vigencia en el servicio o una función común y cubrir límites de fecha. | TASK-003 |
| H-005 | Media | [src/app/components/AnnouncementsPage.tsx](src/app/components/AnnouncementsPage.tsx#L6), [src/app/components/GalleryPage.tsx](src/app/components/GalleryPage.tsx#L6), [src/app/components/EventsPage.tsx](src/app/components/EventsPage.tsx#L16), [src/app/components/DocumentsPage.tsx](src/app/components/DocumentsPage.tsx#L28) | Estas pantallas registran el error en `catch`, pero conservan una lista vacía y muestran el mismo estado que cuando no hay datos. Documentos además usa texto de carga simple en vez de su skeleton específico. | Se comunica “sin contenido” cuando en realidad hay una falla de red/Supabase; no hay reintento ni diagnóstico para el usuario. | Mantener estados independientes `loading`, `error`, `empty` y `success`, con acción de reintento. | TASK-002 |
| H-006 | Media | [src/app/components/GalleryPage.tsx](src/app/components/GalleryPage.tsx#L42), [src/app/components/EventDetailPage.tsx](src/app/components/EventDetailPage.tsx#L75), [src/app/components/AdminDashboard.tsx](src/app/components/AdminDashboard.tsx#L220) | Las imágenes se ocultan con `display:none` al fallar; el detalle no tiene `onError` y su imagen mantiene opacidad 0 si nunca carga. | Quedan huecos o hero de detalle sin imagen ni alternativa contextual. | Crear un fallback visual y registrar estado de imagen fallida sin colapsar el layout. | TASK-003 |
| H-007 | Media | [src/app/components/admin/AdminSidebar.tsx](src/app/components/admin/AdminSidebar.tsx#L26) | El sidebar tiene `hidden md:flex`, sin navegación alternativa móvil en el componente. | En viewport menor a `md`, las rutas administrativas y cierre de sesión no son accesibles desde el panel. | Añadir navegación móvil con control de apertura/cierre y foco gestionado. | TASK-005 |
| H-008 | Media | [src/app/components/admin/AdminModal.tsx](src/app/components/admin/AdminModal.tsx#L25) | El modal es un `div` visual sin `role="dialog"`, `aria-modal`, asociación de título, cierre con Escape ni gestión de foco; el botón X no tiene nombre accesible. | Teclado y lectores de pantalla no reciben el comportamiento esperado de un diálogo. | Adoptar el componente Dialog existente o completar semántica, foco y cierre. | TASK-006 |
| H-009 | Baja | [src/app/components/AdminDashboard.tsx](src/app/components/AdminDashboard.tsx#L193) | El encabezado es `Panel de Eventos`; las estadísticas, búsqueda, tabla y modal gestionan eventos. El resto de recursos son rutas separadas del sidebar. | `/admin` es principalmente CRUD de eventos, no un dashboard global con resumen de contenido y actividad. | Definir el alcance del dashboard antes de rediseñarlo; no cambiarlo en esta auditoría. | TASK-005 |
| H-010 | Baja | [src/lib/database.sql](src/lib/database.sql#L503) | La protección de singleton de `school_info` está comentada y el servicio toma la primera fila con `.limit(1).maybeSingle()`. | Filas duplicadas pueden generar contenido no determinista; el código no garantiza por sí solo una única fila ante concurrencia. | Verificar cantidad de filas en SQL Editor y decidir una restricción/limpieza con el propietario. | TASK-007 |
| H-011 | Baja | [src/app/components/home/HomeContact.tsx](src/app/components/home/HomeContact.tsx#L111), [src/app/components/ContactPage.tsx](src/app/components/ContactPage.tsx#L28) | El submit solo ejecuta `setSent(true)`, limpia el formulario y muestra confirmación durante 4,5 s. No llama ningún servicio ni persiste datos. | El visitante recibe “Mensaje enviado” aunque no se haya guardado ni transmitido nada. | Diseñar después el flujo completo: servicio, tabla, RLS, bandeja administrativa, validación, estados de éxito/error y antiabuso. | TASK-004 |
| H-012 | Baja | [src/app/components/home/HomeContact.tsx](src/app/components/home/HomeContact.tsx#L67) | Los enlaces sociales se renderizan como texto e iconos informativos; el mapa usa una URL fija y la dirección tiene fallback de prueba. | Puede haber contenido institucional desactualizado o enlaces no accionables; requiere datos oficiales, no corrección inferida. | Confirmar con el propietario dirección, teléfono, correo, redes, mapa, años y textos antes de editar. | TASK-007 |

### Notas sobre tipado, imports y calidad

- No se encontraron `any`, `@ts-ignore` ni `@ts-nocheck` en el alcance revisado.
- La compilación y TypeScript pasan, pero eso no cubre referencias no ejecutadas como H-001 ni estados asíncronos.
- `eslint.config.js` existe, pero no están instaladas/definidas las condiciones de un script `lint` en `package.json`; no se añadió ninguno.
- Los contratos de `src/app/types.ts` y los servicios de eventos, galería, avisos, información institucional y documentos son compatibles con las formas de datos usadas por las páginas según el build actual.

## 4. Regresión de S6-008

| Punto | Estado | Evidencia local / verificación pendiente |
|---|---|---|
| Ruta pública `/documentos` | PASS | [src/app/App.tsx](src/app/App.tsx#L112) registra la ruta y renderiza `DocumentsPage`. |
| Rutas administrativas de documentos | PASS | [src/app/App.tsx](src/app/App.tsx#L155) registra `/admin/documents` protegido por `ProtectedAdminRoute`. |
| Servicio y tabla `documents` | PASS | [src/services/document.service.ts](src/services/document.service.ts#L10) usa la tabla `documents`; [src/lib/database.sql](src/lib/database.sql#L323) contiene el esquema local alineado con `Document`. |
| Signed URLs para documentos | PASS | [src/services/document.service.ts](src/services/document.service.ts#L76) valida visibilidad/vencimiento y [src/lib/storage.ts](src/lib/storage.ts#L161) llama `createSignedUrl` por 3.600 segundos. |
| Bucket privado, RLS, policies y datos remotos | NO VERIFICABLE | No se ejecutó SQL ni se accedió a Supabase. **PENDIENTE DE VERIFICACIÓN MANUAL DEL PROPIETARIO EN SQL EDITOR**. Verificar que `storage.buckets.id='documents'` tenga `public=false`; policies de `public.documents` limiten lectura a `is_public=true` y no vencido; policies de `storage.objects` relacionen `file_path`, bucket y rol administrador; y que no existan policies más permisivas. |
| Regresión observable en build | PASS | `npm run build` y `npx tsc --noEmit` terminan correctamente; no se modificó S6-008. |

No se cambió `documents`, su SQL, Storage ni sus policies.

## 5. Funcionalidades

### Terminadas según código local

- Enrutamiento público principal y rutas administrativas protegidas.
- CRUD local de eventos, galería, avisos e información institucional mediante servicios Supabase.
- Flujo local de documentos públicos/administrativos con validación de archivos y signed URLs.
- Estados de carga visuales para varias páginas y skeletons específicos existentes: About, avisos, contacto, detalle de evento, eventos, galería y hero.
- Build de producción y chequeo TypeScript actuales.

### Parciales

- Home: carga paralela y aviso agregado de errores, pero con H-001 y hero potencialmente invisible.
- Avisos: filtro `active`, sin vigencia por fechas.
- Carga/error/vacío: skeletons presentes en varias pantallas, pero errores se presentan como listas vacías.
- Imágenes: `alt` existe en varios casos, pero fallbacks inconsistentes.
- Administración: CRUD por recurso operativo, pero `/admin` no es dashboard global y la navegación móvil falta.
- Contacto: validación HTML y confirmación local, sin persistencia ni envío.

### Pendientes

- Corrección de TypeScript/imports y scripts de calidad, según validación futura.
- Estados de error, reintentos y skeletons homogéneos.
- Fallbacks de imágenes, hero y vigencia de avisos.
- Formulario de contacto con revisión manual de SQL por el propietario.
- Dashboard administrativo real y navegación móvil.
- Accesibilidad y responsive integral.
- Limpieza editorial y QA con datos oficiales.

Ninguna Task posterior se marca como implementada.

## 6. Fases y Tasks propuestas

1. **TASK-001 — Errores de tipos, imports y calidad:** resolver H-001, confirmar imports y decidir scripts `typecheck`/`lint` sin ocultar diagnósticos.
2. **TASK-002 — Estados de carga, error, reintento y skeletons:** resolver H-003 y H-005, extendiendo la cobertura solo donde se apruebe.
3. **TASK-003 — Imágenes, hero y avisos por fechas:** resolver H-002, H-004 y H-006 con fallbacks y reglas de vigencia.
4. **TASK-004 — Formulario de contacto:** diseñar servicio, tabla, RLS, bandeja administrativa, validación y estados de error; ejecutar SQL solo tras revisión manual del propietario.
5. **TASK-005 — Dashboard administrativo y navegación móvil:** resolver H-007 y H-009 sin rehacer la interfaz hasta definir alcance.
6. **TASK-006 — Accesibilidad y responsive:** resolver H-008 y revisar controles, foco, nombres y viewport móvil.
7. **TASK-007 — Editorial, centralización y QA final:** resolver H-010, H-012 y validar contenido oficial, duplicados y regresiones.

## 7. Archivos que no deben tocarse en esta auditoría

- `main` ni ninguna referencia remota de Git.
- `src/lib/database.sql`, especialmente esquema, policies y Storage de `documents`/S6-008.
- `src/services/document.service.ts` y `src/lib/storage.ts` para cambios funcionales de documentos.
- Tablas, policies, buckets, objetos y datos de Supabase.
- Formulario de contacto, backend o migraciones de `contact_messages`.
- Skeletons, dashboard, accesibilidad y mejoras responsive como implementación.
- `package.json` para agregar scripts, lockfiles y configuraciones, salvo inspección.

El archivo de esta auditoría es la única entrega nueva de la Task.

## 8. Dudas para decisión del propietario

- ¿Cuál es la fuente oficial de dirección, teléfono, correo, redes sociales, mapa, años institucionales, hero, inscripción y textos editoriales?
- ¿La vigencia de avisos debe aplicar a Home y `/avisos` usando zona horaria de Colombia?
- ¿Debe `/admin` resumir eventos, galería, avisos, documentos e información institucional, o seguirá siendo la entrada de eventos?
- ¿Qué roles administrativos existirán además de `admin`?
- Para contacto: ¿qué correo/bandeja procesará mensajes, cuánto tiempo se retendrán, qué campos son obligatorios y qué protección anti-spam se requiere?
- ¿Puede el propietario verificar en SQL Editor el bucket/policies/datos de `documents` y confirmar: **PENDIENTE DE VERIFICACIÓN MANUAL DEL PROPIETARIO EN SQL EDITOR**?
- ¿Se autoriza una futura decisión de unicidad para `school_info` si SQL Editor evidencia más de una fila?

## 9. Veredicto final

# APROBADA COMO AUDITORÍA

La auditoría cumple el alcance: verificó el código actual, ejecutó únicamente comprobaciones locales no destructivas, no implementó correcciones, no ejecutó migraciones ni cambió Supabase. El proyecto compila y pasa TypeScript, pero conserva los hallazgos y pendientes documentados; no se declara terminado.
