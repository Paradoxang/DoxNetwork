/**
 * Configuración del negocio. Todo lo que cambia sin tocar componentes vive aquí.
 * Horario, entrega, reposición, pagos y WhatsApp quedaron confirmados por Santiago
 * el 21-sep-2026: son promesas públicas, no valores de relleno. Si alguno cambia,
 * cambia también en la web, en la FAQ, en las políticas y en los copys publicados.
 */
export const site = {
  name: "DoxNetwork",
  url: "https://doxnetworks.com",
  tagline: "Todo lo que usas, en una sola red.",
  description:
    "Streaming, IA y software, perfumería, relojería, tecnología y páginas web a la medida con Dox Designs. Una sola tienda, envíos a toda Colombia, pagos locales y atención de personas por WhatsApp.",

  /** Número de la tienda, solo dígitos con indicativo. Confirmado el 21-sep-2026. */
  whatsapp: "573189819384",
  whatsappDisplay: "+57 318 981 9384",
  /** "Llaves" no es un medio aparte: son los identificadores de Bre-B. Solo Nequi y Bre-B. */
  payments: ["Nequi", "Bre-B"],
  /** Horario real, confirmado el 21-sep-2026. Sale en la web, en los copys y en la FAQ. */
  hours: "Lun a Dom · 7:00 a. m. – 10:00 p. m.",
  /**
   * Reposición de lo digital si falla durante la vigencia. Confirmado el 21-sep-2026.
   * Torostream y ZeroDelay no la escriben: es la ventaja, y por eso va en los copys.
   */
  warrantyHours: 12,
  /** Entrega de lo digital en horario de atención. Confirmado el 21-sep-2026. */
  deliveryMinutes: 15,
  instagram: "https://instagram.com/paradoxxan",
  tiktok: "",
  dox: "https://doxdesigns.dev",
};

/** Mensajes de la barra superior rotativa (la de Emprendered, sin promesas vacías). */
export const announcements = [
  "Nuevo: relojería y tecnología con envío a toda Colombia",
  `Streaming, IA y software por WhatsApp en ~${site.deliveryMinutes} minutos`,
  "Perfumería: réplicas 1.1 y AAA para ella, para él y unisex",
];

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* A mano y no con toLocaleString: el prerender (Node) y el navegador podrían
   traer datos ICU distintos y el HTML no casaría al hidratar. */
export const formatCOP = (n: number) =>
  "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
