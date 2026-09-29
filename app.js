/* ===== Datos ===== */
const BOOKS = [
  {id:1,t:'Cien años de soledad',a:'Gabriel García Márquez',c:'Novela',p:18.9,r:5,c1:'#0f766e',c2:'#f4b942',top:1,d:'La saga de los Buendía en Macondo, donde lo extraordinario es cotidiano.'},
  {id:2,t:'Pedro Páramo',a:'Juan Rulfo',c:'Novela',p:12.5,o:16.5,r:5,c1:'#7c2d12',c2:'#fdba74',d:'Un hijo viaja a Comala en busca de su padre y encuentra un pueblo de voces.'},
  {id:3,t:'El principito',a:'Antoine de Saint-Exupéry',c:'Clásicos',p:9.9,r:5,c1:'#1e40af',c2:'#fde047',top:1,d:'Un piloto perdido en el desierto conoce a un niño que viene de otro planeta.'},
  {id:4,t:'1984',a:'George Orwell',c:'Clásicos',p:11.9,o:15.9,r:4,c1:'#991b1b',c2:'#111827',top:1,d:'Vigilancia, propaganda y libertad en la distopía más citada del siglo XX.'},
  {id:5,t:'Dune',a:'Frank Herbert',c:'Ciencia ficción',p:16.5,r:5,c1:'#b45309',c2:'#fcd34d',top:1,mes:1,d:'Política, religión y ecología en Arrakis, el único planeta donde nace la especia. Una épica sobre el poder y la supervivencia.'},
  {id:6,t:'Fundación',a:'Isaac Asimov',c:'Ciencia ficción',p:14.2,n:1,r:4,c1:'#4338ca',c2:'#22d3ee',d:'Un matemático predice la caída de un imperio y planea salvar el conocimiento.'},
  {id:7,t:'Sapiens',a:'Yuval Noah Harari',c:'Ciencia',p:21,o:27,r:4,c1:'#047857',c2:'#a7f3d0',top:1,d:'Una historia breve de la humanidad, de los cazadores recolectores a hoy.'},
  {id:8,t:'Cosmos',a:'Carl Sagan',c:'Ciencia',p:17.4,r:5,c1:'#312e81',c2:'#f0abfc',d:'Un recorrido por el universo y por nuestra forma de entenderlo.'},
  {id:9,t:'Clean Code',a:'Robert C. Martin',c:'Tecnología',p:34,r:5,c1:'#0e7490',c2:'#164e63',top:1,d:'Buenas prácticas para escribir código que otras personas puedan leer.'},
  {id:10,t:'Python para todos',a:'Charles Severance',c:'Tecnología',p:19.5,o:26,r:4,c1:'#1d4ed8',c2:'#facc15',d:'Aprende a programar desde cero con ejemplos pequeños y prácticos.'},
  {id:11,t:'Hábitos atómicos',a:'James Clear',c:'Desarrollo',p:19.9,n:1,r:5,c1:'#be185d',c2:'#fbcfe8',top:1,d:'Cambios mínimos que, sumados día a día, transforman tu rutina.'},
  {id:12,t:'La sombra del viento',a:'Carlos Ruiz Zafón',c:'Novela',p:15.8,o:20,r:4,c1:'#581c87',c2:'#c084fc',d:'Un niño descubre en el Cementerio de los Libros Olvidados una obra que cambia su vida.'}
];
const CATS = ['Todos', ...new Set(BOOKS.map(b => b.c))];
const CCOL = {Novela:'#0f766e','Clásicos':'#991b1b','Ciencia ficción':'#4338ca',Ciencia:'#047857','Tecnología':'#0e7490',Desarrollo:'#be185d'};
const FREE_SHIP = 40, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const money = n => '$' + n.toFixed(2);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const state = {cat:'Todos', q:'', sort:'rel', max:40, offer:false, cart:load('cart',{}), favs:load('favs',[]), coupon:load('coupon',false)};
const byId = id => BOOKS.find(b => b.id == id);

/* ===== Componentes ===== */
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const COVER = {img:'portada.png',c1:'#9db4e8',c2:'#dfe7fb'};
const bookHTML = b => `<div class="book" style="--c1:${b.c1};--c2:${b.c2}"><div class="back"></div><div class="spine"></div>
  <div class="cover" style="background:${b.img ? `#fff url(${b.img}) center/88% no-repeat` : `linear-gradient(150deg,${b.c1},${b.c2})`}">${b.img ? '' : `<small>${b.a}</small><b>${b.t}</b><i></i>`}</div></div>`;
