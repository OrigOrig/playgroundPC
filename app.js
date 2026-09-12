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
    moboSocket:'', moboChipset:'', mobo:'',
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
function getMoboData(name){ return MOTHERBOARDS.find(m=>m.name===name) || null; }
function chipsetsForSocket(socket){ return [...new Set(MOTHERBOARDS.filter(m=>m.socket===socket).map(m=>m.chipset))]; }
function mobosForChipset(socket, chipset){ return MOTHERBOARDS.filter(m=>m.socket===socket && m.chipset===chipset); }

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
  if(page==='buildapc') renderBuildAPC();
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
function populateMoboSelect(){
  const sockSel = $('#moboSocket');
  const chipSel = $('#moboChipset');
  const moboSel = $('#moboSelect');
  if(!sockSel || !chipSel || !moboSel) return;

  if(state.build.moboSocket) sockSel.value = state.build.moboSocket;

  if(sockSel.value){
    const chips = chipsetsForSocket(sockSel.value);
    chipSel.innerHTML = `<option value="" disabled hidden>-</option>` +
      chips.map(c=>`<option value="${c}">${c}</option>`).join('');
    if(state.build.moboChipset && chips.includes(state.build.moboChipset)) chipSel.value = state.build.moboChipset;
    else chipSel.value = '';
  } else {
    chipSel.innerHTML = `<option value="" disabled hidden>-</option>`;
    chipSel.value = '';
  }

  if(sockSel.value && chipSel.value){
    const boards = mobosForChipset(sockSel.value, chipSel.value);
    moboSel.innerHTML = `<option value="" disabled hidden>-</option>` +
      boards.map(m=>`<option value="${m.name}">${m.name} — ${m.form} · $${m.price}</option>`).join('');
    if(state.build.mobo && boards.some(b=>b.name===state.build.mobo)) moboSel.value = state.build.mobo;
    else moboSel.value = '';
  } else {
    moboSel.innerHTML = `<option value="" disabled hidden>-</option>`;
    moboSel.value = '';
  }
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
$('#moboSocket').addEventListener('change', ()=>{
  state.build.moboSocket = $('#moboSocket').value;
  state.build.moboChipset = '';
  state.build.mobo = '';
  populateMoboSelect();
});
$('#moboChipset').addEventListener('change', ()=>{
  state.build.moboChipset = $('#moboChipset').value;
  state.build.mobo = '';
  populateMoboSelect();
});
$('#moboSelect').addEventListener('change', ()=>{
  state.build.mobo = $('#moboSelect').value;
});

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
  state.build.moboSocket = $('#moboSocket') ? $('#moboSocket').value : state.build.moboSocket;
  state.build.moboChipset = $('#moboChipset') ? $('#moboChipset').value : state.build.moboChipset;
  state.build.mobo = $('#moboSelect') ? $('#moboSelect').value : state.build.mobo;

  const cpu = getCpuData(state.build.cpu);
  const gpu = getGpuData(state.build.gpu);
  const ram = getRamData();
  const mobo = getMoboData(state.build.mobo);

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

  const moboPower = mobo ? (mobo.chipset.startsWith('X') || mobo.chipset.startsWith('Z') ? 25 : 15) : 0;
  const power = cpu.tdp + gpu.tdp + ram.tdp + moboPower
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
    cpu, gpu, ram, mobo, cpuScore, gpuScore, ramScore, storageScore, totalScore,
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
  if($('#moboSocket')) $('#moboSocket').value = state.build.moboSocket || '';
  populateMoboSelect();
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
    <div class="spec-row"><div class="spec-icon"><i class="fas fa-square-poll-vertical"></i></div><div class="spec-info"><div class="label">Motherboard</div><div class="value">${a.mobo ? a.mobo.name : '—'}</div></div></div>
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
  if(a.mobo){
    const socketOK = a.mobo.socket === a.cpu.socket;
    checks.push({ ok:socketOK, label:'CPU fits motherboard socket',
      desc: socketOK ? `${a.cpu.name} (${a.cpu.socket}) matches ${a.mobo.name}`
                     : `${a.cpu.name} is ${a.cpu.socket}, mobo is ${a.mobo.socket}.` });

    const ramTypeOK = a.mobo.ramType === a.ram.type;
    checks.push({ ok:ramTypeOK, label:'RAM type matches motherboard',
      desc: ramTypeOK ? `${a.ram.type} supported`
                      : `Mobo uses ${a.mobo.ramType}, you selected ${a.ram.type}.` });

    const ramCapOK = a.ram.capacity <= a.mobo.maxRam;
    checks.push({ ok:ramCapOK, label:'RAM capacity within board limit',
      desc: ramCapOK ? `${a.ram.capacity}GB ≤ ${a.mobo.maxRam}GB max`
                     : `${a.ram.capacity}GB exceeds ${a.mobo.maxRam}GB limit.` });

    const vrmOK = !(a.cpu.tdp >= 150 && a.mobo.vrmTier === 'basic');
    checks.push({ ok:vrmOK, label:'VRM adequate for CPU',
      desc: vrmOK ? `${a.mobo.vrmTier} VRM for ${a.cpu.tdp}W CPU`
                  : `${a.cpu.tdp}W CPU on a basic VRM — will throttle.` });
  } else {
    checks.push({ ok:false, label:'Motherboard not selected', desc:'Pick a motherboard to run platform checks.' });
  }
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
  } else if(goal==='target'){
    // Build a game <option> list sorted alphabetically
    const sorted = [...a.gameResults].sort((x,y)=>x.name.localeCompare(y.name));
    const gameOptions = `<option value="" disabled selected hidden>Select a game</option>` +
      sorted.map(g => `<option value="${g.name.replace(/"/g,'&quot;')}">${g.name}</option>`).join('');
    html = `
      <div class="card-title mb-2"><i class="fas fa-bullseye"></i> Target FPS Advisor</div>
      <p class="text-muted mb-2">Tell us what you want to play and at what framerate.</p>
      <div style="display:grid;grid-template-columns:2fr 1fr auto;gap:.75rem;align-items:end;margin-bottom:1rem;">
        <div class="field" style="margin:0;">
          <label>Game</label>
          <select id="targetGame" style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:.6rem .75rem;color:var(--text);font-family:inherit;font-size:.85rem;font-weight:500;">
            ${gameOptions}
          </select>
        </div>
        <div class="field" style="margin:0;">
          <label>Target FPS</label>
          <input type="number" id="targetFpsAdvisor" value="144" min="30" max="360" step="1" style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:.6rem .75rem;color:var(--text);font-family:inherit;font-size:.85rem;font-weight:500;width:100%;">
        </div>
        <button class="btn btn-primary" id="targetCheckBtn"><i class="fas fa-bolt"></i> Check</button>
      </div>
      <div id="targetResult"></div>
    `;
  }
  $('#advisorResult').innerHTML = html;

  // If this is the Target-FPS advisor, wire its Check button
  const checkBtn = $('#targetCheckBtn');
  if(checkBtn){
    checkBtn.addEventListener('click', runTargetFpsCheck);
    // Do NOT auto-run — wait for user to pick a game and click Check
  }
}));

/* ----------------------------------------------------------------
   TARGET FPS ADVISOR — evaluation
   ---------------------------------------------------------------- */
