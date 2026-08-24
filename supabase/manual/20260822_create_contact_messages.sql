-- TASK-004: mensajes de contacto
-- REVISION MANUAL OBLIGATORIA
-- 1. Revisar este archivo antes de ejecutarlo en Supabase SQL Editor.
-- 2. Ejecutarlo manualmente solo después de confirmar que public.is_admin()
--    existe con firma () returns boolean y que su implementación ya está aprobada.
-- 3. No ejecutar desde Kilo Code ni desde el frontend.
-- 4. Este script no modifica user_roles, is_admin(), Storage, Auth, RLS
--    existente ni ninguna tabla distinta de contact_messages y sus policies.
-- 5. Confirmar que los límites de longitud satisfacen la política editorial
--    del colegio antes de aplicar el script.

create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint contact_messages_name_length check (char_length(name) between 1 and 120),
  constraint contact_messages_email_length check (char_length(email) between 3 and 254),
  constraint contact_messages_message_length check (char_length(message) between 1 and 4000),
  constraint contact_messages_status_check check (status in ('new', 'read', 'archived')),
  constraint contact_messages_read_at_check check (status = 'new' and read_at is null or status in ('read', 'archived'))
);

alter table public.contact_messages enable row level security;

-- Eliminar solo policies con estos nombres de esta tabla. No toca otras tablas.
drop policy if exists "Public insert contact messages" on public.contact_messages;
drop policy if exists "Admins read contact messages" on public.contact_messages;
drop policy if exists "Admins update contact messages" on public.contact_messages;
drop policy if exists "Admins delete contact messages" on public.contact_messages;

-- anon y authenticated pueden insertar únicamente un registro público nuevo.
-- status/read_at no se reciben del formulario; el default fija status='new'.
create policy "Public insert contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (
  status = 'new'
  and read_at is null
  and char_length(name) between 1 and 120
  and char_length(email) between 3 and 254
  and char_length(message) between 1 and 4000
);

create policy "Admins read contact messages"
on public.contact_messages
for select
to authenticated
using (public.is_admin());

create policy "Admins update contact messages"
on public.contact_messages
for update
to authenticated
using (public.is_admin())
with check (
  public.is_admin()
  and status in ('new', 'read', 'archived')
  and (status = 'new' and read_at is null or status in ('read', 'archived'))
);

create policy "Admins delete contact messages"
on public.contact_messages
for delete
to authenticated
using (public.is_admin());

-- VERIFICACION MANUAL DEL PROPIETARIO EN SQL EDITOR
-- Ejecutar despues del script, sin incluir service_role ni credenciales.
-- A. Tabla, RLS y columnas:
-- select column_name, data_type, is_nullable, column_default
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'contact_messages'
-- order by ordinal_position;
--
-- select relname, relrowsecurity, relforcerowsecurity
-- from pg_class
-- where oid = 'public.contact_messages'::regclass;
--
-- B. Policies exactas:
-- select schemaname, tablename, policyname, permissive, roles,
--        cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename = 'contact_messages'
-- order by policyname;
--
-- C. Confirmar la funcion de autorizacion existente:
-- select n.nspname as schema_name, p.proname,
--        pg_get_function_identity_arguments(p.oid) as arguments,
--        pg_get_function_result(p.oid) as result
-- from pg_proc p
-- join pg_namespace n on n.oid = p.pronamespace
-- where n.nspname = 'public' and p.proname = 'is_admin';
--
-- D. Revisar contenido solo como administrador autorizado:
-- select id, status, created_at, read_at from public.contact_messages
-- order by created_at desc limit 20;
--
-- E. Confirmar que no existen policies de lectura publica adicionales:
-- select schemaname, tablename, policyname, roles, cmd
-- from pg_policies
-- where tablename = 'contact_messages';

-- ROLLBACK MANUAL OPCIONAL
-- Ejecutar solamente si se decide retirar TASK-004 y se confirma que nadie
-- necesita la tabla. Borra solo esta tabla y sus policies en cascada.
-- drop table if exists public.contact_messages;
