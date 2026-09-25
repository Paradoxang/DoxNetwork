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
 * Reglas, porque lo que la página afirma obliga (Ley 1480):
 *   · Si son de clientes del proveedor y no de DoxNetwork, llevan `fuente`
 *     ("Cliente del proveedor").
 *   · Se copian tal cual, con lo bueno y lo malo: si el cliente agregó un
 *     comentario después, va en `despues`. No se recorta lo negativo; si una
 *     reseña no conviene, se quita entera.
 *   · Solo reseñas del mismo producto: las del bebedero (agua) del proveedor
 *     no van en el comedero.
 * Fotos en /public/resenas/.
 */
export interface Resena {
  /** Nombre o iniciales, si el cliente lo dio. Sin nombre, la tarjeta titula con la ciudad. */
  nombre?: string;
  ciudad?: string;
  /** Color, tamaño o versión que compró ("Verde"). */
  variante?: string;
  /** Tal como la da la fuente: "11 abr 2026". */
  fecha?: string;
  texto: string;
  /** Comentario que el cliente agregó después, si lo hay. */
  despues?: string;
  estrellas: 1 | 2 | 3 | 4 | 5;
  /** De dónde sale la reseña, si no es de un cliente de DoxNetwork. */
  fuente?: string;
  /** Foto de la persona o del producto recibido, en /public/resenas/. */
  foto?: string;
}

/** Líneas cuyas fichas llevan el contenedor de reseñas (tecnología no, por ahora). */
export type LineaResenas = "perfumeria" | "relojeria" | "vapes" | "mascotas";

const PROVEEDOR = "Cliente del proveedor";

export const porProducto: Record<string, Resena[]> = {
  /* Comedero por gravedad. Las pasó el proveedor el 25-sep-2026. De sus
     reseñas quedaron fuera las del bebedero (versión de agua: otro producto)
     y tres de 5 estrellas sin texto ni versión. De la más reciente a la más
     antigua. */
  "comedero-gravedad-3l": [
    { ciudad: "Barranquilla", variante: "Verde", fecha: "22 may 2026", estrellas: 5, texto: "Todo bien.", fuente: PROVEEDOR },
    {
      ciudad: "Medellín",
      variante: "Gris",
      fecha: "11 abr 2026",
      estrellas: 5,
      texto: "No fue caro y es muy práctico. Le echo un paquete entero de concentrado y no tengo que estar pendiente a toda hora.",
      despues:
        "El platico es de cerámica y está muy bueno. Pero en general el sistema está mal pensado: el hueco por donde cae la comida queda muy arriba, entonces sale demasiado concentrado y además se riega por los lados. Si uno cierra mucho la compuerta, ya no sale nada. Ese hueco debería estar más abajito.",
      fuente: PROVEEDOR,
    },
    {
      ciudad: "Medellín",
      variante: "Verde",
      fecha: "23 ene 2026",
      estrellas: 5,
      texto: "¡Chévere el aparatico! Es muy práctico que tenga una ventanita para graduar la altura por donde sale la comida.",
      fuente: PROVEEDOR,
    },
    { ciudad: "Cali", variante: "Verde", fecha: "06 ene 2026", estrellas: 5, texto: "Muy bueno.", fuente: PROVEEDOR },
    {
      ciudad: "Pasto",
      variante: "Gris",
      fecha: "26 nov 2025",
      estrellas: 5,
      texto: "¡Buenísimo para ahorrar plata sin que a nuestro gato le falte nada!",
      fuente: PROVEEDOR,
    },
  ],
};

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