function runTargetFpsCheck(){
  const a = state.analysis;
  if(!a) return;
  const gameName = $('#targetGame') ? $('#targetGame').value : null;
  const targetFps = parseInt(($('#targetFpsAdvisor') && $('#targetFpsAdvisor').value) || '60', 10);
  const result = $('#targetResult');
  if(!result) return;

  // Handle "no game selected" gracefully
  if(!gameName){
    result.innerHTML = `<p class="text-muted" style="padding:.5rem 0;"><i class="fas fa-arrow-up" style="opacity:.5;"></i> Pick a game above to check your FPS target.</p>`;
    return;
  }

  const game = a.gameResults.find(g => g.name === gameName);
  if(!game){
    result.innerHTML = `<p class="text-muted">Game not found.</p>`;
    return;
  }

  const fps = game.fps;
  const pct = Math.round((fps / targetFps) * 100);
  const diff = fps - targetFps;

  // Determine hit/miss and the recommendation
  let status, badgeClass, icon, message, actionHtml = '';

  if(fps >= targetFps){
    status = 'Hit';
    badgeClass = 'pill-green';
    icon = 'fa-circle-check';
    message = `Your PC can hit <strong>${targetFps} FPS</strong> in <strong>${game.name}</strong> at ${game.preset}. You're currently at ~${fps} FPS (${pct}% of target).`;
    if(fps >= targetFps * 1.5){
      message += ` You have <strong>${Math.round((fps/targetFps - 1)*100)}% headroom</strong> — you could push higher settings or resolution.`;
    }
  } else {
    status = 'Miss';
    badgeClass = 'pill-gray';
    icon = 'fa-circle-xmark';
    message = `Your PC is at <strong>${fps} FPS</strong> in <strong>${game.name}</strong> — that's <strong>${Math.abs(diff)} FPS short</strong> of your ${targetFps} target (${pct}% of the way).`;

    // Recommend upgrades
    const recs = [];
    const needsGpu = game.gw >= 0.50;
    const needsCpu = game.cw >= 0.40;

    if(needsGpu){
      const gpuTier = a.gpu.tier;
      const gpuMap = {
        'entry': 'RX 7600 or RTX 4060',
        'mainstream': 'RTX 4070 or RX 7800 XT',
        'performance': 'RTX 4070 Super or RX 7900 GRE',
        'enthusiast': 'RTX 4080 Super or RX 7900 XTX',
        'flagship': 'RTX 5090 (already top-tier)'
      };
      recs.push(`<li><strong>GPU:</strong> Upgrade to <strong>${gpuMap[gpuTier] || 'a newer GPU'}</strong> — this game is GPU-heavy.</li>`);
    }
    if(needsCpu){
      recs.push(`<li><strong>CPU:</strong> Consider a <strong>Ryzen 7 7800X3D</strong> (or comparable) — this game leans on the CPU.</li>`);
    }
    recs.push(`<li><strong>Settings:</strong> Drop to <strong>Medium</strong> or <strong>Low</strong> preset — often gets you 30–60% back.</li>`);
    recs.push(`<li><strong>Upscaling:</strong> Enable <strong>DLSS / FSR Performance</strong> for another boost.</li>`);

    actionHtml = `
      <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1rem;margin-top:.5rem;">
        <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:.5rem;">What to do</div>
        <ul style="list-style:none;line-height:1.9;font-size:.85rem;">
          ${recs.join('')}
        </ul>
      </div>
    `;
  }

  result.innerHTML = `
    <div class="bn-item" style="border-color:color-mix(in srgb,${fps>=targetFps?'var(--success)':'var(--warn)'} 40%,transparent);">
      <div class="bn-icon" style="background:color-mix(in srgb,${fps>=targetFps?'var(--success)':'var(--warn)'} 15%,transparent);color:${fps>=targetFps?'var(--success)':'var(--warn)'};">
        <i class="fas ${icon}"></i>
      </div>
      <div class="bn-body">
        <div class="bn-head"><strong>${status === 'Hit' ? 'Can hit target' : 'Short of target'}</strong><span>${fps} / ${targetFps} FPS</span></div>
        <div class="bn-desc">${message}</div>
      </div>
    </div>
    ${actionHtml}
  `;
}

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

/* ================================================================
   BUILD A PC — SVG ICON SET (Paste 5b-1)
   Pure functions that return SVG markup strings. Each icon is
   designed on a 100×100 viewBox so they scale cleanly.
   ================================================================ */

/* ---------- shared helpers ---------- */
function svgWrap(inner, vb){
  const viewBox = vb || '0 0 100 100';
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}
function iconGrad(id, c1, c2){
  return `<defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>`;
}

/* ----------------------------------------------------------------
   CPU — square chip with pins on all four sides + inner die
   ---------------------------------------------------------------- */
function iconCpu(color1, color2){
  const c1 = color1 || 'var(--primary)';
  const c2 = color2 || 'var(--accent)';
  const gid = 'bapc-cpu-' + Math.random().toString(36).slice(2,7);
  const pins = [];
  // top & bottom pins
  for(let i = 0; i < 6; i++){
    const x = 28 + i * 8;
    pins.push(`<rect x="${x}" y="14" width="4" height="8" rx="1" fill="${c2}" opacity="0.85"/>`);
    pins.push(`<rect x="${x}" y="78" width="4" height="8" rx="1" fill="${c2}" opacity="0.85"/>`);
  }
  // left & right pins
  for(let i = 0; i < 6; i++){
    const y = 28 + i * 8;
    pins.push(`<rect x="14" y="${y}" width="8" height="4" rx="1" fill="${c2}" opacity="0.85"/>`);
    pins.push(`<rect x="78" y="${y}" width="8" height="4" rx="1" fill="${c2}" opacity="0.85"/>`);
  }
  return svgWrap(`
    ${iconGrad(gid, c1, c2)}
    ${pins.join('')}
    <rect x="22" y="22" width="56" height="56" rx="6" fill="url(#${gid})"/>
    <rect x="28" y="28" width="44" height="44" rx="4" fill="rgba(0,0,0,0.28)"/>
    <rect x="36" y="36" width="28" height="28" rx="3" fill="rgba(255,255,255,0.15)"/>
    <text x="50" y="55" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800"
          font-size="14" fill="rgba(255,255,255,0.9)">CPU</text>
  `);
}

/* ----------------------------------------------------------------
   GPU — long card with two fans + IO bracket
   ---------------------------------------------------------------- */
function iconGpu(color1, color2){
  const c1 = color1 || 'var(--success)';
  const c2 = color2 || 'var(--primary)';
  const gid = 'bapc-gpu-' + Math.random().toString(36).slice(2,7);
  const fan = (cx) => `
    <circle cx="${cx}" cy="52" r="14" fill="rgba(0,0,0,0.35)"/>
    <circle cx="${cx}" cy="52" r="12" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.2"/>
    <g transform="translate(${cx},52)">
      <path d="M 0 -9 Q 7 -4 6 3 Q -1 6 -4 0 Q -4 -7 0 -9 Z" fill="rgba(255,255,255,0.65)"/>
      <path d="M 0 -9 Q 7 -4 6 3 Q -1 6 -4 0 Q -4 -7 0 -9 Z" fill="rgba(255,255,255,0.4)"
            transform="rotate(120)"/>
      <path d="M 0 -9 Q 7 -4 6 3 Q -1 6 -4 0 Q -4 -7 0 -9 Z" fill="rgba(255,255,255,0.4)"
            transform="rotate(240)"/>
    </g>
    <circle cx="${cx}" cy="52" r="3" fill="rgba(255,255,255,0.9)"/>
  `;
  return svgWrap(`
    ${iconGrad(gid, c1, c2)}
    <rect x="10" y="26" width="80" height="48" rx="5" fill="url(#${gid})"/>
    <rect x="10" y="26" width="80" height="48" rx="5" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
    <rect x="6"  y="30" width="6"  height="40" rx="1.5" fill="rgba(0,0,0,0.35)"/>
    <rect x="6"  y="34" width="4"  height="3" fill="rgba(255,255,255,0.4)"/>
    <rect x="6"  y="40" width="4"  height="3" fill="rgba(255,255,255,0.4)"/>
    <rect x="6"  y="46" width="4"  height="3" fill="rgba(255,255,255,0.4)"/>
    ${fan(36)}
    ${fan(64)}
    <text x="50" y="88" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800"
          font-size="10" fill="rgba(255,255,255,0.55)" letter-spacing="2">GPU</text>
  `);
}

