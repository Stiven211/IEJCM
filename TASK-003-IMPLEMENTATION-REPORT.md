# TASK-003 — Informe de implementación

Fecha: 2026-08-22  
Rama: `stiven`

## 1. Archivos modificados

Cambios de TASK-003:

- `src/app/components/ui/ResilientImage.tsx`
- `src/utils/announcementDates.ts`
- `src/app/components/home/HomeHero.tsx`
- `src/app/components/HomePage.tsx`
- `src/app/components/AnnouncementsPage.tsx`
- `src/app/components/EventCard.tsx`
- `src/app/components/EventDetailPage.tsx`
- `src/app/components/GalleryPage.tsx`
- `src/app/components/home/HomeGallery.tsx`
- `src/app/components/home/HomeAbout.tsx`
- `src/app/components/Navbar.tsx`
- `src/app/components/Footer.tsx`
- `src/app/components/AdminDashboard.tsx`
- `src/app/components/admin/GalleryAdminPage.tsx`
- `src/app/components/admin/SchoolInfoAdminPage.tsx`
- `TASK-003-IMPLEMENTATION-REPORT.md`

El working tree ya contenía cambios previos de TASK-000, TASK-001 y TASK-002. No se revirtieron ni se atribuyeron a TASK-003.

## 2. Patrón de fallback y pantallas cubiertas

Se creó `ResilientImage`, que:

- conserva el contenedor y sus dimensiones mediante el `style` existente;
- muestra un bloque neutral institucional cuando `src` está ausente o falla;
- no reintenta la URL fallida;
- mantiene `loading="lazy"` y `decoding="async"` donde ya estaban presentes;
- usa `role="img"` y un nombre accesible para el fallback;
- no expone detalles técnicos ni añade URLs externas nuevas.

Se aplicó a:

- tarjetas y detalle de eventos;
- galería pública y galería del Home;
- imagen institucional de `HomeAbout`;
- hero principal;
- logos de Navbar y Footer;
- imágenes y previsualizaciones explícitamente incluidas del dashboard y administración de galería/información institucional.

El fallback mantiene altura en tarjetas, galería, hero, logos y previsualizaciones. Las imágenes públicas ya no se ocultan con `display:none` sin alternativa.

## 3. Comportamiento del hero

- Éxito de datos e imagen: muestra el hero normal tras resolver datos y cargar la imagen.
- URL ausente: `ResilientImage` muestra fondo neutral conservando el espacio; el texto del hero sigue visible.
- Error de imagen: la precarga marca fallo, el contenido deja de depender de una imagen exitosa y el componente muestra el fallback visual.
- Error de `school_info`: `Promise.allSettled` marca los datos del hero como resueltos; el hero no queda atrapado en `opacity: 0` y conserva únicamente los fallbacks de contenido ya existentes.
- El skeleton termina cuando los datos se resuelven y la imagen carga o falla. No se añadieron datos institucionales nuevos ni se cambiaron URLs de Storage.

## 4. Regla de fechas y zona horaria

Se creó `src/utils/announcementDates.ts` con la función `isAnnouncementCurrent`:

- usa `America/Bogota` para obtener el día actual;
- interpreta `YYYY-MM-DD` como fecha calendario, evitando desplazamientos UTC;
- convierte timestamps a su fecha calendario en Colombia;
- incluye los límites: `today >= start_date` y `today <= end_date`;
- permite ausencia de fecha inicial o final;
- excluye de forma segura fechas inválidas y rangos donde el final es anterior al inicio.

Home y `/avisos` utilizan la misma utilidad. No se modificó `announcement.service.ts`, SQL ni ningún dato remoto.

## 5. Comandos y resultados

