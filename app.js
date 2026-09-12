/* ================================================================
   PC PLAYGROUND — APP LOGIC v4.3
   ----------------------------------------------------------------
   Everything except the data arrays (which live in data.js).
   Requires data.js to be loaded first.
   ================================================================ */

/* ----------------------------------------------------------------
   COOKIE HELPERS
   ---------------------------------------------------------------- */
const CK = {
  set(name, value, days=365){
    const d = new Date();
    d.setTime(d.getTime() + days*864e5);
    document.cookie = name+'='+encodeURIComponent(JSON.stringify(value))+';expires='+d.toUTCString()+';path=/;SameSite=Lax';
  },
  get(name){
    const m = document.cookie.match('(^|;)\\s*'+name+'\\s*=\\s*([^;]+)');
    if(!m) return null;
    try{ return JSON.parse(decodeURIComponent(m[2])); }catch(e){ return null; }
  },
  del(name){ document.cookie = name+'=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/'; },
  clearAll(){
    document.cookie.split(';').forEach(c=>{
      const name = c.split('=')[0].trim();
      if(name) document.cookie = name+'=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    });
  }
};

/* ----------------------------------------------------------------
   STATE
   ---------------------------------------------------------------- */
let state = {
  build: {
    cpuBrand:'AMD', cpu:'',
    gpuBrand:'NVIDIA', gpu:'',
    ram:'', ramCapacity:'', ramType:'', ramSpeed:'',
    storages:[{type:'NVMe Gen4', capacity:'1TB'}],
    psuWatt:'', psuEff:'80+ Gold',
    coolerType:'AIO 240mm'
  },
  settings: {
    theme:'dark',
    accent:'#3b82f6',
    grad1:'#3b82f6',
    grad2:'#a78bfa',
    defaultRes:'1080p',
    defaultFps:'144',
    defaultQuality:'High'
  },
  savedBuilds: [],
  analysis: null
};

const savedBuild = CK.get('pcp_build');
const savedSettings = CK.get('pcp_settings');
const savedBuildsList = CK.get('pcp_builds');
if(savedBuild) state.build = {...state.build, ...savedBuild};
if(savedSettings) state.settings = {...state.settings, ...savedSettings};
if(savedBuildsList) state.savedBuilds = savedBuildsList;

/* ----------------------------------------------------------------
   DOM HELPERS
   ---------------------------------------------------------------- */
const $ = (sel, root=document)=>root.querySelector(sel);
const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
const fmt = n => n.toLocaleString();
const clamp = (n,min,max)=>Math.min(max,Math.max(min,n));

/* ----------------------------------------------------------------
   LOOKUPS
   ---------------------------------------------------------------- */
function getCpuData(name){
  for(const brand in CPUS){ const f = CPUS[brand].find(c=>c.name===name); if(f) return f; }
  return CPUS.AMD[1];
}
function getGpuData(name){
  for(const brand in GPUS){ const f = GPUS[brand].find(g=>g.name===name); if(f) return f; }
  return GPUS.NVIDIA[4];
}
function getRamData(){
  const cap = parseInt(state.build.ramCapacity || '0', 10);
  const type = state.build.ramType || '';
  const entry = RAMS.find(r => r.capacity === cap && r.type === type);
  if(entry) return entry;
  // Fallback: 16GB DDR4 equivalent
  return RAMS.find(r => r.capacity === 16 && r.type === 'DDR4') || RAMS[0];
}
function allCpus(){ return [...CPUS.AMD, ...CPUS.Intel]; }
function allGpus(){ return [...GPUS.NVIDIA, ...GPUS.AMD, ...GPUS.Intel]; }

/* ----------------------------------------------------------------
   TOASTS
   ---------------------------------------------------------------- */
function toast(msg, icon='fa-info-circle'){
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  $('#toasts').appendChild(t);
  setTimeout(()=>{ t.style.animation='slideIn .3s reverse'; setTimeout(()=>t.remove(),300); }, 3000);
}

/* ----------------------------------------------------------------
   THEME
   ---------------------------------------------------------------- */
function applyTheme(){
  const s = state.settings;
  document.body.classList.remove('theme-light');
  const root = document.documentElement.style;

  if(s.theme === 'light'){
    document.body.classList.add('theme-light');
  } else if(s.theme === 'custom'){
    root.setProperty('--bg-grad-1', hexToRgba(s.grad1, 0.18));
    root.setProperty('--bg-grad-2', hexToRgba(s.grad2, 0.16));
    root.setProperty('--primary', s.grad1);
    root.setProperty('--primary-2', s.grad2);
    root.setProperty('--primary-glow', hexToRgba(s.grad1, 0.4));
    root.setProperty('--accent', s.grad2);
  } else {
    root.setProperty('--bg-grad-1', 'rgba(59,130,246,.10)');
    root.setProperty('--bg-grad-2', 'rgba(168,85,247,.08)');
  }

  if(s.accent){
    root.setProperty('--primary', s.accent);
    root.setProperty('--primary-glow', hexToRgba(s.accent, 0.4));
  }

  const icon = s.theme==='dark' ? 'fa-moon' : s.theme==='light' ? 'fa-sun' : 'fa-palette';
  const qt = $('#quickTheme');
  if(qt) qt.innerHTML = `<i class="fas ${icon}"></i>`;

  $$('#themeSwatches .swatch').forEach(el=>el.classList.toggle('active', el.dataset.theme===s.theme));
  const ap = $('#accentPicker'); if(ap) ap.value = s.accent;
  const g1 = $('#grad1'); if(g1) g1.value = s.grad1;
  const g2 = $('#grad2'); if(g2) g2.value = s.grad2;
  const dr = $('#defaultRes'); if(dr) dr.value = s.defaultRes;
  const df = $('#defaultFps'); if(df) df.value = s.defaultFps;
  const dq = $('#defaultQuality'); if(dq) dq.value = s.defaultQuality;
}
function hexToRgba(hex, a){
  const c = hex.replace('#','');
  const r = parseInt(c.substring(0,2),16);
  const g = parseInt(c.substring(2,4),16);
  const b = parseInt(c.substring(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ----------------------------------------------------------------
   ROUTER
   ---------------------------------------------------------------- */
function navigate(page){
  $$('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.page===page));
  $$('.page').forEach(p=>p.classList.toggle('active', p.id === 'page-'+page));
  $('#pages').scrollTop = 0;
  if(page==='games') renderGamesPage();
  if(page==='benchmarks') renderBenchmarksPage();
  if(page==='builds') renderSavedBuilds();
  if(page==='upgrade') renderUpgradePage();
  if(page==='compare') populateCompareSelects();
}
$$('.nav-item').forEach(item=>item.addEventListener('click', ()=>navigate(item.dataset.page)));

/* ================================================================
   COLLAPSIBLE SIDEBAR SECTIONS
   ================================================================ */
(function initSidebarCollapse(){
  const STORAGE_KEY = 'pcp_sidebar_sections';
  const sections = $$('.nav-section[data-section]');
  if(sections.length === 0) return;

  const saved = CK.get(STORAGE_KEY) || {};

  sections.forEach(section=>{
    const key = section.dataset.section;
    const group = document.querySelector(`.nav-group[data-group="${key}"]`);
    if(!group) return;

    if(saved[key] === false){
      section.classList.add('collapsed');
      group.classList.add('collapsed');
    }

    section.addEventListener('click', ()=>{
      const isCollapsed = section.classList.toggle('collapsed');
      group.classList.toggle('collapsed', isCollapsed);

      const state = CK.get(STORAGE_KEY) || {};
      state[key] = !isCollapsed;
      CK.set(STORAGE_KEY, state);
    });
  });
})();

/* ----------------------------------------------------------------
   BUILD UI
   ---------------------------------------------------------------- */
function populateCpuSelect(){
  const brand = $('#cpuBrand').value;
  const list = CPUS[brand] || CPUS.AMD;
  const sel = $('#cpuSelect');
  sel.innerHTML = `<option value="" disabled hidden>-</option>` +
    list.map(c=>`<option value="${c.name}">${c.name} — ${c.cores} · ${c.clock}</option>`).join('');
  if(state.build.cpu && list.some(c=>c.name===state.build.cpu)) sel.value = state.build.cpu;
  else sel.value = '';
}
function populateGpuSelect(){
  const brand = $('#gpuBrand').value;
  const list = GPUS[brand] || GPUS.NVIDIA;
  const sel = $('#gpuSelect');
  sel.innerHTML = `<option value="" disabled hidden>-</option>` +
    list.map(g=>`<option value="${g.name}">${g.name} — ${g.vram}GB · ${g.tdp}W</option>`).join('');
  if(state.build.gpu && list.some(g=>g.name===state.build.gpu)) sel.value = state.build.gpu;
  else sel.value = '';
}
function populateRamSelect(){
  // Fallback for old cookie format "16GB DDR4 3200"
  if(state.build.ram && !state.build.ramCapacity){
    const m = state.build.ram.match(/^(\d+)GB\s+(DDR\d)/);
    if(m){
      state.build.ramCapacity = m[1];
      state.build.ramType = m[2];
    }
  }
  const cap = $('#ramCapacity');
  const typ = $('#ramType');
  if(cap) cap.value = state.build.ramCapacity || '';
  if(typ) typ.value = state.build.ramType || '';
  populateRamSpeed();
}
function populateRamSpeed(){
  const cap = parseInt($('#ramCapacity').value, 10);
  const type = $('#ramType').value;
  const speedSel = $('#ramSpeed');
  const entry = RAMS.find(r => r.capacity === cap && r.type === type);
  if(!entry){
    speedSel.innerHTML = `<option value="" disabled hidden>-</option>`;
    speedSel.value = '';
    return;
  }
  speedSel.innerHTML = `<option value="" disabled hidden>-</option>` +
    entry.speeds.map(s => `<option value="${s}">${s}</option>`).join('');
  // Prefer 3200 if available, else the fastest
  if(entry.speeds.includes(3200)) speedSel.value = '3200';
  else speedSel.value = entry.speeds[entry.speeds.length - 1];
}

function renderStorage(){
  const container = $('#storageContainer');
  const list = state.build.storages;
  $('#storageCount').textContent = `${list.length}/4 drives`;
  container.innerHTML = '';
  list.forEach((s, i)=>{
    const row = document.createElement('div');
    row.className = 'storage-item';
    row.innerHTML = `
      <div class="storage-field">
        <label>Type</label>
        <select class="stg-type" data-i="${i}">
          ${STORAGE_TYPES.map(t=>`<option value="${t.name}" ${t.name===s.type?'selected':''}>${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="storage-field">
        <label>Capacity</label>
        <select class="stg-cap" data-i="${i}">
          ${CAPACITIES.map(c=>`<option value="${c}" ${c===s.capacity?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
      <button class="storage-remove" data-i="${i}" ${list.length<=1?'disabled':''} title="${list.length<=1?'At least one drive':'Remove drive'}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    container.appendChild(row);
  });
  $$('.stg-type').forEach(el=>el.addEventListener('change', e=>{
    state.build.storages[+e.target.dataset.i].type = e.target.value;
  }));
  $$('.stg-cap').forEach(el=>el.addEventListener('change', e=>{
    state.build.storages[+e.target.dataset.i].capacity = e.target.value;
  }));
  $$('.storage-remove').forEach(el=>el.addEventListener('click', e=>{
    if(state.build.storages.length<=1) return;
    state.build.storages.splice(+e.currentTarget.dataset.i,1);
    renderStorage();
  }));
}
$('#addStorage').addEventListener('click', ()=>{
  if(state.build.storages.length>=4) return toast('Maximum 4 drives','fa-circle-exclamation');
  state.build.storages.push({type:'NVMe Gen4', capacity:'1TB'});
  renderStorage();
});

/* ----------------------------------------------------------------
   BUILD INPUT LISTENERS
   ---------------------------------------------------------------- */
$('#cpuBrand').addEventListener('change', ()=>{ state.build.cpuBrand = $('#cpuBrand').value; populateCpuSelect(); updateTower(); });
$('#gpuBrand').addEventListener('change', ()=>{ state.build.gpuBrand = $('#gpuBrand').value; populateGpuSelect(); updateTower(); });
$('#cpuSelect').addEventListener('change', ()=>{ state.build.cpu = $('#cpuSelect').value; updateTower(); });
$('#gpuSelect').addEventListener('change', ()=>{ state.build.gpu = $('#gpuSelect').value; updateTower(); });
$('#ramCapacity').addEventListener('change', ()=>{
  state.build.ramCapacity = $('#ramCapacity').value;
  populateRamSpeed();
  updateRamString();
});
$('#ramType').addEventListener('change', ()=>{
  state.build.ramType = $('#ramType').value;
  populateRamSpeed();
  updateRamString();
});
$('#ramSpeed').addEventListener('change', ()=>{
  state.build.ramSpeed = $('#ramSpeed').value;
  updateRamString();
});
function updateRamString(){
  const cap = state.build.ramCapacity;
  const type = state.build.ramType;
  const spd = $('#ramSpeed').value;
  state.build.ram = (cap && type && spd) ? `${cap}GB ${type} ${spd}` : '';
}
$('#psuWatt').addEventListener('change', ()=>{ state.build.psuWatt = $('#psuWatt').value; });
$('#psuEff').addEventListener('change', ()=>{ state.build.psuEff = $('#psuEff').value; });
$('#coolerType').addEventListener('change', ()=>{ state.build.coolerType = $('#coolerType').value; });

/* ----------------------------------------------------------------
   HERO TOWER — label + glow update
   ---------------------------------------------------------------- */
function updateTower(){
  const cpuName = $('#cpuSelect') ? $('#cpuSelect').value : state.build.cpu;
  const gpuName = $('#gpuSelect') ? $('#gpuSelect').value : state.build.gpu;

  const gpuBrand = (gpuName||'').toLowerCase().includes('rtx') || (gpuName||'').toLowerCase().includes('gtx') ? 'NVIDIA'
                 : (gpuName||'').toLowerCase().includes('rx ') ? 'AMD'
                 : (gpuName||'').toLowerCase().includes('arc') ? 'Intel'
                 : 'NVIDIA';
  const gpuGlow = gpuBrand === 'NVIDIA' ? 'rgba(34,197,94,.55)'
                : gpuBrand === 'AMD'    ? 'rgba(239,68,68,.55)'
                :                          'rgba(6,182,212,.55)';

  const img = $('#pcHeroImage');
  if(img){
    img.style.filter = `drop-shadow(0 30px 50px rgba(0,0,0,.65)) drop-shadow(0 0 40px ${gpuGlow})`;
  }
  const glow = document.querySelector('.pc-hero-glow');
  if(glow){
    glow.style.background = `radial-gradient(circle, ${gpuGlow}, transparent 65%)`;
  }

  const labelCpu = $('#pcLabelCpu');
  const labelGpu = $('#pcLabelGpu');
  if(labelCpu) labelCpu.textContent = cpuName || '—';
  if(labelGpu) labelGpu.textContent = gpuName || '—';
}

/* ----------------------------------------------------------------
   ANALYSIS ENGINE
   ---------------------------------------------------------------- */
function analyze(){
  state.build.cpu = $('#cpuSelect').value;
  state.build.gpu = $('#gpuSelect').value;
  state.build.ramCapacity = $('#ramCapacity').value;
  state.build.ramType = $('#ramType').value;
  state.build.ramSpeed = $('#ramSpeed').value;
  updateRamString();
  state.build.psuWatt = $('#psuWatt').value;
  state.build.psuEff = $('#psuEff').value;
  state.build.coolerType = $('#coolerType').value;

  const cpu = getCpuData(state.build.cpu);
  const gpu = getGpuData(state.build.gpu);
  const ram = getRamData();

  const cpuScore = clamp(Math.round(cpu.mult * 42), 5, 100);
  const gpuScore = clamp(Math.round(gpu.mult * 30), 5, 100);
  const ramScore = clamp(Math.round(ram.mult * 78), 5, 100);
  const storageScore = (()=>{
    if(state.build.storages.some(s=>s.type.includes('NVMe Gen5'))) return 100;
    if(state.build.storages.some(s=>s.type.includes('NVMe Gen4'))) return 92;
    if(state.build.storages.some(s=>s.type.includes('NVMe'))) return 80;
    if(state.build.storages.some(s=>s.type.includes('SATA'))) return 65;
    return 40;
  })();

  const totalScore = Math.round(cpuScore*0.28 + gpuScore*0.42 + ramScore*0.18 + storageScore*0.12);

  const power = cpu.tdp + gpu.tdp + ram.tdp
              + state.build.storages.reduce((sum,s)=>sum + (STORAGE_TYPES.find(t=>t.name===s.type)?.tdp || 5), 0)
              + 75;
  const psuWatt = +state.build.psuWatt || 0;
  const psuHeadroom = psuWatt - power;

  const cw = cpu.mult, gw = gpu.mult, rw = ram.mult;
  const bottlenecks = [];
  const idealCpuForGpu = gw * 1.05;
  const idealGpuForCpu = cw * 0.95;

  if(cw < idealCpuForGpu * 0.75) bottlenecks.push({
    component:'CPU', icon:'cpu', severity: cw/idealCpuForGpu < 0.6 ? 'high':'medium',
    pct: Math.round((1 - cw/idealCpuForGpu)*100), desc:`Your CPU (${cpu.name}) is holding back your GPU (${gpu.name}). Consider a CPU upgrade.`
  });
  if(gw < idealGpuForCpu * 0.75) bottlenecks.push({
    component:'GPU', icon:'gpu', severity: gw/idealGpuForCpu < 0.6 ? 'high':'medium',
    pct: Math.round((1 - gw/idealGpuForCpu)*100), desc:`Your GPU (${gpu.name}) is the main limiter in most games.`
  });
  if(rw < 0.95) bottlenecks.push({
    component:'RAM', icon:'ram', severity: rw < 0.85 ? 'high':'medium',
    pct: Math.round((1 - rw)*100), desc:`${ram.capacity}GB is limited for modern titles. 16GB+ recommended.`
  });

  const gameResults = GAMES.map(g=>{
    const fps = g.base * Math.pow(cw, g.cw) * Math.pow(gw, g.gw) * Math.pow(rw, g.rw);
    const stgBonus = 1 + (storageScore - 75) / 1000;
    const finalFps = Math.round(fps * stgBonus);
    const ci = finalFps > 100 ? 0.06 : finalFps > 60 ? 0.09 : 0.12;
    const low = Math.round(finalFps * (1-ci));
    const high = Math.round(finalFps * (1+ci));
    let quality, qclass;
    if(finalFps >= 144){ quality='Excellent'; qclass='q-excellent'; }
    else if(finalFps >= 100){ quality='Great'; qclass='q-great'; }
    else if(finalFps >= 60){ quality='Good'; qclass='q-good'; }
    else if(finalFps >= 30){ quality='Playable'; qclass='q-playable'; }
    else { quality='Poor'; qclass='q-poor'; }
    return {...g, fps:finalFps, low, high, quality, qclass, confidence: ci<0.08?'High':ci<0.11?'Medium':'Low'};
  });

  state.analysis = {
    cpu, gpu, ram, cpuScore, gpuScore, ramScore, storageScore, totalScore,
    power, psuWatt, psuHeadroom,
    bottlenecks, gameResults
  };

  CK.set('pcp_build', state.build);

  updateTower();
  renderHome();
  renderBuildHealth();
  renderBenchmarksPage();
  if($('#page-upgrade').classList.contains('active')) renderUpgradePage();
  if($('#page-compare').classList.contains('active')) runCompare();
  toast('Analysis complete — '+totalScore+'/100','fa-bolt');
}
$('#analyzeBtn').addEventListener('click', analyze);
$('#resetBuildBtn').addEventListener('click', ()=>{
  confirmDialog('Reset your build?', ()=>{
    state.build = {
      cpuBrand:'AMD', cpu:'',
      gpuBrand:'NVIDIA', gpu:'',
      ram:'', ramCapacity:'', ramType:'', ramSpeed:'',
      storages:[{type:'NVMe Gen4', capacity:'1TB'}],
      psuWatt:'', psuEff:'80+ Gold', coolerType:'AIO 240mm'
    };
    syncBuildUI();
    toast('Build reset','fa-rotate-left');
  });
});

function syncBuildUI(){
  $('#cpuBrand').value = state.build.cpuBrand;
  populateCpuSelect();
  if(state.build.cpu) $('#cpuSelect').value = state.build.cpu;
  $('#gpuBrand').value = state.build.gpuBrand;
  populateGpuSelect();
  if(state.build.gpu) $('#gpuSelect').value = state.build.gpu;
  populateRamSelect();
  if($('#ramCapacity')) $('#ramCapacity').value = state.build.ramCapacity || '';
  if($('#ramType')) $('#ramType').value = state.build.ramType || '';
  populateRamSpeed();
  if($('#ramSpeed') && state.build.ramSpeed) $('#ramSpeed').value = state.build.ramSpeed;
  if($('#psuWatt') && state.build.psuWatt) $('#psuWatt').value = state.build.psuWatt;
  $('#psuEff').value = state.build.psuEff;
  $('#coolerType').value = state.build.coolerType;
  renderStorage();
  updateTower();
}

/* ----------------------------------------------------------------
   RENDER: HOME
   ---------------------------------------------------------------- */
function renderHome(){
  const a = state.analysis;
  if(!a){
    $('#heroCpu').textContent = state.build.cpu || '—';
    $('#heroGpu').textContent = state.build.gpu || '—';
    $('#heroRam').textContent = state.build.ram || '—';
    return;
  }
  $('#heroCpu').textContent = a.cpu.name;
  $('#heroGpu').textContent = a.gpu.name;
  $('#heroRam').textContent = `${a.ram.capacity}GB ${a.ram.type}`;

  $('#buildSpecs').innerHTML = `
    <div class="spec-row"><div class="spec-icon"><i class="fas fa-microchip"></i></div><div class="spec-info"><div class="label">CPU</div><div class="value">${a.cpu.name} · ${a.cpu.cores}</div></div></div>
    <div class="spec-row"><div class="spec-icon"><i class="fas fa-display"></i></div><div class="spec-info"><div class="label">GPU</div><div class="value">${a.gpu.name} · ${a.gpu.vram}GB</div></div></div>
    <div class="spec-row"><div class="spec-icon"><i class="fas fa-memory"></i></div><div class="spec-info"><div class="label">RAM</div><div class="value">${a.ram.capacity}GB ${a.ram.type}${state.build.ramSpeed ? ' ' + state.build.ramSpeed : ''}</div></div></div>
    <div class="spec-row"><div class="spec-icon"><i class="fas fa-hard-drive"></i></div><div class="spec-info"><div class="label">Storage</div><div class="value">${state.build.storages.map(s=>s.capacity+' '+s.type.split(' ')[0]).join(' · ')}</div></div></div>
  `;

  const pct = a.totalScore/100;
  const circ = 2*Math.PI*54;
  $('#scoreRing').setAttribute('stroke-dashoffset', String(circ * (1-pct)));
  $('#scoreNum').textContent = a.totalScore;
  $('#scoreLabel').textContent =
    a.totalScore>=85?'Excellent':a.totalScore>=70?'Very Good':a.totalScore>=50?'Good':'Needs upgrade';
  $('#scoreHint').textContent = 'Based on your full configuration.';

  $('#statCpuScore').textContent = a.cpuScore;
  $('#statCpuName').textContent = a.cpu.name;
  $('#statGpuScore').textContent = a.gpuScore;
  $('#statGpuName').textContent = a.gpu.name;
  $('#statRamScore').textContent = a.ramScore;
  $('#statRamName').textContent = `${a.ram.capacity}GB ${a.ram.type}`;
  $('#statPower').textContent = a.power + ' W';

  if(a.bottlenecks.length === 0){
    $('#bnList').innerHTML = `<div class="empty" style="padding:1rem;"><i class="fas fa-circle-check" style="color:var(--success);"></i><p>No significant bottlenecks detected.</p></div>`;
    $('#bnSummary').textContent = 'Balanced';
  } else {
    $('#bnList').innerHTML = a.bottlenecks.map(b=>`
      <div class="bn-item">
        <div class="bn-icon ${b.icon}"><i class="fas fa-${b.component==='CPU'?'microchip':b.component==='GPU'?'display':'memory'}"></i></div>
        <div class="bn-body">
          <div class="bn-head"><strong>${b.component} Limited</strong><span>${b.pct}% impact</span></div>
          <div class="bn-desc">${b.desc}</div>
        </div>
        <button class="btn btn-sm btn-ghost" onclick="explainBn('${b.component}')"><i class="fas fa-circle-question"></i> Why?</button>
      </div>`).join('');
    $('#bnSummary').textContent = a.bottlenecks.length + ' issue' + (a.bottlenecks.length>1?'s':'');
  }

  $('#meterGroup').innerHTML = `
    <div class="meter"><div class="meter-label"><i class="fas fa-microchip"></i> CPU</div><div class="meter-track"><div class="meter-fill ${a.cpuScore<50?'warn':a.cpuScore>=80?'good':''}" style="width:${a.cpuScore}%"></div></div><div class="meter-value">${a.cpuScore}</div></div>
    <div class="meter"><div class="meter-label"><i class="fas fa-display"></i> GPU</div><div class="meter-track"><div class="meter-fill ${a.gpuScore<50?'warn':a.gpuScore>=80?'good':''}" style="width:${a.gpuScore}%"></div></div><div class="meter-value">${a.gpuScore}</div></div>
    <div class="meter"><div class="meter-label"><i class="fas fa-memory"></i> RAM</div><div class="meter-track"><div class="meter-fill ${a.ramScore<50?'warn':a.ramScore>=80?'good':''}" style="width:${a.ramScore}%"></div></div><div class="meter-value">${a.ramScore}</div></div>
    <div class="meter"><div class="meter-label"><i class="fas fa-hard-drive"></i> Storage</div><div class="meter-track"><div class="meter-fill ${a.storageScore<50?'warn':a.storageScore>=80?'good':''}" style="width:${a.storageScore}%"></div></div><div class="meter-value">${a.storageScore}</div></div>
  `;

  renderPerfChart(a);

  const top8 = [...a.gameResults].sort((x,y)=>y.fps-x.fps).slice(0,8);
  $('#homeGames').innerHTML = top8.map(g=>gameCardHtml(g)).join('');
  $$('#homeGames .game-card').forEach((el,i)=>el.addEventListener('click',()=>openGameModal(top8[i])));

  $('#homeUpgrade').innerHTML = upgradeTeaserHtml(a);
}

/* ----------------------------------------------------------------
   PERFORMANCE OVERVIEW CHART
   ---------------------------------------------------------------- */
function renderPerfChart(a){
  const wrap = $('#perfOverviewChart');
  const sub = $('#perfOverviewSub');
  if(!wrap) return;
  sub.textContent = `${a.cpuScore} CPU · ${a.gpuScore} GPU · ${a.ramScore} RAM · ${a.storageScore} Storage`;

  const points = [
    {label:'CPU',     value:a.cpuScore},
    {label:'GPU',     value:a.gpuScore},
    {label:'RAM',     value:a.ramScore},
    {label:'Storage', value:a.storageScore},
  ];

  const W = 900, H = 260;
  const padL = 40, padR = 24, padT = 28, padB = 38;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxV = 100;
  const stepX = chartW / (points.length - 1);

  const coords = points.map((p,i)=>({
    x: padL + i*stepX,
    y: padT + (1 - p.value/maxV) * chartH,
    value: p.value,
    label: p.label
  }));

  const linePath = coords.map((c,i)=> `${i===0?'M':'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length-1].x.toFixed(1)} ${(padT+chartH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padT+chartH).toFixed(1)} Z`;

  const gridLines = [0, 25, 50, 75, 100].map(v=>{
    const y = padT + (1 - v/maxV) * chartH;
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W-padR}" y2="${y.toFixed(1)}"/>`;
  }).join('');

  const gridLabels = [0, 25, 50, 75, 100].map(v=>{
    const y = padT + (1 - v/maxV) * chartH;
    return `<text x="${padL-6}" y="${(y+3).toFixed(1)}" text-anchor="end">${v}</text>`;
  }).join('');

  const axisLabels = coords.map(c=>`<text x="${c.x.toFixed(1)}" y="${(H-8).toFixed(1)}" text-anchor="middle">${c.label}</text>`).join('');

  const dots = coords.map(c=>`
    <circle class="perf-chart-dot" cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="5"/>
    <text class="perf-chart-dot-label" x="${c.x.toFixed(1)}" y="${(c.y-10).toFixed(1)}">${c.value}</text>
  `).join('');

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      <g class="perf-chart-grid">${gridLines}</g>
      <g class="perf-chart-labels">${gridLabels}</g>
      <path class="perf-chart-area" d="${areaPath}"/>
      <path class="perf-chart-line" d="${linePath}"/>
      ${dots}
      <g class="perf-chart-axis-labels">${axisLabels}</g>
    </svg>
  `;
}

/* ----------------------------------------------------------------
   SHARE CARD GENERATOR
   ---------------------------------------------------------------- */
function generateShareCard(){
  const a = state.analysis;
  if(!a){
    toast('Analyze your PC first to share your score','fa-triangle-exclamation');
    return;
  }
  const W = 1200, H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0a0c14');
  bgGrad.addColorStop(1, '#12161f');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Accent blobs
  const blob1 = ctx.createRadialGradient(1000, 100, 0, 1000, 100, 500);
  blob1.addColorStop(0, 'rgba(59,130,246,.35)');
  blob1.addColorStop(1, 'rgba(59,130,246,0)');
  ctx.fillStyle = blob1;
  ctx.fillRect(0, 0, W, H);

  const blob2 = ctx.createRadialGradient(200, H-100, 0, 200, H-100, 500);
  blob2.addColorStop(0, 'rgba(168,85,247,.25)');
  blob2.addColorStop(1, 'rgba(168,85,247,0)');
  ctx.fillStyle = blob2;
  ctx.fillRect(0, 0, W, H);

  // Top-left brand icon square
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  if(ctx.roundRect) ctx.roundRect(60, 50, 48, 48, 12); else ctx.rect(60, 50, 48, 48);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡', 84, 74);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#eef2f9';
  ctx.font = 'bold 26px Inter, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('PC Playground', 124, 74);

  // Score ring
  const scoreCX = W - 240, scoreCY = 200, scoreR = 110;
  ctx.strokeStyle = '#232a3a';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(scoreCX, scoreCY, scoreR, 0, Math.PI * 2);
  ctx.stroke();

  const scoreGrad = ctx.createLinearGradient(scoreCX-scoreR, scoreCY-scoreR, scoreCX+scoreR, scoreCY+scoreR);
  scoreGrad.addColorStop(0, '#3b82f6');
  scoreGrad.addColorStop(1, '#a78bfa');
  ctx.strokeStyle = scoreGrad;
  ctx.beginPath();
  ctx.arc(scoreCX, scoreCY, scoreR, -Math.PI/2, -Math.PI/2 + (Math.PI*2) * (a.totalScore/100));
  ctx.stroke();

  ctx.fillStyle = '#eef2f9';
  ctx.font = 'bold 72px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(String(a.totalScore), scoreCX, scoreCY - 6);

  ctx.fillStyle = '#6b7689';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.fillText('/ 100', scoreCX, scoreCY + 42);

  // Build title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#a8b2c6';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.fillText('MY BUILD', 60, 160);

  ctx.fillStyle = '#eef2f9';
  ctx.font = 'bold 38px Inter, sans-serif';
  ctx.fillText(a.cpu.name, 60, 200);
  ctx.fillText(a.gpu.name, 60, 246);
  ctx.fillStyle = '#a8b2c6';
  ctx.font = '22px Inter, sans-serif';
  ctx.fillText(`${a.ram.capacity}GB ${a.ram.type}`, 60, 288);

  // Rating text
  const rating = a.totalScore>=85?'Excellent':a.totalScore>=70?'Very Good':a.totalScore>=50?'Good':'Needs upgrade';
  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText(rating, 60, 335);

  // Breakdown bars
  const barY = 400;
  const bars = [
    {label:'CPU',     value:a.cpuScore},
    {label:'GPU',     value:a.gpuScore},
    {label:'RAM',     value:a.ramScore},
    {label:'Storage', value:a.storageScore},
  ];
  bars.forEach((b, i)=>{
    const bx = 60 + i * 260;
    ctx.fillStyle = '#6b7689';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(b.label.toUpperCase(), bx, barY);

    ctx.fillStyle = '#232a3a';
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(bx, barY + 14, 200, 10, 5); else ctx.rect(bx, barY + 14, 200, 10);
    ctx.fill();

    const barGrad = ctx.createLinearGradient(bx, 0, bx + 200, 0);
    barGrad.addColorStop(0, '#3b82f6');
    barGrad.addColorStop(1, '#a78bfa');
    ctx.fillStyle = barGrad;
    ctx.beginPath();
    if(ctx.roundRect) ctx.roundRect(bx, barY + 14, Math.max(6, 200 * (b.value/100)), 10, 5);
    else ctx.rect(bx, barY + 14, Math.max(6, 200 * (b.value/100)), 10);
    ctx.fill();

    ctx.fillStyle = '#eef2f9';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText(String(b.value), bx, barY + 62);
  });

  // Bottom line
  ctx.fillStyle = '#6b7689';
  ctx.font = '600 16px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Analyzed by PC Playground', W/2, H - 40);

  // Download
  canvas.toBlob((blob)=>{
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pcplayground-${a.cpu.name.replace(/\s+/g,'')}-${a.gpu.name.replace(/\s+/g,'')}.png`;
    link.click();
    URL.revokeObjectURL(url);
    toast('Score card downloaded!','fa-image');
  });
}

/* ----------------------------------------------------------------
   GAME CARDS
   ---------------------------------------------------------------- */
function gameCardHtml(g){
  const bannerInner = g.banner && g.banner.length
    ? `<img src="${g.banner}" alt="" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('no-img');">`
    : '';
  const fallbackSvg = proceduralBannerSvg(g, 320, 96);
  const showFallback = !g.banner || !g.banner.length;
  return `
    <div class="game-card">
      <div class="game-card-banner" style="${g.color?'--banner-color:'+g.color:''}">
        ${bannerInner}
        ${showFallback ? fallbackSvg : ''}
      </div>
      <div class="game-card-inner">
        <div class="game-top">
          <div>
            <div class="game-name">${g.name}</div>
            <div class="game-genre">${g.genre}</div>
          </div>
          <div class="game-fps">
            <div class="val">${g.fps}</div>
            <div class="unit">FPS</div>
          </div>
        </div>
        <div class="game-meta">
          <span class="quality-tag ${g.qclass}">${g.quality}</span>
          <span>${g.preset}</span>
        </div>
      </div>
    </div>`;
}

function proceduralBannerSvg(g, w, h){
  const initials = (g.name || 'PC')
    .replace(/[^A-Za-z0-9 ]/g,'')
    .split(' ')
    .map(x=>x[0])
    .join('')
    .slice(0,3)
    .toUpperCase() || 'PC';
  const color = g.color || '#3b82f6';
  const seed = ((g.name || 'x').length * 7) % 9999;
  return `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="pb-${seed}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.85"/>
          <stop offset="60%" stop-color="${color}" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#0a0c14" stop-opacity="0.95"/>
        </linearGradient>
        <pattern id="pbs-${seed}" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <rect width="40" height="40" fill="transparent"/>
          <rect width="5" height="40" fill="#ffffff" opacity="0.05"/>
        </pattern>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#pb-${seed})"/>
      <rect width="${w}" height="${h}" fill="url(#pbs-${seed})"/>
      <circle cx="${w-40}" cy="20" r="70" fill="${color}" opacity="0.20"/>
      <text x="${w*0.04}" y="${h*0.85}" font-family="Inter, system-ui, sans-serif" font-weight="900"
            font-size="${Math.round(h*0.65)}" fill="#ffffff" opacity="0.12" letter-spacing="-3">${initials}</text>
    </svg>`;
}

function explainBn(component){
  const a = state.analysis;
  const msgs = {
    CPU: `Your ${a.cpu.name} has ${a.cpu.cores} cores. In CPU-heavy titles, it can't feed your ${a.gpu.name} fast enough. Try 1440p or higher to reduce CPU load, or upgrade the CPU.`,
    GPU: `Your ${a.gpu.name} is the primary limiter. Reducing settings or upgrading the GPU is the biggest single win.`,
    RAM: `${a.ram.capacity}GB of ${a.ram.type} is limiting. Modern games increasingly need 16GB+, and CPU-heavy sims want 32GB.`
  };
  toast(msgs[component], 'fa-circle-question');
}

/* ----------------------------------------------------------------
   RENDER: GAMES PAGE
   ---------------------------------------------------------------- */
function renderGamesPage(){
  const a = state.analysis;
  if(!a){
    $('#gamesList').innerHTML = `<div class="empty"><i class="fas fa-gamepad"></i><p>Configure your PC first.</p></div>`;
    return;
  }
  $('#gamesCountBadge').textContent = a.gameResults.length;

  const filter = $('#gameFilterQuality').value;
  const sort = $('#gameSort').value;
  const target = parseInt(($('#targetFps') && $('#targetFps').value) || '60', 10) || 60;

  let list = [...a.gameResults];
  if(filter==='excellent') list = list.filter(g=>g.fps>=144);
  else if(filter==='playable') list = list.filter(g=>g.fps>=30);
  else if(filter==='hits-target') list = list.filter(g=>g.fps>=target);

  if(sort==='fps-desc') list.sort((x,y)=>y.fps-x.fps);
  else if(sort==='fps-asc') list.sort((x,y)=>x.fps-y.fps);
  else list.sort((x,y)=>x.name.localeCompare(y.name));

  if(filter==='hits-target'){
    const hits = list.length;
    const total = a.gameResults.length;
    const banner = `
      <div style="grid-column:1/-1;background:color-mix(in srgb,var(--success) 10%,transparent);border:1px solid color-mix(in srgb,var(--success) 30%,transparent);border-radius:var(--radius-sm);padding:.75rem 1rem;margin-bottom:.25rem;display:flex;align-items:center;gap:.65rem;font-size:.85rem;">
        <i class="fas fa-bullseye" style="color:var(--success);"></i>
        <span>Your PC hits <strong>${target} FPS</strong> in <strong>${hits} of ${total}</strong> games.</span>
      </div>`;
    $('#gamesList').innerHTML = banner + list.map(g=>gameCardHtml(g)).join('');
  } else {
    $('#gamesList').innerHTML = list.map(g=>gameCardHtml(g)).join('');
  }
  $$('#gamesList .game-card').forEach((el,i)=>el.addEventListener('click',()=>openGameModal(list[i])));
}
$('#gameFilterQuality').addEventListener('change', renderGamesPage);
$('#gameSort').addEventListener('change', renderGamesPage);
document.addEventListener('input', (e)=>{
  if(e.target && e.target.id === 'targetFps') renderGamesPage();
});

/* ----------------------------------------------------------------
   GAME MODAL
   ---------------------------------------------------------------- */
function openGameModal(g){
  const hero = $('#modalHero');
  const bannerMarkup = g.banner && g.banner.length
    ? `<img src="${g.banner}" alt="" onerror="this.style.display='none';this.parentElement.classList.add('no-img');">`
    : proceduralBannerSvg(g, 640, 180);
  hero.innerHTML = `
    ${bannerMarkup}
    <div class="modal-hero-overlay"></div>
    <div class="modal-hero-content">
      <div>
        <div class="modal-hero-title">${g.name}</div>
        <div class="modal-hero-sub">${g.genre} · ${g.preset}</div>
      </div>
      <div class="modal-hero-badge ${g.qclass}">
        <span class="quality-tag ${g.qclass}" style="border:0;background:transparent;padding:0;">${g.quality}</span>
      </div>
    </div>
  `;

  const resolutions = [
    {label:'1080p', mult:1.00},
    {label:'1440p', mult:0.68},
    {label:'4K',    mult:0.42},
  ];
  const presets = [
    {label:'Low',    mult:1.35},
    {label:'Medium', mult:1.10},
    {label:'High',   mult:1.00},
    {label:'Ultra',  mult:0.78},
  ];
  const rows = resolutions.map(r=>{
    const fps = Math.round(g.fps * r.mult);
    const q = fps>=144?'Excellent':fps>=100?'Great':fps>=60?'Good':fps>=30?'Playable':'Poor';
    return `<tr><td>${r.label} ${g.preset.split(' ')[0]}</td><td><strong>${fps} FPS</strong></td><td class="text-muted">${q}</td></tr>`;
  }).join('');
  const presetRows = presets.map(p=>{
    const fps = Math.round(g.fps * p.mult);
    return `<tr><td>1080p ${p.label}</td><td><strong>${fps} FPS</strong></td><td class="text-muted">${g.confidence} confidence</td></tr>`;
  }).join('');
  const a = state.analysis;

  const chartPresets = [
    {label:'Low',    mult:1.35},
    {label:'Medium', mult:1.10},
    {label:'High',   mult:1.00},
    {label:'Ultra',  mult:0.78},
  ];
  const chartData = chartPresets.map(p=>{
    const fps = Math.round(g.fps * p.mult);
    let cls = 'poor';
    if(fps>=144) cls='excellent';
    else if(fps>=100) cls='great';
    else if(fps>=60) cls='good';
    else if(fps>=30) cls='playable';
    return {label:p.label, value:fps, cls};
  });
  const maxVal = Math.max(...chartData.map(d=>d.value), 1);
  const barChartHtml = `
    <h4 style="font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin:1rem 0 .25rem;">FPS by Preset (1080p)</h4>
    <div class="game-bar-chart">
      ${chartData.map(d=>{
        const h = Math.max(6, Math.round((d.value/maxVal)*100));
        return `
          <div class="game-bar-col">
            <div class="game-bar-value">${d.value}</div>
            <div class="game-bar ${d.cls}" style="height:${h}%"></div>
            <div class="game-bar-label">${d.label}</div>
          </div>`;
      }).join('')}
    </div>
  `;

  $('#modalGameBody').innerHTML = `
    <div class="grid grid-2 mb-2">
      <div class="card-soft" style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);">
        <div class="text-muted" style="font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700;">Estimated FPS</div>
        <div style="font-size:2rem;font-weight:800;letter-spacing:-.03em;">${g.low}–${g.high}</div>
        <div class="text-muted" style="font-size:.78rem;">Confidence: <strong>${g.confidence}</strong></div>
      </div>
      <div class="card-soft" style="background:var(--surface-2);padding:1rem;border-radius:var(--radius-sm);">
        <div class="text-muted" style="font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700;">Component Load</div>
        <div class="mt-1" style="font-size:.85rem;">GPU: <strong>${Math.min(99,Math.round(g.gw*100*(a.gpuScore/70)))}%</strong></div>
        <div style="font-size:.85rem;">CPU: <strong>${Math.min(99,Math.round(g.cw*100*(a.cpuScore/70)))}%</strong></div>
        <div style="font-size:.85rem;">VRAM: <strong>${(g.gw*a.gpu.vram*0.9).toFixed(1)} GB</strong></div>
      </div>
    </div>
    ${barChartHtml}
    <h4 style="font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin:1rem 0 .5rem;">By Resolution</h4>
    <table class="data"><thead><tr><th>Resolution</th><th>FPS</th><th>Quality</th></tr></thead><tbody>${rows}</tbody></table>
    <h4 style="font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin:1rem 0 .5rem;">By Preset (1080p)</h4>
    <table class="data"><thead><tr><th>Preset</th><th>FPS</th><th>Confidence</th></tr></thead><tbody>${presetRows}</tbody></table>
    <h4 style="font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin:1rem 0 .5rem;">Recommended Settings</h4>
    <ul style="list-style:none;font-size:.85rem;line-height:1.8;">
      <li>Texture Quality → <strong>${g.fps>=80?'High':'Medium'}</strong></li>
      <li>Shadows → <strong>${g.fps>=100?'High':g.fps>=60?'Medium':'Low'}</strong></li>
      <li>Ray Tracing → <strong>${g.rt && g.fps>=120?'On':g.rt && g.fps>=90?'Selective':'Off'}</strong></li>
      <li>Upscaling → <strong>${g.fps<50?'DLSS/FSR Performance':g.fps<80?'Quality':'Off'}</strong></li>
    </ul>
    ${g.store ? `
      <div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid var(--border);display:flex;gap:.6rem;flex-wrap:wrap;">
        <a href="${g.store}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-decoration:none;">
          <i class="fas fa-arrow-up-right-from-square"></i> View on Store
        </a>
        <button class="btn btn-ghost" onclick="navigator.clipboard.writeText('${g.name}')">
          <i class="fas fa-copy"></i> Copy game name
        </button>
      </div>
    ` : ''}
  `;
  $('#gameModal').classList.add('show');
}
function closeModal(id){ document.getElementById(id).classList.remove('show'); }
$$('.modal-backdrop').forEach(m=>m.addEventListener('click', e=>{ if(e.target===m) m.classList.remove('show'); }));

/* ----------------------------------------------------------------
   RENDER: BUILD HEALTH
   ---------------------------------------------------------------- */
function renderBuildHealth(){
  const a = state.analysis;
  if(!a){ return; }
  const checks = [];
  checks.push({ok:true, label:'CPU socket supported', desc:`${a.cpu.name} (${a.cpu.socket})`});
  checks.push({ok:true, label:'GPU PCIe compatible', desc:`${a.gpu.name} — PCIe 4.0 x16`});
  const ramType = a.ram.type;
  const cpuGen = a.cpu.gen || '';
  if(cpuGen.includes('Zen 5') || cpuGen.includes('Arrow')){
    checks.push({ok:ramType==='DDR5', label:'RAM matches CPU platform', desc:`${a.cpu.name} prefers DDR5, you have ${ramType}`});
  } else {
    checks.push({ok:ramType==='DDR4' || cpuGen.includes('Zen 4') || cpuGen.includes('Alder') || cpuGen.includes('Raptor'), label:'RAM matches CPU platform', desc:`${a.ram.capacity}GB ${a.ram.type}`});
  }
  const psuOK = a.psuHeadroom > 100;
  checks.push({ok:psuOK, label:'PSU headroom', desc:`${a.psuWatt || '—'}W PSU · ${a.power}W est. draw · ${a.psuHeadroom > 0 ? a.psuHeadroom : '?'}W headroom`});
  checks.push({ok:true, label:'Storage present', desc:`${state.build.storages.length} drive(s)`});
  const coolerOK = !(a.cpu.tdp > 120 && state.build.coolerType === 'Stock cooler');
  checks.push({ok:coolerOK, label:'Cooling adequate', desc:`${state.build.coolerType} for ${a.cpu.tdp}W TDP CPU`});
  const passed = checks.filter(c=>c.ok).length;
  $('#healthList').innerHTML = `
    <div class="flex-between mb-2"><strong>${passed}/${checks.length} checks passed</strong></div>
    ${checks.map(c=>`
      <div class="spec-row" style="border-color:${c.ok?'var(--border)':'color-mix(in srgb,var(--warn) 40%,transparent)'};">
        <div class="spec-icon" style="background:${c.ok?'color-mix(in srgb,var(--success) 15%,transparent)':'color-mix(in srgb,var(--warn) 15%,transparent)'};color:${c.ok?'var(--success)':'var(--warn)'};">
          <i class="fas fa-${c.ok?'check':'triangle-exclamation'}"></i>
        </div>
        <div class="spec-info"><div class="value">${c.label}</div><div class="label" style="text-transform:none;letter-spacing:0;font-size:.72rem;">${c.desc}</div></div>
      </div>`).join('')}
  `;
}

/* ----------------------------------------------------------------
   RENDER: UPGRADE PAGE
   ---------------------------------------------------------------- */
function renderUpgradePage(){
  const a = state.analysis;
  if(!a){ $('#fullUpgrade').innerHTML = `<div class="empty"><i class="fas fa-route"></i><p>Analyze your PC first.</p></div>`; return; }
  $('#fullUpgrade').innerHTML = upgradeTeaserHtml(a, true);
  const priorities = [];
  if(a.cpuScore < a.gpuScore - 15) priorities.push({icon:'microchip', label:'CPU upgrade', impact:'High', detail:`Your ${a.cpu.name} is limiting your GPU.`});
  if(a.gpuScore < 70) priorities.push({icon:'display', label:'GPU upgrade', impact:'High', detail:`Your ${a.gpu.name} is the primary bottleneck in most games.`});
  if(a.ramScore < 70) priorities.push({icon:'memory', label:'RAM upgrade', impact:'Medium', detail:`${a.ram.capacity}GB is limited for modern titles.`});
  if(a.storageScore < 70) priorities.push({icon:'hard-drive', label:'Storage upgrade', impact:'Medium', detail:'Upgrading to NVMe will improve loading times.'});
  if(a.psuHeadroom < 100) priorities.push({icon:'plug', label:'PSU upgrade', impact:'High', detail:'PSU headroom is under 100W. Consider a higher-wattage unit.'});
  if(priorities.length===0) priorities.push({icon:'circle-check', label:'System is balanced', impact:'—', detail:'No urgent upgrades needed.'});
  $('#priorityList').innerHTML = priorities.map(p=>`
    <div class="bn-item">
      <div class="bn-icon" style="background:color-mix(in srgb,var(--primary) 15%,transparent);color:var(--primary);"><i class="fas fa-${p.icon}"></i></div>
      <div class="bn-body">
        <div class="bn-head"><strong>${p.label}</strong><span>${p.impact} impact</span></div>
        <div class="bn-desc">${p.detail}</div>
      </div>
    </div>`).join('');
}
function upgradeTeaserHtml(a, full=false){
  const gpuTier = a.gpu.tier;
  const paths = {
    'entry':       {value:'RX 7600', high:'RTX 4070', enthusiast:'RTX 5080'},
    'mainstream':  {value:'RX 7700 XT', high:'RTX 4070 Super', enthusiast:'RTX 5080'},
    'performance': {value:'RX 7800 XT', high:'RTX 4080', enthusiast:'RTX 5090'},
    'enthusiast':  {value:'RTX 4080', high:'RTX 5090', enthusiast:'RTX 5090'},
    'flagship':    {value:'RTX 5090', high:'RTX 5090', enthusiast:'RTX 5090'}
  };
  const p = paths[gpuTier] || paths.mainstream;
  return `
    <div class="upgrade-path">
      <div class="up-step current"><i class="fas fa-circle" style="font-size:6px;"></i> Current: ${a.gpu.name}</div>
      <i class="fas fa-arrow-right up-arrow"></i>
      <div class="up-step best"><i class="fas fa-star" style="font-size:9px;"></i> Best value: ${p.value}</div>
      <i class="fas fa-arrow-right up-arrow"></i>
      <div class="up-step">High-end: ${p.high}</div>
      <i class="fas fa-arrow-right up-arrow"></i>
      <div class="up-step">Enthusiast: ${p.enthusiast}</div>
    </div>
    <table class="data">
      <thead><tr><th>Upgrade</th><th>Est. FPS gain</th><th>Cost</th><th>Value</th></tr></thead>
      <tbody>
        <tr><td>${p.value}</td><td>+42%</td><td>$</td><td class="stars">★★★★★</td></tr>
        <tr><td>${p.high}</td><td>+86%</td><td>$$</td><td class="stars">★★★★</td></tr>
        <tr><td>${p.enthusiast}</td><td>+145%</td><td>$$$$</td><td class="stars">★★★</td></tr>
      </tbody>
    </table>
    ${full?`<p class="text-muted mt-2">Best upgrade per dollar: <strong>GPU — ${p.value} class</strong></p>`:''}
  `;
}

/* ----------------------------------------------------------------
   RENDER: BENCHMARKS PAGE
   ---------------------------------------------------------------- */
function renderBenchmarksPage(){
  const a = state.analysis;
  if(!a){ return; }
  const cpuRank = allCpus().sort((x,y)=>y.cb23-x.cb23).findIndex(c=>c.name===a.cpu.name)+1;
  const cpuTotal = allCpus().length;
  $('#cpuBench').innerHTML = `
    <div class="flex-between mb-2">
      <div><div style="font-size:1.5rem;font-weight:800;">${fmt(a.cpu.cb23)}</div><div class="text-muted">Cinebench R23 Multi</div></div>
      <div class="pill pill-blue">Rank #${cpuRank} of ${cpuTotal}</div>
    </div>
    <div class="meter mb-2"><div class="meter-label">Relative</div><div class="meter-track"><div class="meter-fill good" style="width:${Math.min(100,a.cpu.cb23/420*100)}%"></div></div><div class="meter-value">${Math.round(a.cpu.cb23/420*100)}</div></div>
    <div class="grid grid-2">
      <div class="card-soft" style="background:var(--surface-2);padding:.75rem;border-radius:var(--radius-sm);"><div class="text-muted" style="font-size:.7rem;text-transform:uppercase;">Cores</div><strong>${a.cpu.cores}</strong></div>
      <div class="card-soft" style="background:var(--surface-2);padding:.75rem;border-radius:var(--radius-sm);"><div class="text-muted" style="font-size:.7rem;text-transform:uppercase;">Clock</div><strong>${a.cpu.clock}</strong></div>
      <div class="card-soft" style="background:var(--surface-2);padding:.75rem;border-radius:var(--radius-sm);"><div class="text-muted" style="font-size:.7rem;text-transform:uppercase;">TDP</div><strong>${a.cpu.tdp}W</strong></div>
      <div class="card-soft" style="background:var(--surface-2);padding:.75rem;border-radius:var(--radius-sm);"><div class="text-muted" style="font-size:.7rem;text-transform:uppercase;">Socket</div><strong>${a.cpu.socket}</strong></div>
    </div>`;

  const gpuRank = allGpus().sort((x,y)=>y.ts-x.ts).findIndex(g=>g.name===a.gpu.name)+1;
  const gpuTotal = allGpus().length;
  $('#gpuBench').innerHTML = `
    <div class="flex-between mb-2">
      <div><div style="font-size:1.5rem;font-weight:800;">${fmt(a.gpu.ts)}</div><div class="text-muted">3DMark Time Spy Graphics</div></div>
      <div class="pill pill-blue">Rank #${gpuRank} of ${gpuTotal}</div>
    </div>
    <div class="meter mb-2"><div class="meter-label">Relative</div><div class="meter-track"><div class="meter-fill good" style="width:${Math.min(100,a.gpu.ts/365)}%"></div></div><div class="meter-value">${Math.round(a.gpu.ts/365)}</div></div>
    <div class="grid grid-2">
      <div class="card-soft" style="background:var(--surface-2);padding:.75rem;border-radius:var(--radius-sm);"><div class="text-muted" style="font-size:.7rem;text-transform:uppercase;">VRAM</div><strong>${a.gpu.vram} GB</strong></div>
      <div class="card-soft" style="background:var(--surface-2);padding:.75rem;border-radius:var(--radius-sm);"><div class="text-muted" style="font-size:.7rem;text-transform:uppercase;">TDP</div><strong>${a.gpu.tdp} W</strong></div>
      <div class="card-soft" style="background:var(--surface-2);padding:.75rem;border-radius:var(--radius-sm);"><div class="text-muted" style="font-size:.7rem;text-transform:uppercase;">Ray Tracing</div><strong>${a.gpu.rt?'Yes':'No'}</strong></div>
      <div class="card-soft" style="background:var(--surface-2);padding:.75rem;border-radius:var(--radius-sm);"><div class="text-muted" style="font-size:.7rem;text-transform:uppercase;">Tier</div><strong style="text-transform:capitalize;">${a.gpu.tier}</strong></div>
    </div>`;

  const topCpus = allCpus().sort((x,y)=>y.cb23-x.cb23).slice(0,5);
  const topGpus = allGpus().sort((x,y)=>y.ts-x.ts).slice(0,5);
  $('#benchDb').innerHTML = `
    <div class="grid grid-2">
      <div><h4 style="font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:.5rem;">Top CPUs</h4>
      <table class="data"><thead><tr><th>CPU</th><th>CB23</th></tr></thead><tbody>${topCpus.map(c=>`<tr><td>${c.name}</td><td>${fmt(c.cb23)}</td></tr>`).join('')}</tbody></table></div>
      <div><h4 style="font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:.5rem;">Top GPUs</h4>
      <table class="data"><thead><tr><th>GPU</th><th>Time Spy</th></tr></thead><tbody>${topGpus.map(g=>`<tr><td>${g.name}</td><td>${fmt(g.ts)}</td></tr>`).join('')}</tbody></table></div>
    </div>`;
}

/* ----------------------------------------------------------------
   COMPARE
   ---------------------------------------------------------------- */
function populateCompareSelects(){
  const cpuOpts = allCpus().map(c=>`<option value="${c.name}">${c.name}</option>`).join('');
  const gpuOpts = allGpus().map(g=>`<option value="${g.name}">${g.name}</option>`).join('');
  const ramOpts = RAMS.map(r=>`<option value="${r.capacity}GB ${r.type}">${r.capacity}GB ${r.type}</option>`).join('');
  ['cmpACpu','cmpBCpu'].forEach(id=>{ const el=$('#'+id); if(el && !el.innerHTML) el.innerHTML = cpuOpts; });
  ['cmpAGpu','cmpBGpu'].forEach(id=>{ const el=$('#'+id); if(el && !el.innerHTML) el.innerHTML = gpuOpts; });
  ['cmpARam','cmpBRam'].forEach(id=>{ const el=$('#'+id); if(el && !el.innerHTML) el.innerHTML = ramOpts; });
  if($('#cmpACpu').value==='' && state.build.cpu) $('#cmpACpu').value = state.build.cpu;
  if($('#cmpAGpu').value==='' && state.build.gpu) $('#cmpAGpu').value = state.build.gpu;
  if($('#cmpARam').value==='' && state.build.ramType) $('#cmpARam').value = `${state.build.ramCapacity}GB ${state.build.ramType}`;
  if($('#cmpBCpu').value==='' ) $('#cmpBCpu').value = 'Ryzen 7 7800X3D';
  if($('#cmpBGpu').value==='' ) $('#cmpBGpu').value = 'RTX 5080';
  if($('#cmpBRam').value==='' ) $('#cmpBRam').value = '32GB DDR5';
}
function evalBuild(cpuName, gpuName, ramLabel){
  const cpu = getCpuData(cpuName), gpu = getGpuData(gpuName);
  // parse "16GB DDR4"
  const m = (ramLabel||'').match(/^(\d+)GB\s+(DDR\d)/);
  const cap = m ? parseInt(m[1],10) : 16;
  const type = m ? m[2] : 'DDR4';
  const ram = RAMS.find(r=>r.capacity===cap && r.type===type) || RAMS[3];
  const cpuScore = clamp(Math.round(cpu.mult*42),5,100);
  const gpuScore = clamp(Math.round(gpu.mult*30),5,100);
  const ramScore = clamp(Math.round(ram.mult*78),5,100);
  const total = Math.round(cpuScore*0.35 + gpuScore*0.5 + ramScore*0.15);
  return {cpu, gpu, ram, cpuScore, gpuScore, ramScore, total};
}
function runCompare(){
  const A = evalBuild($('#cmpACpu').value, $('#cmpAGpu').value, $('#cmpARam').value);
  const B = evalBuild($('#cmpBCpu').value, $('#cmpBGpu').value, $('#cmpBRam').value);
  const gpuDelta = ((B.gpuScore - A.gpuScore) / A.gpuScore * 100);
  const cpuDelta = ((B.cpuScore - A.cpuScore) / A.cpuScore * 100);
  const ramDelta = ((B.ramScore - A.ramScore) / A.ramScore * 100);
  const winner = B.total > A.total ? 'B' : 'A';
  const diff = Math.abs(B.total - A.total);

  $('#compareResult').innerHTML = `
    <div class="grid grid-2 mb-3">
      <div class="card-soft" style="background:var(--surface-2);padding:1.25rem;border-radius:var(--radius-sm);">
        <div class="card-title mb-2"><i class="fas fa-desktop"></i> Build A</div>
        <div class="text-muted" style="font-size:.8rem;">${A.cpu.name}</div>
        <div class="text-muted" style="font-size:.8rem;">${A.gpu.name}</div>
        <div class="text-muted mb-2" style="font-size:.8rem;">${A.ram.capacity}GB ${A.ram.type}</div>
        <div style="font-size:2.2rem;font-weight:800;letter-spacing:-.03em;">${A.total}<span style="font-size:1rem;color:var(--text-3);">/100</span></div>
        ${winner==='A'?'<span class="pill pill-green">Winner</span>':''}
      </div>
      <div class="card-soft" style="background:var(--surface-2);padding:1.25rem;border-radius:var(--radius-sm);">
        <div class="card-title mb-2"><i class="fas fa-desktop"></i> Build B</div>
        <div class="text-muted" style="font-size:.8rem;">${B.cpu.name}</div>
        <div class="text-muted" style="font-size:.8rem;">${B.gpu.name}</div>
        <div class="text-muted mb-2" style="font-size:.8rem;">${B.ram.capacity}GB ${B.ram.type}</div>
        <div style="font-size:2.2rem;font-weight:800;letter-spacing:-.03em;">${B.total}<span style="font-size:1rem;color:var(--text-3);">/100</span></div>
        ${winner==='B'?'<span class="pill pill-green">Winner</span>':''}
      </div>
    </div>
    <table class="data">
      <thead><tr><th>Metric</th><th>Build A</th><th>Build B</th><th>Δ</th></tr></thead>
      <tbody>
        <tr><td>CPU Score</td><td>${A.cpuScore}</td><td>${B.cpuScore}</td><td style="color:${cpuDelta>=0?'var(--success)':'var(--danger)'};">${cpuDelta>=0?'+':''}${cpuDelta.toFixed(0)}%</td></tr>
        <tr><td>GPU Score</td><td>${A.gpuScore}</td><td>${B.gpuScore}</td><td style="color:${gpuDelta>=0?'var(--success)':'var(--danger)'};">${gpuDelta>=0?'+':''}${gpuDelta.toFixed(0)}%</td></tr>
        <tr><td>RAM Score</td><td>${A.ramScore}</td><td>${B.ramScore}</td><td style="color:${ramDelta>=0?'var(--success)':'var(--danger)'};">${ramDelta>=0?'+':''}${ramDelta.toFixed(0)}%</td></tr>
      </tbody>
    </table>
    <div class="mt-3" style="padding:1rem;background:color-mix(in srgb,var(--primary) 8%,transparent);border-radius:var(--radius-sm);border-left:3px solid var(--primary);">
      <strong>🏆 Recommended: Build ${winner}</strong>
      <p class="text-muted mt-1" style="font-size:.85rem;">Build ${winner} scores ${Math.max(A.total,B.total)} vs ${Math.min(A.total,B.total)} (${diff} point difference). ${winner==='B'?'Build B is significantly faster.':'Build A is the better performer.'}</p>
    </div>
  `;
}
$('#runCompare').addEventListener('click', runCompare);

/* ----------------------------------------------------------------
   ADVISOR
   ---------------------------------------------------------------- */
$$('#advisorGoals button').forEach(btn=>btn.addEventListener('click', ()=>{
  const goal = btn.dataset.goal;
  const a = state.analysis;
  if(!a){ toast('Analyze your PC first','fa-triangle-exclamation'); return; }
  let html = '';
  if(goal==='fps'){
    html = `<div class="card-title mb-2"><i class="fas fa-gamepad"></i> Max FPS Recommendation</div>
    <p class="text-muted mb-2">Your ${a.gpu.name} is producing good frames. For maximum FPS:</p>
    <ul style="list-style:none;line-height:2;font-size:.9rem;">
      <li>• Set graphics to <strong>Low/Medium</strong> in competitive titles.</li>
      <li>• Enable <strong>${a.gpu.rt?'DLSS/FSR Performance':'FSR'}</strong> if supported.</li>
      <li>• Disable ray tracing.</li>
      <li>• Consider a <strong>CPU upgrade</strong> if you play at 1080p — your ${a.cpu.name} will cap frames first.</li>
    </ul>`;
  } else if(goal==='graphics'){
    html = `<div class="card-title mb-2"><i class="fas fa-palette"></i> Better Graphics Recommendation</div>
    <p class="text-muted mb-2">For high/ultra settings with ray tracing:</p>
    <ul style="list-style:none;line-height:2;font-size:.9rem;">
      <li>• Target <strong>${a.gpu.tier==='flagship'?'4K':'1440p'}</strong> for the best balance.</li>
      <li>• Enable <strong>${a.gpu.rt?'DLSS/FSR Quality':'FSR Quality'}</strong>.</li>
      <li>• <strong>${a.gpu.rt?'Your GPU supports ray tracing.':'Your GPU does not support hardware ray tracing.'}</strong></li>
      ${a.gpuScore<70?'<li>• A GPU upgrade would unlock Ultra + RT.</li>':''}
    </ul>`;
  } else if(goal==='value'){
    html = `<div class="card-title mb-2"><i class="fas fa-dollar-sign"></i> Best Value Recommendation</div>
    <p class="text-muted mb-2">Best FPS-per-dollar moves for your build:</p>
    <ul style="list-style:none;line-height:2;font-size:.9rem;">
      <li>• <strong>GPU:</strong> RX 7600 or RTX 4060 — biggest jump per dollar.</li>
      <li>• <strong>SSD:</strong> NVMe Gen4 1TB — cheap, noticeable improvement.</li>
      ${a.ram.capacity<32?'<li>• <strong>RAM:</strong> 32GB kit — future-proofs modern games.</li>':''}
    </ul>`;
  } else if(goal==='fix'){
    if(a.bottlenecks.length===0){
      html = `<div class="card-title mb-2"><i class="fas fa-circle-check" style="color:var(--success);"></i> No Bottlenecks</div><p class="text-muted">Your system is well balanced. No fixes required.</p>`;
    } else {
      const worst = a.bottlenecks.reduce((x,y)=> (x.pct||0) > (y.pct||0) ? x : y);
      const gpuTier = a.gpu.tier;
      const upgradeMap = {
        'entry':       {cpu:'Ryzen 5 7600X', gpu:'RX 7600',      cost:'~$200'},
        'mainstream':  {cpu:'Ryzen 7 7800X3D', gpu:'RTX 4070',   cost:'~$350'},
        'performance': {cpu:'Ryzen 7 7800X3D', gpu:'RTX 4070 Ti',cost:'~$550'},
        'enthusiast':  {cpu:'Ryzen 9 7900X',  gpu:'RTX 4080',    cost:'~$900'},
        'flagship':    {cpu:'Ryzen 9 9950X3D',gpu:'RTX 5090',    cost:'~$2000'}
      };
      const rec = upgradeMap[gpuTier] || upgradeMap.mainstream;
      let suggestion = '';
      if(worst.component === 'CPU'){
        suggestion = `Upgrade your CPU to a <strong>${rec.cpu}</strong> to feed your ${a.gpu.name}.`;
      } else if(worst.component === 'GPU'){
        suggestion = `Upgrade your GPU to a <strong>${rec.gpu}</strong> to match your ${a.cpu.name}.`;
      } else {
        suggestion = `Add more RAM — go from <strong>${a.ram.capacity}GB to 32GB</strong> to remove memory pressure in modern games.`;
      }
      html = `<div class="card-title mb-2"><i class="fas fa-wrench"></i> Fix My Bottleneck</div>
      <div class="bn-item mb-3" style="border-color:color-mix(in srgb,var(--warn) 40%,transparent);">
        <div class="bn-icon ${worst.icon}"><i class="fas fa-${worst.component==='CPU'?'microchip':worst.component==='GPU'?'display':'memory'}"></i></div>
        <div class="bn-body">
          <div class="bn-head"><strong>Biggest bottleneck: ${worst.component}</strong><span>${worst.pct}% impact</span></div>
          <div class="bn-desc">${worst.desc}</div>
        </div>
      </div>
      <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1rem;margin-bottom:.75rem;">
        <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:.4rem;">Recommended upgrade</div>
        <div style="font-size:.95rem;font-weight:600;line-height:1.4;">${suggestion}</div>
        <div class="text-muted" style="font-size:.78rem;margin-top:.5rem;">Estimated cost: <strong>${rec.cost}</strong></div>
      </div>
      <div class="flex" style="gap:.5rem;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="navigate('upgrade')"><i class="fas fa-arrow-up"></i> See full upgrade path</button>
        <button class="btn btn-ghost" onclick="navigate('compare')"><i class="fas fa-code-compare"></i> Compare vs upgrade</button>
      </div>`;
    }
  } else if(goal==='upgrade'){
    html = `<div class="card-title mb-2"><i class="fas fa-arrow-up"></i> Upgrade Plan</div>
    <p class="text-muted mb-2">Recommended progression from your current build:</p>
    ${upgradeTeaserHtml(a)}`;
  } else if(goal==='144'){
    const hits = a.gameResults.filter(g=>g.fps>=144).length;
    const misses = a.gameResults.filter(g=>g.fps<144).slice(0,5);
    html = `<div class="card-title mb-2"><i class="fas fa-gauge-high"></i> Reaching 144 FPS</div>
    <p class="text-muted mb-2">You hit 144+ FPS in <strong>${hits} of ${a.gameResults.length}</strong> titles.</p>
    ${misses.length?'<p class="text-muted mb-1">Games that fall short:</p>':'<p class="text-muted">You hit 144 FPS in every game tested. Excellent!</p>'}
    ${misses.map(g=>`<div class="bn-item mb-1"><div class="bn-icon gpu"><i class="fas fa-gamepad"></i></div><div class="bn-body"><div class="bn-head"><strong>${g.name}</strong><span>${g.fps} FPS</span></div></div></div>`).join('')}`;
  }
  $('#advisorResult').innerHTML = html;
}));

/* ----------------------------------------------------------------
   SAVED BUILDS
   ---------------------------------------------------------------- */
$('#saveBuildBtn').addEventListener('click', ()=>{
  const name = prompt('Name your build:', (state.build.cpu||'My').split(' ')[0] + ' + ' + (state.build.gpu||'Build').split(' ').slice(0,2).join(' '));
  if(!name) return;
  const entry = {id:Date.now(), name, build:JSON.parse(JSON.stringify(state.build)), date:new Date().toISOString()};
  state.savedBuilds.push(entry);
  CK.set('pcp_builds', state.savedBuilds);
  renderSavedBuilds();
  toast('Build saved','fa-save');
});
function renderSavedBuilds(){
  if(state.savedBuilds.length===0){
    $('#savedBuilds').innerHTML = `<div class="empty"><i class="fas fa-cubes"></i><p>No saved builds yet. Configure your PC and click "Save current build".</p></div>`;
    return;
  }
  $('#savedBuilds').innerHTML = `<div class="grid grid-2">${state.savedBuilds.map(b=>`
    <div class="card">
      <div class="flex-between mb-1">
        <div class="card-title">${b.name}</div>
        <span class="pill pill-gray">${new Date(b.date).toLocaleDateString()}</span>
      </div>
      <div class="text-muted" style="font-size:.82rem;">${b.build.cpu || '—'}</div>
      <div class="text-muted" style="font-size:.82rem;">${b.build.gpu || '—'}</div>
      <div class="text-muted mb-2" style="font-size:.82rem;">${b.build.ram || '—'}</div>
      <div class="flex">
        <button class="btn btn-sm" onclick="loadBuild(${b.id})"><i class="fas fa-folder-open"></i> Load</button>
        <button class="btn btn-sm" onclick="dupBuild(${b.id})"><i class="fas fa-copy"></i> Duplicate</button>
        <button class="btn btn-sm btn-danger" onclick="delBuild(${b.id})"><i class="fas fa-trash"></i> Delete</button>
      </div>
    </div>`).join('')}</div>`;
}
function loadBuild(id){
  const b = state.savedBuilds.find(x=>x.id===id);
  if(!b) return;
  state.build = JSON.parse(JSON.stringify(b.build));
  CK.set('pcp_build', state.build);
  syncBuildUI();
  analyze();
  navigate('home');
  toast('Loaded "'+b.name+'"','fa-folder-open');
}
function dupBuild(id){
  const b = state.savedBuilds.find(x=>x.id===id);
  if(!b) return;
  state.savedBuilds.push({...b, id:Date.now(), name:b.name+' (copy)', date:new Date().toISOString()});
  CK.set('pcp_builds', state.savedBuilds);
  renderSavedBuilds();
}
function delBuild(id){
  confirmDialog('Delete this build?', ()=>{
    state.savedBuilds = state.savedBuilds.filter(x=>x.id!==id);
    CK.set('pcp_builds', state.savedBuilds);
    renderSavedBuilds();
    toast('Build deleted','fa-trash');
  });
}

/* ----------------------------------------------------------------
   SETTINGS
   ---------------------------------------------------------------- */
$$('#themeSwatches .swatch').forEach(el=>el.addEventListener('click', ()=>{
  state.settings.theme = el.dataset.theme;
  CK.set('pcp_settings', state.settings);
  applyTheme();
}));
$('#accentPicker').addEventListener('input', e=>{
  state.settings.accent = e.target.value;
  CK.set('pcp_settings', state.settings);
  applyTheme();
});
$('#grad1').addEventListener('input', e=>{ state.settings.grad1 = e.target.value; CK.set('pcp_settings', state.settings); applyTheme(); });
$('#grad2').addEventListener('input', e=>{ state.settings.grad2 = e.target.value; CK.set('pcp_settings', state.settings); applyTheme(); });
$('#defaultRes').addEventListener('change', e=>{ state.settings.defaultRes = e.target.value; CK.set('pcp_settings', state.settings); });
$('#defaultFps').addEventListener('change', e=>{ state.settings.defaultFps = e.target.value; CK.set('pcp_settings', state.settings); });
$('#defaultQuality').addEventListener('change', e=>{ state.settings.defaultQuality = e.target.value; CK.set('pcp_settings', state.settings); });

$('#quickTheme').addEventListener('click', ()=>{
  const order = ['dark','light','custom'];
  const next = order[(order.indexOf(state.settings.theme)+1)%order.length];
  state.settings.theme = next;
  CK.set('pcp_settings', state.settings);
  applyTheme();
});
$('#quickSettings').addEventListener('click', ()=>navigate('settings'));

$('#exportBtn').addEventListener('click', ()=>{
  const payload = {version:4.3, build:state.build, settings:state.settings, builds:state.savedBuilds, exported:new Date().toISOString()};
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pcplayground-build.pcp';
  a.click();
  toast('Build exported','fa-download');
});
$('#importBtn').addEventListener('click', ()=>$('#importFile').click());
$('#importFile').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    try{
      const data = JSON.parse(ev.target.result);
      if(data.build) { state.build = data.build; CK.set('pcp_build', state.build); }
      if(data.settings) { state.settings = {...state.settings, ...data.settings}; CK.set('pcp_settings', state.settings); }
      if(data.builds) { state.savedBuilds = data.builds; CK.set('pcp_builds', state.savedBuilds); }
      syncBuildUI(); applyTheme(); analyze(); renderSavedBuilds();
      toast('Build imported','fa-upload');
    }catch(err){ toast('Invalid file','fa-triangle-exclamation'); }
  };
  reader.readAsText(file);
});
$('#resetPrefs').addEventListener('click', ()=>{
  confirmDialog('Reset preferences?', ()=>{
    state.settings = {theme:'dark', accent:'#3b82f6', grad1:'#3b82f6', grad2:'#a78bfa', defaultRes:'1080p', defaultFps:'144', defaultQuality:'High'};
    CK.set('pcp_settings', state.settings);
    applyTheme();
    toast('Preferences reset','fa-rotate-left');
  });
});
$('#clearAll').addEventListener('click', ()=>{
  confirmDialog('Clear ALL data (builds + settings)? This cannot be undone.', ()=>{
    CK.clearAll();
    location.reload();
  });
});

let confirmCb = null;
function confirmDialog(msg, cb){
  $('#confirmText').textContent = msg;
  confirmCb = cb;
  $('#confirmModal').classList.add('show');
}
$('#confirmCancel').addEventListener('click', ()=>{ $('#confirmModal').classList.remove('show'); confirmCb=null; });
$('#confirmOk').addEventListener('click', ()=>{ $('#confirmModal').classList.remove('show'); if(confirmCb) confirmCb(); confirmCb=null; });

/* ----------------------------------------------------------------
   GLOBAL SEARCH
   ---------------------------------------------------------------- */
let searchActiveFilter = 'all';
let searchDebounce = null;

function buildSearchIndex(){
  const items = [];
  GAMES.forEach(g=>{
    items.push({
      type:'game',
      name:g.name,
      sub:g.genre + ' · ' + g.preset,
      icon:'fa-gamepad',
      data:g
    });
  });
  allCpus().forEach(c=>{
    items.push({
      type:'cpu',
      name:c.name,
      sub:`${c.cores} · ${c.clock} · ${c.socket}`,
      icon:'fa-microchip',
      data:c
    });
  });
  allGpus().forEach(g=>{
    items.push({
      type:'gpu',
      name:g.name,
      sub:`${g.vram}GB · ${g.tdp}W · ${g.tier}`,
      icon:'fa-display',
      data:g
    });
  });
  RAMS.forEach(r=>{
    const label = `${r.capacity}GB ${r.type}`;
    items.push({
      type:'ram',
      name: label,
      sub: r.speeds.join(' / ') + ' MHz',
      icon:'fa-memory',
      data:r
    });
  });
  return items;
}

let SEARCH_INDEX = [];

function runSearch(query){
  const q = query.trim().toLowerCase();
  if(!q){
    $('#searchResults').classList.remove('show');
    return;
  }
  if(!SEARCH_INDEX.length) SEARCH_INDEX = buildSearchIndex();

  let matches = SEARCH_INDEX.filter(it => it.name.toLowerCase().includes(q));
  if(searchActiveFilter !== 'all'){
    matches = matches.filter(it => it.type === searchActiveFilter);
  }
  matches.sort((a,b)=>{
    const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
    const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
    if(aStarts !== bStarts) return aStarts - bStarts;
    return a.name.length - b.name.length;
  });
  matches = matches.slice(0, 12);

  const body = $('#searchResultsBody');
  const panel = $('#searchResults');

  if(matches.length === 0){
    body.innerHTML = `<div class="search-empty"><i class="fas fa-search" style="opacity:.4;display:block;font-size:1.6rem;margin-bottom:.4rem;"></i>No results for "<strong>${query.trim()}</strong>"</div>`;
    panel.classList.add('show');
    return;
  }

  const groups = {game:[], cpu:[], gpu:[], ram:[]};
  matches.forEach(m=>groups[m.type].push(m));

  const groupLabels = {game:'Games', cpu:'CPUs', gpu:'GPUs', ram:'RAM'};
  let html = '';
  ['game','cpu','gpu','ram'].forEach(type=>{
    if(groups[type].length === 0) return;
    html += `<div class="search-group">
      <div class="search-group-title">${groupLabels[type]}</div>
      ${groups[type].map(m=>`
        <div class="search-item" data-type="${m.type}" data-name="${m.name.replace(/"/g,'&quot;')}">
          <div class="search-item-icon ${m.type}"><i class="fas ${m.icon}"></i></div>
          <div class="search-item-info">
            <div class="search-item-name">${m.name}</div>
            <div class="search-item-sub">${m.sub}</div>
          </div>
          <div class="search-item-arrow"><i class="fas fa-arrow-right"></i></div>
        </div>
      `).join('')}
    </div>`;
  });
  body.innerHTML = html;
  panel.classList.add('show');

  $$('#searchResultsBody .search-item').forEach(el=>{
    el.addEventListener('click', ()=>{
      const type = el.dataset.type;
      const name = el.dataset.name;
      handleSearchSelect(type, name);
    });
  });
}

function handleSearchSelect(type, name){
  hideSearch();
  $('#globalSearch').value = '';

  if(type === 'game'){
    const g = GAMES.find(x=>x.name===name);
    if(!g) return;
    if(!state.analysis){
      toast('Configure your PC first to see ' + g.name, 'fa-triangle-exclamation');
      navigate('mypc');
      return;
    }
    const analyzed = state.analysis.gameResults.find(x=>x.name===name);
    if(analyzed){
      openGameModal(analyzed);
    } else {
      openGameModal(g);
    }
  } else if(type === 'cpu'){
    for(const brand in CPUS){
      if(CPUS[brand].some(c=>c.name===name)){
        state.build.cpuBrand = brand;
        state.build.cpu = name;
        CK.set('pcp_build', state.build);
        syncBuildUI();
        navigate('mypc');
        toast('Selected CPU: ' + name, 'fa-microchip');
        return;
      }
    }
  } else if(type === 'gpu'){
    for(const brand in GPUS){
      if(GPUS[brand].some(g=>g.name===name)){
        state.build.gpuBrand = brand;
        state.build.gpu = name;
        CK.set('pcp_build', state.build);
        syncBuildUI();
        navigate('mypc');
        toast('Selected GPU: ' + name, 'fa-display');
        return;
      }
    }
  } else if(type === 'ram'){
    const m = name.match(/^(\d+)GB\s+(DDR\d)/);
    if(m){
      state.build.ramCapacity = m[1];
      state.build.ramType = m[2];
      CK.set('pcp_build', state.build);
      syncBuildUI();
      navigate('mypc');
      toast('Selected RAM: ' + name, 'fa-memory');
    }
  }
}

function hideSearch(){
  $('#searchResults').classList.remove('show');
}

$('#globalSearch').addEventListener('input', (e)=>{
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(()=>runSearch(e.target.value), 180);
});

$$('#searchFilters .search-chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    $$('#searchFilters .search-chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    searchActiveFilter = chip.dataset.filter;
    runSearch($('#globalSearch').value);
  });
});

$('#globalSearch').addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){ hideSearch(); e.target.blur(); }
});

