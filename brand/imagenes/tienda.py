"""Genera src/data/articulos.ts y public/tienda/*.webp: relojería y tecnología.

Uso:  python brand/imagenes/tienda.py <carpeta del export>
La carpeta es la del ZIP de Emprendered (productos.csv) con una subcarpeta
img/ que tenga la imagen principal de cada producto como <id>.webp (se bajan
con descargar_imagenes.sh o con el `imagen` de cada fila).

Los nombres del proveedor vienen en mayúsculas y con errores ("SMARTWACHT",
"BLUETOOH", "DEPI"): se pasan a formato título, con tildes y siglas
corregidas. La subcategoría de tecnología se deduce por palabras clave.
"""
import csv, json, os, re, sys, unicodedata
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = sys.argv[1]
OUT_IMG = os.path.join(ROOT, "public", "tienda")
OUT_TS = os.path.join(ROOT, "src", "data", "articulos.ts")
os.makedirs(OUT_IMG, exist_ok=True)

# ── Nombres ──────────────────────────────────────────────────────────────
FIX = {
    "SMARTWACHT": "Smartwatch", "SMARTWATCH": "Smartwatch", "WACHT": "Watch", "SUBAMARINE": "Submarine",
    "BLUETOOH": "Bluetooth", "BLUETOOTH": "Bluetooth", "DEPI": "DPI", "INALAMBRICO": "Inalámbrico",
    "INALAMBRICA": "Inalámbrica", "INALAMBRICOS": "Inalámbricos", "INALAMBRICAS": "Inalámbricas",
    "INALAMBRCO": "Inalámbrico", "ALAMBRICO": "Alámbrico", "PORTATIL": "Portátil", "LAMPARA": "Lámpara",
    "LAMPARAS": "Lámparas", "MAGNETICA": "Magnética", "MAGNETICO": "Magnético", "TACTIL": "Táctil",
    "CAMARA": "Cámara", "MICROFONO": "Micrófono", "ECONOMICO": "Económico", "RAPIDO": "Rápido",
    "RAPIDA": "Rápida", "GENERACION": "Generación", "EDICION": "Edición", "MECANICO": "Mecánico",
    "SELECCION": "Selección", "AMERICA": "América", "ATLETICO": "Atlético", "ERGONOMICO": "Ergonómico",
    "TELEFONO": "Teléfono", "VERIFICACION": "Verificación", "MAQUINA": "Máquina", "AUDIFONOS": "Audífonos",
    "ESPIA": "Espía", "ESTACION": "Estación", "MUSICA": "Música", "LAPIZ": "Lápiz", "METALICO": "Metálico",
    "PLASTICO": "Plástico", "TORNAZOL": "Tornasol", "BAFLE": "Bafle", "BLAFLE": "Bafle", "MAUSE": "Mouse",
    "DIADEMA": "Diadema", "DIADEMAS": "Diademas", "ELECTRICO": "Eléctrico", "COMUNICACION": "Comunicación",
    "BATERIA": "Batería", "VEHICULO": "Vehículo", "DECORACION": "Decoración", "PROTECCION": "Protección",
    "RELOJ": "Reloj", "CARAGOR": "Cargador", "CODABURY": "Codabury", "ACCION": "Acción", "IPHONE": "iPhone",
    "AIRPODS": "AirPods", "GOPRO": "GoPro", "GO-PRO": "GoPro", "IPAD": "iPad", "TIKTOK": "TikTok",
    "TIK": "Tik", "TOK": "Tok", "G-TIDE": "G-Tide", "MAH": "mAh", "Q&Q": "Q&Q", "G-SHOCK": "G-Shock", "JBL": "JBL",
    "MINI": "Mini", "PRO": "Pro", "MAX": "Max", "ULTRA": "Ultra", "PLUS": "Plus", "ROBOT": "Robot",
    "PAD": "Pad", "HOLDER": "Holder", "HOLDERS": "Holders", "BOQUITOQUI": "Boquitoqui", "SUPERRAPIDO": "Superrápido",
    "ULTRA-RAPIDO": "Ultrarrápido", "CORAZON": "Corazón", "DAMA": "dama", "HOMBRE": "hombre", "PAREJA": "pareja",
    "LUZ": "luz", "PARA": "para", "CON": "con", "DE": "de", "DEL": "del", "EN": "en", "Y": "y", "E": "e", "A": "a",
    "O": "o", "LA": "la", "EL": "el", "LOS": "los", "LAS": "las", "SIN": "sin", "X": "x", "TIPO": "tipo",
    "ENTRADA": "entrada", "UNIVERSAL": "universal", "ORIGINALES": "", "ORIGINAL": "", "REPLICA": "",
}
ACRONYMS = {"USB", "LED", "RGB", "TV", "DPI", "ANC", "ENC", "TWS", "AUX", "AI", "IA", "HD", "AMOLED", "GPS", "PC",
            "UB6", "S3", "AP", "IPX6", "K90", "4K", "8GB", "SD", "WIFI", "BT", "IOS", "FHD", "LCD", "USB-C", "MM"}
