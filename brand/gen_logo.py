#!/usr/bin/env python3
"""
Genera las variantes SVG del logo de DoxNetwork.

Parte del isotipo de Dox Designs (el contorno de una D que encierra una esfera
ensartada en dos anillos que se cruzan formando la X) y le suma una N a la
derecha. La N es gruesa (tubo de luz con halo y brillo interior): astas en el
azul del contorno y diagonal en el dorado del anillo A. En el centro de la
diagonal lleva una luna ensartada en un anillo con la misma inclinacion que el
anillo A, a la misma altura que el planeta de la D: planeta y luna. En los
cuatro vertices van nodos: la N es tambien un pequeno grafo, la "red".

Uso:  python gen_logo.py
"""
import pathlib

OUT = pathlib.Path(__file__).parent

# ------------------------------------------------------------------ geometria
CX, CY = 500.0, 420.0        # centro de la esfera y de los anillos
R_SPHERE = 112.0
R_PHOTON = 127.0
R_GLOW = 168.0

RO_X, RO_Y = 275.0, 66.0     # elipse exterior del anillo
RI_X, RI_Y = 155.0, 37.2     # elipse interior (misma relacion, 4.167)
TILT = 36.0

D_L = 305.0
D_T, D_B = 165.0, 675.0
D_SH = 420.0
D_BOWL = 255.7
D_W = 32.0                   # un poco más grueso para acompañar a la N gruesa

# La N: misma altura que la D. El hueco con la panza de la D es el mismo que
# deja la punta de los anillos, asi el conjunto respira parejo.
N_L, N_R = 790.0, 1030.0
N_STEM_W = 50.0              # astas: el doble de la D, para que la N pese igual que el planeta
N_DIAG_W = 58.0              # diagonal un poco más gruesa, como en una N tipográfica
R_NODE = 30.0

# Luna: centro de la diagonal. Cae justo a la altura del centro del planeta de
# la D (y = 420), así las dos esferas quedan alineadas en el mismo eje.
MX, MY = (N_L + N_R) / 2, (D_T + D_B) / 2
R_MOON = 50.0
MOON_RING = (94.0, 20.0)     # anillo de la luna, con la inclinación del anillo A (-36°)

VIEW_ICON = "262 100 840 640"          # D + N, horizontal
VIEW_SQUARE = "262 0 840 840"         # cuadrado para favicon / avatar
VIEW_FULL = "262 100 840 850"          # con logotipo debajo
FONT = "Georgia, 'Times New Roman', serif"

D_PATH = (f"M {D_L} {D_T} L {D_SH} {D_T} "
          f"A {D_BOWL} {D_BOWL} 0 1 1 {D_SH} {D_B} "
          f"L {D_L} {D_B} Z")
N_STEMS = f"M {N_L} {D_B} L {N_L} {D_T} M {N_R} {D_T} L {N_R} {D_B}"
N_DIAG = f"M {N_L} {D_T} L {N_R} {D_B}"
N_NODES = [(N_L, D_T), (N_R, D_B), (N_L, D_B), (N_R, D_T)]


def ring_half(half):
    if half == "back":
        return (f"M {-RO_X} 0 A {RO_X} {RO_Y} 0 0 1 {RO_X} 0 "
                f"L {RI_X} 0 A {RI_X} {RI_Y} 0 0 0 {-RI_X} 0 Z")
    return (f"M {RO_X} 0 A {RO_X} {RO_Y} 0 0 1 {-RO_X} 0 "
            f"L {-RI_X} 0 A {RI_X} {RI_Y} 0 0 0 {RI_X} 0 Z")


def rings(half, fill_a, fill_b):
    return (
        f'  <g transform="translate({CX} {CY}) rotate({-TILT})">\n'
        f'    <path d="{ring_half(half)}" fill="{fill_a}"/>\n'
        f'  </g>\n'
        f'  <g transform="translate({CX} {CY}) rotate({TILT})">\n'
        f'    <path d="{ring_half(half)}" fill="{fill_b}"/>\n'
        f'  </g>\n'
    )


