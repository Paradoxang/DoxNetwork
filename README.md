# DoxNetwork

Tienda de productos digitales (streaming, música, IA, software, gaming, cursos y
recursos) con compra por WhatsApp. Hermana de [Dox Designs](https://doxdesigns.dev):
misma base técnica y la misma identidad, en una clave más amable para comprar.

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

## Dónde se edita qué

| Qué | Archivo |
|---|---|
| WhatsApp, pagos, horario, dominio, descuentos por combo | `src/data/site.ts` |
| Categorías, productos, planes y precios | `src/data/catalog.ts` |
| Colores (modo oscuro y claro) | `src/index.css` → `:root` y `[data-theme="light"]` |
| Preguntas frecuentes | `src/sections/Faq.tsx` |
| Términos y condiciones | `src/pages/Terms.tsx` |

Todo lo que hay que revisar antes de publicar está marcado con `TODO`:

```bash
grep -rn "TODO" src
```

### Añadir un producto

Suma un objeto a `products` en `src/data/catalog.ts`. La ruta `/producto/<slug>`
se genera sola en el build. Un plan con `compareAt` muestra el precio tachado y
hace que el producto aparezca en **Ofertas**. Un plan con `price: 0` se muestra
como "A cotizar".

## Cómo funciona la compra

1. El cliente arma el carrito (se guarda en su navegador).
2. El descuento por combo se aplica solo según los productos distintos (`comboTiers`).
3. "Finalizar pedido" abre WhatsApp con el pedido ya redactado: productos, plan,
   cantidades, subtotal, descuento y total.

No hay pasarela de pago ni backend: el cobro y la entrega se cierran en el chat.

## Identidad

- **Paleta:** navy de Dox Designs, pero más claro. Nebulosa `#9aa9ff` para
  navegación, menta `#74d8b0` para comprar y dorado `#f2c46d` (de los anillos del
  logo) para las ofertas. Tiene modo claro.
- **Tipografía:** Kenney Future para la marca y los kickers, Manrope para titulares
  y texto.
- **Logo DN:** el isotipo de Dox Designs (D + esfera + anillos en X) con una N cuyas
  astas repiten el trazo de la D, con la diagonal en dorado y nodos en los vértices
  que dan la idea de red. Los archivos y su generador están en `brand/`
  (`python brand/gen_logo.py`); en la web va en línea (`src/components/LogoDN.tsx`)
  para animarlo y adaptar los colores al tema.

## Animación

- **GSAP:** entrada del hero (titular con SplitText y el logo dibujándose con
  DrawSVG), revelado escalonado de las rejillas con `ScrollTrigger.batch` y la
  línea de "Cómo comprar" dibujada al hacer scroll.
- **Framer Motion:** carrito lateral, toast, contador del carrito, filtros del
  catálogo (`layout`), selector de plan (`layoutId`), acordeón de preguntas,
  cambio de tema y botones magnéticos.
- Nunca animan el mismo nodo, y todo respeta `prefers-reduced-motion`.

## Despliegue en Vercel

Importa el repositorio en Vercel: detecta Vite y usa `npm run build` con salida en
`dist/`. `vercel.json` añade las cabeceras de seguridad (CSP estricta,
`script-src 'self'`). Si más adelante usas imágenes de otro dominio o analítica,
añade ese origen a la CSP.

Cuando tengas el dominio, actualiza `site.url` en `src/data/site.ts` (se usa para
las URLs canónicas).
