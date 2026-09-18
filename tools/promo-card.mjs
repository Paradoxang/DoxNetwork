/**
 * Generador de promo cards de DoxNetwork.
 *
 * Lee los precios REALES de src/data/catalog.ts, así que una card nunca puede
 * quedar desfasada: si cambia un `market` o un `cost`, se regenera y ya está.
 *
 *   node tools/promo-card.mjs               todas
 *   node tools/promo-card.mjs story         solo esa
 *   node tools/promo-card.mjs story --zonas wireframe: dibuja los huecos
 *                                          gráficos en vez de montarlos
 *
 * DOS CAPAS, a propósito:
 *   1. Satori compone el LAYOUT (fondo, tipografía, cajas) y deja huecos.
 *   2. sharp monta encima los GRÁFICOS en esas coordenadas.
 *
 * Están separadas porque Satori no sabe enmascarar: los renders 3D de Astro
 * llevan una sombra de estudio que el recorte por color no alcanza del todo, y
 * embebida en el SVG se ve como una mancha clara bajo los pies. sharp sí puede
 * desvanecer la base del recorte (`fade`), así que el problema desaparece en la
 * capa que sabe resolverlo. De paso, el layout se puede revisar solo con
 * `--zonas`, sin que los gráficos distraigan.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";
import * as esbuild from "esbuild";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(DIR, "..");
const SIZES = { feed: [1080, 1350], story: [1080, 1920] };

// ── Precios reales, leídos del catálogo ──────────────────────────────────────
// catalog.ts es TypeScript: se empaqueta con esbuild (ya viene con vite) a un
// módulo temporal y se importa. Así no hay que duplicar ni un precio.
async function loadCatalog() {
  const tmp = path.join(DIR, ".catalog.tmp.mjs");
  await esbuild.build({
    entryPoints: [path.join(ROOT, "src/data/catalog.ts")],
    bundle: true, format: "esm", platform: "node", outfile: tmp, logLevel: "silent",
    loader: { ".png": "empty", ".webp": "empty", ".jpg": "empty", ".svg": "empty" },
  });
  const mod = await import(`file://${tmp}?t=${Date.now()}`);
  fs.rmSync(tmp, { force: true });
  return mod;
}

const money = (n) => "$" + n.toLocaleString("es-CO");

const C = {
  bg0: "#0A0E20", glass: "rgba(32,44,92,0.80)", border: "rgba(143,178,255,0.26)",
  ink: "#FFFFFF", inkSoft: "#AFC2EA", gold: "#F6C667", orange: "#FF9E49", mint: "#7FE6A8",
};

// ── Capa 0: marco gráfico generado ───────────────────────────────────────────
/**
 * Fondo de IA recortado al lienzo. Los modelos de imagen de este workspace no
 * exponen aspect ratio y devuelven 16:9, así que hay que recortar: se toma la
 * franja `anchor` (0 = izquierda, 1 = derecha) y se escala al alto de la card.
 * `dim` lo oscurece para que no compita con el texto que va encima — un fondo
 * generado siempre sale con más contraste del que un fondo debe tener.
 */
async function marcoGrafico(file, W, H, { anchor = 0.5, dim = 0.32, blur = 0 } = {}) {
  const src = path.join(DIR, file);
  const { width, height } = await sharp(src).metadata();
  const corte = Math.min(width, Math.round((height * W) / H));
  const left = Math.round((width - corte) * anchor);
  let img = sharp(src).extract({ left, top: 0, width: corte, height }).resize(W, H, { kernel: "lanczos3" });
  if (blur) img = img.blur(blur);
  const base = await img.png().toBuffer();
  const velo = Buffer.from(
    `<svg width="${W}" height="${H}"><rect width="100%" height="100%" fill="#0A0E20" fill-opacity="${dim}"/></svg>`,
  );
  return sharp(base).composite([{ input: velo }]).png().toBuffer();
}

