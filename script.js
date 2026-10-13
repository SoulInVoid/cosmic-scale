'use strict';
/* ---------- Constants & units ---------- */
const LY = 9.4607304725808e15, AU = 1.495978707e11, PC = 3.0856775814914e16, C = 299792458, HUMAN = 1.7;
const UNITS = [['ym',1e-24],['fm',1e-15],['pm',1e-12],['nm',1e-9],['µm',1e-6],['mm',1e-3],['cm',1e-2],['m',1],['km',1e3],['AU',AU],['ly',LY],['pc',PC]];
const CATS = [['Fundamental',270],['Atoms & molecules',200],['Microscopic life',150],['Everyday',45],['Earth scale',120],['Planets & stars',25],['Solar & interstellar',290],['Cosmic structures',330]];
const TYPES = {
  m:['Measured','Directly measured or precisely defined.'],
  a:['Approximate','A typical value; individual examples vary.'],
  t:['Theoretical','A theoretical scale, not a measured object.'],
  l:['Upper limit','Point-like: experiments only set an upper limit, not a confirmed size.'],
  f:['Fuzzy extent','No sharp edge; the size depends on how it is defined.']
};
const TERMS = {
  'point-like':'Treated as having no internal size in current theory.',
  'rms':'Root-mean-square: a standard way to average a spread of values.',
  'AU':'Astronomical unit: the mean Earth–Sun distance, 1.496×10¹¹ m.',
  'Mpc':'Megaparsec: about 3.26 million light-years.',
  'heliopause':'Where the Sun\'s wind is stopped by interstellar space.',
  'comoving':'Measured as if the expansion of space were frozen at today\'s value.'
};
const SOURCES = [
  ['NIST CODATA','https://physics.nist.gov/cuu/Constants/'],['CERN','https://home.cern/science/physics/standard-model'],
  ['Particle Data Group','https://pdg.lbl.gov/'],['NASA fact sheets','https://nssdc.gsfc.nasa.gov/planetary/factsheet/'],
  ['NASA Solar System','https://science.nasa.gov/solar-system/'],['Planck 2018 results','https://arxiv.org/abs/1807.06209']
];