LOWER_ALWAYS = {"dama", "hombre", "pareja", "luz", "para", "con", "de", "del", "en", "y", "e", "a", "o", "la", "el",
                "los", "las", "sin", "x", "tipo", "entrada", "universal"}


def word(w, first):
    up = w.upper()
    if up in FIX:
        out = FIX[up]
        if out and first and out in LOWER_ALWAYS:
            out = out[0].upper() + out[1:]
        return out
    if up in ACRONYMS:
        return up
    if re.search(r"\d", w):  # referencias: ES21, KP-539, 10.000, 8GB+128GB
        return up.replace("MAH", "mAh")
    if len(w) <= 2 and w.isalpha():
        return up
    return w[0].upper() + w[1:].lower()


def title(raw):
    raw = re.sub(r"\s+", " ", raw.replace("–", "-")).strip()
    words = [x for x in raw.split(" ") if x]
    out = []
    for w in words:
        t = word(w, not out)
        if t:
            out.append(t)
    s = " ".join(out)
    s = re.sub(r"\s+", " ", s).strip(" -+")
    return s[0].upper() + s[1:] if s else s


# ── Marcas ───────────────────────────────────────────────────────────────
BRANDS = [
    ("PATEK PHILIPPE", "Patek Philippe"), ("RICHARD MILLE", "Richard Mille"), ("TOMMY HILFIGER", "Tommy Hilfiger"),
    ("TECNO MARINE", "Technomarine"), ("G-SHOCK", "Casio G-Shock"), ("KAIROS", "Kairos"), ("Q&Q", "Q&Q"),
    ("CASIO", "Casio"), ("ROLEX", "Rolex"), ("HUBLOT", "Hublot"), ("TISSOT", "Tissot"), ("OAKLEY", "Oakley"),
    ("INVICTA", "Invicta"), ("CARTIER", "Cartier"), ("AP CH", "Audemars Piguet"), ("YOOKIE", "Yookie"),
    ("JBL", "JBL"), ("SAMSUNG", "Samsung"), ("APPLE", "Apple"), ("KOLEER", "Koleer"), ("AIBIMY", "Aibimy"),
    ("OKOP", "Okop"), ("G-TIDE", "G-Tide"), ("MOBULAA", "Mobulaa"), ("KIMISO", "Kimiso"), ("ALAXE", "Alaxe"),
    ("ROKU", "Roku"), ("FIRE TV", "Amazon"), ("WISME", "Wisme"), ("MIKUSO", "Mikuso"),
]


def brand_of(n):
    u = f" {n.upper()} "
    for key, label in BRANDS:
        if f" {key} " in u or f" {key}" in u and key == "AP CH":
            return label
    return ""


