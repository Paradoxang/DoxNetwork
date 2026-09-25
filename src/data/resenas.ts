/**
 * Reseñas de las fichas de producto (perfumería, relojería, vapes y el
 * comedero de mascotas). El contenedor solo aparece cuando hay al menos una:
 * aquí no va ningún testimonio de ejemplo ni inventado.
 *
 * Dos niveles:
 *   · `porProducto`: reseñas de ESE producto, por su slug
 *     ("perfume-lattafa-yara", "comedero-gravedad-3l"…).
 *   · `porLinea`: reseñas de la línea en general. Salen en las fichas que no
 *     tienen reseñas propias, con un título que dice que son de la línea y no
 *     de ese producto.
 *
 * TODO (Santiago): las reseñas llegan de los proveedores. Si son de clientes
 * del proveedor y no de DoxNetwork, van con `fuente` para decirlo
 * (p. ej. "Cliente del proveedor"): presentarlas como clientes propios
 * sería publicidad engañosa (Ley 1480). Fotos en /public/resenas/.
 */
export interface Resena {
  nombre: string;
  texto: string;
  estrellas: 1 | 2 | 3 | 4 | 5;
  /** Ciudad o detalle corto bajo el nombre ("Cali", "Compró el set x3"). */
  detalle?: string;
  /** De dónde sale la reseña, si no es de un cliente de DoxNetwork. */
  fuente?: string;
  /** Foto de la persona o del producto recibido, en /public/resenas/. */
  foto?: string;
}

/** Líneas cuyas fichas llevan el contenedor de reseñas (tecnología no, por ahora). */
export type LineaResenas = "perfumeria" | "relojeria" | "vapes" | "mascotas";

export const porProducto: Record<string, Resena[]> = {};

export const porLinea: Partial<Record<LineaResenas, Resena[]>> = {};

/**
 * Las reseñas que muestra una ficha: primero las del producto; si no tiene,
 * las de su línea. `alcance` dice cuáles son, para el título.
 */
export function resenasDe(slug: string, linea: LineaResenas): { lista: Resena[]; alcance: "producto" | "linea" } {
  const propias = porProducto[slug] ?? [];
  if (propias.length) return { lista: propias, alcance: "producto" };
  return { lista: porLinea[linea] ?? [], alcance: "linea" };
}