/* ----------------------------------------------------------------
   RAM — vertical stick with heatspreader + gold contacts
   ---------------------------------------------------------------- */
function iconRam(color1, color2){
  const c1 = color1 || 'var(--warn)';
  const c2 = color2 || 'var(--danger)';
  const gid = 'bapc-ram-' + Math.random().toString(36).slice(2,7);
  const contacts = [];
  for(let i = 0; i < 10; i++){
    contacts.push(`<rect x="${26 + i*4.8}" y="80" width="2.4" height="6" fill="#fbbf24" opacity="0.9"/>`);
  }
  return svgWrap(`
    ${iconGrad(gid, c1, c2)}
    <rect x="22" y="14" width="56" height="66" rx="4" fill="url(#${gid})"/>
    <rect x="22" y="14" width="56" height="66" rx="4" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
    <path d="M 22 22 L 78 22 L 78 30 L 30 30 L 30 70 L 78 70 L 78 78 L 22 78 Z"
          fill="rgba(0,0,0,0.22)"/>
    <rect x="28" y="20" width="44" height="8" rx="2" fill="rgba(255,255,255,0.18)"/>
    <rect x="28" y="58" width="44" height="8" rx="2" fill="rgba(255,255,255,0.18)"/>
    <rect x="34" y="36" width="32" height="18" rx="2" fill="rgba(0,0,0,0.32)"/>
    <text x="50" y="49" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800"
          font-size="9" fill="rgba(255,255,255,0.9)" letter-spacing="1">RAM</text>
    ${contacts.join('')}
  `);
}

/* ----------------------------------------------------------------
   COOLER — tower heatsink with fan + heatpipes
   ---------------------------------------------------------------- */
function iconCooler(color1, color2){
  const c1 = color1 || 'var(--info)';
  const c2 = color2 || 'var(--primary)';
  const gid = 'bapc-cooler-' + Math.random().toString(36).slice(2,7);
  const fins = [];
  for(let i = 0; i < 9; i++){
    const y = 20 + i * 5.2;
    fins.push(`<rect x="30" y="${y}" width="40" height="2.4" rx="0.8" fill="rgba(255,255,255,0.35)"/>`);
  }
  return svgWrap(`
    ${iconGrad(gid, c1, c2)}
    <rect x="28" y="14" width="44" height="60" rx="4" fill="url(#${gid})"/>
    <rect x="28" y="14" width="44" height="60" rx="4" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
    ${fins.join('')}
    <circle cx="50" cy="76" r="12" fill="rgba(0,0,0,0.35)"/>
    <circle cx="50" cy="76" r="10" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>
    <g transform="translate(50,76)">
      <path d="M 0 -7 Q 5 -3 4.5 2 Q -1 4 -3 0 Q -3 -5 0 -7 Z" fill="rgba(255,255,255,0.7)"/>
      <path d="M 0 -7 Q 5 -3 4.5 2 Q -1 4 -3 0 Q -3 -5 0 -7 Z" fill="rgba(255,255,255,0.45)" transform="rotate(120)"/>
      <path d="M 0 -7 Q 5 -3 4.5 2 Q -1 4 -3 0 Q -3 -5 0 -7 Z" fill="rgba(255,255,255,0.45)" transform="rotate(240)"/>
      <circle r="2" fill="rgba(255,255,255,0.9)"/>
    </g>
    <text x="50" y="94" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800"
          font-size="8" fill="rgba(255,255,255,0.5)" letter-spacing="1.5">COOL</text>
  `);
}

/* ----------------------------------------------------------------
   PSU — box with fan grille + cables exiting right side
   ---------------------------------------------------------------- */
function iconPsu(color1, color2){
  const c1 = color1 || 'var(--text-2)';
  const c2 = color2 || 'var(--primary)';
  const gid = 'bapc-psu-' + Math.random().toString(36).slice(2,7);
  const grille = [];
  for(let r = 3; r <= 10; r += 3.5){
    grille.push(`<circle cx="42" cy="52" r="${r}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="1"/>`);
  }
  return svgWrap(`
    ${iconGrad(gid, c1, c2)}
    <rect x="14" y="28" width="66" height="48" rx="5" fill="url(#${gid})"/>
    <rect x="14" y="28" width="66" height="48" rx="5" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
    <circle cx="42" cy="52" r="16" fill="rgba(0,0,0,0.35)"/>
    ${grille.join('')}
    <circle cx="42" cy="52" r="3" fill="rgba(255,255,255,0.6)"/>
    <rect x="62" y="36" width="14" height="4" rx="1" fill="rgba(0,0,0,0.35)"/>
    <rect x="62" y="44" width="14" height="4" rx="1" fill="rgba(0,0,0,0.35)"/>
    <rect x="62" y="52" width="14" height="4" rx="1" fill="rgba(0,0,0,0.35)"/>
    <rect x="62" y="60" width="14" height="4" rx="1" fill="rgba(0,0,0,0.35)"/>
    <path d="M 80 40 Q 92 40 92 50 Q 92 60 80 60" fill="none" stroke="${c2}" stroke-width="2" opacity="0.8"/>
    <text x="34" y="86" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800"
          font-size="9" fill="rgba(255,255,255,0.55)" letter-spacing="1.5">PSU</text>
  `);
}

/* ----------------------------------------------------------------
   STORAGE — 2.5" / M.2 hybrid drive with activity LED
   ---------------------------------------------------------------- */
function iconStorage(color1, color2){
  const c1 = color1 || 'var(--accent)';
  const c2 = color2 || 'var(--info)';
  const gid = 'bapc-stg-' + Math.random().toString(36).slice(2,7);
  return svgWrap(`
    ${iconGrad(gid, c1, c2)}
    <rect x="18" y="30" width="64" height="44" rx="4" fill="url(#${gid})"/>
    <rect x="18" y="30" width="64" height="44" rx="4" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1"/>
    <rect x="24" y="36" width="52" height="6" rx="1.5" fill="rgba(0,0,0,0.28)"/>
    <rect x="24" y="46" width="34" height="4" rx="1" fill="rgba(0,0,0,0.22)"/>
    <rect x="24" y="53" width="22" height="4" rx="1" fill="rgba(0,0,0,0.22)"/>
    <circle cx="72" cy="56" r="3" fill="#22c55e"/>
    <circle cx="72" cy="56" r="5" fill="#22c55e" opacity="0.35"/>
    <rect x="22" y="74" width="56" height="3" rx="1" fill="rgba(0,0,0,0.35)"/>
    <text x="50" y="28" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800"
          font-size="8" fill="rgba(255,255,255,0.55)" letter-spacing="1.5">SSD</text>
  `);
}

/* ----------------------------------------------------------------
   CASE — ATX tower with tempered-glass side, front intake fans
   ---------------------------------------------------------------- */