// ── Capa 2: montaje de gráficos ──────────────────────────────────────────────
/**
 * Monta cada gráfico sobre el layout ya renderizado.
 *   { file, x, y, w, fade, flip }
 * `fade` es la fracción de la altura que se desvanece por abajo (0.12 = el 12%
 * inferior se funde con el fondo). Es lo que mata la sombra de estudio del
 * render sin tener que afinar más el recorte.
 */
async function montaGraficos(base, layers) {
  const capas = [];
  for (const l of layers) {
    let img = sharp(path.join(DIR, l.file));
    if (l.flip) img = img.flop();
    let buf = await img.resize({ width: Math.round(l.w) }).png().toBuffer();
    const { width, height } = await sharp(buf).metadata();
    if (l.fade) {
      const mask = Buffer.from(
        `<svg width="${width}" height="${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
          `<stop offset="${(1 - l.fade).toFixed(3)}" stop-color="#fff" stop-opacity="1"/>` +
          `<stop offset="${(1 - l.fade * 0.35).toFixed(3)}" stop-color="#fff" stop-opacity="0.45"/>` +
          `<stop offset="1" stop-color="#fff" stop-opacity="0"/>` +
          `</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
      );
      buf = await sharp(buf).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    }
    capas.push({ input: buf, left: Math.round(l.x), top: Math.round(l.y) });
  }
  return sharp(base).composite(capas).png().toBuffer();
}

/** Wireframe: un rectángulo punteado por hueco, para revisar el layout solo. */
const zonaFantasma = (l, i) => ({
  type: "div", props: { style: {
    position: "absolute", left: l.x, top: l.y, width: l.w, height: l.h ?? l.w * 1.4,
    border: "3px dashed rgba(255,158,73,0.75)", borderRadius: 16,
    background: "rgba(255,158,73,0.09)", display: "flex",
    alignItems: "center", justifyContent: "center",
  }, children: { type: "div", props: { style: {
    fontSize: 26, fontWeight: 800, color: "rgba(255,200,150,0.95)",
  }, children: `${i + 1}· ${path.basename(l.file, ".png").replace("M_astro-", "")}` } } },
});

const stars = (n, W, H, seed = 7) => {
  const out = []; let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (let i = 0; i < n; i++) {
    const r = rnd() * 2.2 + 0.8;
    out.push({ type: "div", props: { style: {
      position: "absolute", left: rnd() * W, top: rnd() * H * 0.72, width: r, height: r,
      borderRadius: 999, background: "#fff", opacity: 0.2 + rnd() * 0.5, display: "flex",
    } } });
  }
  return out;
};

const marca = (esc = 1) => ({ type: "div", props: {
  style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
    { type: "div", props: { style: { display: "flex", alignItems: "center" }, children: [
      { type: "div", props: { style: {
        width: 54 * esc, height: 54 * esc, borderRadius: 14, display: "flex", alignItems: "center",
        justifyContent: "center", marginRight: 15, background: "linear-gradient(145deg,#2B3B7A,#141B3E)",
        border: `2px solid ${C.border}`,
      }, children: { type: "div", props: { style: { fontSize: 21 * esc, fontWeight: 800, color: C.gold }, children: "DN" } } } },
      { type: "div", props: { style: { fontSize: 24 * esc, fontWeight: 800, letterSpacing: 5, color: "#DCE6FF" }, children: "DOXNETWORK" } },
    ] } },
    { type: "div", props: { style: {
      display: "flex", padding: "12px 25px", borderRadius: 999, fontSize: 16, fontWeight: 700,
      letterSpacing: 1.5, color: "#BFD4FF", border: `2px solid ${C.border}`, background: "rgba(20,30,66,0.55)",
    }, children: "CATÁLOGO 2026" } },
  ] } });

const cta = (mt = "auto") => [
  { type: "div", props: { style: {
    display: "flex", alignItems: "center", justifyContent: "center", height: 108, borderRadius: 30,
    marginTop: mt, background: "linear-gradient(135deg,#8FF0B4,#5FD897)",
  }, children: { type: "div", props: { style: { fontSize: 42, fontWeight: 800, color: "#06301C" }, children: "Responde MENÚ" } } } },
  { type: "div", props: { style: {
    display: "flex", justifyContent: "center", fontSize: 23, fontWeight: 700,
    letterSpacing: 1.7, color: "#8FA8DC", marginTop: 18,
  }, children: "doxnetwork.vercel.app" } },
];

