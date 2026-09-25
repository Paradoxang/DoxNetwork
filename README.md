# DoxNetwork

Tienda de productos físicos con el foco en perfumería (réplicas 1.1 y AAA),
más relojería, tecnología, mascotas y vapes, con envío a toda Colombia. El
carrito termina en el checkout de Shopify (Nequi o Llave Bre-B) o, si algo no
está cargado allí, en WhatsApp. Desde el 25-sep-2026 no vende nada digital
(streaming, IA, software, gaming, pines ni combos). Hermana de
[Dox Designs](https://doxdesigns.dev): misma base técnica y misma identidad, en una
clave más amable para comprar.

## Stack

React 18 · Vite 5 · TypeScript · Tailwind CSS v4 · GSAP 3 (DrawSVG, ScrollTrigger,
SplitText) · Framer Motion 11 · Lenis · vite-react-ssg (cada página se prerenderiza
a HTML estático).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ con una página por producto
npm run preview  # sirve dist/ para probar el build
```

## Páginas

| Ruta | Qué es |
|---|---|
| `/` | Inicio: hero, confianza, líneas, carrusel de promos, perfumería, pestañas de productos, cómo comprar, garantía, reseñas y preguntas |
| `/perfumeria` | Perfumería con filtros por público, familia, calidad y casa (`?para=`, `?familia=`, `?calidad=`, `?casa=`, `?orden=`) |
| `/relojeria`, `/tecnologia`, `/vapes` | Colecciones con sus filtros; vapes con verificación de edad |
| `/comedero` | Landing de pauta del comedero de mascotas (Shopify, contra entrega) |
| `/paginas-web` | Servicio de páginas web de Dox Designs: servicios, portafolio, proceso y cotización por WhatsApp (datos en `src/data/dox.ts`) |
| `/catalogo` | Toda la tienda con búsqueda, línea y orden (`?linea=`, `?q=`, `?orden=`) |
| `/producto/:slug` | Ficha: detalles, relacionados, carrito y WhatsApp con enlace |
| `/favoritos` | Lista de deseos |
| `/terminos` | Términos, garantía y devoluciones |

## Dónde se edita qué

| Qué | Archivo |
|---|---|
| WhatsApp, pagos, horario, anuncios | `src/data/site.ts` |
| Perfumes, stock secreto y accesos por público | `src/data/perfumeria.ts` (filas en `perfumes.ts`) |
| Relojería, tecnología y vapes | `src/data/lineas.ts` (filas en `articulos.ts` y `vapes.ts`) |
| Precios, alza y descuento de vitrina | `src/data/price.ts` |
| Slides del carrusel y reseñas reales | `src/data/promos.ts` |
| Preguntas frecuentes | `src/sections/Faq.tsx` |
| Colores (oscuro y claro) | `src/index.css` |
| Imágenes de promos (Nano Banana) | `public/promos/` · guía en `docs/brief-imagenes-nano-banana.md` |

Todo lo que hay que revisar antes de publicar está marcado con `TODO`:

```bash
grep -rn "TODO" src
```

### Productos y precios

- Precio de venta: `goodsPrice` en `src/data/price.ts` (× 2 hasta $30.000 de
  costo; encima, costo + $30.000; originales de más de $100.000, costo × 1,35;
  nunca menos de $12.000 de margen), con el alza del 22-sep-2026 encima.
- Tachado: `DESCUENTO_VISIBLE` (−55%), calculado hacia atrás desde el precio.
  No es un precio anterior.
- `stock`: si existe y es 5 o menos, se muestra "Quedan N". En 0, el producto
  aparece como agotado. Úsalo solo con inventario real.
- Las URLs de lo que se retiró redirigen al inicio desde `public/_redirects`.

## Decisiones tomadas a partir de los estudios de competencia

Estudios de ZeroDelay, Torostream y Emprendered (16-sep-2026). Son documentos
internos: están en `.gitignore` y no se suben al repositorio.

**Aplicado**
- La línea digital (streaming, IA, software, gaming, pines y combos) salió de la
  tienda el 25-sep-2026. Antes se retiraron los combos de IA y edición, el
  armador de combos y el descuento por combinar (24-sep-2026).
- Ficha estándar y garantía escrita: el hueco más grande de los tres
  competidores.
- FAQ orientada a objeciones, favoritos, stock visible,
  WhatsApp con el producto y su enlace, deshacer en el aviso de agregado y barra
  de carrito en móvil.
- Popup de entrada en versión discreta: tarjeta pequeña, una vez por sesión y
  solo después de bajar del hero.

**Descartado a propósito**
- IPTV, Magis TV, Flujo TV y paneles de reventa: redistribución de señal sin
  licencia, con acciones legales activas.
- Contenido adulto, réplicas "1.1" y vapes.
- Nivel "genérica": cuentas recicladas de origen dudoso.
- Precios tachados inventados (−96%) y testimonios genéricos.

## Logo

La D de Dox Designs (planeta con dos anillos en X) y una N gruesa con efecto de
tubo de luz (halo + brillo interior), con una luna ensartada en la diagonal a la
misma altura que el planeta, y nodos de red en los vértices.

- Fuente única: `brand/gen_logo.py` (`python brand/gen_logo.py`).
- PNG exportados: `brand/export/` (`SHARP_DIR=<carpeta con node_modules/sharp> node brand/render.cjs`).
- `doxnetwork-favicon.svg` es una versión simplificada, legible a 16–64 px.
- En la web va en línea (`src/components/LogoDN.tsx`) para animarlo y cambiar de color con el tema.

## Navegación

- Barra de anuncios rotativa (se pausa con el puntero).
- Menús desplegables de Tienda (mega menú), Perfumería, Páginas web y Ayuda. Se abren con
  hover, clic o teclado; Esc cierra y devuelve el foco.
- Cabecera que se oculta al bajar y vuelve al subir.
- Buscador con `Ctrl/Cmd + K` o `/`, con flechas y Enter.
- En móvil, menú a pantalla completa con acordeones.

## Animación

- **GSAP:** entrada del hero y dibujo del logo, revelados por scroll
  (`ScrollTrigger.batch`), línea de "Cómo comprar", escudo de la garantía y
  reloj del carrusel.
- **Framer Motion:** menús, píldora del nav, buscador, carrito, avisos,
  pestañas, favoritos y filtros.
- Nunca animan el mismo nodo, y todo respeta `prefers-reduced-motion`.

## Despliegue en Cloudflare

La tienda es estática: `vite-react-ssg` prerenderiza cada ruta a un `.html` y
Cloudflare los sirve desde el borde. Es un Worker **sin script**, solo archivos
(`[assets]` en `wrangler.toml`), así que no hay servidor que mantener y las
peticiones a archivos estáticos no se facturan.

**Publicar**

Cada push a `main` dispara la compilación en Cloudflare (Workers Builds), que
corre `npm run build` y luego `npx wrangler deploy`. No hay que hacer nada más.

Para subir algo a mano, sin pasar por GitHub:

```
npm run build
npm run deploy
```

`npm run deploy` lee `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` de `.env`
(que no se versiona; la plantilla está en `.env.example`).

**Por qué hace falta `wrangler.toml`**

Sin él, `wrangler deploy` intenta deducir el framework, detecta Vite y exige
Vite 6 o superior. El archivo le dice que aquí solo hay archivos estáticos y
se salta esa detección.

**Cabeceras**

Van en `public/_headers`, que Vite copia a `dist/` en cada build: CSP estricta
con `script-src 'self'`, HSTS, `X-Frame-Options`, `Permissions-Policy` y caché
de un año para `/fonts/*` y `/assets/*`. Si algún día activas Rocket Loader o la
inyección automática de Web Analytics en el panel de Cloudflare, esos scripts
son inline y la CSP los bloqueará.

Rutas limpias y 404 salen de `wrangler.toml`: `html_handling` sirve `/catalogo`
desde `catalogo.html`, y `not_found_handling` entrega `404.html` en cualquier
ruta que no exista.

El dominio es **doxnetworks.com**, conectado al Worker como dominio
personalizado. `www` redirige al apex con un 301 (regla de la zona).
