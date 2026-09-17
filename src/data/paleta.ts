/**
 * Paleta de acentos de la tienda.
 *
 * El fondo navy es constante, así que el color lo pone el producto: cada línea
 * y cada categoría digital tiene su tono, y ese tono viaja a la tarjeta (kicker,
 * lecho de la foto y borde), a las baldosas del bento y a los chips. Así una
 * rejilla deja de ser doce cajas del mismo gris.
 *
 * Los tonos están elegidos sobre #0f1424: saturación media y luminosidad alta
 * para que contrasten con el fondo sin pelear con el violeta de la marca.
 */
import type { CategoryId, Product } from "./catalog";
import { lineaOf, lineas } from "./lineas";

export const categoryHue: Partial<Record<CategoryId, string>> = {
  combos: "#9aa9ff", // nebulosa: son la mezcla de todo
  streaming: "#ff7a8a", // rojo suave de las plataformas de series
  "cine-tv": "#f2c46d", // dorado de taquilla
  musica: "#5fd8a4",
  ia: "#b48cff",
  creatividad: "#ef8fd0",
  gaming: "#ff9f5a",
  aprende: "#5fb8e8",
};

/** Tono de acento de un producto: el de su línea, o el de su categoría digital. */
export const accentOf = (p: Product) => {
  const linea = lineaOf(p);
  if (linea !== "digital") return lineas[linea].hue;
  return categoryHue[p.category] ?? lineas.digital.hue;
};

/** Mezcla un acento con transparencia, para fondos y bordes suaves. */
export const tint = (hue: string, pct: number) => `color-mix(in srgb, ${hue} ${pct}%, transparent)`;
