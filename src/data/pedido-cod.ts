/**
 * Formulario contra entrega de las páginas de venta (29-sep-2026, orden de
 * Santiago: el «punto 2» del diagnóstico de por qué no vendíamos).
 *
 * Por qué existe: Meta contaba decenas de «pagos iniciados» y Shopify solo
 * guardaba 2 pagos abandonados en todo el período. La gente abría la pantalla
 * de pago de Shopify (otro dominio, correo primero, nueve campos) y se iba sin
 * escribir nada. El formulario pide lo que necesita Dropi para despachar y
 * nada más, sin salir de doxnetworks.com.
 *
 * Este módulo lo comparten la página (components/PedidoContraEntrega.tsx) y el
 * servidor (worker/pedido.ts). No importa nada: el Worker lo empaqueta tal cual.
 */

/** Departamentos con el código que usa Shopify (el mismo del <select> de su checkout). */
export const DEPARTAMENTOS: readonly (readonly [codigo: string, nombre: string])[] = [
  ["AMA", "Amazonas"],
  ["ANT", "Antioquia"],
  ["ARA", "Arauca"],
  ["ATL", "Atlántico"],
  ["DC", "Bogotá D.C."],
  ["BOL", "Bolívar"],
  ["BOY", "Boyacá"],
  ["CAL", "Caldas"],
  ["CAQ", "Caquetá"],
  ["CAS", "Casanare"],
  ["CAU", "Cauca"],
  ["CES", "Cesar"],
  ["CHO", "Chocó"],
  ["COR", "Córdoba"],
  ["CUN", "Cundinamarca"],
  ["GUA", "Guainía"],
  ["GUV", "Guaviare"],
  ["HUI", "Huila"],
  ["LAG", "La Guajira"],
  ["MAG", "Magdalena"],
  ["MET", "Meta"],
  ["NAR", "Nariño"],
  ["NSA", "Norte de Santander"],
  ["PUT", "Putumayo"],
  ["QUI", "Quindío"],
  ["RIS", "Risaralda"],
  ["SAP", "San Andrés y Providencia"],
  ["SAN", "Santander"],
  ["SUC", "Sucre"],
  ["TOL", "Tolima"],
  ["VAC", "Valle del Cauca"],
  ["VAU", "Vaupés"],
  ["VID", "Vichada"],
];

/**
 * «El segundo con 30 % menos», por ID de producto de Shopify. Tiene que decir
 * lo mismo que los descuentos automáticos BXGY de Shopify (comedero
 * 1508755931170, ventilador 1509061885986) y que los packs de cada página
 * (data/comedero.ts y landings/ventilador.json): 30 % de una unidad, una vez
 * por pedido. El servidor rechaza el pedido si el total que vio el cliente no
 * cuadra con esta cuenta, así que una diferencia se nota en el primer pedido
 * en vez de cobrar en la puerta algo distinto de lo que se mostró.
 */
export const SEGUNDO_CON_DESCUENTO: Record<string, number> = {
  "10228175503394": 0.3, // comedero-gravedad-3l
  "10236899262498": 0.3, // bombillo-ventilador-led
};

/** Las páginas ofrecen 1 o 2 unidades. */
export const CANTIDAD_MAX = 2;

/** Lo que manda la página al servidor. */
export interface PedidoEntrada {
  variante: string;
  cantidad: number;
  /** El total que vio el cliente, para comprobarlo. */
  total: number;
  nombre: string;
  celular: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  barrio: string;
  /** utm_*, fbclid y gclid de la visita (lib/atribucion.ts). */
  atribucion: string;
  pagina: string;
  /** Campo trampa: una persona lo deja vacío. */
  web: string;
  /** Milisegundos desde que se abrió el formulario. */
  ms: number;
}

/** 10 dígitos que empiezan por 3, sin +57, espacios ni guiones. */
export const limpiarCelular = (s: string) => s.replace(/\D/g, "").replace(/^57(?=3\d{9}$)/, "");
export const celularValido = (s: string) => /^3\d{9}$/.test(limpiarCelular(s));

/** Nombre y apellido: al menos dos palabras de dos letras. */
export const nombreValido = (s: string) => s.trim().split(/\s+/).filter((p) => p.length >= 2).length >= 2;
