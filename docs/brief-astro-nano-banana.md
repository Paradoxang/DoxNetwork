# ASTRO · Brief de poses para Nano Banana

ASTRO es el avatar de DoxNetwork: astronauta 3D tipo figura de vinilo, traje
morado mate con líneas naranjas y cara LED en el visor.

Este brief parte de las **referencias ya aprobadas** y sirve para generar el
resto de poses y la versión chibi sin que el personaje cambie.

---

## 1. Referencias aprobadas

Guárdalas con estos nombres. Son las únicas que se adjuntan.

| Archivo | Qué es |
|---|---|
| `astro-master.png` | Frente, cuerpo entero, cara LED sonriente (la maestra) |
| `astro-vista-34.png` | Tres cuartos, cuerpo entero |
| `astro-vista-perfil.png` | Perfil lateral |
| `astro-vista-espalda.png` | Espalda, con la mochila |
| `astro-expresiones.png` | Hoja de 8 caras LED (solo cascos) |

### Códigos de cara LED

La hoja de expresiones, leída de izquierda a derecha y de arriba abajo:

| Código | Cara | Úsala para |
|---|---|---|
| **E1** | Ojos redondos + sonrisa pequeña | Neutral amable |
| **E2** | Ojos ^ ^ + sonrisa grande abierta | Saludo, alegría |
| **E3** | Guiño + sonrisa pequeña | Complicidad, "listo" |
| **E4** | Ojos de anillo con pupila + boca en O | Sorpresa |
| **E5** | Ojos de estrella + sonrisa abierta | Emoción, ofertas |
| **E6** | Ojos de corazón + sonrisa pequeña | Favoritos, gracias |
| **E7** | Ojos cuadrados mirando arriba + boca recta | Pensando |
| **E8** | Ojos en espiral + boca ondulada | Mareado, error |

---

## 2. Qué adjuntar en cada generación

Siempre **dos imágenes**, en este orden:

1. **Imagen 1 · el cuerpo:** la vista más parecida al ángulo de la pose.
   - Pose de frente → `astro-master.png`
   - Pose girada → `astro-vista-34.png`
   - Pose de lado → `astro-vista-perfil.png`
   - Pose de espaldas → `astro-vista-espalda.png`
2. **Imagen 2 · la cara:** `astro-expresiones.png`

> No adjuntes más de dos. Con tres o más el modelo promedia los diseños y el
> traje empieza a cambiar.

---

## 3. Bloques fijos

Cada prompt = **REFERENCIAS + ADN + POSE + SALIDA**. En la sección 4 ya van
armados; estos bloques sirven para inventar poses nuevas.

### REFERENCIAS
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
```

### ADN
```text
Character: ASTRO, a stylized 3D astronaut mascot that looks like a premium vinyl toy rendered in Blender Cycles. Chunky rounded proportions with a big round helmet. Matte soft-touch purple suit in one muted violet tone. Thin glowing orange-amber trim lines outline the rounded chest plate, the shoulder pads, the forearm bands, the boot tops and the boot soles. The chest plate has a small control box with two round knobs and two tiny pink lights, plus two small pink light slits at its top corners. Round shoulder pads with slotted circular bolts, rounded elbow pads, a silver metallic neck ring with a small latch, a waist band, a triangular hip plate, rounded knee pads, chunky boots and chunky four-finger gloves with a small glowing slot on the forearm. Rounded rectangular backpack with soft panel lines, a small glowing orange slit at the top center and a round button on each side. Round purple helmet with two short orange LED slits on top, a small orange slit above the visor, and large round ear discs on the sides. Large glossy black visor with a soft reflection, showing a dark purple nebula, tiny stars and a small black hole with an orange ring in the upper right corner. The face is a glowing pixel LED screen on the visor: lavender eyes and an orange dot-matrix mouth.
```

### SALIDA · cuerpo entero · 3:4
```text
Soft studio lighting identical to the references, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line, no props unless described. Full body visible with generous empty margin around the silhouette. No text, no letters, no numbers, no logos, no watermark. No human face inside the helmet. Correct anatomy: two arms, two legs, chunky gloves with four fingers.
```

---

## 4. Poses · 3:4 (salvo el busto)

### 4.1 `astro-saludo` · Hero / bienvenida
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E2
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: facing the camera, waving hello with the right hand raised high above the helmet with an open palm, left arm relaxed at the side, slight head tilt, weight on one leg, cheerful body language.
LED face: E2 from image 2 (happy ^ ^ eyes and a big open smile).
[SALIDA · cuerpo entero]
```

