-- 1) Crear usuario desde Supabase > Authentication > Users > Add user.
-- 2) Copiar el UUID del usuario y reemplazarlo abajo.

insert into public.profiles (id, nombre, email, rol, activo)
values ('PEGAR_UUID_DEL_USUARIO', 'Sebastian Daniele', 'sebastian.daniele@avenida.com', 'super_admin', true)
on conflict (id) do update set rol = 'super_admin', activo = true;
