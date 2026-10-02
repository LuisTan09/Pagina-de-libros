/* ===== Utilidades ===== */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
const setp = (o, p, v) => { const k = p.split('.'), l = k.pop(); k.reduce((a, x) => a[x], o)[l] = v; };
const merge = (b, o) => { if (Array.isArray(b) || typeof b !== 'object' || b === null) return o === undefined ? b : o;
  const r = {...b}; for (const k in (o || {})) r[k] = k in b ? merge(b[k], o[k]) : o[k]; return r; };
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

/* ===== Contenido: valores por defecto + borrador del admin + contenido publicado ===== */
let C = merge(structuredClone(DEFAULTS), load('cg_draft', null));
const state = {cat:'Todos', q:'', sort:'rel', max:Infinity, offer:false, cart:load('cart',{}), favs:load('favs',[]), coupon:load('coupon',false)};
const fmt = s => String(s ?? '').replace(/\{code\}/g, C.shop.coupon).replace(/\{pct\}/g, C.shop.couponPct);
const money = n => C.shop.currency + Number(n).toFixed(2);
const books = () => C.books || [];
const byId = id => books().find(b => b.id == id);
const catList = () => ['Todos', ...new Set(books().map(b => b.c).filter(Boolean))];

/* ===== Componentes ===== */
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const bookHTML = b => `<div class="book" style="--c1:${esc(b.c1)};--c2:${esc(b.c2)}"><div class="back"></div><div class="spine"></div>
  <div class="cover" style="background:${b.img ? `#fff url('${esc(b.img)}') center/cover no-repeat` : `linear-gradient(150deg,${esc(b.c1)},${esc(b.c2)})`}">${b.img ? '' : `<small>${esc(b.a)}</small><b>${esc(b.t)}</b><i></i>`}</div></div>`;
const miniBG = b => b.img ? `url('${esc(b.img)}') center/cover` : `linear-gradient(150deg,${esc(b.c1)},${esc(b.c2)})`;
const priceHTML = b => `<span class="price">${b.o > b.p ? `<s>${money(b.o)}</s>` : ''}${money(b.p)}</span>`;
const cardHTML = (b, i = 0) => `<article class="card" style="animation-delay:${i * 40}ms">
  ${b.o > b.p ? `<span class="badge">-${Math.round((1 - b.p / b.o) * 100)}%</span>` : b.n ? '<span class="badge new">Nuevo</span>' : ''}
  <button class="fav ${state.favs.includes(b.id) ? 'on' : ''}" data-fav="${b.id}" aria-label="Favorito">${state.favs.includes(b.id) ? '♥' : '♡'}</button>
  ${bookHTML(b)}<h3>${esc(b.t)}</h3><span class="au">${esc(b.a)}</span><span class="stars" aria-label="${b.r} de 5">${stars(b.r)}</span>
  ${priceHTML(b)}<div class="row"><button class="view" data-view="${b.id}">Ver más</button><button class="add" data-add="${b.id}">Añadir</button></div></article>`;