const priceHTML = b => `<span class="price">${b.o ? `<s>${money(b.o)}</s>` : ''}${money(b.p)}</span>`;
const cardHTML = (b, i = 0) => `<article class="card" style="animation-delay:${i * 40}ms">
  ${b.o ? `<span class="badge">-${Math.round((1 - b.p / b.o) * 100)}%</span>` : b.n ? '<span class="badge new">Nuevo</span>' : ''}
  <button class="fav ${state.favs.includes(b.id) ? 'on' : ''}" data-fav="${b.id}" aria-label="Favorito">${state.favs.includes(b.id) ? '♥' : '♡'}</button>
  ${bookHTML(b)}<h3>${b.t}</h3><span class="au">${b.a}</span><span class="stars" aria-label="${b.r} de 5">${stars(b.r)}</span>
  ${priceHTML(b)}<div class="row"><button class="view" data-view="${b.id}">Ver más</button><button class="add" data-add="${b.id}">Añadir</button></div></article>`;

/* ===== Hero con parallax ===== */
$('#stage').innerHTML = [[1,'0%','70px','0s',''],[0,'23%','50px','-1.5s','big'],[3,'52%','20px','-3s',''],[9,'75%','160px','-4.5s','']]
  .map(([id,l,t,dl,k]) => `<div class="float ${k}" style="left:${l};top:${t};animation-delay:${dl}">${bookHTML(id ? byId(id) : COVER)}</div>`).join('');
$('#inicio').addEventListener('mousemove', e => {
  const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
  $$('.stage .book').forEach((bk, i) => bk.style.transform = `rotateY(${28 + x * (i + 1) * 24}deg) rotateX(${-y * (i + 1) * 12}deg)`);
});

/* ===== Categorías, más vendidos, libro del mes, promo ===== */
$('#catTiles').innerHTML = CATS.slice(1).map(c => `<button class="tile" data-tile="${c}" style="background:linear-gradient(140deg,${CCOL[c]},#1d1546)"><b>${c}</b><span>${BOOKS.filter(b => b.c === c).length} títulos</span></button>`).join('');
$('#rail').innerHTML = BOOKS.filter(b => b.top).map(cardHTML).join('');
$$('[data-sc]').forEach(b => b.onclick = () => $('#rail').scrollBy({left: b.dataset.sc * 520, behavior:'smooth'}));
const m = BOOKS.find(b => b.mes);
$('#mes').innerHTML = `<div class="turn">${bookHTML(m)}</div><div><span class="tag">Libro del mes</span><h2>${m.t}</h2><span class="au">${m.a} · ${m.c}</span><div class="stars">${stars(m.r)}</div><p>${m.d}</p>${priceHTML(m)}<div class="cta"><button class="btn" data-add="${m.id}">Añadir al carrito</button><button class="btn ghost" style="color:#fff;box-shadow:inset 0 0 0 2px #fff" data-view="${m.id}">Ver detalles</button></div></div>`;
$('#promoBooks').innerHTML = BOOKS.filter(b => b.o).slice(0,3).map(b => `<div class="sm">${bookHTML(b)}</div>`).join('');

/* ===== Contadores y cuenta regresiva ===== */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; io.unobserve(e.target);
  $$('#numbers strong').forEach(el => { const to = +el.dataset.to, t0 = performance.now();
    (function step(t){ const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('es'); if (k < 1) requestAnimationFrame(step); })(t0); });
}), {threshold:.4});
io.observe($('#numbers'));
const end = new Date(); end.setDate(end.getDate() + (7 - end.getDay()) % 7); end.setHours(23,59,59,0);
function tick(){ let s = Math.max(0, (end - new Date()) / 1000 | 0); const u = [['días',86400],['horas',3600],['min',60],['seg',1]];
  $('#count').innerHTML = u.map(([n, v]) => { const x = Math.floor(s / v); s -= x * v; return `<div><b>${String(x).padStart(2,'0')}</b><small>${n}</small></div>`; }).join(''); }
tick(); setInterval(tick, 1000);

