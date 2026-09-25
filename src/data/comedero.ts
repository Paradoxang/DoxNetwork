import type { Product } from "./catalog";

/**
 * Comedero por gravedad 3,2 L · datos de la landing /comedero.
 *
 * Este producto NO vive en el catálogo: vive en Shopify y se cobra contra
 * entrega. Por eso no pasa por `catalog.ts` ni por `price.ts`, y por eso no
 * lleva tachado, ni escasez, ni contadores de tiempo.
 *
 * Desde el 25-sep-2026 la landing es un calco de la página de venta del
 * comedero en Shopify (plantilla `product.comedero`, tema DoxNetwork): orden de
 * Santiago, vía Mercurio (docs/ENCARGO-ASTRO-comedero-calco-shopify.md). Todos
 * los textos de `landing` salen tal cual de
 *   C:\tiendas\doxnetworks\templates\product.comedero.json
 * y los medios, de sus assets `dn-cm-*`. Si cambian allí, se cambian aquí.
 *
 * Lo que no se toca: los IDs de variante, el enlace de carrito con UTM y el
 * píxel. La perilla regula la salida (lo confirmó Santiago el 25-09). Las
 * medidas van siempre con «aprox., según el proveedor».
 */

/**
 * Encendido el 23-sep-2026: el producto está ACTIVE en Shopify, la tienda
 * sin contraseña y los enlaces de carrito abren el checkout. Apagarlo
 * devuelve el botón a "Avísame cuando esté" y pone la página en noindex.
 */
export const disponible = true;

export const comedero = {
  nombre: "Comedero por gravedad para perros y gatos · 3,2 L",
  titular: "El plato nunca amanece vacío",
  resumen:
    "El alimento baja solo a medida que tu mascota come. Sin pilas, sin enchufe, sin programar nada.",
  precio: 89900,
  tienda: "yf61aj-nz.myshopify.com",
};

/**
 * Cómo se presenta la línea en el menú «Tienda» (junto a Perfumería, Relojería
 * y Tecnología). No es una LineaId del catálogo a propósito: es un
 * solo producto que vive en Shopify, y meterlo en `lineas.ts` arrastraría
 * conteos, filtros y colecciones que no tiene.
 */
export const lineaMascotas = {
  name: "Mascotas",
  blurb: "Comedero por gravedad, pagas al recibir",
  path: "/comedero",
  hue: "#e2a54b",
  count: 1,
};

/** Portada del producto fuera de la landing (menú, bento, carrito y og:image). */
export const imagenes = {
  portada: "/comedero/portada.webp",
  portadaSm: "/comedero/portada-sm.webp",
  /** Para og:image: JPG, que WhatsApp y Meta lo previsualizan sin fallos. */
  og: "/comedero/portada-og.jpg",
};

/** Muestra de color de la plantilla de Shopify (GRIS:#aeb4bf, AZUL:#8fb2e3, VERDE:#a9d8b5). */
export const colores = [
  { nombre: "Gris", variante: "50416657203234", muestra: "#aeb4bf" },
  { nombre: "Azul", variante: "50416657236002", muestra: "#8fb2e3" },
  { nombre: "Verde", variante: "50416657268770", muestra: "#a9d8b5" },
] as const;

export type Color = (typeof colores)[number]["nombre"];

const m = (archivo: string) => `/comedero/dn-cm-${archivo}`;

/**
 * La página, sección por sección y en su orden, copiada de la plantilla de
 * Shopify. Los rótulos «Imagen ilustrativa» e «Ilustración» van porque esas
 * fotos son de IA o infografías, no de la unidad.
 */
