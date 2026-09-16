#!/usr/bin/env python3
"""
Genera las variantes SVG del logo de DoxNetwork.

Parte del isotipo de Dox Designs (el contorno de una D que encierra una esfera
ensartada en dos anillos que se cruzan formando la X) y le suma una N a la
derecha. La N se construye con el mismo trazo de la D: sus astas en el azul del
contorno y la diagonal en el dorado del anillo A, para que las dos letras se
lean como una sola familia. En los cuatro vertices de la N van nodos: la N es a
la vez la letra y un pequeno grafo, la "red" de DoxNetwork.

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
D_W = 24.0

# La N: misma altura y mismo grosor que la D. El hueco con la panza de la D es
# el mismo que deja la punta de los anillos, asi el conjunto respira parejo.
N_L, N_R = 790.0, 1030.0
N_W = D_W
R_NODE = 21.0

VIEW_ICON = "262 118 818 604"          # D + N, horizontal
VIEW_SQUARE = "262 21 818 818"         # cuadrado para favicon / avatar
VIEW_FULL = "262 118 818 830"          # con logotipo debajo
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


def letter_n(pal):
    out = (
        f'  <path d="{N_STEMS}" fill="none" stroke="url(#dStroke)" '
        f'stroke-width="{N_W}" stroke-linecap="round"/>\n'
        f'  <path d="{N_DIAG}" fill="none" stroke="url(#ringA)" '
        f'stroke-width="{N_W}" stroke-linecap="round"/>\n'
    )
    # nodos: los extremos de la diagonal en dorado, los otros dos en azul
    for i, (x, y) in enumerate(N_NODES):
        ring = pal["hot"] if i < 2 else pal["photon"]
        out += (f'  <circle cx="{x:g}" cy="{y:g}" r="{R_NODE}" '
                f'fill="{pal["node"]}" stroke="{ring}" stroke-width="9"/>\n')
    return out


def wordmark(fill):
    mid = (262 + 262 + 818) / 2
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
    "photon": "#dcf3ff",
    "hot": "#f6c667",
    "node": "#0f1424",
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
    "photon": "#3f92da",
    "hot": "#d99a2b",
    "node": "#ffffff",
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
            + rad("glow") + lin("text", "1", "0") + "  </defs>\n")


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
    return (
        '  <g fill="none" stroke="currentColor">\n'
        f'    <ellipse cx="0" cy="0" rx="{RO_X}" ry="{RO_Y}" stroke-width="19" transform="translate({CX} {CY}) rotate({-TILT})"/>\n'
        f'    <ellipse cx="0" cy="0" rx="{RO_X}" ry="{RO_Y}" stroke-width="19" transform="translate({CX} {CY}) rotate({TILT})"/>\n'
        '  </g>\n'
        f'  <circle cx="{CX}" cy="{CY}" r="{R_SPHERE}" fill="currentColor"/>\n'
        f'  <path d="{D_PATH}" fill="none" stroke="currentColor" stroke-width="{D_W}" stroke-linejoin="round"/>\n'
        f'  <path d="{N_STEMS} {N_DIAG}" fill="none" stroke="currentColor" stroke-width="{N_W}" stroke-linecap="round" stroke-linejoin="round"/>\n'
        + "".join(f'  <circle cx="{x:g}" cy="{y:g}" r="{R_NODE + 6}" fill="currentColor"/>\n' for x, y in N_NODES)
    )


FILES = {
    "doxnetwork-icon.svg": (VIEW_ICON, "Isotipo DN - fondos oscuros", lambda: defs(DARK) + icon_body(DARK)),
    "doxnetwork-icon-light.svg": (VIEW_ICON, "Isotipo DN - fondos claros", lambda: defs(LIGHT) + icon_body(LIGHT)),
    "doxnetwork-square.svg": (VIEW_SQUARE, "Isotipo DN cuadrado - favicon/avatar", lambda: defs(DARK) + icon_body(DARK)),
    "doxnetwork-color.svg": (VIEW_FULL, "Version principal - fondos oscuros", lambda: defs(DARK) + icon_body(DARK) + wordmark("url(#text)")),
    "doxnetwork-color-light.svg": (VIEW_FULL, "Version principal - fondos claros", lambda: defs(LIGHT) + icon_body(LIGHT) + wordmark("url(#text)")),
    "doxnetwork-icon-mono.svg": (VIEW_ICON, "Monocromo: hereda currentColor", mono_body),
}

if __name__ == "__main__":
    for name, (view, comment, body) in FILES.items():
        (OUT / name).write_text(svg(view, comment, body()), encoding="utf-8")
        print("ok", name)
