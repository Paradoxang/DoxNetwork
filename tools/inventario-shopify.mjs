/**
 * Export de TODA la tienda para cargarla en Shopify.
 *
 *   node tools/inventario-shopify.mjs
 *
 * Escribe docs/inventario-shopify.json (un objeto por producto, una variante
 * por plan, con el esquema del encargo del 23-sep-2026) y un resumen corto en
 * docs/inventario-shopify.md.
 *
 * Sale de la fuente, nunca a mano: catalog.ts ya trae fundidos perfumeria.ts,
 * lineas.ts y vapes.ts en `allProducts`, con los precios YA calculados (alza,
 * topes y tachado incluidos). Por eso el JSON dice lo mismo que la web hoy.
 *
 * ⚠️ El JSON lleva `costo` (costo de proveedor) porque el encargo lo pide para
 * el campo de costo de Shopify. Este repositorio es PÚBLICO, así que el
 * archivo está en .gitignore: se genera en local y Mercurio lo lee del disco.
 * No se commitea.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const tmp = path.join(ROOT, "tools", ".cat-shop.tmp.mjs");
await esbuild.build({
  entryPoints: [path.join(ROOT, "src/data/catalog.ts")],
  bundle: true, format: "esm", platform: "node", outfile: tmp, logLevel: "silent",
  loader: { ".png": "empty", ".webp": "empty", ".jpg": "empty", ".svg": "empty" },
});
const cat = await import(`file://${tmp}?t=${Date.now()}`);
fs.rmSync(tmp, { force: true });

const tmp2 = path.join(ROOT, "tools", ".des-shop.tmp.mjs");
await esbuild.build({
  entryPoints: [path.join(ROOT, "src/data/destacados.ts")],
  bundle: true, format: "esm", platform: "node", outfile: tmp2, logLevel: "silent",
  loader: { ".png": "empty", ".webp": "empty", ".jpg": "empty", ".svg": "empty" },
});
const des = await import(`file://${tmp2}?t=${Date.now()}`);
fs.rmSync(tmp2, { force: true });

const FISICAS = new Set(["perfumeria", "relojeria", "tecnologia", "vapes"]);
const destacadosSlugs = new Set(Object.values(des.destacados).flat().map((p) => p.slug));
const existe = (rel) => fs.existsSync(path.join(ROOT, rel));
const aRepo = (web) => (web ? `public${web}` : null);

/** Plan → variante del esquema. Las opciones solo se declaran si el producto tiene más de un plan. */
function variante(p, pl, multi) {
  return {
    id: pl.id,
    etiqueta: multi ? cat.planLabel(pl) : null,
    opciones: multi ? { Acceso: pl.access ?? null, Calidad: pl.tier ?? null, Duración: pl.duration || null } : {},
    precio: pl.price,
    tachado: pl.compareAt ?? null,
    costo: pl.cost ?? null,
  };
}

const productos = [];
for (const p of cat.allProducts) {
  const fisico = FISICAS.has(p.category);
  const a = p.articulo, pf = p.perfume;
  const linea = fisico ? p.category : "digital";

  // Perfumería: 1.1 y AAA son réplicas. Relojería/tecnología: lo dice lineas.ts.
  const condicion = a?.condition ?? (pf ? (["1.1", "AAA"].includes(pf.quality) ? "replica" : null) : null);
  const marca = a?.brand || pf?.brand || "";

  // Imágenes como rutas del repo, en orden de uso. Digital: la baldosa de
  // marca del producto y las propias de cada plan (Disney Premium, etc.).
  let imagenes = [];
  if (fisico) {
    if (p.image) imagenes = [aRepo(p.image)];
  } else {
    const logos = [p.logo, ...p.plans.map((pl) => pl.logo)].filter(Boolean);
    imagenes = [...new Set(logos)].map(aRepo);
    if (p.image) imagenes.unshift(aRepo(p.image));
  }
  imagenes = imagenes.filter(Boolean);

  const riesgo = [];
  if (condicion === "replica") riesgo.push("replica");
  if (p.category === "vapes") riesgo.push("vape");
  if (p.plans.some((pl) => pl.access === "Pantalla")) riesgo.push("cuenta-compartida");
  // Digital: el título ES una marca ajena (Netflix, Spotify…). Físico: si trae marca.
  if (!fisico || marca) riesgo.push("marca-registrada");

  const multi = p.plans.length > 1;
  productos.push({
    slug: p.slug,
    nombre: p.name,
    linea,
    categoria: p.category,
    subcategoria: a?.sub ?? pf?.quality ?? null,
    tipo: fisico ? "fisico" : "digital",
    condicion,
    marca,
    restringido: p.category === "vapes",
    agotado: p.stock === 0,
    destacado: Boolean(p.featured) || destacadosSlugs.has(p.slug),
    badge: p.badge ?? null,
    tagline: p.tagline ?? "",
    descripcion: p.description ?? "",
    features: p.features ?? [],
    devices: p.devices ?? null,
    forWho: p.forWho ?? null,
    includes: (p.includes ?? []).map((i) => ({ slug: i.slug, planId: i.planId })),
    variantes: p.plans.map((pl) => variante(p, pl, multi)),
    imagenes,
    imagenPropia: !fisico && p.image ? aRepo(p.image) : null,
    hue: p.hue,
    urlSitio: `https://doxnetworks.com/producto/${p.slug}`,
    riesgo,
    // Extras útiles para la carga, fuera del esquema mínimo:
    perfume: pf ? { para: pf.para, familia: pf.family ?? null, kind: pf.kind, linea: pf.line } : undefined,
    imagenesFaltan: imagenes.filter((r) => !existe(r)),
  });
}

