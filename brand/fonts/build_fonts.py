"""Convierte las fuentes de los ZIP de la raíz en WOFF2 para /public/fonts.

Uso:  python brand/fonts/build_fonts.py   (desde la raíz; requiere fonttools y brotli)

Sistema tipográfico (artifact "Sistema tipográfico Dox Network"):
  · Oxanium → display: titulares y botones. Pesos 500, 600 y 700.
  · Sono    → mono: precios, etiquetas, kickers y el ticker. Variable 200–800.
  · Manrope → texto. Ya está instalada con @fontsource/manrope; el ZIP es la
    misma fuente y no se vuelve a empaquetar.

Se recortan a latín (español incluido: tildes, ñ, ¿¡, €, comillas y rayas)
para que pesen una fracción del TTF. Las licencias OFL se copian al lado.
"""
import io
import pathlib
import zipfile

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path.cwd()
OUT = ROOT / "public" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

UNICODES = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD"
)


def to_woff2(data: bytes, dest: pathlib.Path):
    font = TTFont(io.BytesIO(data))
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]  # conserva kerning, ligaduras y cifras tabulares
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=subset.parse_unicodes(UNICODES))
    sub.subset(font)
    font.flavor = "woff2"
    font.save(dest)
    print(f"{dest.name}: {len(data) // 1024} KB -> {dest.stat().st_size // 1024} KB")


with zipfile.ZipFile(ROOT / "font-oxanium.zip") as z:
    for weight, name in ((500, "Medium"), (600, "SemiBold"), (700, "Bold")):
        to_woff2(z.read(f"Oxanium-{name}.ttf"), OUT / f"oxanium-{weight}.woff2")
    (OUT / "OFL-Oxanium.txt").write_bytes(z.read("LICENSE.txt"))

with zipfile.ZipFile(ROOT / "font-sono.zip") as z:
    to_woff2(z.read("variable/SonoVariable.ttf"), OUT / "sono-variable.woff2")
    (OUT / "OFL-Sono.txt").write_bytes(z.read("OFL.txt"))

with zipfile.ZipFile(ROOT / "font-Manrope.zip") as z:
    (OUT / "OFL-Manrope.txt").write_bytes(z.read("OFL.txt"))
