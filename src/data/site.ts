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
    "Perfumería 1.1 y AAA para ella, para él y unisex, relojería y tecnología con envío gratis a toda Colombia. Pagas con tarjeta, PSE, Nequi o Bre-B y te atiende una persona por WhatsApp.",

  /** Número de la tienda, solo dígitos con indicativo. Confirmado el 21-sep-2026. */
  whatsapp: "573189819384",
  whatsappDisplay: "+57 318 981 9384",
  /** Lo que cobra el checkout de Shopify con Bold desde el 26-sep-2026. "Llaves" no es un medio aparte: son los identificadores de Bre-B. */
  payments: ["Tarjeta", "PSE", "Nequi", "Bre-B"],
  /** Horario real, confirmado el 21-sep-2026. Sale en la web, en los copys y en la FAQ. */
  hours: "Lun a Dom · 7:00 a. m. – 10:00 p. m.",
  instagram: "https://instagram.com/paradoxxan",
  tiktok: "",
  dox: "https://doxdesigns.dev",
};

/** Mensajes de la barra superior rotativa (la de Emprendered, sin promesas vacías). */
export const announcements = [
  "Perfumería 1.1 y AAA para ella, para él y unisex",
  "Envío gratis a toda Colombia · paga con tarjeta, PSE, Nequi o Bre-B",
  "¿No encuentras tu fragancia? Pregunta por el stock secreto 😉",
];

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* A mano y no con toLocaleString: el prerender (Node) y el navegador podrían
   traer datos ICU distintos y el HTML no casaría al hidratar. */
export const formatCOP = (n: number) =>
  "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * Cómo se paga, dicho igual en todo el sitio y en Shopify (encargo
 * docs/ENCARGO-ASTRO-pagos-bold.md, 26-sep-2026): con Bold el checkout cobra
 * tarjeta débito o crédito, PSE, Nequi y Bre-B. La contra entrega sigue solo
 * en lo que la permite (hoy, el comedero) y se nombra, pero ya no es el
 * mensaje principal. Nada de cuotas ni comisiones que Bold no haya confirmado.
 */
export const pagos = {
  conContraEntrega: "Paga como prefieras: tarjeta, PSE, Nequi, Bre-B o contra entrega · Envío gratis",
  sinContraEntrega: "Paga con tarjeta, PSE, Nequi o Bre-B · Envío gratis",
};
