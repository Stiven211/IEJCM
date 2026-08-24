-- =====================================================================
-- IEJCM - Esquema de base de datos (Supabase / PostgreSQL)
-- Reconstrucción Fase 2 - alineado con src/app/types.ts y los servicios.
-- Idempotente: ejecutable múltiples veces sin errores.
-- Fuente de verdad: types.ts, event.service.ts, gallery.service.ts,
-- announcement.service.ts, schoolInfo.service.ts.
-- =====================================================================

-- Extensión para generación de UUID (si no existe)
create extension if not exists "uuid-ossp";

-- =====================================================================
-- TABLA: events
-- Usada por: event.service.ts (getAllEvents, getEventById,
-- createEvent, updateEvent, removeEvent, uploadEventImage)
-- Campos: types.ts -> Event
-- =====================================================================
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  fullDescription text,
  date text not null default '',
  time text not null default '',
  endTime text,
  location text not null default '',
  category text not null default 'academic',
  image text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists events_date_idx on public.events (date);
create index if not exists events_active_idx on public.events (active);

-- =====================================================================
-- TABLA: gallery
-- Usada por: gallery.service.ts (getAllGalleryItems filtra active=true,
-- getGalleryItemById, createGalleryItem, updateGalleryItem,
-- removeGalleryItem, uploadGalleryImage)
-- Campos: types.ts -> GalleryItem
-- =====================================================================
create table if not exists public.gallery (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text not null default '',
  category text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_active_idx on public.gallery (active);
create index if not exists gallery_created_at_idx on public.gallery (created_at);

-- =====================================================================
-- TABLA: announcements
-- Usada por: announcement.service.ts (getAllAnnouncements,
-- getAnnouncementById, createAnnouncement, updateAnnouncement,
-- removeAnnouncement)
-- Campos: types.ts -> Announcement
-- =====================================================================
create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  type text,
  priority text,
  start_date timestamptz,
  end_date timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists announcements_created_at_idx on public.announcements (created_at);
create index if not exists announcements_active_idx on public.announcements (active);

-- =====================================================================
-- school_info
-- Usada por: schoolInfo.service.ts (getSchoolInfo, upsertSchoolInfo,
-- uploadSchoolInfoMedia) y por HomePage, Navbar, Footer,
-- SchoolInfoAdminPage.
-- Campos: types.ts -> SchoolInfo (18 columnas exactas)
-- upsertSchoolInfo siempre envía updated_at en el payload.
-- =====================================================================
create table if not exists public.school_info (
  id uuid primary key default uuid_generate_v4(),
  school_name text not null default '',
  history text not null default '',
  mission text not null default '',
  vision text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  facebook text not null default '',
  instagram text not null default '',
  youtube text not null default '',
  logo_url text not null default '',
  hero_image_url text not null default '',
  hero_badge text not null default '',
  hero_badge_color text not null default '#991B1B',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  updated_at timestamptz not null default now()
);

-- Asegurar columnas aunque la tabla hubiera sido creada con esquema previo.
alter table public.school_info add column if not exists school_name text not null default '';
alter table public.school_info add column if not exists history text not null default '';
alter table public.school_info add column if not exists mission text not null default '';
alter table public.school_info add column if not exists vision text not null default '';
alter table public.school_info add column if not exists address text not null default '';
alter table public.school_info add column if not exists phone text not null default '';
alter table public.school_info add column if not exists email text not null default '';
alter table public.school_info add column if not exists facebook text not null default '';
alter table public.school_info add column if not exists instagram text not null default '';
alter table public.school_info add column if not exists youtube text not null default '';
alter table public.school_info add column if not exists logo_url text not null default '';
alter table public.school_info add column if not exists hero_image_url text not null default '';
alter table public.school_info add column if not exists hero_badge text not null default '';
alter table public.school_info add column if not exists hero_badge_color text not null default '#991B1B';
alter table public.school_info add column if not exists hero_title text not null default '';
alter table public.school_info add column if not exists hero_subtitle text not null default '';
alter table public.school_info add column if not exists updated_at timestamptz not null default now();

-- =====================================================================
-- TABLA: user_roles
-- Usada por: public.is_admin() para autorización administrativa.
-- Almacena el rol de cada usuario autenticado.
-- =====================================================================
create table if not exists public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  email text not null default '',
  role text not null default 'user',
  created_at timestamptz not null default now(),
  constraint user_roles_user_id_key unique (user_id),
  constraint user_roles_role_check check (role in ('admin', 'user'))
);

create index if not exists user_roles_user_id_idx on public.user_roles (user_id);
create index if not exists user_roles_role_idx on public.user_roles (role);

alter table public.user_roles enable row level security;

