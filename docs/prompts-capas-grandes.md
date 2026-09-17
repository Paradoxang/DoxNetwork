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