### 4.2 `astro-senala` · Promos y llamados a la acción
**Adjuntar:** `astro-vista-34.png` + `astro-expresiones.png` · **Cara:** E1
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: body in the same three-quarter angle as image 1, pointing to the right edge of the frame with the whole right arm extended and the index finger out, left glove resting on the hip, leaning slightly forward with a confident stance.
LED face: E1 from image 2 (round eyes and a small smile).
[SALIDA · cuerpo entero]
```

### 4.3 `astro-pulgar` · Aviso "agregado al carrito"
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E3
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: facing the camera, giving a big thumbs up with the right glove held in front of the chest, left arm relaxed, small playful knee bend.
LED face: E3 from image 2 (wink and a small smile).
[SALIDA · cuerpo entero]
```

### 4.4 `astro-celebra` · Combos y descuentos
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E5
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: facing the camera, jumping in the air with both arms raised in celebration, knees bent, a few small golden sparkles around the helmet, soft round shadow on the ground below.
LED face: E5 from image 2 (star eyes and an open smile).
[SALIDA · cuerpo entero]
```

### 4.5 `astro-piensa` · Buscador sin resultados
**Adjuntar:** `astro-vista-34.png` + `astro-expresiones.png` · **Cara:** E7
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: body in the same three-quarter angle as image 1, thinking, right glove touching the lower edge of the helmet, left arm crossed under it, head slightly tilted up, one small glowing orange spark floating next to the helmet.
LED face: E7 from image 2 (square eyes looking up and a flat line mouth).
[SALIDA · cuerpo entero]
```

### 4.6 `astro-sorpresa` · Ofertas nuevas / precio rebajado
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E4
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: facing the camera, leaning back in surprise with both gloves raised at shoulder height and fingers spread, one foot lifted slightly.
LED face: E4 from image 2 (surprised ring eyes and a small O mouth).
[SALIDA · cuerpo entero]
```

### 4.7 `astro-cine` · Pines de cine
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E2
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: facing the camera, holding a red and white striped popcorn bucket with no branding in the left arm with a few popcorn pieces popping out, and holding up a blank cinema ticket with no printing in the right glove.
LED face: E2 from image 2 (happy ^ ^ eyes and a big open smile).
[SALIDA · cuerpo entero]
```

### 4.8 `astro-laptop` · IA y software
**Adjuntar:** `astro-vista-34.png` + `astro-expresiones.png` · **Cara:** E1
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: body in the same three-quarter angle as image 1, floating in zero gravity sitting cross-legged in the air, typing on a small rounded laptop with a blank softly glowing screen resting on the legs, backpack visible behind.
LED face: E1 from image 2 (round eyes and a small smile).
[SALIDA · cuerpo entero]
```

### 4.9 `astro-escudo` · Garantía
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E1
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: facing the camera, standing proud and firm with feet apart, holding a rounded glowing mint-green shield with a simple check mark shape in front of the chest with both gloves.
LED face: E1 from image 2 (round eyes and a small smile).
[SALIDA · cuerpo entero]
```

### 4.10 `astro-soporte` · Botón de WhatsApp / ayuda
**Adjuntar:** `astro-vista-34.png` + `astro-expresiones.png` · **Cara:** E2
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: body in the same three-quarter angle as image 1, holding a smartphone with a blank glowing screen next to the ear disc of the helmet as if on a phone call, waving toward the camera with the free glove, relaxed friendly stance.
LED face: E2 from image 2 (happy ^ ^ eyes and a big open smile).
[SALIDA · cuerpo entero]
```

### 4.11 `astro-favoritos` · Favoritos y "gracias"
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E6
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: facing the camera, hugging a big soft glowing orange heart shape against the chest with both arms, slight head tilt.
LED face: E6 from image 2 (heart eyes and a small smile).
[SALIDA · cuerpo entero]
```

