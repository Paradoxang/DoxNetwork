# ASTRO · Prompts para Nano Banana (a partir de la imagen maestra)

**Imagen maestra aprobada:** `astro-master.png` — ASTRO de cuerpo entero, de pie
y de frente, estilo figura de vinilo 3D, sobre fondo gris claro.

Cada prompt de este documento se copia y pega; donde diga `[ADN]` o `[SALIDA]`,
pega el bloque fijo con ese nombre (sección 1).
**En cada generación adjunta `astro-master.png`** (o `astro-chibi-master.png`
en los chibis). Adjunta una sola referencia por imagen.

---

## 1. Estructura de cada prompt

```
[REFERENCIA]   Qué debe copiar de la imagen adjunta
[ADN]          Descripción exacta de la maestra (fija)
[POSE]         Qué hace ASTRO
[CARA LED]     Qué expresión muestra el visor
[SALIDA]       Encuadre, fondo y prohibiciones (fija)
```

Los bloques REFERENCIA, ADN y SALIDA no cambian nunca. Solo cambian POSE y
CARA LED. Abajo, cada prompt ya viene armado.

### Bloques fijos (por si quieres armar poses nuevas)

**REFERENCIA**
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
```

**ADN**
```text
Character: ASTRO, a stylized 3D astronaut mascot that looks like a premium vinyl toy rendered in Blender Cycles. Chunky rounded proportions with a big round helmet. Matte soft-touch purple suit in one muted violet tone. Thin glowing orange-amber trim lines outline the rounded chest plate, the shoulder pads, the forearm bands and the tops and soles of the boots. The chest plate has a small control box with two round knobs and two tiny pink lights, plus two small pink light slits at its top corners. Round shoulder pads with slotted circular bolts, a silver metallic neck ring with a small latch, a rounded backpack, a waist band, a triangular hip plate, rounded knee pads, chunky boots and chunky four-finger gloves with a small glowing wrist slot on the left forearm. Round purple helmet with two short orange LED slits on top and round ear discs on the sides. Large glossy black visor with a soft reflection, showing a dark purple nebula, tiny stars and a small black hole with an orange ring in the upper right corner. The face is displayed on the visor as a glowing pixel LED screen: rounded square lavender eyes and an orange dot-matrix mouth.
```

**SALIDA**
```text
Soft studio lighting identical to the reference, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line, no props unless described. Full body visible with generous empty margin around the silhouette. No text, no letters, no numbers, no logos, no watermark. No human face inside the helmet. Correct anatomy: two arms, two legs, chunky gloves with four fingers.
```

---

## 2. Hojas de referencia (genéralas primero)

### 2.1 Turnaround · 16:9 · `astro-turnaround.png`
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style.
[ADN]
Character turnaround sheet: the same character in the same relaxed standing pose shown four times in one row, evenly spaced and at the same scale: front view, three-quarter view facing left, side profile facing left, and back view showing the backpack. Neutral happy LED face on the visible views.
Plain flat uniform light gray background (#d9d9d9). No text, no labels, no numbers, no logos, no watermark.
```

### 2.1b Vistas sueltas · 3:4 (alternativa al turnaround en una sola imagen)

Una imagen por vista, con `astro-master.png` adjunta. Cada prompt completo:
REFERENCIA de vista + [ADN] + VISTA + [SALIDA].

**`astro-vista-34.png` · tres cuartos**
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the camera angle.
[ADN]
View: three-quarter view, the whole body rotated about 45 degrees to the left of the camera, same relaxed standing pose and neutral arms as the reference. The visor is visible at an angle with the happy LED face, the left shoulder pad closer to the camera, and the side of the backpack visible behind the right shoulder.
[SALIDA]
```

**`astro-vista-perfil.png` · perfil lateral**
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the camera angle.
[ADN]
View: strict side profile facing left, exactly 90 degrees from the front, same relaxed standing pose with arms hanging naturally. Show the rounded curve of the visor from the side with only a hint of the LED glow, the round ear disc in the center of the helmet side, the depth of the rounded backpack behind the body, and the orange trim lines following the side of the shoulder pad, forearm and boot.
[SALIDA]
```

