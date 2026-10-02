/* Banner interactivo: gatos que cambian de ánimo y de color, y un pincel para pintarlos. */
window.Cats = (function(){
  const $ = s => document.querySelector(s);
  const hex = h => [1,3,5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  const INK = '#2b1f3a', F = "font-family:'Bricolage Grotesque',sans-serif;font-weight:800";
  const SWATCHES = ['#ff6b6b','#ffa94d','#ffd43b','#69db7c','#38d9a9','#4dabf7','#9775fa','#f783ac','#ffffff','#343a40'];
  let words = [], idx = 0, color = SWATCHES[0], painting = false, stopped = false, svg, timer;

  const eyes = (dx, dy) => `<g class="eyes"><ellipse cx="160" cy="196" rx="23" ry="27" fill="#fff"/><ellipse cx="240" cy="196" rx="23" ry="27" fill="#fff"/>
    <g class="pupils" data-bx="${dx}" data-by="${dy}" style="transform:translate(${dx}px,${dy}px)"><circle cx="160" cy="199" r="12" fill="${INK}"/><circle cx="240" cy="199" r="12" fill="${INK}"/><circle cx="165" cy="193" r="4" fill="#fff"/><circle cx="245" cy="193" r="4" fill="#fff"/></g></g>`;
  const nose = '<path d="M189 226h22l-11 13z" fill="#ff8fa3" stroke="#ff8fa3" stroke-width="4" stroke-linejoin="round"/>';
  const mouth = `<path d="M200 240q-12 16-26 5M200 240q12 16 26 5" fill="none" stroke="#3b2a4a" stroke-width="4" stroke-linecap="round"/>`;
  const whisk = '<g stroke="#3b2a4a" stroke-width="2.5" stroke-linecap="round" opacity=".55"><path d="M130 232L72 222M130 242L70 246M270 232L328 222M270 242L330 246"/></g>';
  const txt = (x, y, s, t, extra = '') => `<text x="${x}" y="${y}" font-size="${s}" style="${F}" ${extra}>${t}</text>`;

  /* cada ánimo define: cara, accesorios sobre el cuerpo y inclinación de la cabeza */
  const MOODS = {
    curioso: {tilt:-7, face: eyes(5,-5) + `<path d="M218 156q22-16 44 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` + nose + mouth + whisk,
      extra: txt(292,128,70,'?','fill="#1d1546" class="bob"')},
    dormilon: {tilt:6, face: `<path d="M136 200q24 20 48 0M216 200q24 20 48 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` + nose + `<path d="M200 240q-8 8-16 2M200 240q8 8 16 2" fill="none" stroke="#3b2a4a" stroke-width="4" stroke-linecap="round"/>` + whisk,
      extra: txt(300,112,40,'z','fill="#6b5fb5" class="bob"') + txt(326,80,30,'z','fill="#6b5fb5" class="bob d2"') + txt(346,54,22,'z','fill="#6b5fb5" class="bob d3"')},
    travieso: {tilt:3, face: `<circle cx="160" cy="196" r="24" fill="#ffe066"/><circle cx="240" cy="196" r="24" fill="#ffe066"/><ellipse cx="160" cy="198" rx="5" ry="19" fill="${INK}"/><ellipse cx="240" cy="198" rx="5" ry="19" fill="${INK}"/>
      <path d="M134 166L188 184M266 166L212 184" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` + nose + `<path d="M166 242q34 30 68 0z" fill="#fff" stroke="#3b2a4a" stroke-width="4" stroke-linejoin="round"/><path d="M196 262q4 16 15 6q3-8-1-14z" fill="#ff7a93"/>` + whisk,
      extra: `<ellipse cx="46" cy="412" rx="34" ry="7" fill="#8b5a2b" opacity=".55"/><rect x="50" y="368" width="44" height="38" rx="7" fill="#fff" stroke="#1d1546" stroke-width="4" transform="rotate(-72 72 388)"/>`},
    elegante: {tilt:0, face: eyes(0,0) + `<circle cx="240" cy="196" r="31" fill="none" stroke="#d4a017" stroke-width="5"/><path d="M263 220Q292 270 284 332" fill="none" stroke="#d4a017" stroke-width="3"/>` + nose + mouth + whisk,
      extra: `<path d="M200 296L158 272V320zM200 296L242 272V320z" fill="#e63946" stroke="#e63946" stroke-width="6" stroke-linejoin="round"/><circle cx="200" cy="296" r="11" fill="#c1121f"/>`},
    lector: {tilt:2, face: eyes(0,6) + `<circle cx="160" cy="196" r="32" fill="rgba(255,255,255,.25)" stroke="${INK}" stroke-width="5"/><circle cx="240" cy="196" r="32" fill="rgba(255,255,255,.25)" stroke="${INK}" stroke-width="5"/><path d="M192 192q8-8 16 0M128 190L110 182M272 190L290 182" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` + nose + mouth + whisk,
      extra: `<path d="M116 334L200 350V414L116 398z" fill="#fff" stroke="#1d1546" stroke-width="4" stroke-linejoin="round"/><path d="M284 334L200 350V414L284 398z" fill="#efeaff" stroke="#1d1546" stroke-width="4" stroke-linejoin="round"/>
        <path d="M132 356L186 366M132 372L186 382M268 356L214 366M268 372L214 382" stroke="#9a92c9" stroke-width="3" stroke-linecap="round"/><ellipse data-part="paws" cx="122" cy="388" rx="24" ry="16"/><ellipse data-part="paws" cx="278" cy="388" rx="24" ry="16"/>`},
    sonador: {tilt:-4, face: eyes(0,-9) + nose + mouth + whisk,
      extra: `<path d="M326 40a36 36 0 1 0 24 56a30 30 0 1 1-24-56z" fill="#ffd166"/>` + txt(52,120,36,'★','fill="#ffc84a" class="tw"') + txt(318,190,26,'★','fill="#ffc84a" class="tw d2"') + txt(70,250,22,'★','fill="#ffc84a" class="tw d3"')}
  };

  function build(mood){
    const m = MOODS[mood] || MOODS.curioso;
    return `<g id="catg"><ellipse cx="200" cy="414" rx="125" ry="10" fill="rgba(0,0,0,.12)"/>
      <path class="tail" data-part="tail" data-s d="M292 350C372 352 392 262 346 222C330 208 312 224 328 238C354 262 340 308 288 304Z"/>
      <ellipse data-part="body" cx="200" cy="318" rx="100" ry="92"/><ellipse data-part="belly" cx="200" cy="338" rx="54" ry="58"/>
      <ellipse data-part="paws" cx="158" cy="402" rx="34" ry="17"/><ellipse data-part="paws" cx="242" cy="402" rx="34" ry="17"/>
      <g class="headg" style="transform:rotate(${m.tilt}deg)">
        <path data-part="ears" data-s stroke-width="12" stroke-linejoin="round" d="M112 160L116 62L190 114Z"/><path data-part="ears" data-s stroke-width="12" stroke-linejoin="round" d="M288 160L284 62L210 114Z"/>
        <path d="M128 138L130 90L168 114Z" fill="#ffb3c1" stroke="#ffb3c1" stroke-width="8" stroke-linejoin="round"/><path d="M272 138L270 90L232 114Z" fill="#ffb3c1" stroke="#ffb3c1" stroke-width="8" stroke-linejoin="round"/>
        <ellipse data-part="head" cx="200" cy="198" rx="108" ry="94"/>
        <ellipse data-part="stripes" cx="200" cy="120" rx="7" ry="17"/><ellipse data-part="stripes" cx="172" cy="126" rx="6" ry="14" transform="rotate(-22 172 126)"/><ellipse data-part="stripes" cx="228" cy="126" rx="6" ry="14" transform="rotate(22 228 126)"/>
        <circle data-part="cheeks" cx="136" cy="228" r="17" fill-opacity=".6"/><circle data-part="cheeks" cx="264" cy="228" r="17" fill-opacity=".6"/>
        ${m.face}</g>${m.extra}<g id="splats"></g></g>`;
  }
  function colors(fur){ return {body:fur, head:fur, ears:fur, tail:mix(fur,'#000000',.1), belly:mix(fur,'#ffffff',.62), paws:mix(fur,'#ffffff',.45), stripes:mix(fur,'#000000',.28), cheeks:'#ff9db0'}; }
  function paintPart(el, c){ el.style.fill = c; if (el.hasAttribute('data-s')) el.style.stroke = c; }
  function resetFur(fur){ const c = colors(fur); svg.querySelectorAll('[data-part]').forEach(el => paintPart(el, c[el.dataset.part])); }

  function show(i, anim){
    const w = words[idx = i]; if (!w) return;
    const box = $('#catbox'); box.innerHTML = `<svg id="cat" viewBox="0 0 400 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gato ${w.w}">${build(w.mood)}</svg>`;
    svg = $('#cat'); resetFur(w.fur);
    if (anim){ box.classList.remove('pop'); void box.offsetWidth; box.classList.add('pop'); }
    $('#inicio').style.setProperty('--hbg', w.bg);
    const el = $('#word'); el.textContent = w.w; el.style.color = mix(w.fur, '#1d1546', .5);
    el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap');
    document.querySelectorAll('.wchip').forEach((b, k) => { b.classList.toggle('on', k === i); b.style.setProperty('--wc', words[k].fur); });
    bindPaint();
  }

  /* ----- pincel ----- */
  function partAt(x, y){ const el = document.elementFromPoint(x, y); return el && el.closest && el.closest('[data-part]'); }
  function splat(e){
    const g = svg.querySelector('#splats'), pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(svg.getScreenCTM().inverse()), c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', q.x); c.setAttribute('cy', q.y); c.setAttribute('r', 9); c.setAttribute('fill', color); c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center';
    g.appendChild(c); const a = c.animate([{opacity:.85, transform:'scale(.4)'},{opacity:0, transform:'scale(2.4)'}], {duration:480}); a.onfinish = () => c.remove();
  }
  function stroke(e){ const p = partAt(e.clientX, e.clientY); if (p){ paintPart(p, color); splat(e); stopped = true; } }
  function bindPaint(){
    svg.addEventListener('pointerdown', e => { painting = true; stroke(e); });
    svg.addEventListener('pointermove', e => { if (painting) stroke(e); });
  }
  addEventListener('pointerup', () => painting = false);

  function download(){
    const s = new XMLSerializer().serializeToString(svg), img = new Image();
    img.onload = () => { const c = document.createElement('canvas'); c.width = 800; c.height = 860; const x = c.getContext('2d');
      x.fillStyle = words[idx].bg; x.fillRect(0, 0, 800, 860); x.drawImage(img, 0, 0, 800, 860);
      c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'mi-gato.png'; a.click(); }); };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }

  function buildBar(hint){
    $('#brushBar').innerHTML = `<p class="hint">${hint}</p><div class="sw">${SWATCHES.map(c => `<button class="swatch ${c === color ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join('')}
      <label class="swatch custom" title="Otro color"><input type="color" id="customColor" value="${color}"></label></div>
      <div class="acts"><button data-a="rand">🎲 Sorpresa</button><button data-a="reset">↺ Limpiar</button><button data-a="dl">⬇ Descargar</button></div>`;
  }
  $('#brushBar').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.c){ color = b.dataset.c; document.querySelectorAll('.swatch').forEach(s => s.classList.toggle('on', s === b)); }
    if (b.dataset.a === 'reset') resetFur(words[idx].fur);
    if (b.dataset.a === 'dl') download();
    if (b.dataset.a === 'rand'){ const h = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'), f = h(), c = colors(f);
      svg.querySelectorAll('[data-part]').forEach(el => paintPart(el, c[el.dataset.part])); stopped = true; }
  });
  $('#brushBar').addEventListener('input', e => { if (e.target.id === 'customColor'){ color = e.target.value; document.querySelectorAll('.swatch').forEach(s => s.classList.remove('on')); } });

  /* ----- palabras ----- */
  $('#wchips').addEventListener('click', e => { const b = e.target.closest('.wchip'); if (b){ stopped = true; show(+b.dataset.i, true); } });
  function update(h){
    words = h.words || []; if (!words.length) return;
    $('#wchips').innerHTML = words.map((w, i) => `<button class="wchip" data-i="${i}">${w.w.replace(/</g, '&lt;')}</button>`).join('');
    buildBar(h.hint.replace(/</g, '&lt;')); show(Math.min(idx, words.length - 1), false);
  }
  /* los ojos siguen al cursor */
  document.addEventListener('pointermove', e => {
    if (!svg) return; const r = svg.getBoundingClientRect(), dx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / 260)), dy = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 3) / 260));
    const p = svg.querySelector('.pupils'); if (p) p.style.transform = `translate(${+p.dataset.bx + dx * 7}px,${+p.dataset.by + dy * 6}px)`;
  });
  /* cambia solo hasta que la persona interactúa */
  timer = setInterval(() => { if (!stopped && !document.hidden && words.length > 1 && !matchMedia('(prefers-reduced-motion:reduce)').matches) show((idx + 1) % words.length, true); }, 4800);
  update(CG.C.hero);
  return {update};
})();