const conteo = { digital: 0, perfumeria: 0, relojeria: 0, tecnologia: 0, vapes: 0 };
for (const p of productos) conteo[p.linea]++;

const ahora = new Date();
const tz = -ahora.getTimezoneOffset();
const iso = new Date(ahora.getTime() + tz * 60000).toISOString().slice(0, 19) + (tz <= 0 ? "-" : "+") + String(Math.abs(tz / 60)).padStart(2, "0") + ":00";

const salida = {
  generado: iso,
  fuente: "src/data/catalog.ts + perfumeria.ts + lineas.ts + vapes.ts · tools/inventario-shopify.mjs",
  conteo,
  productos,
};
fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "docs", "inventario-shopify.json"), JSON.stringify(salida, null, 2));

/* ── Resumen para leer sin abrir el JSON ── */
const agotados = productos.filter((p) => p.agotado);
const sinImagen = productos.filter((p) => p.imagenes.length === 0);
const imgRotas = productos.filter((p) => p.imagenesFaltan.length);
const cop = (n) => "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const top = productos
  .flatMap((p) => p.variantes.map((v) => ({ n: p.nombre, l: p.linea, e: v.etiqueta, precio: v.precio })))
  .sort((a, b) => b.precio - a.precio)
  .slice(0, 10);

const md = `# Inventario para Shopify · resumen

Generado el ${iso.slice(0, 10)} con \`node tools/inventario-shopify.mjs\`. El JSON completo está en \`docs/inventario-shopify.json\` (no se versiona: lleva costo de proveedor y el repo es público).

**${productos.length} productos · ${productos.reduce((s, p) => s + p.variantes.length, 0)} variantes.** Precios los que muestra la web hoy (tras el alza del 22-sep).

| Línea | Productos | Agotados | Sin imagen |
|---|---|---|---|
${Object.keys(conteo).map((l) => `| ${l} | ${conteo[l]} | ${productos.filter((p) => p.linea === l && p.agotado).length} | ${productos.filter((p) => p.linea === l && !p.imagenes.length).length} |`).join("\n")}

- **Agotados:** ${agotados.length}${agotados.length ? ` — ${agotados.slice(0, 6).map((p) => p.nombre).join(", ")}${agotados.length > 6 ? "…" : ""}` : ""}.
- **Sin ninguna imagen:** ${sinImagen.length}${sinImagen.length ? ` — ${sinImagen.map((p) => p.nombre).join(", ")}` : ""}.
- **Con ruta de imagen que no existe en disco:** ${imgRotas.length}${imgRotas.length ? ` — ${imgRotas.slice(0, 6).map((p) => p.nombre).join(", ")}` : ""}.
- **Restringidos (vapes):** ${productos.filter((p) => p.restringido).length}.
- **Riesgo:** replica ${productos.filter((p) => p.riesgo.includes("replica")).length} · cuenta-compartida ${productos.filter((p) => p.riesgo.includes("cuenta-compartida")).length} · marca-registrada ${productos.filter((p) => p.riesgo.includes("marca-registrada")).length}.

## Los diez precios más altos

| # | Producto | Línea | Variante | Precio |
|---|---|---|---|---|
${top.map((t, i) => `| ${i + 1} | ${t.n} | ${t.l} | ${t.e ?? "—"} | ${cop(t.precio)} |`).join("\n")}

## Sobre el tachado

Va exportado en \`tachado\` porque el encargo lo pide, pero **no debe cargarse como \`compareAtPrice\`**: Shopify lo pinta como «antes costaba», y el −55 % del catálogo se calcula hacia atrás desde el porcentaje, no es un precio que la tienda haya cobrado. Donde el tachado sí es comprobable (combos frente a la suma de sus partes; varios meses frente al mensual) el valor es el mismo campo, no hay forma de distinguirlos en el JSON: son los combos y los planes con \`per\` en catalog.ts.
`;
fs.writeFileSync(path.join(ROOT, "docs", "inventario-shopify.md"), md);

console.log(`\n${productos.length} productos, ${productos.reduce((s, p) => s + p.variantes.length, 0)} variantes -> docs/inventario-shopify.json`);
console.log("  conteo:", JSON.stringify(conteo));
console.log(`  agotados ${agotados.length} · sin imagen ${sinImagen.length} · rutas rotas ${imgRotas.length}`);
