# Inventario para Shopify · resumen

Generado el 2026-09-23 con `node tools/inventario-shopify.mjs`. El JSON completo está en `docs/inventario-shopify.json` (no se versiona: lleva costo de proveedor y el repo es público).

**494 productos · 518 variantes.** Precios los que muestra la web hoy (tras el alza del 22-sep).

| Línea | Productos | Agotados | Sin imagen |
|---|---|---|---|
| digital | 36 | 0 | 9 |
| perfumeria | 176 | 0 | 0 |
| relojeria | 64 | 4 | 0 |
| tecnologia | 204 | 13 | 0 |
| vapes | 14 | 4 | 0 |

- **Agotados:** 21 — Cargador iPhone tipo C, TV Box Model 3 8GB+128GB, Parlante G-Tide SH-30 Speaker Box, Mouse Ergonómico Inalámbrico, Holder 388A, Audífonos con cable tipo C TM-A….
- **Sin ninguna imagen:** 9 — Universal+, MUBI, Microsoft 365, Xbox Game Pass, PlayStation Plus, Diamantes Free Fire, Duolingo Super, Pack plantillas Instagram, Tu página web.
- **Con ruta de imagen que no existe en disco:** 0.
- **Restringidos (vapes):** 14.
- **Riesgo:** replica 221 · cuenta-compartida 12 · marca-registrada 315.

## Los diez precios más altos

| # | Producto | Línea | Variante | Precio |
|---|---|---|---|---|
| 1 | Parlante Portátil Kimiso KMS-325 Max | tecnologia | — | $295.900 |
| 2 | Kairos Mecánico AL8038-303 | relojeria | — | $235.900 |
| 3 | Kairos Mecánico AL8038-900 | relojeria | — | $235.900 |
| 4 | Kairos Oficial Selección Colombia | relojeria | — | $230.900 |
| 5 | Kairos Oficial Atlético Nacional | relojeria | — | $221.900 |
| 6 | Proyector con Juegos y Controles H300 Max | tecnologia | — | $219.900 |
| 7 | Gafas Inteligentes G5 2026 con Cámara e IA | tecnologia | — | $219.900 |
| 8 | Kairos Oficial América de Cali 2026 | relojeria | — | $207.900 |
| 9 | Kairos Mecánico DU430493G-3 | relojeria | — | $207.900 |
| 10 | Smartwatch Mobulaa UB6 Pro | tecnologia | — | $206.900 |

## Sobre el tachado

Va exportado en `tachado` porque el encargo lo pide, pero **no debe cargarse como `compareAtPrice`**: Shopify lo pinta como «antes costaba», y el −55 % del catálogo se calcula hacia atrás desde el porcentaje, no es un precio que la tienda haya cobrado. Donde el tachado sí es comprobable (combos frente a la suma de sus partes; varios meses frente al mensual) el valor es el mismo campo, no hay forma de distinguirlos en el JSON: son los combos y los planes con `per` en catalog.ts.
