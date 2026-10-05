-- ============================================================================
-- NIT y DANE como datos, no como texto fijo en el componente.
--
-- Estaban hardcodeados en Footer.tsx con valores inventados:
--
--   NIT: 892.099.311-7 · DANE: 150001006434
--
-- Son identificadores oficiales de una institucion educativa colombiana: el
-- NIT es el tributario y el DANE la identifica en el sistema educativo
-- nacional. Mostrar unos que no corresponden al colegio es un problema de
-- credibilidad, y no se puede adivinar cuales son por codigo: los carga el
-- administrador desde Informacion Institucional.
--
-- school_info es singleton y todas sus columnas son nullable, asi que agregar
-- columnas no rompe nada. No se pone DEFAULT a proposito: el estado correcto
-- por defecto es "todavia no existe", para no volver a mostrar un dato
-- inventado.
-- ============================================================================

alter table public.school_info
  add column if not exists nit       text,
  add column if not exists dane_code text;

comment on column public.school_info.nit is
  'NIT de la institucion educativa. Se muestra en el footer solo si tiene valor.';

comment on column public.school_info.dane_code is
  'Codigo DANE de la institucion educativa. Se muestra en el footer solo si tiene valor.';
