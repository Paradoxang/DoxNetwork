"""Genera src/data/vapes.ts y public/tienda/vapes-*.webp desde el export del proveedor.

Uso:  python brand/imagenes/vapes.py <carpeta del export de vapes>
La carpeta tiene productos.csv y img/<id>.webp (imagen principal de cada producto).

Los nombres se escriben a mano: el CSV trae solo la marca ("EASE", "NORTH") y
los puffs se leen de la foto del proveedor. Donde la foto no los muestra no se
inventan. Dos fotos se recortan: la de Tyson trae el precio del proveedor
impreso y la de Lost Mary un rótulo publicitario.
"""
import csv, json, os, sys
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = sys.argv[1]
OUT_IMG = os.path.join(ROOT, "public", "tienda")
OUT_TS = os.path.join(ROOT, "src", "data", "vapes.ts")
os.makedirs(OUT_IMG, exist_ok=True)

# id: (nombre, marca, slug)
META = {
    577: ("Death Row Vapes", "Snoop Dogg", "vapes-death-row-snoop-dogg"),
    602: ("Ease 8000 puffs", "Ease", "vapes-ease-8000"),
    998: ("Nicky Jam 10000 puffs", "Nicky Jam", "vapes-nicky-jam-10000"),
    1063: ("Chillax Shake 15000 puffs", "Chillax", "vapes-chillax-shake-15000"),
    1240: ("Chris Brown", "Chris Brown", "vapes-chris-brown"),
    1284: ("Beyond CLK6000", "Beyond", "vapes-beyond-clk6000"),
    1299: ("IJOY 10000 puffs", "IJOY", "vapes-ijoy-10000"),
    1408: ("Vera 22000 puffs", "Vera", "vapes-vera-22000"),
    1409: ("Lost Mary 5000 puffs", "Lost Mary", "vapes-lost-mary-5000"),
    1608: ("RabBeats RC10000", "RabBeats", "vapes-rabbeats-rc10000"),
    1636: ("Bugatti 17000 puffs", "Bugatti", "vapes-bugatti-17000"),
    1637: ("Pog King 13000 puffs", "Pog King", "vapes-pog-king-13000"),
    1670: ("Tyson 2.0 Heavy Weight 7000 puffs", "Tyson 2.0", "vapes-tyson-heavy-weight-7000"),
    1829: ("North 12000 puffs", "North", "vapes-north-12000"),
}

# (izq, arriba, der, abajo) en fracción del lado, antes de cuadrar
CROP = {1670: (0.0, 0.0, 0.0, 0.3), 1409: (0.1, 0.0, 0.1, 0.2)}


def process(pid, slug):
    im = Image.open(os.path.join(SRC, "img", f"{pid}.webp")).convert("RGB")
    if pid in CROP:
        w, h = im.size
        l, t, r, b = CROP[pid]
        im = im.crop((int(w * l), int(h * t), int(w * (1 - r)), int(h * (1 - b))))
    side = min(im.size)
    im = im.crop(((im.width - side) // 2, (im.height - side) // 2, (im.width + side) // 2, (im.height + side) // 2))
    for size, suffix in ((720, ""), (360, "-sm")):
        im.resize((size, size), Image.LANCZOS).save(os.path.join(OUT_IMG, f"{slug}{suffix}.webp"), "WEBP", quality=78, method=6)


rows = []
with open(os.path.join(SRC, "productos.csv"), encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        pid = int(r["id"])
        name, brand, slug = META[pid]
        process(pid, slug)
        rows.append((pid, round(float(r["precio"])), name, brand, slug, r["disponibilidad"] != "EN STOCK"))


def ts(v):
    return json.dumps(v, ensure_ascii=False)


lines = [
    "/* Generado por brand/imagenes/vapes.py desde el export del proveedor (17-sep-2026).",
    "   Se puede editar a mano; si se vuelve a correr el script, se sobrescribe. */",
    'import type { ArticuloRow } from "./lineas";',
    "",
    "// [id proveedor, costo proveedor, nombre, marca, línea, subcategoría, condición, slug, agotado]",
    "export const vapeRows: ArticuloRow[] = [",
]
for pid, cost, name, brand, slug, soldout in rows:
    cells = [str(pid), str(cost), ts(name), ts(brand), ts("vapes"), ts("vapes"), "null", ts(slug)] + (["true"] if soldout else [])
    lines.append("  [" + ", ".join(cells) + "],")
lines.append("];")
with open(OUT_TS, "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(lines) + "\n")
print(len(rows), "vapes")
