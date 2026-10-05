# Base de datos — IEJCM

## Layout

```
supabase/
  migrations/     se aplican en orden, timestamps crecientes (Supabase CLI)
  manual/         scripts historicos, NO se aplican automaticamente
  schema.sql      copia del baseline, para referencia rapida
```

## Reconstruir una base desde cero

```bash
supabase db reset
```

Corre `migrations/` en orden. El baseline mas las 4 migraciones producen el
mismo estado que hoy hay en produccion. Todas las sentencias son idempotentes.

## Dar de alta al primer admin

**Esto no es una migracion a proposito.** Los roles se otorgan a una persona
concreta; si estuviera en `migrations/`, cada instalacion limpia intentaria
crear ese mismo admin.

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'correo@colegio.edu.co'
on conflict (user_id) do update set role = 'admin';
```

`user_roles` no tiene policy de INSERT ni de UPDATE: la app no puede otorgar
roles, solo leer el propio (`useIsAdmin.ts:30`).

## Pausa por inactividad

Supabase pausa los proyectos del plan Free tras **7 días con poca actividad en
la base de datos**. Al pausarse, el sitio en Vercel se cae: la app no monta y
queda en blanco con `Error: supabaseUrl is required` en consola.

Hay dos avisos por email: uno ~1 semana antes de la pausa y otro al confirmarla.
La ventana para restaurar un proyecto pausado es de **1 año**.

La solución de verdad es el plan Pro (USD 10/mes), que no se pausa. Mientras se
este en Free, el repo tiene un parche automático.

### Keep-alive automático

`.github/workflows/keep-alive.yml` corre a diario (04:17 UTC) y hace una
consulta real a PostgREST por cada tabla. Se puede disparar a mano desde la
pestaña **Actions → Supabase keep-alive → Run workflow**.

Requiere dos secrets en **Settings → Secrets and variables → Actions**:

| Secret | Valor |
|---|---|
| `SUPABASE_URL` | la URL del proyecto, sin comillas |
| `SUPABASE_ANON_KEY` | la publishable key, sin comillas |

Si faltan, el job falla con un error explicito en vez de pasar en verde: es
deliberado, para que un secret sin configurar sea visible y no parezca que el
keep-alive esta funcionando.

Ademas del keep-alive, el mismo workflow consulta el sitio desplegado y avisa
con un `warning` si Vercel no responde. Eso no hace fallar el job: son dos
cosas separadas y no conviene enmascarar una con la otra.

### Limitaciones que hay que conocer

- **Es un parche, no una garantia.** Si el workflow deja de correr, el proyecto
  se pausa. El aviso por email es la red de seguridad.
- **El repo es publico.** GitHub desactiva los workflows programados en repos
  publicos tras 60 días sin actividad en el repo. Cualquier commit reinicia ese
  reloj; si el proyecto queda abandonado mas de 60 días, el cron muere en
  silencio. Para blindarlo, la alternativa es un cron de Vercel, que no depende
  de la actividad del repo.
- **La peticion es de lectura y sin credenciales de servicio.** No escribe nada
  ni consume cuota de mas: es un `select id limit 1` con la publishable key, la
  misma que ya viaja en el bundle del navegador.

## Orden de las migraciones

| Timestamp | Que hace |
|---|---|
| `20261003000000` | Baseline: esquema verificado contra produccion, funciones, RLS, buckets |
| `20261003120000` | Policies de UPDATE/DELETE en los 3 buckets de imagenes |
| `20261003120100` | `events` y `gallery`: el filtro `active` pasa a la BD |
| `20261003120200` | Privilegios de ejecucion de `is_admin()` y `set_documents_meta()` |
| `20261003120400` | Backfill: URLs absolutas a paths en los campos de imagen |

## Contexto importante sobre el baseline

El baseline es el estado **validado el 2026-10-03**, no el esquema original del
proyecto. Antes de esa fecha los cambios se aplicaban a mano desde el SQL Editor
de Supabase y no quedaban registrados en el repositorio, asi que el historial
anterior no es recuperable. Lo que se pierde de esa epoca son cambios que hoy
ya son parte del baseline.

La deriva era real: el viejo `src/lib/database.sql` (eliminado, ahora vive en
`schema.sql`) declaraba `events.date` como `text` cuando en la base es `date`,
no incluia `contact_messages` ni ningun CHECK constraint, y sus policies se
llamaban distinto a las reales — por lo que sus `drop policy if exists` no
hacian nada y executarlo deja policies duplicadas.

`manual/20260822_create_contact_messages.sql` es un artefacto historico ya
aplicado. Sus constraints se llaman `*_length` mientras que en la base
terminan en `*_check`: otra muestra de la deriva. El baseline refleja los
nombres reales.

## Correcciones aplicadas fuera de las migraciones

Un par de cambios se aplicaron por la Management API y luego se revirtieron, as
que no dejan archivo pero conviene registrarlos:

- Se creo `user_roles_user_id_key` y `user_roles_user_id_idx` creyendo que
  faltaba unicidad. No hacia falta: la PK de `user_roles` ya esta en `user_id`,
  que es lo que hace que `.maybeSingle()` no pueda devolver dos filas. Ambos
  indices se eliminaron.
- Se borro la fila `QA-E2E-GAL-1790997504522` de `gallery` (resto de una corrida
  de QA). Los objetos de Storage no se pueden borrar por SQL: `storage` tiene
  un trigger anti-perdida de datos y exige la Storage API.

## Bodega de imagenes: como evitar huforfanos

`storage.objects` tiene un trigger que rechaza `DELETE` directos. Para limpiar
archivos huerfanos hay que usar la Storage API con sesion de admin, no SQL.
Los archivos huerfanos aparecen cuando se reemplaza una imagen: la app los
evita borrando el archivo anterior despues de un `update` exitoso
(`GalleryAdminPage.tsx`, `AdminDashboard.tsx`, `SchoolInfoAdminPage.tsx`).