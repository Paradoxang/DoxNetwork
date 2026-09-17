/** Redondea hacia arriba a la siguiente terminación 900: 7.500 → 7.900. */
export const up900 = (n: number) => Math.max(900, Math.ceil((n - 900) / 1000) * 1000 + 900);
/** Redondea hacia abajo a terminación 900: 41.096 → 40.900. */
export const down900 = (n: number) => Math.max(900, Math.floor((n - 900) / 1000) * 1000 + 900);
/**
 * Precio de productos físicos (perfumería, relojería, tecnología y vapes).
 * Hasta $30.000 de costo, × 2: entrada barata con poco margen en pesos.
 * Encima, costo + $30.000, que deja las réplicas al nivel de la competencia
 * (Yara 1.1 en $90.900, Sauvage en $69.900). Originales de más de $100.000:
 * costo × 1,35. Mercado revisado el 17-sep-2026.
 */
export const goodsPrice = (cost: number, original = false) =>
  cost <= 30000 ? up900(cost * 2) : original && cost > 100000 ? up900(cost * 1.35) : up900(cost + 30000);
