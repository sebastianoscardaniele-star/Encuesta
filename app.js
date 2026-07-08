const client = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
const params = new URLSearchParams(window.location.search);
const msg = document.getElementById('msg');
const options = document.getElementById('options');
const otherBox = document.getElementById('otherBox');
function showMessage(text, type='ok') { msg.innerHTML = `<div class="message ${type}">${text}</div>`; }
function metadata() {
  return {
    cart_id: params.get('cart_id') || params.get('carrito') || null,
    order_id: params.get('order_id') || params.get('orden') || null,
    email: params.get('email') || null,
    tienda: params.get('tienda') || 'Tienda Ciudad',
    seller: params.get('seller') || null,
    user_agent: navigator.userAgent
  };
}
async function saveAnswer(motivo, motivo_texto=null) {
  showMessage('Guardando respuesta...', 'ok');
  const payload = { ...metadata(), motivo, motivo_texto };
  const { error } = await client.from('encuesta_carritos').insert([payload]);
  if (error) {
    console.error(error);
    showMessage('No pudimos guardar la respuesta. Revisá la configuración de Supabase o intentá nuevamente.', 'err');
    return;
  }
  options.classList.add('hidden');
  otherBox.classList.add('hidden');
  showMessage('¡Gracias! Tu respuesta fue registrada correctamente.', 'ok');
}
document.querySelectorAll('[data-motivo]').forEach(btn => {
  btn.addEventListener('click', () => {
    const motivo = btn.dataset.motivo;
    if (motivo === 'Otro motivo') { options.classList.add('hidden'); otherBox.classList.remove('hidden'); return; }
    saveAnswer(motivo);
  });
});
document.getElementById('sendOther').addEventListener('click', () => {
  const text = document.getElementById('motivoTexto').value.trim();
  saveAnswer('Otro motivo', text || null);
});
document.getElementById('cancelOther').addEventListener('click', () => {
  otherBox.classList.add('hidden'); options.classList.remove('hidden'); msg.innerHTML='';
});
