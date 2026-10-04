-- ============================================================================
-- Privilegios de ejecucion sobre las funciones de public.
--
-- reportado por el linter de Supabase: set_documents_meta() es SECURITY
-- DEFINER y era ejecutable por anon/authenticated a traves de /rest/v1/rpc.
-- Es un trigger, nunca un endpoint: solo service_role (y el propio trigger,
-- que corre con privilegios del owner) debe poder invocarla.
--
-- is_admin() si la consultan las policies de RLS, asi que authenticated la
-- necesita; anon y public no.
-- ============================================================================

revoke execute on function public.set_documents_meta() from public, anon, authenticated;
grant  execute on function public.set_documents_meta() to service_role;

revoke execute on function public.is_admin() from public, anon;
grant  execute on function public.is_admin() to authenticated;