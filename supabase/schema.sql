-- ============================================================================
-- IEJCM — baseline del esquema (2026-10-03)
--
-- Snapshot verificado contra la base de datos real de produccion. No es el
-- esquema historico original (esa historia se perdio en cambios aplicados a
-- mano durante meses); es el estado validado desde el cual parten las
-- migraciones siguientes.
--
-- Todas las sentencias son idempotentes para que `supabase db reset` sea
-- seguro: este archivo mas las migraciones posteriores producen el mismo estado.
-- ============================================================================

create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

-- ---------------------------------------------------------------- funciones

-- Wrapper de RLS. SECURITY DEFINER para poder leer user_roles sin disparar
-- la RLS de esa misma tabla; STABLE + STABLE para que el planner la evalue una
-- vez por statement en vez de una vez por fila.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
    select exists (
        select 1
        from public.user_roles
        where user_id = (select auth.uid())
          and role = 'admin'
    );
$$;

-- Trigger de metadatos de documents. Es un trigger, no un endpoint: no debe ser
-- invocable por RPC (ver migracion de privilegios).
create or replace function public.set_documents_meta()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if TG_OP = 'INSERT' then
    if new.created_by is null then
      new.created_by := auth.uid();
    end if;
    new.updated_at := now();
    return new;
  elsif TG_OP = 'UPDATE' then
    new.updated_at := now();
    return new;
  end if;
  return new;
end;
$$;

drop trigger if exists set_documents_meta on public.documents;
create trigger set_documents_meta
  before insert or update on public.documents
  for each row execute function set_documents_meta();

-- ------------------------------------------------------------------ tablas

create table if not exists public.announcements (
  id          uuid primary key default extensions.uuid_generate_v4(),
  title       text not null,
  description text not null,
  type        text not null default 'general',
  priority    text not null default 'media',
  active      boolean default true,
  start_date  date,
  end_date    date,
  created_at  timestamptz default now(),
  constraint announcements_type_check
    check (type in ('general','matricula','evento','suspension','importante')),
  constraint announcements_priority_check
    check (priority in ('baja','media','alta'))
);

create table if not exists public.contact_messages (
  id         uuid primary key default extensions.uuid_generate_v4(),
  name       text not null,
  email      text not null,
  message    text not null,
  status     text not null default 'new',
  created_at timestamptz not null default now(),
  read_at    timestamptz,
  constraint contact_messages_name_check    check (char_length(name) between 1 and 120),
  constraint contact_messages_email_check   check (char_length(email) between 3 and 254),
  constraint contact_messages_message_check check (char_length(message) between 1 and 4000),
  constraint contact_messages_status_check  check (status in ('new','read','archived')),
  -- read_at solo tiene sentido para mensajes ya leidos
  constraint contact_messages_read_at_check
    check ((status = 'new' and read_at is null) or status in ('read','archived'))
);