/* ---------- Dataset: name, category, size in metres, type, icon, note ---------- */
const RAW = [
['Planck length',0,1.616255e-35,'t','📐','Where quantum gravity is expected to matter. It is built from fundamental constants, never measured.'],
['Quark',0,1e-18,'l','🔴','Treated as point-like. Experiments only show any size is below about 10⁻¹⁸ m.'],
['Electron',0,1e-22,'l','⚡','No known radius. The value shown is an experimental upper limit on any size, not a diameter.'],
['Proton',0,1.68e-15,'m','🟣','Diameter of about 1.68 fm, twice the rms charge radius of roughly 0.84 fm.'],
['Neutron',0,1.7e-15,'a','⚪','About the size of a proton, defined by its charge distribution.'],
['Atomic nucleus',0,1e-14,'a','🔵','Nuclei span about 2 to 15 fm depending on mass; 10 fm is a heavy-ish example.'],
['Hydrogen atom',1,1.06e-10,'f','⚛️','Twice the Bohr radius (0.529 Å). The electron cloud has no hard edge.'],
['Carbon atom',1,1.54e-10,'f','⚫','About twice the covalent radius. Atomic size depends on the definition used.'],
['Water molecule',1,2.8e-10,'a','💧','Roughly 0.28 nm across, with O–H bonds of about 0.096 nm.'],
['DNA double helix',1,2e-9,'m','🧬','About 2 nm wide. Each human cell packs roughly two metres of it.'],
['Typical protein',1,5e-9,'a','🧫','Globular proteins are usually 3 to 10 nm across.'],
['Virus',2,1e-7,'a','🦠','Most viruses are 20 to 300 nm; 100 nm is typical.'],
['Mitochondrion',2,1e-6,'a','🔋','Usually 0.5 to 10 µm long.'],
['Bacterium',2,2e-6,'a','🦠','E. coli is about 2 µm long; bacteria range from 0.2 to 10 µm or more.'],
['Human cell',2,2e-5,'a','🔬','Typical body cells are 10 to 30 µm across.'],
['Pollen grain',2,3e-5,'a','🌼','Grains range from about 10 to 100 µm.'],
['Human egg cell',2,1.2e-4,'m','🥚','About 0.12 mm: the largest human cell, just visible to the eye.'],
['Human hair',3,7e-5,'a','〰️','Width is typically 17 to 180 µm; 70 µm is common.'],
['Grain of sand',3,5e-4,'a','⏳','Sand grains are 0.0625 to 2 mm; 0.5 mm shown.'],
['Ant',3,5e-3,'a','🐜','Worker ants are roughly 2 to 25 mm long, depending on species.'],
['Coin (US quarter)',3,2.426e-2,'m','🪙','A US quarter is 24.26 mm in diameter.'],
['Tennis ball',3,6.7e-2,'m','🎾','Regulation diameter is 6.54 to 6.86 cm.'],
['Human hand',3,0.19,'a','✋','Adult hand length is about 17 to 21 cm.'],
['Human',3,1.7,'a','🧍','Average adult height is about 1.7 m. It is the reference for Human view.'],
['Car',3,4.5,'a','🚗','A typical car is 4 to 5 m long.'],
['Bus',3,12,'a','🚌','A standard city bus is about 12 m long.'],
['House',3,10,'a','🏠','A typical house is around 10 m across.'],
['Skyscraper (Burj Khalifa)',4,828,'m','🏙️','The tallest building, 828 m high.'],
['Mount Everest',4,8848.86,'m','🏔️','Height above sea level, 8,848.86 m.'],
['Grand Canyon',4,4.46e5,'m','🏜️','About 446 km long along the Colorado River.'],
['Greenland (largest island)',4,2.67e6,'a','🏝️','Roughly 2,670 km from north to south.'],
['Australia (continent)',4,4e6,'a','🌏','About 4,000 km from east to west.'],
['Earth',4,1.2742e7,'m','🌍','Mean diameter of 12,742 km, about 109 Earths would line up across the Sun.'],
['White dwarf',5,1.4e7,'a','⚪','A dead star about the size of Earth but with roughly the Sun\'s mass.'],
['Neutron star',5,2e4,'a','🌟','About 20 km across and denser than an atomic nucleus.'],
['Moon',5,3.4748e6,'m','🌕','Mean diameter of 3,474.8 km.'],
['Jupiter',5,1.42984e8,'m','🟠','Equatorial diameter of 142,984 km.'],
['Saturn with rings',5,2.8e8,'a','🪐','The main rings span roughly 280,000 km, though they are only about 10 m thick.'],
['Sun',5,1.3927e9,'m','☀️','Diameter of about 1.39 million km.'],
['Red giant star',5,1e11,'a','🔴','Typical red giants are tens of times wider than the Sun.'],
['Supergiant (Betelgeuse)',5,1.2e12,'a','⭐','Roughly 700 to 900 solar radii and it pulses, so its size varies.'],
['Earth–Sun distance',6,1.495978707e11,'m','📏','Defines 1 AU, the mean distance from Earth to the Sun.'],
['Planetary region (Neptune orbit)',6,8.98e12,'a','🪐','Neptune orbits at about 30 AU, so the region is about 60 AU wide.'],
['Kuiper Belt',6,1.5e13,'f','☄️','Icy bodies from about 30 to 50 AU. Shown as a diameter of about 100 AU.'],
['Heliopause',6,3.6e13,'f','🛡️','The edge of the Sun\'s wind, crossed by Voyager 1 near 121 AU. Not a perfect sphere.'],
['Oort Cloud (hypothetical)',6,2.99e16,'f','🌫️','Never directly observed. Its inner and outer limits are uncertain; about 100,000 AU radius is a common estimate.'],
['Alpha Centauri (distance)',6,4.13e16,'m','🔭','Not a size but a distance: the nearest star system is about 4.37 light-years away.'],
['Orion Nebula',6,2.27e17,'a','🌌','A star-forming cloud about 24 light-years across.'],
['Giant molecular cloud',6,9.46e17,'f','☁️','Typical clouds span tens to hundreds of light-years; 100 ly shown.'],
['Milky Way',7,9.46e20,'a','🌀','The stellar disc is about 100,000 light-years wide.'],
['Andromeda Galaxy',7,2.08e21,'a','🌀','About 220,000 light-years across.'],
['Local Group',7,9.26e22,'f','🕸️','Our galaxy group spans about 3 Mpc.'],
['Galaxy cluster',7,1.5e23,'a','🧿','Clusters are typically 2 to 10 Mpc wide.'],
['Cosmic filament',7,1.5e24,'f','🧵','Filaments stretch tens to hundreds of Mpc; 50 Mpc shown.'],
['Large cosmic void (Boötes)',7,3.1e24,'a','⚫','The Boötes void is about 330 million light-years across.'],
['Supercluster (Laniakea)',7,4.94e24,'f','🌐','Laniakea spans about 160 Mpc. Its boundary is a matter of definition.'],
['Observable universe',7,8.8e26,'a','🌠','About 93 billion light-years across (comoving). That is far more than twice its 13.8-billion-year age because space expanded while light travelled. This is only the observable part; the size of the whole universe is unknown.']
];
const DATA = RAW.map(([name,c,m,t,icon,note]) => ({name,c,m,t,icon,note,l:Math.log10(m)}))
  .sort((a,b) => a.m - b.m).map((d,i) => ({...d,i}));
