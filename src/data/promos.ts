/**
 * Slides del carrusel de promociones del inicio.
 *
 * `image` apunta a /public/promos/. Mientras la imagen no exista, el slide se
 * pinta con su fondo de marca (degradado del tono + órbita) y se ve completo.
 * Cómo generar cada imagen con Nano Banana: docs/brief-imagenes-nano-banana.md
 */
import { relojes, tecnologia } from "@/data/lineas";
import { perfumeMinPrice, perfumes } from "@/data/perfumeria";
import { formatCOP } from "@/data/site";

const minOf = (list: { plans: { price: number }[] }[]) => Math.min(...list.map((p) => p.plans[0].price));
const sets = perfumes.filter((p) => p.perfume!.kind === "set");
const arabes = perfumes.filter((p) => p.perfume!.brand === "Lattafa" || p.perfume!.brand === "Armaf");

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
    id: "perfumeria",
    kicker: "Perfumería",
    title: "Tu fragancia favorita, en réplica 1.1",
    text: `${perfumes.length} perfumes para ella, para él y unisex desde ${formatCOP(perfumeMinPrice)}.`,
    cta: { label: "Ver perfumería", to: "/perfumeria" },
    hue: "#e7a35a",
    showcase: ["perfume-lattafa-yara", "perfume-dior-sauvage", "perfume-carolina-herrera-good-girl"],
  },
  {
    id: "sets-regalo",
    kicker: "Para regalar",
    title: "Sets y kits de perfume",
    text: `${sets.length} presentaciones de regalo desde ${formatCOP(minOf(sets))}: varias fragancias en una sola caja.`,
    cta: { label: "Ver sets y kits", to: "/perfumeria?para=sets" },
    hue: "#ef8fb8",
    showcase: ["perfume-set-lattafa-yara-x4", "perfume-set-dior-sauvage-miniaturas-x3", "perfume-set-ariana-grande-x3"],
  },
  {
    id: "casas-arabes",
    kicker: "Las más pedidas",
    title: "Lattafa y Armaf, las casas árabes del momento",
    text: `${arabes.length} fragancias de Lattafa y Armaf: Yara, Khamrah, Club de Nuit y más.`,
    cta: { label: "Ver Lattafa", to: "/perfumeria?casa=Lattafa" },
    hue: "#c9a46a",
    showcase: ["perfume-lattafa-khamrah", "perfume-armaf-club-de-nuit-intense-man", "perfume-lattafa-asad-elixir"],
  },
  {
    id: "relojeria-tecnologia",
    kicker: "También en la tienda",
    title: "Relojería y tecnología con envío gratis",
    text: `${relojes.length} relojes desde ${formatCOP(minOf(relojes.filter((p) => p.articulo!.sub === "relojes")))} y ${tecnologia.length} productos de tecnología desde ${formatCOP(minOf(tecnologia))}.`,
    cta: { label: "Ver tecnología", to: "/tecnologia" },
    hue: "#5fb8e8",
    showcase: [
      "tecnologia-parlante-portatil-kimiso-kms-374",
      "relojeria-kairos-oficial-seleccion-colombia",
      "tecnologia-smartwatch-mobulaa-ub6-pro",
    ],
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
