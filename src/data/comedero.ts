/**
 * Comedero por gravedad 3,2 L · datos de la landing /comedero.
 *
 * Este producto NO vive en el catálogo: vive en Shopify y se cobra contra
 * entrega. Por eso no pasa por `catalog.ts` ni por `price.ts`, y por eso no
 * lleva tachado — no hay precio de mercado en Colombia contra el que comparar
 * (lo dice la ficha: un tachado aquí sería inventado entero).
 *
 * Fuente de todo lo de aquí:
 *   productos/comedero-gravedad/FICHA.md          copy, claves y avisos
 *   2-COMUN/taller/shopify/.../comedero-gravedad.json   IDs y precio
 *
 * Lo que la ficha marca con ⚠️ no se escribe como dato hasta pesar la muestra.
 * En particular NO se dice cuántos días dura el alimento: 3,2 L son ~1,3 kg,
 * que para un gato son varios días y para un perro grande uno o dos. Decir
 * "varios días" sería una promesa que no se cumple en media clientela, y lo
 * que la página afirma obliga (Ley 1480).
 */

/**
 * Encendido el 23-sep-2026: el producto está ACTIVE en Shopify, la tienda
 * sin contraseña y los tres enlaces de carrito abren el checkout. Apagarlo
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
 * Imágenes: renders del proveedor (Dropi), no fotos de la unidad. Tres de las
 * cuatro traían rótulos en inglés y cotas quemados; los recortes de aquí
 * salen del trío limpio. Se reemplazan cuando haya fotos de la muestra.
 * Fuente: productos/comedero-gravedad/img-proveedor/ · brand/imagenes/comedero.py
 */
export const imagenes = {
  portada: "/comedero/portada.webp",
  portadaSm: "/comedero/portada-sm.webp",
  /** Para og:image: JPG, que WhatsApp y Meta lo previsualizan sin fallos. */
  og: "/comedero/portada-og.jpg",
  ancho: "/comedero/trio-ancho.webp",
  porColor: { Gris: "/comedero/gris.webp", Azul: "/comedero/azul.webp", Verde: "/comedero/verde.webp" } as const,
};

export const colores = [
  { nombre: "Gris", variante: "50416657203234", hex: "#8b93a8" },
  { nombre: "Azul", variante: "50416657236002", hex: "#4a5bd4" },
  { nombre: "Verde", variante: "50416657268770", hex: "#127a56" },
] as const;

export type Color = (typeof colores)[number]["nombre"];

/** El problema que abre la página, y que es el ángulo del anuncio. */
export const problema = [
  {
    titulo: "Llegas y el plato está vacío",
    texto:
      "Saliste temprano, volviste tarde, y lleva horas esperando. La mirada de reproche te la sabes de memoria.",
  },
  {
    titulo: "Te vas el fin de semana",
    texto:
      "Y toca pedirle el favor a alguien, o dejar el día entero de comida amontonada en el plato.",
  },
];

/** Las tres claves de la ficha: spec, titular y explicación. */
export const claves = [
  {
    spec: "3,2 litros",
    titulo: "Se llena una vez",
    texto:
      "El tanque guarda el alimento y lo va soltando al plato conforme tu mascota come. Cuánto le dura depende de su tamaño y su ración: escríbenos con su peso y te decimos si le sirve.",
  },
  {
    spec: "Sin pilas ni enchufe",
    titulo: "Funciona solo",
    texto:
      "Es gravedad pura. No hay motor, ni batería, ni app: no se descarga, no se desprograma y no se cae con la luz.",
  },
  {
    // Sin medidas a propósito: el render del proveedor dice 28 × 28,5 × 15,5 y
    // la ficha de Dropi 29,5 × 16,5 × 30. Hasta medir la muestra, ninguna.
    spec: "Gris · Azul · Verde",
    titulo: "Cabe en la cocina",
    texto: "Compacto, para un rincón. Tres colores para que combine con lo que ya tienes.",
  },
];

export const ficha = [
  ["Capacidad", "3,2 litros"],
  ["Material", "PP + ABS + PET"],
  ["Colores", "Gris · Azul · Verde"],
  ["Alimentación", "Solo alimento seco (croqueta)"],
  ["Energía", "Ninguna: funciona por gravedad"],
  ["Incluye", "1 comedero (tanque + base con plato)"],
] as const;

