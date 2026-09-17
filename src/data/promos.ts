/**
 * Slides del carrusel de promociones del inicio.
 *
 * `image` apunta a /public/promos/. Mientras la imagen no exista, el slide se
 * pinta con su fondo de marca (degradado del tono + órbita) y se ve completo.
 * Cómo generar cada imagen con Nano Banana: docs/brief-imagenes-nano-banana.md
 */
export interface Promo {
  id: string;
  kicker: string;
  title: string;
  text: string;
  cta: { label: string; to: string };
  /** Tono principal del fondo de respaldo. */
  hue: string;
  /** Escritorio y tablet, 21:9. */
  image?: string;
  /** Móvil, 4:5. Si falta, se usa `image` recortada. */
  imageMobile?: string;
}

export const promos: Promo[] = [
  {
    id: "combo-universitario",
    kicker: "Combo de la semana",
    title: "Universitario: IA, diseño e inglés",
    text: "ChatGPT Plus, Canva Pro y Duolingo juntos por $25.900.",
    cta: { label: "Ver combo", to: "/producto/combo-universitario" },
    hue: "#2fb38c",
    image: "/promos/promo-universitario.webp",
    imageMobile: "/promos/promo-universitario-m.webp",
  },
  {
    id: "arma-tu-combo",
    kicker: "Arma tu combo",
    title: "Elige tus plataformas y ahorra hasta 15%",
    text: "El descuento se aplica solo al combinar productos distintos.",
    cta: { label: "Armar mi combo", to: "/arma-tu-combo" },
    hue: "#9aa9ff",
    image: "/promos/promo-arma-tu-combo.webp",
    imageMobile: "/promos/promo-arma-tu-combo-m.webp",
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
    title: "Pines de cine desde $13.900",
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
