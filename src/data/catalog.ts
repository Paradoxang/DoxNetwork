/**
 * Catálogo de DoxNetwork: solo productos físicos.
 *
 * Desde el 25-sep-2026 la tienda no vende nada digital (streaming, IA,
 * software, gaming, pines ni combos): orden de Santiago. Lo que queda es
 * perfumería, relojería, tecnología y vapes, y el foco es la perfumería.
 *
 * Cada línea vive en su propio archivo y aquí solo se juntan para carrito,
 * favoritos, buscador y fichas:
 *   · perfumeria.ts → perfumes (precio con `goodsPrice`, price.ts),
 *   · lineas.ts     → relojería, tecnología y vapes (mismo precio).
 * El comedero de mascotas no está aquí: vive en Shopify con su landing
 * (comedero.ts).
 *
 * Tachado: desde el 22-sep-2026 todo producto se muestra rebajado, porque el
 * proveedor condiciona el suministro a ello. Sale de `DESCUENTO_VISIBLE`
 * (price.ts) y se calcula hacia atrás: no es un precio anterior.
 */

import { articulos, lineas } from "./lineas";
import { perfumeCategory, perfumes, type PerfumeInfo } from "./perfumeria";
import type { ArticuloInfo } from "./lineas";
import { precioLista, type LineaPrecio } from "./price";

export type CategoryId =
  | "perfumeria"
  | "relojeria"
  | "tecnologia"
  | "vapes"
  /** Un solo producto, contra entrega, que vive en Shopify (ver comedero.ts). */
  | "mascotas";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
}

export interface Plan {
  id: string;
  price: number;
  /** Costo de proveedor. La web no lo pinta en ningún sitio. */
  cost?: number;
  /** Precio de lista tachado (ver la cabecera). */
  compareAt?: number;
  /** Etiqueta del plan: calidad del perfume o condición del artículo. */
  tier?: string;
  duration: string;
}

export type Badge = "popular" | "nuevo";

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  /** Tono de la miniatura. */
  hue: string;
  plans: Plan[];
  features: string[];
  badge?: Badge;
  featured?: boolean;
  /** Unidades disponibles. undefined = no se muestra; 0 = agotado. */
  stock?: number;
  /** Foto del producto en /public. */
  image?: string;
  /** Solo perfumería. */
  perfume?: PerfumeInfo;
  /** Solo relojería, tecnología y vapes. */
  articulo?: ArticuloInfo;
  /** Físico sin ficha de artículo ni perfume: se envía igual. Lo usa el comedero. */
  fisico?: true;
}

/** Toda la tienda (perfumería, relojería, tecnología y vapes): carrito, favoritos, buscador y fichas. */
export const allProducts: Product[] = [...perfumes, ...articulos];

// ── Utilidades ──

const bySlug = new Map(allProducts.map((p) => [p.slug, p]));

export const categoryById = (id: string): Category | undefined =>
  id === perfumeCategory.id
    ? perfumeCategory
    : id === "relojeria" || id === "tecnologia" || id === "vapes"
      ? { id, name: lineas[id].name, blurb: lineas[id].blurb }
      : undefined;
export const productBySlug = (slug: string) => bySlug.get(slug);

export const cheapestPlan = (p: Product) => p.plans.reduce((a, b) => (b.price < a.price ? b : a));
export const fromPrice = (p: Product) => cheapestPlan(p).price;
export const isOnSale = (p: Product) => p.plans.some((pl) => pl.compareAt && pl.compareAt > pl.price);
export const isAvailable = (p: Product) => p.stock !== 0;
export const discountPct = (pl: Plan) =>
  pl.compareAt && pl.compareAt > pl.price ? Math.round((1 - pl.price / pl.compareAt) * 100) : 0;
/** Mayor descuento del producto (para el badge de la tarjeta). */
export const bestDiscount = (p: Product) => Math.max(0, ...p.plans.map(discountPct));

/** Nombre corto del plan: la calidad o la condición ("Réplica 1.1", "Original"). */
export const planLabel = (pl: Plan) => [pl.tier, pl.duration].filter(Boolean).join(" · ");

export const initials = (name: string) =>
  name
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/* ── Descuento de vitrina, en todas las líneas ──
   Va al final a propósito: necesita los precios ya calculados. */
for (const p of allProducts) {
  const linea = p.category as LineaPrecio;
  for (const pl of p.plans) {
    if (!pl.price) continue;
    const lista = precioLista(pl.price, linea);
    if (lista > (pl.compareAt ?? 0)) pl.compareAt = lista;
  }
}

/** Precio más bajo de lo que se promociona (sin vapes), para los textos "desde". */
export const minPrice = Math.min(
  ...allProducts.filter((p) => p.category !== "vapes" && isAvailable(p)).map(fromPrice).filter((n) => n > 0)
);
