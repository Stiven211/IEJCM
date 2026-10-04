# IEJCM

Sitio institucional del IEJCM para publicar información del centro, avisos, eventos, documentos, galería y canales de contacto.

## Requisitos

- Node.js
- npm

## Instalación

```bash
npm ci
Copy-Item .env.example .env
```

`npm ci` usa `install-strategy=shallow` según `.npmrc` del proyecto.

Configura en `.env` las variables siguientes, sin subir valores reales al repositorio:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Comandos

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

La migración SQL de `contact_messages` se ejecuta manualmente en el SQL Editor de Supabase.

No subas `.env`, claves `service_role`, tokens ni otras credenciales. La rama principal es `main`; cada Task debe trabajarse en una rama separada.
==================================================
IJCM — PROTECCIÓN Y AUDITORÍA DEL ESTADO ACTUAL
==================================================
Fecha: 2026-09-22
Rama actual: main
Commit: 374cde4 "chore: finalize npm migration"
Origin/main: 374cde4 "chore: finalize npm migration"
Working tree: MODIFICADO
Archivos modificados (13):
 1. package-lock.json
 2. src/app/App.tsx
 3. src/app/components/AdminDashboard.tsx
 4. src/app/components/Footer.tsx
 5. src/app/components/HomePage.tsx
 6. src/app/components/Navbar.tsx
 7. src/app/components/admin/AdminOverview.tsx
 8. src/app/components/home/HomeAbout.tsx
 9. src/app/components/home/HomeAnnouncements.tsx
