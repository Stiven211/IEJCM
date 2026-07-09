-- Tabla de información institucional para el IEJCM
create table public.school_info (
  id uuid default gen_random_uuid() primary key,
  school_name text,
  history text,
  mission text,
  vision text,
  address text,
  phone text,
  email text,
  facebook text,
  instagram text,
  youtube text,
  logo_url text,
  hero_image_url text,
  updated_at timestamp with time zone default now()
);

-- Insertar una fila inicial por defecto
insert into public.school_info (school_name)
values ('Colegio José Celestino Mutis');

-- Políticas de seguridad básicas
alter table public.school_info enable row level security;

create policy "Allow authenticated read" on public.school_info
  for select to authenticated using (true);

create policy "Allow authenticated write" on public.school_info
  for all to authenticated using (true) with check (true);

-- Bucket de storage para galería (si no existe)
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);
-- create policy "Public Access" on storage.objects for select using (bucket_id = 'gallery');
-- create policy "Authenticated upload" on storage.objects for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
-- create policy "Authenticated update/delete" on storage.objects for update, delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');
