# Prompts para las capas grandes y los objetos nuevos

Estos prompts alimentan el [brief de capas grandes](brief-capas-grandes.md). Están en inglés porque los modelos responden mejor, pero las notas van en español.

## Cómo entregarlos para que entren sin trabajo extra

`brand/imagenes/deco.py` ya sabe procesar dos tipos de fondo. Respetarlos ahorra recortar a mano:

| Familia | Fondo que debe tener el render | Qué hace el script |
| --- | --- | --- |
| **Luz** (nebulosas, rejillas, partículas, auroras) | **Negro puro #000000**, sin viñeta gris | Lo deja tal cual; en la página va con `mix-blend-mode: screen` y el negro desaparece |
| **Objeto** (orbes, frascos, cascos, cofres) | **Gris plano #808080**, luz de estudio, sombra suave permitida | Recorta el gris, mata la sombra y deja PNG con transparencia |

Reglas para todos:
- **Sin texto, sin letras, sin logos, sin marcas reales.** Si el modelo mete tipografía, se descarta.
- Paleta de la casa: navy `#0f1424`, violeta `#7c5cff`, lila `#9aa9ff`, ámbar `#f2c46d`, menta `#74d8b0`.
- Material de la familia Dox: cromo iridiscente violeta-lila con luz interior ámbar, tipo render 3D de estudio (es el acabado de las piezas que ya tenemos).
- Guardar en PNG a máxima calidad, sin compresión agresiva. Yo los convierto a WebP.
- Nombre de archivo = el que dice cada ficha, así los engancho directo.

**Negativo común** (pegar al final si el modelo lo acepta):
`no text, no letters, no typography, no watermark, no logo, no brand names, no people, no faces, no hands, no clutter, no busy background, not photorealistic product photo`

---

# P1 · Lo que más cambia la página

