-- =====================================================================
-- Script de limpieza: restaurar unicidad de school_info
-- NO ejecutar automáticamente. Revisar y ejecutar manualmente en Supabase.
-- =====================================================================

-- 1. Mostrar cuántos registros existen actualmente
SELECT COUNT(*) AS total_registros FROM public.school_info;

-- 2. Identificar duplicados (si hay)
SELECT id, school_name, created_at, updated_at
FROM public.school_info
ORDER BY created_at ASC;

-- 3. Eliminar duplicados, conservando únicamente el registro más antiguo
-- (ajustar la condición si se desea conservar el más reciente)
DELETE FROM public.school_info
WHERE id NOT IN (
  SELECT id FROM public.school_info
  ORDER BY created_at ASC
  LIMIT 1
);

-- 4. Verificar que solo quedó uno
SELECT COUNT(*) AS total_registros FROM public.school_info;

-- 5. Confirmar registro único restante
SELECT id, school_name, created_at, updated_at
FROM public.school_info;