// ── Plantilla 4:5 ────────────────────────────────────────────────────────────
function feed(d, zonas) {
  const [W, H] = SIZES.feed;
  return { type: "div", props: {
    style: {
      width: W, height: H, display: "flex", flexDirection: "column", padding: "64px 60px 56px",
      background: `linear-gradient(168deg, ${C.bg0} 0%, #0D1330 48%, #090C1C 100%)`,
      fontFamily: "Manrope", position: "relative",
    },
    children: [
      { type: "div", props: { style: {
        position: "absolute", top: 120, right: -180, width: 760, height: 760, borderRadius: 999,
        background: "radial-gradient(circle, rgba(124,92,214,0.34), rgba(10,14,32,0) 62%)", display: "flex" } } },
      ...zonas,
      marca(),
      { type: "div", props: { style: { display: "flex", flexDirection: "column", marginTop: 42 }, children: [
        { type: "div", props: { style: { fontSize: 27, fontWeight: 800, letterSpacing: 5, color: C.orange }, children: d.eyebrow } },
        { type: "div", props: { style: { fontSize: d.price.length > 6 ? 128 : 158, fontWeight: 800, letterSpacing: -6, color: C.gold, marginTop: 6, lineHeight: 1 }, children: d.price } },
        { type: "div", props: { style: { display: "flex", flexDirection: "column", marginTop: 16 }, children: [
          { type: "div", props: { style: { fontSize: 34, fontWeight: 700, color: "#EAF0FF" }, children: d.line1 } },
          { type: "div", props: { style: { fontSize: 34, fontWeight: 800, color: C.mint }, children: d.line2 } },
        ] } },
        { type: "div", props: { style: { width: 132, height: 7, borderRadius: 999, marginTop: 22, background: C.orange, display: "flex" } } },
      ] } },
      { type: "div", props: { style: { display: "flex", flexWrap: "wrap", marginTop: "auto", width: 960 },
        children: d.cats.map((c) => ({ type: "div", props: { style: {
          display: "flex", alignItems: "center", width: 462, height: 104, marginRight: 18, marginBottom: 18,
          borderRadius: 22, padding: "0 22px", background: C.glass, border: `2px solid ${C.border}`,
        }, children: { type: "div", props: { style: {
          fontSize: 26, fontWeight: 800, color: "#F0F5FF", marginLeft: 92,
        }, children: c.name } } } })) } },
      { type: "div", props: { style: { display: "flex", justifyContent: "center", fontSize: 22, fontWeight: 700, color: C.inkSoft, marginTop: 8 }, children: d.footnote } },
      ...cta(18),
    ],
  } };
}

