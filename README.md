# IEJCM

Sitio institucional del IEJCM para publicar información del centro, avisos, eventos, documentos, galería y canales de contacto.

## Requisitos

- Node.js
- npm

## Instalación

```bash
npm ci
Copy-Item .env.example .env
```

`npm ci` usa `install-strategy=shallow` según `.npmrc` del proyecto.

Configura en `.env` las variables siguientes, sin subir valores reales al repositorio:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Comandos

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

La migración SQL de `contact_messages` se ejecuta manualmente en el SQL Editor de Supabase.

No subas `.env`, claves `service_role`, tokens ni otras credenciales. La rama principal es `main`; cada Task debe trabajarse en una rama separada.