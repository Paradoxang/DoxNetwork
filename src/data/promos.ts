/**
 * Slides del carrusel de promociones del inicio.
 *
 * `image` apunta a /public/promos/. Mientras la imagen no exista, el slide se
 * pinta con su fondo de marca (degradado del tono + órbita) y se ve completo.
 * Cómo generar cada imagen con Nano Banana: docs/brief-imagenes-nano-banana.md
 */
import { fromPrice, productBySlug, products } from "@/data/catalog";
import { relojes, tecnologia } from "@/data/lineas";
import { perfumeMinPrice, perfumes } from "@/data/perfumeria";
import { formatCOP } from "@/data/site";

const minOf = (list: { plans: { price: number }[] }[]) => Math.min(...list.map((p) => p.plans[0].price));

export interface Promo {
  id: string;
  kicker: string;
  title: string;
  text: string;
  cta: { label: string; to: string };
  /** Tono principal del fondo de respaldo. */
  hue: string;
  /** Escritorio y tablet, banner ~2,37:1 (21:9). */
  image?: string;
  /** Móvil, 4:5. Si falta, se usa `image` recortada. */
  imageMobile?: string;
  /** Sin banner propio: tres productos del catálogo en abanico (slugs). */
  showcase?: string[];
}

export const promos: Promo[] = [
  {
    id: "nuevo-relojeria-tecnologia",
    kicker: "Nuevo en la red",
    title: "Relojería y tecnología con envío a toda Colombia",
    text: `${relojes.length} relojes desde ${formatCOP(minOf(relojes.filter((p) => p.articulo!.sub === "relojes")))} y ${tecnologia.length} productos de tecnología desde ${formatCOP(minOf(tecnologia))}.`,
    cta: { label: "Ver tecnología", to: "/tecnologia" },
    hue: "#5fb8e8",
    showcase: [
      "tecnologia-parlante-portatil-kimiso-kms-374",
      "relojeria-kairos-oficial-seleccion-colombia",
      "tecnologia-smartwatch-mobulaa-ub6-pro",
    ],
  },
  {
    id: "perfumeria",
    kicker: "Perfumería",
    title: "Tu fragancia favorita, en réplica 1.1",
    text: `${perfumes.length} perfumes para ella, para él y unisex desde ${formatCOP(perfumeMinPrice)}.`,
    cta: { label: "Ver perfumería", to: "/perfumeria" },
    hue: "#e7a35a",
    showcase: ["perfume-lattafa-yara", "perfume-dior-sauvage", "perfume-carolina-herrera-good-girl"],
  },
  {
    id: "combo-universitario",
    kicker: "Combo de la semana",
    title: "Universitario: IA, diseño e inglés",
    text: `ChatGPT Plus, Canva Pro y Duolingo juntos por ${formatCOP(fromPrice(productBySlug("combo-universitario")!))}.`,
    cta: { label: "Ver combo", to: "/producto/combo-universitario" },
    hue: "#2fb38c",
    image: "/promos/promo-universitario.webp",
    imageMobile: "/promos/promo-universitario-m.webp",
  },
  {
    id: "fan-del-deporte",
    kicker: "Temporada de fútbol",
    title: "Fan del deporte: todos los partidos",
    text: "DirecTV GO, Paramount+ y Disney+ Premium con ESPN.",
    cta: { label: "Ver combo", to: "/producto/combo-futbolero" },
    hue: "#2f7fd6",
    image: "/promos/promo-futbol.webp",
    imageMobile: "/promos/promo-futbol-m.webp",
  },
  {
    id: "pines-cine",
    kicker: "Plan de fin de semana",
    title: `Pines de cine desde ${formatCOP(Math.min(...products.filter((p) => p.slug.startsWith("pin-")).map(fromPrice)))}`,
    text: "Cine Colombia, Cinemark y Procinal. El código llega en minutos.",
    cta: { label: "Ver pines", to: "/catalogo?categoria=cine-tv" },
    hue: "#d9364a",
    image: "/promos/promo-cine.webp",
    imageMobile: "/promos/promo-cine-m.webp",
  },
];

/**
 * Reseñas reales. La sección solo aparece cuando hay al menos una.
 * TODO: agrega capturas o textos de clientes reales CON su autorización.
 * Los tres estudios coinciden: testimonios genéricos sin nombre ni producto
 * restan confianza en vez de sumarla.
 */
export interface Review {
  name: string;
  city: string;
  product: string;
  text: string;
  /** Captura opcional en /public/reviews/ */
  image?: string;
}

export const reviews: Review[] = [];
