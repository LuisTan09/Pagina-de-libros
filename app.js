/* ===== Datos ===== */
const BOOKS = [
  {id:1,t:'Cien años de soledad',a:'Gabriel García Márquez',c:'Novela',p:18.9,r:5,c1:'#0f766e',c2:'#f4b942',d:'La saga de los Buendía en Macondo, donde lo extraordinario es cotidiano.'},
  {id:2,t:'Pedro Páramo',a:'Juan Rulfo',c:'Novela',p:12.5,r:5,c1:'#7c2d12',c2:'#fdba74',d:'Un hijo viaja a Comala en busca de su padre y encuentra un pueblo de voces.'},
  {id:3,t:'El principito',a:'Antoine de Saint-Exupéry',c:'Clásicos',p:9.9,r:5,c1:'#1e40af',c2:'#fde047',d:'Un piloto perdido en el desierto conoce a un niño que viene de otro planeta.'},
  {id:4,t:'1984',a:'George Orwell',c:'Clásicos',p:11.9,r:4,c1:'#991b1b',c2:'#111827',d:'Vigilancia, propaganda y libertad en la distopía más citada del siglo XX.'},
  {id:5,t:'Dune',a:'Frank Herbert',c:'Ciencia ficción',p:16.5,r:5,c1:'#b45309',c2:'#fcd34d',d:'Política, religión y ecología en Arrakis, el planeta de la especia.'},
  {id:6,t:'Fundación',a:'Isaac Asimov',c:'Ciencia ficción',p:14.2,r:4,c1:'#4338ca',c2:'#22d3ee',d:'Un matemático predice la caída de un imperio y planea salvar el conocimiento.'},
  {id:7,t:'Sapiens',a:'Yuval Noah Harari',c:'Ciencia',p:21.0,r:4,c1:'#047857',c2:'#a7f3d0',d:'Una historia breve de la humanidad, de los cazadores recolectores a hoy.'},
  {id:8,t:'Cosmos',a:'Carl Sagan',c:'Ciencia',p:17.4,r:5,c1:'#312e81',c2:'#f0abfc',d:'Un recorrido por el universo y por nuestra forma de entenderlo.'},
  {id:9,t:'Clean Code',a:'Robert C. Martin',c:'Tecnología',p:34.0,r:5,c1:'#0e7490',c2:'#164e63',d:'Buenas prácticas para escribir código que otras personas puedan leer.'},
  {id:10,t:'Python para todos',a:'Charles Severance',c:'Tecnología',p:19.5,r:4,c1:'#1d4ed8',c2:'#facc15',d:'Aprende a programar desde cero con ejemplos pequeños y prácticos.'},
  {id:11,t:'Hábitos atómicos',a:'James Clear',c:'Desarrollo',p:19.9,r:5,c1:'#be185d',c2:'#fbcfe8',d:'Cambios mínimos que, sumados día a día, transforman tu rutina.'},
  {id:12,t:'La sombra del viento',a:'Carlos Ruiz Zafón',c:'Novela',p:15.8,r:4,c1:'#581c87',c2:'#c084fc',d:'Un niño descubre en el Cementerio de los Libros Olvidados una obra que cambia su vida.'}
];
const CATS = ['Todos', ...new Set(BOOKS.map(b => b.c))];
const $ = s => document.querySelector(s);
const money = n => '$' + n.toFixed(2);
const state = {cat:'Todos', q:'', sort:'rel', cart: JSON.parse(localStorage.getItem('cart') || '{}')};

/* ===== Libro 3D ===== */
const bookHTML = (b, extra = '') => `
  <div class="book" style="--c1:${b.c1};--c2:${b.c2}${extra}">
    <div class="back"></div><div class="spine"></div>
    <div class="cover" style="background:linear-gradient(150deg,${b.c1},${b.c2})">
      <small>${b.a}</small><b>${b.t}</b><i></i>
    </div>
  </div>`;
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);

/* ===== Hero con parallax ===== */
const heroBooks = [[1,'6%','40px','0s'],[5,'30%','120px','-1.5s'],[3,'54%','20px','-3s'],[9,'74%','150px','-4.5s']];
$('#stage').innerHTML = heroBooks.map(([id,l,t,dl]) =>
  `<div class="float" data-depth="${(Math.random()*20+10).toFixed(0)}" style="left:${l};top:${t};animation-delay:${dl}">${bookHTML(BOOKS.find(b => b.id === id))}</div>`).join('');
$('#inicio').addEventListener('mousemove', e => {
  const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
  document.querySelectorAll('.stage .book').forEach((bk, i) => {
    const k = (i + 1) * 12;
    bk.style.transform = `rotateY(${28 + x * k * 2}deg) rotateX(${-y * k}deg)`;
  });
});

