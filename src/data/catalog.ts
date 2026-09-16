/**
 * Catálogo. Los precios y planes son de ejemplo: TODO reemplázalos por los de
 * tu proveedor antes de publicar.
 *
 * Para añadir un producto basta con sumar un objeto a `products`; la ruta
 * /producto/<slug> se genera sola en el build.
 */

export type CategoryId =
  | "streaming"
  | "musica"
  | "ia"
  | "software"
  | "diseno"
  | "gaming"
  | "cursos"
  | "recursos";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
}

export const categories: Category[] = [
  { id: "streaming", name: "Streaming", blurb: "Series, películas y deportes" },
  { id: "musica", name: "Música", blurb: "Sin anuncios y sin conexión" },
  { id: "ia", name: "Inteligencia artificial", blurb: "Asistentes y herramientas IA" },
  { id: "software", name: "Software y licencias", blurb: "Oficina, seguridad y VPN" },
  { id: "diseno", name: "Diseño y edición", blurb: "Crea contenido como pro" },
  { id: "gaming", name: "Gaming", blurb: "Suscripciones y recargas" },
  { id: "cursos", name: "Cursos", blurb: "Idiomas y habilidades" },
  { id: "recursos", name: "Plantillas y recursos", blurb: "Listos para usar" },
];

export interface Plan {
  id: string;
  label: string;
  price: number;
  /** Precio de referencia tachado. Si existe, el producto cuenta como oferta. */
  compareAt?: number;
}

export type Badge = "popular" | "nuevo";

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  /** Tono de la miniatura (sin logos de terceros: solo color e iniciales). */
  hue: string;
  plans: Plan[];
  features: string[];
  badge?: Badge;
  featured?: boolean;
  available?: boolean;
}