const LMIN = DATA[0].l - 1, LMAX = DATA[DATA.length-1].l + 1;

/* ---------- State ---------- */
const $ = s => document.querySelector(s);
const S = {pos:DATA[0].l, tp:DATA[0].l, span:10, ts:10, sel:DATA[0], filter:new Set(), sci:false, human:false, learn:false, cmp:false, cmpTo:null,
  unit:'auto', rm:matchMedia('(prefers-reduced-motion: reduce)').matches};
const cv = $('#cv'), ctx = cv.getContext('2d'), panel = $('#panel');
let raf = 0, nodes = [], dpr = 1;
const vis = () => S.filter.size ? DATA.filter(d => S.filter.has(d.c)) : DATA;
const hue = d => CATS[d.c][1];
const clamp = (v,a,b) => Math.min(b,Math.max(a,v));

/* ---------- Formatting & conversion ---------- */
const sup = n => String(n).replace(/[-\d]/g, c => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]);
const sci = x => { const [a,e] = x.toExponential(3).split('e'); return `${+a}×10${sup(+e)}`; };
function pickUnit(m) {
  const ok = UNITS.filter(u => !(u[0]==='pc' && m<1e22) && !(u[0]==='ly' && m>=1e22));
  return ok.filter(u => u[1] <= m*1.0000001).pop() || ok[0];
}
function num(v) {
  if (S.sci || v < 0.01 || v >= 1e9) return sci(v);
  return (+v.toPrecision(3)).toLocaleString('en', {maximumFractionDigits: 6});
}
function size(m) {
  const u = S.unit === 'auto' ? pickUnit(m) : UNITS.find(x => x[0] === S.unit);
  return `${num(m/u[1])} ${u[0]}`;
}
const times = r => r >= 1e4 || r < 0.01 ? sci(r) : (+r.toPrecision(3)).toLocaleString('en');
function duration(s) {
  const T = [[3.15576e7,'years'],[86400,'days'],[3600,'hours'],[60,'minutes'],[1,'seconds']];
  const u = T.find(t => s >= t[0]);
  return u ? `${times(s/u[0])} ${u[1]}` : `${sci(s)} seconds`;
}
const tip = txt => Object.keys(TERMS).reduce((t,k) => t.replace(new RegExp(`\\b${k}\\b`), `<abbr title="${TERMS[k].replace(/"/g,'&quot;')}">${k}</abbr>`), txt);
const ratioText = (a,b) => a.m >= b.m ? `${times(a.m/b.m)}× larger than ${b.name}` : `${times(b.m/a.m)}× smaller than ${b.name}`;

