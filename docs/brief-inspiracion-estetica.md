# Brief · Mejoras estéticas a partir de tres referencias

**Fecha:** 17-sep-2026 · **Sitio:** doxnetworks.com · **Estado base:** rediseño de 3 fases ya implementado (lecho de imagen, bento, pestañas animadas, galería arrastrable, pasos fijos, FAQ chat, pie con marca gigante, paleta por línea y atrezo 3D).

Referencias revisadas de punta a punta, en escritorio y a 390 px:

| Sitio | Qué es | Lo que hace bien |
| --- | --- | --- |
| krakenindustries.co | Taller de billeteras a la medida | Rail lateral fijo, textura topográfica en toda la página, tipografía enorme en amarillo ácido, rejilla de hairlines en vez de tarjetas, franja invertida para la garantía |
| void.sbs | App de mensajería privada | Intro cinematográfico con un teléfono que no se mueve mientras cambia su pantalla, capítulos con nav flotante y "saltar intro", bloques inclinados, alternancia oscuro/claro brutal, iconos incrustados dentro del titular |
| nightkidz.shop | Tienda JDM | Logotipo gigante como máscara sobre foto, fondo fotográfico desenfocado detrás de toda la página, rejilla de producto sin tarjetas con líneas verticales de página completa, grano de película |

No copiamos: el verde ácido (tenemos paleta propia), el intro que retrasa el contenido (mata conversión en una tienda), ni la ausencia total de botón de compra.

---

## 1 · Rail lateral fijo (de Kraken)

Hoy el encabezado es una barra superior que se repite en todas las páginas. Kraken mete la identidad en una **columna fija a la izquierda** (logo, bajada de tres líneas, dos enlaces, coordenadas, copyright) y deja todo el ancho restante al contenido.

**Propuesta para DoxNetwork:** rail izquierdo de 200 px solo en ≥1280 px, presente en las páginas de colección (`/perfumeria`, `/relojeria`, `/tecnologia`, `/catalogo`) con:
- logo pequeño y "Dox Network · Software Solutions",
- la línea activa y el conteo (176 fragancias),
- filtros rápidos de esa línea (los que hoy son chips arriba),
- al pie: WhatsApp, horario y "Cali, Colombia · 3.45°N 76.53°W" en mono.

Gana: el catálogo respira, los filtros dejan de empujar la rejilla hacia abajo y la marca queda presente sin robar altura. La barra superior actual se queda en el inicio y en móvil.

**Archivos:** `src/components/Nav.tsx`, `src/pages/Coleccion.tsx`, `src/pages/Catalog.tsx`.

## 2 · Rejilla de hairlines en vez de tarjetas (de Kraken y Nightkidz)

Los dos sitios muestran producto **sin caja**: solo la foto, el nombre y el precio, separados por líneas de 1 px que cruzan toda la sección. Nuestras tarjetas ya están buenas, pero todo el sitio usa el mismo recuadro redondeado; el ojo lo deja de registrar.

**Propuesta:** una variante `lista` de la tarjeta para zonas donde hoy sobra el marco:
- "Lo mejor de cada línea" (03) en pantallas grandes: 4 columnas separadas por hairlines verticales que llegan del tope al pie de la sección,
- el pasillo de físicos (ya es una fila arrastrable) sin borde en las piezas,
- los pasos 01/02/03 de "Cómo comprar" separados por hairlines en vez de por el trazo actual.

Regla: la tarjeta con marco se reserva para donde hay botón de compra; sin botón, hairline.

**Archivos:** `src/components/ui/product-card.tsx` (prop `variant`), `src/sections/ProductTabs.tsx`, `src/sections/HowItWorks.tsx`.

## 3 · Franja invertida por sección (de Kraken y VOID)

Kraken corta la página con una banda amarilla a sangre para la garantía de 10 años. VOID alterna un bloque casi blanco con tipografía negra enorme. Nosotros llevamos nueve secciones sobre el mismo navy.

**Propuesta:** dos inversiones en el inicio, no más:
- **Garantía (05)** a sangre en menta (`--mint`) con texto oscuro y la cifra "12 H" gigante a la izquierda, al estilo del "10YR".
- **Cierre / "Pídelo y te lo conseguimos"** a sangre en dorado suave.

Con el eco morado del agujero negro ya tenemos tres fondos distintos; sumar dos franjas invertidas da el ritmo que pide el brief de arte sin añadir una sola animación.

**Archivos:** `src/sections/Guarantee.tsx`, `src/sections/Cta.tsx`, tokens en `src/index.css`.

## 4 · Cifra gigante como protagonista (de Kraken)