function iconCase(color1, color2){
  const c1 = color1 || 'var(--surface-3)';
  const c2 = color2 || 'var(--primary)';
  const gid = 'bapc-case-' + Math.random().toString(36).slice(2,7);
  const frontFan = (cy) => `
    <circle cx="30" cy="${cy}" r="6" fill="rgba(0,0,0,0.4)"/>
    <circle cx="30" cy="${cy}" r="5" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
    <g transform="translate(30,${cy})">
      <path d="M 0 -4 Q 3 -1.5 2.5 1.5 Q -1 2 -2 0 Q -2 -3 0 -4 Z" fill="rgba(255,255,255,0.55)"/>
      <path d="M 0 -4 Q 3 -1.5 2.5 1.5 Q -1 2 -2 0 Q -2 -3 0 -4 Z" fill="rgba(255,255,255,0.35)" transform="rotate(120)"/>
      <path d="M 0 -4 Q 3 -1.5 2.5 1.5 Q -1 2 -2 0 Q -2 -3 0 -4 Z" fill="rgba(255,255,255,0.35)" transform="rotate(240)"/>
    </g>`;
  return svgWrap(`
    ${iconGrad(gid, c1, c2)}
    <rect x="16" y="12" width="68" height="80" rx="6" fill="url(#${gid})"/>
    <rect x="16" y="12" width="68" height="80" rx="6" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="1.2"/>
    <rect x="24" y="20" width="40" height="60" rx="4" fill="rgba(0,0,0,0.35)"/>
    <rect x="24" y="20" width="40" height="60" rx="4" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <rect x="68" y="20" width="10" height="60" rx="3" fill="rgba(0,0,0,0.2)"/>
    ${frontFan(32)}
    ${frontFan(50)}
    ${frontFan(68)}
    <circle cx="40" cy="30" r="2" fill="#22c55e"/>
    <rect x="36" y="26" width="6" height="2" rx="0.5" fill="rgba(255,255,255,0.35)"/>
    <rect x="24" y="84" width="52" height="3" rx="1" fill="rgba(0,0,0,0.4)"/>
    <text x="50" y="9" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800"
          font-size="7" fill="rgba(255,255,255,0.5)" letter-spacing="1.5">CASE</text>
  `);
}

/* ----------------------------------------------------------------
   MOTHERBOARD — square board with CPU socket, RAM slots, PCIe slot,
   chipset heatsink, rear I/O shroud, and 24-pin connector
   ---------------------------------------------------------------- */
function iconMobo(color1, color2){
  const c1 = color1 || 'var(--info)';
  const c2 = color2 || 'var(--primary)';
  const gid = 'bapc-mobo-' + Math.random().toString(36).slice(2,7);
  return svgWrap(`
    ${iconGrad(gid, c1, c2)}
    <rect x="14" y="14" width="72" height="72" rx="4" fill="url(#${gid})"/>
    <rect x="14" y="14" width="72" height="72" rx="4" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>

    <!-- CPU socket -->
    <rect x="30" y="30" width="26" height="26" rx="2" fill="rgba(0,0,0,0.32)"/>
    <rect x="33" y="33" width="20" height="20" rx="1.5" fill="rgba(255,255,255,0.10)"/>
    <rect x="38" y="38" width="10" height="10" rx="1" fill="rgba(255,255,255,0.22)"/>

    <!-- RAM slots (right of socket) -->
    <rect x="62" y="28" width="4" height="44" rx="1" fill="rgba(0,0,0,0.32)"/>
    <rect x="68" y="28" width="4" height="44" rx="1" fill="rgba(0,0,0,0.32)"/>
    <rect x="74" y="28" width="4" height="44" rx="1" fill="rgba(0,0,0,0.32)"/>

    <!-- PCIe x16 slot (below socket) -->
    <rect x="26" y="62" width="46" height="4" rx="1" fill="rgba(0,0,0,0.38)"/>
    <rect x="26" y="68" width="46" height="2.5" rx="1" fill="rgba(0,0,0,0.25)"/>

    <!-- Chipset heatsink (bottom-right) -->
    <rect x="62" y="62" width="18" height="16" rx="2" fill="rgba(255,255,255,0.18)"/>
    <rect x="64" y="64" width="14" height="12" rx="1" fill="rgba(0,0,0,0.25)"/>

    <!-- 24-pin connector (right edge) -->
    <rect x="80" y="34" width="4" height="20" rx="1" fill="rgba(0,0,0,0.35)"/>

    <!-- Rear I/O shroud (top-left) -->
    <rect x="14" y="14" width="30" height="10" rx="2" fill="rgba(0,0,0,0.4)"/>
    <rect x="18" y="17" width="4" height="4" fill="rgba(255,255,255,0.35)"/>
    <rect x="24" y="17" width="4" height="4" fill="rgba(255,255,255,0.35)"/>
    <rect x="30" y="17" width="4" height="4" fill="rgba(255,255,255,0.35)"/>

    <text x="50" y="92" text-anchor="middle" font-family="Inter,sans-serif" font-weight="800"
          font-size="8" fill="rgba(255,255,255,0.55)" letter-spacing="1.5">MOBO</text>
  `);
}

/* ----------------------------------------------------------------
   Generic dispatcher — call this when you need "the icon for X"
   ---------------------------------------------------------------- */
function bapcIcon(type){
  switch(type){
    case 'cpu':     return iconCpu();
    case 'gpu':     return iconGpu();
    case 'ram':     return iconRam();
    case 'cooler':  return iconCooler();
    case 'psu':     return iconPsu();
    case 'storage': return iconStorage();
    case 'case':    return iconCase();
    case 'mobo':    return iconMobo();
    default:        return svgWrap(`<circle cx="50" cy="50" r="30" fill="var(--surface-3)"/>`);
  }
}

/* ================================================================
   BUILD A PC  —  Paste 5a-2
   Dropdown population + cost table + compatibility checks
   ================================================================ */

/* ---------- Build-A-PC state (kept separate from My PC) ---------- */
const bapc = {
  case:    CASES[0],
  cpu:     null,
  gpu:     null,
  ram:     null,
  cooler:  COOLERS[0],
  psu:     PSUS[0],
  storage: STORAGE_EXTENDED[0],
  storageQty: 1,
  prices:  {},           // component key -> editable price
  lastCompat: null,
  rotation: -12         // for later (5b-2)
};

/* ---------- Helpers ---------- */
function findCpu(name){ return allCpus().find(c=>c.name===name) || null; }
function findGpu(name){ return allGpus().find(g=>g.name===name) || null; }
function findRamByLabel(label){
  const m = String(label).match(/^(\d+)GB\s+(DDR\d)/);
  if(!m) return null;
  const cap = parseInt(m[1],10), type = m[2];
  return RAM_EXTENDED.find(r=>r.capacity===cap && r.type===type) || null;
}
function ramLabel(r){ return `${r.capacity}GB ${r.type}`; }