export const landing = {
  oferta: {
    kicker: "Para perros y gatos · pagas al recibir",
    subtitulo: comedero.resumen,
    checks: [
      "Tanque de 3,2 litros: lo llenas una vez",
      "Funciona por gravedad: nada que se descargue",
      "Para croqueta seca, perros y gatos",
      "Perilla para ajustar la salida a su croqueta",
    ],
    precioNota: "Envío gratis a toda Colombia",
    resenasTexto: "5,0 · 5 reseñas de clientes del proveedor",
    fotos: [
      { src: m("trio.webp"), alt: "Comedero por gravedad en verde, gris y azul", color: "Verde" as Color | undefined, rotulo: "" },
      { src: m("g-perilla.webp"), alt: "Mano ajustando la perilla mientras la croqueta cae al plato", rotulo: "Imagen ilustrativa" },
      { src: m("medidas.webp"), alt: "Medidas aproximadas: 30 cm de alto, 29,5 cm de largo y 16,5 cm de ancho", rotulo: "" },
      { src: m("g-llenado.webp"), alt: "Llenando el tanque con croqueta", rotulo: "Imagen ilustrativa" },
      { src: m("g-perro.webp"), alt: "Perro pequeño comiendo del comedero", rotulo: "Imagen ilustrativa" },
      { src: m("gris.webp"), alt: "Comedero por gravedad gris", color: "Gris" as Color | undefined, rotulo: "" },
      { src: m("azul.webp"), alt: "Comedero por gravedad azul", color: "Azul" as Color | undefined, rotulo: "" },
      {
        src: m("razones.webp"),
        alt: "Cinco razones: 3,2 litros, baja solo cuando come, sin pilas ni app, tanque y plato integrados, tres colores",
        rotulo: "Ilustración",
      },
    ] as { src: string; alt: string; color?: Color; rotulo: string }[],
    packsTitulo: "¿Cuántos quieres?",
    packs: [
      { cantidad: 1, titulo: "1 comedero", detalle: "Para una mascota" },
      { cantidad: 2, titulo: "2 comederos", detalle: "Uno para cada mascota, del mismo color" },
    ],
    boton: "Comprar · pagas al recibir",
    pagos: ["Contra entrega", "Nequi", "Llave Bre-B"],
    entrega: {
      min: 3,
      max: 6,
      festivos: [
        "2026-10-12", "2026-11-02", "2026-11-16", "2026-12-08", "2026-12-25",
        "2027-01-01", "2027-01-11", "2027-03-22", "2027-03-25", "2027-03-26",
      ],
      respaldo: "Llega en 3 a 6 días hábiles",
      nota: "Fecha estimada; la confirma la transportadora según tu ciudad.",
    },
    confianza: ["Te confirmamos por WhatsApp antes de despachar", "Garantía legal y 5 días hábiles de retracto"],
    barra: { texto: "Comprar", nota: "Pagas al recibir" },
    hojaTitulo: "Pídelo ahora",
  },
  dolor: {
    kicker: "¿Te suena?",
    titulo: "El plato vacío no avisa",
    escenas: [
      {
        poster: m("perro-poster.webp"),
        video: m("perro.mp4"),
        alt: "Perro echado junto a un plato vacío",
        titulo: "Llegas y el plato está vacío",
        texto: "Saliste temprano, volviste tarde, y lleva horas esperando. La mirada de reproche te la sabes de memoria.",
      },
      {
        poster: m("llegada-poster.webp"),
        video: m("llegada.mp4"),
        alt: "Mujer saliendo de casa mientras el perro mira el plato vacío",
        titulo: "Te vas el fin de semana",
        texto: "Y toca pedirle el favor a alguien, o dejarle el día entero de comida amontonada en el plato.",
      },
    ],
    cierre: "Lo llenas una vez y el alimento va bajando solo, a medida que se lo come.",
    boton: "Lo quiero",
  },
  mecanismo: {
    kicker: "Cómo funciona",
    titulo: "Lo llenas una vez y él se encarga",
    texto: "No tiene motor ni pilas: la croqueta baja por su propio peso a medida que el plato se vacía.",
    nota: "Esquema del principio: no hay motor, solo gravedad.",
    pasos: [
      { titulo: "Llenas el tanque", texto: "Destapas, echas la croqueta seca y tapas. Caben 3,2 litros.", img: m("paso-llenado.webp"), alt: "Llenando el tanque con croqueta" },
      {
        titulo: "Baja solo cuando come",
        texto: "A medida que el plato se vacía, la gravedad deja caer más. Con la perilla del frente ajustas cuánto se abre la salida, según el tamaño de su croqueta.",
        img: m("paso-perilla.webp"),
        alt: "Perilla que ajusta la salida",
      },
      { titulo: "Come a su ritmo", texto: "Cuando el plato baja, cae más. Sin horarios y sin que tengas que estar pendiente.", img: m("paso-perro.webp"), alt: "Perro comiendo del plato" },
    ],
  },
  calculadora: {
    kicker: "Haz la cuenta",
    titulo: "¿Cuántos días le dura un tanque lleno?",
    rangoTexto: "Lo que come al día",
    gramosMin: 1000,
    gramosMax: 1400,
    minG: 30,
    maxG: 500,
    presets: [
      { nombre: "Gato", gramos: 60 },
      { nombre: "Perro pequeño", gramos: 150 },
      { nombre: "Perro mediano", gramos: 300 },
    ],
    resultadoPre: "Con un tanque lleno le alcanza para unos",
    unidad: "días",
    supuesto:
      "Estimado: un tanque de 3,2 L lleva entre 1 y 1,4 kg de croqueta, según el tamaño del grano. La ración diaria la dice el empaque de su alimento.",
    boton: "Lo quiero",
  },
  videos: {
    kicker: "Míralo funcionar",
    titulo: "Te lo explicamos en 20 segundos",
    sonido: "Toca para oír",
    nota: "Vídeos ilustrativos de Dox Networks Store.",
    lista: [
      { video: m("video-1.mp4"), poster: m("video-1-poster.webp"), titulo: "¿Quién le sirve cuando no estás?", duracion: "0:23" },
      { video: m("video-2.mp4"), poster: m("video-2-poster.webp"), titulo: "Te vas el finde", duracion: "0:21" },
      { video: m("video-3.mp4"), poster: m("video-3-poster.webp"), titulo: "¿Para quién es?", duracion: "0:26" },
    ],
  },
  cifras: {
    kicker: "En datos",
    titulo: "Lo que llega a tu casa",
    nota: "Medidas aproximadas, según el proveedor.",
    lista: [
      { numero: "3,2", unidad: "L", texto: "de tanque: lo llenas una vez" },
      { numero: "30", unidad: "cm", texto: "de alto: cabe en un rincón (aprox.)" },
      { numero: "3–6", unidad: "días", texto: "hábiles hasta tu puerta" },
      { numero: "3", unidad: "", texto: "formas de pago: contra entrega, Nequi o Bre-B" },
    ],
  },
  razones: {
    img: m("razones.webp"),
    alt: "Infografía con las cinco razones",
    rotulo: "Ilustración",
    kicker: "Por qué funciona",
    titulo: "Cinco razones, ningún cable",
    puntos: [
      { titulo: "3,2 litros:", texto: "se llena una vez." },
      { titulo: "Baja solo cuando come:", texto: "es gravedad, sin motor." },
      { titulo: "Sin pilas, sin app, sin enchufe:", texto: "nada que se apague." },
      { titulo: "Tanque y plato integrados:", texto: "una sola pieza en el piso." },
      { titulo: "Gris, azul o verde:", texto: "para perros y gatos." },
    ],
    boton: "Lo quiero",
  },
  gatos: {
    poster: m("gato-poster.webp"),
    video: m("gato.mp4"),
    alt: "Gato comiendo de su plato",
    rotulo: "Imagen ilustrativa",
    kicker: "También para gatos",
    titulo: "Come a su ritmo, cuando quiere",
    texto:
      "Los gatos comen poquito y muchas veces. Con el tanque lleno, cada vez que vuelve al plato encuentra croqueta, sin que tengas que estar pendiente.",
  },
  comparativa: {
    kicker: "Comparado",
    titulo: "Por qué gravedad y no uno programable",
    colA: "Este comedero",
    colB: "Programable",
    img: m("trio.webp"),
    filas: [
      { aspecto: "Cómo sale la comida", a: "Baja sola al comer", b: "Motor con horario", mejor: "igual" },
      { aspecto: "Energía", a: "Ninguna", b: "Pilas o enchufe", mejor: "a" },
      { aspecto: "Se puede desprogramar", a: "No hay nada que programar", b: "Sí, si se va la luz o falla la app", mejor: "a" },
      { aspecto: "Si se va la luz", a: "Sigue igual", b: "Se detiene o hay que reprogramarlo", mejor: "a" },
      { aspecto: "Raciones medidas", a: "No", b: "Sí", mejor: "b" },
      { aspecto: "Lavado", a: "Agua y jabón, sin cables", b: "Con cuidado por la electrónica", mejor: "a" },
    ] as { aspecto: string; a: string; b: string; mejor: "a" | "b" | "igual" }[],
    nota: "Si necesitas raciones medidas u horarios, el programable es lo tuyo. Este no lo hace, y lo decimos.",
  },
  paraQuien: {
    kicker: "Antes de pedir",
    titulo: "Para quién es, y para quién no",
    texto: "Preferimos que lo sepas ahora y no cuando llegue.",
    tituloSi: "Te sirve si…",
    tituloNo: "No te sirve si…",
    si: [
      "Tu mascota come croqueta seca y se regula sola.",
      "Trabajas todo el día o sales el fin de semana.",
      "Quieres algo que no se dañe, sin pilas ni app.",
      "Tienes un gato o un perro pequeño o mediano.",
    ],
    no: [
      "Necesitas raciones medidas u horarios (está a dieta o come sin parar).",
      "Le das comida húmeda o mezclada.",
      "Buscas un dispensador con cámara, app o voz.",
    ],
  },
  garantia: {
    kicker: "Contra entrega",
    titulo: "Pagas cuando lo tienes en la mano",
    texto: "Sin adelantos, sin tarjeta, y el envío va por nuestra cuenta.",
    img: m("pago.webp"),
    alt: "No pagas nada hasta tenerlo en la puerta",
    pasos: [
      { titulo: "Eliges color y pides", texto: "Sin pagar nada por adelantado y sin tarjeta." },
      { titulo: "Te confirmamos por WhatsApp", texto: "Te escribimos para confirmar la dirección y resolver lo que haga falta." },
      { titulo: "Pagas cuando lo recibes", texto: "Le pagas al mensajero. Si prefieres, también por Nequi o Llave Bre-B." },
    ],
    sellos: [
      { titulo: "Envío gratis", texto: "A toda Colombia, incluido en el precio." },
      { titulo: "Garantía legal", texto: "Si llega roto o no es lo que pediste, lo resolvemos." },
      { titulo: "5 días de retracto", texto: "Hábiles desde que lo recibes, como manda la ley." },
    ],
    boton: "Pedir el mío",
  },
  cierre: {
    titulo: "Que no vuelva a amanecer vacío",
    precioNota: "Pagas al recibir · Envío gratis",
    boton: "Elegir color y pedir",
    img: m("cristal.webp"),
    alt: "En caso de plato vacío, romper el cristal",
  },
  saber: {
    kicker: "Sin letra pequeña",
    titulo: "Lo que tienes que saber",
    respuestas: [
      { titulo: "Solo croqueta seca", texto: "Nada húmedo ni mezclado: se apelmaza y atasca la salida." },
      {
        titulo: "Tu mascota decide el ritmo",
        texto: "No mide porciones ni horarios: el alimento baja a medida que se come. Si está a dieta, lo tuyo es un dispensador programable.",
      },
      { titulo: "Se lava con agua y jabón", texto: "Cada vez que lo rellenes. Sécalo bien antes de volver a llenarlo." },
      { titulo: "Pagas al recibir", texto: "Contra entrega al mensajero, o si prefieres por Nequi o Llave Bre-B. No pedimos tarjeta." },
      { titulo: "Llega en 3 a 6 días hábiles", texto: "Te confirmamos por WhatsApp antes de despachar y te pasamos la guía para que lo sigas." },
      { titulo: "Si llega mal, lo resolvemos", texto: "Te cubre la garantía legal y tienes 5 días hábiles de retracto desde que lo recibes." },
    ],
    boton: "Pedir el mío",
  },
};

