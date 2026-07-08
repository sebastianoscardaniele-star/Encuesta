# Encuesta de carrito abandonado - Tienda Ciudad

Proyecto estático para Vercel + Supabase. No usa npm, no tiene build y no debería ejecutar npm install.

## 1. Crear tabla en Supabase

1. Entrar a Supabase.
2. Ir a SQL Editor.
3. Copiar y ejecutar el contenido de `supabase.sql`.

## 2. Configurar conexión

Editar `config.js` y reemplazar:

```js
window.SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
window.SUPABASE_ANON_KEY = "TU_ANON_KEY";
```

Los datos están en Supabase > Project Settings > API.

## 3. Subir a Vercel

Configuración recomendada:

- Framework Preset: Other
- Install Command: vacío
- Build Command: vacío
- Output Directory: vacío

## 4. URL para enviar por mail

Ejemplo:

```
https://TU-DOMINIO.vercel.app/?cart_id=12345&email=cliente@demo.com&tienda=Tienda%20Ciudad&seller=Seller%20Demo
```

También acepta `order_id` si querés identificar la orden:

```
https://TU-DOMINIO.vercel.app/?cart_id=12345&order_id=98765&email=cliente@demo.com&tienda=Tienda%20Ciudad&seller=Seller%20Demo
```

## 5. Qué datos guarda

- cart_id
- order_id
- customer_email
- tienda
- seller
- motivo_code
- motivo_label
- motivo_texto si eligió “Otro motivo”
- source_url
- user_agent
- created_at

## 6. Descargar respuestas

En Supabase ir a Table Editor > abandoned_cart_survey > Export CSV.
