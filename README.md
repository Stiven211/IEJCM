# IEJCM

Sitio institucional del Colegio José Celestino Mutis: información del centro,
avisos, eventos, documentos, galería y canales de contacto.

**Producción:** https://colegio-jcm-mutis.vercel.app

Sitio público y panel de administración en una sola aplicación. Todo el
contenido se administra desde el panel y se guarda en Supabase: no hay
contenido escrito a mano en el código.

## Qué hace

**Sitio público**

- Portada con avisos destacados, próximos eventos y galería.
- Avisos con tipo y prioridad, fechas de vigencia, y filtrado por estado.
- Eventos con fecha, hora y lugar, y detalle individual.
- Galería de imágenes por categoría.
- Documentos institutionales con descarga firmada y fecha de expiración
  opcional.
- Sección "Nosotros" y página de contacto con formulario.
- Aviso global cuando se pierde la conexión, y hero que no depende de que
  cargue una imagen externa.

**Panel de administración**

- Gestión de avisos, eventos, galería, documentos e información institucional.
- Subida y reemplazo de imágenes y archivos con validación de tipo y tamaño.
- Las imágenes se reescalan a 1920 px en el navegador antes de subir: una foto
  de celular de 5,8 MB queda en 1,4 MB.
- Login con Supabase Auth. El acceso depende del rol, resuelto con políticas
  RLS en la base, no ocultando interfaces.

## Stack

| Capa | Tecnología |
|---|---|
| Interfaz | React 18, TypeScript |
| Build | Vite 6 |
| Estilos | Tailwind CSS 4, MUI 7, Radix UI |
| Datos | Supabase (Postgres, Auth, Storage) |
| Despliegue | Vercel |

Enrutado con React Router 7, formularios con React Hook Form, animaciones con
Motion.

## Estructura

```
src/
  app/            rutas, páginas y componentes propios
    components/
      admin/      panel de administración
      home/       secciones de la portada
      ui/         componentes base
    data/         catálogos (tipos de aviso, categorías)
    lib/          utilidades del panel (fechas, errores)
  components/     componentes compartidos entre público y admin
  lib/            cliente de Supabase, almacenamiento, logger
  services/       acceso a datos, una función por operación
  styles/         estilos globales
supabase/
  migrations/     historial de cambios de la base, en orden
  backups/        respaldos diarios del contenido
```

## Requisitos

- Node.js 24
- npm

## Instalación

```bash
npm install
cp .env.example .env
```

Y llenar `.env` con las claves del proyecto:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

La clave que viaja al navegador es `sb_publishable_`: es pública por diseño.
El acceso a los datos lo controlan las políticas RLS de la base. Las claves
sensibles no van en el repositorio, viven en los secretos de GitHub Actions.

## Comandos

```bash
npm run dev        # servidor de desarrollo
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # build de producción
```

## Base de datos

El esquema está en `supabase/schema.sql` y los cambios aplicados, en orden, en
`supabase/migrations/`. Las migraciones no se editan después de aplicadas: cada
cambio es un archivo nuevo.

Las tablas son `announcements`, `events`, `gallery`, `documents`,
`school_info`, `contact_messages` y `user_roles`.

## Automatización

| Workflow | Qué hace |
|---|---|
| `ci.yml` | typecheck, lint y build en cada push a `main` |
| `keep-alive.yml` | Consulta la base a diario. El plan Free de Supabase pausa un proyecto tras 7 días sin actividad; esto lo evita. También mide el espacio usado y avisa al 50 %, falla al 70 %. |
| `backup.yml` | Guarda un respaldo diario del contenido en `supabase/backups/`. El plan Free no hace respaldos automáticos, así que este los suple. |

## Si algo se rompe

Este sitio no tiene quien lo mantenga de forma continua. Estas son las
situaciones que se han dado o pueden darse, y qué hacer en cada una.

### 1. Alguien borró un aviso, un evento o una imagen por error

Los respaldos están en `supabase/backups/`, uno por día.

1. Abrir el archivo del día **anterior** al borrado.
2. Cada tabla es un bloque `insert into ... select * from jsonb_populate_record(...)`.
3. Pegar el bloque de la tabla afectada en el SQL Editor del proyecto Supabase.
4. Revisar el resultado y comprobar en el panel de administración.

Los archivos de imagen y de PDF **no** están en el respaldo: este guarda los
datos y la ruta del archivo, no el archivo. Para recuperar un archivo borrado
hay que volver a subirlo. Por eso es importante que el colegio conserve los
originales de sus documentos.

### 2. El sitio se ve caído

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://colegio-jcm-mutis.vercel.app/
```

- Responde `200`: el sitio está arriba, limpiar la caché del navegador.
- Responde `500`: el problema está en Vercel o en el build, no en Supabase.
- No responde: mirar la pestaña **Deployments** del proyecto de Vercel y ver
  si el último build falló. El log del build dice qué pasó.

### 3. El proyecto de Supabase aparece pausado

El plan Free pausa un proyecto tras 7 días sin actividad. `keep-alive.yml`
existe para evitarlo: consulta cuatro tablas todos los días.

Si aun así se pausa, la ventana para restaurar el proyecto es de **1 año**:

1. Entrar al panel de Supabase y restaurar el proyecto.
2. Revisar la pestaña **Actions** del repo: si el keep-alive lleva días sin
   correr, esa es la causa y hay que arreglarlo antes de que se repita.
3. Comprobar que el secreto `SUPABASE_ACCESS_TOKEN` sigue existiendo.

### 4. Nadie puede entrar al panel de administración

- **"Tu sesión expiró"**: el token de acceso venció. Cerrar sesión y volver a
  entrar. Si se repite, el secreto cambió o el proyecto está pausado.
- **No guarda nada y sale un error de conexión**: se cortó la red durante el
  guardado. El formulario conserva lo escrito, se puede reintentar.
- **No acepta la contraseña**: en plan Free el correo de confirmación puede
  estar pendiente. Revisar en Supabase, en `Authentication > Users`.

### 5. El panel se queda en "solo lectura"

Síntoma: todo falla con `cannot execute INSERT in a read-only transaction`.

La base pasó de 500 MB, que es el límite del plan Free. El colegio queda sin
guardar nada hasta intervened a mano:

```sql
set session characteristics as transaction read write;
-- borrar lo que sobre, sobre todo respaldos viejos
vacuum;
set default_transaction_read_only = 'off';
```

## Propiedad y licencia

El código de este repositorio es propiedad del Colegio José Celestino Mutis y
fue desarrollado para el colegio. Ver [LICENSE](LICENSE). No se concede permiso
para reutilizarlo sin autorización escrita de la dirección.

Verifiqué que ninguna credencial sensible está en el repositorio: `.env` está
en `.gitignore`, `.env.example` está vacío y la única clave que llega al
navegador es `sb_publishable_`, pública por diseño.

Los problemas de seguridad se reportan por correo, no abriendo issues.
Ver [SECURITY.md](SECURITY.md).