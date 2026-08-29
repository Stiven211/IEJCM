# TASK-006 — Accesibilidad y diseño responsive

El estado aprobado actual está publicado en `main` en el commit `374cde4`. TASK-004, TASK-005, TASK-005B y TASK-005C están integradas y verificadas. El proyecto usa npm como gestor oficial, `package-lock.json` como único lockfile y `.npmrc` con `install-strategy=shallow`.

Crea una rama nueva desde `main` llamada `feat/task-006-accessibility-responsive`. No trabajes directamente sobre `main` ni sobre `chore/reproducibility-005b`.

## Objetivo

Mejorar la accesibilidad y la experiencia responsive del sitio público y del panel administrativo, con especial atención a móviles de 320–375 px, sin cambiar la lógica de datos, autenticación, permisos ni las funcionalidades ya aprobadas.

La Task debe centrarse en componentes compartidos y cambios pequeños, verificables y reversibles. No hagas una reescritura visual completa.

## Estado inicial

Antes de editar, ejecuta:

```powershell
git fetch origin --prune
git switch main
git pull --ff-only origin main
git switch -c feat/task-006-accessibility-responsive
git status --short --branch
npm ci
npm run typecheck
npm run lint
npm run build
```

El lint puede conservar únicamente los cinco warnings existentes de `react-hooks/exhaustive-deps`, pero no deben aparecer nuevos errores. Si el estado inicial no pasa, detente y reporta `BLOCKED` sin modificar el código.

## Hotspots conocidos

La auditoría de `main` encontró estos puntos concretos:

- `src/app/components/admin/AdminModal.tsx`: panel visual sin `role="dialog"`, `aria-modal`, asociación de título, Escape, gestión de foco ni scroll lock.
- `src/app/components/admin/AdminDataTable.tsx`: tabla con `minWidth: 620px`, scroll horizontal sin nombre accesible, encabezados sin `scope="col"`, columna de acciones sin encabezado y confirmación de eliminación embebida.
- `src/app/App.tsx`: `LoadingFallback` sin `role="status"`/`aria-live` y estado de acceso denegado que depende demasiado del emoji.
- `src/app/components/Navbar.tsx` y `src/app/components/admin/AdminSidebar.tsx`: menús móviles existentes que necesitan comprobación real de foco, Escape, backdrop, scroll y tamaños.
- `src/app/components/admin/AdminHeader.tsx` y `AdminDashboard.tsx`: acciones, búsqueda y grids de formularios que deben envolver correctamente en pantallas pequeñas.
- `src/styles/globals.css`: ya existe soporte para `prefers-reduced-motion`; debe conservarse.

## Alcance A — modal administrativo

Revisa `src/app/components/admin/AdminModal.tsx`, compartido por los formularios administrativos.

Añade únicamente la semántica y el comportamiento de accesibilidad necesarios:

- `role="dialog"` y `aria-modal="true"` en el panel correcto;
- `aria-labelledby` conectado al `h2` mediante un id estable;
- `aria-describedby` solo si existe una descripción real;
- nombre accesible para el botón de cerrar;
- cierre con Escape;
- foco inicial dentro del modal;
- retorno del foco al elemento que abrió el modal;
- bloqueo y restauración del scroll del `body` mientras está abierto;
- estado accesible durante el guardado y protección contra doble envío;
- cuerpo desplazable y footer utilizable en pantallas pequeñas;
- overlay que no cierre accidentalmente al pulsar dentro del contenido.

No cambies la firma pública del componente salvo que sea estrictamente necesario. No cambies campos, validaciones, servicios, CRUD ni subida de imágenes.

No añadas dependencias. Si un focus trap completo exige una librería, usa una solución pequeña con los elementos focusables presentes o documenta la limitación.

## Alcance B — navegación pública y administrativa

Revisa `src/app/components/Navbar.tsx` y `src/app/components/admin/AdminSidebar.tsx`.