/* ---------- Populate each <select> ---------- */
function populateBapcSelects(){
  const $case  = $('#bapcCase');
  const $cpu   = $('#bapcCpu');
  const $gpu   = $('#bapcGpu');
  const $ram   = $('#bapcRam');
  const $cool  = $('#bapcCooler');
  const $psu   = $('#bapcPsu');
  const $stg   = $('#bapcStorage');

  if($case && !$case.innerHTML){
    $case.innerHTML = CASES.map((c,i)=>
      `<option value="${i}">${c.brand} ${c.name} · ${c.form} · max GPU ${c.maxGpu}mm</option>`
    ).join('');
  }

  if($cpu && !$cpu.innerHTML){
    // Group by brand
    let html = '';
    ['AMD','Intel'].forEach(brand=>{
      html += `<optgroup label="${brand}">`;
      CPUS[brand].forEach(c=>{
        html += `<option value="${c.name}">${c.name} · ${c.cores} · ${c.socket}</option>`;
      });
      html += `</optgroup>`;
    });
    $cpu.innerHTML = html;
  }

  if($gpu && !$gpu.innerHTML){
    let html = '';
    ['NVIDIA','AMD','Intel'].forEach(brand=>{
      html += `<optgroup label="${brand}">`;
      GPUS[brand].forEach(g=>{
        html += `<option value="${g.name}">${g.name} · ${g.vram}GB · ${g.tdp}W</option>`;
      });
      html += `</optgroup>`;
    });
    $gpu.innerHTML = html;
  }

  if($ram && !$ram.innerHTML){
    // Collapse duplicate capacity+type into a single option (use fastest kit as reference)
    const seen = new Set();
    const rows = [];
    RAM_EXTENDED.forEach(r=>{
      const key = `${r.capacity}-${r.type}`;
      if(seen.has(key)) return;
      seen.add(key);
      rows.push(r);
    });
    $ram.innerHTML = rows.map(r=>{
      const label = ramLabel(r);
      return `<option value="${label}">${label} · ${r.speeds[r.speeds.length-1]}MHz · ${r.tdp}W</option>`;
    }).join('');
  }

  if($cool && !$cool.innerHTML){
    $cool.innerHTML = COOLERS.map((c,i)=>
      `<option value="${i}">${c.name} · up to ${c.maxTdp}W TDP</option>`
    ).join('');
  }

  if($psu && !$psu.innerHTML){
    $psu.innerHTML = PSUS.map((p,i)=>
      `<option value="${i}">${p.wattage}W · ${p.efficiency} · ${p.form} · ${p.modular}-mod</option>`
    ).join('');
  }

  if($stg && !$stg.innerHTML){
    $stg.innerHTML = STORAGE_EXTENDED.map((s,i)=>
      `<option value="${i}">${s.name} · ${s.speed} MB/s</option>`
    ).join('');
  }
}

/* ---------- Compatibility engine ---------- */
function runBapcCompatibility(){
  const issues = [];
  const notes  = [];
  const { case: cse, cpu, gpu, ram, cooler, psu } = bapc;

  if(!cpu || !gpu || !ram) {
    return {issues, notes, ready:false};
  }

  /* --- Case vs GPU length --- */
  if(gpu.name){
    const gpuLenMap = {
      'RTX 5090': 360, 'RTX 5080': 304, 'RTX 5070 Ti': 305, 'RTX 5070': 242,
      'RTX 4090': 336, 'RTX 4080 Super': 310, 'RTX 4080': 310,
      'RTX 4070 Ti Super': 305, 'RTX 4070 Ti': 305, 'RTX 4070 Super': 305,
      'RTX 4070': 244, 'RTX 4060 Ti': 240, 'RTX 4060': 200,
      'RTX 3090': 313, 'RTX 3080 Ti': 285, 'RTX 3080 10GB': 285,
      'RTX 3070': 242, 'RTX 3060 Ti': 242, 'RTX 3060 12GB': 242,
      'RX 7900 XTX': 287, 'RX 7900 XT': 276, 'RX 7900 GRE': 280,
      'RX 7800 XT': 267, 'RX 7700 XT': 267, 'RX 7600': 204,
      'RX 6950 XT': 267, 'RX 6900 XT': 267, 'RX 6800 XT': 267,
      'RX 6800': 267, 'RX 6750 XT': 267, 'RX 6700 XT': 267,
      'RX 9070 XT': 320, 'RX 9070': 300,
      'Arc B770': 280, 'Arc B580': 272, 'Arc A770 16GB': 280,
      'Arc A750': 280, 'Arc A580': 272, 'Arc A380': 222
    };
    const gpuLen = gpuLenMap[gpu.name] || 260;
    if(gpuLen > cse.maxGpu){
      issues.push({icon:'triangle-exclamation', level:'danger',
        text:`GPU (${gpuLen}mm) is longer than case limit (${cse.maxGpu}mm). It will NOT fit.`});
    } else if(gpuLen > cse.maxGpu - 20){
      notes.push({icon:'circle-info', level:'warn',
        text:`GPU (${gpuLen}mm) is tight against case limit (${cse.maxGpu}mm). Cable routing may be tricky.`});
    } else {
      notes.push({icon:'circle-check', level:'ok',
        text:`GPU length OK (${gpuLen}mm ≤ ${cse.maxGpu}mm).`});
    }
  }

  /* --- Cooler height vs case --- */
  if(cooler){
    if(cooler.height > cse.maxCooler){
      issues.push({icon:'triangle-exclamation', level:'danger',
        text:`Cooler (${cooler.height}mm tall) exceeds case limit (${cse.maxCooler}mm). Won't fit.`});
    } else {
      notes.push({icon:'circle-check', level:'ok',
        text:`Cooler fits (${cooler.height}mm ≤ ${cse.maxCooler}mm).`});
    }
    if(cooler.maxTdp < cpu.tdp){
      notes.push({icon:'temperature-high', level:'warn',
        text:`Cooler rated for ${cooler.maxTdp}W, CPU TDP is ${cpu.tdp}W. Thermals will throttle.`});
    }
  }

  /* --- CPU socket vs RAM type sanity --- */
  const cpuGen = cpu.gen || '';
  const wantsDDR5 = cpuGen.includes('Zen 5') || cpuGen.includes('Zen 4') ||
                    cpuGen.includes('Arrow') || cpuGen.includes('Raptor') ||
                    cpuGen.includes('Alder');
  const ramIsDDR5 = ram.type === 'DDR5';
  if(wantsDDR5 && !ramIsDDR5){
    issues.push({icon:'microchip', level:'danger',
      text:`${cpu.name} (${cpu.socket}) needs DDR5 — you selected ${ramLabel(ram)}.`});
  } else if(!wantsDDR5 && ramIsDDR5){
    notes.push({icon:'circle-info', level:'warn',
      text:`${cpu.name} pairs with DDR4 — ${ramLabel(ram)} may not be supported on its socket.`});
  } else {
    notes.push({icon:'circle-check', level:'ok',
      text:`Memory type matches CPU platform (${cpu.socket} / ${ramLabel(ram)}).`});
  }

  /* --- PSU wattage vs estimated draw --- */
  if(psu){
    const estDraw = (cpu.tdp || 65) + (gpu.tdp || 100) + (ram.tdp || 10) +
                    (bapc.storage.tdp || 5) * bapc.storageQty + 75;
    const headroom = psu.wattage - estDraw;
    bapc.lastCompat = {...(bapc.lastCompat||{}), estDraw, headroom};
    if(headroom < 0){
      issues.push({icon:'plug', level:'danger',
        text:`PSU ${psu.wattage}W is BELOW estimated draw (${estDraw}W). System will shut down under load.`});
    } else if(headroom < 100){
      notes.push({icon:'plug', level:'warn',
        text:`PSU headroom only ${headroom}W. Recommend 100W+ for stability.`});
    } else {
      notes.push({icon:'circle-check', level:'ok',
        text:`PSU headroom ${headroom}W (est. draw ${estDraw}W).`});
    }

    /* --- SFX PSU in ATX case is fine; ATX PSU in ITX case is not --- */
    if(cse.form === 'ITX' && psu.form === 'ATX' && cse.maxPsu < 180){
      issues.push({icon:'plug', level:'danger',
        text:`ATX PSU doesn't fit in this ITX case (max ${cse.maxPsu}mm). Use an SFX unit.`});
    }
  }

  /* --- Storage vs case bays --- */
  const storageNeeded = bapc.storageQty;
  if(storageNeeded > (cse.bays2_5 + cse.bays3_5)){
    issues.push({icon:'hard-drive', level:'danger',
      text:`${storageNeeded} drives selected but case has only ${cse.bays2_5 + cse.bays3_5} bays.`});
  } else {
    notes.push({icon:'circle-check', level:'ok',
      text:`${storageNeeded} drive${storageNeeded>1?'s':''} fits in ${cse.bays2_5 + cse.bays3_5} bays.`});
  }

  return {issues, notes, ready:true};
}

