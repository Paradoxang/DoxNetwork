/** Redondea hacia arriba a la siguiente terminación 900: 7.500 → 7.900. */
export const up900 = (n: number) => Math.max(900, Math.ceil((n - 900) / 1000) * 1000 + 900);
/** Redondea hacia abajo a terminación 900: 41.096 → 40.900. */
export const down900 = (n: number) => Math.max(900, Math.floor((n - 900) / 1000) * 1000 + 900);
