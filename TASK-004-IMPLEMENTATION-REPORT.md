# TASK-004 — Informe de implementación

Fecha: 2026-08-22  
Rama: `stiven`

## 1. Archivos modificados y SQL creado

Cambios específicos de TASK-004:

- `src/app/types.ts`: tipos `ContactMessage` y `ContactMessageStatus`.
- `src/services/contact.service.ts`: servicio tipado público y administrativo.
- `src/services/index.ts`: exportación del servicio.
- `src/app/components/home/HomeContact.tsx`: honeypot, labels asociados, límites y estados de envío.
- `src/app/components/ContactPage.tsx`: persistencia real, estados de envío/error y conservación de datos ante error.
- `src/app/components/HomePage.tsx`: conexión del formulario de portada al servicio.
- `src/app/components/admin/ContactMessagesAdminPage.tsx`: bandeja administrativa.
- `src/app/components/admin/AdminSidebar.tsx`: acceso compartido a Mensajes.
- `src/app/App.tsx`: ruta protegida `/admin/contact-messages`.
- `supabase/manual/20260822_create_contact_messages.sql`: SQL para revisión y ejecución manual.
- `TASK-004-IMPLEMENTATION-REPORT.md`: este informe.

El working tree ya contenía cambios de Tasks anteriores. No se revirtieron ni se atribuyeron a TASK-004.

## 2. Modelo de datos y policies preparadas

El SQL propone `public.contact_messages` con:

- `id uuid` con `uuid_generate_v4()`;
- `name`, `email` y `message` obligatorios;
- `status` con valores `new`, `read` y `archived`, por defecto `new`;
- `created_at` automático;
- `read_at` nullable;
- restricciones de longitud y consistencia básica entre estado y `read_at`.

Policies preparadas:

- `anon` y `authenticated` pueden insertar solo un mensaje válido, nuevo y sin `read_at`;
- no existe policy pública de lectura;
- solo `authenticated` cuyo `public.is_admin()` sea verdadero puede leer, actualizar o eliminar;
- actualización restringida a estados permitidos y no altera otras tablas.

El servicio público inserta sin `.select()`, de modo que el visitante no necesita una policy SELECT para recibir confirmación de inserción. El servicio no acepta `status`, `read_at`, `created_at` ni `id` en el input público.

## 3. SQL manual y estado remoto

El archivo SQL **no se ejecutó automáticamente** y no se ejecutó ninguna consulta contra Supabase desde esta sesión.

Estado end-to-end:

**BLOCKED — pendiente de que el propietario revise y ejecute manualmente el SQL en Supabase SQL Editor.**

Antes de ejecutar, el propietario debe revisar:

1. que `public.is_admin()` exista con firma sin argumentos y retorno booleano;
2. que los límites 120/254/4000 sean adecuados para la política del colegio;
3. que no exista ya una tabla equivalente `contact_messages` con otro esquema;
4. que las policies propuestas no entren en conflicto con policies existentes.

Después, ejecutar únicamente `supabase/manual/20260822_create_contact_messages.sql` desde Supabase SQL Editor. No compartir credenciales, tokens ni contraseñas en el chat.

Consultas manuales posteriores incluidas en el propio archivo SQL:

```sql
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'contact_messages'
order by ordinal_position;

select relname, relrowsecurity, relforcerowsecurity
from pg_class
where oid = 'public.contact_messages'::regclass;

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'contact_messages'
order by policyname;

select n.nspname as schema_name, p.proname,
       pg_get_function_identity_arguments(p.oid) as arguments,
       pg_get_function_result(p.oid) as result
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'is_admin';
```

Debe comprobar además manualmente los casos end-to-end: envío anónimo, ausencia de lectura pública, acceso admin, rechazo de no-admin, actualización de estados, eliminación protegida y fallo de inserción sin borrar el formulario.

## 4. Servicio y validaciones

`src/services/contact.service.ts` incluye:

- `createContactMessage({ name, email, message }): Promise<void>`;
- `getContactMessages()`;
- `updateContactMessageStatus(id, status)`;
- `deleteContactMessage(id)`.

Las validaciones locales hacen `trim()` de nombre, correo y mensaje, normalizan el correo a minúsculas, validan formato de correo y aplican límites de nombre 120, correo 254 y mensaje 4000. Los errores de Supabase se convierten en mensajes controlados para la interfaz y se registran sin el contenido completo del mensaje, correo ni datos personales.

## 5. Formulario público

En Home y `/contacto`:

- el formulario conserva la API de `form`, `sent`, `onFormChange` y `onSubmit` ampliada con `submitting`/`submitError`;
- labels e inputs están asociados con `htmlFor` e `id`;
- existe honeypot oculto `website`, que no se persiste y cancela silenciosamente el envío si está completo;
- se impide doble envío mientras `submitting` es verdadero;
- se muestra `Enviando...` y se desactiva el botón;
- el éxito se muestra solo después de que el insert termina sin error;
- los campos se limpian solo después del éxito;
- los datos permanecen si falla la operación;
- el error usa `role="alert"` y el éxito `role="status"`/`aria-live`;
- el texto indica que el mensaje queda disponible en la bandeja, sin prometer correo ni plazo rígido.

No se implementó envío de correo.

## 6. Bandeja administrativa y ruta

Se añadió `/admin/contact-messages` con lazy loading y `ProtectedAdminRoute`, igual que las demás rutas administrativas. La bandeja permite:

- ver nombre, correo, mensaje, fecha y estado;
- distinguir `Nuevo`, `Leído` y `Archivado`;
- marcar como leído o archivar;
- abrir `mailto:` para el correo validado por el servicio;
- eliminar con confirmación inline;
- estados de carga, error, vacío y reintento.

El acceso “Mensajes” se añade desde el sidebar compartido. No se convirtió `/admin` en dashboard y no se implementó navegación móvil.

## 7. Comandos y resultados

| Comando | Resultado |
|---|---|
| `git status --short --branch` | PASS como inspección. `## stiven...origin/stiven [ahead 5]`; el working tree contiene cambios previos y archivos no trackeados. |
| `git diff --stat` | PASS como inspección. Detectó cambios extensos previos. |
| `npm run typecheck` | PASS. `tsc --noEmit` terminó sin diagnóstico. |
| `npm run lint` | BLOCKED. Falta el script `lint` y no existe el binario local de ESLint; no se instalaron dependencias ni se cambió configuración. |
| `npm run build` | PASS. Vite transformó 1.710 módulos y compiló correctamente en 1m 29s. |
| `git diff --check` | PASS. Sin errores de whitespace; solo advertencias LF/CRLF de Git en archivos preexistentes. |
| Inspección local de validación/contrato | LIMITADA. La importación directa del servicio con Node no resuelve imports TypeScript sin extensión fuera de Vite; no invocó Supabase ni produjo cambios. TypeScript y build son las validaciones ejecutables aprobadas. |

## 8. Alcance protegido

No se modificaron Supabase, SQL existente, Storage, Auth, RLS existentes, tablas existentes, policies existentes, documentos S6-008, signed URLs, privacidad, expiración ni CRUD de documentos. El único SQL creado es el archivo manual de propuesta para `contact_messages`; no fue ejecutado.

Tampoco se modificaron `main`, eventos, galería, avisos, hero, imágenes, fechas, skeletons ni dashboard como interfaz. No se hizo commit, push ni deploy.

## 9. Estado de Git

- Rama: `stiven`.
- Seguimiento: `origin/stiven`, ahead 5 según Git.
- Cambios previos del working tree preservados.
- No se tocó `main`.
- No se hizo commit ni push.

## 10. Quality Gate

| Criterio | Estado | Evidencia |
|---|---|---|
| Éxito solo después de inserción confirmada | PASS local | `createContactMessage` se espera antes de `setSent(true)` y no usa retorno público. |
| Loading, éxito, error, reintento y doble envío | PASS local | `submitting`, `submitError`, botón deshabilitado y datos conservados en error. |
| Honeypot no persistido | PASS local | Se lee `website` desde `FormData` y el servicio solo recibe `form`. |
| Bandeja administrativa protegida | PASS local | Ruta bajo `ProtectedAdminRoute`; lectura/escritura dependen además de RLS propuesta. |
| SQL preparado, no ejecutado | PASS | Archivo manual creado; no se ejecutó SQL. |
| RLS end-to-end | BLOCKED | Requiere revisión y ejecución manual del propietario en Supabase SQL Editor. |
| `npm run typecheck` | PASS | Código de salida 0. |
| `npm run lint` | BLOCKED | Script/binario ESLint ausente previamente. |
| `npm run build` | PASS | Build Vite completado correctamente. |
| `git diff --check` | PASS | Sin errores de whitespace. |
| S6-008, documentos y datos remotos intactos | PASS | No se modificó su lógica ni se hicieron operaciones remotas. |

## 11. Pendientes que no deben resolverse automáticamente

- El propietario debe revisar y ejecutar manualmente el SQL, y realizar las pruebas RLS/end-to-end indicadas.
- No añadir envío de correo, CAPTCHA o funciones backend en esta Task.
- No iniciar TASK-005 automáticamente.
- El dashboard global, navegación móvil, accesibilidad general y configuración de ESLint quedan fuera de esta entrega.
- Cualquier cambio de límites, retención, roles o contenido institucional requiere decisión explícita del propietario.