/* ---------- Info panel ---------- */
function render() {
  const d = S.sel, L = vis(), k = L.indexOf(d), prev = L[k-1], next = L[k+1];
  const ex = [];
  if (S.human) {
    ex.push(d.m >= HUMAN ? `${times(d.m/HUMAN)}× the height of a human. Walking across it at 1.4 m/s would take ${duration(d.m/1.4)}.` : `A human is ${times(HUMAN/d.m)}× larger than this.`);
  }
  if (S.learn) ex.push(`Light would take ${duration(d.m/C)} to cross it. ${TYPES[d.t][0]}: ${TYPES[d.t][1]}`);
  panel.innerHTML = `
    <div class="orb" style="--h:${hue(d)}" role="img" aria-label="Illustration of ${d.name}">${d.icon}</div>
    <h2>${d.name}</h2><p class="cat">${CATS[d.c][0]}</p>
    <span class="badge" title="${TYPES[d.t][1]}">${TYPES[d.t][0]}</span>
    <div class="big">${size(d.m)}</div>
    <dl><dt>In metres</dt><dd>${sci(d.m)} m</dd><dt>Plain</dt><dd>${d.m.toLocaleString('en',{maximumSignificantDigits:4})} m</dd>
    <dt>Log position</dt><dd>log₁₀ = ${d.l.toFixed(2)} (order 10${sup(Math.floor(d.l))} m)</dd></dl>
    <p>${tip(d.note)}</p>
    ${ex.map(e => `<p class="extra">${e}</p>`).join('')}
    ${S.cmp ? `<label>Compare with<select id="cmpSel">${DATA.map(o => `<option value="${o.i}" ${o===S.cmpTo?'selected':''}>${o.name}</option>`).join('')}</select></label>
      <p class="extra">${d.name} is ${ratioText(d, S.cmpTo)}.</p>` : ''}
    <p>${prev ? `Compared with the previous object: ${ratioText(d,prev)}.` : 'This is the smallest scale in the list.'}<br>
    ${next ? `Next: ${ratioText(d,next)}.` : 'This is the largest scale in the list.'}</p>
    <p class="src">Sources: ${SOURCES.map(s => `<a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a>`).join('')}</p>`;
}

/* ---------- Navigation ---------- */
function go(l, span) { S.tp = l; if (span) S.ts = clamp(span,1.5,72); S.rm ? (S.pos = S.tp, S.span = S.ts, frame()) : kick(); }
function select(d) { S.sel = d; render(); go(d.l); }
function nearest(l) { return vis().reduce((b,d) => Math.abs(d.l-l) < Math.abs(b.l-l) ? d : b); }
function step(n) { const L = vis(), k = clamp(L.indexOf(S.sel)+n,0,L.length-1); select(L[k]); }
function zoomAt(f, cx = 0.5) {
  const l = S.tp + (cx-.5)*S.ts, ts = clamp(S.ts*f,1.5,72);
  S.tp = l - (cx-.5)*ts; S.ts = ts;
  S.rm ? (S.pos = S.tp, S.span = S.ts, frame()) : kick();
}
function surprise() { const L = vis(); select(L[Math.floor(Math.random()*L.length)]); }