| Comando | Resultado |
|---|---|
| `git status --short --branch` | PASS como inspección inicial. Rama `stiven...origin/stiven [ahead 5]`; el working tree contenía cambios previos y archivos no trackeados. |
| `git diff --stat` | PASS como inspección inicial. Detectó diferencias previas extensas, sin atribuirlas a TASK-003. |
| `npm run typecheck` inicial | PASS. Sin diagnósticos. |
| `npm run build` inicial | PASS. Vite transformó 1.706 módulos y compiló correctamente. |
| `npm run typecheck` después de integrar estados de imagen/fechas | PASS. |
| Comprobación local de fechas con `node --experimental-strip-types` | PASS. Verificó 7 casos: sin fechas, inicio hoy, fin hoy, futuro, vencido, fecha inválida y rango invertido. |
| `npm run typecheck` final | PASS. Sin diagnósticos. |
| `npm run lint` final | BLOCKED. `npm error Missing script: "lint"`; además no existe `node_modules/.bin/eslint`. No se instalaron dependencias ni se cambió ESLint. |
| `npm run build` final | PASS. Vite transformó 1.708 módulos y compiló correctamente en 1m 47s. |
| `git diff --check` | PASS. Sin errores de whitespace; solo advertencias LF/CRLF de Git en archivos preexistentes. |
| Diagnósticos del editor en archivos tocados | Advertencias/errores de JSX con tipos Lucide/@types React 19 en algunos archivos administrativos ya afectados por el estado previo; no reproducidos por `tsc` ni por build. No se amplió el alcance para corregirlos. |

## 6. Rutas revisadas

Revisión estática de:

- `/`
- `/avisos`
- `/eventos`
- `/eventos/:id`
- `/galeria`
- `/admin`, únicamente para verificar que sus imágenes y previsualizaciones usan el fallback sin alterar CRUD.

No había páginas del navegador compartidas en esta sesión, por lo que no se realizó una inspección visual interactiva. La comprobación de URL rota fue estática mediante el comportamiento de `ResilientImage` y la compilación; no se dejó simulación ni mock permanente.

## 7. Confirmación de alcance protegido

No se modificaron:

- Supabase, SQL, tablas, policies, buckets, Storage, Auth, RLS ni migraciones.
- `src/services/document.service.ts` ni la lógica funcional de S6-008: privacidad, signed URLs, expiración, categorías, búsqueda, descarga y CRUD permanecen iguales.
- Formulario de contacto ni `contact_messages`.
- El dashboard como interfaz o flujo CRUD, navegación móvil o accesibilidad general; solo se aplicó el fallback de imágenes permitido expresamente por esta Task.
- La configuración de ESLint ni dependencias.
- `main`.

La lógica de documentos solo fue inspeccionada; no se modificaron documentos ni su comportamiento.

## 8. Estado de Git y commits

- Rama actual: `stiven`.
- Git reporta `stiven...origin/stiven [ahead 5]`.
- El working tree contiene cambios previos y archivos no trackeados; no se revirtieron.
- No se hizo commit ni push.
- `main` no fue tocada ni seleccionada.

## 9. Quality Gate

| Criterio | Estado | Evidencia |
|---|---|---|
| Imagen rota conserva espacio y muestra fallback | PASS | `ResilientImage` mantiene estilos del contenedor y renderiza fallback ante error o URL ausente. |
| Hero visible ante error de imagen o datos | PASS | Se separaron `heroDataReady`, `imageLoaded` e `imageFailed`; la visibilidad no depende de éxito simultáneo. |
| Skeleton del hero termina | PASS | Se libera cuando datos e imagen están resueltos, incluyendo el caso de fallo de imagen. |
| Home y `/avisos` comparten regla de vigencia | PASS | Ambas filtran con `isAnnouncementCurrent`. |
| Límites inclusivos y Colombia | PASS | Utilidad pura validada con casos de inicio/fin en el día actual y zona `America/Bogota`. |
| Fechas inválidas/rango invertido | PASS | Se excluyen de forma segura; no se corrigen silenciosamente. |
| `npm run typecheck` | PASS | Código de salida 0. |
| `npm run lint` | BLOCKED | Script y binario ESLint ausentes desde el estado previo. |
| `npm run build` | PASS | Build final completado correctamente. |
| `git diff --check` | PASS | Sin errores de whitespace. |
| Sin cambios remotos ni S6-008 | PASS | No se ejecutó SQL ni se modificaron Supabase, Storage, Auth, RLS o documentos. |

## 10. Pendientes para TASK-004 y posteriores

- TASK-004: formulario de contacto persistente, servicio, tabla/RLS tras revisión manual del propietario, bandeja administrativa y estados de envío/error.
- Mantener para una tarea posterior cualquier mejora no incluida aquí: dashboard real, navegación móvil, accesibilidad general, QA visual automatizado y lint cuando se apruebe instalar/configurar sus dependencias.

No se inicia TASK-004 automáticamente.