10. src/app/components/home/HomeHero.tsx
11. src/app/components/ui/HeroSkeleton.tsx
12. src/services/schoolInfo.service.ts
13. src/styles/globals.css
Archivos nuevos (1):
1. public/jornoda-de-medio-ambiente.jpg
Archivos eliminados: Ninguno
==================================================
CAMBIOS LOCALES
==================================================
1. package-lock.json
Área: Configuración
Estado: Modificado masivo (17,098 líneas cambiadas)
Cambio detectado: Reemplazo completo de dependencias npm — el lockfile cambió de un árbol basado en @babel a uno basado en @emotion/uifragments. El package.json NO cambió.
Relación con TASK-007: POSTERIOR — el commit de HEAD "chore: finalize npm migration" generó este cambio
Relación con Admin: Indirecta (afeta build)
Riesgo: Alto — lockfile inconsistente con package.json puede causar problemas de instalación
2. src/app/App.tsx
Área: Frontend/Rutas
Estado: Modificado
Cambio detectado: Añadida nueva ruta /admin/events que renderiza AdminDashboard con prop eventsOnly={true}
Relación con TASK-007: POSTERIOR (no existía en fee2639)
Relación con Admin: DIRECTA — nueva ruta administrativa
Riesgo: Medio — nueva ruta sin documentación, potencial conflicto de navegación con /admin
3. src/app/components/AdminDashboard.tsx
Área: Admin
Estado: Modificado
Cambio detectado: Añadido prop eventsOnly?: boolean. Cuando eventsOnly=true: oculta AdminOverview, muestra estadísticas, búsqueda y tabla de eventos. Sidebar Eventos cambiado de /admin a /admin/events. Header cambia título dinámicamente.
Relación con TASK-007: POSTERIOR (fee2639 no tiene eventsOnly)
Relación con Admin: DIRECTA — lógica core del dashboard
Riesgo: Medio — cambios estructurales importantes
4. src/app/components/Footer.tsx
Área: Frontend/UI
Estado: Modificado
Cambio detectado: Eliminado link "Acceso Administrativo" del footer
Relación con TASK-007: POSTERIOR
Relación con Admin: Seguridad — oculta acceso admin de páginas públicas
Riesgo: Bajo
5. src/app/components/HomePage.tsx
Área: Frontend/UI
Estado: Modificado
Cambio detectado: aboutText cambiado de history || 'Fundado en 1978...' (texto hardcodeado) a simplemente history (sin fallback)
Relación con TASK-007: ESTABA en fee2639 (cambio de TASK-007) pero luego modificado en working tree — el working tree lo cambió de vuelta a sin-fallback
Relación con Admin: Indirecta
Riesgo: Bajo
6. src/app/components/Navbar.tsx
Área: Frontend/UI
Estado: Modificado
Cambio detectado: Eliminados botones "Acceso Admin" (desktop + mobile). Clases hidden md:flex → desktop-nav, md:hidden → mobile-nav-toggle/mobile-nav-panel. Eliminado display:flex inline del hamburger.
Relación con TASK-007: POSTERIOR (fee2639 no tiene estos cambios)
Relación con Admin: Seguridad + Responsive
Riesgo: Medio — depende de globals.css para responsive
7. src/app/components/admin/AdminOverview.tsx
Área: Admin
Estado: Modificado
Cambio detectado: Link "Eventos" cambiado de /admin a /admin/events
Relación con TASK-007: POSTERIOR
Relación con Admin: DIRECTA — navegación admin
Riesgo: Bajo
8. src/app/components/home/HomeAbout.tsx
Área: Frontend/UI
Estado: Modificado
Cambio detectado:
- Eliminados imports Users, TrendingUp
- Eliminados hardcodeos: "Modelo pedagógico constructivista...", "Comunidad educativa activa de más de 3,500 personas", "Reconocida por el MEN con ISCE sobresaliente", "Programa PRAE premiado a nivel regional"
- Aniversario dinámico: Math.max(0, new Date().getFullYear() - 1978) (antes hardcodeado 48°/2026)
- Imagen cambiada de Unsplash URL a 'public\\jornoda-de-medio-ambiente.jpg' (path local Windows)
- Fallback aboutText: "La información institucional estará disponible próximamente."
Relación con TASK-007: ESTABA en fee2639 (cambios de TASK-007), WORKING TREE tiene cambios adicionales (imagen local, aniversario dinámico)
Relación con Admin: Indirecta
Riesgo: ALTO — imagen con path Windows no funciona en browser
9. src/app/components/home/HomeAnnouncements.tsx
Área: Frontend/UI
Estado: Modificado
Cambio detectado: Eliminado if (announcements.length === 0) return null. Añadido estado vacío: "No hay avisos publicados en este momento."
Relación con TASK-007: WORKING TREE (post-TASK-007)
Relación con Admin: Indirecta
Riesgo: Bajo
10. src/app/components/home/HomeHero.tsx
Área: Frontend/UI
Estado: Modificado
Cambio detectado: Añadidos props title, subtitle, description a HeroSkeleton
Relación con TASK-007: WORKING TREE
Relación con Admin: Indirecta
Riesgo: Bajo
11. src/app/components/ui/HeroSkeleton.tsx
Área: Frontend/UI
Estado: Modificado
Cambio detectado: Reemplazados placeholder shimmer blocks (divs con animación) por texto real (h1, p) con efecto shimmer (color transparente + shimmer background). Añadidos props title, subtitle, description.
Relación con TASK-007: WORKING TREE
Relación con Admin: Indirecta
Riesgo: Bajo/Visual
12. src/services/schoolInfo.service.ts
Área: Servicios
Estado: Modificado
Cambio detectado: Añadido cache en sessionStorage (5 min TTL) para getSchoolInfo. Cache se limpia al hacer upsert.
Relación con TASK-007: WORKING TREE
Relación con Admin: Rendimiento
Riesgo: Bajo
13. src/styles/globals.css
Área: Estilos
Estado: Modificado
Cambio detectado: Añadidas 20 líneas de media queries para .desktop-nav, .mobile-nav-toggle, .mobile-nav-panel
Relación con TASK-007: WORKING TREE
Relación con Admin: Responsive
Riesgo: Bajo
Archivo sin trackear: public/jornoda-de-medio-ambiente.jpg
Nombre: jornoda-de-medio-ambiente.jpg
Ruta: public/jornoda-de-medio-ambiente.jpg
Tipo: Imagen JPEG
Tamaño: 208,326 bytes (~203 KB)
Estado: Existe. No trackeado por git. No debe ser commitado.
==================================================
COMPARACIÓN CON ORIGIN/MAIN
==================================================
Local: 374cde4
Remote: 374cde4
Ahead: 0
Behind: 0
Divergencia: NONE — main local está perfectamente alineado con origin/main
==================================================
COMPARACIÓN CON TASK-007
==================================================
Commit TASK-007: fee26395774c6c0c460ec4d4eadb3ab8c311add7
Nota: fee2639 NO es ancestro de HEAD. Están en ramas diferentes.
Cambios posteriores a TASK-007 (presentes en HEAD):
- App.tsx (ruta /admin/events)
- AdminDashboard.tsx (eventsOnly prop)
- Footer.tsx (sin Acceso Administrativo)
- Navbar.tsx (sin Acceso Admin, clases CSS responsive)
- AdminOverview.tsx (Eventos → /admin/events)
- HomeAbout.tsx (dinámico, imagen local)
- HomeAnnouncements.tsx (estado vacío)
- HomeHero.tsx (skeleton props)
- HeroSkeleton.tsx (texto shimmer)
- schoolInfo.service.ts (cache sessionStorage)
- globals.css (responsive nav)
- package-lock.json (npm migration)
Cambios en working tree NO commitados:
Misma lista que arriba (13 archivos) + 1 archivo nuevo
Archivos que existían en TASK-007 pero fueron eliminados en HEAD:
- TASK-006 — Accesibilidad y diseño responsive.md
- TASK-006-IMPLEMENTATION-REPORT.md
- TASK-007 — Contenido real y completitud del frontend.md
- TASK-007-IMPLEMENTATION-REPORT.md
==================================================
ADMIN
==================================================
Cambios relacionados con Admin:
1. AdminDashboard.tsx: Nuevo prop eventsOnly, sidebar Eventos → /admin/events
2. AdminOverview.tsx: Eventos link → /admin/events
3. Navbar.tsx: Eliminado Acceso Admin (público)
4. Footer.tsx: Eliminado Acceso Administrativo
5. App.tsx: Nueva ruta /admin/events
==================================================
UPLOADS
==================================================
Documentos:
Flujo actual (desde el código):
1. Usuario selecciona archivo en DocumentsAdminPage → handleFileChange (línea 114-134)
2. handleFileChange llama documentService.uploadDocument(file) → uploadToStorage('documents', file) → URL
3. URL + metadata se almacenan en formData (file_path, file_name, file_size, mime_type, file_extension)
4. Usuario clickea "Guardar" → handleSave (línea 156-211)
5. Para CREATE: llama documentService.createDocument(payload, { name: formData.file_name, type: formData.mime_type } as File)
6. createDocument (document.service.ts línea 88-116) llama uploadDocumentToStorage(STORAGE_BUCKET, file) → SEGUNDA SUBIDA
7. Luego inserta registro en DB con el path de la SEGUNDA subida
⚠️ PROBLEMA: El archivo se sube DOS VECES. La primera subida en handleFileChange genera una URL que NO se usa para el registro DB (se sobrescribe con la segunda subida). La segunda subida usa un objeto File reconstruido desde metadata (sin contenido binario real).
IMPORTANTE: NO CORREGIR.
Galería:
Flujo actual:
1. Selección de archivo en GalleryAdminPage → handleFileChange (línea 72-90)
2. handleFileChange llama galleryService.uploadGalleryImage(file) → uploadToStorage('gallery', file) → URL
3. URL en formData.image_url
4. Guardar → handleSave → galleryService.createGalleryItem(formData) → INSERT DB (no re-sube)
5. Eliminar → removeGalleryItem → DELETE DB (NO elimina de Storage)
⚠️ PROBLEMA: Eliminar registro de galería NO elimina el archivo de Storage → archivos huérfanos.
IMPORTANTE: NO CORREGIR.
Eventos:
Flujo actual:
1. Selección de imagen en AdminDashboard → handleFileChange (línea 121-135)
2. handleFileChange llama eventService.uploadEventImage(file) → uploadToStorage('events', file) → URL
3. URL en formData.image
4. Guardar → handleSave → eventService.createEvent/updateEvent (NO re-sube imagen, usa URL existente)
Flujo correcto: UPLOAD → URL → SAVE (sin duplicados)
IMPORTANTE: NO CORREGIR.
SchoolInfo:
Flujo actual:
1. Selección de archivo en SchoolInfoAdminPage → handleFileChange (línea 161-176)
2. handleFileChange llama schoolInfoService.uploadSchoolInfoMedia(file) → uploadToStorage('school-info', file) → URL
3. URL en formData.logo_url o hero_image_url según sección activa
4. Guardar → handleSave → schoolInfoService.upsertSchoolInfo(payload) → UPDATE DB (NO re-sube, usa URL)
Flujo correcto: UPLOAD → URL → SAVE (sin duplicados)
IMPORTANTE: NO CORREGIR.
Problemas detectados:
1. Documentos: doble subida a Storage al crear documento
2. Galería: no se elimina archivo de Storage al borrar registro
3. Eventos: funciona correctamente
4. SchoolInfo: funciona correctamente
IMPORTANTE: NO CORREGIR.
==================================================
QUALITY GATE
==================================================
Typecheck: PASS
Lint: PASS (0 errores)
Build: PASS (2m 29s, 1713 módulos)
Diff check: PASS (sin errores de whitespace)
==================================================
DEPENDENCIAS
==================================================
package.json: SIN CAMBIOS (sin diff)
package-lock.json: MASSIVE CHANGES (17,098 líneas modificadas, ~12K inserciones, ~5K eliminaciones). El árbol de dependencias cambió radicalmente. El commit "chore: finalize npm migration" en HEAD generó este cambio.
Vulnerabilidades/Outdated: NO VERIFICADO (npm outdated no retornó resultados en el tiempo disponible)
==================================================
CONFIGURACIÓN
==================================================
vite.config.ts: Sin cambios detectados
tsconfig.json: Sin cambios detectados
eslint.config.js: Sin cambios detectados
package.json: SIN CAMBIOS
package-lock.json: MASSIVE CHANGES (ver dependencias)
globals.css: MODIFICADO (añadidas 20 líneas de media queries responsive para nav)
.env: Existe en disco (git-ignored). Contiene VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. NO está trackeado por git.
.env.example: Trackeado, contiene placeholders vacíos.
==================================================
PROTECCIÓN
==================================================
Rama de respaldo creada: NO
Nombre: N/A
¿Se modificó código? NO (solo lectura)
¿Se hizo commit? NO
¿Se hizo push? NO
¿Se hizo merge? NO
¿Se modificó Supabase? NO
¿Se modificó Storage? NO
¿Se modificó Auth? NO
¿Se modificó SQL? NO
¿Se eliminaron cambios? NO
¿Se ejecutó git stash? NO
¿Se ejecutó git reset? NO
¿Se ejecutó git clean? NO
¿Se ejecutó git checkout --? NO
PROTECCIÓN: WORKING TREE CON CAMBIOS LOCALES — NO SE REALIZÓ OPERACIÓN DESTRUCTIVA
==================================================
CONCLUSIÓN
==================================================
Estado actual:
El repositorio está en main (374cde4) con 13 archivos modificados y 1 archivo nuevo sin trackear. El working tree tiene cambios locales que NO han sido commiteados. Main está sincronizado con origin/main (sin divergencia). El commit fee2639 (TASK-007) está en una rama diferente y NO es ancestro del HEAD actual — son líneas de desarrollo distintas.
Cambios que parecen ser del usuario:
 1. Navbar.tsx — eliminación de "Acceso Admin" + cambio a clases CSS responsive (seguridad + responsive)
 2. Footer.tsx — eliminación de "Acceso Administrativo" (seguridad)
 3. HomeAbout.tsx — imagen local 'public\\jornoda-de-medio-ambiente.jpg' + aniversario dinámico + eliminación hardcodeos
 4. HomeAnnouncements.tsx — estado vacío para avisos
 5. HomeHero.tsx + HeroSkeleton.tsx — sincronización de skeleton con contenido real
 6. App.tsx — nueva ruta /admin/events
 7. AdminDashboard.tsx — prop eventsOnly para separar vista de eventos
 8. AdminOverview.tsx — link Eventos → /admin/events
 9. schoolInfo.service.ts — cache sessionStorage
