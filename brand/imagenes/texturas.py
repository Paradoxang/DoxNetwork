"""Texturas de fondo de la tienda, generadas por código (no con IA).

Uso:  python brand/imagenes/texturas.py
Deja  public/deco/orbitas.svg  — curvas de nivel orbitales para el fondo global
      public/deco/grano.png    — ruido de 128x128 que se repite sobre todo

Por qué por código y no generadas: son texturas que se ven al 4-6 % de
opacidad y a pantalla completa. Un PNG de IA a ese tamaño pesaría cientos de
kilobytes y traería ruido de compresión justo donde no se puede disimular;
el SVG son 20 KB vectoriales y el grano, 8 KB que se repiten.

Las órbitas no son curvas de nivel de montaña como en las referencias: son
anillos deformados alrededor de un centro desplazado, o sea el mismo lenguaje
del agujero negro del hero.
"""
import math
import pathlib
import random

import numpy as np
from PIL import Image

OUT = pathlib.Path("public/deco")
OUT.mkdir(parents=True, exist_ok=True)

# ── Órbitas ──────────────────────────────────────────────────────────────
W = H = 1600
CX, CY = W * 0.62, H * 0.44  # centro desplazado: nunca queda simétrico en pantalla
ANILLOS = 46
PUNTOS = 120

rnd = random.Random(7)  # semilla fija: el archivo no cambia entre corridas
paths = []
for i in range(ANILLOS):
    # Los anillos se separan cada vez más: denso en el centro, abierto afuera
    r = 26 + (i**1.42) * 2.3
    # Cada anillo lleva su propia deformación, suma de tres ondas
    ondas = [(rnd.uniform(0.02, 0.09), rnd.randint(2, 3), rnd.uniform(0, math.tau)) for _ in range(3)]
    d = []
    for p in range(PUNTOS + 1):
        a = math.tau * p / PUNTOS
        k = 1 + sum(amp * math.sin(f * a + fase) for amp, f, fase in ondas)
        x = CX + math.cos(a) * r * k * 1.35
        y = CY + math.sin(a) * r * k
        d.append(f"{'M' if p == 0 else 'L'}{x:.0f} {y:.0f}")
    paths.append(f'<path d="{"".join(d)}Z"/>')

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
    '<g fill="none" stroke="#9aa9ff" stroke-width="1.6" stroke-linejoin="round">'
    + "".join(paths)
    + "</g></svg>"
)
(OUT / "orbitas.svg").write_text(svg, encoding="utf-8", newline="\n")
print("orbitas.svg", len(svg) // 1024, "KB")

# ── Grano ────────────────────────────────────────────────────────────────
# Gris medio con ruido: en la página va con `mix-blend-mode: overlay`, así que
# 128 es "no tocar" y la desviación es lo que raspa la imagen.
G = 128
ruido = np.random.default_rng(11).normal(128, 26, (G, G)).clip(0, 255).astype(np.uint8)
Image.fromarray(ruido, "L").save(OUT / "grano.png", optimize=True)
print("grano.png", (OUT / "grano.png").stat().st_size // 1024, "KB")
