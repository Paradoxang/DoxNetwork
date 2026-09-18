"""Avatar de marca de ASTRO para los chats de la página.

Uso:  python brand/imagenes/astro_avatar.py
Lee   ../Portafolio 2.0/avatar_astro_marcaB.png (aprobado)
Deja  public/astro/avatar.webp y avatar-sm.webp

En el FAQ y en el teléfono de "Cómo comprar" el chat mostraba el isotipo DN.
Un chat con cara se lee como una persona, que es justo lo que promete el texto
("te responde una persona"). El avatar viene sobre navy, no sobre gris, así que
no hay que recortar nada: basta con encuadrar la cabeza en cuadrado.
"""
import pathlib

from PIL import Image

SRC = pathlib.Path(r"C:\Users\Santiago pc\Proyectos\Portafolio 2.0\avatar_astro_marcaB.png")
OUT = pathlib.Path("public/astro")
OUT.mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert("RGB")
# La cabeza ocupa el tercio superior del lienzo; se recorta cuadrado a su altura
lado = int(im.width * 0.62)
izq = (im.width - lado) // 2
arriba = int(im.height * 0.08)
cuadro = im.crop((izq, arriba, izq + lado, arriba + lado))

for tam, nombre in ((256, "avatar.webp"), (96, "avatar-sm.webp")):
    cuadro.resize((tam, tam), Image.LANCZOS).save(OUT / nombre, "WEBP", quality=88, method=6)
    print(nombre, tam)
