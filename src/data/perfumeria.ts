/**
 * Perfumería: productos físicos, fuera del catálogo digital.
 *
 * Los datos crudos viven en perfumes.ts (generado desde el export del
 * proveedor). Aquí se convierten en `Product` para reutilizar carrito,
 * favoritos, buscador y fichas.
 *
 * PRECIO: `goodsPrice` (price.ts): costo + $30.000, o × 2 si el costo no
 * pasa de $30.000. En perfumes el cliente compara con facilidad y el
 * proveedor publica los mismos productos con las mismas fotos: a costo × 2
 * quedábamos por encima de la competencia (Yara 1.1 en $120.900 frente a
 * $90.000).
 *
 * Sin precio tachado: el "antes" del proveedor no es comprobable (hay
 * errores como $1.600.000 o "antes" menor que el precio).
 */
import type { Product } from "./catalog";
import { goodsPrice } from "./price";
import { perfumeRows } from "./perfumes";

export type Para = "dama" | "hombre" | "unisex";
export type Quality = "1.1" | "AAA";
export type Family = "fresca" | "floral" | "dulce" | "oriental" | "amaderada" | "frutal";

export type PerfumeRow = [
  id: number,
  cost: number,
  name: string,
  brand: string,
  para: Para,
  quality: Quality,
  family: Family | null,
  slug: string,
  photo?: boolean,
];

export interface PerfumeInfo {
  /** Nombre sin la casa: "Sauvage". */
  line: string;
  brand: string;
  para: Para;
  quality: Quality;
  family?: Family;
  kind: "perfume" | "set";
  /** La foto trae fondo propio (no blanco): se muestra entera, sin fundido. */
  photo: boolean;
  supplierId: number;
}

export const paraLabel: Record<Para, string> = { dama: "Para ella", hombre: "Para él", unisex: "Unisex" };

export const qualityInfo: Record<Quality, { label: string; short: string; text: string }> = {
  "1.1": {
    label: "Réplica 1.1",
    short: "1.1",
    text: "La réplica de mayor fidelidad: busca reproducir el aroma y la presentación de la fragancia de referencia.",
  },
  AAA: {
    label: "Réplica AAA",
    short: "AAA",
    text: "La opción más económica, inspirada en la fragancia de referencia.",
  },
};

/** Familias olfativas: orientativas, para filtrar por gusto. */
export const families: Record<Family, { label: string; hue: string; text: string }> = {
  fresca: { label: "Fresca", hue: "#4fb6e8", text: "Limpia y ligera, perfecta de día y en clima cálido." },
  floral: { label: "Floral", hue: "#e58bb5", text: "Flores y suavidad, elegante para cualquier ocasión." },
  dulce: { label: "Dulce", hue: "#e7a35a", text: "Vainilla, caramelo o notas gourmand que envuelven." },
  oriental: { label: "Oriental", hue: "#c9853a", text: "Cálida y especiada, con ámbar u oud; ideal de noche." },
  amaderada: { label: "Amaderada", hue: "#9a7b5c", text: "Maderas y carácter, sobria y con presencia." },
  frutal: { label: "Frutal", hue: "#ef6f6c", text: "Alegre y jugosa, con frutas que se notan desde la salida." },
};

export const perfumeCategory = {
  id: "perfumeria" as const,
  name: "Perfumería",
  blurb: "Réplicas 1.1 y AAA de tus fragancias favoritas",
};

/** TODO: condiciones reales de envío (ciudades, costo y tiempos). */
export const shipping = {
  short: "Envío a toda Colombia",
  detail: "El costo y el tiempo de envío se confirman por WhatsApp según tu ciudad.",
};

export const disclaimer =
  "Vendemos réplicas: no son productos originales de las marcas ni están asociadas a ellas. Los nombres de marca se usan solo como referencia.";

/**
 * Gancho del "stock secreto" (orden de Santiago, 25-sep-2026): muchas
 * fragancias no están en la vitrina y se consiguen con otros proveedores.
 * El mensaje de WhatsApp termina en ": " para que el cliente escriba el
 * nombre, y el encabezado en negrita avisa de dónde viene la consulta.
 */
export const stockSecreto = {
  titulo: "¿No encuentras la que estás buscando?",
  texto: "Pregunta por nuestro stock secreto 😉",
  mensaje: "🤫 *Stock secreto*\nBuenas, quiero preguntar por: ",
};

function toProduct([id, cost, line, brand, para, quality, family, slug, photo]: PerfumeRow): Product {
  const kind = /^(set|kit)\b/i.test(line) ? "set" : "perfume";
  const name = !brand || line.toLowerCase().includes(brand.toLowerCase()) ? line : `${brand} ${line}`;
  const fam = family ? families[family] : undefined;
  const q = qualityInfo[quality];
  const description = [
    kind === "set" ? "Set de fragancias en presentación de regalo." : fam ? `Fragancia ${fam.label.toLowerCase()}: ${fam.text.charAt(0).toLowerCase()}${fam.text.slice(1)}` : "",
    `${q.label}. ${q.text}`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    slug,
    name,
    category: "perfumeria",
    tagline: [brand, paraLabel[para], fam?.label].filter(Boolean).join(" · "),
    description,
    hue: fam?.hue ?? "#b89a6a",
    plans: [{ id: "u", tier: q.label, duration: "", price: goodsPrice(cost, false, "perfumeria"), cost }],
    features: [q.label, shipping.short, "Confirmas tu pedido por WhatsApp"],
    image: `/perfumes/${slug}.webp`,
    perfume: { line, brand, para, quality, family: family ?? undefined, kind, photo: Boolean(photo), supplierId: id },
  };
}

export const perfumes: Product[] = perfumeRows.map(toProduct);

export const isPerfume = (p: Product) => Boolean(p.perfume);

export const perfumeBrands = [...new Set(perfumes.map((p) => p.perfume!.brand).filter(Boolean))].sort((a, b) =>
  a.localeCompare(b, "es")
);

export const perfumeMinPrice = Math.min(...perfumes.map((p) => p.plans[0].price));
