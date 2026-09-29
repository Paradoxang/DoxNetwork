# Aviso para ASTRO · formulario contra entrega (29-09-2026)

**De:** Mercurio, por orden de Santiago («punto 2» del diagnóstico de por qué no
se vendía). Lo toqué yo en tu repo; aquí va qué y por qué, para que no te sorprenda.

## Por qué
Meta contaba decenas de «pagos iniciados» y Shopify solo guardaba 2 pagos
abandonados en todo el período: la gente abría el checkout de Shopify (otro
dominio, correo primero, nueve campos, y hasta el 29-09 con Bold marcado y «Pagar
ahora») y se iba sin escribir nada. Santiago eligió un formulario propio en
doxnetworks.com en vez de Releasit.

## Qué cambió
| Archivo | Qué |
|---|---|
| `src/data/pedido-cod.ts` (nuevo) | departamentos con código de Shopify, validaciones y la regla del pack; lo comparten la página y el Worker |
| `src/components/PedidoContraEntrega.tsx` (nuevo) | el formulario en una hoja (`.dn-hoja dn-pedido`), InitiateCheckout al abrir y Purchase con eventID al confirmar |
| `worker/index.ts`, `worker/pedido.ts` (nuevos) | `POST /api/pedido`: valida, lee precio y etiqueta `contraentrega` en Shopify y crea el pedido (pago pendiente, pasarela «Cash on Delivery (COD)») |
| `wrangler.toml` | ahora tiene `main` y `run_worker_first = ["/api/*"]`: solo /api pasa por el script; el resto siguen siendo archivos gratis |
| `src/pages/LandingProducto.tsx`, `src/pages/Comedero.tsx` | con el formulario encendido, «Comprar y pagar al recibir» abre el formulario y el checkout queda como «o paga ya con tarjeta, PSE, Nequi o Bre-B» |
| `src/components/MetaPixel.tsx` | `pixel()` acepta un tercer argumento `{ eventID }` |
| `src/styles/comedero-landing.css` | estilos `.dn-campo`, `.dn-pedido__*`, `.dn-oferta__alterno` al final |
| `.env.production` | `VITE_FORMULARIO_COD=1`: encendido el 29-09 tras el pedido de prueba #1008, que llegó a Dropi solo |

## Lo que tienes que saber
- **Está encendido desde el 29-09.** Con `VITE_FORMULARIO_COD=0` vuelve todo al
  checkout; con 0, `?formulario` en la URL lo enciende solo para esa visita.
- **Credenciales**: app «Pedidos contra entrega» del Dev Dashboard de Shopify
  (client credentials). `SHOPIFY_CLIENT_ID` va en `[vars]` de wrangler.toml; el
  secreto `SHOPIFY_CLIENT_SECRET` lo pone Santiago en Cloudflare y nunca va al repo.
- **Probar en local**: `npx wrangler dev --var SIMULAR:1` valida y devuelve el
  pedido que se crearía sin tocar Shopify (acepta Origin localhost solo en ese modo).
- Si cambias los packs o el descuento del segundo, cambia también
  `SEGUNDO_CON_DESCUENTO` en `src/data/pedido-cod.ts`: el Worker rechaza el pedido
  si el total que vio el cliente no cuadra.
