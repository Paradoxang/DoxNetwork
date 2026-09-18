"""Extrae los elementos decorativos del portafolio a public/deco/.

Uso:  python brand/imagenes/deco.py
Lee   ../Portafolio 2.0/*.png (renders de ASTRO y del universo Dox)
Deja  public/deco/<nombre>.webp

Hay dos familias y cada una se usa distinto en la página:

  · LUZ (fondo negro): partículas, nebulosas, anillos, retículas, marcos.
    Se dejan tal cual y en la página van con `mix-blend-mode: screen`, que
    descarta el negro sobre el fondo navy. Salen livianas y sin bordes.

  · OBJETO (fondo gris de estudio): orbes de cromo, cristales, el escudo,
    la llave… Aquí sí hay que recortar: se marca como fondo lo que está
    conectado al borde y se parece al gris, se mata la sombra proyectada
    (más oscura que el fondo y sin color) y se suaviza el filo.
"""
import pathlib

import numpy as np
from PIL import Image, ImageFilter

SRC = pathlib.Path(r"C:\Users\Santiago pc\Proyectos\Portafolio 2.0")
OUT = pathlib.Path("public/deco")

# nombre de salida -> archivo de origen
LUZ = {
    "particulas": "hero_assets_particles.png",
    "particulas-campo": "hero_assets_particles_layer.png",
    "anillo": "hero_assets_orbital_ring.png",
    "reticula": "hero_assets_reticle_SVG.png",
    "esquinas": "hero_assets_corners_SVG.png",
    "marco": "hero_assets_empty_textframe_SVG.png",
    "banda": "hero_assets_databand_SVG.png",
    "malla": "hero_assets_wireframe.png",
    "nebulosa": "WDID_obj_10_nebulosa.png",
    "velo": "WDID_obj_11_velo_izq.png",
    "destello": "WDID_obj_02_destello.png",
    "nodo": "WDID_obj_01_nodo.png",
    "lente": "WDID_obj_09_lente.png",
    "esfera": "WDID_obj_08_esfera.png",
    "diagrama": "WDID_obj_07_diagrama.png",
    "estela": "SC_asset_02_estela.png",
    "polvo": "SC_asset_03_particulas.png",
    "fibra": "WDID_obj_04_fibra.png",
    "escombros": "PR_asset_escombros.png",
    "proyeccion": "PR_asset_proyeccion.png",
    "guijarro": "WDID_obj_05_guijarro.png",
    "nebulosa-densa": "SC_asset_04_nebulosa.png",
}

OBJETO = {
    "orbe-1": "hero_assets_chrome_orb1.png",
    "orbe-2": "hero_assets_chrome_orb2.png",
    "orbe-3": "hero_assets_chrome_orb3.png",
    "cristal-1": "hero_assets_cystal_shard1.png",
    "cristal-2": "hero_assets_cystal_shard2.png",
    "cristal-3": "hero_assets_cystal_shard3.png",
    "vortice": "hero_assets_liquid_chrome_vortex.png",
    "escudo": "SC_asset_07_escudo.png",
    "llave": "SC_asset_05_llave.png",
    "boveda": "SC_asset_06_boveda.png",
    "nave": "SC_asset_01_nave.png",
    "modulo": "WDID_asset_01_modulo.png",
    "astrolabio": "WDID_asset_02_astrolabio.png",
    "cristal-capas": "WDID_asset_03_cristal.png",
    "vela": "WDID_asset_04_vela.png",
    "sello": "WDID_obj_03_sello.png",
    "tableta": "PR_asset_tableta.png",
    "stylus": "PR_asset_stylus.png",
    "cartucho": "PR_asset_cartucho.png",
    "brazo": "PR_asset_brazo.png",
    "cinta": "WDID_obj_06_cinta.png",
    # Busto de ASTRO ilustrado: el visor con el agujero negro dentro. Se recorta
    # como objeto porque viene sobre el mismo gris de estudio que los demás.
    "astro-visor": "visor_a1.png",
}

ANCHO_LUZ = 1280
LADO_OBJETO = 760


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


def apaga_croma(rgb: np.ndarray) -> np.ndarray:
    """La tableta viene con pantalla de croma verde: se apaga a navy.

    El render trae la pantalla en verde para componer encima. Aquí no hay nada
    que componer, así que se sustituye por el navy del sitio con un punto de
    brillo, como una pantalla en reposo.
    """
    verde = (rgb[:, :, 1] > rgb[:, :, 0] * 1.35) & (rgb[:, :, 1] > rgb[:, :, 2] * 1.35) & (rgb[:, :, 1] > 70)
    if verde.mean() < 0.01:
        return rgb
    luz = rgb[:, :, 1] / 255.0
    out = rgb.copy()
    for i, canal in enumerate((23, 30, 58)):  # #171e3a
        out[:, :, i] = np.where(verde, canal + luz * 26, rgb[:, :, i])
    return out


def recorta(f: pathlib.Path) -> Image.Image:
    rgb = apaga_croma(np.asarray(Image.open(f).convert("RGB")).astype(np.float32))
    borde = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    fondo = np.median(borde, axis=0)

    dist = np.abs(rgb - fondo).max(2)
    luma = rgb.mean(2)
    croma = rgb.max(2) - rgb.min(2)

    # La sombra proyectada es gris y más oscura que el fondo: fuera también
    sombra = (luma < fondo.mean() - 3) & (croma < 16)
    parecido = (dist <= 26) | sombra
    fuera = conectado_al_borde(parecido)

    alpha = np.clip((dist - 10) / 18, 0, 1)
    alpha[fuera] = 0
    a = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))

    img = Image.fromarray(rgb.astype(np.uint8)).convert("RGBA")
    img.putalpha(a)
    return img.crop(img.getbbox() or (0, 0, img.width, img.height))


OUT.mkdir(parents=True, exist_ok=True)
for nombre, archivo in LUZ.items():
    im = Image.open(SRC / archivo).convert("RGB")
    if im.width > ANCHO_LUZ:
        im = im.resize((ANCHO_LUZ, round(im.height * ANCHO_LUZ / im.width)), Image.LANCZOS)
    im.save(OUT / f"{nombre}.webp", "WEBP", quality=72, method=6)
    print("luz", nombre, im.size)

for nombre, archivo in OBJETO.items():
    im = recorta(SRC / archivo)
    escala = LADO_OBJETO / max(im.size)
    if escala < 1:
        im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    im.save(OUT / f"{nombre}.webp", "WEBP", quality=84, method=6)
    print("objeto", nombre, im.size)
