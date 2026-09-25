import mapa from "../../docs/shopify-variantes.json";
import type { Product } from "@/data/catalog";
import { productoComedero, varianteComedero } from "@/data/comedero";
import { isPhysical } from "@/data/lineas";

/**
 * Cesta → checkout de Shopify.
 *
 * Los productos físicos viven también en Shopify (los carga Mercurio con el
 * export de tools/inventario-shopify.mjs), y su checkout cobra por Nequi o
 * Llave Bre-B. El contra entrega es solo del comedero: una regla de Payfy lo
 * quita en cuanto el carrito lleva algo del catálogo.
 * Shopify admite un enlace de carrito con varias líneas:
 *
 *   https://<tienda>/cart/<idVariante>:<cantidad>,<idVariante>:<cantidad>
 *
 * La regla, acordada el 23-sep-2026: solo si TODO lo que hay en la cesta es
 * físico y está en el mapa, el botón abre ese checkout. Cualquier producto
 * agotado o sin mapa devuelve la cesta a WhatsApp, como siempre: los agotados
 * están en DRAFT allí. (Desde el 25-sep-2026 la tienda no vende nada digital.)
 *
 * El mapa lo exporta Mercurio desde Shopify a docs/shopify-variantes.json
 * (2-COMUN/taller/shopify/exportar-variantes-dox.mjs) y va versionado: el
 * build de Cloudflare compila desde el repo. Solo trae IDs y handles, que son
 * públicos; nada de costos.
 */
export const TIENDA_SHOPIFY: string = mapa.tienda;

type Entrada = { productId: string; handle: string; variantes: Record<string, string> };
const productos = mapa.productos as Record<string, Entrada>;

/** ID numérico de la variante en Shopify, o undefined si no está cargada. */
export function varianteShopify(slug: string, planId: string): string | undefined {
  if (slug === productoComedero.slug) return varianteComedero(planId);
  return productos[slug]?.variantes?.[planId];
}

/**
 * Enlace de carrito con toda la cesta, o null si alguna línea no puede ir a
 * Shopify (y entonces todo el pedido sigue por WhatsApp).
 */
export function enlaceCarritoShopify(
  lines: { slug: string; planId: string; qty: number; product: Product }[]
): string | null {
  if (!lines.length) return null;
  const partes: string[] = [];
  for (const l of lines) {
    if (!isPhysical(l.product) || l.qty <= 0) return null;
    const id = varianteShopify(l.slug, l.planId);
    if (!id) return null;
    partes.push(`${id}:${l.qty}`);
  }
  return `https://${TIENDA_SHOPIFY}/cart/${partes.join(",")}`;
}