/* ===== Catálogo con filtros ===== */
function renderChips(){ $('#chips').innerHTML = CATS.map(c => `<button class="chip ${c === state.cat ? 'on' : ''}" data-c="${c}">${c}</button>`).join(''); }
function renderGrid(){
  const list = BOOKS.filter(b => (state.cat === 'Todos' || b.c === state.cat) && b.p <= state.max && (!state.offer || b.o) &&
    (b.t + ' ' + b.a).toLowerCase().includes(state.q.toLowerCase()));
  const s = {asc:(a,b) => a.p - b.p, desc:(a,b) => b.p - a.p, rate:(a,b) => b.r - a.r}[state.sort]; if (s) list.sort(s);
  $('#found').textContent = `${list.length} ${list.length === 1 ? 'libro encontrado' : 'libros encontrados'}`;
  $('#empty').hidden = list.length > 0;
  $('#grid').innerHTML = list.map(cardHTML).join('');
}
$('#chips').onclick = e => { if (e.target.dataset.c){ state.cat = e.target.dataset.c; renderChips(); renderGrid(); } };
$('#search').oninput = e => { state.q = e.target.value; renderGrid(); };
$('#sort').onchange = e => { state.sort = e.target.value; renderGrid(); };
$('#max').oninput = e => { state.max = +e.target.value; $('#maxOut').textContent = '$' + state.max; renderGrid(); };
$('#onlyOffer').onchange = e => { state.offer = e.target.checked; renderGrid(); };

/* ===== Favoritos ===== */
function toggleFav(id){
  state.favs = state.favs.includes(id) ? state.favs.filter(x => x !== id) : [...state.favs, id];
  localStorage.setItem('favs', JSON.stringify(state.favs)); syncFavs();
  toast(state.favs.includes(id) ? 'Guardado en favoritos' : 'Quitado de favoritos');
}
function syncFavs(){
  $('#favCount').textContent = state.favs.length;
  $$('[data-fav]').forEach(b => { const on = state.favs.includes(+b.dataset.fav); b.classList.toggle('on', on); b.textContent = on ? '♥' : '♡'; });
}
$('#openFav').onclick = () => {
  const l = state.favs.map(byId);
  openModal(`<div class="mb one"><button class="x" aria-label="Cerrar">✕</button><div><h2>Tus favoritos</h2>${l.length ? l.map(b => `<div class="item"><div class="mini" style="background:linear-gradient(150deg,${b.c1},${b.c2})"></div><div><h4>${b.t}</h4><span class="au">${money(b.p)}</span></div><button class="add" style="padding:.4rem .9rem;border-radius:99px" data-add="${b.id}">Añadir</button></div>`).join('') : '<p>Aún no guardas libros. Toca el corazón en cualquier portada.</p>'}</div></div>`);
};

/* ===== Carrito ===== */
const save = () => { localStorage.setItem('cart', JSON.stringify(state.cart)); localStorage.setItem('coupon', JSON.stringify(state.coupon)); renderCart(); };
const totals = () => { const sub = Object.keys(state.cart).reduce((s, id) => s + byId(id).p * state.cart[id], 0), disc = state.coupon ? sub * .15 : 0;
  return {sub, disc, total: sub - disc, ship: sub - disc >= FREE_SHIP || sub === 0 ? 0 : 4.5}; };
