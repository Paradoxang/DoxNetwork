# Brief de imágenes con IA · Nano Banana

Imágenes promocionales de **DoxNetwork** generadas con Nano Banana (Gemini).
Este documento dice qué piezas hacer, en qué formato, con qué estilo y con qué
prompt, y dónde dejarlas para que la web las tome sola.

> **La web ya está lista para recibirlas.** Cada imagen tiene su ruta declarada
> en el código. Mientras un archivo no exista, ese espacio se ve con el fondo de
> marca (degradado + anillos), así que se pueden ir subiendo de a una.

---

## 1. Reglas de oro

1. **Sin texto dentro de la imagen.** Ni títulos, ni precios, ni letras sueltas.
   Los textos van encima en HTML: se pueden editar, se leen bien en móvil, Google
   los indexa y la IA no los escribe con errores.
2. **Sin logos ni marcas de terceros.** Nada de Netflix, Disney, Cinemark,
   escudos de equipos ni camisetas oficiales. Hay riesgo de marca registrada y,
   además, la IA deforma los logos. Las marcas se nombran en el texto de la web.
3. **Sin interfaces reales.** Las pantallas (TV, celular, portátil) van
   encendidas pero vacías o desenfocadas, nunca mostrando una app real.
4. **Espacio libre para el texto.** Cada pieza tiene una zona segura (ver tabla).
   Ahí va fondo tranquilo, sin objetos ni detalles.
5. **Personas:** adultos jóvenes latinoamericanos, con aspecto natural y ropa
   sin marcas. Nada de menores de edad ni poses de banco de imágenes.
6. **Siempre la misma familia visual.** Todas las piezas deben parecer de la
   misma campaña (sección 2).

---

## 2. Guía visual de la marca

| Elemento | Valor |
|---|---|
| Fondo | Navy nocturno `#0f1424`, que se aclara hacia índigo `#1e2945` |
| Luz principal | Periwinkle suave `#9aa9ff` (luz de contorno) |
| Acento cálido | Dorado `#f2c46d` (chispas, brillos, un anillo) |
| Acento fresco | Menta `#74d8b0`, muy poco |
| Motivo de marca | **Dos anillos orbitales finos que se cruzan en X**, uno dorado y uno azul, como los del isotipo DN |
| Sensación | Tranquila, amable y premium. Noche cómoda, no discoteca ni neón agresivo |
| Materiales | Mate y satinado, bordes redondeados, vidrio translúcido suave |
| Luz | De estudio, suave, con bokeh leve de partículas |

**Referencia opcional:** exporta `brand/doxnetwork-icon.svg` a PNG y adjúntalo
como imagen de referencia con la instrucción *"use only the color palette and
the crossed orbital rings from the reference image, do not reproduce the
letters"*.

---

## 3. Prompt base de estilo

Pégalo **antes** de cada prompt específico. Va en inglés porque el modelo lo
sigue con más precisión.

```text
Style: premium editorial 3D-illustrated scene for a friendly digital store. Soft cosmic night atmosphere: deep navy background (#0f1424) gently fading to indigo, soft periwinkle rim light (#9aa9ff), subtle warm gold highlights (#f2c46d) and a tiny touch of mint (#74d8b0). Brand motif: two thin elegant orbital rings crossing in an X shape, one gold and one soft blue, floating around the main subject like planetary rings. Calm, welcoming and premium, never aggressive or neon. Soft studio lighting, smooth gradients, light bokeh particles, rounded shapes, matte and satin materials, realistic lighting with a slightly stylized 3D look. Clean composition with generous negative space.
Strictly no text, no letters, no numbers, no logos, no brand names, no trademarks, no watermarks, no real app interfaces; any screen must be blank or softly glowing.
```

---

## 4. Entregables

Todas van en `public/promos/`, con el nombre **exacto** de la tabla.