/**
 * Van completos y encima del botón, nunca plegados. Son la diferencia entre
 * un cliente que sabe lo que compra y una devolución pagada dos veces (el
 * flete de ida y el de vuelta corren por nuestra cuenta).
 */
export const avisos = [
  {
    titulo: "No es programable",
    texto:
      "No controla porciones ni horarios: el alimento baja a medida que se come. Si tu mascota come sin parar o está a dieta, este no es el indicado.",
  },
  {
    titulo: "Solo alimento seco",
    texto: "Nada húmedo ni mezclado: se atasca y se daña.",
  },
  {
    titulo: "Croqueta grande, pregúntanos antes",
    texto:
      "Si tu croqueta es de las gordas, escríbenos antes de pedir y lo miramos contigo.",
  },
  {
    titulo: "Lávalo cada vez que lo rellenes",
    texto: "Es plástico: agua y jabón, y bien seco antes de volver a llenar.",
  },
  {
    titulo: "Dinos el color",
    texto: "Gris, azul o verde. Se despacha el que elijas mientras haya.",
  },
];

export const pasos = [
  {
    titulo: "Eliges color y pides",
    texto: "Sin pagar nada por adelantado y sin tarjeta.",
  },
  {
    titulo: "Te confirmamos por WhatsApp",
    texto: "Te escribimos para confirmar la dirección y resolver lo que haga falta.",
  },
  {
    titulo: "Pagas cuando lo recibes",
    texto: "Llega en 3 a 6 días hábiles según la ciudad, y le pagas al mensajero.",
  },
];

/** Máximo 6, y todas salen de los avisos o del contraentrega. */
export const faqs = [
  {
    q: "¿Controla las porciones o los horarios?",
    a: "No. Funciona por gravedad: el alimento baja solo a medida que se come, así que tu mascota decide el ritmo. Si necesitas horarios o raciones medidas, lo que buscas es un dispensador programable, que es otro producto y cuesta bastante más.",
  },
  {
    q: "¿Cuánto le dura a mi mascota?",
    a: "Depende del tamaño y de la ración diaria. Escríbenos por WhatsApp con el peso de tu mascota y cuánto come al día, y te decimos si el tanque le sirve antes de que pidas.",
  },
  {
    q: "¿Sirve para comida húmeda o mezclada?",
    a: "No. Solo alimento seco. Lo húmedo se apelmaza, atasca la salida y daña el comedero.",
  },
  {
    q: "Mi perro come croqueta grande, ¿le sirve?",
    a: "Pregúntanos antes de pedir. El tamaño máximo de croqueta que baja sin atascarse lo estamos confirmando, así que preferimos mirarlo contigo que venderte algo que no te va a funcionar.",
  },
  {
    q: "¿Cómo se lava?",
    a: "A mano, con agua y jabón, cada vez que lo rellenes. Sécalo bien antes de volver a echar alimento: la humedad apelmaza la croqueta.",
  },
  {
    q: "¿Cómo pago y cuándo llega?",
    a: "Pagas contra entrega, al mensajero, cuando lo tengas en la mano. Llega en 3 a 6 días hábiles según la ciudad. Antes te escribimos por WhatsApp para confirmar la dirección.",
  },
];

/** El mensaje de la ficha, con el color ya puesto si lo eligió. */
export const mensajeWa = (color?: Color) =>
  `COMEDERO POR GRAVEDAD 3,2 L ($89.900) · ¡Hola Dox! Lo quiero. Color: ${color ?? "___"} · Mi mascota es: ___`;

export const mensajeAviso = (color?: Color) =>
  `COMEDERO POR GRAVEDAD 3,2 L · ¡Hola Dox! Avísame cuando esté disponible. Color que quiero: ${color ?? "___"}`;

/**
 * Enlace al checkout de Shopify con la variante elegida, arrastrando los UTM
 * con los que llegó la visita: si el anuncio de Meta trae `utm_campaign`, la
 * venta tiene que poder atribuirse a esa campaña.
 */
export function enlaceCheckout(variante: string, search = ""): string {
  const base = `https://${comedero.tienda}/cart/${variante}:1`;
  if (!search) return base;
  const entra = new URLSearchParams(search);
  const salen = new URLSearchParams();
  for (const [k, v] of entra) if (k.startsWith("utm_") || k === "fbclid" || k === "gclid") salen.set(k, v);
  const cola = salen.toString();
  return cola ? `${base}?${cola}` : base;
}
