-- ============================================================================
-- events y gallery: el filtro de Visibility pasa a la base de datos.
--
-- La policy publica era using (true) y el active = true vivia solo en el
-- cliente (event.service.ts:17, gallery.service.ts:15). Eso es un filtro de
-- UI, no de seguridad: un curl anon contra /rest/v1/events leia los eventos
-- desactivados igual. announcements ya lo hacia bien y sirve de referencia.
-- ============================================================================

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events" on public.events
  for select to public using (active = true);

drop policy if exists "Public can read gallery" on public.gallery;
create policy "Public can read gallery" on public.gallery
  for select to public using (active = true);