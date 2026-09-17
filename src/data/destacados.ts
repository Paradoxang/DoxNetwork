/**
 * Selecciones a mano por línea para el inicio, el menú y las vitrinas.
 * Si un slug deja de existir (cambió el catálogo) simplemente se omite.
 */
import { isAvailable, productBySlug, products, type Product } from "./catalog";
import type { LineaId } from "./lineas";

const pick = (slugs: string[]) => slugs.map((s) => productBySlug(s)).filter((p): p is Product => Boolean(p && isAvailable(p)));

export const destacados: Record<LineaId, Product[]> = {
  digital: products.filter((p) => !p.includes && (p.badge === "popular" || p.featured)).slice(0, 8),
  perfumeria: pick([
    "perfume-lattafa-yara",
    "perfume-dior-sauvage",
    "perfume-carolina-herrera-good-girl",
    "perfume-lattafa-khamrah",
    "perfume-maison-francis-kurkdjian-baccarat-rouge-540",
    "perfume-bleu-de-chanel",
    "perfume-parfums-de-marly-delina",
    "perfume-paco-rabanne-1-million",
  ]),
  relojeria: pick([
    "relojeria-kairos-oficial-seleccion-colombia",
    "relojeria-rolex-submarine-f11",
    "relojeria-patek-philippe-ch5477",
    "relojeria-kairos-mecanico-al8038-900",
    "relojeria-audemars-piguet-royal-oak-ch125",
    "relojeria-kairos-oficial-atletico-nacional",
    "relojeria-hublot-ch1165",
    "relojeria-combo-pareja-cartier-ch1",
  ]),
  tecnologia: pick([
    "tecnologia-parlante-portatil-kimiso-kms-374",
    "tecnologia-smartwatch-mobulaa-ub6-pro",
    "tecnologia-proyector-hy300",
    "tecnologia-airpods-es57",
    "tecnologia-consola-retro-pro-r36s-15-000-juegos",
    "tecnologia-power-bank-30-000-mah-potente",
    "tecnologia-diadema-g-tide-c1",
    "tecnologia-drone-e99-pro-con-camara-full-hd",
  ]),
};

/** Una muestra de toda la red, intercalada: digital, perfume, reloj, tecnología… */
export const destacadosRed: Product[] = (() => {
  const order: LineaId[] = ["digital", "perfumeria", "relojeria", "tecnologia"];
  const out: Product[] = [];
  for (let i = 0; i < 8; i++) for (const id of order) if (destacados[id][i]) out.push(destacados[id][i]);
  return out;
})();

/** Miniatura de un producto para mosaicos pequeños (logo, foto de perfume o de artículo). */
export const thumbOf = (p: Product) => (p.logo ? p.logo : p.image ? (p.perfume || p.articulo ? p.image.replace(/\.webp$/, "-sm.webp") : p.image) : undefined);