// ── Plantilla 9:16 ───────────────────────────────────────────────────────────
function story(d, zonas) {
  const [W, H] = SIZES.story;
  return { type: "div", props: {
    style: {
      width: W, height: H, display: "flex", flexDirection: "column", padding: "70px 64px 62px",
      fontFamily: "Manrope", position: "relative",
      background: `linear-gradient(170deg, ${C.bg0} 0%, #101740 42%, #0B1026 72%, #070A18 100%)`,
    },
    children: [
      ...stars(90, W, H),
      { type: "div", props: { style: {
        position: "absolute", left: -260, top: 980, width: 1600, height: 1600, borderRadius: 999,
        background: "radial-gradient(circle at 50% 8%, rgba(96,74,196,0.55), rgba(24,32,78,0.30) 38%, rgba(10,14,32,0) 62%)", display: "flex" } } },
      { type: "div", props: { style: {
        position: "absolute", left: 172, top: 268, width: 736, height: 736, borderRadius: 999,
        background: "radial-gradient(circle, rgba(255,158,73,0.22), rgba(124,92,214,0.16) 45%, rgba(10,14,32,0) 68%)", display: "flex" } } },
      ...zonas,
      marca(1.05),
      { type: "div", props: { style: { display: "flex", flexDirection: "column", marginTop: 772 }, children: [
        { type: "div", props: { style: { fontSize: 29, fontWeight: 800, letterSpacing: 6, color: C.orange }, children: d.eyebrow } },
        { type: "div", props: { style: { display: "flex", alignItems: "flex-end", marginTop: 4 }, children: [
          { type: "div", props: { style: { fontSize: 158, fontWeight: 800, letterSpacing: -7, color: C.gold, lineHeight: 1 }, children: d.price } },
          { type: "div", props: { style: { fontSize: 30, fontWeight: 700, color: C.inkSoft, marginLeft: 16, marginBottom: 26 }, children: "/ mes" } },
        ] } },
        { type: "div", props: { style: { fontSize: 33, fontWeight: 700, color: "#EAF0FF", marginTop: 10 }, children: d.tagline } },
      ] } },
      { type: "div", props: { style: { display: "flex", flexDirection: "column", marginTop: 26 },
        children: d.rows.map((r, i) => ({ type: "div", props: { style: {
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 26px", borderRadius: 18, marginBottom: 10,
          background: i === 0 ? "rgba(255,158,73,0.13)" : "rgba(28,40,86,0.62)",
          border: `2px solid ${i === 0 ? "rgba(255,158,73,0.42)" : C.border}`,
        }, children: [
          { type: "div", props: { style: { fontSize: 30, fontWeight: 700, color: "#EEF3FF" }, children: r.name } },
          { type: "div", props: { style: { fontSize: 32, fontWeight: 800, color: i === 0 ? C.orange : C.ink }, children: r.price } },
        ] } })) } },
      { type: "div", props: { style: {
        display: "flex", justifyContent: "center", fontSize: 25, fontWeight: 700,
        color: C.inkSoft, marginTop: 16, marginBottom: 2,
      }, children: d.extra } },
      ...cta("auto"),
    ],
  } };
}

// ── Plantilla «luxe»: la cadena de 4 pasos completa ──────────────────────────
// 1 marco gráfico de IA · 2 contenedores · 3 tipografía · 4 Astro y producto.
// Aquí Satori NO pinta fondo: solo pone los pasos 2 y 3 sobre el marco.
function luxe(d, zonas) {
  const [W, H] = SIZES.feed;
  const caja = {
    display: "flex", borderRadius: 26, border: "2px solid rgba(214,182,120,0.32)",
    background: "rgba(12,16,38,0.62)",
  };
  return { type: "div", props: {
    style: {
      width: W, height: H, display: "flex", flexDirection: "column",
      padding: "60px 60px 54px", fontFamily: "Manrope", position: "relative",
    },
    children: [
      ...zonas,
      // cabecera: el hueco del logo lo ocupa la capa 4
      { type: "div", props: { style: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 },
        children: [
        { type: "div", props: { style: {
          fontSize: 24, fontWeight: 800, letterSpacing: 5, color: "#DCE6FF", marginLeft: 108,
        }, children: "DOXNETWORK" } },
        { type: "div", props: { style: {
          display: "flex", padding: "13px 26px", borderRadius: 999, fontSize: 17, fontWeight: 800,
          letterSpacing: 3, color: "#F2DCA9", border: "2px solid rgba(214,182,120,0.42)",
          background: "rgba(12,16,38,0.55)",
        }, children: d.kicker } },
        ] } },

      // bloque de precio (paso 3)
      { type: "div", props: { style: { display: "flex", flexDirection: "column", marginTop: 596 }, children: [
        { type: "div", props: { style: { fontSize: 26, fontWeight: 800, letterSpacing: 6, color: "#E8B04B" }, children: d.eyebrow } },
        { type: "div", props: { style: { display: "flex", alignItems: "flex-end", marginTop: 6 }, children: [
          { type: "div", props: { style: {
            fontSize: d.price.length > 6 ? 142 : 168, fontWeight: 800, letterSpacing: -6,
            color: "#FFE3A8", lineHeight: 1,
          }, children: d.price } },
        ] } },
        { type: "div", props: { style: { fontSize: 31, fontWeight: 700, color: "#E9EEFF", marginTop: 12 }, children: d.line1 } },
      ] } },

      // contenedores (paso 2)
      { type: "div", props: { style: { display: "flex", marginTop: 30 },
        children: d.chips.map((c, i) => ({ type: "div", props: { style: {
          ...caja, flexDirection: "column", justifyContent: "center",
          padding: "18px 26px", marginRight: i < d.chips.length - 1 ? 16 : 0,
        }, children: [
          { type: "div", props: { style: { fontSize: 30, fontWeight: 800, color: "#FFE3A8" }, children: c.v } },
          { type: "div", props: { style: { fontSize: 19, fontWeight: 700, color: "#A9BCE4", marginTop: 2 }, children: c.k } },
        ] } })) } },

      { type: "div", props: { style: {
        ...caja, alignItems: "center", justifyContent: "center", height: 74, marginTop: 16,
        fontSize: 22, fontWeight: 700, color: "#BFD0F0",
      }, children: d.footnote } },

      { type: "div", props: { style: {
        display: "flex", alignItems: "center", justifyContent: "center", height: 108, borderRadius: 30,
        marginTop: "auto", background: "linear-gradient(135deg,#8FF0B4,#5FD897)",
      }, children: { type: "div", props: { style: { fontSize: 42, fontWeight: 800, color: "#06301C" }, children: "Responde MENÚ" } } } },
      { type: "div", props: { style: {
        display: "flex", justifyContent: "center", fontSize: 23, fontWeight: 700,
        letterSpacing: 1.7, color: "#93A6D4", marginTop: 16,
      }, children: "doxnetwork.vercel.app" } },
    ],
  } };
}

