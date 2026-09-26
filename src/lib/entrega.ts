/**
 * Entrega estimada en días hábiles (lunes a viernes, sin festivos), la misma
 * cuenta que la landing del comedero (assets/dn-landing.js del tema de
 * Shopify). Santiago confirmó el 25-sep-2026: de 3 a 6 días hábiles en todas
 * las líneas. Se calcula solo en el navegador: la fecha del build no es la de
 * quien compra.
 */
export const ENTREGA = {
  min: 3,
  max: 6,
  texto: "Llega en 3 a 6 días hábiles",
  nota: "Fecha estimada; la confirma la transportadora según tu ciudad.",
};

/** Festivos de Colombia que caen entre semana (los de la plantilla de Shopify). */
export const FESTIVOS = [
  "2026-10-12", "2026-11-02", "2026-11-16", "2026-12-08", "2026-12-25",
  "2027-01-01", "2027-01-11", "2027-03-22", "2027-03-25", "2027-03-26",
];

/** "mié, 30 de sept": la fecha tras `dias` días hábiles contados desde mañana. */
export function fechaEntrega(dias: number, festivos: string[] = FESTIVOS) {
  const clave = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  let c = 0;
  while (c < dias) {
    d.setDate(d.getDate() + 1);
    const w = d.getDay();
    if (w !== 0 && w !== 6 && !festivos.includes(clave(d))) c++;
  }
  return new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short" }).format(d).replace(/\./g, "");
}
