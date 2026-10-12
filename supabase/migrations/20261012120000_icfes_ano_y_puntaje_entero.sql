-- ============================================================================
-- Puntajes enteros y año de examen.
--
-- Dos ajustes que pidio el colegio:
--
-- 1. Los puntajes del Saber 11 son enteros. Estaban en numeric(6,2) y se
--    veian como "356.0", que no es como se lee un resultado. Pasan a integer.
--
-- 2. Poder comparar temporadas. Se agrega exam_year para saber a que año
--    pertenece cada estudiante, y asi agruparlos en el sitio por año en vez
--    de tener una sola lista mezclada.
--
-- La migración de numeric(6,2) a integer redondea: 356.00 pasa a 356. Es
-- seguro porque no hay decimales, solo el ".00" que agregaba el formato.
-- ============================================================================

alter table public.icfes_students
  alter column score type integer using round(score)::integer;

-- El CHECK ahora es sobre integer. Se suelta y se vuelve a poner porque el
-- anterior comparaba contra un numeric y Postgres no lo reutiliza tal cual.
alter table public.icfes_students drop constraint if exists icfes_students_score_check;

alter table public.icfes_students
  add constraint icfes_students_score_check check (score >= 0 and score <= 500);

comment on column public.icfes_students.score is
  'Puntaje del Saber 11, entero de 0 a 500.';

-- Año del examen. Nullable a proposito: si un estudiante se carga sin año,
-- la pagina lo muestra en "Sin año" en vez de inventarle uno.
alter table public.icfes_students
  add column if not exists exam_year integer check (exam_year is null or exam_year between 2000 and 2100);

comment on column public.icfes_students.exam_year is
  'Ano del examen de ICFES al que corresponde este estudiante. Null se muestra como "Sin ano".';

-- Los estudiantes que ya estaban cargados se asignan al ano en curso: la
-- seccion es nueva y todavia no hay temporadas separadas que respetar.
update public.icfes_students
set exam_year = extract(year from now())::integer
where exam_year is null;

-- El orden del sitio pasa a ser por año y luego por puntaje, que es como se
-- leen los resultados de varios años.
drop index if exists public.icfes_students_score_idx;

create index if not exists icfes_students_ano_score_idx
  on public.icfes_students (exam_year desc nulls last, score desc);