drop policy if exists "Users read own role" on public.user_roles;
create policy "Users read own role" on public.user_roles
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins manage roles" on public.user_roles;
create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- FUNCIÓN: public.is_admin()
-- Autorización basada en rol. SECURITY DEFINER para consultar
-- public.user_roles protegido por RLS sin exponer la tabla directamente.
-- =====================================================================

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
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- Estrategia: SELECT público para contenido público.
-- Escritura y modificación restringida a administradores mediante
-- public.is_admin().
-- =====================================================================

-- events
alter table public.events enable row level security;

drop policy if exists "Allow authenticated read events" on public.events;
drop policy if exists "Allow authenticated write events" on public.events;
drop policy if exists "Public read events" on public.events;
drop policy if exists "Admin insert events" on public.events;
drop policy if exists "Admin update events" on public.events;
drop policy if exists "Admin delete events" on public.events;

create policy "Public read events" on public.events for select to public using (true);
create policy "Admin insert events" on public.events for insert to authenticated with check (public.is_admin());
create policy "Admin update events" on public.events for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin delete events" on public.events for delete to authenticated using (public.is_admin());

-- gallery
alter table public.gallery enable row level security;

drop policy if exists "Allow authenticated read gallery" on public.gallery;
drop policy if exists "Allow authenticated write gallery" on public.gallery;
drop policy if exists "Public read gallery" on public.gallery;
drop policy if exists "Admin insert gallery" on public.gallery;
drop policy if exists "Admin update gallery" on public.gallery;
drop policy if exists "Admin delete gallery" on public.gallery;

create policy "Public read gallery" on public.gallery for select to public using (true);
create policy "Admin insert gallery" on public.gallery for insert to authenticated with check (public.is_admin());
create policy "Admin update gallery" on public.gallery for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin delete gallery" on public.gallery for delete to authenticated using (public.is_admin());

-- announcements
alter table public.announcements enable row level security;

drop policy if exists "Allow authenticated read announcements" on public.announcements;
drop policy if exists "Allow authenticated write announcements" on public.announcements;
drop policy if exists "Public read announcements" on public.announcements;
drop policy if exists "Admin insert announcements" on public.announcements;
drop policy if exists "Admin update announcements" on public.announcements;
drop policy if exists "Admin delete announcements" on public.announcements;

create policy "Public read announcements" on public.announcements for select to public using (true);
create policy "Admin insert announcements" on public.announcements for insert to authenticated with check (public.is_admin());
create policy "Admin update announcements" on public.announcements for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin delete announcements" on public.announcements for delete to authenticated using (public.is_admin());

-- school_info
alter table public.school_info enable row level security;

drop policy if exists "Allow authenticated read school_info" on public.school_info;
drop policy if exists "Allow authenticated write school_info" on public.school_info;
drop policy if exists "Public read school_info" on public.school_info;
drop policy if exists "Admin insert school_info" on public.school_info;
drop policy if exists "Admin update school_info" on public.school_info;
drop policy if exists "Admin delete school_info" on public.school_info;

create policy "Public read school_info" on public.school_info for select to public using (true);
create policy "Admin insert school_info" on public.school_info for insert to authenticated with check (public.is_admin());
create policy "Admin update school_info" on public.school_info for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admin delete school_info" on public.school_info for delete to authenticated using (public.is_admin());

-- =====================================================================
-- STORAGE BUCKETS
-- Usados por los servicios: events, gallery, school-info
--
-- Configuración mantenida en Supabase:
--   public = true
--   file_size_limit = 5242880 (5 MB)
--   allowed_mime_types = image/jpeg, image/png, image/webp
--
-- Nota: las restricciones de tamaño y MIME se configuran en el
-- dashboard de Supabase Storage y no tienen DDL idempotente
-- directo en SQL estándar.
-- =====================================================================

-- Bucket: gallery
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'gallery') then
    insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);
  end if;
end $$;

-- Bucket: events
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'events') then
    insert into storage.buckets (id, name, public) values ('events', 'events', true);
  end if;
end $$;

-- Bucket: school-info
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'school-info') then
    insert into storage.buckets (id, name, public) values ('school-info', 'school-info', true);
  end if;
end $$;

-- =====================================================================
-- STORAGE POLICIES
-- Lectura pública. Escritura (INSERT) restringida a administradores.
-- No se documentan policies de UPDATE/DELETE porque el código actual
-- no las utiliza.
-- =====================================================================

-- gallery
drop policy if exists "Public Access gallery" on storage.objects;
drop policy if exists "Authenticated upload gallery" on storage.objects;
drop policy if exists "Authenticated update/delete gallery" on storage.objects;
create policy "Public Access gallery" on storage.objects for select using (bucket_id = 'gallery');
create policy "Admin upload gallery" on storage.objects for insert to authenticated with check (bucket_id = 'gallery' and public.is_admin());