/**
 * El comedero como `Product`, para que la cesta de la tienda lo entienda:
 * fuera del catálogo (no sale en listados ni en el buscador), un plan por
 * color y físico, así que la cesta lo manda al checkout de Shopify.
 */
export const productoComedero: Product = {
  slug: "comedero-gravedad-3l",
  name: "Comedero por gravedad · 3,2 L",
  category: "mascotas",
  tagline: "Para perros y gatos · contra entrega",
  description: comedero.resumen,
  hue: lineaMascotas.hue,
  plans: colores.map((c) => ({ id: c.nombre.toLowerCase(), tier: c.nombre, duration: "", price: comedero.precio })),
  features: ["Sin pilas ni enchufe", "Solo alimento seco", "Pagas al recibir"],
  image: imagenes.portada,
  fisico: true,
};

/** ID de variante de Shopify para un plan (color) del comedero. */
export const varianteComedero = (planId: string) =>
  colores.find((c) => c.nombre.toLowerCase() === planId)?.variante;

/** Si el producto se apaga (`disponible = false`), el botón pide aviso por WhatsApp. */
export const mensajeAviso = (color?: Color) =>
  `Hola, quiero que me avisen cuando el comedero por gravedad${color ? ` ${color.toLowerCase()}` : ""} esté disponible.`;

/**
 * Enlace directo al checkout de Shopify con la variante y la cantidad («2
 * comederos» es `/cart/<variante>:2`, a precio de lista). Los UTM, fbclid y
 * gclid de la visita viajan con él para que la venta se atribuya a la campaña.
 */
export function enlaceCheckout(variante: string, search = "", cantidad = 1): string {
  const base = `https://${comedero.tienda}/cart/${variante}:${cantidad}`;
  if (!search) return base;
  const entra = new URLSearchParams(search);
  const salen = new URLSearchParams();
  for (const [k, v] of entra) if (k.startsWith("utm_") || k === "fbclid" || k === "gclid") salen.set(k, v);
  const cola = salen.toString();
  return cola ? `${base}?${cola}` : base;
}