create table if not exists public.documents (
  id             uuid primary key default extensions.uuid_generate_v4(),
  title          text not null,
  description    text not null default '',
  category       text not null default 'otros',
  file_path      text not null,
  file_name      text not null,
  file_size      bigint,
  mime_type      text not null,
  file_extension text not null,
  is_public      boolean not null default false,
  published_at   timestamptz,
  expires_at     timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     uuid not null default auth.uid(),
  constraint documents_category_check
    check (category in ('excusas','permisos','circulares','formatos','guias','comunicados','institucional','otros')),
  constraint documents_mime_type_check
    check (mime_type in ('application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
);

create index if not exists documents_created_at_idx on public.documents (created_at);
create index if not exists documents_category_idx  on public.documents (category);
create index if not exists documents_is_public_idx on public.documents (is_public);
create index if not exists documents_created_by_idx on public.documents (created_by);

create table if not exists public.events (
  id              uuid primary key default extensions.uuid_generate_v4(),
  title           text not null,
  description     text not null,
  "fullDescription" text,
  date            date not null,
  "time"          text not null,
  "endTime"       text,
  location        text not null,
  category        text not null,
  image           text,
  created_at      timestamptz default now(),
  active          boolean default true,
  constraint events_category_check
    check (category in ('academic','cultural','sports','institutional'))
);

create index if not exists idx_events_date     on public.events (date);
create index if not exists idx_events_category on public.events (category);

create table if not exists public.gallery (
  id          uuid primary key default extensions.uuid_generate_v4(),
  title       text not null,
  description text,
  category    text not null,
  image_url   text not null,
  uploaded_at timestamptz default now(),
  created_at  timestamptz default now(),
  active      boolean default true
);

-- school_info es un singleton logico: la app lee la primera fila con
-- limit(1).maybeSingle(). Ver TASK-000 H-010: no hay restriccion que lo impida.
create table if not exists public.school_info (
  id               uuid primary key default gen_random_uuid(),
  school_name      text,
  history          text,
  mission          text,
  vision           text,
  address          text,
  phone            text,
  email            text,
  facebook         text,
  instagram        text,
  youtube          text,
  logo_url         text,
  hero_image_url   text,
  updated_at       timestamptz default now(),
  hero_badge_color text default '#006400',
  hero_badge       text default '',
  hero_title       text,
  hero_subtitle    text
);

-- La PK en user_id ya garantiza unicidad: es lo que hace que
-- .maybeSingle() en useIsAdmin.ts:30 no pueda recibir dos filas.
create table if not exists public.user_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null,
  created_at timestamptz not null default now(),
  constraint user_roles_role_check check (role = 'admin')
);

-- --------------------------------------------------------------------- RLS

alter table public.announcements     enable row level security;
alter table public.contact_messages  enable row level security;
alter table public.documents         enable row level security;
alter table public.events            enable row level security;
alter table public.gallery           enable row level security;
alter table public.school_info       enable row level security;
alter table public.user_roles        enable row level security;

drop policy if exists "Public can read active announcements" on public.announcements;
create policy "Public can read active announcements" on public.announcements
  for select to public using (active = true);

drop policy if exists "Admins can manage announcements" on public.announcements;
create policy "Admins can manage announcements" on public.announcements
  for all to authenticated
  using (is_admin()) with check (is_admin());

drop policy if exists "Public insert contact messages" on public.contact_messages;
create policy "Public insert contact messages" on public.contact_messages
  for insert to anon, authenticated
  with check (status = 'new' and read_at is null
              and char_length(name) between 1 and 120
              and char_length(email) between 3 and 254
              and char_length(message) between 1 and 4000);

drop policy if exists "Admins read contact messages" on public.contact_messages;
create policy "Admins read contact messages" on public.contact_messages
  for select to authenticated using (is_admin());

drop policy if exists "Admins update contact messages" on public.contact_messages;
create policy "Admins update contact messages" on public.contact_messages
  for update to authenticated
  using (is_admin())
  with check (is_admin() and status in ('new','read','archived')
              and ((status = 'new' and read_at is null) or status in ('read','archived')));

drop policy if exists "Admins delete contact messages" on public.contact_messages;
create policy "Admins delete contact messages" on public.contact_messages
  for delete to authenticated using (is_admin());

drop policy if exists "Public read public documents" on public.documents;
create policy "Public read public documents" on public.documents
  for select to public using (is_public = true and (expires_at is null or expires_at > now()));

drop policy if exists "Admin read documents" on public.documents;
create policy "Admin read documents" on public.documents
  for select to authenticated using (is_admin());

drop policy if exists "Admin insert documents" on public.documents;
create policy "Admin insert documents" on public.documents
  for insert to authenticated with check (is_admin());

drop policy if exists "Admin update documents" on public.documents;
create policy "Admin update documents" on public.documents
  for update to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "Admin delete documents" on public.documents;
create policy "Admin delete documents" on public.documents
  for delete to authenticated using (is_admin());

-- events y gallery: el filtro active=true se aplica aqui, no solo en el
-- cliente. Antes era using (true) y un curl anon leia los registros
-- desactivados. Ver migracion 20261003120100.
drop policy if exists "Public can read events" on public.events;
create policy "Public can read events" on public.events
  for select to public using (active = true);

drop policy if exists "Admins can insert events" on public.events;
create policy "Admins can insert events" on public.events
  for insert to authenticated with check (is_admin());

drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events" on public.events
  for update to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "Admins can delete events" on public.events;
create policy "Admins can delete events" on public.events
  for delete to authenticated using (is_admin());

drop policy if exists "Public can read gallery" on public.gallery;
create policy "Public can read gallery" on public.gallery
  for select to public using (active = true);

drop policy if exists "Admins can insert gallery" on public.gallery;
create policy "Admins can insert gallery" on public.gallery
  for insert to authenticated with check (is_admin());

drop policy if exists "Admins can update gallery" on public.gallery;
create policy "Admins can update gallery" on public.gallery
  for update to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "Admins can delete gallery" on public.gallery;
create policy "Admins can delete gallery" on public.gallery
  for delete to authenticated using (is_admin());

drop policy if exists "Public read school info" on public.school_info;
create policy "Public read school info" on public.school_info
  for select to public using (true);

drop policy if exists "Admins can manage school info" on public.school_info;
create policy "Admins can manage school info" on public.school_info
  for all to authenticated
  using (is_admin()) with check (is_admin());

drop policy if exists "Users can read own role" on public.user_roles;
create policy "Users can read own role" on public.user_roles
  for select to authenticated using (user_id = (select auth.uid()));

-- No hay policy de INSERT/UPDATE en user_roles a proposito: los roles se
-- otorgan por SQL desde una consola con privilegios, no desde la app.

-- ----------------------------------------------------------------- storage

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gallery', 'gallery', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('events', 'events', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('school-info', 'school-info', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('documents', 'documents', false, 20971520,
   array['application/pdf','application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public Access to Gallery Images" on storage.objects;
create policy "Public Access to Gallery Images" on storage.objects
  for select to public using (bucket_id = 'gallery');

drop policy if exists "Public events" on storage.objects;
create policy "Public events" on storage.objects
  for select to public using (bucket_id = 'events');

drop policy if exists "Public school" on storage.objects;
create policy "Public school" on storage.objects
  for select to public using (bucket_id = 'school-info');

-- El bucket documents es privado: solo se expone lo marcado como publico, y
-- la existencia del documento se valida contra la fila (no contra el nombre
-- del archivo), asi un objeto suelto no se sirve.
drop policy if exists "Public read documents" on storage.objects;
create policy "Public read documents" on storage.objects
  for select to public using (
    bucket_id = 'documents'
    and exists (
      select 1 from documents d
      where d.file_path = objects.name
        and d.is_public = true
        and (d.expires_at is null or d.expires_at > now())
    )
  );

drop policy if exists "Admins can upload gallery images" on storage.objects;
create policy "Admins can upload gallery images" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery' and is_admin());

drop policy if exists "Admins can upload event images" on storage.objects;
create policy "Admins can upload event images" on storage.objects
  for insert to authenticated with check (bucket_id = 'events' and is_admin());

drop policy if exists "Admins can upload school info media" on storage.objects;
create policy "Admins can upload school info media" on storage.objects
  for insert to authenticated with check (bucket_id = 'school-info' and is_admin());

drop policy if exists "Admin upload documents" on storage.objects;
create policy "Admin upload documents" on storage.objects
  for insert to authenticated with check (bucket_id = 'documents' and is_admin());

drop policy if exists "Admin read documents" on storage.objects;
create policy "Admin read documents" on storage.objects
  for select to authenticated using (bucket_id = 'documents' and is_admin());

drop policy if exists "Admin update documents" on storage.objects;
create policy "Admin update documents" on storage.objects
  for update to authenticated using (bucket_id = 'documents' and is_admin());

drop policy if exists "Admin delete documents" on storage.objects;
create policy "Admin delete documents" on storage.objects
  for delete to authenticated using (bucket_id = 'documents' and is_admin());

-- Las policies de UPDATE y DELETE para gallery/events/school-info se crean en
-- 20261003120000_storage_media_write_policies.sql.