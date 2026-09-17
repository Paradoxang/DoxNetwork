# ASTRO · Poses por línea y chibi paso a paso

Segunda tanda de prompts para Nano Banana. Parte de las **imágenes finales ya
aprobadas** (`M_astro-*.png` en la raíz del proyecto), no de las referencias
del primer brief (`docs/brief-astro-nano-banana.md`).

1. [ASTRO por línea](#1-astro-por-línea): perfumería, relojería, tecnología y la puerta +18 de vapes.
2. [Chibi paso a paso](#2-chibi-paso-a-paso): reacciones para WhatsApp y un chibi por línea.

---

## 0. Referencias: qué adjuntar

La hoja de expresiones no está en la carpeta, así que **cada cara se toma de la
pose aprobada que ya la tiene**. Siempre dos imágenes como máximo: con tres el
modelo mezcla diseños.

### Cuerpo (imagen 1)

| Ángulo que pide la pose | Archivo |
|---|---|
| De frente | `M_astro-pulgar.png` |
| Tres cuartos | `M_astro-senala.png` |
| De espaldas | `M_astro-despedida.png` |
| Chibi | `M_astro-chibi-master.png` |

### Cara (imagen 2)

| Código | Cara | Archivo que la tiene |
|---|---|---|
| **E1** | Ojos redondos + sonrisa pequeña | `M_astro-senala.png` |
| **E2** | Ojos ^ ^ + sonrisa grande | `M_astro-saludo.png` |
| **E3** | Guiño + sonrisa pequeña | `M_astro-pulgar.png` |
| **E4** | Ojos de anillo + boca en O | `M_astro-sorpresa.png` |
| **E5** | Ojos de estrella + sonrisa abierta | `M_astro-celebra.png` |
| **E6** | Ojos de corazón + sonrisa pequeña | `M_astro-favoritos.png` |
| **E7** | Ojos cuadrados mirando arriba + boca recta | `M_astro-piensa.png` |
| **E8** | Ojos en espiral + boca ondulada | `M_astro-404.png` (está de cabeza; el prompt pide la cara al derecho) |

> Si la cara que necesitas ya está en la imagen 1 (por ejemplo, cuerpo
> `M_astro-senala.png` con cara E1), adjunta **solo la imagen 1** y borra del
> prompt la frase que empieza por *"Image 2"*.

---

## 1. ASTRO por línea

Todas son **3:4, fondo gris liso**, igual que las aprobadas, para que
`brand/astro/key_astro.py` les quite el fondo sin tocar nada.

Reglas de esta tanda:

- **Productos genéricos, sin marca ni etiqueta.** Las fotos reales de producto van
  en las promo cards y en la web, no dentro de la ilustración.
- Los objetos van en la paleta de marca (dorado, menta, periwinkle, lavanda) para
  que resalten sobre el morado del traje.
- Cada prompt ya viene completo: se copia y se pega tal cual.

### Perfumería

#### 1.1 `astro-perfume` · Portada de perfumería
**Adjuntar:** `M_astro-pulgar.png` + `M_astro-celebra.png` · **Cara:** E5
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose and any props of image 1. Image 2 is used ONLY for the LED face on the visor: copy that face exactly, with the same shapes and glowing pixel style; ignore everything else in image 2.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: facing the camera, proudly presenting an elegant faceted glass perfume bottle with a rounded gold cap and warm amber liquid, held with both gloves at chest height like a trophy. The bottle has no label and no printing. A few tiny golden sparkles around the bottle.
LED face: the star eyes and open smile from image 2.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

#### 1.2 `astro-perfume-spray` · "Huele increíble" / novedades
**Adjuntar:** `M_astro-senala.png` + `M_astro-favoritos.png` · **Cara:** E6
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Keep the three-quarter body angle of image 1 but ignore its pose. Image 2 is used ONLY for the LED face on the visor: copy that face exactly, with the same shapes and glowing pixel style; ignore everything else in image 2.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: three-quarter angle, spraying a small round pale-pink glass perfume bottle with a gold atomizer into the air in front of the helmet with the right glove, a soft shimmering golden mist floating out of it with tiny sparkles, left glove resting on the hip, relaxed happy stance. The bottle has no label and no printing.
LED face: the heart eyes and small smile from image 2.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

#### 1.3 `astro-perfume-regalo` · Fechas especiales y "para regalar"
**Adjuntar:** `M_astro-pulgar.png` + `M_astro-saludo.png` · **Cara:** E2
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose and any props of image 1. Image 2 is used ONLY for the LED face on the visor: copy that face exactly, with the same shapes and glowing pixel style; ignore everything else in image 2.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: facing the camera, holding out a medium square gift box wrapped in soft lavender paper with a big gold satin ribbon bow, offering it toward the viewer with both gloves. The lid is slightly open and a small unlabeled glass perfume bottle with a gold cap peeks out. Slight head tilt.
LED face: the happy ^ ^ eyes and big open smile from image 2.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

### Relojería

#### 1.4 `astro-reloj` · Portada de relojería
**Adjuntar:** solo `M_astro-senala.png` · **Cara:** E1 (ya la trae)
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, LED face, lighting and 3D render style. Keep the three-quarter body angle of image 1 but ignore its pose.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: three-quarter angle, elegant and confident, raising the left forearm in front of the chest to admire a classic round silver wristwatch with a deep blue dial and a metal bracelet worn over the glove, helmet tilted slightly down toward the watch, right glove adjusting the bracelet. The watch has no logo and no numbers on the dial, only simple hour markers.
LED face: keep the round eyes and small smile of image 1.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

#### 1.5 `astro-reloj-urgente` · "Últimas horas" / oferta con tiempo
**Adjuntar:** `M_astro-pulgar.png` + `M_astro-sorpresa.png` · **Cara:** E4
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose and any props of image 1. Image 2 is used ONLY for the LED face on the visor: copy that face exactly, with the same shapes and glowing pixel style; ignore everything else in image 2.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: facing the camera, leaning back in surprise, left forearm raised in front of the helmet showing a big round gold wristwatch with a white dial worn over the glove, right index finger pointing at the watch, one boot lifted slightly. The watch has no logo and no numbers, only simple hour markers.
LED face: the surprised ring eyes and small O mouth from image 2.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

#### 1.6 `astro-reloj-estuche` · Combos de pareja y regalos
**Adjuntar:** `M_astro-pulgar.png` + `M_astro-favoritos.png` · **Cara:** E6
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose and any props of image 1. Image 2 is used ONLY for the LED face on the visor: copy that face exactly, with the same shapes and glowing pixel style; ignore everything else in image 2.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: facing the camera, holding with both gloves an open square watch presentation box with a dark navy velvet interior and two gold wristwatches side by side inside, one larger and one smaller, the box tilted slightly toward the camera. Slight head tilt. The box and watches have no logos and no printing.
LED face: the heart eyes and small smile from image 2.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

### Tecnología

#### 1.7 `astro-audifonos` · Audio
**Adjuntar:** `M_astro-senala.png` + `M_astro-pulgar.png` · **Cara:** E3
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Keep the three-quarter body angle of image 1 but ignore its pose. Image 2 is used ONLY for the LED face on the visor: copy that face exactly, with the same shapes and glowing pixel style; ignore everything else in image 2.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: three-quarter angle, grooving to music, wearing big over-ear headphones in matte black with thin orange accents placed over the helmet ear discs, right glove pressed against one ear cup, left arm swinging in a relaxed dance move, knees slightly bent, three small glowing orange music note shapes floating around the helmet. The headphones have no logo.
LED face: the wink and small smile from image 2.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

#### 1.8 `astro-gamer` · Gaming y consolas
**Adjuntar:** `M_astro-senala.png` + `M_astro-celebra.png` · **Cara:** E5
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Keep the three-quarter body angle of image 1 but ignore its pose. Image 2 is used ONLY for the LED face on the visor: copy that face exactly, with the same shapes and glowing pixel style; ignore everything else in image 2.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: three-quarter angle, floating in zero gravity sitting cross-legged in the air, playing a small handheld retro game console in translucent lavender plastic with a blank softly glowing screen, holding it with both gloves and leaning forward with excitement, a few small glowing mint pixel squares floating around. The console has no logo.
LED face: the star eyes and open smile from image 2.
Soft studio lighting identical to image 1, subtle rim light, soft round shadow on the ground below. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

#### 1.9 `astro-carga` · Power banks, cargadores y cables
**Adjuntar:** `M_astro-pulgar.png` + `M_astro-saludo.png` · **Cara:** E2
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose and any props of image 1. Image 2 is used ONLY for the LED face on the visor: copy that face exactly, with the same shapes and glowing pixel style; ignore everything else in image 2.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: facing the camera, holding up a chunky rounded white power bank in the right glove with a small row of glowing mint indicator dots, a soft white charging cable running from the power bank to a small port on the side of the backpack, left glove giving a relaxed wave, the orange trim lines of the suit glowing slightly brighter as if fully charged. The power bank has no logo.
LED face: the happy ^ ^ eyes and big open smile from image 2.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

#### 1.10 `astro-smartwatch` · Smartwatches
**Adjuntar:** `M_astro-senala.png` + `M_astro-saludo.png` · **Cara:** E2
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Keep the three-quarter body angle of image 1 but ignore its pose. Image 2 is used ONLY for the LED face on the visor: copy that face exactly, with the same shapes and glowing pixel style; ignore everything else in image 2.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: three-quarter angle, tapping a modern square smartwatch with a mint green strap and a blank softly glowing screen worn on the left wrist, using the right index finger, looking at the watch with delight, weight on one leg. The smartwatch has no logo and the screen shows no text or numbers.
LED face: the happy ^ ^ eyes and big open smile from image 2.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

### Vapes: solo la puerta +18

No hay pose de ASTRO **con** vapes, y no conviene hacerla:

- La Ley 2354 de 2024 prohíbe la publicidad y la promoción de vapeadores. Un
  personaje que "usa" el producto es promoción.
- Una mascota caricaturesca es justo el tipo de pieza que atrae a menores, que es
  lo que esa ley busca evitar. En la tienda ya se decidió cero promoción de vapes.

Lo que sí sirve es un ASTRO para la **verificación de edad** de `/vapes`, sin el
producto a la vista. Tampoco va en promo cards ni en estados.

#### 1.11 `astro-mayor-edad` · AgeGate de /vapes
**Adjuntar:** solo `M_astro-senala.png` · **Cara:** E1 (ya la trae)
```text
Image 1 is the approved ASTRO character: keep exactly the same design, suit details, proportions, matte purple vinyl-toy materials, glowing orange trim lines, LED face, lighting and 3D render style. Ignore the pose of image 1.
ASTRO is a chunky stylized astronaut mascot like a premium vinyl toy: big round purple helmet with two short orange LED slits on top and round ear discs, large glossy black visor showing a dark purple nebula with tiny stars and a small black hole with an orange ring in the upper right, and a glowing LED face on the visor. Matte muted-violet suit with thin glowing orange-amber trim lines on the chest plate, shoulders, forearms and boots, a chest control box with two knobs and tiny pink lights, silver neck ring, rounded knee pads, chunky four-finger gloves and boots, rounded backpack.
Pose: facing the camera, standing firm and calm like a friendly door guard, right glove raised with the open palm toward the camera in a polite stop gesture, left glove holding up a blank rounded mint-green ID card with no printing. No other objects: no electronic cigarettes, no vaping devices, no smoke, no vapor clouds.
LED face: keep the round eyes and small smile of image 1.
Soft studio lighting identical to image 1, subtle rim light, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient, no floor line. Full body visible with generous empty margin, 3:4 vertical. No text, no letters, no numbers, no logos, no brand names, no watermark. No human face inside the helmet. Two arms, two legs, four-finger gloves.
```

---

## 2. Chibi paso a paso

La chibi maestra tiene una cara más simple que ASTRO normal: **ojos lavanda
grandes y lisos, sonrisa naranja suave, casi sin píxeles**. Por eso la imagen 2
solo presta la *forma* de la expresión y el prompt pide redibujarla con el
estilo chibi.

### Paso 1 · Prepara las referencias

- Imagen 1, siempre: `M_astro-chibi-master.png`
- Imagen 2: el archivo de la cara que toque (tabla de la sección 0)
- Formato de salida: **1:1**

### Paso 2 · Pega el bloque fijo

Todos los prompts de chibi empiezan con estas dos partes. En los prompts de los
pasos 3 y 4 ya van incluidas.

**Referencias**
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
```

**Salida**
```text
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

### Paso 3 · Genera primero la prueba

Antes de la tanda completa, genera **`chibi-hola`** y compárala con la maestra:
casco a la mitad de la altura, caja de control del pecho, líneas naranjas,
anillo plateado, orejeras y el agujero negro del visor. Si algo cambió, corrige
con el paso 6 antes de seguir: los errores se repiten en todas las demás.

#### `chibi-hola` · Saludo
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-saludo.png` · **Cara:** E2
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: tiny happy hop with both oversized gloves waving above the helmet.
LED face: happy ^ ^ eyes and a big open smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

### Paso 4 · Reacciones para WhatsApp

Para responder chats y grupos. Mismo bloque fijo; cambian la imagen 2, la pose
y la cara.

#### `chibi-gracias` · "Gracias por tu compra"
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-favoritos.png` · **Cara:** E6
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: hugging a big soft glowing orange heart almost as big as its body, slight head tilt.
LED face: heart eyes and a small smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-listo` · "Listo, ya te llegó"
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-pulgar.png` · **Cara:** E3
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: giving a big thumbs up with one oversized glove held forward toward the camera, the other glove on the hip, a small glowing mint check mark shape floating next to the helmet.
LED face: a wink and a small smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-espera` · "Dame un momento"
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-piensa.png` · **Cara:** E7
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: sitting on the ground holding a small gold hourglass with glowing orange sand in both gloves, looking up patiently.
LED face: square eyes looking up and a flat line mouth.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-sorpresa` · "¡Llegó oferta!"
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-sorpresa.png` · **Cara:** E4
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: both oversized gloves on the sides of the helmet, leaning back in surprise, one tiny boot lifted.
LED face: surprised ring eyes and a small O mouth.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-celebra` · Combos y descuentos
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-celebra.png` · **Cara:** E5
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: jumping with both arms up, juggling three small glowing rounded square tiles in gold, mint and periwinkle above the helmet, soft round shadow on the ground below.
LED face: star eyes and an open smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-mareado` · "Algo salió mal"
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-404.png` · **Cara:** E8
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: sitting dizzy on the ground with legs stretched out, a few small gold stars orbiting around the helmet.
LED face: spiral eyes and a wavy mouth, shown upright (image 2 is upside down).
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

### Paso 5 · Un chibi por línea de la tienda

Para las promo cards pequeñas, los estados y los íconos de categoría.

#### `chibi-streaming` · Streaming y pines de cine
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-saludo.png` · **Cara:** E2
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: sitting comfortably on a small round lavender bean bag, hugging a red and white striped popcorn bucket with no branding, a few popcorn pieces popping out, a small TV remote in the other glove.
LED face: happy ^ ^ eyes and a big open smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-perfume` · Perfumería
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-favoritos.png` · **Cara:** E6
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: hugging a faceted glass perfume bottle with a gold cap and warm amber liquid that is as tall as its body, cheek-side of the helmet resting against the bottle, a few tiny golden sparkles. The bottle has no label and no printing.
LED face: heart eyes and a small smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-reloj` · Relojería
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-sorpresa.png` · **Cara:** E4
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: holding up with both gloves a gold wristwatch almost as big as its helmet, a round white dial with simple hour markers and no numbers, leaning back with surprise at its size. The watch has no logo.
LED face: surprised ring eyes and a small O mouth.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-audifonos` · Tecnología (audio)
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-pulgar.png` · **Cara:** E3
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: wearing big matte black over-ear headphones with thin orange accents over the helmet ear discs, dancing on one foot with both gloves on the ear cups, two small glowing orange music note shapes floating nearby. The headphones have no logo.
LED face: a wink and a small smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-gamer` · Tecnología (gaming)
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-celebra.png` · **Cara:** E5
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: sitting cross-legged on the ground playing a small handheld retro game console in translucent lavender plastic with a blank glowing screen, leaning forward excitedly, a few tiny glowing mint pixel squares floating up. The console has no logo.
LED face: star eyes and an open smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-envio` · Envíos a toda Colombia
**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-saludo.png` · **Cara:** E2
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: riding on top of a flying cardboard delivery box with a small soft orange rocket flame coming out of the back, one glove holding the box tape, the other waving, a short curved motion trail behind. The box has no printing.
LED face: happy ^ ^ eyes and a big open smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

#### `chibi-mayor-edad` · AgeGate de /vapes
Mismo criterio que 1.11: solo para la verificación de edad, nunca en promoción.

**Adjuntar:** `M_astro-chibi-master.png` + `M_astro-senala.png` · **Cara:** E1
```text
Image 1 is the approved chibi ASTRO: keep exactly the same chibi proportions (the helmet is about half of the total height), design, suit details, matte purple vinyl-toy materials, glowing orange trim lines, lighting and 3D render style. Ignore the pose of image 1. Image 2 is used ONLY as the expression reference: redraw that LED face expression on the chibi visor in the chibi face style of image 1 (large soft glowing lavender eyes and a smooth glowing orange mouth). Ignore the body, pose and props of image 2.
Pose: standing firm with one oversized glove raised palm forward in a polite stop gesture, the other glove holding up a blank rounded mint-green ID card with no printing. No other objects: no electronic cigarettes, no vaping devices, no smoke, no vapor clouds.
LED face: round eyes and a small smile.
Soft studio lighting identical to image 1, soft contact shadow. Plain flat uniform light gray background (#d9d9d9), no gradient. Full body centered with generous margin, 1:1 square. Compact silhouette that reads well at small sticker size. Keep the dark purple nebula and the small black hole with an orange ring on the visor. No text, no letters, no numbers, no logos, no brand names, no watermark.
```

### Paso 6 · Si algo se desvía (corrige sobre la última imagen)

| Problema | Frase para corregir |
|---|---|
| Dejó de ser chibi | `Keep this pose, but restore the chibi proportions of image 1: the helmet is half of the total height, tiny body, short stubby arms and legs.` |
| Copió el cuerpo de la imagen 2 | `Use image 2 only for the face expression. Keep the chibi body of image 1.` |
| Cara con píxeles o con otro estilo | `Keep the expression, but draw it in the smooth chibi LED face style of image 1: large soft glowing lavender eyes and a smooth orange mouth.` |
| Perdió detalles del traje | `Keep this pose, but restore the suit details of image 1: chest control box with two knobs, orange trim lines, silver neck ring and backpack.` |
| Perdió la nebulosa o el agujero negro | `Keep everything, but restore the dark purple nebula and the small black hole with an orange ring in the upper right corner of the visor.` |
| Salió texto o logo en un objeto | `Remove all text, letters, numbers and logos from every object. Keep everything else the same.` |
| El objeto tapa la cara | `Move the object lower so the whole visor and LED face stay visible.` |
| Fondo distinto | `Change only the background to plain flat uniform light gray #d9d9d9.` |

Las mismas frases del paso 6 sirven para ASTRO normal cambiando *chibi* por
*character*; la tabla completa está en la sección 6 del primer brief.

### Paso 7 · Entrega

1. Revisa con zoom casco, visor, pecho y guantes contra la referencia.
2. Guarda cada imagen en la raíz del proyecto como `M_astro-<nombre>.png`
   (por ejemplo `M_astro-chibi-gracias.png` o `M_astro-reloj.png`). Déjale el
   fondo gris: no la recortes tú.
3. Avísame. Corro `python brand/astro/key_astro.py`, que ya recorta todo
   `M_astro-*.png`, y te devuelvo:
   - WebP para la web y las promo cards.
   - Stickers de WhatsApp: WebP de 512×512 con transparencia y menos de 100 KB.
     Un paquete pide mínimo 3 stickers y un ícono de 96×96.
