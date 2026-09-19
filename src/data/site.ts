/**
 * Configuración del negocio. Todo lo que cambia sin tocar componentes vive aquí.
 * Revisa cada valor marcado con TODO antes de publicar.
 */
export const site = {
  name: "DoxNetwork",
  url: "https://doxnetworks.com",
  tagline: "Todo lo que usas, en una sola red.",
  description:
    "Streaming, IA y software, perfumería, relojería, tecnología y páginas web a la medida con Dox Designs. Una sola tienda, envíos a toda Colombia, pagos locales y atención de personas por WhatsApp.",

  /** TODO: número de WhatsApp de la tienda, solo dígitos con indicativo. */
  whatsapp: "573189819384",
  whatsappDisplay: "+57 318 981 9384",
  /** TODO: métodos de pago reales (los tres competidores usan Nequi, Llaves y Bre-B). */
  payments: ["Nequi", "Bre-B", "Llaves"],
  /** TODO: horario de atención real. */
  hours: "Lun a Dom · 7:00 a. m. – 10:00 p. m.",
  /** TODO: promesa de reposición que SÍ puedes cumplir. Torostream y ZeroDelay no la escriben: es tu ventaja. */
  warrantyHours: 12,
  /** TODO: tiempo típico de entrega en horario de atención. */
  deliveryMinutes: 15,
  instagram: "https://instagram.com/paradoxxan",
  tiktok: "",
  dox: "https://doxdesigns.dev",
};

/**
 * Descuento automático al combinar productos distintos (mecánica "arma tu
 * combo" de ZeroDelay). Cuenta solo productos sueltos: los combos ya traen su
 * descuento y no se acumulan. Entre 5% y 15%, nunca más de 20% (recomendación
 * de los estudios). TODO: ajústalo a tu margen; array vacío lo desactiva.
 */
export const comboTiers = [
  { min: 2, pct: 5 },
  { min: 3, pct: 10 },
  { min: 4, pct: 15 },
];

/** Mensajes de la barra superior rotativa (la de Emprendered, sin promesas vacías). */
export const announcements = [
  "Nuevo: relojería y tecnología con envío a toda Colombia",
  `Streaming, IA y software por WhatsApp en ~${site.deliveryMinutes} minutos`,
  "Perfumería: réplicas 1.1 y AAA para ella, para él y unisex",
  "Arma tu combo digital y ahorra hasta 15%",
];

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* A mano y no con toLocaleString: el prerender (Node) y el navegador podrían
   traer datos ICU distintos y el HTML no casaría al hidratar. */
export const formatCOP = (n: number) =>
  "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
