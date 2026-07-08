# Encuesta de carritos abandonados - Tienda Ciudad

Proyecto **Vite + React** para desplegar en Vercel con estética Tienda Ciudad.

## Configuración en Vercel

- Framework Preset: `Vite`
- Install Command: `npm install --no-audit --no-fund --legacy-peer-deps`
- Build Command: `npm run build`
- Output Directory: `dist`

## Variables de entorno

Para guardar respuestas en Supabase, agregar:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SITE_URL`

## Base de datos

Ejecutar `supabase/schema.sql` en Supabase SQL Editor.

## URL de prueba

`/?cart_id=12345&email=cliente@demo.com&tienda=Tienda%20Ciudad&seller=Seller%20Demo`
