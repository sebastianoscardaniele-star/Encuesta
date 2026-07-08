const client = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
let currentRows = [];
const $ = id => document.getElementById(id);
function m(id, text, type='ok') { $(id).innerHTML = `<div class="message ${type}">${text}</div>`; }
async function checkSession(){ const { data } = await client.auth.getSession(); if(data.session){ showDash(); } }
async function showDash(){ $('loginBox').classList.add('hidden'); $('dashboard').classList.remove('hidden'); $('logout').classList.remove('hidden'); await loadData(); }
$('login').addEventListener('click', async()=>{
  const email=$('email').value.trim(), password=$('password').value;
  const { error } = await client.auth.signInWithPassword({email,password});
  if(error){ m('loginMsg','No pudimos ingresar. Revisá email, contraseña o que el usuario exista en Supabase Auth.','err'); return; }
  showDash();
});
$('logout').addEventListener('click', async()=>{ await client.auth.signOut(); location.reload(); });
function esc(v){ return String(v ?? '').replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
async function loadData(){
  let q = client.from('encuesta_carritos').select('*').order('created_at',{ascending:false}).limit(5000);
  if($('from').value) q = q.gte('created_at', $('from').value + 'T00:00:00');
  if($('to').value) q = q.lte('created_at', $('to').value + 'T23:59:59');
  if($('tienda').value.trim()) q = q.ilike('tienda', `%${$('tienda').value.trim()}%`);
  if($('seller').value.trim()) q = q.ilike('seller', `%${$('seller').value.trim()}%`);
  const { data, error } = await q;
  if(error){ alert('Error leyendo Supabase. Revisá la policy SELECT para usuarios autenticados.'); console.error(error); return; }
  const s = $('search').value.trim().toLowerCase();
  currentRows = (data || []).filter(r => !s || String(r.email||'').toLowerCase().includes(s) || String(r.cart_id||'').toLowerCase().includes(s) || String(r.order_id||'').toLowerCase().includes(s));
  render();
}
function countBy(field){ return currentRows.reduce((a,r)=>{ const k=r[field] || 'Sin dato'; a[k]=(a[k]||0)+1; return a; },{}); }
function renderBars(id, data){
  const max = Math.max(1,...Object.values(data));
  $(id).innerHTML = Object.entries(data).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div><div class="row" style="justify-content:space-between"><b>${esc(k)}</b><span>${v}</span></div><div class="bar"><span style="width:${(v/max)*100}%"></span></div></div>`).join('') || '<p class="muted">Sin datos</p>';
}
function render(){
  $('total').textContent = currentRows.length;
  const today = new Date().toISOString().slice(0,10);
  $('today').textContent = currentRows.filter(r => String(r.created_at||'').slice(0,10)===today).length;
  $('otros').textContent = currentRows.filter(r => r.motivo === 'Otro motivo').length;
  const motivos = countBy('motivo');
  $('topMotivo').textContent = Object.entries(motivos).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';
  renderBars('motivosChart', motivos);
  renderBars('tiendasChart', countBy('tienda'));
  $('rows').innerHTML = currentRows.map(r=>`<tr><td>${esc(new Date(r.created_at).toLocaleString('es-AR'))}</td><td>${esc(r.email)}</td><td>${esc(r.cart_id)}</td><td>${esc(r.order_id)}</td><td>${esc(r.tienda)}</td><td>${esc(r.seller)}</td><td>${esc(r.motivo)}</td><td>${esc(r.motivo_texto)}</td></tr>`).join('');
}
function downloadCSV(){
  const headers=['created_at','email','cart_id','order_id','tienda','seller','motivo','motivo_texto','user_agent'];
  const csv=[headers.join(',')].concat(currentRows.map(r=>headers.map(h=>`"${String(r[h]??'').replaceAll('"','""')}"`).join(','))).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='encuesta_carritos.csv'; a.click(); URL.revokeObjectURL(url);
}
$('apply').addEventListener('click', loadData); $('clear').addEventListener('click',()=>{['from','to','tienda','seller','search'].forEach(id=>$(id).value=''); loadData();}); $('csv').addEventListener('click',downloadCSV);
checkSession();
