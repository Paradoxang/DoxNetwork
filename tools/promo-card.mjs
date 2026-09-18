/**
 * Generador de promo cards de DoxNetwork.
 *
 * Lee los precios REALES de src/data/catalog.ts, así que una card nunca puede
 * quedar desfasada: si cambia un `market` o un `cost`, se regenera y ya está.
 *
 *   node tools/promo-card.mjs              -> todas las cards
 *   node tools/promo-card.mjs streaming    -> solo esa
 *
 * Satori (HTML/CSS -> SVG) + sharp (SVG -> PNG/JPG/WebP). Satori solo entiende
 * flexbox: nada de grid, y cada nodo con más de un hijo necesita display flex.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";
import * as esbuild from "esbuild";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(DIR, "..");
const W = 1080;
const H = 1350;
// 9:16 para estados de WhatsApp, stories e historias de Facebook.
const SW = 1080;
const SH = 1920;

// ── Precios reales, leídos del catálogo ──────────────────────────────────────
// catalog.ts es TypeScript: se empaqueta con esbuild (ya está, viene con vite)
// a un módulo temporal y se importa. Así no hay que duplicar ni un precio.
async function loadCatalog() {
  const tmp = path.join(DIR, ".catalog.tmp.mjs");
  await esbuild.build({
    entryPoints: [path.join(ROOT, "src/data/catalog.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: tmp,
    logLevel: "silent",
    loader: { ".png": "empty", ".webp": "empty", ".jpg": "empty", ".svg": "empty" },
  });
  const mod = await import(`file://${tmp}?t=${Date.now()}`);
  fs.rmSync(tmp, { force: true });
  return mod;
}

const money = (n) => "$" + n.toLocaleString("es-CO");
const dataUri = (rel) =>
  "data:image/png;base64," + fs.readFileSync(path.join(DIR, rel)).toString("base64");

// ── Paleta de marca ──────────────────────────────────────────────────────────
const C = {
  bg0: "#0A0E20",
  bg1: "#0D1330",
  glass: "rgba(32,44,92,0.80)",
  border: "rgba(143,178,255,0.26)",
  ink: "#FFFFFF",
  inkSoft: "#AFC2EA",
  gold: "#F6C667",
  orange: "#FF9E49",
  mint: "#7FE6A8",
};

// ── Plantilla ────────────────────────────────────────────────────────────────
function card({ eyebrow, price, line1, line2, cats, astro, footnote }) {
  return {
    type: "div",
    props: {
      style: {
        width: W, height: H, display: "flex", flexDirection: "column",
        padding: "64px 60px 56px",
        background: `linear-gradient(168deg, ${C.bg0} 0%, ${C.bg1} 48%, #090C1C 100%)`,
        fontFamily: "Manrope", position: "relative",
      },
      children: [
        // halo
        { type: "div", props: { style: {
          position: "absolute", top: 120, right: -180, width: 760, height: 760,
          borderRadius: 999, background: "radial-gradient(circle, rgba(124,92,214,0.34), rgba(10,14,32,0) 62%)",
          display: "flex" } } },
        // astro
        { type: "img", props: { src: astro, width: 470, style: {
          position: "absolute", right: 6, top: 118, transform: "scaleX(-1)" } } },
        // header
        { type: "div", props: { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          { type: "div", props: { style: { display: "flex", alignItems: "center" }, children: [
            { type: "div", props: { style: {
              width: 52, height: 52, borderRadius: 14, display: "flex",
              alignItems: "center", justifyContent: "center", marginRight: 14,
              background: "linear-gradient(145deg,#2B3B7A,#141B3E)", border: `2px solid ${C.border}`,
            }, children: { type: "div", props: { style: { fontSize: 21, fontWeight: 800, color: C.gold }, children: "DN" } } } },
            { type: "div", props: { style: { fontSize: 23, fontWeight: 800, letterSpacing: 5, color: "#DCE6FF" }, children: "DOXNETWORK" } },
          ] } },
          { type: "div", props: { style: {
            display: "flex", padding: "12px 24px", borderRadius: 999, fontSize: 16, fontWeight: 700,
            letterSpacing: 1.5, color: "#BFD4FF", border: `2px solid ${C.border}`, background: "rgba(20,30,66,0.55)",
          }, children: "CATÁLOGO 2026" } },
        ] } },
        // hero
        { type: "div", props: { style: { display: "flex", flexDirection: "column", marginTop: 42 }, children: [
          { type: "div", props: { style: { fontSize: 27, fontWeight: 800, letterSpacing: 5, color: C.orange }, children: eyebrow } },
          { type: "div", props: { style: { fontSize: 158, fontWeight: 800, letterSpacing: -6, color: C.gold, marginTop: 6, lineHeight: 1 }, children: price } },
          { type: "div", props: { style: { display: "flex", flexDirection: "column", marginTop: 16 }, children: [
            { type: "div", props: { style: { fontSize: 34, fontWeight: 700, color: "#EAF0FF" }, children: line1 } },
            { type: "div", props: { style: { fontSize: 34, fontWeight: 800, color: C.mint }, children: line2 } },
          ] } },
          { type: "div", props: { style: { width: 132, height: 7, borderRadius: 999, marginTop: 22, background: C.orange, display: "flex" } } },
        ] } },
        // categorías
        { type: "div", props: { style: { display: "flex", flexWrap: "wrap", marginTop: "auto", width: 960 },
          children: cats.map((c) => ({ type: "div", props: { style: {
            display: "flex", alignItems: "center", width: 462, height: 104, marginRight: 18, marginBottom: 18,
            borderRadius: 22, padding: "0 22px", background: C.glass, border: `2px solid ${C.border}`,
          }, children: [
            { type: "img", props: { src: c.icon, width: 74, height: 74, style: { marginRight: 16 } } },
            { type: "div", props: { style: { fontSize: 26, fontWeight: 800, color: "#F0F5FF" }, children: c.name } },
          ] } })) } },
        // pie
        { type: "div", props: { style: { display: "flex", justifyContent: "center", fontSize: 22, fontWeight: 700, color: C.inkSoft, marginTop: 8 }, children: footnote } },
        { type: "div", props: { style: {
          display: "flex", alignItems: "center", justifyContent: "center", height: 104, borderRadius: 30, marginTop: 18,
          background: "linear-gradient(135deg,#8FF0B4,#5FD897)",
        }, children: { type: "div", props: { style: { fontSize: 40, fontWeight: 800, color: "#06301C" }, children: "Responde MENÚ" } } } },
        { type: "div", props: { style: { display: "flex", justifyContent: "center", fontSize: 23, fontWeight: 700, letterSpacing: 1.6, color: "#8FA8DC", marginTop: 20 }, children: "doxnetwork.vercel.app" } },
      ],
    },
  };
}

// ── Plantilla 9:16 (estados / stories) ───────────────────────────────────────
// Aprovecha el alto extra para algo que la 4:5 no puede: la escalera de precios
// reales, plan a plan. Es la ventaja de leer del catálogo — una lista escrita a
// mano quedaría desfasada al primer cambio de `market`.
const stars = (n, seed = 7) => {
  const out = [];
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (let i = 0; i < n; i++) {
    const r = rnd() * 2.2 + 0.8;
    out.push({ type: "div", props: { style: {
      position: "absolute", left: rnd() * SW, top: rnd() * SH * 0.72,
      width: r, height: r, borderRadius: 999, background: "#fff",
      opacity: 0.2 + rnd() * 0.5, display: "flex",
    } } });
  }
  return out;
};

function story({ eyebrow, price, tagline, rows, astro, extra }) {
  return { type: "div", props: {
    style: {
      width: SW, height: SH, display: "flex", flexDirection: "column",
      padding: "70px 64px 62px", fontFamily: "Manrope", position: "relative",
      background: `linear-gradient(170deg, ${C.bg0} 0%, #101740 42%, #0B1026 72%, #070A18 100%)`,
    },
    children: [
      ...stars(90),
      // planeta bajo los pies de Astro
      { type: "div", props: { style: {
        position: "absolute", left: -260, top: 980, width: 1600, height: 1600, borderRadius: 999,
        background: "radial-gradient(circle at 50% 8%, rgba(96,74,196,0.55), rgba(24,32,78,0.30) 38%, rgba(10,14,32,0) 62%)",
        display: "flex" } } },
      // halo tras Astro
      { type: "div", props: { style: {
        position: "absolute", left: 172, top: 268, width: 736, height: 736, borderRadius: 999,
        background: "radial-gradient(circle, rgba(255,158,73,0.22), rgba(124,92,214,0.16) 45%, rgba(10,14,32,0) 68%)",
        display: "flex" } } },

      // header
      { type: "div", props: { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
        { type: "div", props: { style: { display: "flex", alignItems: "center" }, children: [
          { type: "div", props: { style: {
            width: 56, height: 56, borderRadius: 15, display: "flex", alignItems: "center",
            justifyContent: "center", marginRight: 15, background: "linear-gradient(145deg,#2B3B7A,#141B3E)",
            border: `2px solid ${C.border}`,
          }, children: { type: "div", props: { style: { fontSize: 22, fontWeight: 800, color: C.gold }, children: "DN" } } } },
          { type: "div", props: { style: { fontSize: 25, fontWeight: 800, letterSpacing: 5.5, color: "#DCE6FF" }, children: "DOXNETWORK" } },
        ] } },
        { type: "div", props: { style: {
          display: "flex", padding: "13px 26px", borderRadius: 999, fontSize: 17, fontWeight: 700,
          letterSpacing: 1.6, color: "#BFD4FF", border: `2px solid ${C.border}`, background: "rgba(20,30,66,0.5)",
        }, children: "CATÁLOGO 2026" } },
      ] } },

      // Astro protagonista
      { type: "img", props: { src: astro, width: 548, style: { position: "absolute", left: 268, top: 214 } } },

      // bloque de precio
      { type: "div", props: { style: { display: "flex", flexDirection: "column", marginTop: 772 }, children: [
        { type: "div", props: { style: { fontSize: 29, fontWeight: 800, letterSpacing: 6, color: C.orange }, children: eyebrow } },
        { type: "div", props: { style: { display: "flex", alignItems: "flex-end", marginTop: 4 }, children: [
          { type: "div", props: { style: { fontSize: 158, fontWeight: 800, letterSpacing: -7, color: C.gold, lineHeight: 1 }, children: price } },
          { type: "div", props: { style: { fontSize: 30, fontWeight: 700, color: C.inkSoft, marginLeft: 16, marginBottom: 26 }, children: "/ mes" } },
        ] } },
        { type: "div", props: { style: { fontSize: 33, fontWeight: 700, color: "#EAF0FF", marginTop: 10 }, children: tagline } },
      ] } },

      // escalera de precios reales
      { type: "div", props: { style: { display: "flex", flexDirection: "column", marginTop: 26 },
        children: rows.map((r, i) => ({ type: "div", props: { style: {
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
      }, children: extra } },

      { type: "div", props: { style: {
        display: "flex", alignItems: "center", justifyContent: "center", height: 108, borderRadius: 30,
        marginTop: "auto", background: "linear-gradient(135deg,#8FF0B4,#5FD897)",
      }, children: { type: "div", props: { style: { fontSize: 43, fontWeight: 800, color: "#06301C" }, children: "Responde MENÚ" } } } },
      { type: "div", props: { style: {
        display: "flex", justifyContent: "center", fontSize: 24, fontWeight: 700,
        letterSpacing: 1.8, color: "#8FA8DC", marginTop: 18,
      }, children: "doxnetwork.vercel.app" } },
    ],
  } };
}

// ── Main ─────────────────────────────────────────────────────────────────────
const cat = await loadCatalog();
const fonts = [
  { name: "Manrope", weight: 500, style: "normal", data: fs.readFileSync(path.join(DIR, "fonts/Manrope-Medium.ttf")) },
  { name: "Manrope", weight: 700, style: "normal", data: fs.readFileSync(path.join(DIR, "fonts/Manrope-Bold.ttf")) },
  { name: "Manrope", weight: 800, style: "normal", data: fs.readFileSync(path.join(DIR, "fonts/Manrope-ExtraBold.ttf")) },
];

// precio real más bajo de una pantalla de streaming
const pantallas = cat.products.filter((p) => p.category === "streaming");
const minPantalla = Math.min(
  ...pantallas.flatMap((p) => p.plans.filter((pl) => pl.access === "Pantalla").map((pl) => pl.price)),
);
const perfumeDesde = Math.min(...cat.allProducts.filter((p) => p.category === "perfumeria").map((p) => p.plans[0].price));

const ASTRO = {
  senala: dataUri("astro/M_astro-senala.png"),
  perfume: dataUri("astro/M_astro-chibi-perfume.png"),
};
const CATS = [
  { name: "Streaming e IA", icon: dataUri("astro/M_astro-chibi-streaming.png") },
  { name: "Perfumería", icon: dataUri("astro/M_astro-chibi-perfume.png") },
  { name: "Relojería", icon: dataUri("astro/M_astro-chibi-reloj.png") },
  { name: "Tecnología", icon: dataUri("astro/M_astro-chibi-audifonos.png") },
];

const CARDS = {
  streaming: {
    eyebrow: "PANTALLAS DESDE", price: money(minPantalla),
    line1: "Y todo lo que usas,", line2: "en una sola red.",
    cats: CATS, astro: ASTRO.senala, footnote: "Nequi · Daviplata · Bre-B",
  },
  perfumeria: {
    eyebrow: "PERFUMERÍA DESDE", price: money(perfumeDesde),
    line1: "Originales y árabes,", line2: "al precio de la red.",
    cats: CATS, astro: ASTRO.senala, footnote: "Nequi · Daviplata · Bre-B",
  },
};

// Las 5 pantallas más baratas del catálogo, calculadas — no escritas a mano,
// así la escalera se reordena sola si cambia un precio.
const escalera = pantallas
  .map((p) => {
    const pl = p.plans.filter((x) => x.access === "Pantalla").sort((a, b) => a.price - b.price)[0];
    return pl && { name: p.name, price: money(pl.price), raw: pl.price };
  })
  .filter(Boolean)
  .sort((a, b) => a.raw - b.raw)
  .slice(0, 4);

const STORIES = {
  story: {
    eyebrow: "PANTALLAS DESDE", price: money(minPantalla),
    tagline: "Y todo lo que usas, en una sola red.",
    rows: escalera, astro: ASTRO.senala,
    extra: "También perfumería · relojería · tecnología",
  },
};

const ALL = { ...CARDS, ...STORIES };
const pick = process.argv[2];
if (pick && !ALL[pick]) {
  console.error(`No existe la card "${pick}". Disponibles: ${Object.keys(ALL).join(", ")}`);
  process.exit(1);
}
const jobs = pick ? { [pick]: ALL[pick] } : ALL;

for (const [name, data] of Object.entries(jobs)) {
  const esStory = name in STORIES;
  const [w, h] = esStory ? [SW, SH] : [W, H];
  const svg = await satori(esStory ? story(data) : card(data), { width: w, height: h, fonts });
  const png = path.join(DIR, "out", `${name}-${w}x${h}.png`);
  const jpg = path.join(DIR, "out", `${name}-${w}x${h}.jpg`);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync(png, buf);
  await sharp(buf).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(jpg);
  const kb = (n) => (fs.statSync(n).size / 1024).toFixed(0) + " KB";
  console.log(`${name.padEnd(12)} ${data.price.padEnd(9)} ${w}x${h} -> ${path.basename(jpg)} (${kb(jpg)})`);
}
