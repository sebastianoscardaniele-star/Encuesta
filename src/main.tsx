import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase, supabaseReady, Profile } from './supabase';
import './styles.css';

type Campaign = { id: string; nombre: string; estado: string; titulo: string; descripcion: string; color: string };
type ResponseRow = { id: string; created_at: string; email: string; tienda: string; seller: string; motivo: string; motivo_texto: string | null; campaign_id: string };

const motives = [
  'No me interesó finalizar la compra',
  'Tuve inconvenientes con el QR de MODO',
  'MODO no me mostró las cuotas necesarias',
  'El envío era demasiado caro',
  'Tuve inconvenientes a la hora de pagar con mi tarjeta dentro de MODO',
  'Otro motivo'
];

function csv(rows: ResponseRow[]) {
  const headers = ['fecha','email','tienda','seller','motivo','motivo_texto','campaign_id'];
  const body = rows.map(r => headers.map(h => `"${String((r as any)[h] ?? '').replaceAll('"','""')}"`).join(','));
  const blob = new Blob([[headers.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `encuestas-${new Date().toISOString().slice(0,10)}.csv`; a.click();
}

function Login() {
  const [email,setEmail] = useState(''); const [password,setPassword] = useState(''); const [msg,setMsg] = useState('');
  async function signIn(e: React.FormEvent) {
    e.preventDefault(); setMsg('Ingresando...');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : 'Ingreso correcto');
  }
  return <div className="login-bg"><form className="login-card" onSubmit={signIn}>
    <img src="/logo-tienda-ciudad.png" className="logo"/><h1>Customer Insights</h1><p>Panel interno de encuestas y abandono de checkout.</p>
    {!supabaseReady && <div className="alert">Falta configurar .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.</div>}
    <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@empresa.com" /></label>
    <label>Contraseña<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
    <button>Ingresar</button>{msg && <small>{msg}</small>}
  </form></div>
}

function Survey() {
  const params = new URLSearchParams(location.search);
  const [selected,setSelected] = useState(''); const [other,setOther] = useState(''); const [status,setStatus] = useState('');
  async function submit(motivo = selected) {
    if (!motivo) return;
    if (!supabaseReady) { setStatus('Falta configurar Supabase.'); return; }
    if (motivo === 'Otro motivo' && !other.trim()) { setStatus('Contanos brevemente el motivo.'); return; }
    setStatus('Guardando respuesta...');
    const { error } = await supabase.from('survey_responses').insert({
      campaign_id: params.get('campaign') || null,
      email: params.get('email') || null,
      tienda: params.get('tienda') || 'Tienda Ciudad',
      seller: params.get('seller') || null,
      cart_id: params.get('cart_id') || null,
      order_id: params.get('order_id') || null,
      motivo,
      motivo_texto: motivo === 'Otro motivo' ? other : null,
      user_agent: navigator.userAgent
    });
    setStatus(error ? `No se pudo guardar: ${error.message}` : '¡Gracias! Tu respuesta fue registrada correctamente.');
  }
  return <div className="survey-bg"><main className="survey-card"><img src="/logo-tienda-ciudad.png" className="logo"/><h1>Queremos conocer tu experiencia</h1><p>Vimos que dejaste un carrito sin finalizar. Tu respuesta nos ayuda a mejorar el servicio.</p>
    <div className="motives">{motives.map(m => <button key={m} className={selected===m?'choice active':'choice'} onClick={()=>{setSelected(m); if(m!=='Otro motivo') submit(m)}}>{m}</button>)}</div>
    {selected==='Otro motivo' && <div className="other"><textarea placeholder="Contanos brevemente qué pasó" value={other} onChange={e=>setOther(e.target.value)} /><button onClick={()=>submit()}>Enviar</button></div>}
    {status && <div className="status">{status}</div>}
  </main></div>
}

function AppShell({profile}:{profile:Profile}) {
  const [page,setPage] = useState('dashboard'); const [rows,setRows] = useState<ResponseRow[]>([]); const [campaigns,setCampaigns] = useState<Campaign[]>([]);
  const [filters,setFilters] = useState({ tienda:'', seller:'', motivo:'' });
  async function load() {
    const { data } = await supabase.from('survey_responses').select('*').order('created_at',{ascending:false}).limit(1000);
    setRows((data || []) as ResponseRow[]);
    const { data: c } = await supabase.from('campaigns').select('*').order('created_at',{ascending:false}); setCampaigns((c || []) as Campaign[]);
  }
  useEffect(()=>{ load(); },[]);
  const filtered = rows.filter(r => (!filters.tienda || r.tienda?.toLowerCase().includes(filters.tienda.toLowerCase())) && (!filters.seller || r.seller?.toLowerCase().includes(filters.seller.toLowerCase())) && (!filters.motivo || r.motivo===filters.motivo));
  const counts = useMemo(()=> Object.entries(filtered.reduce((a:any,r)=>{a[r.motivo]=(a[r.motivo]||0)+1; return a},{})).sort((a:any,b:any)=>b[1]-a[1]),[filtered]);
  return <div className="layout"><aside><img src="/logo-tienda-ciudad.png"/><b>Insights Portal</b><button onClick={()=>setPage('dashboard')}>Dashboard</button><button onClick={()=>setPage('respuestas')}>Respuestas</button><button onClick={()=>setPage('campañas')}>Campañas</button>{profile.rol==='super_admin' && <button onClick={()=>setPage('usuarios')}>Usuarios</button>}<button onClick={()=>supabase.auth.signOut()}>Salir</button></aside>
  <section className="content"><header><h2>{page[0].toUpperCase()+page.slice(1)}</h2><span>{profile.nombre || profile.email} · {profile.rol}</span></header>
  {page==='dashboard' && <><div className="kpis"><div><b>{rows.length}</b><span>Respuestas totales</span></div><div><b>{filtered.length}</b><span>Filtradas</span></div><div><b>{counts[0]?.[0] || '-'}</b><span>Motivo principal</span></div><div><b>{new Set(rows.map(r=>r.seller).filter(Boolean)).size}</b><span>Sellers</span></div></div><div className="panel"><h3>Motivos de abandono</h3>{counts.map(([k,v]:any)=><div className="bar" key={k}><span>{k}</span><div><i style={{width:`${Math.max(8,(v/Math.max(1,filtered.length))*100)}%`}}></i></div><b>{v}</b></div>)}</div></>}
  {page==='respuestas' && <><div className="filters"><input placeholder="Tienda" value={filters.tienda} onChange={e=>setFilters({...filters,tienda:e.target.value})}/><input placeholder="Seller" value={filters.seller} onChange={e=>setFilters({...filters,seller:e.target.value})}/><select value={filters.motivo} onChange={e=>setFilters({...filters,motivo:e.target.value})}><option value="">Todos los motivos</option>{motives.map(m=><option key={m}>{m}</option>)}</select><button onClick={()=>csv(filtered)}>Descargar CSV</button></div><Table rows={filtered}/></>}
  {page==='campañas' && <Campaigns campaigns={campaigns} onChange={load} canEdit={profile.rol!=='analista'}/>} {page==='usuarios' && <Users/>}</section></div>
}
function Table({rows}:{rows:ResponseRow[]}) { return <div className="table"><table><thead><tr><th>Fecha</th><th>Email</th><th>Tienda</th><th>Seller</th><th>Motivo</th><th>Detalle</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{new Date(r.created_at).toLocaleString('es-AR')}</td><td>{r.email}</td><td>{r.tienda}</td><td>{r.seller}</td><td>{r.motivo}</td><td>{r.motivo_texto}</td></tr>)}</tbody></table></div> }
function Campaigns({campaigns,onChange,canEdit}:{campaigns:Campaign[];onChange:()=>void;canEdit:boolean}) { const [nombre,setNombre]=useState('Carrito abandonado'); async function add(){ await supabase.from('campaigns').insert({nombre, estado:'activa', titulo:'Queremos conocer tu experiencia', descripcion:'Encuesta de abandono de checkout', color:'#10049E'}); setNombre(''); onChange(); } return <div className="panel"><h3>Campañas</h3>{canEdit&&<div className="filters"><input value={nombre} onChange={e=>setNombre(e.target.value)}/><button onClick={add}>Crear campaña</button></div>}<div className="cards">{campaigns.map(c=><article key={c.id}><b>{c.nombre}</b><span>{c.estado}</span><p>{c.descripcion}</p></article>)}</div></div> }
function Users(){ return <div className="panel"><h3>Usuarios</h3><p>Los usuarios se crean desde Supabase Authentication. Luego se les asigna rol en la tabla <b>profiles</b>.</p><code>super_admin · admin · analista</code></div> }

function Root(){ const [session,setSession]=useState<any>(null); const [profile,setProfile]=useState<Profile|null>(null); useEffect(()=>{ supabase.auth.getSession().then(({data})=>setSession(data.session)); const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return ()=>subscription.unsubscribe();},[]); useEffect(()=>{ if(!session?.user){setProfile(null);return} supabase.from('profiles').select('*').eq('id',session.user.id).single().then(({data})=>setProfile(data as Profile));},[session]); if(location.pathname.startsWith('/s')) return <Survey/>; if(!session) return <Login/>; if(!profile) return <div className="loading">Cargando perfil...</div>; if(!profile.activo) return <div className="loading">Usuario inactivo.</div>; return <AppShell profile={profile}/> }

createRoot(document.getElementById('root')!).render(<Root />);
