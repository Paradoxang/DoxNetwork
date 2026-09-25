/**
 * Configuración del negocio. Todo lo que cambia sin tocar componentes vive aquí.
 * Horario, pagos y WhatsApp quedaron confirmados por Santiago el 21-sep-2026:
 * son promesas públicas, no valores de relleno. (La entrega y la reposición de
 * lo digital salieron con la línea digital el 25-sep-2026.) Si alguno cambia,
 * cambia también en la web, en la FAQ, en las políticas y en los copys publicados.
 */
export const site = {
  name: "DoxNetwork",
  url: "https://doxnetworks.com",
  tagline: "Perfumes, relojes y tecnología en una sola red.",
  description:
    "Perfumería 1.1 y AAA para ella, para él y unisex, relojería y tecnología con envío a toda Colombia. Pagas por Nequi o Llave Bre-B y te atiende una persona por WhatsApp.",

  /** Número de la tienda, solo dígitos con indicativo. Confirmado el 21-sep-2026. */
  whatsapp: "573189819384",
  whatsappDisplay: "+57 318 981 9384",
  /** "Llaves" no es un medio aparte: son los identificadores de Bre-B. Solo Nequi y Bre-B. */
  payments: ["Nequi", "Bre-B"],
  /** Horario real, confirmado el 21-sep-2026. Sale en la web, en los copys y en la FAQ. */
  hours: "Lun a Dom · 7:00 a. m. – 10:00 p. m.",
  instagram: "https://instagram.com/paradoxxan",
  tiktok: "",
  dox: "https://doxdesigns.dev",
};

/** Mensajes de la barra superior rotativa (la de Emprendered, sin promesas vacías). */
export const announcements = [
  "Perfumería 1.1 y AAA para ella, para él y unisex",
  "Envíos a toda Colombia · pagas por Nequi o Llave Bre-B",
  "¿No encuentras tu fragancia? Pregunta por el stock secreto 😉",
];

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* A mano y no con toLocaleString: el prerender (Node) y el navegador podrían
   traer datos ICU distintos y el HTML no casaría al hidratar. */
export const formatCOP = (n: number) =>
  "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