/* ---------- Cost table ---------- */
function getPrice(key, fallback){
  return (bapc.prices && bapc.prices[key] != null) ? bapc.prices[key] : fallback;
}

function renderBapcCostTable(){
  const tbody = $('#bapcCostTable');
  if(!tbody) return;
  if(!bapc.cpu || !bapc.gpu || !bapc.ram){
    tbody.innerHTML = `<div class="empty" style="padding:1.25rem;"><i class="fas fa-receipt"></i><p>Pick CPU, GPU and RAM to see the full cost breakdown.</p></div>`;
    return;
  }
  const rows = [
    {key:'case',    label:'Case',            price:bapc.case.price},
    {key:'cpu',     label:'CPU',             price:CPU_PRICES[bapc.cpu.name] || 200},
    {key:'gpu',     label:'GPU',             price:GPU_PRICES[bapc.gpu.name] || 300},
    {key:'ram',     label:'RAM',             price:bapc.ram.price || 60},
    {key:'cooler',  label:'Cooler',          price:bapc.cooler.price},
    {key:'psu',     label:'PSU',             price:bapc.psu.price},
    {key:'storage', label:`Storage ×${bapc.storageQty}`, price:bapc.storage.price * bapc.storageQty},
    {key:'mobo',    label:'Motherboard',     price:150},
  ];
  tbody.innerHTML = `
    <table class="bapc-cost-table">
      <thead><tr><th>Part</th><th style="text-align:right;">Price (USD)</th></tr></thead>
      <tbody>
        ${rows.map(r=>`
          <tr>
            <td>${r.label}</td>
            <td style="text-align:right;">
              <input type="number" min="0" step="5" data-key="${r.key}" value="${r.price}">
            </td>
          </tr>`).join('')}
        <tr class="total-row">
          <td>Total</td>
          <td id="bapcTotalCell">$0</td>
        </tr>
      </tbody>
    </table>
  `;
  $$('#bapcCostTable input[data-key]').forEach(inp=>{
    inp.addEventListener('input', e=>{
      bapc.prices[e.target.dataset.key] = Math.max(0, +e.target.value || 0);
      updateBapcTotals();
    });
  });
  updateBapcTotals();
}

function updateBapcTotals(){
  if(!bapc.cpu || !bapc.gpu || !bapc.ram) return;
  const rows = [
    {key:'case',    price:bapc.case.price},
    {key:'cpu',     price:CPU_PRICES[bapc.cpu.name] || 200},
    {key:'gpu',     price:GPU_PRICES[bapc.gpu.name] || 300},
    {key:'ram',     price:bapc.ram.price || 60},
    {key:'cooler',  price:bapc.cooler.price},
    {key:'psu',     price:bapc.psu.price},
    {key:'storage', price:bapc.storage.price * bapc.storageQty},
    {key:'mobo',    price:150},
  ];
  let subtotal = 0;
  rows.forEach(r=>{
    const v = (bapc.prices && bapc.prices[r.key] != null) ? bapc.prices[r.key] : r.price;
    subtotal += v;
  });

  const $sub = $('#bapcSubtotal');
  if($sub) $sub.textContent = '$' + subtotal.toLocaleString();

  const $tot = $('#bapcTotalCell');
  if($tot) $tot.textContent = '$' + subtotal.toLocaleString();

  /* Performance score = weighted CPU + GPU score */
  const cpuScore = clamp(Math.round(bapc.cpu.mult * 42), 5, 100);
  const gpuScore = clamp(Math.round(bapc.gpu.mult * 30), 5, 100);
  const ramScore = clamp(Math.round(bapc.ram.mult * 78), 5, 100);
  const total = Math.round(cpuScore*0.35 + gpuScore*0.5 + ramScore*0.15);
  const $score = $('#bapcScore');
  if($score) $score.textContent = total + '/100';

  /* FPS per dollar — rough average across GAMES at 1080p High */
  let fpsSum = 0;
  GAMES.forEach(g=>{
    fpsSum += g.base * Math.pow(bapc.cpu.mult, g.cw) * Math.pow(bapc.gpu.mult, g.gw) * Math.pow(bapc.ram.mult, g.rw);
  });
  const avgFps = fpsSum / GAMES.length;
  const fpsPerDollar = subtotal > 0 ? (avgFps / subtotal).toFixed(3) : '—';
  const $fpsd = $('#bapcFpsPerDollar');
  if($fpsd) $fpsd.textContent = fpsPerDollar === '—' ? '—' : fpsPerDollar + ' FPS/$';
}

/* ---------- Warnings panel ---------- */
function renderBapcWarnings(){
  const wrap = $('#bapcWarnings');
  const summary = $('#bapcWarningsSummary');
  const compatCount = $('#bapcCompatCount');
  if(!wrap) return;

  if(!bapc.cpu || !bapc.gpu || !bapc.ram){
    wrap.innerHTML = `<div class="empty"><i class="fas fa-circle-check" style="color:var(--success);"></i><p>Pick a case, CPU, GPU and RAM to run the compatibility check.</p></div>`;
    if(summary) summary.textContent = '—';
    if(compatCount) compatCount.textContent = '—';
    return;
  }

  const {issues, notes} = runBapcCompatibility();

  if(summary) summary.textContent = issues.length === 0
    ? `${notes.length} checks passed`
    : `${issues.length} issue${issues.length>1?'s':''} found`;

  if(compatCount) compatCount.textContent = `${notes.length} checks`;

  const html = [
    ...issues.map(i=>`
      <div class="compat-warn bn-item" style="border-color:color-mix(in srgb,var(--danger) 40%,transparent);">
        <div class="bn-icon" style="background:color-mix(in srgb,var(--danger) 15%,transparent);color:var(--danger);">
          <i class="fas fa-${i.icon}"></i>
        </div>
        <div class="bn-body">
          <div class="bn-head"><strong style="color:var(--danger);">Incompatible</strong></div>
          <div class="bn-desc">${i.text}</div>
        </div>
      </div>`),
    ...notes.map(n=>`
      <div class="compat-warn bn-item" style="border-color:color-mix(in srgb,${n.level==='ok'?'var(--success)':'var(--warn)'} 35%,transparent);">
        <div class="bn-icon" style="background:color-mix(in srgb,${n.level==='ok'?'var(--success)':'var(--warn)'} 15%,transparent);color:${n.level==='ok'?'var(--success)':'var(--warn)'};">
          <i class="fas fa-${n.icon}"></i>
        </div>
        <div class="bn-body">
          <div class="bn-head"><strong>${n.level==='ok'?'Passed':'Notice'}</strong></div>
          <div class="bn-desc">${n.text}</div>
        </div>
      </div>`)
  ].join('');

  wrap.innerHTML = html || `<div class="empty"><i class="fas fa-circle-check" style="color:var(--success);"></i><p>No issues detected.</p></div>`;
}