# ── Subcategorías de tecnología (el orden importa: gana la primera) ───────
SUBS = [
    ("smartwatches", r"SMART ?WA[CT]{2}H|SMARTWATCH|RELOJ INTELIGENTE|SERIE ?11|SERIES 1[01]|ULTRA ?[38]|BIG ?[23]|LG88|S9 MINI|D200|I20|P9 ULTRA|X8|X9|HOT-5|RELOJ FIT|RELOJ EN COMBO|ZT-36|GUS-16|UB6"),
    ("audio", r"AIBIMY|AIRPODS|AIRPDOS|AUDIFONO|AURICULAR|DIADEMA|PARLANTE|BAFLE|BLAFLE|BOCINA|SPEAKER|SONIDO|MICROFONO|FLIP ?7|M10\b|BOQUITOQUI|INTERCOMUNICADOR|SPINNER|YKS286|EO102"),
    ("carga", r"CARGADOR|CABLE|POWER ?BANK|ESTACION DE CARGA|MULTIPUERTO|HUB|CARGA INALAMBRICA"),
    ("gaming", r"GAME|CONSOLA|JUEGOS|MOUSE|MAUSE|TECLADO|GAMER|PROYECTOR(?! DE LUZ)|TV ?BOX|TV STICK|ROKU|FIRE TV|DRON|STICK-TV|IMPRESORA|REFRIGERANTE"),
    ("soportes", r"SOPORTE|HOLDER|HOLD[- ]|TRIPODE|PALO DE SELFIE|BASE|PORTA ?CELULAR|ARO DE LUZ|RING|ESTABILIZADOR|MESA PARA AUTO|ESPEJOS? RETROVISOR|FUNDA|KIT DE GRABACION|KIT PARA CREAR|PANTALLA SELFIE|AMPLIFICADOR|LAPIZ|STYLUS|PUNTA|GO-?PRO"),
    ("hogar", r"LAMPARA|LUZ|BOMBILLO|VENTILADOR|PROYECTOR DE LUZ|ESTRELLA|DESPERTADOR|DECORATIVA|RGB"),
]
SUB_LABEL = {
    "smartwatches": "Smartwatches", "audio": "Audio", "carga": "Carga y cables", "gaming": "Gaming y TV",
    "soportes": "Soportes y creadores", "hogar": "Luces y hogar", "otros": "Gadgets", "relojes": "Relojes",
    "accesorios": "Accesorios",
}


def sub_of(line, name):
    u = name.upper()
    if "PORTA RELOJ" in u:
        return "accesorios"
    if line == "relojeria":
        return "relojes"
    for key, rx in SUBS:
        if re.search(rx, u):
            return key
    return "otros"


# Correcciones a mano donde la regla general no alcanza
NAME = {
    35: "AirPods Pro 2.ª generación ANC", 844: "AirPods TWS M&M's", 891: "Parlante G-Tide SH-30 Speaker Box",
    1001: "Diadema G-Tide C1", 1002: "Diadema Mobulaa C1 Lite", 1273: "AirPods T11 Labubu",
    1393: "Smartwatch 7 correas + audífonos Bluetooth", 1203: "Audífonos con cable tipo C TM-A",
    1542: "Audífonos Mobulaa Future Clip", 1543: "Smartwatch Mobulaa IW12 Mini", 1758: "Fire TV Stick",
    1873: "JBL Flip 7", 81: "Tissot CHSSF", 156: "Casio FRQ", 172: "Technomarine", 120: "Hublot A3",
    552: "Kairos HA590M-904", 1529: "Casio dama CH3334", 1895: "Cartier dama C41", 1679: "Kairos Mecánico DU430493G-3",
    1476: "Kairos Oficial Selección Colombia", 703: "Kairos Oficial Atlético Nacional",
    842: "Kairos Oficial América de Cali 2026", 47: "Reloj estilo Casio dorado", 146: "Reloj estilo Casio plateado",
    196: "Reloj estilo Casio oro rosa", 781: "Reloj estilo Casio negro", 82: "Casio correa de plástico",
    1294: "Aro de luz RGB YM-300", 1851: "Espejos retrovisores para patineta", 1717: "Kit gamer 4 artículos",
    1879: "Consola Retro Pro R36S +15.000 juegos", 1614: "Mini proyector LED YG300",
    1790: "Kit de grabación para celular AY-49 RGB", 1115: "Aro de luz RGB 26 cm", 1795: "Localizador inteligente F15",
    89: "Game Retro 400 juegos para 2 jugadores", 1797: "Audífonos OWS YKS286", 1392: "Smartwatch dama ME32",
    1718: "Smartwatch Serie 11 dama + 3 correas", 1771: "Smartwatch Ultra Combo Pro",
    1095: "Smartwatch Wisme + AirPods + 7 correas", 714: "Parlante Aibimy MY212 Waterproof",
    817: "Parlante Aibimy MY262BT IPX6", 1212: "Smartwatch + Gamebox + correa Pro HOT-5", 632: "Porta celular",
    139: "Reloj digital económico amarillo", 192: "Reloj digital económico verde",
    854: "Combo Rolex hombre y dama A10", 1477: "Combo pareja Cartier CH1", 1906: "Cable tipo C trenzado AV-10728",
    1044: "Smartwatch P9 Ultra + 7 correas", 1181: "Smartwatch X8 combo", 1342: "Smartwatch X9 combo",
    272: "Smartwatch D100 + audífonos",
}
SUB = {525: "soportes", 1112: "soportes", 891: "audio", 1542: "audio", 1543: "smartwatches", 1771: "smartwatches",
       1095: "smartwatches", 1133: "carga"}
