"""Versiones sin fondo de las fotos de producto con fondo blanco.

Uso:  python brand/imagenes/recorte.py
Lee   public/perfumes/*.webp y public/tienda/{relojeria,tecnologia}-*.webp
Deja  <foto>-cut.webp y <foto>-cut-sm.webp, y src/data/recortes.ts con la
      lista de fotos que sí tienen recorte (las demás siguen como foto).

Brief de rediseño: "sustituir las imágenes de fondo blanco puro por la versión
sin fondo cuando exista". El recorte automático falla con cajas y frascos
blancos (el fondo se cuela en el producto), así que cada recorte pasa un
control: si al cerrar la silueta con un radio de 12 px aparece más de un 3 %
de área, el fondo se comió parte del producto y la foto se descarta.
Después se revisa a ojo y se pueden excluir más a mano en EXCLUIR.
"""
import json
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path.cwd()
OUT_TS = ROOT / "src" / "data" / "recortes.ts"

# Recortes que pasan el control automático pero se ven mal (revisión a ojo)
EXCLUIR: set[str] = {
    "/perfumes/perfume-carolina-herrera-212-men-aqua.webp",
    "/perfumes/perfume-carolina-herrera-ch-eau-de-toilette.webp",
    "/perfumes/perfume-creed-silver-mountain-water.webp",
    "/perfumes/perfume-diesel-plus-plus-feminine.webp",
    "/perfumes/perfume-issey-miyake-l-eau-d-issey-pour-homme.webp",
    "/perfumes/perfume-issey-miyake-l-eau-d-issey.webp",
    "/perfumes/perfume-katy-perry-meow.webp",
    "/perfumes/perfume-lacoste-l-12-12-blanc.webp",
    "/perfumes/perfume-lacoste-l-12-12-pour-elle-natural-aaa.webp",
    "/perfumes/perfume-lattafa-art-of-universe.webp",
    "/perfumes/perfume-lattafa-her-confession.webp",
    "/perfumes/perfume-lattafa-shaheen-gold.webp",
    "/perfumes/perfume-lattafa-yara-moi.webp",
    "/perfumes/perfume-louis-vuitton-ombre-nomade.webp",
    "/perfumes/perfume-paris-hilton-can-can.webp",
    "/perfumes/perfume-viktor-rolf-spicebomb.webp",
    "/tienda/tecnologia-airpods-anc-jm19-traductores.webp",
    "/tienda/tecnologia-airpods-pro-2-generacion-anc.webp",
    "/tienda/tecnologia-cargador-de-coche-rapido-pc17.webp",
    "/tienda/tecnologia-gafas-inteligentes-g5-2026-con-camara-e-ia.webp",
    "/tienda/tecnologia-smartwatch-7-correas-audifonos-bluetooth.webp",
    "/tienda/tecnologia-smartwatch-audifonos-i20.webp",
    "/tienda/tecnologia-smartwatch-mobulaa-iw12-mini.webp",
    "/tienda/tecnologia-smartwatch-s11-kz-w42.webp",
    "/tienda/tecnologia-smartwatch-ultra-3-8-correas-economico.webp",
    "/tienda/tecnologia-smartwatch-zt-36s-plus.webp",
}


def dilate(m: np.ndarray, r: int = 1) -> np.ndarray:
    out = m.copy()
    for _ in range(r):
        n = out.copy()
        n[1:] |= out[:-1]
        n[:-1] |= out[1:]
        n[:, 1:] |= out[:, :-1]
        n[:, :-1] |= out[:, 1:]
        out = n
    return out


def erode(m: np.ndarray, r: int) -> np.ndarray:
    return ~dilate(~m, r)


