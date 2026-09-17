/**
 * Catálogo de DoxNetwork.
 *
 * CÓMO SE CALCULA EL PRECIO
 * Cada plan guarda `cost`: el precio de proveedor. El precio de venta se
 * calcula solo: cost × MARKUP, redondeado hacia arriba a terminación 900.
 *   · Costo de referencia: Torostream (versión "original"); si Torostream no
 *     tiene la variante, Emprendered. Datos del 16-sep-2026.
 *   · Cuando tengas los costos reales de tu proveedor, cambia solo `cost`.
 *   · Un plan sin costo de referencia lleva `price` fijo y un TODO.
 *
 * Otras reglas (estudios de competencia):
 *   · Escalera por producto: tipo de acceso × calidad × duración.
 *   · Solo se tacha un precio comprobable: el combo frente a la suma de sus
 *     partes y el plan de varios meses frente al mensual × meses (`per`).
 *   · Sin nivel "genérica": cuentas recicladas de origen dudoso.
 *
 * IMÁGENES: `logo` apunta a /public/logos (baldosas de marca del proveedor,
 * brand/imagenes/logos.py). Un plan puede traer su propio `logo` (Disney
 * Estándar/Premium, Spotify 1/3 meses...). La perfumería vive aparte, en
 * perfumeria.ts, y solo se une aquí para carrito, buscador y fichas.
 */

import { articulos, lineas, type ArticuloInfo } from "./lineas";
import { perfumeCategory, perfumes, type PerfumeInfo } from "./perfumeria";
import { down900, up900 } from "./price";

/** Margen sobre el costo de proveedor. 3 = se vende a 3 veces lo que cuesta. */
export const MARKUP = 3;

export type CategoryId =
  | "combos"
  | "streaming"
  | "cine-tv"
  | "musica"
  | "ia"
  | "creatividad"
  | "gaming"
  | "aprende"
  | "perfumeria"
  | "relojeria"
  | "tecnologia";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
}

export const categories: Category[] = [
  { id: "combos", name: "Combos", blurb: "Varias plataformas, un solo precio" },
  { id: "streaming", name: "Series y películas", blurb: "Netflix, Disney+, Max y más" },
  { id: "cine-tv", name: "Cine, TV y deportes", blurb: "Pines de cine y fútbol en vivo" },
  { id: "musica", name: "Música", blurb: "Sin anuncios y sin conexión" },
  { id: "ia", name: "Inteligencia artificial", blurb: "ChatGPT, Gemini y más" },
  { id: "creatividad", name: "Diseño y productividad", blurb: "Canva, CapCut, Office y VPN" },
  { id: "gaming", name: "Gaming", blurb: "Suscripciones y recargas" },
  { id: "aprende", name: "Idiomas y negocio", blurb: "Aprende y haz crecer tu marca" },
];

/** Categorías anunciadas como "Próximamente": dan sensación de catálogo que crece. */
export const upcoming = [{ name: "Gift cards", blurb: "Steam, PlayStation, Google Play" }];

export type Access = "Pantalla" | "Completa";

export interface Plan {
  id: string;
  price: number;
  /** Costo de proveedor. Si existe, `price` se calcula con MARKUP. */
  cost?: number;
  /** Baldosa de marca propia del plan; si no hay, se usa la del producto. */
  logo?: string;
  /** Plan de varios periodos: se tacha contra `n` veces el precio de `plan`. */
  per?: { plan: string; n: number };
  /** Precio comprobable tachado. En combos se calcula solo (suma de partes). */
  compareAt?: number;
  /** Ejes de la escalera. Solo se muestran los que varían dentro del producto. */
  access?: Access;
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
  /** Tono de la miniatura (sin logos de terceros). */
  hue: string;
  plans: Plan[];
  features: string[];
  /** Ficha estándar: lo que el cliente nuevo necesita saber antes de pagar. */
  devices?: string;
  badge?: Badge;
  featured?: boolean;
  /** Unidades disponibles. undefined = no se muestra; 0 = agotado. */
  stock?: number;
  /** Solo combos: qué incluye (producto + plan). */
  includes?: { slug: string; planId: string }[];
  /** Solo combos: a quién va dirigido. */
  forWho?: string;
  /** Imagen propia opcional que cubre la miniatura (ver docs/brief-imagenes-nano-banana.md). */
  image?: string;
  /** Baldosa cuadrada con el logo de la marca, flotando sobre el tono del producto. */
  logo?: string;
  /** Solo perfumería. */
  perfume?: PerfumeInfo;
  /** Solo relojería y tecnología. */
  articulo?: ArticuloInfo;
  /** Solo combos: descuento frente a la suma de sus partes (0.12 = 12%). */
  comboDiscount?: number;
}