// ── Datos ────────────────────────────────────────────────────────────────────
const cat = await loadCatalog();
const fonts = ["Medium", "Bold", "ExtraBold"].map((n, i) => ({
  name: "Manrope", style: "normal", weight: [500, 700, 800][i],
  data: fs.readFileSync(path.join(DIR, `fonts/Manrope-${n}.ttf`)),
}));

const pantallas = cat.products.filter((p) => p.category === "streaming");
const minPantalla = Math.min(
  ...pantallas.flatMap((p) => p.plans.filter((pl) => pl.access === "Pantalla").map((pl) => pl.price)),
);
const perfumeDesde = Math.min(...cat.allProducts.filter((p) => p.category === "perfumeria").map((p) => p.plans[0].price));
const escalera = pantallas
  .map((p) => {
    const pl = p.plans.filter((x) => x.access === "Pantalla").sort((a, b) => a.price - b.price)[0];
    return pl && { name: p.name, price: money(pl.price), raw: pl.price };
  })
  .filter(Boolean).sort((a, b) => a.raw - b.raw).slice(0, 4);

const CATS = ["Streaming e IA", "Perfumería", "Relojería", "Tecnología"].map((name) => ({ name }));
// Los chibis se montan sobre la rejilla de categorías. La rejilla lleva
// `marginTop:auto`, así que su Y se deduce de lo que queda debajo en vez de
// fijarla a ojo: si cambia el pie, basta rehacer esta cuenta.
const [, FEED_H] = SIZES.feed;
const ALTO_PIE = 56 + 31 + 18 + 108 + 18 + 30 + 8; // padding, url, CTA, footnote
const FILA_H = 104 + 18; // píldora + separación
const REJILLA_Y = FEED_H - ALTO_PIE - FILA_H * 2;
const CHIBI = 86;
const chibis = ["streaming", "perfume", "reloj", "audifonos"].map((k, i) => ({
  file: `astro/M_astro-chibi-${k}.png`,
  x: 60 + 16 + (i % 2) * (462 + 18),
  y: REJILLA_Y + Math.floor(i / 2) * FILA_H + (104 - CHIBI) / 2,
  w: CHIBI, h: CHIBI, fade: 0,
}));

