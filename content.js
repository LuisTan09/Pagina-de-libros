/* Contenido por defecto de la tienda. El panel de administrador modifica una copia de esto. */
window.DEFAULTS = {
  brand: 'CondeGátula',
  colors: { ink:'#1d1546', teal:'#00a896', sun:'#ffc84a', bg:'#f1eeff' },
  announce: ['Envío gratis desde $40','Devoluciones en 15 días','Pago seguro','Nuevos títulos cada semana'],
  shop: { freeShip:40, shipCost:4.5, coupon:'LEE25', couponPct:15, currency:'$' },
  hero: {
    kicker: 'Librería felina',
    pre: 'Libros para un gato más',
    sub: 'Elige una palabra, pinta al gato a tu gusto y encuentra tu próxima lectura entre más de mil títulos.',
    cta1: 'Explorar catálogo', cta2: 'Ver ofertas',
    hint: 'Elige un color y pinta a tu gato',
    words: [
      {w:'curioso',  mood:'curioso',  fur:'#f2a65a', bg:'#fff0dc'},
      {w:'dormilón', mood:'dormilon', fur:'#9aa5d8', bg:'#e8ecff'},
      {w:'travieso', mood:'travieso', fur:'#6fcf97', bg:'#e3f8ec'},
      {w:'elegante', mood:'elegante', fur:'#3b3b4f', bg:'#f0e6ff'},
      {w:'lector',   mood:'lector',   fur:'#f28fa9', bg:'#ffe4ec'},
      {w:'soñador',  mood:'sonador',  fur:'#7cc6f2', bg:'#dff3ff'}
    ]
  },
  perks: [
    {t:'Envío gratis', s:'En compras desde $40'},
    {t:'Pago seguro', s:'Tarjeta, transferencia o contra entrega'},
    {t:'Devoluciones', s:'15 días sin preguntas'},
    {t:'Soporte real', s:'Lunes a sábado, 8:00 a 18:00'}
  ],
  sections: { cats:'Compra por categoría', top:'Más vendidos', month:'Libro del mes', catalog:'Catálogo completo', reviews:'Lo que dicen nuestros lectores', faq:'Preguntas frecuentes' },
  numbers: [{n:12500,l:'lectores felices'},{n:1200,l:'títulos disponibles'},{n:48,l:'ciudades con entrega'},{n:98,l:'% de reseñas positivas'}],
  promo: { title:'Semana de lectura: hasta 25% de descuento', text:'Usa el código {code} al finalizar tu compra y recibe {pct}% de descuento. La oferta termina en:' },
  quotes: [
    {q:'Llegó en dos días y perfectamente empacado. Ya es mi librería de cabecera.', by:'Camila R. · Manizales'},
    {q:'Encontré ediciones que no veía en ningún lado, y el soporte respondió en minutos.', by:'Andrés M. · Cuenca'},
    {q:'Los descuentos de la semana de lectura son reales. Compré cinco libros por el precio de tres.', by:'Valentina P. · Bogotá'}
  ],
  faq: [
    {q:'¿Cuánto tarda el envío?', a:'Entre 2 y 5 días hábiles según tu ciudad. Recibirás un número de seguimiento por correo.'},
    {q:'¿Puedo devolver un libro?', a:'Sí. Tienes 15 días desde la entrega, siempre que el libro esté en buen estado.'},
    {q:'¿Cómo funciona el código de descuento?', a:'Escríbelo en el carrito antes de finalizar. {code} descuenta {pct}% sobre el total mientras dure la oferta.'},
    {q:'¿Qué medios de pago aceptan?', a:'Tarjeta de crédito o débito, transferencia bancaria y pago contra entrega en ciudades principales.'}
  ],
  news: { title:'Recibe una novedad cada semana', text:'Recomendaciones, lanzamientos y cupones exclusivos. Sin spam.', btn:'Suscribirme' },
  footer: { about:'Librería online independiente. Hecha para quienes leen de todo.', hours:'Lun a sáb, 8:00 a 18:00', email:'hola@condegatula.com', copy:'© 2026 CondeGátula · Proyecto de ejemplo.' },
  books: [
    {id:1,t:'Cien años de soledad',a:'Gabriel García Márquez',c:'Novela',p:18.9,r:5,c1:'#0f766e',c2:'#f4b942',top:1,d:'La saga de los Buendía en Macondo, donde lo extraordinario es cotidiano.'},
    {id:2,t:'Pedro Páramo',a:'Juan Rulfo',c:'Novela',p:12.5,o:16.5,r:5,c1:'#7c2d12',c2:'#fdba74',d:'Un hijo viaja a Comala en busca de su padre y encuentra un pueblo de voces.'},
    {id:3,t:'El principito',a:'Antoine de Saint-Exupéry',c:'Clásicos',p:9.9,r:5,c1:'#1e40af',c2:'#fde047',top:1,d:'Un piloto perdido en el desierto conoce a un niño que viene de otro planeta.'},
    {id:4,t:'1984',a:'George Orwell',c:'Clásicos',p:11.9,o:15.9,r:4,c1:'#991b1b',c2:'#111827',top:1,d:'Vigilancia, propaganda y libertad en la distopía más citada del siglo XX.'},
    {id:5,t:'Dune',a:'Frank Herbert',c:'Ciencia ficción',p:16.5,r:5,c1:'#b45309',c2:'#fcd34d',top:1,mes:1,d:'Política, religión y ecología en Arrakis, el único planeta donde nace la especia.'},
    {id:6,t:'Fundación',a:'Isaac Asimov',c:'Ciencia ficción',p:14.2,n:1,r:4,c1:'#4338ca',c2:'#22d3ee',d:'Un matemático predice la caída de un imperio y planea salvar el conocimiento.'},
    {id:7,t:'Sapiens',a:'Yuval Noah Harari',c:'Ciencia',p:21,o:27,r:4,c1:'#047857',c2:'#a7f3d0',top:1,d:'Una historia breve de la humanidad, de los cazadores recolectores a hoy.'},
    {id:8,t:'Cosmos',a:'Carl Sagan',c:'Ciencia',p:17.4,r:5,c1:'#312e81',c2:'#f0abfc',d:'Un recorrido por el universo y por nuestra forma de entenderlo.'},
    {id:9,t:'Clean Code',a:'Robert C. Martin',c:'Tecnología',p:34,r:5,c1:'#0e7490',c2:'#164e63',top:1,d:'Buenas prácticas para escribir código que otras personas puedan leer.'},
    {id:10,t:'Python para todos',a:'Charles Severance',c:'Tecnología',p:19.5,o:26,r:4,c1:'#1d4ed8',c2:'#facc15',d:'Aprende a programar desde cero con ejemplos pequeños y prácticos.'},
    {id:11,t:'Hábitos atómicos',a:'James Clear',c:'Desarrollo',p:19.9,n:1,r:5,c1:'#be185d',c2:'#fbcfe8',top:1,d:'Cambios mínimos que, sumados día a día, transforman tu rutina.'},
    {id:12,t:'La sombra del viento',a:'Carlos Ruiz Zafón',c:'Novela',p:15.8,o:20,r:4,c1:'#581c87',c2:'#c084fc',d:'Un niño descubre en el Cementerio de los Libros Olvidados una obra que cambia su vida.'}
  ]
};
