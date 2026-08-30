# TASK-007 — Contenido real y completitud del frontend

## CONTEXTO DEL PROYECTO

Estamos trabajando exclusivamente en el proyecto **IEJCM**.

TASK-006 ya fue implementada, verificada y publicada correctamente:

- Rama: `feat/task-006-accessibility-responsive`
- Commit: `a6d1c241c3d697fdcb116553d3e641268b67b5ea`
- Push: PASS
- Working tree: CLEAN
- `main`: protegida
- Sin merge a `main`

Ahora comenzamos exclusivamente **TASK-007 — Contenido real y completitud del frontend**.

NO empieces TASK-008.

La TASK-008 futura será una **mejora visual y UX integral de todo el frontend**, por lo que TASK-007 debe concentrarse en contenido, completitud, consistencia funcional y correcta representación de los datos existentes, sin convertir esta task en un rediseño visual.

---

# 1. OBJETIVO

El objetivo de TASK-007 es revisar y completar el contenido real utilizado por el frontend de IEJCM para que las páginas públicas y administrativas dejen de depender de contenido provisional, placeholders, textos incompletos o datos simulados cuando ya exista información real disponible dentro del proyecto.

Debemos conseguir que:

1. Las páginas públicas tengan contenido coherente y completo.
2. Los componentes representen correctamente los datos disponibles.
3. No existan placeholders innecesarios.
4. No existan textos de prueba o contenido claramente temporal.
5. Los estados vacíos sean intencionales y comprensibles.
6. Las imágenes, avisos, eventos, documentos y demás contenidos utilicen correctamente las fuentes de datos existentes.
7. Los skeletons y estados de carga sigan funcionando correctamente con el contenido real.
8. No se rompa ninguna funcionalidad existente.
9. No se modifique infraestructura fuera del alcance de esta task.
10. El frontend quede preparado para la futura TASK-008 de mejora visual integral.

---

# 2. REGLA PRINCIPAL

**TASK-007 NO ES UN REDISEÑO.**

No conviertas esta task en:

- cambio completo de colores
- rediseño de tarjetas
- rediseño de navbar
- rediseño de footer
- cambio global de tipografía
- animaciones nuevas
- cambios arbitrarios de spacing
- cambios de layout por preferencia estética
- rediseño de dashboard
- creación de un nuevo sistema visual

Eso pertenece a:

**TASK-008 — Frontend Visual & UX Integral**

Si durante la implementación encuentras problemas visuales, inconsistencias estéticas o componentes que podrían mejorar, **documenta el hallazgo**, pero no hagas ese rediseño dentro de TASK-007 salvo que sea necesario para que el contenido funcione correctamente.

---

# 3. PRIMER PASO OBLIGATORIO: AUDITORÍA

Antes de modificar código debes analizar el estado real del repositorio.

Ejecuta:

```powershell
git status --short --branch
git branch -vv
git log --oneline --decorate -10
```

Después revisa la estructura del proyecto y determina:

- páginas públicas existentes
- páginas administrativas existentes
- componentes relacionados con contenido
- servicios
- tipos
- fuentes de datos
- contenido estático
- datos provisionales
- placeholders
- imágenes
- documentos
- avisos
- eventos
- galería
- información institucional
- formularios
- estados vacíos
- skeletons relacionados con estas páginas

NO asumas que el documento maestro refleja exactamente el estado actual del código.

El código actual del repositorio es la fuente de verdad para la implementación.

---

# 4. CREAR RAMA DE TASK-007

Trabaja en una rama independiente:

```text
feat/task-007-real-content
```

NO trabajes directamente sobre `main`.

NO hagas merge a `main`.

NO hagas force push.

---

# 5. ÁREAS A REVISAR

Audita como mínimo las siguientes rutas públicas:

```text
/
/nosotros
/contacto
/avisos
/eventos
/galeria
/documentos
```

Y las áreas administrativas relacionadas con la gestión del contenido:

```text
/admin
/admin/gallery
/admin/announcements
/admin/documents
/admin/contact-messages
/admin/school-info
```

Si alguna ruta no existe actualmente, no la inventes.

Documenta su ausencia.

---

# 6. CONTENIDO PÚBLICO

Revisa especialmente:

## HOME

Comprobar:

- hero
- información institucional
- avisos destacados
- eventos destacados
- galería
- documentos
- enlaces
- textos institucionales
- imágenes
- estados de carga
- estados vacíos

No inventes información institucional que no exista en las fuentes autorizadas.

Si falta información real, utiliza un estado vacío o fallback apropiado en lugar de inventar datos.

---

## NOSOTROS

Revisar:

- nombre de la institución
- descripción
- misión
- visión
- información institucional
- imágenes
- textos
- secciones existentes

No inventar información institucional.

Si el repositorio no contiene información suficiente, documentarlo.

---

## AVISOS

Comprobar:

- listado
- títulos
- contenido
- fechas
- imágenes si corresponden
- estados vacíos
- loading
- error
- datos reales

No dejar contenido claramente ficticio o de prueba si existe una fuente real disponible.

---

## EVENTOS

Comprobar:

- título
- descripción
- fecha
- hora
- ubicación
- imagen
- eventos próximos
- estados vacíos
- loading
- error

Verificar que las fechas se representen correctamente.

No alterar la lógica de negocio existente salvo que sea estrictamente necesario para mostrar correctamente el contenido.

---

## GALERÍA

Comprobar:

- imágenes reales
- títulos
- descripciones
- categorías si existen
- alt text
- loading
- estados vacíos
- errores de imagen
- visualización correcta del contenido existente

No sustituir imágenes reales por imágenes aleatorias.

No añadir imágenes externas sin una razón explícita y sin documentarlo.

---

## DOCUMENTOS

Comprobar:

- documentos disponibles
- títulos
- categorías
- fechas
- enlaces
- descarga/apertura
- estados vacíos
- loading
- errores

Verificar que no existan enlaces muertos o placeholders evidentes.

No modificar Storage ni configuración de Supabase para resolver problemas que estén fuera del alcance.

---

## CONTACTO

Revisar únicamente la **representación frontend del contenido existente**.

No cambiar:

- persistencia
- Supabase
- tablas
- políticas
- RLS
- servicios
- lógica de envío

Si existe información institucional de contacto ya disponible, comprobar que se muestre correctamente.

---

# 7. DATOS Y FUENTES

Antes de reemplazar cualquier contenido, identifica de dónde proviene.

Prioridad:

1. Datos reales existentes en el proyecto.
2. Datos existentes en las fuentes de datos ya configuradas.
3. Contenido institucional explícitamente presente en el repositorio.
4. Fallback/estado vacío si no existe información.

**NO inventar:**

- nombres
- teléfonos
- correos
- direcciones
- horarios
- fechas
- eventos
- anuncios
- documentos
- personas
- cargos
- información institucional

Si no existe información real, no rellenes con datos inventados.

---

# 8. PLACEHOLDERS Y DATOS DE PRUEBA

Busca activamente:

```text
Lorem ipsum
placeholder
test
testing
example
sample
dummy
fake
TODO
Coming soon
Próximamente
Texto de prueba
Imagen de prueba
Título de prueba
Descripción de prueba
```

Pero no elimines automáticamente coincidencias.

Para cada resultado determina si:

- es contenido real
- es fallback legítimo
- es comentario/documentación
- es código de prueba necesario
- es contenido provisional que debe eliminarse

Solo modifica lo que realmente corresponda a TASK-007.

---

# 9. ESTADOS VACÍOS

Los estados vacíos deben ser intencionales.

Cuando no existan datos reales, el usuario debe entender claramente que:

- actualmente no hay contenido disponible
- no se trata necesariamente de un error
- puede volver posteriormente

No llenar estados vacíos con contenido falso.

Ejemplo conceptual:

```text
No hay avisos disponibles en este momento.
```

El texto exacto debe adaptarse al componente y al contexto real.

---

# 10. SKELETONS Y ESTADOS DE CARGA

TASK-006 ya mejoró accesibilidad y responsive.

En TASK-007 NO rehagas el sistema de skeletons.

Solo verifica que:

- sigan apareciendo durante la carga
- no se rompan con datos reales
- tengan una transición razonable hacia el contenido
- no oculten contenido permanentemente
- no aparezcan cuando los datos ya están disponibles
- los estados de error y vacío sean distinguibles del loading

Si detectas problemas visuales importantes de skeleton → contenido:

**documenta el hallazgo para TASK-008**.

Solo corrige aquí problemas funcionales evidentes que impidan mostrar correctamente el contenido.

---

# 11. IMÁGENES

Revisar:

- imágenes reales disponibles
- rutas correctas
- fallback
- alt text
- imágenes rotas
- imágenes duplicadas innecesariamente
- dimensiones razonables para evitar errores de carga

NO descargar ni incorporar imágenes externas simplemente para "hacer que se vea bonito".

NO modificar Storage.

NO modificar buckets.

NO modificar políticas.

NO modificar Supabase.

---

# 12. RESPONSIVE Y ACCESIBILIDAD

TASK-006 ya trabajó estos aspectos.

En TASK-007:

- conserva los atributos ARIA existentes
- conserva keyboard navigation
- conserva focus management
- conserva focus trap
- conserva `:focus-visible`
- conserva responsive behavior

No elimines una mejora de TASK-006.

Si necesitas modificar un componente que contiene trabajo de TASK-006, asegúrate de no regresionar su accesibilidad.

---

# 13. ALCANCE TÉCNICO

Se permite modificar únicamente lo necesario para completar el contenido y la representación del frontend.

Posibles áreas:

```text
src/app/
src/app/components/
src/pages/
src/data/
src/content/
src/types/
```

y otros archivos estrictamente necesarios según la estructura real del repositorio.

Antes de modificar un archivo fuera de estas áreas, justifica su necesidad.

---

# 14. PROHIBICIONES

NO modificar:

- Supabase
- SQL
- RLS
- Auth
- Storage
- buckets
- migraciones
- políticas
- permisos
- credenciales
- variables secretas
- configuración de producción
- infraestructura
- deploy
- CI/CD

NO instalar dependencias nuevas salvo que sea absolutamente indispensable.

Si consideras que una dependencia es necesaria, DETENTE y repórtalo antes de instalarla.

---

# 15. NO MODIFICAR LÓGICA DE NEGOCIO SIN JUSTIFICACIÓN

No cambies:

- servicios
- consultas
- callbacks
- permisos
- autenticación
- rutas
- tipos de dominio
- persistencia

solo para conseguir un resultado visual.

Si descubres que el contenido no puede mostrarse correctamente debido a un problema de lógica existente:

1. documenta el problema
2. explica el archivo afectado
3. explica por qué está fuera del alcance
4. detente antes de modificarlo si el cambio puede afectar lógica de negocio

---

# 16. EVITAR REGRESIONES

Después de cada cambio relevante verifica que:

- las páginas siguen renderizando
- los datos siguen llegando
- loading funciona
- error funciona
- empty state funciona
- imágenes funcionan
- enlaces funcionan
- navegación funciona
- responsive de TASK-006 permanece
- accesibilidad de TASK-006 permanece

---

# 17. QUALITY GATE

Al terminar ejecuta obligatoriamente:

```powershell
npm run typecheck
npm run lint
npm run build
git diff --check
```

Reporta exactamente:

```text
Typecheck: PASS/FAIL
Lint: PASS/FAIL
Build: PASS/FAIL
Diff check: PASS/FAIL
```

Si alguno falla:

**NO declares TASK-007 terminada.**

Investiga y corrige únicamente si el fallo pertenece al alcance de TASK-007.

---

# 18. SECRETOS

Ejecuta:

```powershell
git ls-files | Select-String -Pattern '(^|[\\/])\.env($|\.)|secret|credential|private-key'
```

No deben aparecer secretos.

`.env.example` puede existir como template.

No incluir:

- `.env`
- tokens
- API keys
- credenciales
- claves privadas
- dumps
- logs sensibles

---

# 19. REVISIÓN FINAL DEL DIFF

Antes de crear el commit:

```powershell
git status --short
git diff --stat
git diff
```

Revisa manualmente todo el diff.

El diff debe corresponder únicamente a TASK-007.

Si aparecen cambios de:

- TASK-006
- Supabase
- Auth
- RLS
- Storage
- SQL
- contacto/persistencia
- lógica no relacionada
- configuración ajena

detente y repórtalo.

---

# 20. DOCUMENTACIÓN OBLIGATORIA

Crea:

```text
TASK-007 — Contenido real y completitud.md
```

y:

```text
TASK-007-IMPLEMENTATION-REPORT.md
```

El documento de implementación debe incluir:

## Resumen

Qué se encontró y qué se modificó.

## Archivos modificados

Lista exacta.

## Contenido revisado

Indicar qué se revisó en:

- Home
- Nosotros
- Avisos
- Eventos
- Galería
- Documentos
- Contacto

## Placeholders

Qué placeholders se encontraron y cuáles se eliminaron, conservaron o reemplazaron.

## Fuentes de contenido

Indicar de dónde procede cada contenido importante.

## Estados vacíos

Qué páginas/componentes tienen estado vacío y cómo se representan.

## Skeletons

Confirmar que siguen funcionando.

## Accesibilidad

Confirmar que las mejoras de TASK-006 no fueron regresionadas.

## Responsive

Confirmar que no se introdujeron regresiones.

## Quality Gate

Incluir resultados exactos:

```text
typecheck:
lint:
build:
git diff --check:
```

## Secretos

Resultado de la comprobación.

## Límites

Confirmar explícitamente:

- no Supabase
- no SQL
- no Auth
- no RLS
- no Storage
- no cambios de infraestructura
- no merge a main
- no deploy

## Pendientes

Documentar cualquier problema que deba pasar a TASK-008 o QA posterior.

---

# 21. COMMIT

Cuando todo esté verificado:

```powershell
git add .
git status --short
git commit -m "feat: complete real frontend content"
```

Después:

```powershell
git status --short --branch
git log --oneline --decorate -5
```

El working tree debe quedar limpio.

---

# 22. PUSH

Cuando TASK-007 esté completamente verificada:

```powershell
git push -u origin feat/task-007-real-content
```

Después verifica:

```powershell
git ls-remote --heads origin feat/task-007-real-content
```

NO hagas merge a `main`.

---

# 23. QA VISUAL

Si tienes navegador disponible, realiza una revisión visual real de las páginas modificadas.

Como mínimo:

```text
320px
375px
768px
1024px
1440px
```

Comprueba:

- contenido visible
- textos completos
- imágenes
- enlaces
- estados vacíos
- loading
- errores
- overflow
- elementos cortados
- responsive
- navegación
- accesibilidad básica

IMPORTANTE:

No inventes resultados.

Si NO tienes navegador disponible, escribe exactamente:

```text
QA VISUAL: PENDIENTE — navegador no disponible
```

No afirmes que una página fue visualmente probada si no lo fue.

---

# 24. NO EMPEZAR TASK-008

Al finalizar TASK-007:

NO empieces:

```text
TASK-008 — Frontend Visual & UX Integral
```

aunque durante la auditoría encuentres problemas visuales.

Solo documenta esos problemas para la siguiente task.

TASK-008 será una etapa independiente donde analizaremos:

- diseño completo
- jerarquía visual
- cards
- spacing
- tipografía
- colores
- componentes
- skeleton → contenido
- estados
- responsive visual
- consistencia
- UX
- navbar
- footer
- hero
- dashboard
- formularios
- tablas
- animaciones
- microinteracciones

Eso NO pertenece a TASK-007.

---

# 25. CRITERIO DE ÉXITO

TASK-007 será considerada correctamente implementada cuando:

- [ ] Rama `feat/task-007-real-content` creada
- [ ] Auditoría inicial realizada
- [ ] Contenido público revisado
- [ ] Contenido real utilizado donde exista
- [ ] Placeholders innecesarios eliminados
- [ ] No se inventaron datos institucionales
- [ ] Estados vacíos correctamente definidos
- [ ] Loading/skeletons funcionan
- [ ] Imágenes revisadas
- [ ] Enlaces revisados
- [ ] Accesibilidad de TASK-006 conservada
- [ ] Responsive de TASK-006 conservado
- [ ] Typecheck PASS
- [ ] Lint PASS
- [ ] Build PASS
- [ ] Diff check PASS
- [ ] Secretos verificados
- [ ] Documentación creada
- [ ] Commit creado
- [ ] Working tree CLEAN
- [ ] Push verificado
- [ ] `main` sin modificaciones
- [ ] TASK-008 NO iniciada

---

# 26. INFORME FINAL OBLIGATORIO

Al terminar responde exactamente con esta estructura:

```text
TASK-007 — IMPLEMENTATION REPORT

Branch:
Commit:
Push:
Working tree:
Main:

Auditoría:
PASS / BLOCKED

Contenido:
PASS / BLOCKED

Placeholders:
PASS / BLOCKED

Estados vacíos:
PASS / BLOCKED

Imágenes:
PASS / BLOCKED

Skeletons:
PASS / BLOCKED

Accesibilidad:
PASS / BLOCKED

Responsive:
PASS / BLOCKED

Typecheck:
PASS / FAIL

Lint:
PASS / FAIL

Build:
PASS / FAIL

Diff check:
PASS / FAIL

Secretos:
PASS / FAIL

QA visual:
PASS / PENDIENTE

Archivos modificados:
[lista]

Cambios principales:
[resumen]

Pendientes para TASK-008:
[lista]

Observaciones:
[lista]

Estado final:
PASS
PASS WITH NOTE
BLOCKED
```

---

# REGLA FINAL

Trabaja de forma conservadora.

**Primero analiza → después modifica → después verifica → después documenta → después commit → después push.**

No hagas cambios por estética que pertenezcan a TASK-008.

No inventes contenido real.

No supongas que algo existe: compruébalo en el repositorio.

No declares una prueba como realizada si no tienes las herramientas para realizarla.

No hagas merge a `main`.

No empieces TASK-008.

Cuando termines, entrégame únicamente el informe final de TASK-007 siguiendo la estructura indicada.