# Customer Insights Portal - version estatica sin npm

Esta version no usa npm, Vite ni build. Es ideal para Vercel cuando npm queda trabado.

## Deploy en Vercel

Framework Preset: Other
Install Command: vacio
Build Command: vacio
Output Directory: vacio

La raiz del proyecto debe tener estos archivos:
- index.html
- admin.html
- config.js
- supabase.sql
- assets/logo-tienda-ciudad.png

## Configuracion Supabase

1. Crear proyecto en Supabase.
2. Ir a Project Settings > API.
3. Copiar Project URL y anon public key.
4. Pegarlas en config.js.
5. Ejecutar supabase.sql en SQL Editor.
6. Crear usuario admin en Authentication > Users > Add user.
7. Copiar el UUID del usuario.
8. En Table Editor > profiles, crear el perfil con role = super_admin.

## URLs

Encuesta cliente:
/index.html?campaign=carrito-abandonado&email=cliente@demo.com&cart_id=123&store=Tienda%20Ciudad&seller=Seller%20Demo

Admin:
/admin.html