document.addEventListener('click', (e)=>{
  const box = e.target.closest('.search-box');
  if(!box) hideSearch();
});

document.addEventListener('keydown', (e)=>{
  if(e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT' && document.activeElement.tagName !== 'TEXTAREA'){
    e.preventDefault();
    $('#globalSearch').focus();
  }
});

/* ----------------------------------------------------------------
   MOBILE SIDEBAR
   ---------------------------------------------------------------- */
function checkMobile(){
  const isMobile = window.innerWidth <= 760;
  $('#menuBtn').style.display = isMobile ? 'grid' : 'none';
  if(!isMobile){
    $('#sidebar').classList.remove('open');
    $('#sidebarBackdrop').classList.remove('show');
  }
}
window.addEventListener('resize', checkMobile);
checkMobile();

function openSidebar(){
  $('#sidebar').classList.add('open');
  $('#sidebarBackdrop').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeSidebar(){
  $('#sidebar').classList.remove('open');
  $('#sidebarBackdrop').classList.remove('show');
  document.body.style.overflow = '';
}

$('#menuBtn').addEventListener('click', ()=>{
  if($('#sidebar').classList.contains('open')) closeSidebar();
  else openSidebar();
});
$('#sidebarClose').addEventListener('click', closeSidebar);
$('#sidebarBackdrop').addEventListener('click', closeSidebar);

$$('.nav-item').forEach(item=>item.addEventListener('click', ()=>{
  if(window.innerWidth <= 760) closeSidebar();
}));

let touchStartX = 0;
let touchStartY = 0;
let touchingSidebar = false;

document.addEventListener('touchstart', (e)=>{
  if(window.innerWidth > 760) return;
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
  touchingSidebar = touchStartX < 40 || $('#sidebar').contains(e.target);
}, {passive:true});

document.addEventListener('touchend', (e)=>{
  if(window.innerWidth > 760) return;
  if(!e.changedTouches || !e.changedTouches.length) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  if(Math.abs(dy) > Math.abs(dx)) return;
  const isOpen = $('#sidebar').classList.contains('open');
  if(!isOpen && touchStartX < 40 && dx > 60){
    openSidebar();
  } else if(isOpen && dx < -60){
    closeSidebar();
  }
}, {passive:true});

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && $('#sidebar').classList.contains('open')) closeSidebar();
});