def fill_from(mask: np.ndarray, seed: np.ndarray) -> np.ndarray:
    """Regiones de `mask` conectadas a `seed`, por barridos de filas y columnas."""
    cur = seed & mask
    while True:
        before = cur.sum()
        for axis in (0, 1):
            m = mask if axis == 0 else mask.T
            s = cur if axis == 0 else cur.T
            h, w = m.shape
            pad = np.zeros((h, w + 1), bool)
            pad[:, :w] = m
            flat = pad.ravel()
            run = np.cumsum(~flat)
            seeded = np.zeros(run[-1] + 1, bool)
            sp = np.zeros((h, w + 1), bool)
            sp[:, :w] = s
            seeded[run[sp.ravel() & flat]] = True
            filled = (seeded[run] & flat).reshape(h, w + 1)[:, :w]
            cur = filled if axis == 0 else filled.T
        if cur.sum() == before:
            return cur


def white_border(rgb: np.ndarray) -> float:
    b = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    return float(((255 - b.min(1)) <= 10).mean())


def key_white(rgb: np.ndarray) -> np.ndarray:
    """Fondo = blanco conectado al borde; sombras y contornos neutros junto a él
    se desmultiplican contra blanco (sobre oscuro quedan como sombra)."""
    h, w, _ = rgb.shape
    d = 255 - rgb.min(2)
    chroma = rgb.max(2) - rgb.min(2)
    near = d <= 10
    seed = np.zeros((h, w), bool)
    seed[0] = seed[-1] = True
    seed[:, 0] = seed[:, -1] = True
    bg = fill_from(near, seed)
    soft = (d <= 110) & (chroma <= 22) & ~near
    zone = bg.copy()
    for _ in range(40):
        nxt = zone | (dilate(zone) & soft)
        if (nxt == zone).all():
            break
        zone = nxt
    zone = dilate(zone, 2) | bg
    a = np.clip(d / 255.0 * 1.25, 0, 1)
    alpha = np.ones((h, w), np.float32)
    col = rgb.copy()
    un = 255 - (255 - rgb) / np.maximum(a, 1e-3)[..., None]
    alpha[zone] = a[zone]
    col[zone] = np.clip(un, 0, 255)[zone]
    alpha[bg & (d <= 4)] = 0
    return np.dstack([col, alpha * 255]).astype(np.uint8)


def bite_ratio(alpha: np.ndarray) -> float:
    m = alpha > 128
    if m.sum() == 0:
        return 1.0
    closed = erode(dilate(m, 12), 12)
    return float((closed & ~m).sum() / m.sum())


fotos = sorted(ROOT.glob("public/perfumes/*.webp")) + sorted(ROOT.glob("public/tienda/*.webp"))
fotos = [f for f in fotos if not f.stem.endswith(("-sm", "-cut", "-cut-sm")) and not f.stem.startswith("vapes-")]

ok, descartes = [], []
for f in fotos:
    rgb = np.asarray(Image.open(f).convert("RGB")).astype(np.float32)
    if white_border(rgb) < 0.9:
        continue  # foto con fondo propio: no se recorta
    rgba = key_white(rgb)
    ratio = bite_ratio(rgba[..., 3])
    url = "/" + f.relative_to(ROOT / "public").as_posix()
    if ratio > 0.03 or url in EXCLUIR:
        descartes.append((f.name, round(ratio, 3)))
        continue
    img = Image.fromarray(rgba, "RGBA")
    img.save(f.with_name(f.stem + "-cut.webp"), "WEBP", quality=82, method=6)
    img.resize((360, 360), Image.LANCZOS).save(f.with_name(f.stem + "-cut-sm.webp"), "WEBP", quality=82, method=6)
    ok.append(url)

OUT_TS.write_text(
    "/* Generado por brand/imagenes/recorte.py: fotos con versión sin fondo (<foto>-cut.webp). */\n"
    f"export const recortes = new Set<string>({json.dumps(ok, indent=2)});\n",
    encoding="utf-8",
    newline="\n",
)
print(f"{len(ok)} recortes, {len(descartes)} descartados")
print(json.dumps(descartes))
