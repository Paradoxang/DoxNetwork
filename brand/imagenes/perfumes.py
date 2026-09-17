"""Genera src/data/perfumes.ts y public/perfumes/*.webp desde el export del proveedor.

Uso:  python brand/imagenes/perfumes.py <carpeta-descomprimida-del-zip>
La carpeta debe tener catalogo.csv y PERFUMERIA/. Los nombres, casas y
familias olfativas se corrigen a mano en META (el CSV trae errores de
digitación: "Blue Lavel", "Mont Blant", "Hammer You"...).

Las fotos NO se recortan sin fondo: muchas cajas y frascos son blancos y un
recorte automático se los come. Se dejan en blanco, centradas en un cuadrado,
y la página las funde con `mix-blend-mode: multiply` sobre una vitrina clara.
"""
import csv, json, os, re, sys, unicodedata
from PIL import Image
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = sys.argv[1]
OUT_IMG = os.path.join(ROOT, "public", "perfumes")
OUT_TS = os.path.join(ROOT, "src", "data", "perfumes.ts")
os.makedirs(OUT_IMG, exist_ok=True)

# id: (nombre, casa, familia[, para])  familia: fresca floral dulce oriental amaderada frutal | None
META = {
    78: ("Toy Boy", "Moschino", "amaderada"),
    103: ("Toy 2", "Moschino", "floral"),
    373: ("Bottled Night", "Hugo Boss", "amaderada", "hombre"),
    374: ("Bottled", "Hugo Boss", "amaderada", "hombre"),
    376: ("Bottled Unlimited", "Hugo Boss", "fresca", "hombre"),
    634: ("Lacoste Red", "Lacoste", "fresca"),
    661: ("The Scent For Her", "Hugo Boss", "floral"),
    662: ("Polo Red", "Ralph Lauren", "amaderada"),
    663: ("Polo Blue", "Ralph Lauren", "fresca"),
    685: ("Tommy", "Tommy Hilfiger", "fresca"),
    691: ("K", "Dolce & Gabbana", "fresca"),
    693: ("Bright Crystal Absolu", "Versace", "floral"),
    701: ("L.12.12 Blanc", "Lacoste", "fresca"),
    702: ("L.12.12 Noir", "Lacoste", "amaderada"),
    710: ("Essential", "Lacoste", "fresca"),
    711: ("Hugo Red", "Hugo Boss", "frutal"),
    735: ("Invictus Victory Elixir", "Paco Rabanne", "oriental"),
    736: ("1 Million Lucky", "Paco Rabanne", "dulce"),
    744: ("Polo Black", "Ralph Lauren", "amaderada"),
    787: ("Spicebomb", "Viktor & Rolf", "oriental"),
    788: ("1 Million", "Paco Rabanne", "oriental"),
    795: ("La Vie Est Belle", "Lancôme", "dulce"),
    796: ("Invictus", "Paco Rabanne", "fresca"),
    820: ("CH Men", "Carolina Herrera", "amaderada"),
    822: ("Good Girl Blush", "Carolina Herrera", "floral"),
    825: ("CH Eau de Toilette", "Carolina Herrera", "floral"),
    835: ("Toy 2 Bubble Gum", "Moschino", "dulce"),
    837: ("Odyssey Tyrant", "Armaf", "oriental"),
    847: ("In Motion", "Hugo Boss", "amaderada", "hombre"),
    848: ("Coco Mademoiselle", "Chanel", "floral"),
    849: ("Sauvage", "Dior", "fresca"),
    856: ("Khamrah", "Lattafa", "dulce"),
    883: ("The One for Men", "Dolce & Gabbana", "oriental"),
    931: ("Phantom", "Paco Rabanne", "fresca"),
    942: ("Swiss Army Classic", "Victorinox", "fresca"),
    944: ("212 Men Aqua", "Carolina Herrera", "fresca"),
    946: ("Caballo", "Armaf", "fresca"),
    956: ("212 Sexy Men", "Carolina Herrera", "oriental"),
    1009: ("Yara", "Lattafa", "dulce"),
    1026: ("CK One", "Calvin Klein", "fresca"),
    1027: ("Odyssey Mandarin Sky", "Armaf", "dulce"),
    1036: ("Arabians Tonka", "Montale", "oriental"),
    1057: ("Santal 33", "Le Labo", "amaderada"),
    1058: ("Can Can", "Paris Hilton", "frutal"),
    1092: ("Eros Energy", "Versace", "fresca"),
    1093: ("Bleu de Chanel", "Chanel", "amaderada"),
    1094: ("Shaheen Gold", "Lattafa", "oriental"),
    1096: ("Light Blue Pour Homme", "Dolce & Gabbana", "fresca"),
    1183: ("Black XS L'Aphrodisiaque", "Paco Rabanne", "dulce"),
    1184: ("Omnia Amethyste", "Bvlgari", "floral"),
    1230: ("Asad Elixir", "Lattafa", "oriental"),
    1247: ("Le Male Le Parfum", "Jean Paul Gaultier", "oriental"),
    1258: ("Viking Dubai", "Bharara", "fresca"),
    1259: ("Sweet Like Candy", "Ariana Grande", "dulce"),
    1263: ("L.12.12 Pour Elle Elegant", "Lacoste", "floral"),
    1264: ("L.12.12 Pour Elle Natural", "Lacoste", "fresca"),
    1267: ("Yara Candy", "Lattafa", "dulce"),
    1269: ("Blue Label", "Givenchy", "fresca"),
    1270: ("La Bomba", "Carolina Herrera", "floral"),
    1285: ("Acqua di Giò Profondo", "Giorgio Armani", "fresca", "hombre"),
    1286: ("Yara Tous", "Lattafa", "frutal"),
    1311: ("Devotion", "Dolce & Gabbana", "dulce"),
    1334: ("Fresh Couture", "Moschino", "floral"),
    1366: ("Uomo Born in Roma Coral Fantasy", "Valentino", "frutal"),
    1432: ("Island Breeze", "Armaf", "dulce"),
    1434: ("Yellow Diamond", "Versace", "floral"),
    1435: ("Yum Yum", "Armaf", "dulce"),
    1436: ("Set Lattafa Yara x4", "Lattafa", "dulce"),
    1437: ("Yara Moi", "Lattafa", "floral"),
    1439: ("Very Good Girl", "Carolina Herrera", "floral"),
    1440: ("Vulcan Feu", "French Avenue", "oriental"),
    1441: ("Toy 2 Pearl", "Moschino", "floral"),
    1442: ("Musamam White", "Lattafa", "oriental"),
    1443: ("Donna Born in Roma", "Valentino", "dulce"),
    1444: ("Tommy Girl", "Tommy Hilfiger", "floral"),
    1446: ("Starwalker", "Montblanc", "fresca"),
    1447: ("Stronger With You", "Emporio Armani", "dulce"),
    1448: ("Summer Hammer", "Lorenzo Pazzaglia", "frutal"),
    1449: ("Set Moschino Toy 2 x3 30 ml", "Moschino", "floral"),
    1450: ("Paris Hilton", "Paris Hilton", "floral"),
    1451: ("Paris Hilton for Men", "Paris Hilton", "fresca"),
    1452: ("Mallow Madness", "Lattafa", "dulce"),
    1454: ("Ralph", "Ralph Lauren", "frutal"),
    1455: ("R.E.M.", "Ariana Grande", "dulce"),
    1456: ("Scandal Pour Homme", "Jean Paul Gaultier", "dulce"),
    1457: ("Dania", "Orientica", "frutal"),
    1458: ("Amber Rouge", "Orientica", "oriental"),
    1459: ("Omnia Crystalline", "Bvlgari", "floral"),
    1461: ("Olympéa", "Paco Rabanne", "dulce"),
    1462: ("Ombre Nomade", "Louis Vuitton", "oriental"),
    1463: ("Omnia Coral", "Bvlgari", "frutal"),
    1464: ("Noble Blush", "Lattafa", "floral"),
    1465: ("Now Women", "Rave", "frutal"),
    1466: ("Odyssey Candee", "Armaf", "dulce"),
    1468: ("Man in Black", "Bvlgari", "oriental"),
    1469: ("Odyssey Mandarin Sky Elixir", "Armaf", "dulce"),
    1470: ("Layton", "Parfums de Marly", "oriental"),
    1471: ("Marshmallow Blush", "", "dulce"),
    1472: ("Mayar", "Lattafa", "frutal"),
    1473: ("Mayar Cherry Intense", "Lattafa", "frutal"),
    1474: ("Mayar Natural Intense", "Lattafa", "floral"),
    1481: ("Khamrah Dukhan", "Lattafa", "oriental"),
    1482: ("Khamrah Qahwa", "Lattafa", "dulce"),
    1483: ("Good Girl", "Carolina Herrera", "dulce"),
    1484: ("Island Bliss", "Armaf", "frutal"),
    1516: ("L'Eau d'Issey", "Issey Miyake", "floral"),
    1517: ("L'Eau d'Issey Pour Homme", "Issey Miyake", "fresca"),
    1522: ("Le Male Elixir", "Jean Paul Gaultier", "dulce"),
    1523: ("Le Beau Paradise Garden", "Jean Paul Gaultier", "fresca"),
    1527: ("Woman Intense", "Mercedes-Benz", "floral"),
    1534: ("Eros Flame", "Versace", "oriental"),
    1535: ("Erba Pura", "Xerjoff", "frutal"),
    1536: ("Fame", "Paco Rabanne", "floral"),
    1539: ("Art of Universe", "Lattafa", "frutal"),
    1540: ("Asad Bourbon", "Lattafa", "oriental"),
    1541: ("Asad Zanzibar", "Lattafa", "fresca"),
    1545: ("Bade'e Al Oud Amethyst", "Lattafa", "oriental"),
    1546: ("Plus Plus Feminine", "Diesel", "frutal"),
    1549: ("Meow!", "Katy Perry", "dulce"),
    1552: ("Kit de lujo Valentino x3 50 ml", "Valentino", "dulce", "dama"),
    1557: ("212 VIP Black", "Carolina Herrera", "oriental"),
    1558: ("212 VIP Rosé", "Carolina Herrera", "floral"),
    1594: ("360° Coral", "Perry Ellis", "frutal"),
    1595: ("360° for Men", "Perry Ellis", "fresca"),
    1596: ("360° for Women", "Perry Ellis", "floral"),
    1597: ("Armani Code", "Giorgio Armani", "oriental"),
    1598: ("Club de Nuit Intense Man", "Armaf", "amaderada"),
    1600: ("1 Million Royal", "Paco Rabanne", "oriental", "hombre"),
    1601: ("Bad Boy", "Carolina Herrera", "oriental"),
    1604: ("His Confession", "Lattafa", "oriental"),
    1605: ("Her Confession", "Lattafa", "dulce"),
    1613: ("Orange Man", "Hugo Boss", "dulce"),
    1620: ("Bombshell Intense", "Victoria's Secret", "frutal"),
    1621: ("Bombshell Paradise", "Victoria's Secret", "frutal"),
    1622: ("Set Ariana Grande x3", "Ariana Grande", "dulce"),
    1623: ("Bombshell Gold", "Victoria's Secret", "frutal"),
    1630: ("Le Male", "Jean Paul Gaultier", "oriental"),
    1631: ("Bombshell Seduction", "Victoria's Secret", "floral"),
    1632: ("Bade'e Al Oud for Glory", "Lattafa", "oriental"),
    1635: ("Very Sexy Night", "Victoria's Secret", "dulce"),
    1638: ("Silver Mountain Water", "Creed", "fresca"),
    1640: ("Set Lacoste L.12.12 x3", "Lacoste", "fresca", "hombre"),
    1641: ("Set Armaf Yum Yum x3 50 ml", "Armaf", "dulce", "dama"),
    1643: ("Bade'e Al Oud Sublime", "Lattafa", "frutal"),
    1652: ("Set Dior Sauvage miniaturas x3", "Dior", "fresca", "hombre"),
    1657: ("Pisa", "", None),
    1662: ("Thank U, Next", "Ariana Grande", "dulce"),
    1666: ("Nitro Red", "Dumont", "oriental"),
    1671: ("Acqua di Giò Profumo", "Giorgio Armani", "fresca"),
    1672: ("Chance", "Chanel", "floral"),
    1676: ("Fahrenheit", "Dior", "amaderada"),
    1677: ("Invictus Onyx", "Paco Rabanne", "fresca"),
    1681: ("Niche Femme", "Bharara", "dulce"),
    1682: ("Arsenal Black", "Gilles Cantuel", "oriental"),
    1683: ("Arsenal", "Gilles Cantuel", "fresca"),
    1701: ("Kit emprendedor x6 30 ml", "", None, "unisex"),
    1704: ("9 PM Rebel", "Afnan", "frutal"),
    1705: ("Atheeri", "Lattafa", "floral"),
    1706: ("Baccarat Rouge 540", "Maison Francis Kurkdjian", "oriental"),
    1708: ("Bharara Rose", "Bharara", "floral"),
    1714: ("Odyssey Dubai Chocolat", "Armaf", "dulce"),
    1715: ("Stallion 53", "", None),
    1720: ("Club de Nuit Sillage", "Armaf", "fresca"),
    1721: ("Delina", "Parfums de Marly", "floral"),
    1723: ("Emeer", "Lattafa", "dulce"),
    1751: ("Amber Noir", "Orientica", "oriental"),
    1752: ("Choco Overdose", "Lattafa", "dulce"),
    1759: ("The One", "Dolce & Gabbana", "oriental"),
    1785: ("Amor Amor", "Cacharel", "frutal"),
    1837: ("Khamrah Waha", "Lattafa", None),
    1852: ("Set Lattafa Give Me Gourmand x3 30 ml", "Lattafa", "dulce", "dama"),
    1866: ("Set Lattafa Khamrah x3", "Lattafa", "dulce", "unisex"),
    1884: ("Odyssey Mega", "Armaf", None),
    1886: ("Odyssey Pink Pop", "Armaf", "dulce"),
    1888: ("Odyssey Li'Chi Lush", "Armaf", "frutal"),
    1903: ("Erba Pura (nueva versión)", "Xerjoff", "frutal"),
}

