#!/usr/bin/env python3
"""
Quita el fondo gris liso de las poses de ASTRO y deja PNG con transparencia.

Uso:  python brand/astro/key_astro.py  (desde la raíz del proyecto)
Lee   ./M_astro-*.png
Deja  brand/astro/png/astro-*.png  (máster transparente)

Cómo funciona:
1. Fondo = gris neutro (más claro o igual que las esquinas) CONECTADO al borde.
   Por conectividad, el visor negro o el cuello plateado (neutros también) no
   se tocan: están rodeados por el traje.
2. Sombra = píxeles grises más oscuros que el fondo, conectados a él. Se
   convierten en negro semitransparente: en la web la sombra se funde con el
   fondo oscuro o claro en vez de dejar una mancha gris.
3. Borde = anillo de 2 px del personaje junto al fondo: se estima el alfa por
   distancia al gris y se le resta el gris mezclado (decontaminación).
"""
import pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path.cwd()
OUT = ROOT / "brand" / "astro" / "png"
OUT.mkdir(parents=True, exist_ok=True)

BG_TOL = 16        # distancia máxima al gris del fondo
SHADOW_CHROMA = 10  # una sombra es gris: casi sin croma
EDGE_FULL = 60     # a esta distancia del gris el borde ya es opaco


def dilate(m: np.ndarray) -> np.ndarray:
    d = m.copy()
    d[1:, :] |= m[:-1, :]
    d[:-1, :] |= m[1:, :]
    d[:, 1:] |= m[:, :-1]
    d[:, :-1] |= m[:, 1:]
    return d


def grow(seed: np.ndarray, allowed: np.ndarray) -> np.ndarray:
    m = seed & allowed
    while True:
        n = dilate(m) & allowed
        if n.sum() == m.sum():
            return n
        m = n


def key(path: pathlib.Path) -> Image.Image:
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    h, w, _ = rgb.shape
    corners = np.concatenate([rgb[:8, :8].reshape(-1, 3), rgb[:8, -8:].reshape(-1, 3),
                              rgb[-8:, :8].reshape(-1, 3), rgb[-8:, -8:].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    bg_l = bg.mean()

    dist = np.abs(rgb - bg).max(axis=2)
    lum = rgb.mean(axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)

    border = np.zeros((h, w), bool)
    border[0, :] = border[-1, :] = border[:, 0] = border[:, -1] = True

    # Todo gris neutro conectado al borde es fondo o sombra: el render trae una
    # viñeta leve, así que entre las piernas el gris es algo más claro que en
    # las esquinas y un umbral fijo lo dejaba como mancha.
    neutral = (chroma < SHADOW_CHROMA) & (lum > bg_l * 0.35)
    region = grow(border, (dist < BG_TOL) | neutral)
    background = region & (lum >= bg_l - 8)
    shadow = region & ~background

    alpha = np.ones((h, w), np.float32)
    out = rgb.copy()

    alpha[background] = 0.0
    # sombra: negro con alfa proporcional a cuánto oscurece el fondo
    s_a = np.clip((bg_l - lum) / bg_l * 1.8, 0, 0.75)
    alpha[shadow] = s_a[shadow]
    out[shadow] = 0.0

    # borde del personaje: anillo de 2 px alrededor de lo quitado
    removed = background | shadow
    ring = dilate(dilate(removed)) & ~removed
    a_edge = np.clip(dist / EDGE_FULL, 0.0, 1.0)
    alpha[ring] = np.minimum(alpha[ring], a_edge[ring])
    safe = np.maximum(alpha, 1e-3)[..., None]
    decont = (rgb - (1.0 - alpha[..., None]) * bg) / safe
    out[ring] = np.clip(decont[ring], 0, 255)

    rgba = np.dstack([out, alpha * 255]).round().astype(np.uint8)
    img = Image.fromarray(rgba, "RGBA")
    # recorte al contenido con margen
    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        pad = 16
        l, t, r, b = bbox
        img = img.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))
    return img


if __name__ == "__main__":
    for src in sorted(ROOT.glob("M_astro-*.png")):
        name = src.stem.replace("M_", "")
        img = key(src)
        img.save(OUT / f"{name}.png", optimize=True)
        print("ok", name, img.size)
