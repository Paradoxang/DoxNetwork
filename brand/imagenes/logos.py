"""Baldosas de logo para los productos digitales: public/logos/*.webp.

Uso:  python brand/imagenes/logos.py <carpeta-descomprimida-del-zip>
Los pines de cine vienen como círculos sobre blanco: se recortan sin fondo
para que floten. Al de Gemini se le quita el botón y la marca del proveedor.
"""
import os, sys
import numpy as np
from PIL import Image


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(sys.argv[1], "VENDE_STREAMING")
OUT = os.path.join(ROOT, "public", "logos")
os.makedirs(OUT, exist_ok=True)

# archivo del proveedor → nombre publicado
MAP = {
    "238_netflix-original-pantalla": "netflix",
    "360_disney-standar-1-pantalla": "disney-estandar",
    "990_disney-plus-premium-original-pantalla": "disney-premium",
    "1087_hbo-max-estandar-pantalla": "max",
    "992_prime-video-original-pantalla": "prime-video",
    "453_paramount-original-pantalla": "paramount",
    "997_crunchyrroll-original-pantalla": "crunchyroll",
    "1693_apple-tv-x1-mes-pantalla": "apple-tv",
    "1085_vix-premium-pantalla": "vix",
    "1692_plex-premium-1-dispositivo": "plex",
    "991_dgo-con-win-plan-basico-original": "directv-go",
    "1244_claro-video-con-win": "claro-video-win",
    "1518_cine-colombia-pin-entrada": "cine-colombia-entrada",
    "1519_cine-colombia-pin-confiteria": "cine-colombia-confiteria",
    "954_cinemark-pin-entrada": "cinemark-entrada",
    "955_cinemark-combo-confiteria": "cinemark-confiteria",
    "1520_cinemas-procinal-pin-entrada": "procinal-entrada",
    "671_spotify-original-x30-dias": "spotify-1-mes",
    "1245_spotify-3-meses": "spotify-3-meses",
    "1524_you-tube-premium": "youtube-premium",
    "447_chat-gpt-go-1-dispositivo": "chatgpt-go",
    "964_chat-gpt-plus-1-dispositivo": "chatgpt-plus",
    "283_gemini-ia-pro": "gemini-pro",
    "14_canva-premium": "canva",
    "786_capcut-pro-1-dispotivo": "capcut",
    "1694_vpn-hma-dispositivo": "hma-vpn",
}
ROUND = {"cine-colombia-entrada", "cine-colombia-confiteria", "cinemark-entrada", "cinemark-confiteria", "procinal-entrada"}
SIZE = 640


def gemini(im):
    """Sube el logo y tapa la franja inferior (botón + marca) con el fondo."""
    w, h = im.size
    cut = int(h * 0.726)
    top = im.crop((0, 0, w, cut))
    a = np.asarray(im).astype(np.float32)
    bg = tuple(int(v) for v in np.median(np.concatenate([a[:8, :8].reshape(-1, 3), a[:8, -8:].reshape(-1, 3)]), 0))
    canvas = Image.new("RGB", (w, h), bg)
    off = (h - cut) // 2
    canvas.paste(top, (0, off))
    # Fundido suave en las costuras para que no se note el corte
    mask = Image.new("L", (w, h), 0)
    m = np.zeros((h, w), np.float32)
    m[off:off + cut] = 1
    fade = int(h * 0.015)
    for i in range(fade):
        m[off + cut - 1 - i] *= i / fade
    mask = Image.fromarray((m * 255).astype(np.uint8))
    base = Image.new("RGB", (w, h), bg)
    base.paste(canvas, (0, 0), mask)
    return base


def circle(im):
    """Recorta el círculo de color con una máscara limpia (el borde blanco 3D se descarta)."""
    a = np.asarray(im).astype(np.int16)
    ys, xs = np.where((a.max(2) - a.min(2)) > 70)
    w, h = im.size
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cx = (x0 + x1) / 2 if x0 > 2 and x1 < w - 3 else w / 2
    cy = (y0 + y1) / 2 if y0 > 2 and y1 < h - 3 else h / 2
    r = max(x1 - x0, y1 - y0) / 2 * 0.975
    k = 4  # supermuestreo para el borde suave
    big = Image.new("L", (w * k, h * k), 0)
    from PIL import ImageDraw
    ImageDraw.Draw(big).ellipse(((cx - r) * k, (cy - r) * k, (cx + r) * k, (cy + r) * k), fill=255)
    rgba = im.convert("RGBA")
    rgba.putalpha(big.resize((w, h), Image.LANCZOS))
    box = (int(cx - r) - 2, int(cy - r) - 2, int(cx + r) + 3, int(cy + r) + 3)
    side = box[2] - box[0]
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.alpha_composite(rgba.crop(box))
    return canvas


for src, name in MAP.items():
    im = Image.open(os.path.join(SRC, src + ".webp")).convert("RGB")
    if name == "gemini-pro":
        im = gemini(im)
    if name in ROUND:
        im = circle(im)
    im.resize((SIZE, SIZE), Image.LANCZOS).save(os.path.join(OUT, name + ".webp"), "WEBP", quality=82, method=6)
    print(name)
