"""Ajusta las imágenes al tamaño en el que de verdad se ven.

Uso:  python brand/imagenes/optimiza.py
Toca  public/deco y public/astro (el atrezo y el personaje)

Las piezas salieron del generador a 760-1920 px y en la página se pintan a
150-400. Un WebP de 900 px que se muestra a 200 gasta ancho de banda y, sobre
todo, memoria de decodificación: en un móvil de gama media eso se nota más que
los kilobytes. Aquí cada familia se lleva al tope que necesita:

  · telón   1280 px de ancho — fondo desenfocado a pantalla completa
  · capa a sangre 1100 px de ancho — nebulosas, malla, polvo, vórtice
  · objeto    460 px de lado — el mayor se pinta a ~290
  · ASTRO     720 px de alto — la pose más grande se ve a ~400

No se toca public/tienda ni public/perfumes: esas son fotos de producto y su
nitidez es parte de la venta.
"""
import pathlib

from PIL import Image

TOPES = [
    ("public/deco/telon-*.webp", "ancho", 1280, 74),
    ("public/deco/obj-*.webp", "lado", 460, 82),
    ("public/deco/malla.webp", "ancho", 1100, 74),
    ("public/deco/nebulosa*.webp", "ancho", 1100, 74),
    ("public/deco/velo.webp", "ancho", 1100, 74),
    ("public/deco/polvo.webp", "ancho", 1100, 74),
    ("public/deco/estela.webp", "ancho", 1100, 74),
    ("public/deco/vortice.webp", "ancho", 1100, 78),
    ("public/deco/*.webp", "lado", 460, 78),
    ("public/astro/*-sm.webp", "alto", 360, 80),
    ("public/astro/*.webp", "alto", 720, 80),
]

vistos: set[pathlib.Path] = set()
antes = despues = 0

for patron, modo, tope, calidad in TOPES:
    for f in sorted(pathlib.Path().glob(patron)):
        if f in vistos:
            continue
        vistos.add(f)
        peso = f.stat().st_size
        antes += peso
        im = Image.open(f)
        im.load()
        medida = im.width if modo == "ancho" else im.height if modo == "alto" else max(im.size)
        if medida > tope:
            escala = tope / medida
            im = im.resize((max(1, round(im.width * escala)), max(1, round(im.height * escala))), Image.LANCZOS)
        im.save(f, "WEBP", quality=calidad, method=6)
        nuevo = f.stat().st_size
        despues += nuevo
        if nuevo < peso * 0.8:
            print(f"  {f.name:34s} {peso // 1024:4d} -> {nuevo // 1024:4d} KB")

print(f"\n{len(vistos)} archivos: {antes // 1024} KB -> {despues // 1024} KB ({100 - despues * 100 // max(antes, 1)}% menos)")
