# Respaldos del contenido

Snapshots diarios del contenido del colegio, generados por
`.github/workflows/backup.yml`.

Un archivo por día, con nombre `AAAA-MM-DD.sql`. Cada tabla va en su propio
bloque y es un `INSERT` listo para pegar en el SQL Editor de Supabase:

```sql
insert into public.announcements
select * from jsonb_populate_recordset(null::public.announcements, $iejson$[...]$iejson$::jsonb);
```

## Qué hay y qué no

**Sí:** avisos, eventos, galería, documentos (con sus datos) e información
institucional.

**No:** los archivos de Storage (los PDF y las fotos), las cuentas de
administración (viven en Supabase Auth) y el código (está en el historial de
git).

Por eso es importante que el colegio conserve los originales de sus
documentos: si se borra un PDF de Storage, este respaldo no lo recupera.

## Retención

14 días de respaldos diarios, más los de cada lunes que se conservan 90 días.

## Cómo restaurar

Ver la sección **"Si algo se rompe"** del README principal, escenario 1.