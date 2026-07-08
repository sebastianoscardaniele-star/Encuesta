import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseReady = Boolean(url && key && !url.includes('TU-PROYECTO'));
export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder');

export type Role = 'super_admin' | 'admin' | 'analista';
export type Profile = { id: string; nombre: string | null; email: string | null; rol: Role; activo: boolean };
