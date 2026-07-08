import { createClient } from '@supabase/supabase-js';

const motivos = {
  1: 'No me interesó finalizar la compra',
  2: 'Tuve inconvenientes con el QR de MODO',
  3: 'MODO no me mostró las cuotas necesarias',
  4: 'El envío era demasiado caro',
  5: 'Tuve inconvenientes al pagar con mi tarjeta dentro de MODO',
  6: 'Otro motivo'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const code = Number(body?.motivo_code);
    if (!motivos[code]) return res.status(400).json({ ok: false, error: 'Motivo inválido' });

    const payload = {
      cart_id: body.cart_id || null,
      order_id: body.order_id || null,
      customer_email: body.email || null,
      tienda: body.tienda || 'Tienda Ciudad',
      seller: body.seller || null,
      motivo_code: code,
      motivo_label: motivos[code],
      motivo_texto: body.motivo_texto || null,
      user_agent: req.headers['user-agent'] || null,
      referrer: req.headers.referer || null
    };

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { error } = await supabase.from('abandoned_cart_survey').insert(payload);
      if (error) throw error;
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
