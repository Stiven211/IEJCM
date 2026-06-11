-- Crear tabla de eventos para AdminDashboard
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  "fullDescription" text,
  date date not null,
  time text not null,
  "endTime" text,
  location text not null,
  category text not null check (category in ('academic', 'cultural', 'sports', 'institutional')),
  image text,
  created_at timestamp with time zone default now()
);

-- Índices para búsquedas eficientes
create index idx_events_date on events(date);
create index idx_events_category on events(category);