# Recortes previos (izq, arriba, der, abajo) en fracción del lado: quitan rótulos del proveedor
CROP = {634: (0, 0.13, 0, 0), 1630: (0, 0.11, 0, 0), 376: (0, 0, 0, 0.07)}


def slugify(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def para_of(raw):
    u = raw.upper()
    if re.search(r"\bUNISEX\b", u):
        return "unisex"
    if re.search(r"\b(DAMA|MUJER)\b", u):
        return "dama"
    if re.search(r"\b(HOMBRE|HOMRE|MEN)\b", u):
        return "hombre"
    return "unisex"


def process(src, slug, crop):
    im = Image.open(src).convert("RGB")
    if crop:
        w, h = im.size
        l, t, r, b = crop
        im = im.crop((int(w * l), int(h * t), int(w * (1 - r)), int(h * (1 - b))))
    a = np.asarray(im).astype(np.int16)
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    white = float(((255 - border.min(1)) <= 12).mean())
    photo = white < 0.85
    if not photo:
        # Márgenes parejos: se recorta el blanco y se centra en un cuadrado con aire
        ys, xs = np.where((255 - a.min(2)) > 14)
        im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        side = int(max(im.size) * 1.12)
        canvas = Image.new("RGB", (side, side), (255, 255, 255))
        canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
        im = canvas
    else:
        side = min(im.size)
        im = im.crop(((im.width - side) // 2, (im.height - side) // 2, (im.width + side) // 2, (im.height + side) // 2))
    for size, suffix in ((720, ""), (360, "-sm")):
        im.resize((size, size), Image.LANCZOS).save(os.path.join(OUT_IMG, f"{slug}{suffix}.webp"), "WEBP", quality=80, method=6)
    return photo


rows, seen = [], set()
with open(os.path.join(SRC, "catalogo.csv"), encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        if r["categoria"] != "PERFUMERIA":
            continue
        pid = int(r["id"])
        if pid in seen:
            continue  # ids con dos fotos: se usa la primera
        seen.add(pid)
        name, brand, family, *rest = META[pid]
        raw = r["nombre"]
        para = rest[0] if rest else para_of(raw)
        quality = "AAA" if re.search(r"\bAAA\b", raw) else "1.1"
        full = name if brand.lower() in name.lower() else f"{brand} {name}"
        slug = "perfume-" + slugify(full) + ("-aaa" if quality == "AAA" else "")
        assert slug not in {x["slug"] for x in rows}, slug
        photo = process(os.path.join(SRC, r["archivo_imagen"]), slug, CROP.get(pid))
        rows.append(dict(id=pid, cost=int(float(r["precio_venta"])), antes=int(float(r["precio_antes"])), name=name,
                         brand=brand, para=para, quality=quality, family=family, slug=slug, photo=photo))


def ts(v):
    return json.dumps(v, ensure_ascii=False)


lines = [
    "/* Generado por brand/imagenes/perfumes.py desde el export del proveedor (17-sep-2026).",
    "   Se puede editar a mano; si se vuelve a correr el script, se sobrescribe. */",
    'import type { PerfumeRow } from "./perfumeria";',
    "",
    "// [id proveedor, costo proveedor, nombre, casa, para, calidad, familia olfativa, slug, foto con fondo]",
    "export const perfumeRows: PerfumeRow[] = [",
]
for x in rows:
    cells = [str(x["id"]), str(x["cost"]), ts(x["name"]), ts(x["brand"]), ts(x["para"]), ts(x["quality"]), ts(x["family"]), ts(x["slug"])]
    if x["photo"]:
        cells.append("true")
    lines.append("  [" + ", ".join(cells) + "],")
lines.append("];")
with open(OUT_TS, "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(lines) + "\n")

ref = [x for x in rows if x["antes"] > x["cost"]]
print(len(rows), "perfumes")
for m in (2, 2.5, 3):
    print(f"markup {m}: {sum(1 for x in ref if x['cost'] * m > x['antes'])}/{len(ref)} quedan por encima del precio 'antes' del proveedor")
print("fotos con fondo:", [x["id"] for x in rows if x["photo"]])
