const json = (data, status=200, headers={}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
});
const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'Content-Type, Authorization', 'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS' };

function b64(buf) { return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function unb64(s) { const p=s.replace(/-/g,'+').replace(/_/g,'/'); return Uint8Array.from(atob(p), c=>c.charCodeAt(0)); }
async function sha256(text) { return b64(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))); }
async function derive(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name:'PBKDF2', salt:unb64(salt), iterations:120000, hash:'SHA-256'}, key, 256);
  return b64(bits);
}
async function randomToken(bytes=32) { const a=new Uint8Array(bytes); crypto.getRandomValues(a); return b64(a.buffer); }
function body(request) { return request.json().catch(()=>({})); }
function authToken(request) { const h=request.headers.get('authorization')||''; return h.startsWith('Bearer ')?h.slice(7):null; }
async function userFromRequest(env, request) {
  const token=authToken(request); if(!token) return null;
  return await env.DB.prepare(`SELECT u.id,u.username FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires_at>?`).bind(token, Date.now()).first();
}
function clean(v,max=120) { return String(v??'').trim().slice(0,max); }

async function register(env, data) {
  const username=clean(data.username,24), password=String(data.password||'');
  if(!/^[A-Za-z0-9_]{3,24}$/.test(username)) return json({error:'Username must be 3-24 letters, numbers or underscores.'},400,cors);
  if(password.length<8 || password.length>128) return json({error:'Password must be 8-128 characters.'},400,cors);
  const salt=b64(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const hash=await derive(password,salt);
  try { const r=await env.DB.prepare('INSERT INTO users(username,password_hash,salt) VALUES(?,?,?)').bind(username,hash,salt).run();
    const token=await randomToken(); await env.DB.prepare('INSERT INTO sessions(token,user_id,expires_at) VALUES(?,?,?)').bind(token,r.meta.last_row_id,Date.now()+1000*60*60*24*30).run();
    return json({token,user:{id:r.meta.last_row_id,username}},201,cors);
  } catch { return json({error:'Username already exists.'},409,cors); }
}
async function login(env,data) {
  const username=clean(data.username,24), password=String(data.password||'');
  const u=await env.DB.prepare('SELECT id,username,password_hash,salt FROM users WHERE username=?').bind(username).first();
  if(!u || await derive(password,u.salt)!==u.password_hash) return json({error:'Invalid username or password.'},401,cors);
  const token=await randomToken(); await env.DB.prepare('INSERT INTO sessions(token,user_id,expires_at) VALUES(?,?,?)').bind(token,u.id,Date.now()+1000*60*60*24*30).run();
  return json({token,user:{id:u.id,username:u.username}},200,cors);
}

async function routes(request, env) {
  const url=new URL(request.url), path=url.pathname;
  if(request.method==='OPTIONS') return new Response('',{status:204,headers:cors});
  if(path==='/api/health') return json({ok:true,service:'PCPlayground API',time:new Date().toISOString()},200,cors);
  if(path==='/api/auth/register' && request.method==='POST') return register(env,await body(request));
  if(path==='/api/auth/login' && request.method==='POST') return login(env,await body(request));
  if(path==='/api/auth/me' && request.method==='GET') { const u=await userFromRequest(env,request); return json({user:u||null},200,cors); }
  if(path==='/api/games' && request.method==='GET') {
    const q=clean(url.searchParams.get('q'),80), rows=q?await env.DB.prepare(`SELECT * FROM games WHERE title LIKE ? ORDER BY title`).bind(`%${q}%`).all():await env.DB.prepare('SELECT * FROM games ORDER BY title').all();
    return json({games:rows.results},200,cors);
  }
  if(path==='/api/builds' && request.method==='GET') {
    const u=await userFromRequest(env,request); if(!u) return json({error:'Login required.'},401,cors);
    const rows=await env.DB.prepare('SELECT * FROM builds WHERE user_id=? ORDER BY updated_at DESC').bind(u.id).all(); return json({builds:rows.results},200,cors);
  }
  if(path==='/api/builds' && request.method==='POST') {
    const u=await userFromRequest(env,request); if(!u) return json({error:'Login required.'},401,cors);
    const d=await body(request), name=clean(d.name,80), cpu=clean(d.cpu), gpu=clean(d.gpu), ram=clean(d.ram), storage=clean(d.storage), psu=clean(d.psu), monitor=clean(d.monitor), visibility=clean(d.visibility,12)||'private';
    if(!name||!cpu||!gpu||!ram||!storage||!psu||!monitor) return json({error:'All build fields are required.'},400,cors);
    const r=await env.DB.prepare(`INSERT INTO builds(user_id,name,cpu,gpu,ram,storage,psu,monitor,visibility) VALUES(?,?,?,?,?,?,?,?,?)`).bind(u.id,name,cpu,gpu,ram,storage,psu,monitor,visibility).run();
    return json({id:r.meta.last_row_id},201,cors);
  }
  const bm=path.match(/^\/api\/builds\/(\d+)$/);
  if(bm && request.method==='PUT') {
    const u=await userFromRequest(env,request); if(!u) return json({error:'Login required.'},401,cors); const id=Number(bm[1]), d=await body(request);
    const r=await env.DB.prepare(`UPDATE builds SET name=?,cpu=?,gpu=?,ram=?,storage=?,psu=?,monitor=?,visibility=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?`).bind(clean(d.name,80),clean(d.cpu),clean(d.gpu),clean(d.ram),clean(d.storage),clean(d.psu),clean(d.monitor),clean(d.visibility,12)||'private',id,u.id).run();
    return json({ok:r.meta.changes>0},200,cors);
  }
  if(bm && request.method==='DELETE') { const u=await userFromRequest(env,request); if(!u) return json({error:'Login required.'},401,cors); const r=await env.DB.prepare('DELETE FROM builds WHERE id=? AND user_id=?').bind(Number(bm[1]),u.id).run(); return json({ok:r.meta.changes>0},200,cors); }
  if(path==='/api/posts' && request.method==='GET') {
    const rows=await env.DB.prepare(`SELECT p.id,p.title,p.body,p.created_at,u.username FROM posts p LEFT JOIN users u ON u.id=p.user_id ORDER BY p.id DESC LIMIT 50`).all(); return json({posts:rows.results},200,cors);
  }
  if(path==='/api/posts' && request.method==='POST') {
    const u=await userFromRequest(env,request); if(!u) return json({error:'Login required.'},401,cors); const d=await body(request), title=clean(d.title,120), text=clean(d.body,5000); if(!title||!text) return json({error:'Title and body are required.'},400,cors);
    const r=await env.DB.prepare('INSERT INTO posts(user_id,title,body) VALUES(?,?,?)').bind(u.id,title,text).run(); return json({id:r.meta.last_row_id},201,cors);
  }
  return json({error:'Not found'},404,cors);
}

export default { async fetch(request,env) { try { return await routes(request,env); } catch(e) { return json({error:'Server error',detail:String(e?.message||e)},500,cors); } } };