"10YR" ocupa media franja y se lee antes que el texto. Tenemos cifras que merecen ese trato y ya cuentan solas (Number Ticker): **176 · 64 · 204 · 444 · 12 h · ~15 min**.

**Propuesta:** en cada sección, una sola cifra a `clamp(64px, 9vw, 160px)` en Oxanium con el acento de su línea, y el texto explicativo al lado en cuerpo normal. Aplica en Garantía (12 h), en el pasillo de físicos (444) y en el hero de cada colección (176 / 64 / 204).

## 5 · Capítulos con nav flotante (de VOID)

VOID pone una píldora flotante abajo con los capítulos (Security · Chat · Voice · Storage…) que marca dónde estás y deja saltar. Nuestro inicio ya tiene seis secciones numeradas (01 · La red, 02 · Combos, …).

**Propuesta:** píldora flotante inferior en escritorio, con los seis números y el nombre corto de la sección activa; se oculta al llegar al pie. Es navegación real, no adorno: en una página larga el visitante ve cuánto falta.

**Archivo nuevo:** `src/components/ChapterNav.tsx` (IntersectionObserver sobre las `section[id]`).

## 6 · Icono incrustado dentro del titular (de VOID)

VOID mete una baldosa con un candado **dentro** del H1. Es barato y le da personalidad al titular.

**Propuesta:** en los titulares de sección, sustituir una palabra por una baldosa con la pieza 3D que ya tenemos: "Compras con **[escudo]** respaldo", "Perfumes, relojes y **[orbe]** tecnología". Una sola por sección y nunca en el H1 del hero (SEO y lectura).

**Archivo:** `src/components/SectionHeading.tsx` (soporte para `ReactNode` en `title`).

## 7 · Producto sobre fondo claro (de Nightkidz)

Sus fotos van sobre blanco puro y contrastan con el fondo negro: el producto "salta". Nosotros hicimos lo contrario (lecho oscuro) y funciona para logos, pero los perfumes y relojes pierden brillo.

**Propuesta a probar (A/B visual, no cambio a ciegas):** en las páginas de colección, lecho **claro** para las fotos de producto físico (gris muy claro con viñeta) manteniendo el oscuro en el inicio. Si convence, se unifica. Es un cambio de dos tokens (`--media-bed`, `--media-glow`) con un modificador por sección.

## 8 · Micro-tipografía técnica (de Kraken)

Etiquetas mono en mayúsculas con mucho tracking, coordenadas, "EST. 2026", "3 PASOS · ~2 MIN · SIN PAGO POR ADELANTADO" bajo el botón. Da sensación de taller serio.

**Propuesta:** ya tenemos Sono como mono. Añadir bajo los CTA principales una línea de servicio: "3 pasos · ~15 min · sin registro"; en el pie, coordenadas de Cali; en las fichas, "REF · <id>" en mono.

## 9 · Encabezado de sección a lo tienda (de Nightkidz)

Título enorme a la izquierda y "VER TODO →" a la derecha, alineados a la misma línea base, sin bajada. Rápido de leer y muy de tienda.

**Propuesta:** usar ese patrón en las vitrinas por línea dentro de las colecciones (hoy llevan bajada de tres líneas que nadie lee).

## 10 · Detalles que suman poco esfuerzo

- **Marcas de recorte** (`+` en las esquinas y cuadritos sueltos) como los de Kraken: ya tenemos `esquinas.webp` y `reticula.webp` sin usar en ese papel.
- **Grano de película** a 3-4 % sobre toda la página (Nightkidz): un solo `::after` fijo; unifica fotos de proveedor de calidades distintas.
- **Cursor de arrastre** en la fila de físicos con etiqueta "arrastra" que sigue al puntero.
- **Marquesina** de marcas (Chanel, Dior, Lattafa, Rolex, Apple…) en una franja fina: ya estaba propuesta en el brief anterior y sigue pendiente.

---

## Orden sugerido

| Bloque | Qué entra | Riesgo |
| --- | --- | --- |
| A | Franjas invertidas (3), cifra gigante (4), micro-tipografía (8), encabezado de tienda (9) | Bajo: solo CSS y texto |
| B | Hairlines (2), icono en titular (6), detalles (10) | Medio: toca componentes compartidos |
| C | Rail lateral (1), nav de capítulos (5), lecho claro (7) | Alto: cambia navegación y hay que medir |

Cada bloque se prueba en escritorio y a 390 px antes de pasar al siguiente, como en las fases anteriores.

## Lo que NO se toca

- Las dos firmas de movimiento (borde luminoso y tilt) siguen siendo las únicas; nada de lo de arriba añade una tercera.
- Vapes no entra en ninguna pieza promocional nueva.
- Los testimonios siguen bloqueados hasta tener capturas reales de WhatsApp.