**`astro-vista-espalda.png` · de espaldas**
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the camera angle.
[ADN]
View: back view, the character facing directly away from the camera, same relaxed standing pose. The visor and face are not visible. Show the back of the round helmet with the two orange LED slits continuing on top, the round ear discs on both sides, the rounded purple backpack as the main element with a few soft panel lines and small glowing orange trim details, the back of the silver neck ring, the waist band, and the backs of the gloves, knee area and boots with their orange trim lines.
[SALIDA]
```

### 2.2 Hoja de expresiones LED · 16:9 · `astro-expresiones.png`
```text
Use the attached image as the exact character reference. Keep the exact helmet, visor, nebula and small black hole design.
Close-up expression sheet of the character's helmet only, front view, shown eight times in two rows of four, same size and lighting. Each visor shows a different glowing pixel LED face with lavender eyes and an orange dot-matrix mouth: 1 happy smile, 2 big grin with curved ^ ^ eyes, 3 wink, 4 surprised round eyes with small O mouth, 5 star-shaped eyes with open smile, 6 heart-shaped eyes, 7 thinking eyes looking up with a flat line mouth, 8 dizzy spiral eyes with a wavy mouth.
Plain flat uniform light gray background (#d9d9d9). No text, no labels, no numbers, no logos, no watermark.
```

---

## 3. Poses · 3:4 · con `astro-master.png` adjunta

### 3.1 Saludo · `astro-saludo` · Hero / bienvenida
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: waving hello with the right hand raised high above the helmet, open palm, left arm relaxed at the side, slight head tilt, weight on one leg, cheerful body language.
LED face: happy curved ^ ^ eyes and a wide orange dot-matrix smile.
[SALIDA]
```

### 3.2 Señala · `astro-senala` · Promos y llamados a la acción
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: body turned three-quarters, pointing to the right edge of the frame with the whole right arm extended and index finger out, left hand resting on the hip, leaning slightly forward.
LED face: bright open rounded eyes and a confident smile.
[SALIDA]
```

### 3.3 Pulgar arriba · `astro-pulgar` · Aviso "agregado al carrito"
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: giving a big thumbs up toward the camera with the right glove held in front of the chest, left arm relaxed, small playful knee bend.
LED face: left eye winking as a curved line, right eye open, and a smile.
[SALIDA]
```

### 3.4 Celebra · `astro-celebra` · Combos y descuentos
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: jumping in the air with both arms raised in celebration, knees bent, a few small golden sparkles around the character, soft shadow on the ground below.
LED face: glowing star-shaped eyes and a big open orange smile.
[SALIDA]
```

### 3.5 Piensa · `astro-piensa` · Buscador sin resultados
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: thinking, right glove touching the lower edge of the helmet, left arm crossed under it, head tilted, one small glowing orange spark floating next to the helmet.
LED face: both eyes looking up to one side and a short flat orange line mouth.
[SALIDA]
```

### 3.6 Cine · `astro-cine` · Pines de cine
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: holding a red and white striped popcorn bucket with no branding in the left arm, a few popcorn pieces popping out, and holding up a blank cinema ticket with no printing in the right hand.
LED face: excited wide eyes and an open smile.
[SALIDA]
```

### 3.7 Portátil · `astro-laptop` · IA y software
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: floating in zero gravity sitting cross-legged in the air, typing on a small rounded laptop with a blank softly glowing screen resting on the legs.
LED face: focused happy half-closed eyes and a small smile.
[SALIDA]
```

### 3.8 Escudo · `astro-escudo` · Garantía
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: standing proud and firm, holding a rounded glowing mint-green shield with a simple check mark shape in front of the chest with both gloves.
LED face: calm confident eyes and a gentle smile.
[SALIDA]
```

### 3.9 Soporte · `astro-soporte` · Botón de WhatsApp / ayuda
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: holding a smartphone with a blank glowing screen next to the side of the helmet as if on a phone call, waving with the free hand, friendly relaxed stance.
LED face: friendly open eyes and an open talking mouth shape.
[SALIDA]
```

### 3.10 Perdido · `astro-404` · Página no encontrada
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the pose and the LED face expression.
[ADN]
Pose: floating upside down in zero gravity with arms and legs spread out, a loose silver safety cord curling around the body, no ground shadow.
LED face: dizzy spiral eyes and a wavy orange mouth.
[SALIDA]
```

### 3.11 Busto · `astro-busto` · Avatar de chat y redes · **1:1**
```text
Use the attached image as the exact character reference. Keep the same character design, proportions, materials, colors, lighting and render style. Only change the framing, pose and LED face expression.
[ADN]
Framing and pose: upper body portrait from the waist up, facing the camera, slight head tilt, right glove waving next to the helmet.
LED face: happy curved ^ ^ eyes and a smile.
Soft studio lighting identical to the reference, subtle rim light. Plain flat uniform light gray background (#d9d9d9). Centered with even margin. No text, no letters, no numbers, no logos, no watermark. No human face inside the helmet.
```

---

## 4. Versión chibi

### 4.1 Chibi maestra · 1:1 · `astro-chibi-master.png` (con `astro-master.png` adjunta)
```text
Use the attached image as the exact character reference for design, materials, colors and render style.
Create a chibi version of this character: super-deformed proportions where the round helmet is about half of the total height, a tiny rounded body, short stubby arms and legs, oversized chunky gloves and boots. Keep every signature detail but simplified and bigger: matte purple suit, glowing orange-amber trim lines on the chest plate, shoulders and boots, the chest control box with two knobs, the silver neck ring, the small backpack, the two orange LED slits on top of the helmet, the round ear discs, and the glossy black visor with purple nebula and a small black hole with an orange ring.
Pose: standing and waving with one hand, slight head tilt.
LED face: big rounded lavender pixel eyes and a small happy orange dot-matrix smile.
Soft studio lighting identical to the reference, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), full body centered with generous margin. No text, no letters, no numbers, no logos, no watermark.
```

### 4.2 Stickers chibi · 1:1 · con `astro-chibi-master.png` adjunta

Plantilla fija (pega esto y cambia solo las dos últimas líneas de cada sticker):
```text
Use the attached image as the exact chibi character reference. Keep the same chibi proportions, design, materials, colors, lighting and render style. Only change the pose and the LED face expression.
Soft studio lighting identical to the reference, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), full body centered with generous margin. No text, no letters, no numbers, no logos, no watermark.
Pose: ...
LED face: ...
```

| Archivo | Pose | LED face |
|---|---|---|
| `chibi-hola` | `waving with both hands above the helmet, tiny hop` | `happy curved ^ ^ eyes and a big smile` |
| `chibi-guino` | `giving a thumbs up with one oversized glove` | `one winking eye and a smile` |
| `chibi-corazon` | `hugging a big soft glowing orange heart shape` | `heart-shaped pixel eyes and a smile` |
| `chibi-sorpresa` | `both gloves on the sides of the helmet, leaning back` | `big round surprised eyes and a small O mouth` |
| `chibi-duerme` | `sitting curled up asleep on a small glowing crescent moon, three tiny floating light bubbles` | `closed curved sleepy eyes and a tiny mouth` |
| `chibi-combo` | `juggling three small glowing rounded tiles in coral, violet and sky blue` | `glowing star-shaped eyes and an open smile` |
| `chibi-cohete` | `riding a tiny rounded purple and orange cartoon rocket with a soft flame` | `joyful wide eyes and an open smile` |
| `chibi-gracias` | `small bow forward with both gloves together in front of the chest` | `closed happy curved eyes and a gentle smile` |

---

## 5. Si algo se desvía (correcciones conversando)

No regeneres desde cero: responde sobre la última imagen.

| Problema | Frase para corregir |
|---|---|
| Cambió el traje | `Keep this pose, but restore the suit details exactly as in the reference: chest plate shape, control box, orange trim lines and knee pads.` |
| Perdió el agujero negro | `Keep everything, but add the small black hole with an orange ring in the upper right corner of the visor, as in the reference.` |
| La cara no es LED | `The face must be a glowing pixel LED screen on the visor, not a drawn or human face.` |
| Muy realista | `More stylized, like a premium vinyl toy: rounder shapes and softer matte materials.` |
| Se ve plano o dibujado | `3D render in Blender Cycles with soft global illumination and matte soft-touch plastic, same as the reference.` |
| Salió texto o logo | `Remove all text, letters and logos. Keep everything else the same.` |
| Fondo distinto | `Change only the background to plain flat uniform light gray #d9d9d9.` |

---

## 6. Antes de pasarlas a la web

1. Revisa que traje, visor y agujero negro coincidan con la maestra (con zoom).
2. Recorta el fondo gris y exporta en PNG con transparencia.
3. Guárdalas con el nombre de la tabla y pásamelas: las convierto a WebP y las
   integro con sus animaciones en cada sección.
