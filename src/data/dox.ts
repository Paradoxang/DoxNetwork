/**
 * Dox Designs: el estudio que hace DoxNetwork. Datos tomados del portafolio
 * (doxdesigns.dev), sin cifras ni clientes inventados.
 */
export const dox = {
  url: "https://doxdesigns.dev",
  projectsUrl: "https://doxdesigns.dev/proyectos",
  servicesUrl: "https://doxdesigns.dev/servicios",
  contactUrl: "https://doxdesigns.dev/contacto",
  whatsappText: "Hola Dox Designs, vengo de DoxNetwork y quiero cotizar una página web para mi negocio.",
};

/** Página propia del servicio en esta tienda (el menú y el inicio llevan aquí). */
export const DOX_PATH = "/paginas-web";

export type DoxServiceId = "web" | "tienda" | "apps" | "ia";

export const doxServices: { id: DoxServiceId; title: string; text: string }[] = [
  {
    id: "web",
    title: "Páginas web y landings",
    text: "Sitios responsive para negocios, consultorios y marcas personales.",
  },
  {
    id: "tienda",
    title: "Tiendas online",
    text: "E-commerce con catálogo y compra fácil, como esta tienda.",
  },
  {
    id: "apps",
    title: "Aplicaciones a medida",
    text: "Sistemas y paneles internos full-stack con .NET, Next.js y SQL Server.",
  },
  {
    id: "ia",
    title: "Integración de IA",
    text: "Chat-bots y asistentes entrenados para tu negocio.",
  },
];

/**
 * Cómo se trabaja, para la página del servicio. TODO (Santiago): revisa que
 * describa tu proceso real; son promesas públicas.
 */
export const doxPasos = [
  { title: "Nos cuentas tu idea", text: "Por WhatsApp: qué vendes, a quién le vendes y qué necesitas que haga tu página." },
  { title: "Te cotizamos", text: "Recibes el alcance, el precio y la fecha de entrega antes de empezar. Sin compromiso." },
  { title: "Diseñamos y construimos", text: "Te mostramos avances y ajustamos contigo hasta que quede como la quieres." },
  { title: "Publicamos", text: "Tu página queda en línea, lista para compartir y para que tus clientes te escriban." },
];

/** Preguntas de la página del servicio. Sin precios ni plazos fijos: van en la cotización. */
export const doxFaqs = [
  {
    q: "¿Cuánto cuesta una página web?",
    a: "Depende de lo que necesites: no cuesta lo mismo una landing que una tienda online o una aplicación. Escríbenos y te cotizamos sin compromiso.",
  },
  {
    q: "¿Cuánto se demora?",
    a: "Depende del alcance. La fecha de entrega va en la cotización, antes de empezar.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Contarnos cómo es tu negocio. Si tienes logo, fotos y textos, mejor; si no, lo vemos juntos.",
  },
  {
    q: "¿Pueden hacer una tienda como esta?",
    a: "Sí. DoxNetwork la diseñó y la programó Dox Designs: catálogo con buscador y filtros, carrito y checkout.",
  },
  {
    q: "¿Dónde están?",
    a: "En Cali, Colombia. Todo se coordina por WhatsApp, así que no importa en qué ciudad esté tu negocio.",
  },
];

/** Cifras reales del portafolio. */
export const doxStats = [
  { value: "25+", label: "Proyectos realizados" },
  { value: "4+", label: "Años construyendo" },
  { value: "C1", label: "Inglés bilingüe" },
];

export interface DoxProject {
  slug: string;
  name: string;
  tag: string;
  stack: string[];
}

/** Poster y video en /public/dox/<slug>.webp y .mp4 */
export const doxProjects: DoxProject[] = [
  { slug: "calidoso", name: "Calidoso · Café", tag: "E-commerce para tienda de café", stack: ["React", "Tailwind"] },
  { slug: "gem-eyes", name: "Gem Eyes", tag: "Sitio de estudio creativo", stack: ["React", "Vite"] },
  { slug: "hotel-marea", name: "Hotel Marea", tag: "Aplicación web full-stack", stack: ["Next.js", "TypeScript"] },
  { slug: "vitalis", name: "Vitalis · Consultorio", tag: "Landing para consultorio médico", stack: ["React", "Tailwind"] },
  { slug: "eco-muestreo", name: "Eco Muestreo · Joyería", tag: "E-commerce para joyería artesanal", stack: ["React", "Tailwind"] },
  { slug: "dr-adrian", name: "Portafolio Dr. Adrián", tag: "Portafolio profesional médico", stack: ["React", "Vercel"] },
];