/* ---------- Case label ---------- */
function updateBapcCaseLabel(){
  const el = $('#bapcCaseLabel');
  if(el && bapc.case) el.textContent = `${bapc.case.brand} ${bapc.case.name} · ${bapc.case.form}`;
}

/* ---------- Main render ---------- */
function renderBuildAPC(){
  populateBapcSelects();
  updateBapcCaseLabel();
  renderBapcCostTable();
  renderBapcWarnings();

  // Default selections if empty
  if($('#bapcCase') && !$('#bapcCase').value) $('#bapcCase').value = '0';
  bapc.case = CASES[+($('#bapcCase')?.value || 0)] || CASES[0];

  if($('#bapcCpu') && !$('#bapcCpu').value){
    const defCpu = allCpus().find(c=>c.name==='Ryzen 5 7600X') || allCpus()[0];
    $('#bapcCpu').value = defCpu.name;
  }
  bapc.cpu = findCpu($('#bapcCpu')?.value) || null;

  if($('#bapcGpu') && !$('#bapcGpu').value){
    const defGpu = allGpus().find(g=>g.name==='RTX 4070') || allGpus()[0];
    $('#bapcGpu').value = defGpu.name;
  }
  bapc.gpu = findGpu($('#bapcGpu')?.value) || null;

  if($('#bapcRam') && !$('#bapcRam').value){
    const defRam = RAM_EXTENDED.find(r=>r.capacity===16 && r.type==='DDR5') || RAM_EXTENDED[0];
    $('#bapcRam').value = ramLabel(defRam);
  }
  bapc.ram = findRamByLabel($('#bapcRam')?.value) || null;

  if($('#bapcCooler') && !$('#bapcCooler').value) $('#bapcCooler').value = '13';
  bapc.cooler = COOLERS[+($('#bapcCooler')?.value || 0)] || COOLERS[0];

  if($('#bapcPsu') && !$('#bapcPsu').value) $('#bapcPsu').value = '12';
  bapc.psu = PSUS[+($('#bapcPsu')?.value || 0)] || PSUS[0];

  if($('#bapcStorage') && !$('#bapcStorage').value) $('#bapcStorage').value = '9';
  bapc.storage = STORAGE_EXTENDED[+($('#bapcStorage')?.value || 0)] || STORAGE_EXTENDED[0];

  if($('#bapcStorageQty') && !$('#bapcStorageQty').value) $('#bapcStorageQty').value = '1';
  bapc.storageQty = +($('#bapcStorageQty')?.value || 1);

  renderBapcWarnings();
  renderBapcCostTable();
  renderBapcScene();
}

/* ---------- Wire up <select> change handlers (once) ---------- */
(function wireBapcHandlers(){
  document.addEventListener('change', (e)=>{
    if(!e.target) return;
    const id = e.target.id;
    if(!id || !id.startsWith('bapc')) return;

    if(id === 'bapcCase'){
      bapc.case = CASES[+e.target.value] || CASES[0];
      updateBapcCaseLabel();
    } else if(id === 'bapcCpu'){
      bapc.cpu = findCpu(e.target.value);
    } else if(id === 'bapcGpu'){
      bapc.gpu = findGpu(e.target.value);
    } else if(id === 'bapcRam'){
      bapc.ram = findRamByLabel(e.target.value);
    } else if(id === 'bapcCooler'){
      bapc.cooler = COOLERS[+e.target.value] || COOLERS[0];
    } else if(id === 'bapcPsu'){
      bapc.psu = PSUS[+e.target.value] || PSUS[0];
    } else if(id === 'bapcStorage'){
      bapc.storage = STORAGE_EXTENDED[+e.target.value] || STORAGE_EXTENDED[0];
    } else if(id === 'bapcStorageQty'){
      setBapcStorageQty(+e.target.value);
    }

    renderBapcWarnings();
    renderBapcCostTable();
  });
})();

/* ---------- Analyze button ---------- */
(function wireBapcAnalyze(){
  document.addEventListener('click', (e)=>{
    if(e.target && e.target.id === 'bapcAnalyzeBtn'){
      renderBapcWarnings();
      renderBapcCostTable();
      const issues = (bapc.lastCompat && bapc.lastCompat.headroom != null && bapc.lastCompat.headroom < 0) ? 1 : 0;
      toast(
        issues ? 'Build analyzed — compatibility issues found' : 'Build analyzed — looks good!',
        issues ? 'fa-triangle-exclamation' : 'fa-circle-check'
      );
    }
    if(e.target && e.target.id === 'bapcResetBtn'){
      confirmDialog('Reset the Build-A-PC configurator?', ()=>{
        bapc.case = CASES[0];
        bapc.cpu = null; bapc.gpu = null; bapc.ram = null;
        bapc.cooler = COOLERS[0];
        bapc.psu = PSUS[0];
        bapc.storage = STORAGE_EXTENDED[0];
        bapc.storageQty = 1;
        bapc.prices = {};
        ['bapcCase','bapcCpu','bapcGpu','bapcRam','bapcCooler','bapcPsu','bapcStorage'].forEach(id=>{
          const el = document.getElementById(id);
          if(el) el.value = '';
        });
        renderBuildAPC();
        toast('Configurator reset', 'fa-rotate-left');
      });
    }
  });
})();

/* ---------- Wire up storage qty spinner in the summary (optional) ----------
   The HTML currently has no qty field. We add a tiny hook here so if a user
   later adds one it just works.                                          */
function setBapcStorageQty(n){
  bapc.storageQty = clamp(n, 1, 8);
  renderBapcCostTable();
  renderBapcWarnings();
}

/* ================================================================
   BUILD A PC — VISUAL CASE BUILDER (Paste 5b-2)
   Renders the case SVG, drops in component icons, wires up
   drag-to-rotate and compatibility glow.
   ================================================================ */

/* ---------- viewport transform state ---------- */
bapc.view = {
  rotY: -14,      // yaw in degrees
  rotX: 8,        // pitch in degrees
  dragging: false,
  startX: 0,
  startY: 0,
  startRotY: -14,
  startRotX: 8
};