/* ---------- Rendering loop ---------- */
function kick() { raf = raf || requestAnimationFrame(loop); }
function loop() {
  raf = 0;
  S.pos += (S.tp - S.pos)*.16; S.span += (S.ts - S.span)*.16;
  if (Math.abs(S.tp-S.pos) < 1e-3 && Math.abs(S.ts-S.span) < 1e-3) { S.pos = S.tp; S.span = S.ts; } else kick();
  frame();
}
function frame() {
  const W = cv.clientWidth, H = cv.clientHeight, by = H*.66, ppd = W/S.span, X = l => W/2 + (l-S.pos)*ppd;
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = '#6f7db0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0,by); ctx.lineTo(W,by); ctx.stroke();
  ctx.textAlign = 'center'; ctx.font = '12px system-ui,sans-serif';
  const every = Math.max(1, Math.ceil(64/ppd));
  for (let n = Math.ceil((S.pos-S.span/2-1)/every)*every; n <= S.pos+S.span/2+1; n += every) {
    const x = X(n); ctx.strokeStyle = '#3a4570'; ctx.beginPath(); ctx.moveTo(x,by); ctx.lineTo(x,by+10); ctx.stroke();
    ctx.fillStyle = '#9aa4c2'; ctx.fillText(`10${sup(n)} m`, x, by+26);
  }
  nodes = [];
  vis().forEach(d => {
    const x = X(d.l); if (x < -80 || x > W+80) return;
    const sel = d === S.sel, y = by - 46 - (d.i%3)*40, col = `hsl(${hue(d)} 85% ${sel?78:64}%)`;
    ctx.strokeStyle = col; ctx.globalAlpha = sel ? 1 : .55; ctx.beginPath(); ctx.moveTo(x,by); ctx.lineTo(x,y+6); ctx.stroke();
    ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x,by,sel?7:4,0,7); ctx.fill();
    if (sel) { ctx.shadowColor = col; ctx.shadowBlur = 24; ctx.fill(); ctx.shadowBlur = 0; }
    ctx.font = `${sel?'600 14px':'12px'} system-ui,sans-serif`; ctx.fillStyle = sel ? '#fff' : '#cfd6ee'; ctx.fillText(d.name, x, y);
    nodes.push({x,d});
  });
  ctx.fillStyle = '#ffcf6b'; ctx.beginPath(); ctx.moveTo(W/2-7,by+36); ctx.lineTo(W/2+7,by+36); ctx.lineTo(W/2,by+28); ctx.fill();
  $('#liveSize').textContent = size(10**S.pos); $('#liveOom').textContent = `order 10${sup(Math.floor(S.pos))} m`;
  $('#prog').value = Math.round((S.pos-LMIN)/(LMAX-LMIN)*1000);
}
function resize() {
  dpr = window.devicePixelRatio || 1; cv.width = cv.clientWidth*dpr; cv.height = cv.clientHeight*dpr; frame();
}