function addToCart(id){
  state.cart[id] = (state.cart[id] || 0) + 1; save();
  const b = $('#openCart'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); toast('Añadido: ' + byId(id).t);
}
function renderCart(){
  const ids = Object.keys(state.cart), {sub, disc, total, ship} = totals(), left = Math.max(0, FREE_SHIP - total);
  $('#cartCount').textContent = ids.reduce((s, id) => s + state.cart[id], 0);
  $('#drawer').innerHTML = `<div class="dh"><h2>Tu carrito</h2><button id="closeCart" aria-label="Cerrar">✕</button></div>
  <div class="ship">${left ? `Te faltan <b>${money(left)}</b> para el envío gratis` : '¡Tienes envío gratis!'}<div class="bar"><i style="width:${Math.min(100, total / FREE_SHIP * 100)}%"></i></div></div>
  <div class="dbody">${ids.length ? ids.map(id => { const b = byId(id); return `<div class="item"><div class="mini" style="background:linear-gradient(150deg,${b.c1},${b.c2})"></div>
    <div><h4>${b.t}</h4><div>${money(b.p)}</div><div class="qty"><button data-dec="${id}" aria-label="Quitar uno">−</button><span>${state.cart[id]}</span><button data-inc="${id}" aria-label="Añadir uno">+</button></div></div><button class="rm" data-rm="${id}">Quitar</button></div>`; }).join('') : '<p class="cart-empty">Tu carrito está vacío. Añade un libro del catálogo.</p>'}</div>
  <div class="df"><div class="coupon"><input id="cpn" placeholder="Código de descuento" aria-label="Código de descuento"><button id="applyCpn">Aplicar</button></div>
  <div class="line"><span>Subtotal</span><span>${money(sub)}</span></div>${disc ? `<div class="line"><span>Descuento LEE25</span><span>-${money(disc)}</span></div>` : ''}
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
  if (id === 'applyCpn'){ const v = $('#cpn').value.trim().toUpperCase(); if (v === 'LEE25'){ state.coupon = true; save(); toast('Cupón aplicado: 15% de descuento'); } else toast('Ese código no es válido'); }
  if (id === 'checkout') checkout();
});
$('#openCart').onclick = () => drawer(true);
$('#overlay').onclick = () => drawer(false);

/* ===== Checkout ===== */
function checkout(){
  if (!Object.keys(state.cart).length) return toast('Añade al menos un libro para continuar');
  const {total, ship} = totals();
  openModal(`<div class="mb one"><button class="x" aria-label="Cerrar">✕</button><form id="payForm"><h2>Finalizar compra</h2><p>Total a pagar: <b>${money(total + ship)}</b></p>
  <label>Nombre completo<input required placeholder=" " name="n"></label><label>Correo electrónico<input required type="email" placeholder=" "></label>
  <label>Ciudad<input required placeholder=" "></label><label>Dirección de entrega<input required placeholder=" "></label>
  <button class="btn wide" style="margin-top:1.2rem">Confirmar pedido</button></form></div>`);
  $('#payForm').onsubmit = e => { e.preventDefault(); const n = e.target.n.value.split(' ')[0];
    state.cart = {}; state.coupon = false; save(); $('#modal').hidden = true; drawer(false);
    openModal(`<div class="mb one"><button class="x" aria-label="Cerrar">✕</button><h2>¡Gracias, ${n}!</h2><p>Recibimos tu pedido. Te enviaremos la confirmación y el número de seguimiento por correo.</p><button class="btn wide x2">Seguir explorando</button></div>`); };
}

/* ===== Modal, toast, eventos globales ===== */
function openModal(html){ const el = $('#modal'); el.innerHTML = html; el.hidden = false; }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.classList.contains('x') || e.target.classList.contains('x2')) $('#modal').hidden = true; });
function quickView(id){ const b = byId(id);
  openModal(`<div class="mb"><button class="x" aria-label="Cerrar">✕</button><div class="turn2">${bookHTML(b)}</div><div><h2>${b.t}</h2><span class="au">${b.a} · ${b.c}</span><div class="stars">${stars(b.r)}</div><p>${b.d}</p>${priceHTML(b)}<button class="btn wide" data-add="${b.id}">Añadir al carrito</button></div></div>`); }
document.addEventListener('click', e => {
  const t = e.target.closest('[data-add],[data-view],[data-fav],[data-tile]'); if (!t) return;
  const d = t.dataset;
  if (d.add) addToCart(+d.add); if (d.view) quickView(+d.view); if (d.fav) toggleFav(+d.fav);
  if (d.tile){ state.cat = d.tile; renderChips(); renderGrid(); $('#catalogo').scrollIntoView({behavior:'smooth'}); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape'){ $('#modal').hidden = true; drawer(false); } });
let tm; function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tm); tm = setTimeout(() => t.classList.remove('on'), 2400); }
$('#newsForm').onsubmit = e => { e.preventDefault(); const v = $('#email').value.trim(), ok = /^\S+@\S+\.\S+$/.test(v);
  $('#newsMsg').textContent = ok ? '¡Listo! Revisa tu correo para confirmar la suscripción.' : 'Escribe un correo válido, por ejemplo nombre@correo.com'; if (ok) e.target.reset(); };
addEventListener('scroll', () => $('#up').classList.toggle('on', scrollY > 700));
$('#up').onclick = () => scrollTo({top:0, behavior:'smooth'});

renderChips(); renderGrid(); renderCart(); syncFavs();
