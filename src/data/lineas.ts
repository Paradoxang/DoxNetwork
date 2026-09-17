/**
 * Líneas de la red: digital, perfumería, relojería y tecnología.
 *
 * Aquí viven los metadatos de cada línea (nombre, ruta, color) y los
 * artículos de relojería y tecnología, que llegan crudos en articulos.ts
 * (generado desde el export del proveedor) y se convierten en `Product` para
 * compartir carrito, favoritos, buscador y fichas. No importa catalog.ts en
 * tiempo de ejecución para no crear un ciclo.
 *
 * VAPES: línea restringida (Ley 2354 de 2024: venta solo a mayores de edad y
 * publicidad restringida). No está en `lineaOrder`, así que no aparece en el
 * inicio, el carrusel, los destacados ni el catálogo mezclado; solo tiene su
 * página con verificación de edad y enlaces en el menú y el pie.
 *
 * PRECIO: `goodsPrice` (price.ts), el mismo de perfumería. Sin tachado:
 * el "antes" del proveedor no es comprobable (hay "antes" de $110 o de
 * $1.000.000).
 */
import type { Product } from "./catalog";
import { articuloRows } from "./articulos";
import { vapeRows } from "./vapes";
import { disclaimer, shipping } from "./perfumeria";
import { goodsPrice } from "./price";

export type LineaId = "digital" | "perfumeria" | "relojeria" | "tecnologia" | "vapes";
export type LineaArticulo = "relojeria" | "tecnologia" | "vapes";
export type Condicion = "original" | "replica";
export type SubId = "relojes" | "accesorios" | "smartwatches" | "audio" | "carga" | "gaming" | "soportes" | "hogar" | "otros" | "vapes";

export type ArticuloRow = [
  id: number,
  cost: number,
  name: string,
  brand: string,
  line: LineaArticulo,
  sub: SubId,
  condition: Condicion | null,
  slug: string,
  soldOut?: boolean,
];

export interface ArticuloInfo {
  line: LineaArticulo;
  sub: SubId;
  brand: string;
  condition?: Condicion;
  supplierId: number;
}

export interface Linea {
  id: LineaId;
  name: string;
  blurb: string;
  /** Página propia de la línea. */
  path: string;
  hue: string;
}

export const lineas: Record<LineaId, Linea> = {
  digital: {
    id: "digital",
    name: "Digital",
    blurb: "Streaming, IA, software y gaming por WhatsApp",
    path: "/catalogo?linea=digital",
    hue: "#8fa2ff",
  },
  perfumeria: {
    id: "perfumeria",
    name: "Perfumería",
    blurb: "Réplicas 1.1 y AAA para ella, para él y unisex",
    path: "/perfumeria",
    hue: "#e7a35a",
  },
  relojeria: {
    id: "relojeria",
    name: "Relojería",
    blurb: "Kairos originales y réplicas de alta gama",
    path: "/relojeria",
    hue: "#c9a46a",
  },
  tecnologia: {
    id: "tecnologia",
    name: "Tecnología",
    blurb: "Audio, smartwatches, carga, gaming y gadgets",
    path: "/tecnologia",
    hue: "#5fb8e8",
  },
  vapes: {
    id: "vapes",
    name: "Vapes",
    blurb: "Solo para mayores de 18 años",
    path: "/vapes",
    hue: "#8b93a8",
  },
};

/** Líneas que se muestran y promocionan en toda la tienda. Vapes queda fuera a propósito. */
export const lineaOrder: LineaId[] = ["digital", "perfumeria", "relojeria", "tecnologia"];

/** Advertencia que acompaña a todo producto de vapeo. */
export const vapeWarning =
  "Venta exclusiva para mayores de 18 años. Estos productos pueden contener nicotina, una sustancia adictiva que afecta la salud. No se recomienda su uso a mujeres embarazadas ni a personas que no fuman.";

export const isRestricted = (p: Product) => p.articulo?.line === "vapes";

export const lineaOf = (p: Product): LineaId => (p.perfume ? "perfumeria" : p.articulo ? p.articulo.line : "digital");
export const isPhysical = (p: Product) => Boolean(p.perfume || p.articulo);

export const subLabel: Record<SubId, string> = {
  relojes: "Relojes",
  accesorios: "Accesorios",
  smartwatches: "Smartwatches",
  audio: "Audio",
  carga: "Carga y cables",
  gaming: "Gaming y TV",
  soportes: "Soportes y creadores",
  hogar: "Luces y hogar",
  otros: "Gadgets",
  vapes: "Vapes desechables",
};

const subText: Record<SubId, string> = {
  relojes: "Un reloj para el día a día o para regalar.",
  accesorios: "Accesorio para guardar y exhibir tus relojes.",
  smartwatches: "Notificaciones, actividad y estilo en tu muñeca.",
  audio: "Para tu música, tus llamadas y tu contenido.",
  carga: "Para cargar y conectar tus dispositivos.",
  gaming: "Para jugar y ver en grande.",
  soportes: "Para grabar, trabajar o manejar con el celular a la mano.",
  hogar: "Luz y ambiente para tu espacio.",
  otros: "Un gadget práctico para el día a día.",
  vapes: "Vape desechable, listo para usar.",
};

const subHue: Record<SubId, string> = {
  relojes: "#c9a46a",
  accesorios: "#b89a6a",
  smartwatches: "#7a8cf5",
  audio: "#5fb8e8",
  carga: "#74d8b0",
  gaming: "#e5484d",
  soportes: "#8b93a8",
  hogar: "#f2c46d",
  otros: "#a78bfa",
  vapes: "#8b93a8",
};

export const conditionInfo: Record<Condicion, { label: string; text: string }> = {
  original: { label: "Original", text: "Según el proveedor, es un producto original de su marca." },
  replica: { label: "Réplica", text: disclaimer },
};

function toProduct([id, cost, name, brand, line, sub, condition, slug, soldOut]: ArticuloRow): Product {
  const cond = condition ?? undefined;
  const lineName = lineas[line].name;
  return {
    slug,
    name,
    category: line,
    tagline: [brand, subLabel[sub]].filter(Boolean).join(" · "),
    description: [subText[sub], cond === "original" ? conditionInfo.original.text : cond === "replica" ? "Es una réplica." : ""]
      .filter(Boolean)
      .join(" "),
    hue: subHue[sub],
    plans: [{ id: "u", tier: cond ? conditionInfo[cond].label : lineName, duration: "", price: goodsPrice(cost, cond === "original"), cost }],
    features:
      line === "vapes"
        ? ["Solo mayores de 18 años", shipping.short, "Confirmas tu pedido y tu edad por WhatsApp"]
        : [cond ? conditionInfo[cond].label : subLabel[sub], shipping.short, "Confirmas tu pedido por WhatsApp"],
    image: `/tienda/${slug}.webp`,
    stock: soldOut ? 0 : undefined,
    articulo: { line, sub, brand, condition: cond, supplierId: id },
  };
}

export const articulos: Product[] = [...articuloRows, ...vapeRows].map(toProduct);
export const relojes = articulos.filter((p) => p.articulo!.line === "relojeria");
export const tecnologia = articulos.filter((p) => p.articulo!.line === "tecnologia");
export const vapes = articulos.filter((p) => p.articulo!.line === "vapes");