/* ---------- main scene renderer ---------- */
function renderBapcScene(){
  const svg = $('#bapcSvg');
  if(!svg) return;

  const cse  = bapc.case;
  const cpu  = bapc.cpu;
  const gpu  = bapc.gpu;
  const ram  = bapc.ram;
  const cool = bapc.cooler;
  const psu  = bapc.psu;
  const stg  = bapc.storage;

  /* --- figure out glow colors per slot from compatibility --- */
  const compat = runBapcCompatibility();
  const glow = {
    gpu:     '#22c55e',
    cooler:  '#22c55e',
    psu:     '#22c55e',
    storage: '#22c55e',
    ram:     '#22c55e',
    cpu:     '#22c55e'
  };
  compat.issues.forEach(i=>{
    if(i.text.toLowerCase().includes('gpu'))     glow.gpu = '#ef4444';
    if(i.text.toLowerCase().includes('cooler'))  glow.cooler = '#ef4444';
    if(i.text.toLowerCase().includes('psu'))     glow.psu = '#ef4444';
    if(i.text.toLowerCase().includes('drive'))   glow.storage = '#ef4444';
    if(i.text.toLowerCase().includes('ddr'))     glow.ram = '#ef4444';
  });
  compat.notes.filter(n=>n.level==='warn').forEach(n=>{
    if(n.text.toLowerCase().includes('gpu')     && glow.gpu!=='#ef4444')     glow.gpu = '#f59e0b';
    if(n.text.toLowerCase().includes('cooler')  && glow.cooler!=='#ef4444')  glow.cooler = '#f59e0b';
    if(n.text.toLowerCase().includes('psu')     && glow.psu!=='#ef4444')     glow.psu = '#f59e0b';
    if(n.text.toLowerCase().includes('drive')   && glow.storage!=='#ef4444') glow.storage = '#f59e0b';
    if(n.text.toLowerCase().includes('memory')  && glow.ram!=='#ef4444')     glow.ram = '#f59e0b';
  });

  /* --- case outline scales with case size --- */
  const formScale = { ITX:0.72, mATX:0.86, ATX:1.0, 'E-ATX':1.12 }[cse.form] || 1.0;
  const caseW = 300 * formScale;
  const caseH = 400 * formScale;
  const caseX = 400 - caseW/2;
  const caseY = 250 - caseH/2;

  /* --- build the scene markup --- */
  const gridLines = (()=>{
    let g = '';
    for(let x = 40; x < 800; x += 40){
      g += `<line x1="${x}" y1="0" x2="${x}" y2="500" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>`;
    }
    for(let y = 20; y < 500; y += 40){
      g += `<line x1="0" y1="${y}" x2="800" y2="${y}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>`;
    }
    return g;
  })();

  /* icon scale — the icon functions render at 100×100, we scale to 60–90px */
  const iconSlot = (iconFn, x, y, size, glowColor, label) => {
    const half = size/2;
    const scale = size/100;
    return `
      <g transform="translate(${x - half} ${y - half}) scale(${scale})" style="filter:drop-shadow(0 0 8px ${glowColor});">
        <circle cx="50" cy="50" r="46" fill="${glowColor}" opacity="0.14"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="${glowColor}" stroke-width="1.5" opacity="0.7"/>
        ${iconFn()}
      </g>
      ${label ? `<text x="${x}" y="${y + half + 16}" text-anchor="middle"
        font-family="Inter,sans-serif" font-size="10" font-weight="700"
        fill="rgba(255,255,255,0.55)" letter-spacing="1">${label}</text>` : ''}
    `;
  };

  const scene = `
    <g id="bapc-scene-root">
      ${gridLines}
      <ellipse cx="400" cy="${caseY + caseH + 20}" rx="${caseW*0.55}" ry="14" fill="rgba(0,0,0,0.5)"/>
      <g transform="translate(${caseX} ${caseY})">
        <rect x="0" y="0" width="${caseW}" height="${caseH}" rx="14"
              fill="rgba(20,24,34,0.55)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
        <rect x="8" y="8" width="${caseW-16}" height="${caseH-16}" rx="10"
              fill="rgba(0,0,0,0.28)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <g transform="translate(${caseW-26} ${caseH/2})">
          <rect x="0" y="-40" width="18" height="80" rx="4" fill="rgba(0,0,0,0.35)"/>
          <circle cx="9" cy="-24" r="5" fill="${glow.cooler}" opacity="0.5"/>
          <circle cx="9" cy="0"   r="5" fill="${glow.cooler}" opacity="0.5"/>
          <circle cx="9" cy="24"  r="5" fill="${glow.cooler}" opacity="0.5"/>
        </g>
      </g>
      ${cpu ? iconSlot(iconCpu, 400, caseY + caseH*0.22, 86*formScale, glow.cpu, 'CPU') : ''}
      ${gpu ? iconSlot(iconGpu, 400, caseY + caseH*0.52, 120*formScale, glow.gpu, 'GPU') : ''}
      ${ram ? iconSlot(iconRam, 400 + caseW*0.34, caseY + caseH*0.22, 56*formScale, glow.ram, 'RAM') : ''}
      ${cool ? iconSlot(iconCooler, 400 - caseW*0.32, caseY + caseH*0.2, 64*formScale, glow.cooler, 'COOL') : ''}
      ${psu ? iconSlot(iconPsu, 400, caseY + caseH*0.82, 92*formScale, glow.psu, 'PSU') : ''}
      ${stg ? iconSlot(iconStorage, 400 - caseW*0.32, caseY + caseH*0.74, 60*formScale, glow.storage, 'SSD') : ''}
    </g>
  `;

  /* preserveAspectRatio xMidYMid meet; the outer wrapper already handles rotation via CSS */
  svg.setAttribute('viewBox', '0 0 800 500');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.innerHTML = scene;

  /* apply rotation transform via the parent wrapper so it stays smooth */
  svg.style.transformOrigin = '400px 250px';
  svg.style.transform = `perspective(1200px) rotateX(${bapc.view.rotX}deg) rotateY(${bapc.view.rotY}deg)`;
}

/* ---------- drag-to-rotate ---------- */
(function wireBapcRotation(){
  const viewport = $('#bapcViewport');
  if(!viewport) return;

  let pointerId = null;

  viewport.addEventListener('pointerdown', (e)=>{
    /* ignore if user is on a select / button inside the viewport */
    if(e.target.closest('button, select, input, a')) return;
    pointerId = e.pointerId;
    viewport.setPointerCapture(pointerId);
    bapc.view.dragging = true;
    bapc.view.startX = e.clientX;
    bapc.view.startY = e.clientY;
    bapc.view.startRotY = bapc.view.rotY;
    bapc.view.startRotX = bapc.view.rotX;
  });

  viewport.addEventListener('pointermove', (e)=>{
    if(!bapc.view.dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - bapc.view.startX;
    const dy = e.clientY - bapc.view.startY;
    bapc.view.rotY = clamp(bapc.view.startRotY + dx * 0.4, -60, 60);
    bapc.view.rotX = clamp(bapc.view.startRotX - dy * 0.2, -20, 30);
    const svg = $('#bapcSvg');
    if(svg){
      svg.style.transform = `perspective(1200px) rotateX(${bapc.view.rotX}deg) rotateY(${bapc.view.rotY}deg)`;
    }
  });

  viewport.addEventListener('pointerup', (e)=>{
    if(e.pointerId !== pointerId) return;
    bapc.view.dragging = false;
    pointerId = null;
  });

  viewport.addEventListener('pointercancel', ()=>{
    bapc.view.dragging = false;
    pointerId = null;
  });
})();

/* ---------- re-render scene whenever a bapc field changes ---------- */
document.addEventListener('change', (e)=>{
  if(!e.target || !e.target.id) return;
  if(!e.target.id.startsWith('bapc')) return;
  renderBapcScene();
});

/* ---------- re-render scene on window resize (keeps crisp) ---------- */
let bapcResizeT = null;
window.addEventListener('resize', ()=>{
  clearTimeout(bapcResizeT);
  bapcResizeT = setTimeout(()=>{
    if($('#page-buildapc')?.classList.contains('active')) renderBapcScene();
  }, 120);
});

/* inject mini icons into Parts labels */
(function injectBapcMiniIcons(){
  document.querySelectorAll('.bapc-mini-icon').forEach(el=>{
    const type = el.dataset.icon;
    if(!type || !window.bapcIcon) return;
    el.innerHTML = bapcIcon(type);
  });
})();

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
  if($('#moboSocket')) $('#moboSocket').value = state.build.moboSocket || '';
  populateMoboSelect();
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
