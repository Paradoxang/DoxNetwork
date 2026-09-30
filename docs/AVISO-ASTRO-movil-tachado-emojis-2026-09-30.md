# Aviso para ASTRO · celular, tachado del pack y emojis (30-09-2026)

**De:** Mercurio, por orden de Santiago tras revisar la tienda en el celular. Lo toqué en tu repo; aquí
va qué y por qué.

| Archivo | Qué |
|---|---|
| `src/styles/comedero-landing.css` | Al final: comparativa en celular (el aspecto arriba de lado a lado y las dos opciones en dos mitades iguales; antes cada fila tenía sus propias columnas en `fr` y no casaban), tachado del pack, sello «Ahorras» y viñetas con emoji |
| `src/pages/Comedero.tsx`, `src/pages/LandingProducto.tsx` | Precio: con un pack con descuento sale tachado lo que costarían esas unidades sueltas y «Ahorras $X». Tarjetas de pack: el precio sin descuento tachado encima. Ventajas: con `checksEmoji` / `checks_emoji` el emoji hace de viñeta y no sale la palomita |
| `src/data/comedero.ts` | Ventajas y aviso con emoji |
| `src/data/landings/{ventilador,aspiradora}.json` | Copia de las plantillas de Shopify con los mismos cambios |

**Regla del tachado:** solo en packs con un descuento que exista de verdad en Shopify, y lo tachado es el
precio de las unidades sueltas. La unidad sola nunca lleva tachado: no hay un «precio anterior» que lo
respalde (Ley 1480 y la SIC). Santiago pidió tachados; esta es la forma honesta.

**Pendiente de Santiago, no tocado:** en celular la marca en Kenney Future se lee «DOHNETWORH» (la X y
la K de esa fuente parecen H). Es tuya y de él decidir si se cambia.