| # | Archivo | Dónde aparece | Proporción a pedir | Exportar a | Zona segura (sin objetos) |
|---|---|---|---|---|---|
| 1 | `promo-universitario.webp` | Carrusel, escritorio | 21:9 | 2400 × 1030 | 55% izquierdo |
| 2 | `promo-universitario-m.webp` | Carrusel, móvil | 4:5 | 1080 × 1350 | 45% inferior |
| 3 | `promo-arma-tu-combo.webp` | Carrusel, escritorio | 21:9 | 2400 × 1030 | 55% izquierdo |
| 4 | `promo-arma-tu-combo-m.webp` | Carrusel, móvil | 4:5 | 1080 × 1350 | 45% inferior |
| 5 | `promo-futbol.webp` | Carrusel, escritorio | 21:9 | 2400 × 1030 | 55% izquierdo |
| 6 | `promo-futbol-m.webp` | Carrusel, móvil | 4:5 | 1080 × 1350 | 45% inferior |
| 7 | `promo-cine.webp` | Carrusel, escritorio | 21:9 | 2400 × 1030 | 55% izquierdo |
| 8 | `promo-cine-m.webp` | Carrusel, móvil | 4:5 | 1080 × 1350 | 45% inferior |
| 9 | `combo-maraton.webp` | Tarjeta y ficha del combo | 16:9 | 1600 × 900 | Sujeto dentro del 60% central |
| 10 | `combo-universitario.webp` | Tarjeta y ficha del combo | 16:9 | 1600 × 900 | Sujeto dentro del 60% central |
| 11 | `combo-creador.webp` | Tarjeta y ficha del combo | 16:9 | 1600 × 900 | Sujeto dentro del 60% central |
| 12 | `combo-futbolero.webp` | Tarjeta y ficha del combo | 16:9 | 1600 × 900 | Sujeto dentro del 60% central |
| 13 | `combo-familia.webp` | Tarjeta y ficha del combo | 16:9 | 1600 × 900 | Sujeto dentro del 60% central |
| 14 | `combo-cita-cine.webp` | Tarjeta y ficha del combo | 16:9 | 1600 × 900 | Sujeto dentro del 60% central |
| 15 | `promo-peek.webp` | Tarjeta flotante "¿Primera vez?" | 16:9 | 800 × 450 | Sujeto centrado y pequeño |

**Por qué el 60% central en los combos:** la misma imagen se recorta a 16:7 en
el inicio, a 16:9 en móvil y a 4:3 en el catálogo. Lo que quede fuera del
centro puede perderse.

**Peso objetivo:** menos de 250 KB en escritorio, 150 KB en móvil y combos, y
80 KB en `promo-peek`. WebP con calidad 78–82.

---

## 5. Prompts por pieza

Formato de cada uno: prompt base (sección 3) + prompt de la pieza.

### Carrusel

**1 · Universitario, escritorio (21:9)**
Qué comunica: IA, diseño e inglés para estudiar; cercano y juvenil.
```text
Wide cinematic 21:9 composition. A young Latin American university student, about 21, natural look, plain unbranded hoodie, sitting at a wooden desk at night and smiling while working on a laptop whose screen is blank and softly glowing. Around the laptop float soft 3D objects without any writing: a small open notebook, a rounded speech bubble shape, a paint palette and a blank flashcard. Crossed gold and blue orbital rings circle the scene. Place the student and desk in the right 40% of the frame; keep the left 55% as calm, empty dark navy space.
```

**2 · Universitario, móvil (4:5)**
```text
Vertical 4:5 composition. Same scene and character style as before: a young Latin American university student smiling at a blank glowing laptop, soft 3D notebook, speech bubble and palette floating nearby, crossed gold and blue orbital rings. Place the subject in the upper 55% of the frame; keep the lower 45% as calm, empty dark navy gradient.
```

**3 · Arma tu combo, escritorio (21:9)**
Qué comunica: juntar piezas = ahorrar.
```text
Wide cinematic 21:9 composition. Five floating rounded glass tiles in soft coral red, violet, sky blue, green and orange, each completely blank with a softly glowing edge, clicking together into a neat staggered stack like puzzle pieces. Where the tiles connect, a small warm golden sparkle bursts, suggesting savings. Crossed gold and blue orbital rings wrap around the stack. Place the stack in the right 40% of the frame; keep the left 55% as calm, empty dark navy space.
```

**4 · Arma tu combo, móvil (4:5)**
```text
Vertical 4:5 composition. Five blank rounded glass tiles in coral, violet, sky blue, green and orange clicking together into a stack with a small golden sparkle where they join, crossed gold and blue orbital rings around them. Stack in the upper 55%; lower 45% calm, empty dark navy gradient.
```

**5 · Fútbol, escritorio (21:9)**
Qué comunica: ver todos los partidos en casa, con amigos.
```text
Wide cinematic 21:9 composition. A cozy living room at night seen from behind a sofa: a large TV shows an out-of-focus green football pitch under stadium lights, with no teams, no scoreboard and no logos. Three friends seen from behind, wearing plain unbranded yellow and blue shirts, raise their arms celebrating. A white football rests on the rug. Warm lamp light mixes with the blue glow of the TV, and faint crossed gold and blue orbital rings float in the air. Place the TV and friends in the right 45% of the frame; keep the left 55% as calm, darker empty space.
```

**6 · Fútbol, móvil (4:5)**
```text
Vertical 4:5 composition. Living room at night, friends seen from behind in plain unbranded yellow and blue shirts celebrating in front of a TV showing a blurred green football pitch with no logos or scoreboard, white football on the rug, faint crossed orbital rings. Subject in the upper 55%; lower 45% calm, dark, empty gradient.
```