def sphere(pal):
    ax, ay = R_PHOTON * 0.79, R_PHOTON * 0.62
    return (
        f'  <circle cx="{CX}" cy="{CY}" r="{R_GLOW}" fill="url(#glow)"/>\n'
        f'  <circle cx="{CX}" cy="{CY}" r="{R_SPHERE}" fill="url(#sphereFill)"/>\n'
        f'  <circle cx="{CX}" cy="{CY}" r="{R_PHOTON}" fill="none" '
        f'stroke="{pal["photon"]}" stroke-width="6" opacity="0.9"/>\n'
        f'  <path d="M {CX - ax:g} {CY + ay:g} A {R_PHOTON} {R_PHOTON} 0 0 0 '
        f'{CX + ax:g} {CY + ay:g}" fill="none" stroke="{pal["hot"]}" '
        f'stroke-width="8" stroke-linecap="round" opacity="0.9"/>\n'
    )


def moon_ring_half(half):
    """Mitad trasera (arriba) o delantera (abajo) del anillo de la luna."""
    rx, ry = MOON_RING
    sweep = 1 if half == "back" else 0
    return (f'<path d="M {-rx:g} 0 A {rx:g} {ry:g} 0 0 {sweep} {rx:g} 0" fill="none" '
            f'stroke="url(#ringA)" stroke-width="9" stroke-linecap="round"/>')


def letter_n(pal):
    """N gruesa con efecto de tubo de luz y una luna en la diagonal.

    Capas: halo difuminado, astas y diagonal, brillo interior (luz desde
    arriba a la izquierda), luna ensartada en su anillo y nodos de red.
    """
    dx, dy = N_R - N_L, D_B - D_T
    ln = (dx * dx + dy * dy) ** 0.5
    ox, oy = -dy / ln * 10, dx / ln * 10  # perpendicular a la diagonal
    if ox > 0:
        ox, oy = -ox, -oy
    return (
        f'  <g filter="url(#nGlow)" opacity="{pal["glowOpacity"]}">\n'
        f'    <path d="{N_STEMS}" fill="none" stroke="{pal["photon"]}" stroke-width="{N_STEM_W + 16:g}" stroke-linecap="round"/>\n'
        f'    <path d="{N_DIAG}" fill="none" stroke="{pal["hot"]}" stroke-width="{N_DIAG_W + 16:g}" stroke-linecap="round"/>\n'
        f'  </g>\n'
        f'  <path d="{N_STEMS}" fill="none" stroke="url(#nStem)" stroke-width="{N_STEM_W:g}" stroke-linecap="round"/>\n'
        f'  <path d="{N_DIAG}" fill="none" stroke="url(#nDiag)" stroke-width="{N_DIAG_W:g}" stroke-linecap="round"/>\n'
        f'  <path d="{N_STEMS}" transform="translate(-11 0)" fill="none" stroke="{pal["shine"]}" stroke-width="9" stroke-linecap="round" opacity="0.5"/>\n'
        f'  <path d="{N_DIAG}" transform="translate({ox:.1f} {oy:.1f})" fill="none" stroke="{pal["shineHot"]}" stroke-width="10" stroke-linecap="round" opacity="0.55"/>\n'
        f'  <g transform="translate({MX:g} {MY:g}) rotate(-36)">{moon_ring_half("back")}</g>\n'
        f'  <circle cx="{MX:g}" cy="{MY:g}" r="{R_MOON + 34:g}" fill="url(#glow)"/>\n'
        f'  <circle cx="{MX:g}" cy="{MY:g}" r="{R_MOON:g}" fill="url(#sphereFill)"/>\n'
        f'  <circle cx="{MX:g}" cy="{MY:g}" r="{R_MOON + 8:g}" fill="none" stroke="{pal["photon"]}" stroke-width="5" opacity="0.9"/>\n'
        f'  <path d="M {MX - 46:g} {MY + 35:g} A 58 58 0 0 0 {MX + 46:g} {MY + 35:g}" fill="none" stroke="{pal["hot"]}" stroke-width="6" stroke-linecap="round" opacity="0.9"/>\n'
        f'  <g transform="translate({MX:g} {MY:g}) rotate(-36)">{moon_ring_half("front")}</g>\n'
        + "".join(
            f'  <circle cx="{x:g}" cy="{y:g}" r="{R_NODE:g}" fill="{pal["node"]}" '
            f'stroke="{pal["hot"] if i < 2 else pal["photon"]}" stroke-width="10"/>\n'
            for i, (x, y) in enumerate(N_NODES)
        )
    )


def wordmark(fill):
    mid = 262 + 840 / 2
    return (
        f'  <text x="{mid:g}" y="838" text-anchor="middle" font-size="150" '
        f'font-weight="bold" letter-spacing="18" fill="{fill}">DOX</text>\n'
        f'  <text x="{mid + 12:g}" y="930" text-anchor="middle" font-size="64" '
        f'font-weight="bold" letter-spacing="26" fill="{fill}">NETWORK</text>\n'
    )


