# Política de Seguridad

Este sitio pertenece al Colegio José Celestino Mutis.

## Reportar un fallo

Si encuentras un problema de seguridad en este sitio, repórtalo por correo a
**kurregorojas@gmail.com**, que es el contacto técnico del proyecto, con:

- Qué se puede hacer y cómo se reproduce
- Qué parte del sistema se ve afectada (sitio público, panel de administración)
- Si es posible, capturas o pasos exactos

Si algo se puede arreglar y no depende de permisos, dilo también en el correo.
Lo que **no** debes hacer es abrir un issue público: los issues son visibles
para cualquiera y un problema sin corregir queda expuesto mientras se
resuelve.

## Qué se considera un fallo

- Cualquier persona sin sesión de administrador puede leer, crear, modificar o
  borrar contenido del colegio.
- Se puede obtener acceso al panel de administración sin credenciales válidas.
- Un documento, aviso o imagen se expone a un usuario que no debería verlo.
- Se puede ejecutar código en el navegador del visitante.

## Fuera de alcance

- El panel de administración rechaza valores que la base de datos no acepta y
  lo explica en pantalla. Es un dato de validación, no una vulnerabilidad.
- El contenido del sitio es público por diseño: avisos, eventos, documentos
  marcados como públicos y la galería.

## Contrato de respuesta

| Situación | Respuesta esperada |
|---|---|
| Confirmamos el fallo | Aviso dentro de 3 días hábiles |
| No es un fallo | Aviso dentro de 3 días hábiles, con la razón |
| Todo lo demás | Sin compromiso |

Los avisos del colegio se publican sin costo en `documents` y en el home.