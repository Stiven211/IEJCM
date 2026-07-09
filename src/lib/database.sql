-- Habilitar extensión si no existe
create extension if not exists "uuid-ossp";

-- Tabla events: agregar active si no existe
alter table public.events add column if not exists active boolean default true;

-- Tabla gallery: agregar active si no existe
alter table public.gallery add column if not exists active boolean default true;

-- Tabla school_info: agregar hero_badge_color si no existe
alter table public.school_info add column if not exists hero_badge_color text default '#991B1B';

-- RLS events
alter table public.events enable row level security;
drop policy if exists "Allow authenticated read events" on public.events;
drop policy if exists "Allow authenticated write events" on public.events;
create policy "Allow authenticated read events" on public.events for select to authenticated using (true);
create policy "Allow authenticated write events" on public.events for all to authenticated using (true) with check (true);

-- RLS gallery
alter table public.gallery enable row level security;
drop policy if exists "Allow authenticated read gallery" on public.gallery;
drop policy if exists "Allow authenticated write gallery" on public.gallery;
create policy "Allow authenticated read gallery" on public.gallery for select to authenticated using (true);
create policy "Allow authenticated write gallery" on public.gallery for all to authenticated using (true) with check (true);

-- RLS announcements
alter table public.announcements enable row level security;
drop policy if exists "Allow authenticated read announcements" on public.announcements;
drop policy if exists "Allow authenticated write announcements" on public.announcements;
create policy "Allow authenticated read announcements" on public.announcements for select to authenticated using (true);
create policy "Allow authenticated write announcements" on public.announcements for all to authenticated using (true) with check (true);

-- RLS school_info
alter table public.school_info enable row level security;
drop policy if exists "Allow authenticated read school_info" on public.school_info;
drop policy if exists "Allow authenticated write school_info" on public.school_info;
create policy "Allow authenticated read school_info" on public.school_info for select to authenticated using (true);
create policy "Allow authenticated write school_info" on public.school_info for all to authenticated using (true) with check (true);

-- Bucket gallery (idempotente)
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'gallery') then
    insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);
  end if;
end $$;

-- Policies storage gallery (idempotentes)
drop policy if exists "Public Access gallery" on storage.objects;
drop policy if exists "Authenticated upload gallery" on storage.objects;
drop policy if exists "Authenticated update/delete gallery" on storage.objects;

create policy "Public Access gallery" on storage.objects for select using (bucket_id = 'gallery');
create policy "Authenticated upload gallery" on storage.objects for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy "Authenticated update/delete gallery" on storage.objects for update, delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');
