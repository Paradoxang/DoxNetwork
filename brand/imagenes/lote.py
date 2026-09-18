"""Procesa el lote aprobado de ASTRO, objetos y telones (OBJ-Y-BG.zip).

Uso:  python brand/imagenes/lote.py
Lee   OBJ-Y-BG.zip en la raíz del proyecto (material fuente, fuera de git)
Deja  public/astro/astro-<pose>.webp  (+ -sm)
      public/deco/obj-<pieza>.webp
      public/deco/telon-<linea>.webp

Tres familias y tres tratamientos, porque vienen con tres fondos distintos:

  · ASTRO  — gris claro (205). Se recorta, se quita la sombra proyectada y se
    deja a 900 px de alto, que es la medida del resto de poses.
  · OBJ    — gris medio (100-130). Mismo recorte, lado mayor 900 px.
  · BG     — ya vienen sobre el navy del sitio, así que no se recorta nada:
    solo se suben a 1920 px de ancho. Son fondos desenfocados por diseño, así
    que el reescalado no se nota, y a 1024 px nativos se verían blandos en
    pantallas grandes.

El ZIP no entra en git: pesa 25 MB y lo que importa son las webp de salida.
"""
import pathlib
import zipfile

import numpy as np
from PIL import Image, ImageFilter

ZIP = pathlib.Path("OBJ-Y-BG.zip")
ASTRO = pathlib.Path("public/astro")
DECO = pathlib.Path("public/deco")

# Nombre en el ZIP -> nombre de pose en la página
POSES = {
    "audifonos": "audifonos",
    "carga": "carga",
    "estuche": "estuche",
    "gamer": "gamer",
    "mayor-edad": "mayor-edad",
    "perfume": "perfume",
    "regalo": "regalo",
    "reloj": "reloj",
    "spray": "spray",
    "urgente": "urgente",
    "chibi-audifonos": "chibi-audifonos",
    "chibi-envios": "chibi-envios",
    "chibi-espera": "chibi-espera",
    "chibi-gracias": "chibi-gracias",
    "chibi-hola": "chibi-hola",
    "chibi-listo": "chibi-listo",
    "chibi-mayor-edad": "chibi-mayor-edad",
    "chibi-perfume": "chibi-perfume",
    "chibi-reloj": "chibi-reloj",
    "chibi-sorpresa": "chibi-sorpresa",
    "chibi-streaming": "chibi-streaming",
}

OBJETOS = {
    "frasco": "obj-frasco",
    "movimiento-reloj": "obj-reloj",
    "capsula": "obj-capsula",
    "cofre-combos": "obj-cofre",
    "burbuja-chat": "obj-burbuja",
    "bolsa-tienda": "obj-bolsa",
    "sello-18": "obj-sello-18",
    "vape": "obj-vape",
}

TELONES = {
    "perfumeria": "telon-perfumeria",
    "relojeria": "telon-relojeria",
    "tecnologia": "telon-tecnologia",
    "digital": "telon-digital",
    "vapes": "telon-vapes",
    "aurora": "telon-aurora",
    "nebulosa": "telon-nebulosa",
}


def conectado_al_borde(mask: np.ndarray) -> np.ndarray:
    """Zonas de `mask` conectadas al borde, por barridos de filas y columnas."""
    cur = np.zeros_like(mask)
    cur[0] = mask[0]
    cur[-1] = mask[-1]
    cur[:, 0] = mask[:, 0]
    cur[:, -1] = mask[:, -1]
    while True:
        antes = cur.sum()
        for eje in (0, 1):
            m = mask if eje == 0 else mask.T
            s = cur if eje == 0 else cur.T
            h, w = m.shape
            pad = np.zeros((h, w + 1), bool)
            pad[:, :w] = m
            plano = pad.ravel()
            tramo = np.cumsum(~plano)
            marcado = np.zeros(tramo[-1] + 1, bool)
            sp = np.zeros((h, w + 1), bool)
            sp[:, :w] = s
            marcado[tramo[sp.ravel() & plano]] = True
            lleno = (marcado[tramo] & plano).reshape(h, w + 1)[:, :w]
            cur = lleno if eje == 0 else lleno.T
        if cur.sum() == antes:
            return cur


def recorta(im: Image.Image, tolerancia: int = 24) -> Image.Image:
    """Quita el fondo de estudio: lo parecido al color del borde y conectado a él."""
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    borde = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    fondo = np.median(borde, axis=0)

    dist = np.abs(rgb - fondo).max(2)
    luma = rgb.mean(2)
    croma = rgb.max(2) - rgb.min(2)
    # La sombra es gris y más oscura que el fondo: fuera también
    sombra = (luma < fondo.mean() - 4) & (croma < 18)
    fuera = conectado_al_borde((dist <= tolerancia) | sombra)

    alpha = np.clip((dist - 8) / 16, 0, 1)
    alpha[fuera] = 0
    a = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))

    out = Image.fromarray(rgb.astype(np.uint8)).convert("RGBA")
    out.putalpha(a)
    return out.crop(out.getbbox() or (0, 0, out.width, out.height))


def alto(im: Image.Image, px: int) -> Image.Image:
    return im.resize((max(1, round(im.width * px / im.height)), px), Image.LANCZOS)


def ancho(im: Image.Image, px: int) -> Image.Image:
    return im.resize((px, max(1, round(im.height * px / im.width))), Image.LANCZOS)


z = zipfile.ZipFile(ZIP)
nombres = {}
for i in z.infolist():
    n = i.filename
    try:
        n = n.encode("cp437").decode("utf-8")
    except Exception:
        pass
    nombres[n.replace("relojería", "relojeria")] = i.filename

ASTRO.mkdir(parents=True, exist_ok=True)
DECO.mkdir(parents=True, exist_ok=True)


def abre(archivo: str) -> Image.Image:
    with z.open(nombres[archivo]) as f:
        return Image.open(f).convert("RGBA").copy()


for origen, pose in POSES.items():
    im = recorta(abre(f"M_astro-{origen}.png"))
    alto(im, 900).save(ASTRO / f"astro-{pose}.webp", "WEBP", quality=82, method=6)
    alto(im, 360).save(ASTRO / f"astro-{pose}-sm.webp", "WEBP", quality=82, method=6)
    print("astro", pose, alto(im, 900).size)

for origen, destino in OBJETOS.items():
    im = recorta(abre(f"OBJ-{origen}.png"))
    escala = 900 / max(im.size)
    if escala < 1:
        im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    im.save(DECO / f"{destino}.webp", "WEBP", quality=84, method=6)
    print("objeto", destino, im.size)

for origen, destino in TELONES.items():
    im = abre(f"BG-telon-{origen}.png").convert("RGB")
    ancho(im, 1920).save(DECO / f"{destino}.webp", "WEBP", quality=74, method=6)
    print("telon", destino, ancho(im, 1920).size)
