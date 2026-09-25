/**
 * Paleta de acentos de la tienda.
 *
 * El fondo navy es constante, así que el color lo pone el producto: cada línea
 * tiene su tono, y ese tono viaja a la tarjeta (kicker,
 * lecho de la foto y borde), a las baldosas del bento y a los chips. Así una
 * rejilla deja de ser doce cajas del mismo gris.
 *
 * Los tonos están elegidos sobre #0f1424: saturación media y luminosidad alta
 * para que contrasten con el fondo sin pelear con el violeta de la marca.
 */
import type { Product } from "./catalog";
import { lineaOf, lineas } from "./lineas";

/** Tono de acento de un producto: el de su línea. */
export const accentOf = (p: Product) => lineas[lineaOf(p)].hue;

/** Mezcla un acento con transparencia, para fondos y bordes suaves. */
export const tint = (hue: string, pct: number) => `color-mix(in srgb, ${hue} ${pct}%, transparent)`;
