# Prompts para las capas grandes y los objetos nuevos

Estos prompts alimentan el [brief de capas grandes](brief-capas-grandes.md). Van en inglés porque el modelo los sigue con más precisión.

Cada prompt se arma igual que en el brief de ASTRO: **REFERENCIA + BLOQUE DE ESTILO + PIEZA + SALIDA**. El bloque de estilo es obligatorio en todas; sin él, Nano Banana cambia de material, de paleta y de luz entre una generación y la siguiente, y las piezas dejan de parecer de la misma familia.

---

## 1 · Qué adjuntar como referencia

Las 34 piezas que ya están en la página salieron todas del mismo lote del portafolio, así que **ese lote es la referencia de estilo**. Están en `C:\Users\Santiago pc\Proyectos\Portafolio 2.0\`.

| Si vas a generar… | Adjunta estas dos, en este orden |
| --- | --- |
| Un **objeto** (frasco, cofre, cápsula…) | `hero_assets_chrome_orb2.png` + `WDID_asset_01_modulo.png` |
| Una **capa de luz** (telón, aurora, cortina) | `WDID_obj_10_nebulosa.png` + `SC_asset_03_particulas.png` |
| Un **icono** de categoría | `WDID_obj_01_nodo.png` + `WDID_asset_02_astrolabio.png` |

> Nunca más de dos referencias. Con tres o más el modelo promedia los materiales y el cromo se vuelve plástico.

Y con la referencia adjunta, esta instrucción:
```text
Use the attached images only as the material and lighting reference: same iridescent violet chrome, same amber inner glow, same studio lighting and same level of detail. Do not copy their shapes or composition.
```

## 2 · Bloque de estilo · OBJETO

Va delante de todo prompt de las secciones P2 y P3.

```text
STYLE — Dox Network 3D object family. A single hero object floating in empty space, sculpted in iridescent violet chrome (#7c5cff to #9aa9ff) with oil-slick rainbow reflections and a warm amber core light (#f2c46d) glowing from inside. Rounded, heavy, tactile geometry with crisp bevels; polished metal and smooth translucent glass only. Dramatic studio lighting: cool key light from the upper left, warm amber rim light from the lower right, soft contact shadow below. Centered, three-quarter view, full object inside the frame with breathing room around it. Octane-style 3D product render, ultra sharp, 8k, physically based materials.
BACKGROUND — flat neutral gray #808080, completely even, no gradient, no vignette, no floor line, no props.
NEGATIVE — no text, no letters, no numbers, no typography, no watermark, no logo, no brand names, no UI, no people, no hands, no faces, no plastic toy look, no busy background, no multiple objects.
```

## 3 · Bloque de estilo · LUZ

Va delante de todo prompt de la sección P1.

```text
STYLE — Dox Network light layer. Pure additive light on black: volumetric haze, drifting dust and soft glowing forms with no solid surfaces and no hard edges. Palette: deep navy (#0f1424) shadows, violet (#7c5cff) and periwinkle (#9aa9ff) light, amber embers (#f2c46d) as sparse accents. Cinematic depth of field, most of the frame stays dark and empty so text can sit on top. Smooth gradients with no banding, film-grade contrast, 8k.
BACKGROUND — pure black #000000 across the whole frame, no vignette, no border, no frame, edges fading naturally into black on all four sides.
NEGATIVE — no text, no letters, no numbers, no typography, no watermark, no logo, no brand names, no people, no faces, no hands, no readable product labels, no white or light background, no border.
```

## 4 · Cómo entregarlas

`brand/imagenes/deco.py` ya procesa los dos tipos de fondo, por eso son fijos: el negro se descarta solo con `mix-blend-mode: screen` y el gris plano lo recorta el script, matando además la sombra. Si el fondo cambia, toca recortar a mano.

- PNG a máxima calidad, sin compresión agresiva. Yo los paso a WebP.
- Nombre de archivo exacto, el de cada ficha.
- Si una sale con texto o con un logo inventado, se descarta: no se retoca.

---

# P1 · Capas de luz (bloque de estilo LUZ + esto)

### 1. Telón de perfumería `telon-perfumeria.png` · 3840×1600
> PIECE — Ultra-wide backdrop for a perfume section. Floating glass and chrome perfume-bottle silhouettes, unlabeled, heavily out of focus, suspended at different depths. Rose and magenta light (#ef8fb8) bleeding through the violet haze, fine golden dust, slow drifting smoke. Keep the center-left third almost empty and dark.

### 2. Telón de relojería `telon-relojeria.png` · 3840×1600
> PIECE — Ultra-wide backdrop for a luxury watch section. Blurred polished gears, sapphire crystals and watch-movement fragments suspended at different depths, no dials, no numerals. Champagne gold and amber light (#c9a46a) cutting through the haze, metallic specular sparks, slow floating dust. Keep the left half almost empty and dark.

### 3. Telón de tecnología `telon-tecnologia.png` · 3840×1600
> PIECE — Ultra-wide backdrop for a consumer tech section. Blurred circuit fragments, translucent chips and smooth earbud-like capsules floating at different depths, all screens blank. Cyan and electric blue light (#5fb8e8) with thin glowing data lines running through the haze, soft bokeh. Keep the left half almost empty and dark.

### 4. Telón digital y streaming `telon-digital.png` · 3840×1600
> PIECE — Ultra-wide backdrop for a digital subscriptions section. Dozens of blank floating glass panels and rounded tiles at many depths, all completely empty, drifting slowly. Periwinkle light (#8fa2ff) between the panels, light rays passing through them, heavy depth of field. Keep a wide dark empty corridor through the center.

### 5. Aurora de marca `aurora.png` · 2816×1536
> PIECE — Two enormous soft plumes of light crossing each other: one violet (#7c5cff), one mint (#74d8b0), with a single thin amber filament (#f2c46d) threading between them. No stars, no objects, no particles. Pure smooth volumetric gradients that dissolve into black at every edge.

### 6. Cortina de nebulosa `cortina-nebulosa.png` · 3840×1400
> PIECE — A wall of violet nebula clouds, dense along the bottom edge and dissolving completely into black toward the top, with amber embers burning deep inside. Fine particle dust and soft god rays. No stars, no planets, no objects.

---

# P2 · Objetos grandes (bloque de estilo OBJETO + esto)

Se usan a 50-70 vh de alto. Todos a **2048×2048**.

### 7. Frasco insignia `objeto-frasco.png`
> PIECE — An abstract luxury perfume bottle: faceted glass body with a heavy chrome collar and a sculpted geometric cap, amber liquid glowing inside. No label, no engraving, no brand.

### 8. Movimiento de reloj `objeto-movimiento.png`
> PIECE — An abstract open watch movement: interlocking polished gears and a rotor caught mid-spin, champagne gold accents among the violet chrome, amber light at the core. No dial, no numerals, no hands.

### 9. Cápsula de tecnología `objeto-capsula.png`
> PIECE — An abstract audio capsule: a rounded chrome pod split open to reveal a glowing cyan core, with one translucent chip floating just beside it. No screens, no ports, no branding.

### 10. Cofre de combos `objeto-cofre.png`
> PIECE — An abstract vault cube opening along one corner, chrome plates peeling apart while intense amber light escapes from inside, a few small geometric fragments suspended around it.

### 11. Burbuja de chat `objeto-burbuja.png`
> PIECE — An abstract speech bubble as a solid heavy object, mint-green light (#74d8b0) glowing from within instead of amber, with two small chrome spheres floating beside it. Empty inside, no text, no icons.

### 12. Bolsa de compra `objeto-bolsa.png`
> PIECE — An abstract shopping bag with rounded chrome handles, amber light spilling out of its open top, two small chrome spheres drifting out of it. No print, no label.

---

# P3 · Iconos 3D de categoría (bloque de estilo OBJETO + esto)

Ocho piezas, mismo encuadre para que se lean como juego. **2048×2048.** Cambia solo el objeto:

> PIECE — A single small icon-sized object: **[OBJETO]**. Simple, friendly, chunky geometry with very few details, read at a glance, centered in frame.

| Archivo | `[OBJETO]` |
| --- | --- |
| `icono-combos.png` | three stacked rounded tiles fanned out |
| `icono-series.png` | a rounded TV screen, blank |
| `icono-cine.png` | a closed film clapperboard |
| `icono-musica.png` | a music note fused with a sound wave |
| `icono-ia.png` | a brain built from soft geometric nodes |
| `icono-diseno.png` | a stylus crossing a paint palette |
| `icono-gaming.png` | a game controller |
| `icono-idiomas.png` | a globe wearing a graduation cap |

---

# P4 · Sección de vapes

Tres piezas para que `/vapes` no se vea desangelada **sin hacer publicidad del producto**. La Ley 2354 de 2024 no prohíbe vender a mayores de edad: prohíbe publicitar y promocionar. Y la política comercial de WhatsApp prohíbe tabaco y vapeadores, así que una pieza promocional circulando por ese canal pone en riesgo la cuenta por la que entran las otras cuatro líneas.

De ahí salen tres reglas para estas tres piezas, además del negativo de siempre:

- **Sin personas, sin mascota, sin manos, sin boca, sin humo ni vapor.** Nada de escenas de uso.
- **Sin marca reconocible.** El dispositivo es genérico: no puede parecer un Lost Mary, un Elf Bar ni ningún modelo real.
- **Nunca como foto de producto.** Estas piezas son arte de sección. La foto de cada referencia sigue siendo la del proveedor: si un render ocupara su lugar, el cliente estaría viendo algo que no es lo que recibe.

**Negativo extra, pegar en las tres:**
```text
no people, no hands, no mouth, no lips, no smoking, no vapor, no smoke clouds, no candy, no fruit, no cartoon characters, no mascots, no brand logos, no packaging text, no youthful or playful styling
```

### 13. Dispositivo de sección `vapes-objeto.png` · 2048×2048 · bloque OBJETO
> PIECE — A single abstract, generic vaping device standing upright: a simple rounded rectangular body with a smooth mouthpiece, no buttons, no screen, no labels, no branding of any kind. Sculpted in the same iridescent violet chrome but desaturated toward cool graphite gray (#8b93a8), with a single restrained amber light line along one edge. Serious, technical, adult product-catalog feel — not playful, not colorful.

### 14. Telón de la sección `telon-vapes.png` · 3840×1600 · bloque LUZ
> PIECE — Ultra-wide backdrop for a restricted, adults-only section. Cold graphite haze (#8b93a8) drifting over deep navy (#0f1424), with straight thin light lines like a security scan passing through the dark, and a single faint amber filament. No objects, no devices, no smoke, no clouds. Austere and quiet, most of the frame dark and empty. Clearly more sober and less inviting than the other backdrops.

### 15. Sello de verificación de edad `sello-18.png` · 2048×2048 · bloque OBJETO
> PIECE — An abstract circular seal: two concentric rings with fine technical tick marks, like a reticle, and an empty centered circular plate where a number will be placed later. Cool graphite chrome (#8b93a8) with a thin amber ring. Absolutely no text, no numbers, no letters inside or outside the seal.

**Sobre el sello, mejor por código.** El "+18" lo pongo yo en SVG encima del sello: los modelos escriben mal los números y un sello legal con el número deformado es peor que no tener sello. Si prefieres, hago el sello entero en SVG y te ahorras la generación.

---

# P5 · Portadas verticales para Shorts, TikTok y Reels

Tres portadas con ASTRO chibi, a **1080 × 1920**. A diferencia del resto del documento, estas **sí llevan fondo**: son piezas terminadas, no recortes para la web.

**Reglas de encuadre** (las tres plataformas tapan las mismas zonas):

- El personaje vive entre el **20 % y el 65 % de la altura**. Arriba va el titular, abajo la interfaz de la app.
- **Tercio inferior limpio**: ahí caen el usuario, la descripción y la música. Nada importante por debajo del 78 %.
- **Franja derecha libre** (15 % del ancho): botones de like, comentario y compartir.
- **Sin texto en la imagen.** El titular se pone después en el editor: así lo cambias por video y ninguna IA te escribe "Ofretas".

**Referencias que adjuntar:** `M_astro-chibi-master.png` siempre, más la pose de apoyo que indica cada ficha. Dos como mucho.

## Bloque de estilo · PORTADA

```text
STYLE — Dox Network vertical cover. A chibi astronaut vinyl-toy character: big rounded helmet with a dark visor, glowing LED face, matte violet suit with thin orange trim, short stubby limbs, soft studio lighting and a gentle rim light. Deep navy space background (#0f1424) with a violet nebula glow (#7c5cff), a few amber embers (#f2c46d) and soft bokeh dust; a faint dark ring like an eclipse behind the character. The character is sharp and fully lit; the background stays soft and out of focus. Poster-quality 3D render, 8k, clean and friendly, not creepy.
FRAMING — vertical 9:16. Character centered horizontally, occupying from 20% to 65% of the frame height. Bottom third almost empty, only background. Right edge kept clear of detail. Generous empty space above the character's head.
NEGATIVE — no text, no letters, no numbers, no logos, no watermark, no UI elements, no borders, no frames, no extra characters, no human hands, no cropped limbs, character must not touch the edges of the frame.
```

### 16. Favoritos `portada-favoritos.png` · referencia extra: `M_astro-favoritos.png`
> PIECE — The chibi astronaut holding a large glowing amber heart against its chest with both hands, LED face showing heart-shaped eyes and a wide smile, leaning slightly forward. Small hearts floating around it, dissolving into the nebula.
> **Para videos de:** lo más querido, "los 5 perfumes que más me piden", recomendaciones.

### 17. Mareado `portada-mareado.png` · referencia extra: `astro-expresiones.png` (cara E8)
> PIECE — The chibi astronaut tumbling slowly head-over-heels in zero gravity, arms loose, LED face with spiral swirl eyes and a wavy unsure mouth, small stars orbiting its helmet. Slight motion blur only on the limbs; the helmet and face stay sharp.
> **Para videos de:** "me estafaron en otra tienda", errores comunes, precios que no cuadran, antes/después.

### 18. Celebrando `portada-celebra.png` · referencia extra: `M_astro-celebra.png`
> PIECE — The chibi astronaut jumping with both arms raised in victory, LED face with star-shaped eyes and an open smile, confetti of small violet and amber geometric shards bursting outward and drifting up.
> **Para videos de:** pedido entregado, "ya llegó", lanzamientos, descuentos nuevos, reseñas.

**Salida:** `OUTPUT — 1080 x 1920 pixels, vertical 9:16, PNG.`

Con las tres portadas hechas, el titular se monta encima en el editor, en Oxanium a dos líneas como los de la tienda, y el tercio inferior se deja libre.

---

# Ejemplo armado (copiar tal cual)

Así queda el telón de perfumería con todo junto. El resto se arma igual: bloque + pieza + salida.

```text
Use the attached images only as the material and lighting reference: same iridescent violet chrome, same amber inner glow, same studio lighting and same level of detail. Do not copy their shapes or composition.

STYLE — Dox Network light layer. Pure additive light on black: volumetric haze, drifting dust and soft glowing forms with no solid surfaces and no hard edges. Palette: deep navy (#0f1424) shadows, violet (#7c5cff) and periwinkle (#9aa9ff) light, amber embers (#f2c46d) as sparse accents. Cinematic depth of field, most of the frame stays dark and empty so text can sit on top. Smooth gradients with no banding, film-grade contrast, 8k.
BACKGROUND — pure black #000000 across the whole frame, no vignette, no border, no frame, edges fading naturally into black on all four sides.
NEGATIVE — no text, no letters, no numbers, no typography, no watermark, no logo, no brand names, no people, no faces, no hands, no readable product labels, no white or light background, no border.

PIECE — Ultra-wide backdrop for a perfume section. Floating glass and chrome perfume-bottle silhouettes, unlabeled, heavily out of focus, suspended at different depths. Rose and magenta light (#ef8fb8) bleeding through the violet haze, fine golden dust, slow drifting smoke. Keep the center-left third almost empty and dark.

OUTPUT — 3840 x 1600 pixels, ultra-wide horizontal, PNG.
```

---

# Lo que NO conviene generar con IA

- **Órbitas de fondo** y **grano de película**: los hago por código, pesan menos y no tienen ruido de compresión.
- **Suelo de rejilla en perspectiva**: ya existe (`malla.webp`).
- **Vórtice, orbes, cristales, escudo, llave, bóveda, astrolabio, nave, sello**: ya están recortados en `public/deco/`.
- **Logotipo gigante con el agujero negro dentro**: es una máscara SVG sobre el shader que ya corre, no una imagen.

# Orden si generas por tandas

1. Telones 1-4: son los que cambian las páginas de colección.
2. Aurora y cortina (5-6): dan fondo a las secciones del inicio que hoy están planas.
3. Objetos 7-12.
4. Los ocho iconos, solo si quieres renovar las categorías digitales.

Con la primera tanda lista en una carpeta, yo la proceso, la convierto a WebP y la monto donde dice el brief.
