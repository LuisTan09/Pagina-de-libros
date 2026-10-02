/* Panel de administrador: editar textos, colores, banner, libros y publicar. */
(function(){
  const {esc, get} = CG, $ = s => document.querySelector(s);
  const ADMIN = (window.ADMIN_EMAIL || '').toLowerCase();
  let tab = 'general', active = false, editing = null, bk = null;
  const TABS = [['general','General'],['banner','Banner'],['libros','Libros'],['textos','Secciones'],['publicar','Publicar']];
  const MOODS = [['curioso','Curioso (signo ?)'],['dormilon','Dormilón (zzz)'],['travieso','Travieso'],['elegante','Elegante (moño y monóculo)'],['lector','Lector (gafas y libro)'],['sonador','Soñador (luna y estrellas)']];
  const LISTS = {
    perks:[['t','Título'],['s','Descripción']],
    numbers:[['n','Número','number'],['l','Texto']],
    quotes:[['q','Opinión','area'],['by','Autor y ciudad']],
    faq:[['q','Pregunta'],['a','Respuesta','area']],
    'hero.words':[['w','Palabra'],['mood','Ánimo del gato','select'],['fur','Color del gato','color'],['bg','Color de fondo','color']]
  };
  const TPL = {perks:{t:'Nuevo beneficio',s:'Descripción'}, numbers:{n:100,l:'Nuevo dato'}, quotes:{q:'Nueva opinión',by:'Nombre · Ciudad'}, faq:{q:'¿Nueva pregunta?',a:'Respuesta'}, announce:'Nuevo anuncio', 'hero.words':{w:'nuevo',mood:'curioso',fur:'#f2a65a',bg:'#fff0dc'}};

  /* ---------- piezas de formulario ---------- */
  const fld = (path, label, type = 'text', val = get(CG.C, path)) => {
    const v = esc(val);
    if (type === 'area') return `<label>${label}<textarea data-p="${path}" rows="3">${v}</textarea></label>`;
    if (type === 'color') return `<label class="clr">${label}<input type="color" data-p="${path}" data-t="color" value="${v}"></label>`;
    if (type === 'select') return `<label>${label}<select data-p="${path}">${MOODS.map(([k, l]) => `<option value="${k}" ${k === val ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
    return `<label>${label}<input type="${type}" data-p="${path}" ${type === 'number' ? 'data-t="number" step="any"' : ''} value="${v}"></label>`;
  };
  const list = (path, title, hint = '') => `<h4>${title}</h4>${hint ? `<p class="mut">${hint}</p>` : ''}` +
    (get(CG.C, path) || []).map((it, i) => `<div class="li"><div class="lh"><b>${i + 1}</b><button data-del="${path}:${i}">Eliminar</button></div>${LISTS[path].map(([k, l, t]) => fld(`${path}.${i}.${k}`, l, t, it[k])).join('')}</div>`).join('') +
    `<button class="sm" data-add="${path}">+ Añadir</button>`;
  const slist = (path, title) => `<h4>${title}</h4>` + (get(CG.C, path) || []).map((s, i) => `<div class="li row2">${fld(`${path}.${i}`, '', 'text', s)}<button data-del="${path}:${i}">✕</button></div>`).join('') + `<button class="sm" data-add="${path}">+ Añadir</button>`;

  /* ---------- pestañas ---------- */
  const views = {
    general: () => fld('brand','Nombre de la tienda') + '<h4>Colores del sitio</h4><div class="g2">' + fld('colors.ink','Texto y fondos oscuros','color') + fld('colors.teal','Botones principales','color') + fld('colors.sun','Acentos y avisos','color') + fld('colors.bg','Fondo de la página','color') + '</div>' +
      '<h4>Tienda</h4><div class="g2">' + fld('shop.freeShip','Envío gratis desde','number') + fld('shop.shipCost','Costo de envío','number') + fld('shop.coupon','Código de descuento') + fld('shop.couponPct','% de descuento','number') + fld('shop.currency','Símbolo de moneda') + '</div>' +
      slist('announce','Barra de anuncios') + '<h4>Pie de página</h4>' + fld('footer.about','Descripción','area') + fld('footer.email','Correo de contacto') + fld('footer.hours','Horario') + fld('footer.copy','Derechos') +
      '<h4>Boletín</h4>' + fld('news.title','Título') + fld('news.text','Texto') + fld('news.btn','Texto del botón'),
    banner: () => fld('hero.kicker','Texto pequeño superior') + fld('hero.pre','Frase del titular (la palabra cambiante va después)') + fld('hero.sub','Descripción','area') + '<div class="g2">' + fld('hero.cta1','Botón 1') + fld('hero.cta2','Botón 2') + '</div>' + fld('hero.hint','Indicación del pincel') +
      list('hero.words','Palabras y gatos','Cada palabra muestra un gato con su ánimo, su color y el color de fondo del banner.'),
    textos: () => '<h4>Títulos de sección</h4>' + ['cats','top','month','catalog','reviews','faq'].map(k => fld('sections.' + k, {cats:'Categorías',top:'Más vendidos',month:'Etiqueta del libro del mes',catalog:'Catálogo',reviews:'Opiniones',faq:'Preguntas frecuentes'}[k])).join('') +
      '<h4>Banner de ofertas</h4>' + fld('promo.title','Título') + fld('promo.text','Texto (usa {code} y {pct} para el cupón)','area') +
      list('perks','Beneficios (franja bajo el banner)') + list('numbers','Cifras animadas') + list('quotes','Opiniones de lectores') + list('faq','Preguntas frecuentes'),
    libros: () => editing ? bookForm() : `<button class="btn sm" data-b="new">+ Añadir libro</button><div class="blist">${CG.C.books.map(b => `<div class="bi"><div class="mini" style="background:${CG.miniBG(b)}"></div><div><b>${esc(b.t)}</b><br><small>${esc(b.a)} · ${CG.money(b.p)}${b.top ? ' · más vendido' : ''}${b.n ? ' · nuevo' : ''}${b.mes ? ' · libro del mes' : ''}</small></div><button data-b="edit:${b.id}">Editar</button><button class="dng" data-b="del:${b.id}">Eliminar</button></div>`).join('') || '<p class="mut">Aún no hay libros.</p>'}</div>`,
    publicar: () => `<p>Modo actual: <b>${CG.fb ? 'Firebase (publica al instante)' : 'Local (los cambios se guardan en este navegador)'}</b></p>
      <button class="btn" data-act="publish">${CG.fb ? 'Publicar cambios para todos' : 'Descargar content.json para publicar'}</button>
      <p class="mut">${CG.fb ? 'Al publicar, todos los visitantes ven los cambios en segundos.' : 'Para que los visitantes vean tus cambios: descarga content.json, súbelo a la raíz del repositorio en GitHub (Add file → Upload files) y espera uno o dos minutos.'}</p>
      <h4>Copias y herramientas</h4><div class="acts2"><button data-act="export">Descargar copia</button><label class="filebtn">Importar content.json<input type="file" id="imp" accept=".json,application/json"></label>
      <button data-act="discard">Descartar cambios sin publicar</button><button class="dng" data-act="reset">Restaurar valores originales</button>${CG.fb ? '' : '<button data-act="pass">Cambiar contraseña local</button>'}</div>`
  };

  /* ---------- libros ---------- */
  function bookForm(){
    const b = bk, cats = [...new Set(CG.C.books.map(x => x.c))];
    return `<h4>${b.id ? 'Editar libro' : 'Nuevo libro'}</h4>
      <label>Título<input data-bf="t" value="${esc(b.t)}"></label><label>Autor<input data-bf="a" value="${esc(b.a)}"></label>
      <label>Categoría<input data-bf="c" list="cl" value="${esc(b.c)}"><datalist id="cl">${cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist></label>
      <div class="g2"><label>Precio<input type="number" step="any" min="0" data-bf="p" value="${b.p}"></label><label>Precio anterior (opcional)<input type="number" step="any" min="0" data-bf="o" value="${b.o || ''}"></label></div>
      <label>Valoración<select data-bf="r">${[5,4,3,2,1].map(n => `<option value="${n}" ${b.r == n ? 'selected' : ''}>${'★'.repeat(n)}</option>`).join('')}</select></label>
      <label>Descripción<textarea data-bf="d" rows="3">${esc(b.d)}</textarea></label>
      <div class="g2"><label class="clr">Color 1 de la portada<input type="color" data-bf="c1" value="${esc(b.c1)}"></label><label class="clr">Color 2 de la portada<input type="color" data-bf="c2" value="${esc(b.c2)}"></label></div>
      <label>Imagen de portada (opcional)<input type="file" id="bimg" accept="image/*"></label><label>…o enlace a una imagen<input data-bf="img" value="${b.img && !b.img.startsWith('data:') ? esc(b.img) : ''}" placeholder="https://..."></label>
      <div class="prev" id="bprev">${CG.bookHTML(b)}</div><button class="sm" data-b="noimg">Quitar imagen</button>
      <div class="chks"><label><input type="checkbox" data-bf="top" ${b.top ? 'checked' : ''}> Más vendido</label><label><input type="checkbox" data-bf="n" ${b.n ? 'checked' : ''}> Nuevo</label><label><input type="checkbox" data-bf="mes" ${b.mes ? 'checked' : ''}> Libro del mes</label></div>
      <div class="acts2"><button class="btn" data-b="save">Guardar libro</button><button data-b="cancel">Cancelar</button></div>`;
  }
  const toData = f => new Promise(ok => { const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const s = Math.min(1, 420 / Math.max(im.width, im.height)), c = document.createElement('canvas');
    c.width = im.width * s; c.height = im.height * s; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', .8)); }; im.src = r.result; }; r.readAsDataURL(f); });
  const prevBook = () => { const p = $('#bprev'); if (p) p.innerHTML = CG.bookHTML(bk); };

  /* ---------- panel ---------- */
  function renderPanel(keep){
    const p = $('#apanel'); if (!p) return; const y = keep ? $('#pbody').scrollTop : 0;
    p.innerHTML = `<div class="ph"><b>Panel de administrador</b><button data-act="close" aria-label="Cerrar panel">✕</button></div>
      <nav class="ptabs">${TABS.map(([k, l]) => `<button class="${k === tab ? 'on' : ''}" data-tab="${k}">${l}</button>`).join('')}</nav><div class="pbody" id="pbody">${views[tab]()}</div>`;
    $('#pbody').scrollTop = y;
  }
  function enter(){
    if (active) return; active = true; sessionStorage.setItem('cg_admin', '1'); $('#modal').hidden = true;
    const bar = document.createElement('div'); bar.className = 'abar'; bar.id = 'abar';
    bar.innerHTML = `<span>Modo administrador</span><button data-act="open">Panel</button><button data-act="out">Salir</button>`; document.body.appendChild(bar);
    const p = document.createElement('aside'); p.className = 'apanel'; p.id = 'apanel'; document.body.appendChild(p);
    [bar, p].forEach(el => el.addEventListener('click', onClick)); p.addEventListener('input', onInput); p.addEventListener('change', onInput);
    renderPanel(); openPanel();
  }
  const openPanel = () => { renderPanel(true); $('#apanel').classList.add('on'); };
  function exit(){
    active = false; sessionStorage.removeItem('cg_admin'); if (CG.fb) CG.fb.auth.signOut();
    $('#abar')?.remove(); $('#apanel')?.remove(); CG.toast('Saliste del modo administrador');
  }

  function onInput(e){
    const t = e.target;
    if (t.dataset.p){ let v = t.value; if (t.dataset.t === 'number') v = parseFloat(v) || 0; CG.set(t.dataset.p, v); CG.change(); }
    else if (t.dataset.bf){
      const k = t.dataset.bf; bk[k] = t.type === 'checkbox' ? (t.checked ? 1 : 0) : ['p','o','r'].includes(k) ? (t.value === '' ? 0 : parseFloat(t.value)) : t.value;
      if (!bk.o) delete bk.o; if (!bk.img) delete bk.img; prevBook();
    } else if (t.id === 'bimg' && t.files[0]) toData(t.files[0]).then(d => { bk.img = d; prevBook(); });
    else if (t.id === 'imp' && t.files[0]) t.files[0].text().then(s => { try { CG.C = JSON.parse(s); CG.change(); renderPanel(); CG.toast('Contenido importado'); } catch { CG.toast('El archivo no es un content.json válido'); } });
  }
  async function publish(){
    const json = JSON.stringify(CG.C);
    if (CG.fb){
      if (json.length > 900000) return CG.toast('El contenido es muy grande: usa enlaces en vez de imágenes subidas');
      try { await CG.fb.db.doc('site/content').set({json, updated:Date.now()}); localStorage.removeItem('cg_draft'); CG.toast('Publicado: ya lo ven todos los visitantes'); }
      catch { CG.toast('No se pudo publicar. Revisa las reglas de Firestore y tu sesión.'); }
    } else { exportJSON(); CG.toast('Descargué content.json: súbelo a la raíz de GitHub'); }
  }
  function exportJSON(){ const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(CG.C, null, 2)], {type:'application/json'})); a.download = 'content.json'; a.click(); }
  const sha = async s => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('cg:' + s)))].map(b => b.toString(16).padStart(2, '0')).join('');

  function onClick(e){
    const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
    if (d.tab){ tab = d.tab; editing = null; return renderPanel(); }
    if (d.add){ const arr = get(CG.C, d.add); arr.push(structuredClone(TPL[d.add])); CG.change(); return renderPanel(true); }
    if (d.del){ const [p, i] = d.del.split(':'), arr = get(CG.C, p); if (p === 'hero.words' && arr.length < 2) return CG.toast('Debe quedar al menos una palabra'); arr.splice(+i, 1); CG.change(); return renderPanel(true); }
    if (d.b){
      const [a, id] = d.b.split(':');
      if (a === 'new'){ bk = {id:Math.max(0, ...CG.C.books.map(x => x.id)) + 1, t:'', a:'', c:'', p:10, r:5, c1:'#4338ca', c2:'#22d3ee', d:''}; editing = 'new'; return renderPanel(); }
      if (a === 'edit'){ bk = structuredClone(CG.C.books.find(x => x.id == id)); editing = id; return renderPanel(); }
      if (a === 'del'){ const x = CG.C.books.find(y => y.id == id); if (confirm(`¿Eliminar "${x.t}"? Esta acción no se puede deshacer.`)){ CG.C.books = CG.C.books.filter(y => y.id != id); CG.change(); renderPanel(true); } return; }
      if (a === 'noimg'){ delete bk.img; renderPanel(true); return; }
      if (a === 'cancel'){ editing = null; return renderPanel(); }
      if (a === 'save'){
        if (!bk.t.trim() || !bk.a.trim() || !bk.c.trim()) return CG.toast('Completa título, autor y categoría');
        if (!(bk.p >= 0)) return CG.toast('El precio no es válido');
        if (bk.mes) CG.C.books.forEach(x => delete x.mes);
        const i = CG.C.books.findIndex(x => x.id == bk.id); i >= 0 ? CG.C.books[i] = bk : CG.C.books.push(bk);
        editing = null; CG.change(); CG.toast('Libro guardado'); return renderPanel();
      }
    }
    if (d.act === 'close') $('#apanel').classList.remove('on');
    if (d.act === 'open') openPanel();
    if (d.act === 'out') exit();
    if (d.act === 'publish') publish();
    if (d.act === 'export') exportJSON();
    if (d.act === 'discard' && confirm('¿Descartar tus cambios sin publicar? Se recargará la página.')){ localStorage.removeItem('cg_draft'); location.reload(); }
    if (d.act === 'reset' && confirm('¿Restaurar todo el contenido original? Perderás tus cambios no publicados.')){ CG.C = {}; CG.change(); renderPanel(); }
    if (d.act === 'pass'){ const p = prompt('Nueva contraseña (mínimo 8 caracteres):'); if (p && p.length >= 8) sha(p).then(h => { localStorage.setItem('cg_pass', h); CG.toast('Contraseña actualizada'); }); else if (p) CG.toast('Mínimo 8 caracteres'); }
  }

  /* ---------- acceso ---------- */
  const ready = () => new Promise(r => CG.isReady ? r() : document.addEventListener('cg-ready', r, {once:true}));
  async function doLogin(email, pass){
    await ready();
    if (email.trim().toLowerCase() !== ADMIN) throw new Error('Ese correo no tiene permiso de administrador.');
    if (CG.fb){
      const cr = await CG.fb.auth.signInWithEmailAndPassword(email.trim(), pass);
      if ((cr.user.email || '').toLowerCase() !== ADMIN){ await CG.fb.auth.signOut(); throw new Error('Ese correo no tiene permiso de administrador.'); }
    } else {
      const h = await sha(pass), s = localStorage.getItem('cg_pass');
      if (!s) localStorage.setItem('cg_pass', h); else if (s !== h) throw new Error('Contraseña incorrecta.');
    }
    enter();
  }
  async function loginModal(){
    await ready(); const has = !!localStorage.getItem('cg_pass');
    CG.openModal(`<div class="mb one"><button class="x" aria-label="Cerrar">✕</button><form id="loginForm"><h2>Acceso de administrador</h2>
      <p class="mut">${CG.fb ? 'Entra con tu cuenta de administrador.' : has ? 'Modo local: escribe tu contraseña.' : 'Modo local: crea una contraseña para este navegador (mínimo 8 caracteres).'}</p>
      <label>Correo<input type="email" name="e" required autocomplete="username"></label><label>Contraseña<input type="password" name="p" required minlength="${CG.fb || has ? 1 : 8}" autocomplete="${has || CG.fb ? 'current-password' : 'new-password'}"></label>
      <p class="err" id="lerr" role="alert"></p><button class="btn wide">Entrar</button></form></div>`);
    $('#loginForm').onsubmit = async e => { e.preventDefault(); const f = e.target;
      try { await doLogin(f.elements.e.value, f.elements.p.value); } catch (er) { $('#lerr').textContent = /invalid|wrong|user-not-found|credential/i.test(er.code || er.message) && er.code ? 'Correo o contraseña incorrectos.' : er.message; } };
  }
  const openAdmin = () => active ? openPanel() : loginModal();
  $('#adminLink').addEventListener('click', e => { e.preventDefault(); openAdmin(); });
  addEventListener('hashchange', () => { if (location.hash === '#admin'){ history.replaceState(null, '', location.pathname); openAdmin(); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#apanel')?.classList.remove('on'); });
  ready().then(() => {
    if (CG.fb) CG.fb.auth.onAuthStateChanged(u => { if (u && (u.email || '').toLowerCase() === ADMIN) enter(); });
    else if (sessionStorage.getItem('cg_admin')) enter();
    if (location.hash === '#admin'){ history.replaceState(null, '', location.pathname); openAdmin(); }
  });
})();
