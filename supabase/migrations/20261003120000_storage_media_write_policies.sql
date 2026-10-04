-- ============================================================================
-- Policies de escritura (UPDATE / DELETE) en los buckets de imagenes publicos.
--
-- Antes solo existian policies de INSERT para admins en gallery, events y
-- school-info. Sin UPDATE ni DELETE:
--   - remove() devolvia 403, y el catch de gallery.service.ts se lo tragaba:
--     el admin vea "eliminado" pero el archivo se quedaba en Storage.
--   - reemplazar una imagen por otra en la misma ruta era imposible.
--
-- is_admin() va envuelto en (select ...) para que el planner lo evalue una vez
-- por statement en vez de una vez por fila.
-- ============================================================================

do $$
declare
  b text;
begin
  foreach b in array array['gallery','events','school-info'] loop
    execute format('drop policy if exists %I on storage.objects', 'Admins update ' || b);
    execute format('drop policy if exists %I on storage.objects', 'Admins delete ' || b);

    execute format($f$
      create policy %I on storage.objects
        for update to authenticated
        using      (bucket_id = '%s' and (select public.is_admin()))
        with check (bucket_id = '%s' and (select public.is_admin()))
    $f$, 'Admins update ' || b, b, b);

    execute format($f$
      create policy %I on storage.objects
        for delete to authenticated
        using (bucket_id = '%s' and (select public.is_admin()))
    $f$, 'Admins delete ' || b, b);
  end loop;
end $$;