BRAND = {703: "Kairos", 842: "Kairos", 1543: "Mobulaa", 1542: "Mobulaa", 891: "G-Tide", 1758: "Amazon", 35: "Apple",
         947: "Apple", 1778: "Apple"}
COND = {1758: "replica"}


def slugify(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def process(pid, slug):
    src = os.path.join(SRC, "img", f"{pid}.webp")
    im = Image.open(src).convert("RGB")
    side = min(im.size)
    im = im.crop(((im.width - side) // 2, (im.height - side) // 2, (im.width + side) // 2, (im.height + side) // 2))
    for size, suffix in ((720, ""), (360, "-sm")):
        im.resize((size, size), Image.LANCZOS).save(os.path.join(OUT_IMG, f"{slug}{suffix}.webp"), "WEBP", quality=78, method=6)


rows, seen, slugs = [], set(), set()
with open(os.path.join(SRC, "productos.csv"), encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        pid = int(r["id"])
        if pid in seen:
            continue  # 44 (smartwatch) y 412 (porta reloj) vienen en dos categorías
        seen.add(pid)
        raw = r["nombre"].strip()
        cat = r["categoria"]
        u = raw.upper()
        if cat == "TECNOLOGIA" or pid == 44:
            line = "tecnologia"
            cond = "replica" if re.search(r"\b1\.1\b|REPLICA|\bAAA\b", u) else "original" if re.search(r"ORIGINAL|OFICIAL", u) else None
        else:
            line = "relojeria"
            cond = "original" if cat == "RELOJERIA ORIGINAL" else "replica"
        if pid == 412:
            cond = None  # accesorio, ni original ni réplica
        clean = re.sub(r"\b1\.1\b|\bAAA\b", " ", raw)
        name = title(clean).replace("Smart Watch", "Smartwatch")
        name = re.sub(r"^AP\b", "Audemars Piguet", name)
        brand = BRAND.get(pid) or brand_of(raw)
        if brand == "Audemars Piguet":
            name = name.replace("Audemars Piguet", "Audemars Piguet Royal Oak", 1)
        if NAME.get(pid):
            name = NAME[pid]
        sub = SUB.get(pid) or sub_of(line, raw)
        cond = COND.get(pid, cond)
        base = slugify(name)
        slug = f"{line}-{base}"
        if slug in slugs:
            slug = f"{slug}-{pid}"
        slugs.add(slug)
        process(pid, slug)
        rows.append(dict(id=pid, cost=round(float(r["precio"])), name=name, brand=brand, line=line, sub=sub,
                         cond=cond, slug=slug, soldout=r["disponibilidad"] != "EN STOCK"))


def ts(v):
    return json.dumps(v, ensure_ascii=False)


lines = [
    "/* Generado por brand/imagenes/tienda.py desde el export del proveedor (17-sep-2026).",
    "   Se puede editar a mano; si se vuelve a correr el script, se sobrescribe. */",
    'import type { ArticuloRow } from "./lineas";',
    "",
    "// [id proveedor, costo proveedor, nombre, marca, línea, subcategoría, condición, slug, agotado]",
    "export const articuloRows: ArticuloRow[] = [",
]
for x in rows:
    cells = [str(x["id"]), str(x["cost"]), ts(x["name"]), ts(x["brand"]), ts(x["line"]), ts(x["sub"]), ts(x["cond"]), ts(x["slug"])]
    if x["soldout"]:
        cells.append("true")
    lines.append("  [" + ", ".join(cells) + "],")
lines.append("];")
with open(OUT_TS, "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(lines) + "\n")

from collections import Counter
print(len(rows), "artículos")
print(Counter((x["line"], x["sub"]) for x in rows))
print(Counter((x["line"], x["cond"]) for x in rows))