- Conserva las rutas, labels, permisos, usuario y logout.
- Mantén `aria-expanded`, `aria-controls`, `aria-current` y nombres accesibles.
- El foco debe entrar de forma razonable al menú móvil y volver al disparador al cerrar.
- Escape, backdrop y selección de enlace deben cerrar el menú.
- El scroll del `body` debe restaurarse incluso si el componente se desmonta.
- La navegación debe funcionar con teclado y tacto a 320 px, 375 px, 768 px y desktop.
- No dupliques entradas ni alteres la ruta de Mensajes.
- El contenido de fondo no debe quedar interactivo mientras el drawer está abierto.

## Alcance C — tablas y acciones

Revisa `src/app/components/admin/AdminDataTable.tsx`.

- Añade `scope="col"` a los encabezados.
- Añade un encabezado accesible para la columna de acciones.
- Conserva la tabla y sus datos, pero haz explícito el scroll horizontal y ponle un nombre accesible.
- Evita que el scroll horizontal se traslade a toda la página.
- Mejora los nombres de editar y eliminar para incluir el elemento cuando sea posible, sin perder `title`.
- Haz que la confirmación de eliminación sea clara y utilizable con teclado, con foco razonable en sus botones.
- No modifiques callbacks, ids, servicios ni el comportamiento de eliminación.
- No reescribas toda la tabla en tarjetas si eso aumenta el alcance; prioriza el componente compartido.

## Alcance D — estados globales y foco

Revisa `src/app/App.tsx` y `src/styles/globals.css`.

- `LoadingFallback` debe anunciarse mediante `role="status"` o equivalente con `aria-live`.
- El estado de acceso denegado debe tener jerarquía semántica y no depender únicamente del emoji.
- Añade un foco visible consistente mediante `:focus-visible`, respetando la paleta institucional.
- Conserva el soporte existente de `prefers-reduced-motion`.
- No reduzcas el contraste de textos, botones, enlaces ni estados de error.
- No agregues tema oscuro ni cambies la paleta completa.

## Alcance E — encabezado, búsqueda y formularios responsive

Revisa `AdminHeader.tsx`, `AdminDashboard.tsx` y los estilos globales únicamente donde sea necesario.

- El encabezado debe envolver título, subtítulo y acciones en móvil.
- Los botones no deben desbordar horizontalmente.
- La fila de búsqueda y el contador deben envolver o apilarse en pantallas estrechas.
- Los grids de formularios de tres y dos columnas deben apilarse en móvil sin cortar inputs, labels ni botones.
- Los inputs, selects y textareas deben conservar labels asociados y tamaños táctiles razonables.
- Los botones iconográficos deben tener nombres accesibles.
- No cambies textos, modelos, validaciones de negocio ni servicios.

Puedes añadir clases semánticas pequeñas y media queries en `src/styles/globals.css`. No dupliques CSS ni cambies el diseño institucional completo.

## Alcance F — revisión de formularios y controles

Corrige solo asociaciones obvias en los componentes tocados:

- cada input visible debe tener label asociado mediante `htmlFor`/`id` o equivalente;
- los botones solo con icono deben tener `aria-label`;
- los errores deben estar asociados al control o anunciados con `role="alert"`;
- los estados de carga deben conservar `aria-busy` y evitar acciones duplicadas;
- los enlaces deben tener nombres comprensibles fuera de contexto;
- el orden de encabezados no debe saltarse sin motivo;
- no elimines el foco visible mediante `outline: none` sin alternativa.

## Límites estrictos

1. No modificar Supabase, SQL, Storage, Auth, RLS, migraciones, políticas, buckets ni datos.
2. No tocar `src/lib/database.sql`.
3. No modificar TASK-004, TASK-005, TASK-005B ni TASK-005C.
4. No cambiar servicios, tipos de dominio, consultas, rutas, callbacks ni permisos.
5. No iniciar TASK-007.
6. No modificar el formulario de contacto ni su persistencia.
7. No cambiar la lógica de eventos, galería, avisos, hero, imágenes o documentos.
8. No instalar dependencias nuevas ni configurar ESLint.
9. No usar `any`, `@ts-ignore`, `@ts-nocheck`, `eslint-disable` global ni `|| true`.
10. No hacer deploy, force push ni fusionar a `main` en esta Task.
11. No subir `.env`, tokens, claves, `node_modules`, `dist` ni logs.
12. No corregir problemas de contenido o negocio encontrados incidentalmente; documéntalos como pendientes.