DARK = {
    "ringA": [("0", "#ffe3a8"), ("0.5", "#e8b04b"), ("1", "#d08c22")],
    "ringB": [("0", "#cdeeff"), ("0.5", "#6cc6f2"), ("1", "#3b74d8")],
    "ringAback": [("0", "#b08536"), ("0.5", "#8f6b28"), ("1", "#6f5320")],
    "ringBback": [("0", "#4a8fbe"), ("0.5", "#33689c"), ("1", "#274f7d")],
    "dStroke": [("0", "#9fdcff"), ("0.55", "#3b6fd4"), ("1", "#22409f")],
    "sphereFill": [("0", "#182341"), ("0.72", "#080c18"), ("1", "#05070f")],
    "glow": [("0.6", "#7fd0f733"), ("0.84", "#7fd0f716"), ("1", "#7fd0f700")],
    "text": [("0", "#cfc3ea"), ("0.5", "#eef2fb"), ("1", "#a8c4ef")],
    "nStem": [("0", "#b8e6ff"), ("0.5", "#4d86e0"), ("1", "#2a48a8")],
    "nDiag": [("0", "#fff0c4"), ("0.45", "#f0bb52"), ("1", "#c98420")],
    "photon": "#dcf3ff",
    "hot": "#f6c667",
    "shine": "#eaf7ff",
    "shineHot": "#fff6d8",
    "node": "#0f1424",
    "glowOpacity": 0.55,
}

LIGHT = {
    "ringA": [("0", "#f2cd80"), ("0.5", "#d99a2b"), ("1", "#b8791a")],
    "ringB": [("0", "#8fd2f2"), ("0.5", "#3b8fd8"), ("1", "#2456a8")],
    "ringAback": [("0", "#a97e2f"), ("0.5", "#886425"), ("1", "#684d1d")],
    "ringBback": [("0", "#4581ae"), ("0.5", "#2d5c8e"), ("1", "#224871")],
    "dStroke": [("0", "#2f7fd0"), ("0.55", "#26509f"), ("1", "#1c357f")],
    "sphereFill": [("0", "#1b2749"), ("0.72", "#0a1020"), ("1", "#05070f")],
    "glow": [("0.6", "#2f7fd016"), ("0.84", "#2f7fd00a"), ("1", "#2f7fd000")],
    "text": [("0", "#3a4a85"), ("0.5", "#1f2c5c"), ("1", "#3a4a85")],
    "nStem": [("0", "#4a9be0"), ("0.5", "#2a5bb0"), ("1", "#1c357f")],
    "nDiag": [("0", "#f7d58c"), ("0.45", "#dca13a"), ("1", "#a86d12")],
    "photon": "#3f92da",
    "hot": "#d99a2b",
    "shine": "#e6f3ff",
    "shineHot": "#fff3cf",
    "node": "#ffffff",
    "glowOpacity": 0.28,
}


def defs(pal):
    def lin(name, x2="1", y2="0.35"):
        stops = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in pal[name])
        return f'    <linearGradient id="{name}" x1="0" y1="0" x2="{x2}" y2="{y2}">{stops}</linearGradient>\n'

    def rad(name):
        stops = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in pal[name])
        return f'    <radialGradient id="{name}">{stops}</radialGradient>\n'

    return ("  <defs>\n" + lin("ringA") + lin("ringB") + lin("ringAback")
            + lin("ringBback") + lin("dStroke", "0.6", "1") + rad("sphereFill")
            + rad("glow") + lin("text", "1", "0")
            + lin("nStem", "0", "1") + lin("nDiag", "0.4", "1")
            + '    <filter id="nGlow" x="-40%" y="-20%" width="180%" height="140%">'
              '<feGaussianBlur stdDeviation="16"/></filter>\n'
            + "  </defs>\n")


def icon_body(pal):
    return (
        f'  <path d="{D_PATH}" fill="none" stroke="url(#dStroke)" '
        f'stroke-width="{D_W}" stroke-linejoin="round"/>\n'
        + letter_n(pal)
        + rings("back", "url(#ringAback)", "url(#ringBback)")
        + sphere(pal)
        + rings("front", "url(#ringA)", "url(#ringB)")
    )