**7 · Cine, escritorio (21:9)**
Qué comunica: plan de cine fácil y barato.
```text
Wide cinematic 21:9 composition. Two blank cinema tickets with no printing float above a classic red and white striped popcorn bucket with no branding; popcorn pieces are suspended mid-air. Cinema seats in soft focus behind, a projector light beam cutting through light haze. A gold orbital ring circles the bucket and a blue one crosses it. Place the bucket in the right 40% of the frame; keep the left 55% as calm, dark empty space.
```

**8 · Cine, móvil (4:5)**
```text
Vertical 4:5 composition. Blank cinema tickets floating above an unbranded red and white striped popcorn bucket, popcorn suspended mid-air, projector beam through haze, crossed gold and blue orbital rings. Subject in the upper 55%; lower 45% calm, dark, empty gradient.
```

### Combos (16:9, sujeto centrado)

Añade a cada uno: *"16:9, main subject centered and fully contained within the central 60% of the width and the central 70% of the height, even dark navy margins on all sides."*

**9 · Maratón de series**
```text
A cozy sofa corner at night with a soft knitted blanket, a bowl of popcorn and a TV remote. Three small floating blank screens glow in red, violet and sky blue above the sofa like planets, with crossed gold and blue orbital rings linking them.
```

**10 · Universitario**
```text
A three-quarter view of a tidy study desk: laptop with a blank glowing screen, open notebook with no writing, over-ear headphones and a small desk globe. Soft mint and periwinkle light, crossed gold and blue orbital rings hovering above the laptop.
```

**11 · Creador de contenido**
```text
A smartphone mounted on a mini tripod with a ring light, its screen blank and glowing, next to a small clapperboard with no writing, color swatch cards and wireless earbuds. Playful creative mood, crossed gold and blue orbital rings around the phone.
```

**12 · Fan del deporte**
```text
A classic white football resting on a dark reflective surface, with stadium floodlight bokeh behind it and a TV remote beside it. Energetic but calm lighting, crossed gold and blue orbital rings around the ball, like a planet.
```

**13 · Plan familia**
```text
A warm family living room at night with a large sofa full of cushions, a big TV with a blank soft glow, two popcorn bowls and a couple of plush toys. No people visible. Crossed gold and blue orbital rings float gently above the sofa.
```

**14 · Cita al cine**
```text
Two unbranded popcorn buckets and two soda cups with straws side by side on a cinema armrest, with warm heart-shaped bokeh from the theater lights behind them. Romantic but understated, crossed gold and blue orbital rings around the pair.
```

### Extra

**15 · Promo "¿Primera vez?" (16:9, pequeña)**
```text
16:9 minimal composition. A single small blank glowing glass ticket floating in the center with a tiny golden coin-like sparkle next to it, crossed gold and blue orbital rings around it, lots of calm dark navy space. Very simple, readable at small size.
```

---

## 6. Flujo de trabajo recomendado

1. **Primero la pieza ancla.** Genera la 1 (Universitario, escritorio) hasta
   que te guste. Esa imagen define la campaña.
2. **Úsala como referencia para las demás.** Adjúntala en cada generación nueva
   con *"match the lighting, color palette, rendering style and orbital ring
   motif of the reference image"*. Así todo parece de la misma serie.
3. **Corrige conversando en vez de regenerar.** Nano Banana edita bien sobre la
   última imagen: *"move the subject further right"*, *"remove the text on the
   notebook"*, *"make the lighting softer"*, *"make the left side emptier"*.
4. **Móvil a partir de escritorio.** Para la versión 4:5, adjunta la de
   escritorio y pide la misma escena en vertical con la zona segura abajo.
5. **Resolución.** Si usas Nano Banana Pro, pide salida 2K para el carrusel.
   Si la imagen sale pequeña, escálala antes de exportar.
6. **Marca de agua.** Según dónde generes (por ejemplo, la app de Gemini), la
   imagen puede traer una marca visible en una esquina. Genera desde Google AI
   Studio o déjala fuera de la zona visible al recortar.
7. **Exporta a WebP** con el tamaño y el peso de la tabla. Si usas Claude Code,
   la skill `web-media-builder` lo hace sola (también genera el srcset).
8. **Copia a `public/promos/`** con el nombre exacto, corre `npm run dev` y
   revisa en escritorio y móvil.

---

## 7. Revisión antes de publicar

- [ ] No hay texto, letras ni números en ninguna imagen (revisa con zoom)
- [ ] No hay logos, escudos, camisetas oficiales ni interfaces reales
- [ ] La zona segura está vacía y el título del carrusel se lee bien encima
- [ ] En los combos, el sujeto sigue visible en la tarjeta del inicio (16:7) y en el catálogo (4:3)
- [ ] Las 15 piezas parecen de la misma campaña (luz, paleta, anillos)
- [ ] Ninguna persona parece menor de edad
- [ ] Cada archivo cumple su peso objetivo
- [ ] En modo claro también se ven bien: el velo oscuro del carrusel las protege, pero revisa las tarjetas de combo
