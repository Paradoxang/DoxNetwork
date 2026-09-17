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

export const doxServices = [
  {
    title: "Páginas web y landings",
    text: "Sitios responsive para negocios, consultorios y marcas personales.",
  },
  {
    title: "Tiendas online",
    text: "E-commerce con catálogo y compra fácil, como esta tienda.",
  },
  {
    title: "Aplicaciones a medida",
    text: "Sistemas y paneles internos full-stack con .NET, Next.js y SQL Server.",
  },
  {
    title: "Integración de IA",
    text: "Chat-bots y asistentes entrenados para tu negocio.",
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