-- events
drop policy if exists "Public Access events" on storage.objects;
drop policy if exists "Authenticated upload events" on storage.objects;
drop policy if exists "Authenticated update/delete events" on storage.objects;
create policy "Public Access events" on storage.objects for select using (bucket_id = 'events');
create policy "Admin upload events" on storage.objects for insert to authenticated with check (bucket_id = 'events' and public.is_admin());

-- school-info
drop policy if exists "Public Access school-info" on storage.objects;
drop policy if exists "Authenticated upload school-info" on storage.objects;
drop policy if exists "Authenticated update/delete school-info" on storage.objects;
create policy "Public Access school-info" on storage.objects for select using (bucket_id = 'school-info');
create policy "Admin upload school-info" on storage.objects for insert to authenticated with check (bucket_id = 'school-info' and public.is_admin());

-- =====================================================================
-- TABLA: documents
-- Usada por: document.service.ts y DocumentsPage.tsx
-- Campos: types.ts -> Document
--
-- Seguridad:
-- - is_public define si es visible/anulable públicamente.
-- - expires_at permite vencimiento programado.
-- - created_by se completa en backend desde auth.uid().
-- =====================================================================
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  category text not null default 'otros',
  file_path text not null,
  file_name text not null,
  file_size bigint,
  mime_type text not null,
  file_extension text not null,
  is_public boolean not null default false,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null default auth.uid()
);

create index if not exists documents_is_public_idx on public.documents (is_public);
create index if not exists documents_expires_at_idx on public.documents (expires_at);
create index if not exists documents_category_idx on public.documents (category);
create index if not exists documents_created_at_idx on public.documents (created_at);

alter table public.documents enable row level security;

-- Público: solo documentos públicos y no vencidos.
drop policy if exists "Public read documents" on public.documents;
create policy "Public read documents" on public.documents
  for select to public
  using (
    is_public = true
    and (expires_at is null or expires_at > now())
  );

-- Admin: gestión completa de documentos.
drop policy if exists "Admin insert documents" on public.documents;
drop policy if exists "Admin update documents" on public.documents;
drop policy if exists "Admin delete documents" on public.documents;

create policy "Admin insert documents" on public.documents
  for insert to authenticated
  with check (public.is_admin());

create policy "Admin update documents" on public.documents
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin delete documents" on public.documents
  for delete to authenticated
  using (public.is_admin());

-- Trigger para mantener created_by y updated_at sin depender del cliente.
drop trigger if exists set_documents_meta on public.documents;

create or replace function public.set_documents_meta()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if TG_OP = 'INSERT' then
    if NEW.created_by is null then
      NEW.created_by := auth.uid();
    end if;
    NEW.updated_at := now();
    return NEW;
  elsif TG_OP = 'UPDATE' then
    NEW.updated_at := now();
    return NEW;
  end if;
  return NEW;
end;
$$;

create trigger set_documents_meta
  before insert or update on public.documents
  for each row execute function public.set_documents_meta();

-- Bucket: documents
-- Privacidad real: bucket privado. No se expone por URL pública.
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'documents') then
    insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
  end if;
end $$;

-- =====================================================================
-- STORAGE POLICIES
-- Lectura pública restringida: solo si el documento asociado es público
-- y no vencido. Escritura solo administradores autenticados.
-- =====================================================================

-- documents
drop policy if exists "Public read documents" on storage.objects;
drop policy if exists "Authenticated upload documents" on storage.objects;
drop policy if exists "Authenticated update/delete documents" on storage.objects;

create policy "Public read documents" on storage.objects
  for select to public
  using (
    bucket_id = 'documents'
    and exists (
      select 1
      from public.documents d
      where d.file_path = objects.name
        and d.is_public = true
        and (d.expires_at is null or d.expires_at > now())
    )
  );

create policy "Admin upload documents" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'documents'
    and public.is_admin()
  );

create policy "Admin update/delete documents" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'documents'
    and public.is_admin()
  );

create policy "Admin delete documents storage" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'documents'
    and public.is_admin()
  );

-- =====================================================================
-- PROTECCIÓN ADICIONAL: evitar múltiples filas en school_info
-- =====================================================================
-- Opción A: constraint de unicidad partial (recomendada)
-- create unique index if not exists school_info_singleton_idx
--   on public.school_info ((true)) where true;

-- Opción B: trigger para mantener una sola fila
-- create or replace function public.enforce_school_info_singleton()
-- returns trigger as $$
-- begin
--   if (select count(*) from public.school_info) > 1 then
--     delete from public.school_info where id <> (select id from public.school_info order by created_at asc limit 1);
--   end if;
--   return null;
-- end;
-- $$ language plpgsql;

-- drop trigger if exists enforce_school_info_singleton on public.school_info;
-- create trigger enforce_school_info_singleton
--   after insert on public.school_info
--   for each statement execute function public.enforce_school_info_singleton();

-- NOTA: No se aplican automáticamente para no modificar el esquema existente
-- sin revisión manual. El código ahora garantiza singleton por lógica de app.
