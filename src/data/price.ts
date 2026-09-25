/** Redondea hacia arriba a la siguiente terminación 900: 7.500 → 7.900. */
export const up900 = (n: number) => Math.max(900, Math.ceil((n - 900) / 1000) * 1000 + 900);
/** Redondea hacia abajo a terminación 900: 41.096 → 40.900. */
export const down900 = (n: number) => Math.max(900, Math.floor((n - 900) / 1000) * 1000 + 900);
/**
 * Redondea a la terminación 900 más cercana: 5.390 → 4.900, pero 5.610 → 5.900.
 *
 * Lo usa el alza. Redondear siempre hacia arriba inflaba el aumento en lo
 * barato, porque el escalón es de $1.000: un plan de $4.900 con un 10%
 * encima daba $5.390 y subía a $5.900, o sea un 20%. Al más cercano el
 * aumento medio se ajusta al pedido, a cambio de que algún producto muy
 * barato se quede igual.
 */
export const near900 = (n: number) => (up900(n) - n <= n - down900(n) ? up900(n) : down900(n));
/**
 * Precio de productos físicos (perfumería, relojería, tecnología y vapes).
 * Hasta $30.000 de costo, × 2: entrada barata con poco margen en pesos.
 * Encima, costo + $30.000, que deja las réplicas al nivel de la competencia
 * (Yara 1.1 en $90.900, Sauvage en $69.900). Originales de más de $100.000:
 * costo × 1,35. Mercado revisado el 17-sep-2026.
 */
/**
 * Margen mínimo en pesos por venta física. Existe porque el costo real de una
 * venta no es el dinero (el modelo es dropshipping: se compra cuando el cliente
 * ya pagó), sino el tiempo de gestión —chat, cobro, compra al proveedor y
 * envío—, que es casi el mismo para un accesorio de $2.900 y para un reloj de
 * $214.900. Sin este piso, 66 referencias dejaban $15.000 o menos y consumían
 * la misma atención que las que dejan $30.000.
 */
export const MIN_MARGIN = 12000;

/**
 * Alza del proveedor del 22-sep-2026.
 *
 * El proveedor pedía 20% en perfumería, 15% en relojería y 5% en vapes; se
 * dejan todas las líneas en 10% por decisión de Santiago. Se aplica sobre el
 * precio ya calculado por `goodsPrice`. (La línea digital, que también subió,
 * salió de la tienda el 25-sep-2026.)
 *
 * Para revertir o ajustar una línea, se cambia aquí y nada más.
 */
export const ALZA = {
  perfumeria: 1.1,
  relojeria: 1.1,
  tecnologia: 1.1,
  vapes: 1.1,
} as const;

export type LineaPrecio = keyof typeof ALZA;

/** Aplica el alza de la línea y vuelve a redondear a terminación 900. */
export const conAlza = (n: number, linea: LineaPrecio) => near900(n * ALZA[linea]);

/**
 * Descuento que enseña la vitrina, por línea.
 *
 * El proveedor condiciona el suministro a que cada producto se muestre
 * rebajado, así que el tachado se deriva del porcentaje: si algo vale
 * $12.900 y el descuento es del 55%, el precio de lista sale $28.900.
 *
 * Ese número está calculado hacia atrás desde el porcentaje, no medido.
 * Si el proveedor entrega su lista de PVP, sus precios van aquí en lugar
 * del cálculo y el tachado pasa a ser un dato suyo y no nuestro.
 *
 * Un mismo porcentaje en todas las fichas se nota; para que no cante,
 * basta con separar estos valores.
 */
export const DESCUENTO_VISIBLE: Record<LineaPrecio, number> = {
  perfumeria: 0.55,
  relojeria: 0.55,
  tecnologia: 0.55,
  vapes: 0.55,
};

/** Precio de lista que hay que tachar para que salga ese descuento. */
export const precioLista = (precio: number, linea: LineaPrecio) =>
  up900(precio / (1 - DESCUENTO_VISIBLE[linea]));

export const goodsPrice = (cost: number, original: boolean, linea: LineaPrecio) => {
  const base =
    cost <= 30000 ? up900(cost * 2) : original && cost > 100000 ? up900(cost * 1.35) : up900(cost + 30000);
  return conAlza(Math.max(base, up900(cost + MIN_MARGIN)), linea);
};
