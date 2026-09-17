# Brief · Capas grandes: fondos y objetos de pantalla completa

**Objetivo:** que la página deje de ser "contenido sobre navy plano". Hoy el atrezo son piezas de 150 a 600 px en las esquinas; falta el nivel de arriba: **capas que ocupan la pantalla entera** y que el contenido atraviesa. Es lo que hacen las tres referencias: Nightkidz tiene una foto desenfocada detrás de toda la tienda, Kraken una textura topográfica continua, VOID un objeto central que no se mueve mientras el scroll cambia lo que muestra.

Reglas que aplican a todo lo de abajo:
- **Una capa grande por sección, nunca dos.** Si una sección ya tiene eco del agujero negro, no lleva otra.
- **El texto manda:** contraste mínimo 4.5:1 sobre cualquier capa; si hace falta, velo de `--bg` al 70 % entre capa y texto.
- **Peso:** cada capa a pantalla completa, ≤180 KB en WebP (o CSS puro). Nada bloquea el primer pintado.
- **Movimiento reducido:** toda capa animada se congela; ninguna capa es imprescindible para entender la página.
- No suma una tercera firma de movimiento: son fondos, no interacciones.

---

## A · Capas de fondo (ocupan el viewport, el contenido pasa por encima)

### A1 · Telón fijo desenfocado por línea *(de Nightkidz)*
Una foto de la línea (perfumes, relojes, gadgets) a pantalla completa, desenfocada 40-60 px, saturada y oscurecida al 25 %, **fija** mientras la rejilla de producto pasa por encima. Cambia por página: rosa en perfumería, ámbar en relojería, azul en tecnología.
- **Dónde:** `/perfumeria`, `/relojeria`, `/tecnologia`, `/catalogo`.
- **Cómo:** `position: fixed; inset: 0; z-index: -1` con `filter: blur(48px) saturate(1.3) brightness(.35)`; en móvil, versión de 720 px ya desenfocada en el archivo (no filtro en vivo).
- **Material:** ya tenemos las fotos; se compone un collage 3×3 y se desenfoca en el script de imágenes.

### A2 · Malla topográfica continua *(de Kraken)*
Un SVG de curvas de nivel repetido en toda la página al 4-6 % de opacidad, por debajo de todo. Da textura sin color y disimula las bandas del degradado.
- **Dónde:** global, en `body::before`.
- **Cómo:** SVG de 1200×1200 en `public/deco/topo.svg`, `background-repeat: repeat`, `opacity: .05`. En nuestra clave no son curvas de nivel sino **órbitas concéntricas** del agujero negro: misma idea, lenguaje nuestro.
- **Coste:** ~15 KB, cero JS.

### A3 · Grano de película global *(de Nightkidz)*
Capa de ruido fija al 3 %, `mix-blend-mode: overlay`, sobre todo el sitio. Unifica fotos de proveedor con calidades muy distintas: hoy conviven renders limpios con fotos de marketplace.
- **Cómo:** PNG de ruido de 256×256 repetido, o `feTurbulence` en un SVG inline. Se apaga en `prefers-reduced-motion` solo si se anima; estático puede quedarse.

### A4 · Rejilla de perspectiva ("suelo espacial")
La malla de alambre que ya extrajimos (`malla.webp`) llevada a **ancho completo y 60 vh**, anclada al fondo de la sección de físicos y del pie, con desvanecido hacia arriba. Es el suelo del universo Dox.
- **Dónde:** sección de físicos, pie y hero de las colecciones.
- **Cómo:** la pieza ya existe; falta usarla a escala grande en vez de como adorno lateral.

### A5 · Campo de estrellas con paralaje de tres capas
Tres capas de partículas (`polvo`, `particulas`, `particulas-campo`) desplazándose a velocidades distintas con el scroll, cubriendo el viewport completo detrás de las secciones oscuras.
- **Cómo:** GSAP ScrollTrigger con `scrub` (ya está montado en el proyecto); tres `yPercent` distintos. Sin JS adicional.

### A6 · Degradado de aurora en movimiento lento
Dos manchas radiales enormes (violeta y menta) que orbitan muy despacio detrás del contenido, tipo "aurora". CSS puro con `@keyframes` de 40 s.
- **Dónde:** secciones sólidas que hoy no tienen nada: Combos y Preguntas.
- **Coste:** cero archivos.

### A7 · Transición inclinada entre secciones *(de VOID)*
Cortes diagonales de 3-4° entre bloques, en vez de líneas rectas: la sección de arriba "entra" en la de abajo.
- **Cómo:** `clip-path: polygon(...)` en la sección, con la misma inclinación en toda la página para que se lea como sistema.

---

## B · Objetos de capa completa (una pieza domina la pantalla)

