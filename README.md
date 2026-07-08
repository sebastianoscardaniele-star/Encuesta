# Encuesta Tienda Ciudad + Panel Administrador

Proyecto estatico para Vercel, sin npm, sin Vite y sin build.

## Vistas

- `index.html`: encuesta publica para clientes.
- `admin.html`: panel administrador con login, KPIs, filtros y descarga CSV.

## 1. Configurar Supabase

1. Entrar a Supabase.
2. Abrir el proyecto.
3. Ir a SQL Editor > New query.
4. Pegar y ejecutar el contenido de `supabase.sql`.

## 2. Crear usuario administrador

1. Ir a Supabase > Authentication > Users.
2. Crear un usuario con email y password.
3. Ese usuario sera el login del panel `admin.html`.

Importante: con esta version, cualquier usuario autenticado de Supabase puede leer el panel. Para uso interno simple alcanza. Si necesitás roles de administrador, se puede ampliar.

## 3. Configurar URL y anon key

Editar `config.js` y reemplazar:

```js
window.SUPABASE_URL = "PEGAR_URL_DE_SUPABASE";
window.SUPABASE_ANON_KEY = "PEGAR_ANON_KEY_DE_SUPABASE";
```

Los datos estan en Supabase > Project Settings > API:

- Project URL
- anon public key

## 4. Subir a Vercel

Configuracion recomendada:

- Framework Preset: Other
- Install Command: vacio
- Build Command: vacio
- Output Directory: vacio

Si Vercel intenta correr `vite build`, borrar el proyecto anterior o limpiar la configuracion del proyecto.

## 5. URL para enviar en emails

Ejemplo:

```text
https://TU-DOMINIO.vercel.app/index.html?cart_id=12345&email=cliente@demo.com&tienda=Tienda%20Ciudad&seller=Seller%20Demo
```

Tambien soporta:

- `order_id`
- `carrito`
- `orden`

## 6. Descargar datos

Entrar a:

```text
https://TU-DOMINIO.vercel.app/admin.html
```

Luego:

1. Login con usuario administrador.
2. Aplicar filtros si hace falta.
3. Click en Descargar CSV.