/** En los datos, un plan lleva `cost` o `price`; el que falte se calcula. */
type PlanInput = Omit<Plan, "price"> & { price?: number };
type ProductInput = Omit<Product, "plans"> & { plans: PlanInput[] };

const baseInput: ProductInput[] = [
  // ── Series y películas ──
  {
    slug: "netflix",
    logo: "/logos/netflix.webp",
    name: "Netflix",
    category: "streaming",
    tagline: "Tu perfil propio, listo en minutos",
    description:
      "Un perfil para ti dentro de una cuenta Netflix, con PIN para que nadie más lo use. Elige cuántos días lo quieres.",
    hue: "#e5484d",
    plans: [
      { id: "p13", access: "Pantalla", duration: "13 días", cost: 4500 },
      { id: "p30", access: "Pantalla", duration: "30 días", cost: 8600 },
      // Sin costo trimestral de referencia: precio fijo con 10% frente a 3 × el mensual
      { id: "p90", access: "Pantalla", duration: "3 meses", price: 69900, per: { plan: "p30", n: 3 } },
    ],
    devices: "1 dispositivo a la vez",
    features: ["Perfil propio con PIN", "Calidad HD", "Reposición si falla durante la vigencia"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "disney-plus",
    logo: "/logos/disney-estandar.webp",
    name: "Disney+",
    category: "streaming",
    tagline: "Disney, Pixar, Marvel, Star Wars y ESPN",
    description:
      "Todo el universo Disney. Pantalla es un perfil para ti; Completa es la cuenta entera para compartir en casa. Premium suma 4K y ESPN.",
    hue: "#5b7cfa",
    plans: [
      { id: "pe", access: "Pantalla", tier: "Estándar", duration: "30 días", cost: 2500 },
      { id: "pp", access: "Pantalla", tier: "Premium", duration: "30 días", cost: 6500, logo: "/logos/disney-premium.webp" },
      { id: "ce", access: "Completa", tier: "Estándar", duration: "30 días", cost: 9900 },
      { id: "cp", access: "Completa", tier: "Premium", duration: "30 días", cost: 27900, logo: "/logos/disney-premium.webp" },
    ],
    devices: "Pantalla: 1 · Completa: hasta 4",
    features: ["Perfil propio", "Premium: 4K y deportes ESPN", "Reposición si falla durante la vigencia"],
    featured: true,
  },
  {
    slug: "max",
    logo: "/logos/max.webp",
    name: "Max",
    category: "streaming",
    tagline: "HBO, Warner, DC y Discovery",
    description:
      "Las series de HBO y el cine de Warner. Platino sube la calidad a 4K y suma más dispositivos a la vez.",
    hue: "#7a5cf5",
    plans: [
      { id: "pe", access: "Pantalla", tier: "Estándar", duration: "30 días", cost: 3000 },
      { id: "pp", access: "Pantalla", tier: "Platino", duration: "30 días", cost: 4200 },
      { id: "ce", access: "Completa", tier: "Estándar", duration: "30 días", cost: 12000 },
    ],
    devices: "Pantalla: 1 · Completa: hasta 4",
    features: ["Perfil propio", "Platino en 4K", "Reposición si falla durante la vigencia"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "prime-video",
    logo: "/logos/prime-video.webp",
    name: "Prime Video",
    category: "streaming",
    tagline: "Originales de Amazon y estrenos",
    description: "Películas, series originales de Amazon y estrenos de cine.",
    hue: "#2fa4d8",
    plans: [
      { id: "p", access: "Pantalla", duration: "30 días", cost: 3500 },
      { id: "c", access: "Completa", duration: "30 días", cost: 13900 },
    ],
    devices: "Pantalla: 1 · Completa: hasta 3",
    features: ["Perfil propio", "Calidad HD", "Reposición si falla durante la vigencia"],
  },
  {
    slug: "paramount-plus",
    logo: "/logos/paramount.webp",
    name: "Paramount+",
    category: "streaming",
    tagline: "Series, películas y Champions League",
    description: "El catálogo de Paramount, Nickelodeon y fútbol europeo en vivo.",
    hue: "#3d6df2",
    plans: [
      { id: "p", access: "Pantalla", duration: "30 días", cost: 3200 },
      { id: "c", access: "Completa", duration: "30 días", cost: 8900 },
    ],
    devices: "Pantalla: 1 · Completa: hasta 3",
    features: ["Perfil propio", "Deportes en vivo", "Reposición si falla durante la vigencia"],
  },
  {
    slug: "crunchyroll",
    logo: "/logos/crunchyroll.webp",
    name: "Crunchyroll",
    category: "streaming",
    tagline: "El anime más grande, sin anuncios",
    description: "Simulcasts desde Japón y miles de episodios sin anuncios.",
    hue: "#f5883a",
    plans: [
      { id: "p", access: "Pantalla", duration: "30 días", cost: 3900 },
      { id: "c", access: "Completa", duration: "30 días", cost: 8900 },
    ],
    devices: "Pantalla: 1 · Completa: hasta 4",
    features: ["Sin anuncios", "Estrenos en simultáneo con Japón", "Reposición si falla durante la vigencia"],
  },
  {
    slug: "apple-tv",
    logo: "/logos/apple-tv.webp",
    name: "Apple TV+",
    category: "streaming",
    tagline: "Originales premiados de Apple",
    description: "Severance, Ted Lasso y el cine original de Apple.",
    hue: "#8b93a8",
    plans: [
      { id: "p", access: "Pantalla", duration: "30 días", cost: 4900 },
      { id: "c", access: "Completa", duration: "30 días", cost: 8000 },
    ],
    devices: "Pantalla: 1 · Completa: hasta 6",
    features: ["Calidad 4K", "Sin anuncios", "Reposición si falla durante la vigencia"],
  },
  {
    slug: "vix-plus",
    logo: "/logos/vix.webp",
    name: "ViX Premium",
    category: "streaming",
    tagline: "Novelas, series y fútbol en español",
    description: "Contenido en español sin anuncios, novelas y deportes.",
    hue: "#f0a23a",
    plans: [
      { id: "p", access: "Pantalla", duration: "30 días", cost: 2000 },
      { id: "c", access: "Completa", duration: "30 días", cost: 5500 },
    ],
    devices: "Pantalla: 1 · Completa: hasta 3",
    features: ["Sin anuncios", "Todo en español", "Reposición si falla durante la vigencia"],
  },
  {
    slug: "universal-plus",
    name: "Universal+",
    category: "streaming",
    tagline: "Series de Universal, SyFy y E!",
    description: "Series y películas de los canales de Universal.",
    hue: "#4a7fe0",
    plans: [{ id: "p", access: "Pantalla", duration: "30 días", cost: 5000 }],
    devices: "1 dispositivo a la vez",
    features: ["Perfil propio", "Calidad HD", "Reposición si falla durante la vigencia"],
  },
  {
    slug: "mubi",
    name: "MUBI",
    category: "streaming",
    tagline: "Cine de autor seleccionado a mano",
    description: "Cine independiente y de festival, curado por expertos.",
    hue: "#3a3f55",
    plans: [{ id: "p", access: "Pantalla", duration: "30 días", cost: 3500 }],
    devices: "1 dispositivo a la vez",
    features: ["Cine de festival", "Sin anuncios", "Reposición si falla durante la vigencia"],
  },
  {
    slug: "plex",
    logo: "/logos/plex.webp",
    name: "Plex Premium",
    category: "streaming",
    tagline: "Tu videoteca en todas tus pantallas",
    description: "Funciones premium de Plex para ver en cualquier dispositivo.",
    hue: "#e5a00d",
    plans: [
      { id: "p", access: "Pantalla", duration: "30 días", cost: 2000 },
      { id: "c", access: "Completa", duration: "30 días", cost: 6900 },
    ],
    devices: "Pantalla: 1 · Completa: hasta 10",
    features: ["Funciones premium", "Multi-dispositivo", "Reposición si falla durante la vigencia"],
  },

  // ── Cine, TV y deportes ──
  {
    slug: "directv-go",
    logo: "/logos/directv-go.webp",
    name: "DirecTV GO",
    category: "cine-tv",
    tagline: "TV en vivo y fútbol, plan Full",
    description: "Canales en vivo, deportes y Win Sports+ desde el celular o la TV.",
    hue: "#2f7fd6",
    plans: [{ id: "full", access: "Pantalla", tier: "Plan Full", duration: "30 días", cost: 15900 }],
    devices: "1 dispositivo a la vez",
    features: ["Canales en vivo", "Fútbol colombiano", "Reposición si falla durante la vigencia"],
    badge: "nuevo",
    featured: true,
  },
  {
    slug: "claro-video-win",
    logo: "/logos/claro-video-win.webp",
    name: "Claro Video + Win+",
    category: "cine-tv",
    tagline: "Películas y todo el fútbol colombiano",
    description: "Catálogo de Claro Video con el paquete Win+ Fútbol incluido.",
    hue: "#e0463f",
    plans: [{ id: "m", duration: "30 días", cost: 14900 }],
    devices: "1 dispositivo a la vez",
    features: ["Win+ Fútbol incluido", "Películas y series", "Reposición si falla durante la vigencia"],
  },
  {
    slug: "pin-cine-colombia",
    logo: "/logos/cine-colombia-entrada.webp",
    name: "Pin Cine Colombia",
    category: "cine-tv",
    tagline: "Entrada 2D para cualquier función",
    description: "Código digital para redimir en taquilla o en la app de Cine Colombia.",
    hue: "#d9364a",
    plans: [
      { id: "entrada", tier: "Entrada 2D", duration: "Vence en 60 días", cost: 12900 },
      { id: "combo", tier: "Combo confitería", duration: "Vence en 60 días", cost: 14900, logo: "/logos/cine-colombia-confiteria.webp" },
    ],
    devices: "1 código por compra",
    features: ["Código oficial", "Redimible en todo el país", "Llega en minutos"],
    stock: 4, // TODO: ejemplo — pon tu inventario real de pines
  },
  {
    slug: "pin-cinemark",
    logo: "/logos/cinemark-entrada.webp",
    name: "Pin Cinemark",
    category: "cine-tv",
    tagline: "Tu entrada al cine a mejor precio",
    description: "Código digital para Cinemark: entrada 2D o combo de confitería.",
    hue: "#c2413b",
    plans: [
      { id: "entrada", tier: "Entrada 2D", duration: "Vence en 60 días", cost: 12900 },
      { id: "combo", tier: "Combo confitería", duration: "Vence en 60 días", cost: 15900, logo: "/logos/cinemark-confiteria.webp" },
    ],
    devices: "1 código por compra",
    features: ["Código oficial", "Redimible en todo el país", "Llega en minutos"],
    stock: 3, // TODO: ejemplo — pon tu inventario real de pines
  },
  {
    slug: "pin-procinal",
    logo: "/logos/procinal-entrada.webp",
    name: "Pin Procinal",
    category: "cine-tv",
    tagline: "Entrada 2D en salas Procinal",
    description: "Código digital para redimir en cualquier sala Procinal.",
    hue: "#b8434f",
    plans: [{ id: "entrada", tier: "Entrada 2D", duration: "Vence en 60 días", cost: 14900 }],
    devices: "1 código por compra",
    features: ["Código oficial", "Redimible en todo el país", "Llega en minutos"],
  },

  // ── Música ──
  {
    slug: "spotify",
    logo: "/logos/spotify-1-mes.webp",
    name: "Spotify Premium",
    category: "musica",
    tagline: "Música sin anuncios y sin conexión",
    description: "Salta canciones sin límite, descarga para escuchar offline y olvídate de los anuncios.",
    hue: "#3fbf74",
    plans: [
      { id: "1m", duration: "30 días", cost: 5000 },
      { id: "3m", duration: "3 meses", cost: 13500, per: { plan: "1m", n: 3 }, logo: "/logos/spotify-3-meses.webp" },
    ],
    devices: "1 cuenta, escuchas en un dispositivo a la vez",
    features: ["Sin anuncios", "Descargas sin conexión", "Reposición si falla durante la vigencia"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "youtube-premium",
    logo: "/logos/youtube-premium.webp",
    name: "YouTube Premium",
    category: "musica",
    tagline: "YouTube y YouTube Music sin anuncios",
    description: "Videos sin anuncios, reproducción en segundo plano y YouTube Music incluido.",
    hue: "#ef5a5a",
    plans: [
      { id: "1m", duration: "30 días", cost: 6900 },
      // TODO: sin costo trimestral de referencia
      { id: "3m", duration: "3 meses", price: 55900, per: { plan: "1m", n: 3 } },
    ],
    devices: "Tu propia cuenta de Google",
    features: ["Sin anuncios", "Segundo plano", "YouTube Music incluido"],
  },

  // ── IA ──
  {
    slug: "chatgpt",
    logo: "/logos/chatgpt-go.webp",
    name: "ChatGPT",
    category: "ia",
    tagline: "Go para el día a día, Plus para todo",
    description:
      "Go amplía los límites del plan gratis. Plus desbloquea los modelos más avanzados, imágenes, voz y análisis de archivos.",
    hue: "#2fb38c",
    plans: [
      { id: "go", tier: "Go", duration: "30 días", cost: 7000 },
      { id: "plus", tier: "Plus", duration: "30 días", cost: 14900, logo: "/logos/chatgpt-plus.webp" },
    ],
    devices: "Tu propia cuenta",
    features: ["Modelos avanzados", "Imágenes y archivos", "Reposición si falla durante la vigencia"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "gemini-pro",
    logo: "/logos/gemini-pro.webp",
    name: "Gemini Pro",
    category: "ia",
    tagline: "La IA de Google con almacenamiento incluido",
    description: "Gemini con funciones avanzadas y almacenamiento en Google One, sobre tu propio correo.",
    hue: "#5a8cf0",
    plans: [
      { id: "1m", duration: "30 días", cost: 11500 },
      // TODO: sin costo de referencia para 3 y 12 meses
      { id: "3m", duration: "3 meses", price: 94900, per: { plan: "1m", n: 3 } },
      { id: "12m", duration: "12 meses", price: 299900, per: { plan: "1m", n: 12 } },
    ],
    devices: "Tu propia cuenta de Google",
    features: ["Modelos avanzados", "Almacenamiento incluido", "Activación en tu correo"],
    featured: true,
  },

  // ── Diseño y productividad ──
  {
    slug: "canva-pro",
    logo: "/logos/canva.webp",
    name: "Canva Pro",
    category: "creatividad",
    tagline: "Plantillas premium, quitafondos y kit de marca",
    description:
      "Todo Canva sin límites. Por invitación te unimos a un equipo Pro; a tu correo activamos Pro en tu propia cuenta.",
    hue: "#27b3c4",
    plans: [
      { id: "inv45", tier: "Por invitación", duration: "45 días", cost: 2250 },
      { id: "correo30", tier: "A tu correo", duration: "30 días", cost: 2500 },
      { id: "inv12", tier: "Por invitación", duration: "12 meses", cost: 9900 },
    ],
    devices: "Todos tus dispositivos",
    features: ["Elementos premium", "Quitafondos", "Conservas tus diseños"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "capcut-pro",
    logo: "/logos/capcut.webp",
    name: "CapCut Pro",
    category: "creatividad",
    tagline: "Edición de video sin marca de agua",
    description: "Efectos, filtros y herramientas de IA para editar video para redes.",
    hue: "#4a4f63",
    plans: [{ id: "1m", tier: "1 dispositivo", duration: "30 días", cost: 14000 }],
    devices: "1 dispositivo",
    features: ["Sin marca de agua", "Efectos premium", "Herramientas de IA"],
  },
  {
    slug: "microsoft-365",
    name: "Microsoft 365",
    category: "creatividad",
    tagline: "Word, Excel, PowerPoint y 1 TB",
    description: "Las apps de Office siempre actualizadas y almacenamiento en OneDrive por un año.",
    hue: "#e8663c",
    plans: [
      { id: "1d", tier: "1 dispositivo", duration: "12 meses", cost: 9900 },
      { id: "5d", tier: "5 dispositivos", duration: "12 meses", cost: 25500 },
    ],
    devices: "1 o 5 dispositivos",
    features: ["Apps de escritorio y móvil", "1 TB en OneDrive", "Un año completo"],
  },
  {
    slug: "vpn-premium",
    logo: "/logos/hma-vpn.webp",
    name: "VPN Premium",
    category: "creatividad",
    tagline: "HMA VPN: navega privado desde cualquier red",
    description: "Protege tu conexión en redes públicas y navega con privacidad.",
    hue: "#4b6cd6",
    plans: [
      { id: "1d", tier: "1 dispositivo", duration: "30 días", cost: 3200 },
    ],
    devices: "1 dispositivo",
    features: ["Sin registros", "Servidores en 60+ países", "Celular, PC y TV"],
  },

  // ── Gaming ── TODO: los estudios no traen costo de proveedor para gaming.
  // Precio fijo provisional: reemplázalo por `cost` cuando tengas tu proveedor.
  {
    slug: "xbox-game-pass",
    name: "Xbox Game Pass",
    category: "gaming",
    tagline: "Cientos de juegos por una cuota",
    description: "Juega cientos de títulos en consola, PC y la nube.",
    hue: "#3fae4f",
    plans: [{ id: "u1", tier: "Ultimate", duration: "30 días", price: 39900 }],
    devices: "Consola, PC y nube",
    features: ["Estrenos desde el día uno", "Multijugador online", "Código oficial"],
  },
  {
    slug: "playstation-plus",
    name: "PlayStation Plus",
    category: "gaming",
    tagline: "Juegos mensuales y online",
    description: "Multijugador online, juegos mensuales y descuentos exclusivos.",
    hue: "#3d6fd6",
    plans: [{ id: "e1", tier: "Essential", duration: "30 días", price: 29900 }],
    devices: "Tu cuenta de PSN",
    features: ["Multijugador online", "Juegos mensuales", "Código oficial"],
  },
  {
    slug: "free-fire",
    name: "Diamantes Free Fire",
    category: "gaming",
    tagline: "Recarga directa a tu ID",
    description: "Recarga de diamantes directo a tu ID de jugador, sin compartir contraseñas.",
    hue: "#f07a3a",
    plans: [
      { id: "100", tier: "100 diamantes", duration: "Recarga única", price: 4900 },
      { id: "520", tier: "520 diamantes", duration: "Recarga única", price: 19900 },
    ],
    devices: "Solo necesitamos tu ID",
    features: ["Sin compartir contraseña", "Llega en minutos", "Recarga oficial"],
  },

  // ── Idiomas y negocio ──
  {
    slug: "duolingo-super",
    name: "Duolingo Super",
    category: "aprende",
    tagline: "Aprende idiomas sin anuncios",
    description: "Vidas ilimitadas, sin anuncios y práctica de tus errores.",
    hue: "#58c24a",
    plans: [{ id: "1m", duration: "30 días", cost: 1800 }],
    devices: "Tu propia cuenta",
    features: ["Vidas ilimitadas", "Sin anuncios", "Práctica de errores"],
  },
  {
    slug: "pack-plantillas-instagram",
    name: "Pack plantillas Instagram",
    category: "aprende",
    tagline: "60 diseños editables en Canva",
    description: "Posts, historias y carruseles listos para tu marca. Se editan en Canva.",
    hue: "#e2679a",
    plans: [{ id: "pack", tier: "Pack completo", duration: "Acceso de por vida", price: 19900 }],
    devices: "Descarga digital",
    features: ["60 diseños", "Editables en Canva", "Acceso de por vida"],
    badge: "nuevo",
  },
  {
    slug: "pagina-web-dox-designs",
    name: "Tu página web",
    category: "aprende",
    tagline: "Diseñada por Dox Designs",
    description:
      "¿Quieres tu propia tienda o landing? La diseñamos y desarrollamos a la medida de tu negocio. Te escribimos para cotizar.",
    hue: "#8fa2ff",
    plans: [{ id: "cot", tier: "Cotización sin costo", duration: "A la medida", price: 0 }],
    devices: "Web y móvil",
    features: ["Diseño a medida", "Rápida y segura", "Lista para vender"],
  },
];

/**
 * Combos con identidad (la mecánica más fuerte de ZeroDelay). El nombre
 * segmenta solo: el estudiante se reconoce en "Universitario". Su precio se
 * calcula abajo: suma de las partes menos `comboDiscount` (12–15%, nunca más:
 * el valor está en el ticket, no en el descuento), redondeado a 900.
 */
const combosInput: ProductInput[] = [
  {
    slug: "combo-maraton",
    comboDiscount: 0.12,
    image: "/promos/combo-maraton.webp",
    name: "Maratón de series",
    category: "combos",
    forWho: "Para el que ve series todo el fin de semana",
    tagline: "Netflix + Max + Prime Video",
    description: "Las tres plataformas con más series, en pantalla propia por 30 días.",
    hue: "#e5484d",
    includes: [
      { slug: "netflix", planId: "p30" },
      { slug: "max", planId: "pe" },
      { slug: "prime-video", planId: "p" },
    ],
    plans: [{ id: "combo", tier: "Combo", duration: "30 días", price: 0 }],
    features: ["3 plataformas", "Pantallas propias", "Reposición si falla durante la vigencia"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "combo-universitario",
    comboDiscount: 0.15,
    image: "/promos/combo-universitario.webp",
    name: "Universitario",
    category: "combos",
    forWho: "Para estudiar, presentar y practicar idiomas",
    tagline: "ChatGPT Plus + Canva Pro + Duolingo",
    description: "IA para tus trabajos, Canva para tus presentaciones y Duolingo para el inglés.",
    hue: "#2fb38c",
    includes: [
      { slug: "chatgpt", planId: "plus" },
      { slug: "canva-pro", planId: "inv45" },
      { slug: "duolingo-super", planId: "1m" },
    ],
    plans: [{ id: "combo", tier: "Combo", duration: "30 días", price: 0 }],
    features: ["IA, diseño e idiomas", "Tus propias cuentas", "Soporte durante la vigencia"],
    featured: true,
  },
  {
    slug: "combo-creador",
    comboDiscount: 0.14,
    image: "/promos/combo-creador.webp",
    name: "Creador de contenido",
    category: "combos",
    forWho: "Para el que publica todos los días",
    tagline: "CapCut Pro + Canva Pro 12 meses + Spotify",
    description: "Edita video, diseña todo el año y ponle música a tu proceso.",
    hue: "#27b3c4",
    includes: [
      { slug: "capcut-pro", planId: "1m" },
      { slug: "canva-pro", planId: "inv12" },
      { slug: "spotify", planId: "1m" },
    ],
    plans: [{ id: "combo", tier: "Combo", duration: "30 días + Canva 12 meses", price: 0 }],
    features: ["Video, diseño y música", "Canva por un año", "Soporte durante la vigencia"],
  },
  {
    slug: "combo-futbolero",
    comboDiscount: 0.13,
    image: "/promos/combo-futbolero.webp",
    name: "Fan del deporte",
    category: "combos",
    forWho: "Para no perderte ni un partido",
    tagline: "DirecTV GO + Paramount+ + Disney+ Premium",
    description: "Fútbol colombiano, Champions League y ESPN en un solo combo.",
    hue: "#2f7fd6",
    includes: [
      { slug: "directv-go", planId: "full" },
      { slug: "paramount-plus", planId: "p" },
      { slug: "disney-plus", planId: "pp" },
    ],
    plans: [{ id: "combo", tier: "Combo", duration: "30 días", price: 0 }],
    features: ["Fútbol local e internacional", "ESPN incluido", "Reposición si falla durante la vigencia"],
    badge: "nuevo",
    featured: true,
  },
  {
    slug: "combo-familia",
    comboDiscount: 0.14,
    image: "/promos/combo-familia.webp",
    name: "Plan familia",
    category: "combos",
    forWho: "Para compartir en casa con todos",
    tagline: "Disney+ y Max completas + Netflix",
    description: "Dos cuentas completas para toda la familia y una pantalla de Netflix.",
    hue: "#5b7cfa",
    includes: [
      { slug: "disney-plus", planId: "ce" },
      { slug: "max", planId: "ce" },
      { slug: "netflix", planId: "p30" },
    ],
    plans: [{ id: "combo", tier: "Combo", duration: "30 días", price: 0 }],
    features: ["2 cuentas completas", "Perfiles para todos", "Reposición si falla durante la vigencia"],
  },
  {
    slug: "combo-cita-cine",
    comboDiscount: 0.12,
    image: "/promos/combo-cita-cine.webp",
    name: "Cita al cine",
    category: "combos",
    forWho: "Para salir en pareja sin gastar de más",
    tagline: "2 pines Cinemark: entrada + combo",
    description: "Una entrada 2D y una entrada con combo de confitería para ir acompañado.",
    hue: "#c2413b",
    includes: [
      { slug: "pin-cinemark", planId: "entrada" },
      { slug: "pin-cinemark", planId: "combo" },
    ],
    plans: [{ id: "combo", tier: "2 pines", duration: "Vencen en 60 días", price: 0 }],
    features: ["2 códigos oficiales", "Incluye confitería", "Llega en minutos"],
  },
];

function withPrices(input: ProductInput): Product {
  const plans: Plan[] = input.plans.map((pl) => ({
    ...pl,
    price: pl.cost !== undefined ? up900(pl.cost * MARKUP) : pl.price ?? 0,
  }));
  // Tachado de planes de varios periodos: n × el precio del plan de referencia
  for (const pl of plans) {
    const ref = pl.per && plans.find((x) => x.id === pl.per!.plan);
    if (ref && ref.price * pl.per!.n > pl.price) pl.compareAt = ref.price * pl.per!.n;
  }
  return { ...input, plans };
}

const base = baseInput.map(withPrices);
const combos = combosInput.map(withPrices);

/** Catálogo digital: lo que recorren catálogo, combos, categorías y el inicio. */
export const products: Product[] = [...combos, ...base];

/** Toda la red (digital, perfumería, relojería y tecnología): carrito, favoritos, buscador y fichas. */
export const allProducts: Product[] = [...products, ...perfumes, ...articulos];

// ── Utilidades ──

const bySlug = new Map(allProducts.map((p) => [p.slug, p]));

export const categoryById = (id: string): Category | undefined =>
  id === perfumeCategory.id
    ? perfumeCategory
    : id === "relojeria" || id === "tecnologia"
      ? { id, name: lineas[id].name, blurb: lineas[id].blurb }
      : categories.find((c) => c.id === id);
export const productBySlug = (slug: string) => bySlug.get(slug);
export const planOf = (slug: string, planId: string) =>
  productBySlug(slug)?.plans.find((pl) => pl.id === planId);

export const isCombo = (p: Product) => Boolean(p.includes?.length);
export const cheapestPlan = (p: Product) => p.plans.reduce((a, b) => (b.price < a.price ? b : a));
export const fromPrice = (p: Product) => cheapestPlan(p).price;
export const isOnSale = (p: Product) => p.plans.some((pl) => pl.compareAt && pl.compareAt > pl.price);
export const isAvailable = (p: Product) => p.stock !== 0;
export const discountPct = (pl: Plan) =>
  pl.compareAt && pl.compareAt > pl.price ? Math.round((1 - pl.price / pl.compareAt) * 100) : 0;
/** Mayor descuento comprobable del producto (para el badge de la tarjeta). */
export const bestDiscount = (p: Product) => Math.max(0, ...p.plans.map(discountPct));

/** Baldosa de marca del plan, o la del producto. */
export const logoOf = (p: Product, pl?: Plan) => pl?.logo ?? p.logo;

/** Nombre corto del plan a partir de sus ejes: "Pantalla · Premium · 30 días". */
export const planLabel = (pl: Plan) => [pl.access, pl.tier, pl.duration].filter(Boolean).join(" · ");

export const initials = (name: string) =>
  name
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// Combos: precio = suma real de las partes menos su descuento; esa suma es el tachado.
for (const combo of combos) {
  const sum = combo.includes!.reduce((acc, i) => acc + (planOf(i.slug, i.planId)?.price ?? 0), 0);
  for (const pl of combo.plans) {
    pl.price = down900(sum * (1 - (combo.comboDiscount ?? 0.12)));
    if (sum > pl.price) pl.compareAt = sum;
  }
}

/** Precio más bajo de la tienda (sin cotizaciones), para los textos "desde". */
export const minPrice = Math.min(...base.flatMap((p) => p.plans.map((pl) => pl.price)).filter((n) => n > 0));