### B1 · Logotipo gigante como máscara de video *(de Nightkidz, su mejor truco)*
"DOXNETWORK" a ancho completo, y **dentro de las letras** se ve el agujero negro en movimiento; fuera de las letras, navy sólido. Es el mismo shader que ya corre en el hero, recortado por la tipografía.
- **Dónde:** cierre de la página, justo encima del pie actual (hoy la marca gigante es un degradado plano).
- **Cómo:** SVG con `<mask>` sobre el canvas del hero o sobre un WebM del agujero negro; respaldo estático si no hay WebGL.
- **Impacto:** alto. Es el remate que le falta al pie.

### B2 · Agujero negro central que atraviesa varias secciones
Un solo agujero negro **fijo en el centro de la pantalla** durante tres secciones seguidas, que crece y gira despacio mientras el contenido pasa por delante. Es el equivalente del teléfono de VOID: un objeto ancla que da continuidad.
- **Dónde:** del final de Combos hasta Garantía.
- **Cómo:** `position: sticky` con `scale` y `rotate` por scroll; la pieza ya existe (`hole-echo` en CSS y el shader del hero). Cuidado: es la capa más cara del brief; medir FPS en móvil o limitarla a ≥1024 px.

### B3 · Orbe de cromo de 60 vh como telón de sección
Uno de los orbes (`orbe-1/2/3`) a 60-70 vh, medio salido del borde derecho, detrás de la rejilla de combos. Ya los tenemos recortados; hoy se usan a 200 px.
- **Cómo:** mismo componente `Deco`, tamaños grandes y `blur(2px)` para que no compita con el texto.

### B4 · Vórtice de cromo líquido a sangre
`vortice.webp` estirado a todo el ancho como separador entre la parte digital y la física de la tienda: una franja de 40 vh, con máscara de desvanecido arriba y abajo.

### B5 · Bóveda y escudo como sellos de sección
`boveda.webp` y `escudo.webp` a 50 vh, muy tenues (8-12 %), centrados detrás del texto de Garantía y de Relojería. Funcionan como marca de agua semántica.

### B6 · Nebulosa de pantalla completa entre capítulos
`nebulosa.webp` y `velo.webp` a ancho completo como "cortina" entre dos secciones, con el contenido entrando en ella. Hoy la nebulosa se usa a 760 px en una esquina.

### B7 · Teléfono gigante con el chat real *(de VOID)*
Llevar el teléfono de "Cómo comprar" al centro y a 80 vh, con el chat de WhatsApp a tamaño legible, mientras los tres pasos pasan a su alrededor. Es la pieza que mejor explica el negocio: todo pasa por un chat.

### B8 · ASTRO a escala de página
ASTRO ocupando media pantalla (no 150 px) en dos momentos: el 404 —donde ya está— y la sección de garantía, asomando desde abajo con el escudo. Tenemos las poses en alta resolución.

---

## C · Lo que hay que producir

Lo que **ya existe** en `public/deco/` (34 piezas) cubre B3, B4, B5, B6, A4 y A5 sin generar nada nuevo.

Falta producir tres cosas:

1. **Órbitas topográficas (A2)** — SVG vectorial, lo dibujo por código, no necesita IA.
2. **Ruido de grano (A3)** — PNG de 256×256, generado con un script; tampoco necesita IA.
3. **Telones fotográficos por línea (A1)** — collage con fotos del catálogo, desenfocado en el script de imágenes.

Si más adelante se quiere un telón ilustrado por línea (una perfumería de neón, un taller de relojería, un laboratorio de gadgets), ahí sí van prompts para generar con IA; se escriben cuando se decida, siguiendo la preferencia de trabajar con prompts y no con generación automática.

---

## Orden sugerido y coste

| Prioridad | Capa | Esfuerzo | Riesgo |
| --- | --- | --- | --- |
| 1 | A2 órbitas + A3 grano | Bajo | Ninguno, es textura global |
| 2 | A6 aurora + A4 suelo de malla | Bajo | Ninguno |
| 3 | B1 logotipo con máscara de video | Medio | Necesita respaldo sin WebGL |
| 4 | B3/B4/B5/B6 piezas a 50-70 vh | Bajo | Vigilar contraste del texto |
| 5 | A1 telón desenfocado por línea | Medio | Peso en móvil |
| 6 | B7 teléfono gigante | Medio | Rehacer la sección 04 |
| 7 | A7 cortes inclinados | Medio | Toca todas las secciones |
| 8 | B2 agujero negro que atraviesa | Alto | Rendimiento en móvil |

Recomendación: 1 y 2 de una vez (son media tarde y cambian toda la página), luego 3 y 4. B2 al final, y solo si el resto ya se ve bien.