### 4.12 `astro-404` · Página no encontrada
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E8
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Pose: floating upside down in zero gravity with arms and legs spread out, a loose silver safety cord curling around the body, no ground shadow.
LED face: E8 from image 2 (spiral eyes and a wavy mouth), shown upside down together with the helmet.
[SALIDA · cuerpo entero]
```

### 4.13 `astro-despedida` · Pie de página / "vuelve pronto"
**Adjuntar:** `astro-vista-espalda.png` + `astro-expresiones.png` · **Cara:** E3
```text
Image 1 is the exact character reference for ASTRO seen from behind: keep the same character design, backpack, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet.
[ADN]
Pose: walking away from the camera, seen mostly from behind with the backpack visible, turning the helmet over the right shoulder to look back at the camera and waving goodbye with the right glove raised.
LED face: E3 from image 2 (wink and a small smile), visible on the part of the visor turned toward the camera.
[SALIDA · cuerpo entero]
```

### 4.14 `astro-busto` · Avatar de chat y redes · **1:1**
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E2
```text
Image 1 is the exact character reference for ASTRO: keep the same character design, proportions, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style, displayed on the visor over the dark purple nebula with the small black hole in the upper right corner.
[ADN]
Framing and pose: upper body portrait from the waist up, facing the camera, slight head tilt, right glove waving next to the helmet.
LED face: E2 from image 2 (happy ^ ^ eyes and a big open smile).
Soft studio lighting identical to the references, subtle rim light. Plain flat uniform light gray background (#d9d9d9). Centered with even margin. No text, no letters, no numbers, no logos, no watermark. No human face inside the helmet.
```

---

## 5. Versión chibi

### 5.1 Chibi maestra · 1:1 · `astro-chibi-master.png`
**Adjuntar:** `astro-master.png` + `astro-expresiones.png` · **Cara:** E1
```text
Image 1 is the exact character reference for ASTRO: use it for design, materials, colors and render style. Image 2 is the approved LED face expression sheet.
Create a chibi version of this character: super-deformed proportions where the round helmet is about half of the total height, a tiny rounded body, short stubby arms and legs, oversized chunky gloves and boots. Keep every signature detail but simplified and bigger: matte purple suit, glowing orange-amber trim lines on the chest plate, shoulders and boots, the chest control box with two knobs, the silver neck ring, the small backpack, the two orange LED slits on top of the helmet, the round ear discs, and the glossy black visor with purple nebula and a small black hole with an orange ring.
Pose: standing and waving with one hand, slight head tilt.
LED face: E1 from image 2, slightly larger on the visor.
Soft studio lighting identical to the references, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), full body centered with generous margin. No text, no letters, no numbers, no logos, no watermark.
```

### 5.2 Stickers chibi · 1:1
**Adjuntar:** `astro-chibi-master.png` + `astro-expresiones.png`

Plantilla (cambia solo las dos últimas líneas):
```text
Image 1 is the exact chibi character reference: keep the same chibi proportions, design, materials, colors, lighting and render style. Image 2 is the approved LED face expression sheet: copy the requested face exactly, in the same glowing pixel style.
Soft studio lighting identical to the references, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), full body centered with generous margin. No text, no letters, no numbers, no logos, no watermark.
Pose: ...
LED face: ...
```

| Archivo | Pose | LED face |
|---|---|---|
| `chibi-hola` | `waving with both gloves above the helmet, tiny hop` | `E2 from image 2` |
| `chibi-guino` | `giving a thumbs up with one oversized glove` | `E3 from image 2` |
| `chibi-corazon` | `hugging a big soft glowing orange heart shape` | `E6 from image 2` |
| `chibi-sorpresa` | `both gloves on the sides of the helmet, leaning back` | `E4 from image 2` |
| `chibi-piensa` | `sitting on the ground, one glove on the chin area of the helmet` | `E7 from image 2` |
| `chibi-combo` | `juggling three small glowing rounded tiles in coral, violet and sky blue` | `E5 from image 2` |
| `chibi-cohete` | `riding a tiny rounded purple and orange cartoon rocket with a soft flame` | `E2 from image 2` |
| `chibi-mareado` | `sitting dizzy on the ground with small orbiting stars around the helmet` | `E8 from image 2` |

---

## 6. Si algo se desvía (corrige sobre la última imagen)

| Problema | Frase para corregir |
|---|---|
| Cambió el traje | `Keep this pose, but restore the suit details exactly as in image 1: chest plate shape, control box, orange trim lines, knee pads and backpack.` |
| Cara distinta a la hoja | `Keep everything, but replace the LED face with face E# from image 2, exactly the same shapes and pixel style.` |
| Perdió la nebulosa o el agujero negro | `Keep everything, but restore the dark purple nebula and the small black hole with an orange ring in the upper right corner of the visor.` |
| Cara no LED | `The face must be a glowing pixel LED screen on the visor, not a drawn or human face.` |
| Muy realista | `More stylized, like a premium vinyl toy: rounder shapes and softer matte materials.` |
| Se ve plano | `3D render in Blender Cycles with soft global illumination and matte soft-touch plastic, same as image 1.` |
| Se giró hacia la cámara | `Keep the body angle of image 1; do not rotate the character to face the camera.` |
| Salió texto o logo | `Remove all text, letters and logos. Keep everything else the same.` |
| Fondo distinto | `Change only the background to plain flat uniform light gray #d9d9d9.` |

---

## 7. Entrega para la web

1. Revisa con zoom traje, mochila, visor y cara contra las referencias.
2. Recorta el fondo gris y exporta en PNG con transparencia.
3. Guarda cada imagen con el nombre de la sección 4 o 5 y pásamelas: las convierto
   a WebP y las integro con sus animaciones.
