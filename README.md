# DoxNetwork

Tienda de productos digitales (streaming, pines de cine, música, IA, diseño,
gaming e idiomas) con compra por WhatsApp. Hermana de
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
| `/` | Inicio: hero, confianza, carrusel de promos, categorías, combos, pestañas de productos, cómo comprar, garantía, reseñas y preguntas |
| `/catalogo` | Catálogo con búsqueda, categorías, ofertas y orden (`?categoria=`, `?q=`, `?ofertas=1`, `?orden=`) |
| `/producto/:slug` | Ficha: selector de plan por ejes, detalles, desglose del combo y WhatsApp con enlace |
| `/favoritos` | Lista de deseos |
| `/terminos` | Términos, garantía y devoluciones |

## Dónde se edita qué

| Qué | Archivo |
|---|---|
| WhatsApp, pagos, horario, garantía, tiempo de entrega, descuentos por combinar, anuncios | `src/data/site.ts` |
| Categorías, productos, planes, precios, stock y combos | `src/data/catalog.ts` |
| Slides del carrusel y reseñas reales | `src/data/promos.ts` |
| Preguntas frecuentes | `src/sections/Faq.tsx` |
| Colores (oscuro y claro) | `src/index.css` |
| Imágenes de promos (Nano Banana) | `public/promos/` · guía en `docs/brief-imagenes-nano-banana.md` |

Todo lo que hay que revisar antes de publicar está marcado con `TODO`:

```bash
grep -rn "TODO" src
```

### Productos y planes

Cada plan se describe por ejes: `access` (Pantalla / Completa), `tier`
(Estándar, Premium, Platino, Go, Plus…) y `duration`. La ficha solo muestra los
ejes que cambian dentro del producto.

- `cost`: precio de proveedor. El precio de venta se calcula solo, redondeado
  a terminación 900: `cost × MARKUP` (o el `markup` del plan), sin pasar de la
  mediana del mercado (`market`) ni del 80% del plan oficial (`official`), y sin
  bajar de `cost × 1,5` (o `× 1,2` frente al oficial). La regla completa está en
  la cabecera de `src/data/catalog.ts`. Sin `cost`, el plan lleva `price` fijo.
- `per`: en planes de varios periodos, se tacha contra `n` veces el precio del
  plan mensual. Sin `cost` ni `price`, vale eso menos `per.off`.
- Productos físicos: `goodsPrice` en `src/data/price.ts` (× 2 hasta $30.000 de
  costo; encima, costo + $30.000; originales de más de $100.000, costo × 1,35).
- Combos: `comboDiscount` (0.12 = 12%) sobre la suma de sus partes.
- `stock`: si existe y es 5 o menos, se muestra "Quedan N". En 0, el producto
  aparece como agotado. Úsalo solo con inventario real.
- Combos: `includes` lista producto y plan. El precio y el tachado se calculan
  solos a partir de las partes.
- `price: 0` = "A cotizar".

## Decisiones tomadas a partir de los estudios de competencia

Estudios de ZeroDelay, Torostream y Emprendered (16-sep-2026). Son documentos
internos: están en `.gitignore` y no se suben al repositorio.

**Aplicado**
- Precio = costo de proveedor × `MARKUP` (3), limitado por la mediana del mercado y el plan oficial (17-sep-2026: el × 3 dejaba 21 de 26 planes por encima de la mediana). Costo de referencia: Torostream y, si falta, Emprendered.
- Escalera por producto: acceso × calidad × duración.
- 4 combos con identidad, solo de pantallas y pines ("Maratón de series", "Fan del
  deporte", "Plan familia", "Cita al cine"). Los de IA y edición ("Universitario",
  "Creador de contenido") y el armador `/arma-tu-combo` se retiraron el 24-sep-2026.
- Descuento por combinar en el carrito: 5% con 2 productos digitales distintos, 10%
  con 3 y 15% con 4 o más. No se acumula con los combos.
- Ficha estándar (acceso, dispositivos, vigencia, entrega, garantía) y garantía
  escrita: el hueco más grande de los tres competidores.
- FAQ orientada a objeciones, categorías "Próximamente", favoritos, stock visible,
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
- Menús desplegables de Categorías (mega menú), Combos y Ayuda. Se abren con
  hover, clic o teclado; Esc cierra y devuelve el foco.
- Cabecera que se oculta al bajar y vuelve al subir.
- Buscador con `Ctrl/Cmd + K` o `/`, con flechas y Enter.
- En móvil, menú a pantalla completa con acordeones.

## Animación

- **GSAP:** entrada del hero y dibujo del logo, revelados por scroll
  (`ScrollTrigger.batch`), línea de "Cómo comprar", escudo de la garantía y
  reloj del carrusel.
- **Framer Motion:** menús, píldora del nav, buscador, carrito, avisos,
  pestañas, selector de plan, armador de combos (contadores y progreso),
  favoritos y filtros.
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