/* ===== Pintar la página ===== */
function renderAll(){
  const r = document.documentElement.style; for (const k in C.colors) r.setProperty('--' + k, C.colors[k]);
  document.title = C.brand + ' · Librería online';
  $$('[data-t]').forEach(el => el.textContent = fmt(get(C, el.dataset.t)));
  $('#mail').href = 'mailto:' + C.footer.email;
  const a = (C.announce || []).map(t => `<span>${esc(t)}</span>`).join(''); $('#marq').innerHTML = a + a;
  $('#perks').innerHTML = (C.perks || []).map(p => `<div><b>${esc(p.t)}</b><span>${esc(p.s)}</span></div>`).join('');
  const tiles = catList().slice(1);
  $('#catTiles').innerHTML = tiles.map(c => `<button class="tile" data-tile="${esc(c)}" style="background:linear-gradient(140deg,${esc(books().find(b => b.c === c).c1)},#1d1546)"><b>${esc(c)}</b><span>${books().filter(b => b.c === c).length} títulos</span></button>`).join('');
  $('#categorias').hidden = !tiles.length;
  const tops = books().filter(b => b.top); $('#top').hidden = !tops.length; $('#rail').innerHTML = tops.map(cardHTML).join('');
  const m = books().find(b => b.mes); $('#mes').hidden = !m;
  if (m) $('#mes').innerHTML = `<div class="turn">${bookHTML(m)}</div><div><span class="tag" data-t="sections.month">${esc(C.sections.month)}</span><h2>${esc(m.t)}</h2><span class="au">${esc(m.a)} · ${esc(m.c)}</span><div class="stars">${stars(m.r)}</div><p>${esc(m.d)}</p>${priceHTML(m)}<div class="cta"><button class="btn" data-add="${m.id}">Añadir al carrito</button><button class="btn ghost" style="color:#fff;box-shadow:inset 0 0 0 2px #fff" data-view="${m.id}">Ver detalles</button></div></div>`;
  renderNumbers();
  const offers = books().filter(b => b.o > b.p); $('#ofertas').hidden = !offers.length;
  $('#promoBooks').innerHTML = offers.slice(0,3).map(b => `<div class="sm">${bookHTML(b)}</div>`).join('');
  $('#quotes').innerHTML = (C.quotes || []).map(q => `<blockquote>“${esc(q.q)}”<cite>${esc(q.by)}</cite></blockquote>`).join('');
  $('#faqList').innerHTML = (C.faq || []).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(fmt(f.a))}</p></details>`).join('');
  const top = Math.max(5, Math.ceil(Math.max(0, ...books().map(b => b.p)))); $('#max').max = top;
  if (state.max > top) state.max = top; $('#max').value = state.max; $('#maxOut').textContent = C.shop.currency + state.max;
  if (!catList().includes(state.cat)) state.cat = 'Todos';
  renderChips(); renderGrid(); renderCart(); syncFavs();
  window.Cats && Cats.update(C.hero);
}
let numsDone = false;
function renderNumbers(){
  $('#numbers').innerHTML = (C.numbers || []).map(n => `<div><strong data-to="${Number(n.n) || 0}">${numsDone ? (Number(n.n) || 0).toLocaleString('es') : 0}</strong><span>${esc(n.l)}</span></div>`).join('');
}
new IntersectionObserver((es, o) => es.forEach(e => {
  if (!e.isIntersecting || numsDone) return; numsDone = true;
  $$('#numbers strong').forEach(el => { const to = +el.dataset.to, t0 = performance.now();
    (function step(t){ const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('es'); if (k < 1) requestAnimationFrame(step); })(t0); });
}), {threshold:.4}).observe($('#numbers'));

const end = new Date(); end.setDate(end.getDate() + (7 - end.getDay()) % 7); end.setHours(23,59,59,0);
function tick(){ let s = Math.max(0, (end - new Date()) / 1000 | 0);
  $('#count').innerHTML = [['días',86400],['horas',3600],['min',60],['seg',1]].map(([n, v]) => { const x = Math.floor(s / v); s -= x * v; return `<div><b>${String(x).padStart(2,'0')}</b><small>${n}</small></div>`; }).join(''); }
tick(); setInterval(tick, 1000);
$$('[data-sc]').forEach(b => b.onclick = () => $('#rail').scrollBy({left: b.dataset.sc * 520, behavior:'smooth'}));

/* ===== Catálogo ===== */
function renderChips(){ $('#chips').innerHTML = catList().map(c => `<button class="chip ${c === state.cat ? 'on' : ''}" data-c="${esc(c)}">${esc(c)}</button>`).join(''); }
function renderGrid(){
  const list = books().filter(b => (state.cat === 'Todos' || b.c === state.cat) && b.p <= state.max && (!state.offer || b.o > b.p) &&
    (b.t + ' ' + b.a).toLowerCase().includes(state.q.toLowerCase()));
  const s = {asc:(a,b) => a.p - b.p, desc:(a,b) => b.p - a.p, rate:(a,b) => b.r - a.r}[state.sort]; if (s) list.sort(s);
  $('#found').textContent = `${list.length} ${list.length === 1 ? 'libro encontrado' : 'libros encontrados'}`;
  $('#empty').hidden = list.length > 0; $('#grid').innerHTML = list.map(cardHTML).join('');
}
$('#chips').onclick = e => { if (e.target.dataset.c){ state.cat = e.target.dataset.c; renderChips(); renderGrid(); } };
$('#search').oninput = e => { state.q = e.target.value; renderGrid(); };
$('#sort').onchange = e => { state.sort = e.target.value; renderGrid(); };
$('#max').oninput = e => { state.max = +e.target.value; $('#maxOut').textContent = C.shop.currency + state.max; renderGrid(); };
$('#onlyOffer').onchange = e => { state.offer = e.target.checked; renderGrid(); };

/* ===== Favoritos ===== */
function toggleFav(id){
  state.favs = state.favs.includes(id) ? state.favs.filter(x => x !== id) : [...state.favs, id];
  localStorage.setItem('favs', JSON.stringify(state.favs)); syncFavs();
  toast(state.favs.includes(id) ? 'Guardado en favoritos' : 'Quitado de favoritos');
}
function syncFavs(){
  $('#favCount').textContent = state.favs.filter(byId).length;
  $$('[data-fav]').forEach(b => { const on = state.favs.includes(+b.dataset.fav); b.classList.toggle('on', on); b.textContent = on ? '♥' : '♡'; });
}
$('#openFav').onclick = () => {
  const l = state.favs.map(byId).filter(Boolean);
  openModal(`<div class="mb one"><button class="x" aria-label="Cerrar">✕</button><div><h2>Tus favoritos</h2>${l.length ? l.map(b => `<div class="item"><div class="mini" style="background:${miniBG(b)}"></div><div><h4>${esc(b.t)}</h4><span class="au">${money(b.p)}</span></div><button class="add" style="padding:.4rem .9rem;border-radius:99px" data-add="${b.id}">Añadir</button></div>`).join('') : '<p>Aún no guardas libros. Toca el corazón en cualquier portada.</p>'}</div></div>`);
};

/* ===== Carrito ===== */
const save = () => { localStorage.setItem('cart', JSON.stringify(state.cart)); localStorage.setItem('coupon', JSON.stringify(state.coupon)); renderCart(); };
const cartIds = () => Object.keys(state.cart).filter(byId);
const totals = () => { const sub = cartIds().reduce((s, id) => s + byId(id).p * state.cart[id], 0), disc = state.coupon ? sub * C.shop.couponPct / 100 : 0, t = sub - disc;
  return {sub, disc, total:t, ship: t >= C.shop.freeShip || sub === 0 ? 0 : C.shop.shipCost}; };
function addToCart(id){
  state.cart[id] = (state.cart[id] || 0) + 1; save();
  const b = $('#openCart'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); toast('Añadido: ' + byId(id).t);
}
function renderCart(){
  const ids = cartIds(), {sub, disc, total, ship} = totals(), left = Math.max(0, C.shop.freeShip - total);
  $('#cartCount').textContent = ids.reduce((s, id) => s + state.cart[id], 0);
  $('#drawer').innerHTML = `<div class="dh"><h2>Tu carrito</h2><button id="closeCart" aria-label="Cerrar">✕</button></div>
  <div class="ship">${left ? `Te faltan <b>${money(left)}</b> para el envío gratis` : '¡Tienes envío gratis!'}<div class="bar"><i style="width:${Math.min(100, total / C.shop.freeShip * 100)}%"></i></div></div>
  <div class="dbody">${ids.length ? ids.map(id => { const b = byId(id); return `<div class="item"><div class="mini" style="background:${miniBG(b)}"></div>
    <div><h4>${esc(b.t)}</h4><div>${money(b.p)}</div><div class="qty"><button data-dec="${id}" aria-label="Quitar uno">−</button><span>${state.cart[id]}</span><button data-inc="${id}" aria-label="Añadir uno">+</button></div></div><button class="rm" data-rm="${id}">Quitar</button></div>`; }).join('') : '<p class="cart-empty">Tu carrito está vacío. Añade un libro del catálogo.</p>'}</div>
  <div class="df"><div class="coupon"><input id="cpn" placeholder="Código de descuento" aria-label="Código de descuento"><button id="applyCpn">Aplicar</button></div>
  <div class="line"><span>Subtotal</span><span>${money(sub)}</span></div>${disc ? `<div class="line"><span>Descuento ${esc(C.shop.coupon)}</span><span>-${money(disc)}</span></div>` : ''}
  <div class="line"><span>Envío</span><span>${ids.length ? (ship ? money(ship) : 'Gratis') : '-'}</span></div>
  <div class="line t"><span>Total</span><span>${money(total + ship)}</span></div>
  <button class="btn wide" id="checkout">Finalizar compra</button><button class="link" id="clearCart">Vaciar carrito</button></div>`;
}
const drawer = on => { $('#drawer').classList.toggle('on', on); $('#overlay').classList.toggle('on', on); };
$('#drawer').addEventListener('click', e => {
  const {inc, dec, rm} = e.target.dataset, id = e.target.id;
  if (inc) state.cart[inc]++; if (dec && --state.cart[dec] <= 0) delete state.cart[dec]; if (rm) delete state.cart[rm];
  if (inc || dec || rm) return save();
  if (id === 'closeCart') drawer(false);
  if (id === 'clearCart'){ state.cart = {}; state.coupon = false; save(); }
  if (id === 'applyCpn'){ if ($('#cpn').value.trim().toUpperCase() === C.shop.coupon.toUpperCase()){ state.coupon = true; save(); toast(`Cupón aplicado: ${C.shop.couponPct}% de descuento`); } else toast('Ese código no es válido'); }
  if (id === 'checkout') checkout();
});
$('#openCart').onclick = () => drawer(true);
$('#overlay').onclick = () => drawer(false);

function checkout(){
  if (!cartIds().length) return toast('Añade al menos un libro para continuar');
  const {total, ship} = totals();
  openModal(`<div class="mb one"><button class="x" aria-label="Cerrar">✕</button><form id="payForm"><h2>Finalizar compra</h2><p>Total a pagar: <b>${money(total + ship)}</b></p>
  <label>Nombre completo<input required placeholder=" " name="n"></label><label>Correo electrónico<input required type="email" placeholder=" "></label>
  <label>Ciudad<input required placeholder=" "></label><label>Dirección de entrega<input required placeholder=" "></label>
  <button class="btn wide" style="margin-top:1.2rem">Confirmar pedido</button></form></div>`);
  $('#payForm').onsubmit = e => { e.preventDefault(); const n = esc(e.target.elements.n.value.split(' ')[0]);
    state.cart = {}; state.coupon = false; save(); $('#modal').hidden = true; drawer(false);
    openModal(`<div class="mb one"><button class="x" aria-label="Cerrar">✕</button><h2>¡Gracias, ${n}!</h2><p>Recibimos tu pedido. Te enviaremos la confirmación y el número de seguimiento por correo.</p><button class="btn wide x2">Seguir explorando</button></div>`); };
}

/* ===== Modal, toast, eventos globales ===== */
function openModal(html){ const el = $('#modal'); el.innerHTML = html; el.hidden = false; }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.classList.contains('x') || e.target.classList.contains('x2')) $('#modal').hidden = true; });
function quickView(id){ const b = byId(id);
  openModal(`<div class="mb"><button class="x" aria-label="Cerrar">✕</button><div class="turn2">${bookHTML(b)}</div><div><h2>${esc(b.t)}</h2><span class="au">${esc(b.a)} · ${esc(b.c)}</span><div class="stars">${stars(b.r)}</div><p>${esc(b.d)}</p>${priceHTML(b)}<button class="btn wide" data-add="${b.id}">Añadir al carrito</button></div></div>`); }
document.addEventListener('click', e => {
  const t = e.target.closest('[data-add],[data-view],[data-fav],[data-tile]'); if (!t) return;
  const d = t.dataset;
  if (d.add && byId(d.add)) addToCart(+d.add); if (d.view && byId(d.view)) quickView(+d.view); if (d.fav) toggleFav(+d.fav);
  if (d.tile){ state.cat = d.tile; renderChips(); renderGrid(); $('#catalogo').scrollIntoView({behavior:'smooth'}); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape'){ $('#modal').hidden = true; drawer(false); } });
let tm; function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tm); tm = setTimeout(() => t.classList.remove('on'), 2600); }
$('#newsForm').onsubmit = e => { e.preventDefault(); const ok = /^\S+@\S+\.\S+$/.test($('#email').value.trim());
  $('#newsMsg').textContent = ok ? '¡Listo! Revisa tu correo para confirmar la suscripción.' : 'Escribe un correo válido, por ejemplo nombre@correo.com'; if (ok) e.target.reset(); };
addEventListener('scroll', () => $('#up').classList.toggle('on', scrollY > 700));
$('#up').onclick = () => scrollTo({top:0, behavior:'smooth'});

/* ===== Conexión con el administrador (CG) ===== */
let _t;
window.CG = {
  get C(){ return C }, set C(v){ C = merge(structuredClone(DEFAULTS), v); },
  fb:null, esc, get, setp, money, bookHTML, miniBG, openModal, toast, renderAll,
  set(path, v){ setp(C, path, v); },
  change(){ clearTimeout(_t); _t = setTimeout(() => { renderAll(); this.saveDraft(); }, 200); },
  saveDraft(){ try { localStorage.setItem('cg_draft', JSON.stringify(C)); } catch { toast('No cupo el borrador: usa imágenes más pequeñas o enlaces'); } }
};

/* ===== Arranque: pinta ya, y luego trae lo publicado ===== */
renderAll();
(async function boot(){
  const cfg = window.FIREBASE_CONFIG, hasDraft = !!localStorage.getItem('cg_draft');
  if (cfg && cfg.apiKey && cfg.projectId){
    try {
      for (const f of ['app','auth','firestore']) await new Promise((ok, no) => { const s = document.createElement('script'); s.src = `https://www.gstatic.com/firebasejs/10.12.2/firebase-${f}-compat.js`; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
      firebase.initializeApp(cfg); CG.fb = {auth:firebase.auth(), db:firebase.firestore()};
    } catch (e) { console.warn('Firebase no cargó', e); }
  }
  let remote = null;
  try { const r = await fetch('content.json?' + Date.now()); if (r.ok) remote = await r.json(); } catch {}
  if (CG.fb) try { const d = await CG.fb.db.doc('site/content').get(); if (d.exists) remote = JSON.parse(d.data().json); } catch (e) { console.warn(e); }
  if (remote && !hasDraft){ C = merge(structuredClone(DEFAULTS), remote); renderAll(); }
  CG.isReady = true; document.dispatchEvent(new Event('cg-ready'));
})();