### 1. Telón de perfumería `telon-perfumeria.png` — 3840×1600, fondo negro
> Ultra-wide abstract backdrop for a perfume section. Floating glass and chrome perfume-bottle silhouettes, no labels, softly out of focus, suspended in dark space. Rose and magenta volumetric light (#ef8fb8) bleeding into deep navy (#0f1424), fine golden dust particles, subtle smoke. Cinematic depth of field, most of the frame is empty dark space so text stays readable. Pure black background, no vignette. 3D render, studio lighting, 8k detail.

### 2. Telón de relojería `telon-relojeria.png` — 3840×1600, fondo negro
> Ultra-wide abstract backdrop for a luxury watch section. Floating polished gears, sapphire crystals and watch movement parts, blurred and suspended in dark space, no dials with numbers, no branding. Warm amber and champagne gold light (#c9a46a) over deep navy (#0f1424), metallic specular highlights, slow drifting dust. Cinematic depth of field, wide empty dark areas for text. Pure black background. 3D render, studio lighting, 8k detail.

### 3. Telón de tecnología `telon-tecnologia.png` — 3840×1600, fondo negro
> Ultra-wide abstract backdrop for a consumer tech section. Floating circuit fragments, translucent chips and wireless-earbud silhouettes, blurred, suspended in dark space, no logos or screens with content. Cyan and electric blue light (#5fb8e8) over deep navy (#0f1424), thin glowing data lines, soft bokeh. Cinematic depth of field, large empty dark regions. Pure black background. 3D render, 8k detail.

### 4. Telón digital / streaming `telon-digital.png` — 3840×1600, fondo negro
> Ultra-wide abstract backdrop for a digital subscriptions section. Dozens of blank floating glass screens and rounded app tiles at different depths, completely empty, no icons or text, drifting in dark space. Violet and periwinkle light (#8fa2ff) over deep navy (#0f1424), soft glow, light rays between panels. Heavy depth of field, wide dark empty area in the center. Pure black background. 3D render, 8k detail.

### 5. Aurora de marca `aurora.png` — 2816×1536, fondo negro
> Wide abstract aurora of light, two large soft plumes crossing: one violet (#7c5cff) and one mint (#74d8b0), with a thin amber (#f2c46d) filament between them. Smooth volumetric gradients, no hard edges, no stars, no objects. Feels like a slow nebula lit from inside. Pure black background, seamless soft falloff at all edges. 3D render, 8k, extremely smooth gradients, no banding.

### 6. Cortina de nebulosa a sangre `cortina-nebulosa.png` — 3840×1400, fondo negro
> Ultra-wide wall of violet nebula clouds, dense at the bottom and dissolving into black at the top, with embers of amber light inside. Fine particle dust, volumetric god rays, no stars, no planets, no objects. Pure black background. Cinematic space photography look, 3D render, 8k detail.

---

# P2 · Objetos grandes (se usan a 50-70 vh de alto)

Todos con **fondo gris plano #808080** y luz de estudio.

### 7. Frasco insignia de perfumería `objeto-frasco.png` — 2048×2048
> A single abstract luxury perfume bottle sculpted in iridescent violet chrome with rose-pink reflections and a warm amber glow inside the liquid. Faceted glass cap, no label, no text, no brand. Floating, three-quarter view, dramatic studio lighting with soft shadow below. Flat neutral gray background #808080. High-end 3D product render, octane, 8k.

### 8. Movimiento de reloj `objeto-movimiento.png` — 2048×2048
> An abstract open watch movement: interlocking polished gears and a spinning rotor, sculpted in violet chrome with champagne gold accents and an amber glow at its core. No dial, no numbers, no brand. Floating, three-quarter view, dramatic studio lighting, soft shadow. Flat neutral gray background #808080. High-end 3D render, octane, 8k.

### 9. Cápsula de tecnología `objeto-capsula.png` — 2048×2048
> An abstract futuristic audio capsule: a rounded chrome pod opening to reveal a glowing cyan core, with a floating translucent chip beside it. Violet iridescent chrome, cyan inner light. No logos, no text, no brand. Floating, dramatic studio lighting, soft shadow. Flat neutral gray background #808080. 3D render, octane, 8k.

### 10. Cofre de combos `objeto-cofre.png` — 2048×2048
> An abstract vault-cube opening at its corner, violet iridescent chrome plates with an intense amber light escaping from inside, small geometric fragments floating around it. No text, no numbers, no logos. Floating, three-quarter view, studio lighting, soft shadow. Flat neutral gray background #808080. 3D render, octane, 8k.

### 11. Burbuja de chat `objeto-burbuja.png` — 2048×2048
> An abstract 3D speech bubble sculpted in violet iridescent chrome with a soft mint-green inner glow (#74d8b0), rounded and heavy like a physical object, with two small floating chrome dots beside it. No text inside, no icons, no logos. Floating, studio lighting, soft shadow. Flat neutral gray background #808080. 3D render, octane, 8k.

### 12. Bolsa de compra `objeto-bolsa.png` — 2048×2048
> An abstract shopping bag sculpted in violet iridescent chrome, with rounded handles and a warm amber glow spilling from its opening, a few small chrome spheres floating out of it. No text, no logo, no branding. Floating, three-quarter view, studio lighting, soft shadow. Flat neutral gray background #808080. 3D render, octane, 8k.

---

# P3 · Iconos 3D de categoría (opcional, 8 piezas)

Mismo encuadre para las ocho, para que se lean como juego. **2048×2048, fondo gris #808080.** Cambia solo el objeto:

> A single small abstract 3D icon of **[OBJETO]**, sculpted in violet iridescent chrome with a warm amber inner glow, rounded friendly geometry, centered, floating, soft shadow below. No text, no logos, no brand marks. Flat neutral gray background #808080. Studio lighting, 3D icon render, octane, 8k.

| Archivo | `[OBJETO]` |
| --- | --- |
| `icono-combos.png` | three stacked rounded tiles fanned out |
| `icono-series.png` | a rounded TV screen with no content |
| `icono-cine.png` | a film clapperboard, closed |
| `icono-musica.png` | a music note fused with a sound wave |
| `icono-ia.png` | a brain made of soft geometric nodes |
| `icono-diseno.png` | a stylus crossing a paint palette |
| `icono-gaming.png` | a game controller |
| `icono-idiomas.png` | a globe with a graduation cap |

---

# Lo que NO hay que generar con IA

Para no gastar generaciones:
- **Órbitas de fondo** y **grano de película**: los hago por código (SVG y ruido generado), pesan menos y se ven mejor.
- **Suelo de rejilla en perspectiva**: ya lo tenemos (`malla.webp`).
- **Vórtice de cromo, orbes, cristales, escudo, llave, bóveda, astrolabio, nave**: ya están recortados en `public/deco/`.
- **Logotipo gigante con el agujero negro dentro**: es una máscara SVG sobre el shader que ya corre, no una imagen.

# Orden si vas a generar por tandas

1. Los cuatro telones (1-4): son los que cambian las páginas de colección.
2. Aurora (5) y cortina (6): dan fondo a las secciones del inicio que hoy están planas.
3. Objetos 7-12, en ese orden.
4. Los ocho iconos, solo si quieres renovar las categorías digitales.

Cuando tengas la primera tanda, déjala en la carpeta del portafolio o en una nueva y yo la proceso, la convierto a WebP y la monto en las secciones que dice el brief.