export const products: Product[] = [
  // ── Streaming ──
  {
    slug: "netflix",
    name: "Netflix",
    category: "streaming",
    tagline: "Pantalla en HD, lista en minutos",
    description:
      "Accede a todo el catálogo de Netflix con tu propio perfil. Te enviamos los datos por WhatsApp apenas confirmamos el pago.",
    hue: "#e5484d",
    plans: [
      { id: "1m", label: "1 pantalla · 1 mes", price: 12900, compareAt: 15000 },
      { id: "3m", label: "1 pantalla · 3 meses", price: 35900, compareAt: 45000 },
    ],
    features: ["Perfil propio con PIN", "Calidad HD", "Soporte durante la vigencia"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "disney-plus",
    name: "Disney+",
    category: "streaming",
    tagline: "Disney, Pixar, Marvel y Star Wars",
    description: "Todo el universo Disney en una sola cuenta, con perfil propio.",
    hue: "#5b7cfa",
    plans: [
      { id: "1m", label: "1 pantalla · 1 mes", price: 9900 },
      { id: "3m", label: "1 pantalla · 3 meses", price: 27900 },
    ],
    features: ["Perfil propio", "Calidad Full HD", "Soporte durante la vigencia"],
    featured: true,
  },
  {
    slug: "max",
    name: "Max",
    category: "streaming",
    tagline: "HBO, Warner y DC",
    description: "Series de HBO, películas de Warner y el universo DC.",
    hue: "#7a5cf5",
    plans: [{ id: "1m", label: "1 pantalla · 1 mes", price: 8900, compareAt: 11000 }],
    features: ["Perfil propio", "Calidad HD", "Soporte durante la vigencia"],
  },
  {
    slug: "prime-video",
    name: "Prime Video",
    category: "streaming",
    tagline: "Originales de Amazon y cine",
    description: "Películas, series originales de Amazon y estrenos.",
    hue: "#2fa4d8",
    plans: [{ id: "1m", label: "1 pantalla · 1 mes", price: 7900 }],
    features: ["Perfil propio", "Calidad HD", "Soporte durante la vigencia"],
  },
  {
    slug: "paramount-plus",
    name: "Paramount+",
    category: "streaming",
    tagline: "Series, películas y realities",
    description: "El catálogo de Paramount, Nickelodeon y más.",
    hue: "#3d6df2",
    plans: [{ id: "1m", label: "1 pantalla · 1 mes", price: 7900 }],
    features: ["Perfil propio", "Calidad HD", "Soporte durante la vigencia"],
  },
  {
    slug: "crunchyroll",
    name: "Crunchyroll",
    category: "streaming",
    tagline: "El anime más grande, sin anuncios",
    description: "Simulcasts de Japón y miles de episodios sin anuncios.",
    hue: "#f5883a",
    plans: [{ id: "1m", label: "Mega Fan · 1 mes", price: 10900 }],
    features: ["Sin anuncios", "Estrenos en simultáneo", "Soporte durante la vigencia"],
    badge: "nuevo",
  },

  // ── Música ──
  {
    slug: "spotify-premium",
    name: "Spotify Premium",
    category: "musica",
    tagline: "Música sin anuncios y sin conexión",
    description: "Escucha sin interrupciones, descarga y salta todas las canciones que quieras.",
    hue: "#3fbf74",
    plans: [
      { id: "1m", label: "Individual · 1 mes", price: 11900 },
      { id: "3m", label: "Individual · 3 meses", price: 32900, compareAt: 36000 },
    ],
    features: ["Sin anuncios", "Descargas sin conexión", "Tu propia cuenta"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "youtube-premium",
    name: "YouTube Premium",
    category: "musica",
    tagline: "YouTube y YouTube Music sin anuncios",
    description: "Videos sin anuncios, reproducción en segundo plano y YouTube Music incluido.",
    hue: "#ef5a5a",
    plans: [{ id: "1m", label: "Individual · 1 mes", price: 14900 }],
    features: ["Sin anuncios", "Segundo plano", "YouTube Music incluido"],
    featured: true,
  },
  {
    slug: "deezer-premium",
    name: "Deezer Premium",
    category: "musica",
    tagline: "Audio en alta calidad",
    description: "Más de 120 millones de canciones con sonido en alta fidelidad.",
    hue: "#a35cf0",
    plans: [{ id: "1m", label: "Individual · 1 mes", price: 9900 }],
    features: ["Sin anuncios", "Alta fidelidad", "Descargas sin conexión"],
  },

  // ── IA ──
  {
    slug: "chatgpt-plus",
    name: "ChatGPT Plus",
    category: "ia",
    tagline: "El asistente de IA sin límites cortos",
    description: "Acceso a los modelos más avanzados, generación de imágenes y análisis de archivos.",
    hue: "#2fb38c",
    plans: [{ id: "1m", label: "1 mes", price: 45000, compareAt: 52000 }],
    features: ["Modelos avanzados", "Imágenes y archivos", "Soporte durante la vigencia"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "gemini-pro",
    name: "Gemini Pro",
    category: "ia",
    tagline: "La IA de Google con 2 TB incluidos",
    description: "Gemini con funciones avanzadas y almacenamiento en Google One.",
    hue: "#5a8cf0",
    plans: [{ id: "1m", label: "1 mes", price: 25000 }],
    features: ["Modelos avanzados", "Almacenamiento incluido", "Integración con Google"],
    badge: "nuevo",
  },
  {
    slug: "perplexity-pro",
    name: "Perplexity Pro",
    category: "ia",
    tagline: "Búsqueda con IA y fuentes citadas",
    description: "Respuestas investigadas con fuentes, búsquedas avanzadas y subida de archivos.",
    hue: "#2aa9b8",
    plans: [{ id: "1m", label: "1 mes", price: 22000 }],
    features: ["Búsquedas Pro", "Fuentes citadas", "Subida de archivos"],
  },

  // ── Software ──
  {
    slug: "microsoft-365",
    name: "Microsoft 365",
    category: "software",
    tagline: "Word, Excel, PowerPoint y 1 TB",
    description: "Las apps de Office siempre actualizadas y 1 TB en OneDrive.",
    hue: "#e8663c",
    plans: [
      { id: "1m", label: "Personal · 1 mes", price: 15900 },
      { id: "12m", label: "Personal · 12 meses", price: 119000, compareAt: 150000 },
    ],
    features: ["Apps de escritorio y móvil", "1 TB en OneDrive", "Tu propia cuenta"],
    featured: true,
  },
  {
    slug: "windows-11-pro",
    name: "Windows 11 Pro",
    category: "software",
    tagline: "Licencia digital permanente",
    description: "Clave de activación para una PC. Incluye guía de activación paso a paso.",
    hue: "#3f8ee8",
    plans: [{ id: "lic", label: "Licencia · 1 PC", price: 39900 }],
    features: ["Activación permanente", "Guía incluida", "Soporte de activación"],
  },
  {
    slug: "vpn-premium",
    name: "VPN Premium",
    category: "software",
    tagline: "Navega privado desde cualquier red",
    description: "Protege tu conexión en redes públicas y navega con privacidad.",
    hue: "#4b6cd6",
    plans: [{ id: "1m", label: "1 mes · 6 dispositivos", price: 14900 }],
    features: ["Hasta 6 dispositivos", "Sin registros", "Servidores en 60+ países"],
  },

  // ── Diseño ──
  {
    slug: "canva-pro",
    name: "Canva Pro",
    category: "diseno",
    tagline: "Plantillas premium y quitafondos",
    description: "Todo Canva sin límites: plantillas, elementos premium, kit de marca y quitafondos.",
    hue: "#27b3c4",
    plans: [
      { id: "1m", label: "1 mes", price: 12900 },
      { id: "12m", label: "12 meses", price: 79000, compareAt: 120000 },
    ],
    features: ["Elementos premium", "Quitafondos", "Kit de marca"],
    badge: "popular",
    featured: true,
  },
  {
    slug: "capcut-pro",
    name: "CapCut Pro",
    category: "diseno",
    tagline: "Edición de video sin marca de agua",
    description: "Efectos, filtros y herramientas de IA para editar video para redes.",
    hue: "#4a4f63",
    plans: [{ id: "1m", label: "1 mes", price: 22000 }],
    features: ["Sin marca de agua", "Efectos premium", "Herramientas IA"],
  },

  // ── Gaming ──
  {
    slug: "xbox-game-pass",
    name: "Xbox Game Pass",
    category: "gaming",
    tagline: "Cientos de juegos por una cuota",
    description: "Juega cientos de títulos en consola, PC y la nube.",
    hue: "#3fae4f",
    plans: [{ id: "1m", label: "Ultimate · 1 mes", price: 49900 }],
    features: ["Consola, PC y nube", "Estrenos desde el día uno", "Multijugador online"],
    featured: true,
  },
  {
    slug: "playstation-plus",
    name: "PlayStation Plus",
    category: "gaming",
    tagline: "Juegos mensuales y online",
    description: "Multijugador online, juegos mensuales y descuentos exclusivos.",
    hue: "#3d6fd6",
    plans: [{ id: "1m", label: "Essential · 1 mes", price: 34900 }],
    features: ["Multijugador online", "Juegos mensuales", "Descuentos exclusivos"],
  },
  {
    slug: "free-fire-diamantes",
    name: "Diamantes Free Fire",
    category: "gaming",
    tagline: "Recarga directa a tu ID",
    description: "Recarga de diamantes directo a tu ID de jugador, sin compartir contraseñas.",
    hue: "#f0a23a",
    plans: [
      { id: "100", label: "100 diamantes", price: 4900 },
      { id: "520", label: "520 diamantes", price: 22900 },
    ],
    features: ["Solo necesitamos tu ID", "Entrega rápida", "Sin compartir contraseña"],
    available: true,
  },

  // ── Cursos ──
  {
    slug: "duolingo-super",
    name: "Duolingo Super",
    category: "cursos",
    tagline: "Aprende idiomas sin anuncios",
    description: "Vidas ilimitadas, sin anuncios y práctica personalizada.",
    hue: "#58c24a",
    plans: [{ id: "1m", label: "1 mes", price: 11900 }],
    features: ["Vidas ilimitadas", "Sin anuncios", "Práctica de errores"],
  },
  {
    slug: "platzi-expert",
    name: "Platzi Expert",
    category: "cursos",
    tagline: "Tecnología, negocios y diseño",
    description: "Acceso a la escuela online de tecnología con certificados.",
    hue: "#7fc241",
    plans: [{ id: "1m", label: "1 mes", price: 45000 }],
    features: ["Todos los cursos", "Certificados", "App móvil"],
    available: false,
  },

  // ── Recursos ──
  {
    slug: "pack-plantillas-instagram",
    name: "Pack plantillas Instagram",
    category: "recursos",
    tagline: "60 plantillas editables en Canva",
    description: "Posts, historias y carruseles listos para tu marca. Se editan en Canva.",
    hue: "#e2679a",
    plans: [{ id: "pack", label: "Pack completo", price: 19900, compareAt: 35000 }],
    features: ["60 diseños", "Editables en Canva", "Acceso de por vida"],
    badge: "nuevo",
  },
  {
    slug: "pagina-web-dox-designs",
    name: "Tu página web",
    category: "recursos",
    tagline: "Diseñada por Dox Designs",
    description:
      "¿Quieres tu propia tienda o landing? La diseñamos y desarrollamos a la medida de tu negocio. Te contactamos para cotizar.",
    hue: "#8fa2ff",
    plans: [{ id: "cot", label: "Cotización sin costo", price: 0 }],
    features: ["Diseño a medida", "Rápida y segura", "Lista para vender"],
  },
];

export const categoryById = (id: string) => categories.find((c) => c.id === id);
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const fromPrice = (p: Product) => Math.min(...p.plans.map((pl) => pl.price));
export const isOnSale = (p: Product) => p.plans.some((pl) => pl.compareAt);
export const isAvailable = (p: Product) => p.available !== false;
export const initials = (name: string) =>
  name
    .replace(/[^\p{L}\p{N}+ ]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