def svg(view, comment, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" '
            f'font-family="{FONT}">\n  <!-- {comment} -->\n{body}</svg>\n')


def mono_body():
    # En una tinta la diagonal se corta alrededor de la luna para que se lea.
    dx, dy = N_R - N_L, D_B - D_T
    ln = (dx * dx + dy * dy) ** 0.5
    ux, uy = dx / ln, dy / ln
    gap = R_MOON + 22
    x1, y1 = MX - ux * gap, MY - uy * gap
    x2, y2 = MX + ux * gap, MY + uy * gap
    rx, ry = MOON_RING
    return (
        '  <g fill="none" stroke="currentColor">\n'
        f'    <ellipse cx="0" cy="0" rx="{RO_X}" ry="{RO_Y}" stroke-width="19" transform="translate({CX} {CY}) rotate({-TILT})"/>\n'
        f'    <ellipse cx="0" cy="0" rx="{RO_X}" ry="{RO_Y}" stroke-width="19" transform="translate({CX} {CY}) rotate({TILT})"/>\n'
        f'    <ellipse cx="0" cy="0" rx="{rx:g}" ry="{ry:g}" stroke-width="9" transform="translate({MX:g} {MY:g}) rotate(-36)"/>\n'
        '  </g>\n'
        f'  <circle cx="{CX}" cy="{CY}" r="{R_SPHERE}" fill="currentColor"/>\n'
        f'  <circle cx="{MX:g}" cy="{MY:g}" r="{R_MOON:g}" fill="currentColor"/>\n'
        f'  <path d="{D_PATH}" fill="none" stroke="currentColor" stroke-width="{D_W}" stroke-linejoin="round"/>\n'
        f'  <path d="{N_STEMS}" fill="none" stroke="currentColor" stroke-width="{N_STEM_W:g}" stroke-linecap="round"/>\n'
        f'  <path d="M {N_L} {D_T} L {x1:.1f} {y1:.1f} M {x2:.1f} {y2:.1f} L {N_R} {D_B}" fill="none" stroke="currentColor" stroke-width="{N_DIAG_W:g}" stroke-linecap="round"/>\n'
    )


def favicon_body(pal):
    """Versión para 16-64 px: fondo propio, trazos muy gruesos, sin anillos ni brillos.
    A ese tamaño los anillos se vuelven ruido; quedan la D con su planeta y la N con su luna."""
    return (
        f'  <rect x="262" y="0" width="840" height="840" rx="190" fill="#0f1424"/>\n'
        f'  <path d="{D_PATH}" fill="none" stroke="url(#dStroke)" stroke-width="64" stroke-linejoin="round"/>\n'
        f'  <circle cx="{CX}" cy="{CY}" r="96" fill="{pal["hot"]}"/>\n'
        f'  <path d="{N_STEMS}" fill="none" stroke="url(#nStem)" stroke-width="84" stroke-linecap="round"/>\n'
        f'  <path d="{N_DIAG}" fill="none" stroke="url(#nDiag)" stroke-width="92" stroke-linecap="round"/>\n'
    )


FILES = {
    "doxnetwork-icon.svg": (VIEW_ICON, "Isotipo DN - fondos oscuros", lambda: defs(DARK) + icon_body(DARK)),
    "doxnetwork-icon-light.svg": (VIEW_ICON, "Isotipo DN - fondos claros", lambda: defs(LIGHT) + icon_body(LIGHT)),
    "doxnetwork-square.svg": (VIEW_SQUARE, "Isotipo DN cuadrado - favicon/avatar", lambda: defs(DARK) + icon_body(DARK)),
    "doxnetwork-color.svg": (VIEW_FULL, "Version principal - fondos oscuros", lambda: defs(DARK) + icon_body(DARK) + wordmark("url(#text)")),
    "doxnetwork-color-light.svg": (VIEW_FULL, "Version principal - fondos claros", lambda: defs(LIGHT) + icon_body(LIGHT) + wordmark("url(#text)")),
    "doxnetwork-favicon.svg": (VIEW_SQUARE, "Favicon simplificado 16-64 px", lambda: defs(DARK) + favicon_body(DARK)),
    "doxnetwork-icon-mono.svg": (VIEW_ICON, "Monocromo: hereda currentColor", mono_body),
}

if __name__ == "__main__":
    for name, (view, comment, body) in FILES.items():
        (OUT / name).write_text(svg(view, comment, body()), encoding="utf-8")
        print("ok", name)
