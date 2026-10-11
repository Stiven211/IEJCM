-- ============================================================================
-- Seccion de ICFES (examen de Estado Saber 11) con encendido manual.
--
-- El colegio enciende la seccion cuando empieza la temporada y la apaga
-- cuando termina. El interruptor vive en school_info para que sea un solo
-- lugar donde cambiarlo, igual que el estado de las inscripciones.
--
-- school_info es singleton y todas sus columnas son nullable, asi que agregar
-- columnas no rompe nada. DEFAULT false a proposito: si el colegio instala
-- esto y nunca lo prende, el sitio publico queda igual que antes.
--
-- Los estudiantes se guardan aparte de school_info porque school_info es de
-- una sola fila y esta lista crece. Se guardan ordenados por puntaje, que es
-- como los presenta el colegio: los mejores primero.
-- ============================================================================

alter table public.school_info
  add column if not exists icfes_visible boolean not null default false,
  add column if not exists icfes_text     text;

comment on column public.school_info.icfes_visible is
  'Si la seccion de ICFES esta publicada. Apagado, ni el aviso de la portada ni el link del menu aparecen.';
comment on column public.school_info.icfes_text is
  'Texto libre del colegio sobre la temporada de ICFES: fechas, donde Insider, que llevar. Lo escribe el administrador cada ano.';

-- ---------------------------------------------------------------------------
-- Estudiantes destacados
-- ---------------------------------------------------------------------------

create table if not exists public.icfes_students (
  id          uuid primary key default gen_random_uuid(),
  full_name   text    not null,
  -- El Saber 11 se califica de 0 a 500. El CHECK hace que el panel receive el
  -- error en el navegador con un mensaje claro, en vez de que Postgres lo
  -- rechace con un 23514 que el administrador no puede interpretar.
  score       numeric(6,2) not null check (score >= 0 and score <= 500),
  -- Grado. El colegio tiene 11-1, 11-2 y 11-3, pero se deja nullable: puede
  -- pasar que un laureado todavia no tenga grado asignado o se quiera publicar
  -- sin ese dato. El CHECK acepta vacio.
  grade       text check (grade is null or grade in ('11-1', '11-2', '11-3')),
  photo_url   text,
  -- Permite cargar a los tres grados y publicar de a poco: los que estan en
  -- false no salen en el sitio.
  active      boolean not null default true,
  created_at  timestamptz default now()
);

comment on table public.icfes_students is
  'Estudiantes destacados en el ICFES. Se muestran ordenados por puntaje, de mayor a menor.';
comment on column public.icfes_students.active is
  'Si el estudiante se publica. Permite cargar los tres grados y activar de a poco.';

-- Orden por puntaje: es como el colegio presenta a los destacados.
create index if not exists icfes_students_score_idx
  on public.icfes_students (score desc);

-- ---------------------------------------------------------------------------
-- Permisos
-- ---------------------------------------------------------------------------

alter table public.icfes_students enable row level security;

-- Publico lee, pero solo los activos. El filtro va en la politica y no solo en
-- el cliente: con using (true) un curl anon leeria los ocultos. Es el mismo
-- criterio que ya usan events y gallery.
drop policy if exists "Public can read active icfes students" on public.icfes_students;
create policy "Public can read active icfes students" on public.icfes_students
  for select to public using (active = true);

drop policy if exists "Admins can manage icfes students" on public.icfes_students;
create policy "Admins can manage icfes students" on public.icfes_students
  for all to authenticated using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Bucket de fotos
-- ---------------------------------------------------------------------------
-- Bucket aparte y no el de gallery a proposito: si el colegio decide limpiar
-- la galeria de un ano a otro, no se lleva por delante las fotos de los
-- estudiantes destacados.

-- `public` es una palabra reservada por el esquema, asi que el valor de la
-- columna se escribe como true y no como la palabra suelta.
insert into storage.buckets (id, name, public)
values ('icfes', 'icfes', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public Access to ICFES Photos" on storage.objects;
create policy "Public Access to ICFES Photos" on storage.objects
  for select to public using (bucket_id = 'icfes');

drop policy if exists "Admins can upload ICFES photos" on storage.objects;
create policy "Admins can upload ICFES photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'icfes' and is_admin());

drop policy if exists "Admins can update ICFES photos" on storage.objects;
create policy "Admins can update ICFES photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'icfes' and is_admin())
  with check (bucket_id = 'icfes' and is_admin());

drop policy if exists "Admins delete ICFES photos" on storage.objects;
create policy "Admins delete ICFES photos" on storage.objects
  for delete to authenticated using (bucket_id = 'icfes' and is_admin());