## QA manual o estático

Si tienes navegador disponible, revisa en 320 px, 375 px, 768 px, 1024 px y 1440 px:

- `/`, `/nosotros`, `/contacto`, `/avisos`, `/eventos`, `/galeria` y `/documentos`;
- `/admin`, `/admin/gallery`, `/admin/announcements`, `/admin/documents`, `/admin/contact-messages` y `/admin/school-info`;
- navegación por teclado y foco visible;
- apertura/cierre del drawer con botón, Escape, backdrop y enlace;
- apertura/cierre del modal, foco inicial, retorno de foco y scroll;
- tablas sin desbordamiento horizontal de toda la página;
- grids, botones y formularios sin recorte;
- rutas protegidas sin exponer enlaces administrativos públicamente;
- `prefers-reduced-motion` si el navegador lo permite.

Si no hay navegador compartido, realiza revisión estática, ejecuta las pruebas disponibles y declara claramente que el QA visual queda pendiente. No inventes resultados visuales.

## Quality Gate

Después de implementar:

```powershell
npm run typecheck
npm run lint
npm run build
git diff --check

git ls-files | Select-String -Pattern '(^|[\\/])\.env($|\.)|secret|credential|private-key'
git status --short --branch
git diff --stat
```

El resultado requerido es:

- `typecheck`: PASS;
- `lint`: 0 errores; pueden permanecer solo los cinco warnings previos documentados;
- `build`: PASS;
- `git diff --check`: PASS, sin nuevos errores;
- secretos: salida vacía;
- ningún archivo de Supabase, SQL, `node_modules` o `dist` incluido;
- máximo 20 archivos modificados;
- cambios limitados a accesibilidad, foco y responsive.

Si aparecen errores nuevos, regresiones de rutas, cambios de lógica, problemas de Auth/Supabase o más de 20 archivos modificados, detente como `BLOCKED` y no publiques.

## Informe obligatorio

Crea `TASK-006-IMPLEMENTATION-REPORT.md` con:

1. resumen de cambios y archivos modificados;
2. comportamiento de teclado y foco;
3. comportamiento del modal y del drawer;
4. cambios de tablas, formularios y responsive;
5. rutas y tamaños revisados;
6. QA visual realizado o limitaciones;
7. resultados exactos de typecheck, lint, build y diff check;
8. warnings restantes;
9. comprobación de secretos;
10. confirmación de que no se modificaron Supabase, SQL, Storage, Auth, RLS, documentos S6-008, contacto, datos públicos ni `main`;
11. estado final de Git;
12. commit y push;
13. pendientes para TASK-007.

## Commit y push obligatorios

Solo si todo el Quality Gate pasa y el diff está dentro del alcance:

```powershell
git add src/app/App.tsx src/app/components/Navbar.tsx src/app/components/admin/AdminSidebar.tsx src/app/components/admin/AdminModal.tsx src/app/components/admin/AdminDataTable.tsx src/app/components/admin/AdminHeader.tsx src/app/components/AdminDashboard.tsx src/styles/globals.css TASK-006-IMPLEMENTATION-REPORT.md
# Añade únicamente otros archivos que hayan recibido cambios de accesibilidad/responsive y estén documentados.
git diff --cached --check
git commit -m "feat: improve accessibility and responsive layout"
git push -u origin feat/task-006-accessibility-responsive
```

Después verifica:

```powershell
git status --short --branch
git log --oneline --decorate -4
git ls-remote --heads origin feat/task-006-accessibility-responsive
```

Si una validación falla, no hagas commit ni push. Si el commit y push pasan, detente y entrega `TASK-006-IMPLEMENTATION-REPORT.md`; no fusiones la rama a `main` ni inicies otra Task automáticamente.
