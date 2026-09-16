/**
 * Configuración del negocio. Todo lo que cambia sin tocar componentes vive aquí.
 * Revisa cada valor marcado con TODO antes de publicar.
 */
export const site = {
  name: "DoxNetwork",
  /** TODO: cambia por el dominio final cuando esté conectado en Vercel. */
  url: "https://doxnetwork.vercel.app",
  tagline: "Todo lo digital, sin vueltas.",
  description:
    "Tienda de productos digitales: streaming, música, inteligencia artificial, software, gaming y cursos. Eliges, pagas y lo recibes por WhatsApp.",

  /** TODO: número de WhatsApp de la tienda, solo dígitos con indicativo. */
  whatsapp: "573189819384",
  whatsappDisplay: "+57 318 981 9384",
  /** TODO: métodos de pago reales que aceptas. */
  payments: ["Nequi", "Daviplata", "Bre-B", "Transferencia"],
  /** TODO: horario de atención real. */
  hours: "Lun a Sáb · 8:00 a. m. – 9:00 p. m.",
  instagram: "https://instagram.com/paradoxxan",
  dox: "https://doxdesigns.dev",
};

/**
 * Descuento por combo: se aplica según cuántos productos distintos hay en el
 * carrito. Ordenado de menor a mayor. TODO: ajusta los porcentajes a tu margen
 * (o deja el array vacío para desactivarlo).
 */
export const comboTiers = [
  { min: 2, pct: 5 },
  { min: 3, pct: 10 },
];

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/* A mano y no con toLocaleString: el prerender (Node) y el navegador podrían
   traer datos ICU distintos y el HTML no casaría al hidratar. */
export const formatCOP = (n: number) =>
  "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
