-- ============================================================================
-- Homogeneiza los campos de imagen: siempre un path, nunca una URL absoluta.
--
-- La columna quedo mezclada porque uploadToStorage() (src/lib/storage.ts)
-- devuelve el path, mientras las primeras filas se cargaron a mano con la URL
-- completa. 3 filas con URL absoluta y 9 con path desnudo.
--
-- El bug visible: los componentes hacen src={image_url} directo, asi que las
-- 9 filas con path desnudo pedian "1790984580764-sx0y8altgk.png" contra el
-- origen del sitio, Vite devolvia index.html con 200 y la imagen no cargaba.
-- En / la consola mostraba:
--   ROTA http://localhost:5199/1790984580764-sx0y8altgk.png
--
-- La app ahora resuelve ambos formatos en la frontera de los servicios
-- (resolveAssetUrl / toStoragePath en src/lib/storage.ts), asi que este UPDATE
-- es de higiene de datos, no un requisito de fonctionnement: fija el criterio
-- para que las filas nuevas y viejas se comporten igual.
-- ============================================================================

update public.gallery
set image_url = regexp_replace(
      image_url,
      '^https?://[^/]+/storage/v1/object/public/gallery/',
      '')
where image_url ~ '^https?://[^/]+/storage/v1/object/public/gallery/';

update public.events
set image = regexp_replace(
      image,
      '^https?://[^/]+/storage/v1/object/public/events/',
      '')
where image ~ '^https?://[^/]+/storage/v1/object/public/events/';

update public.school_info
set logo_url = nullif(regexp_replace(
      coalesce(logo_url, ''),
      '^https?://[^/]+/storage/v1/object/public/school-info/',
      ''), '')
where logo_url ~ '^https?://[^/]+/storage/v1/object/public/school-info/';

update public.school_info
set hero_image_url = nullif(regexp_replace(
      coalesce(hero_image_url, ''),
      '^https?://[^/]+/storage/v1/object/public/school-info/',
      ''), '')
where hero_image_url ~ '^https?://[^/]+/storage/v1/object/public/school-info/';