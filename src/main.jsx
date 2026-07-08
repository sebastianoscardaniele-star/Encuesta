import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const motivos = [
  { code: 1, title: 'No me interesó finalizar la compra', detail: 'Decidí no avanzar con la compra.' },
  { code: 2, title: 'Tuve inconvenientes con el QR de MODO', detail: 'No pude escanearlo o se venció.' },
  { code: 3, title: 'MODO no me mostró las cuotas necesarias', detail: 'No encontré la financiación esperada.' },
  { code: 4, title: 'El envío era demasiado caro', detail: 'El costo final del envío era alto.' },
  { code: 5, title: 'Tuve inconvenientes al pagar con mi tarjeta dentro de MODO', detail: 'El pago fue rechazado o no pude completarlo.' },
  { code: 6, title: 'Otro motivo', detail: 'Quiero contar brevemente qué pasó.' }
];

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    cart_id: params.get('cart_id') || '',
    order_id: params.get('order_id') || '',
    email: params.get('email') || '',
    tienda: params.get('tienda') || 'Tienda Ciudad',
    seller: params.get('seller') || '',
    motivo: params.get('motivo') || ''
  };
}

function App() {
  const meta = useMemo(getParams, []);
  const [selected, setSelected] = useState(meta.motivo ? Number(meta.motivo) : null);
  const [otherText, setOtherText] = useState('');
  const [status, setStatus] = useState('idle');

  async function submit(code = selected) {
    if (!code) return;
    if (code === 6 && !otherText.trim()) {
      setSelected(6);
      return;
    }
    setStatus('loading');
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...meta, motivo_code: code, motivo_texto: code === 6 ? otherText.trim() : '' })
      });
      if (!response.ok) throw new Error('No se pudo guardar la respuesta');
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://tu-proyecto.vercel.app';

  if (status === 'success') {
    return (
      <main className="page">
        <section className="card thanks">
          <img src="/logo-tienda-ciudad.png" className="logo" alt="Tienda Ciudad" />
          <div className="check">✓</div>
          <h1>¡Gracias por tu respuesta!</h1>
          <p>Tu opinión nos ayuda a mejorar el checkout y la experiencia de compra en Tienda Ciudad.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <div className="topbar">
          <img src="/logo-tienda-ciudad.png" className="logo" alt="Tienda Ciudad" />
          <span className="pill">Encuesta checkout</span>
        </div>

        <div className="hero">
          <h1>¿Nos ayudás a mejorar tu experiencia de compra?</h1>
          <p>Detectamos que dejaste un carrito sin finalizar. Seleccioná el motivo principal. Te va a llevar menos de 2 minutos.</p>
        </div>

        <div className="options">
          {motivos.map((motivo) => (
            <button key={motivo.code} className={'option ' + (selected === motivo.code ? 'selected' : '')} onClick={() => motivo.code === 6 ? setSelected(6) : submit(motivo.code)}>
              <span className="number">{motivo.code}</span>
              <span><b>{motivo.title}</b><small>{motivo.detail}</small></span>
            </button>
          ))}
        </div>

        {selected === 6 && (
          <div className="otherBox">
            <label>Contanos brevemente el motivo</label>
            <textarea value={otherText} onChange={(e) => setOtherText(e.target.value)} rows="4" placeholder="Escribí el motivo..." />
            <button className="primary" onClick={() => submit(6)} disabled={status === 'loading'}>{status === 'loading' ? 'Enviando...' : 'Enviar respuesta'}</button>
          </div>
        )}

        {status === 'error' && <p className="error">No pudimos guardar la respuesta. Probá nuevamente.</p>}

        <div className="emailBox">
          <h2>Links para el email</h2>
          <p>Usá estos links como botones en la campaña. Reemplazá las variables por los datos reales del carrito.</p>
          <code>{siteUrl}/?cart_id={'{{cart_id}}'}&email={'{{email}}'}&tienda=Tienda%20Ciudad&seller={'{{seller}}'}&motivo=1</code>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