/* ----------------------------------------------------------------
   BOOT
   ---------------------------------------------------------------- */
(function boot(){
  $('#cpuBrand').value = state.build.cpuBrand;
  populateCpuSelect();
  if(state.build.cpu) $('#cpuSelect').value = state.build.cpu;
  $('#gpuBrand').value = state.build.gpuBrand;
  populateGpuSelect();
  if(state.build.gpu) $('#gpuSelect').value = state.build.gpu;
  populateRamSelect();
  if($('#ramCapacity')) $('#ramCapacity').value = state.build.ramCapacity || '';
  if($('#ramType')) $('#ramType').value = state.build.ramType || '';
  populateRamSpeed();
  if($('#ramSpeed') && state.build.ramSpeed) $('#ramSpeed').value = state.build.ramSpeed;
  if($('#psuWatt') && state.build.psuWatt) $('#psuWatt').value = state.build.psuWatt;
  $('#psuEff').value = state.build.psuEff;
  $('#coolerType').value = state.build.coolerType;
  renderStorage();
  applyTheme();
  populateCompareSelects();
  renderSavedBuilds();
  updateTower();

  if(savedBuild && savedBuild.cpu && savedBuild.gpu){ analyze(); }
  else {
    $('#heroCpu').textContent = state.build.cpu || '—';
    $('#heroGpu').textContent = state.build.gpu || '—';
    $('#heroRam').textContent = state.build.ram || '—';
    $('#gamesCountBadge').textContent = GAMES.length;
  }
  console.log('%cPC Playground v4.3','font-size:16px;font-weight:800;color:#3b82f6');
  console.log('Loaded:', allCpus().length, 'CPUs,', allGpus().length, 'GPUs,', GAMES.length, 'games');
})();
