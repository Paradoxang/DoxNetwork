/**
 * Productos con página de venta propia, calcada de su plantilla de Shopify
 * (encargo de Tor, 26-sep-2026: docs/ENCARGO-ASTRO-ventilador-aspiradora.md).
 *
 * La página la pinta `pages/LandingProducto.tsx` desde la plantilla del tema
 * tal cual (`landings/<producto>.json` = templates/product.<producto>.json,
 * solo orden y secciones): los textos no se reescriben aquí. Lo que no está
 * en la plantilla (título del producto, precio, variante, SEO, la tarjeta de
 * la portada) va en este registro.
 *
 * `disponible` los enciende: mientras el producto siga en borrador en Shopify
 * (hasta que Santiago lo vincule en Dropify y Tor anote la variante
 * definitiva en «Activación» del encargo), la página existe pero no se
 * indexa ni se puede comprar, y el producto no sale en la tienda, el
 * buscador ni la portada. Lo mismo hace Shopify con los borradores.
 *
 * Los dos se encendieron el 26-sep-2026: Tor confirmó que están ACTIVOS en
 * Shopify con estas variantes y los carritos probados (ver «Activación»).
 */
import aspiradora from "./landings/aspiradora.json";
import ventilador from "./landings/ventilador.json";
import type { Product } from "./catalog";

/** Una sección de la plantilla de Shopify: tipo, ajustes y bloques. */
export interface SeccionPlantilla {
  type: string;
  settings: Record<string, any>;
  blocks?: Record<string, { type: string; settings: Record<string, any> }>;
  block_order?: string[];
  disabled?: boolean;
}
export interface Plantilla {
  order: string[];
  sections: Record<string, SeccionPlantilla>;
}

export interface ProductoLanding {
  /** = handle en Shopify. */
  slug: string;
  path: string;
  /** Carpeta de sus medios en /public. */
  carpeta: string;
  disponible: boolean;
  /** `product.title` en Shopify: sale debajo del titular. */
  nombre: string;
  precio: number;
  /** ID de variante en Shopify. Provisional hasta la activación. */
  variante: string;
  /** Descuento automático de Shopify al llevar 2 (una vez por pedido), en pesos. */
  segundo?: number;
  sub: "hogar" | "otros";
  tagline: string;
  resumen: string;
  seo: { title: string; description: string };
  /** Foto cuadrada para las tarjetas de la tienda (con -sm y -xs). */
  tarjeta: string;
  plantilla: Plantilla;
  /** La tarjeta de «Productos estrella» en la portada (sección dn-estrellas de Shopify). */
  estrella: { etiqueta: string; titulo: string; gancho: string; nota: string; foto: string; acento: string };
}

export const landings: ProductoLanding[] = [
  {
    slug: "bombillo-ventilador-led",
    path: "/ventilador",
    carpeta: "/ventilador/",
    disponible: true,
    nombre: "Bombillo ventilador LED con control remoto",
    precio: 134900,
    variante: "50587326119970",
    segundo: 40470,
    sub: "hogar",
    tagline: "Hogar · envío gratis",
    resumen: "Ventilador de techo que se enrosca donde va el bombillo. Luz y ventilador por separado, con control remoto.",
    seo: {
      title: "Bombillo ventilador LED con control · envío gratis",
      description:
        "Ventilador de techo que se enrosca donde va el bombillo. Luz y ventilador por separado, con control remoto. Envío gratis; paga con tarjeta, PSE o contra entrega.",
    },
    tarjeta: "/ventilador/tarjeta.webp",
    plantilla: ventilador as Plantilla,
    estrella: {
      etiqueta: "Hogar · nuevo",
      titulo: "Bombillo ventilador con control",
      gancho: "Ventilador de techo sin obra ni electricista: se enrosca donde va el bombillo y lo manejas desde la cama.",
      nota: "o 2 por $229.330 · envío gratis",
      foto: "/ventilador/dn-vt-1.webp",
      acento: "#74d8b0",
    },
  },
  {
    slug: "aspiradora-carro-12v",
    path: "/aspiradora",
    carpeta: "/aspiradora/",
    disponible: true,
    nombre: "Aspiradora para carro 12 V",
    precio: 99900,
    variante: "50587342766114",
    sub: "otros",
    tagline: "Para tu carro · envío gratis",
    resumen: "Se conecta al encendedor del carro: no hay que cargarla. 120 W, cable de 4,5 m, cepillo y boquillas.",
    seo: {
      title: "Aspiradora para carro 12 V · envío gratis",
      description:
        "Se conecta al encendedor del carro: no hay que cargarla. 120 W, cable de 4,5 m, cepillo y boquillas. Envío gratis; paga con tarjeta, PSE o contra entrega.",
    },
    tarjeta: "/aspiradora/tarjeta.webp",
    plantilla: aspiradora as Plantilla,
    estrella: {
      etiqueta: "Para tu carro · nuevo",
      titulo: "Aspiradora para carro 12 V",
      gancho: "Tu carro aspirado sin ir al lavadero: se conecta al encendedor y no hay que cargarla.",
      nota: "Envío gratis · también contra entrega",
      foto: "/aspiradora/dn-ap-1.webp",
      acento: "#9aa9ff",
    },
  },
];

export const landingPorSlug = (slug: string) => landings.find((l) => l.slug === slug);

/**
 * Los encendidos, como `Product`: entran a Tecnología, al buscador, a la cesta
 * y a los favoritos. Sin tachado (el −55 % de vitrina no les aplica) y con su
 * página de venta en vez de la ficha.
 */
export const productosLanding: Product[] = landings
  .filter((l) => l.disponible)
  .map((l) => ({
    slug: l.slug,
    name: l.nombre,
    category: "tecnologia",
    tagline: l.tagline,
    description: l.resumen,
    hue: "#74d8b0",
    plans: [{ id: "u", duration: "", price: l.precio }],
    features: ["Envío gratis a toda Colombia", "Llega en 3 a 6 días hábiles", "También contra entrega"],
    image: l.tarjeta,
    badge: "nuevo",
    featured: true,
    articulo: { line: "tecnologia", sub: l.sub, brand: "", supplierId: 0 },
    landing: l.path,
    contraEntrega: true,
    segundo: l.segundo,
  }));