/* ---------- Setup (listeners registered once) ---------- */
function setup() {
  $('#names').innerHTML = DATA.map(d => `<option value="${d.name}">`).join('');
  UNITS.forEach(u => $('#unit').insertAdjacentHTML('beforeend', `<option value="${u[0]}">${u[0]}</option>`));
  const chips = $('#chips');
  chips.innerHTML = `<button data-c="all" aria-pressed="true">All</button>` + CATS.map((c,i) => `<button data-c="${i}" style="--h:${c[1]}" aria-pressed="false">${c[0]}</button>`).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    b.dataset.c === 'all' ? S.filter.clear() : (S.filter.has(+b.dataset.c) ? S.filter.delete(+b.dataset.c) : S.filter.add(+b.dataset.c));
    chips.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.c === 'all' ? !S.filter.size : S.filter.has(+x.dataset.c)));
    if (!vis().includes(S.sel)) S.sel = nearest(S.sel.l);
    render(); frame();
  });
  const miles = $('#miles');
  CATS.forEach((c,i) => {
    const d = DATA.find(o => o.c === i), b = document.createElement('button');
    b.textContent = c[0]; b.title = `Jump to ${c[0]}`; b.style.left = `${(d.l-LMIN)/(LMAX-LMIN)*100}%`; b.style.borderBottom = `3px solid hsl(${c[1]} 80% 65%)`;
    b.onclick = () => select(d); miles.appendChild(b);
  });
  const toggle = (id, key, after) => $(id).addEventListener('click', e => {
    S[key] = !S[key]; e.currentTarget.setAttribute('aria-pressed', S[key]); (after || render)(); frame();
  });
  toggle('#sci','sci'); toggle('#human','human'); toggle('#learn','learn');
  toggle('#rm','rm', () => { if (S.rm) { S.pos = S.tp; S.span = S.ts; } });
  toggle('#cmpBtn','cmp', () => { S.cmpTo = S.cmpTo || DATA.find(d => d.name === 'Human'); render(); });
  $('#rm').setAttribute('aria-pressed', S.rm);
  $('#unit').onchange = e => { S.unit = e.target.value; render(); frame(); };
  $('#surprise').onclick = surprise;
  $('#search').addEventListener('change', e => {
    const q = e.target.value.trim().toLowerCase(); if (!q) return;
    const d = DATA.find(o => o.name.toLowerCase() === q) || DATA.find(o => o.name.toLowerCase().includes(q));
    if (d) { if (!vis().includes(d)) { S.filter.clear(); chips.querySelector('[data-c=all]').click(); } select(d); e.target.blur(); }
  });
  panel.addEventListener('change', e => { if (e.target.id === 'cmpSel') { S.cmpTo = DATA[+e.target.value]; render(); $('#cmpSel').focus(); } });
  $('.zoom').addEventListener('click', e => {
    const a = e.target.closest('button')?.dataset.act; if (!a) return;
    ({prev:() => step(-1), next:() => step(1), in:() => zoomAt(.6), out:() => zoomAt(1/.6), reset:() => { S.ts = 10; select(S.sel); }})[a]();
  });
  $('#prog').addEventListener('input', e => {
    const l = LMIN + e.target.value/1000*(LMAX-LMIN); S.sel = nearest(l); S.pos = S.tp = l; render(); frame();
  });
  /* pointer: drag, tap-select, pinch */
  const ptrs = new Map(); let moved = 0, pinch = 0;
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId,e); moved = 0; pinch = 0; });
  cv.addEventListener('pointermove', e => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    if (ptrs.size === 2) {
      ptrs.set(e.pointerId,e); const [a,b] = [...ptrs.values()], dist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
      if (pinch) zoomAt(pinch/dist); pinch = dist; moved = 99; return;
    }
    const dx = e.clientX - p.clientX; moved += Math.abs(dx); ptrs.set(e.pointerId,e);
    S.pos = S.tp = S.tp - dx/cv.clientWidth*S.span;
    const n = nearest(S.pos); if (n !== S.sel) { S.sel = n; render(); } frame();
  });
  const up = e => {
    if (ptrs.size === 1 && moved < 5) {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, hit = nodes.reduce((b,n) => !b || Math.abs(n.x-x) < Math.abs(b.x-x) ? n : b, null);
      if (hit && Math.abs(hit.x-x) < 20) select(hit.d);
    }
    ptrs.delete(e.pointerId); pinch = 0;
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', e => { ptrs.delete(e.pointerId); pinch = 0; });
  cv.addEventListener('wheel', e => { e.preventDefault(); zoomAt(Math.exp(e.deltaY*.0015), (e.clientX-cv.getBoundingClientRect().left)/cv.clientWidth); }, {passive:false});
  /* keyboard */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,select,textarea') && e.key !== 'Escape') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key, f = {ArrowRight:() => step(1), ArrowLeft:() => step(-1), '+':() => zoomAt(.6), '=':() => zoomAt(.6), '-':() => zoomAt(1/.6),
      Home:() => select(vis()[0]), End:() => select(vis().at(-1)), r:() => { S.ts = 10; select(S.sel); }, s:surprise,
      '/':() => $('#search').focus(), Escape:() => { $('#intro').hidden = true; document.activeElement.blur(); }}[k];
    if (f) { e.preventDefault(); f(); }
  });
  $('#start').onclick = () => { $('#intro').hidden = true; cv.focus(); };
  new ResizeObserver(resize).observe(cv);
  render(); resize();
}
setup();