/* ===== Catálogo ===== */
function renderChips(){
  $('#chips').innerHTML = CATS.map(c => `<button class="chip ${c === state.cat ? 'on' : ''}" data-c="${c}">${c}</button>`).join('');
}
function renderGrid(){
  let list = BOOKS.filter(b =>
    (state.cat === 'Todos' || b.c === state.cat) &&
    (b.t + ' ' + b.a).toLowerCase().includes(state.q.toLowerCase()));
  if (state.sort === 'asc') list.sort((a,b) => a.p - b.p);
  if (state.sort === 'desc') list.sort((a,b) => b.p - a.p);
  if (state.sort === 'rate') list.sort((a,b) => b.r - a.r);
  $('#empty').hidden = list.length > 0;
  $('#grid').innerHTML = list.map((b, i) => `
    <article class="card" style="animation-delay:${i * 40}ms">
      ${bookHTML(b)}
      <h3>${b.t}</h3><span class="au">${b.a}</span>
      <span class="stars" aria-label="${b.r} de 5">${stars(b.r)}</span>
      <span class="price">${money(b.p)}</span>
      <div class="row"><button class="view" data-view="${b.id}">Ver más</button><button class="add" data-add="${b.id}">Añadir</button></div>
    </article>`).join('');
}
$('#chips').addEventListener('click', e => { const c = e.target.dataset.c; if (c){ state.cat = c; renderChips(); renderGrid(); } });
$('#search').addEventListener('input', e => { state.q = e.target.value; renderGrid(); });
$('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
document.addEventListener('click', e => {
  const add = e.target.dataset.add, view = e.target.dataset.view;
  if (add) addToCart(+add);
  if (view) openModal(+view);
});

/* ===== Carrito ===== */
function save(){ localStorage.setItem('cart', JSON.stringify(state.cart)); renderCart(); }
function addToCart(id){
  state.cart[id] = (state.cart[id] || 0) + 1; save();
  const btn = $('#openCart'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
  toast(`Añadido: ${BOOKS.find(b => b.id === id).t}`);
}
function renderCart(){
  const ids = Object.keys(state.cart);
  $('#cartCount').textContent = ids.reduce((s, id) => s + state.cart[id], 0);
  $('#cartItems').innerHTML = ids.length ? ids.map(id => {
    const b = BOOKS.find(x => x.id == id), q = state.cart[id];
    return `<div class="item">
      <div class="mini" style="background:linear-gradient(150deg,${b.c1},${b.c2})"></div>
      <div><h4>${b.t}</h4><div>${money(b.p)}</div>
        <div class="qty"><button data-dec="${id}" aria-label="Quitar uno">−</button><span>${q}</span><button data-inc="${id}" aria-label="Añadir uno">+</button></div></div>
      <button class="rm" data-rm="${id}">Quitar</button></div>`;
  }).join('') : '<p class="cart-empty">Tu carrito está vacío. Añade un libro del catálogo.</p>';
  $('#cartTotal').textContent = money(ids.reduce((s, id) => s + BOOKS.find(b => b.id == id).p * state.cart[id], 0));
}
$('#cartItems').addEventListener('click', e => {
  const {inc, dec, rm} = e.target.dataset;
  if (inc) state.cart[inc]++;
  if (dec && --state.cart[dec] <= 0) delete state.cart[dec];
  if (rm) delete state.cart[rm];
  if (inc || dec || rm) save();
});
const drawer = on => { $('#drawer').classList.toggle('on', on); $('#overlay').classList.toggle('on', on); };
$('#openCart').onclick = () => drawer(true);
$('#closeCart').onclick = $('#overlay').onclick = () => drawer(false);
$('#clearCart').onclick = () => { state.cart = {}; save(); };
$('#checkout').onclick = () => {
  if (!Object.keys(state.cart).length) return toast('Añade al menos un libro para continuar');
  state.cart = {}; save(); drawer(false); toast('¡Gracias por tu compra!');
};

/* ===== Modal ===== */
function openModal(id){
  const b = BOOKS.find(x => x.id === id), m = $('#modal');
  m.innerHTML = `<div class="modal-box">
    <button class="x" aria-label="Cerrar">✕</button>
    <div class="turn">${bookHTML(b)}</div>
    <div><h2>${b.t}</h2><span class="au">${b.a} · ${b.c}</span>
      <div class="stars">${stars(b.r)}</div><p>${b.d}</p>
      <div class="price">${money(b.p)}</div>
      <button class="btn wide" data-add="${b.id}">Añadir al carrito</button></div></div>`;
  m.hidden = false;
}
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.classList.contains('x')) $('#modal').hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape'){ $('#modal').hidden = true; drawer(false); } });

/* ===== Toast ===== */
let tm;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tm); tm = setTimeout(() => t.classList.remove('on'), 2200); }

renderChips(); renderGrid(); renderCart();