const CARDS = {
  // Cadena de 4 pasos: marco de IA · contenedores · tipografía · gráficos.
  "perfumeria-luxe": {
    tpl: "luxe",
    fondo: { file: "fondos/fondo-a.jpg", anchor: 0.62, dim: 0.34 },
    data: {
      kicker: "PERFUMERÍA", eyebrow: "DESDE", price: money(perfumeDesde),
      line1: "Árabes y de diseñador, a precio de red.",
      chips: [
        { v: "176", k: "fragancias" },
        { v: "30 ml – 100 ml", k: "presentaciones" },
        { v: "Ella · Él", k: "y unisex" },
      ],
      footnote: "Nequi · Daviplata · Bre-B",
    },
    graficos: [
      { file: "marca/isotipo.png", x: 52, y: 32, w: 96, fade: 0 },
      { file: "marca/frasco.png", x: 392, y: 178, w: 330, fade: 0 },
      { file: "astro/M_astro-chibi-perfume.png", x: 806, y: 316, w: 232, fade: 0 },
    ],
  },

  streaming: { tpl: "feed", data: {
    eyebrow: "PANTALLAS DESDE", price: money(minPantalla),
    line1: "Y todo lo que usas,", line2: "en una sola red.",
    cats: CATS, footnote: "Nequi · Daviplata · Bre-B",
  }, graficos: [{ file: "astro/M_astro-senala.png", x: 604, y: 118, w: 470, fade: 0.11, flip: true }, ...chibis] },

  perfumeria: { tpl: "feed", data: {
    eyebrow: "PERFUMERÍA DESDE", price: money(perfumeDesde),
    line1: "Originales y árabes,", line2: "al precio de la red.",
    cats: CATS, footnote: "Nequi · Daviplata · Bre-B",
  }, graficos: [{ file: "astro/M_astro-celebra.png", x: 648, y: 168, w: 432, fade: 0, flip: true }, ...chibis] },

  story: { tpl: "story", data: {
    eyebrow: "PANTALLAS DESDE", price: money(minPantalla),
    tagline: "Y todo lo que usas, en una sola red.",
    rows: escalera, extra: "También perfumería · relojería · tecnología",
  }, graficos: [{ file: "astro/M_astro-senala.png", x: 268, y: 214, w: 548, fade: 0.13 }] },
};

// ── Main ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const wireframe = argv.includes("--zonas");
const pick = argv.find((a) => !a.startsWith("--"));
if (pick && !CARDS[pick]) {
  console.error(`No existe "${pick}". Disponibles: ${Object.keys(CARDS).join(", ")}`);
  process.exit(1);
}
const jobs = pick ? { [pick]: CARDS[pick] } : CARDS;

const PLANTILLAS = { feed, story, luxe };
for (const [name, { tpl, data, graficos, fondo }] of Object.entries(jobs)) {
  const [w, h] = SIZES[tpl === "luxe" ? "feed" : tpl];
  const zonas = wireframe ? graficos.map(zonaFantasma) : [];
  const svg = await satori(PLANTILLAS[tpl](data, zonas), { width: w, height: h, fonts });
  // Paso 1: el marco gráfico va debajo; la capa de Satori se compone encima.
  let buf = fondo
    ? await sharp(await marcoGrafico(fondo.file, w, h, fondo))
        .composite([{ input: Buffer.from(svg) }]).png().toBuffer()
    : await sharp(Buffer.from(svg)).png().toBuffer();
  if (!wireframe) buf = await montaGraficos(buf, graficos);

  const suf = wireframe ? "-zonas" : "";
  const png = path.join(DIR, "out", `${name}${suf}-${w}x${h}.png`);
  fs.writeFileSync(png, buf);
  let linea = `${name.padEnd(12)} ${w}x${h} ${wireframe ? "wireframe" : `${graficos.length} gráficos`}`;
  if (!wireframe) {
    const jpg = png.replace(/\.png$/, ".jpg");
    await sharp(buf).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(jpg);
    linea += `  -> ${path.basename(jpg)} (${(fs.statSync(jpg).size / 1024).toFixed(0)} KB)`;
  } else linea += `  -> ${path.basename(png)}`;
  console.log(linea);
}
