"""Imágenes de la landing /comedero a partir de los renders del proveedor.

Uso:  python brand/imagenes/comedero.py
Lee   productos/comedero-gravedad/img-proveedor/01-trio-verde-gris-azul.png
Toca  public/comedero/

Solo se usa la 01 (el trío sin texto). Las otras tres traen un rótulo en
inglés quemado arriba a la izquierda y la 02 además cotas: recortarlas sin
cortar las orejas de la tapa no salía limpio, y el encargo autorizaba tirar del
trío en ese caso. Los tres colores salen de recortes del mismo render, así que
comparten ángulo, luz y fondo; para el selector eso es una ventaja.

Sin AVIF a propósito: el resto del sitio va en WebP con srcset y el hueco de
<picture> no está montado. Un formato nuevo por una landing no compensa.

Todo son renders, no fotos de la unidad: se reemplazan cuando llegue la muestra.
"""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parents[2]
ORIGEN = RAIZ / "productos/comedero-gravedad/img-proveedor/01-trio-verde-gris-azul.png"
SALIDA = RAIZ / "public/comedero"
SALIDA.mkdir(parents=True, exist_ok=True)

trio = Image.open(ORIGEN).convert("RGB")  # 1036 × 1034, opaco
W, H = trio.size


def guarda(im: Image.Image, nombre: str, ancho: int | None = None, calidad: int = 82) -> None:
    if ancho and im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    destino = SALIDA / nombre
    if nombre.endswith(".jpg"):
        im.save(destino, "JPEG", quality=86, optimize=True, progressive=True)
    else:
        im.save(destino, "WEBP", quality=calidad, method=6)
    print(f"  {nombre:20s} {im.width}x{im.height}  {destino.stat().st_size // 1024} KB")


# Portada: el trío entero, cuadrado.
guarda(trio, "portada.webp", 1000)
guarda(trio, "portada-sm.webp", 520)

# og:image: apaisado alrededor de los comederos. Meta y WhatsApp piden ≥600×315;
# JPG porque algunos previsualizadores todavía no muestran WebP.
guarda(trio.crop((0, 215, W, 215 + 630)), "portada-og.jpg")

# "Así se ve", hueco ancho 16:10.
guarda(trio.crop((0, 200, W, 847)), "trio-ancho.webp", 1000)

# Un recorte por color. Los comederos se solapan un poco en profundidad, así
# que cada caja deja entrar un borde del vecino; en miniatura no se nota y en
# el bloque de compra el encuadre centrado lo esconde.
CAJAS = {
    "verde": (80, 250, 430, 830),
    "gris": (350, 250, 700, 830),
    "azul": (640, 250, 990, 830),
}
for color, caja in CAJAS.items():
    guarda(trio.crop(caja), f"{color}.webp")
