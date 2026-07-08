# Customer Insights Portal

Aplicación corporativa para encuestas de carritos abandonados con:

- React + Vite + TypeScript.
- Supabase Auth.
- Supabase Database.
- Roles: `super_admin`, `admin`, `analista`.
- Vista cliente `/s` para responder encuesta.
- Panel administrador con dashboard, campañas, filtros y descarga CSV.
- Estética Tienda Ciudad.

## 1. Supabase

Crear un proyecto en Supabase y ejecutar:

`supabase/schema.sql`

Luego crear el usuario administrador:

1. Supabase > Authentication > Users > Add user.
2. Crear email y contraseña.
3. Copiar el UUID del usuario.
4. Ejecutar `supabase/create-admin.sql` reemplazando `PEGAR_UUID_DEL_USUARIO`.

## 2. Variables de entorno

En local crear `.env` copiando `.env.example`.

En Vercel cargar estas variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Se obtienen en Supabase > Project Settings > API.

## 3. Deploy en Vercel

Framework Preset: `Vite`

Build Command:

`npm run build`

Output Directory:

`dist`

Install Command:

`npm install --no-audit --no-fund`

## 4. URLs

Panel administrador:

`https://tu-dominio.vercel.app/`

Encuesta cliente:

`https://tu-dominio.vercel.app/s?email=cliente@demo.com&tienda=Tienda%20Ciudad&seller=Seller%20Demo&cart_id=12345`

## 5. Descarga de información

Desde el panel: Respuestas > Descargar CSV.

También se puede exportar desde Supabase > Table Editor > `survey_responses`.