10. globals.css — responsive nav media queries
11. package-lock.json — npm migration
Cambios que parecen pertenecer a tareas anteriores:
1. HomePage.tsx — eliminación de fallback hardcodeado (TASK-007)
2. Todos los reportes TASK-006 y TASK-007 fueron eliminados del commit anterior (no forman parte del HEAD)
Problemas que requieren reparación posterior:
1. 🔴 HomeAbout.tsx:65 — Imagen con path Windows no funciona en browser
2. 🔴 DocumentsAdminPage — Doble subida de archivos al crear documentos
3. 🟠 GalleryAdminPage — Eliminación no limpia Storage (archivos huérfanos)
4. 🟠 Sidebar "Eventos" en 5 páginas admin apunta a /admin en vez de /admin/events
5. 🟠 AdminModal sin semántica de dialog (accesibilidad)
6. 🟡 Navbar depende de globals.css para responsive (clases CSS personalizadas)
7. 🟡 package-lock.json masivamente diferente — posible inconsistencia con package.json
Riesgos:
1. Imagen rota en HomeAbout (afecta UX pública)
2. Documentos duplicados en Storage por doble subida (costo almacenamiento + confusión)
3. Archivos huérfanos en Storage galería (crecimiento infinito de costos)
4. Navegación rota desde sub-pages admin (Eventos → /admin en vez de /admin/events)
5. Anon key publishable en .env podría causar problemas de autenticación en producción
SIGUIENTE PASO RECOMENDADO:
ESPERAR INSTRUCCIONES