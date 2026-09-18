import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Astro, type AstroPose } from "@/components/Astro";
import { CategoryIcon, LineIcon } from "@/components/CategoryIcon";
import { ProductCard } from "@/components/ProductCard";
import { Select, useUrlFilters } from "@/components/ShopControls";
import { SideRail, type RailGroup } from "@/components/SideRail";
import { Seo } from "@/components/Seo";
import { Telon } from "@/components/Telon";
import {
  allProducts,
  bestDiscount,
  categories,
  categoryById,
  fromPrice,
  isAvailable,
  isOnSale,
  type CategoryId,
  type Product,
} from "@/data/catalog";
import { lineaOf, lineaOrder, lineas, type LineaId } from "@/data/lineas";
import { site } from "@/data/site";
import { EASE, Reveal } from "@/lib/anim";
import { normalize } from "@/lib/ui";

type Sort = "relevancia" | "menor" | "mayor" | "ahorro" | "az";

const PAGE = 24;

/** Por línea: primero lo destacado y lo disponible, en el orden de los datos. */
const byLine = Object.fromEntries(
  lineaOrder.map((id) => [
    id,
    allProducts
      .filter((p) => lineaOf(p) === id)
      .map((p, i) => ({ p, i, score: (isAvailable(p) ? 4 : 0) + (p.badge === "popular" ? 2 : 0) + (p.featured ? 1 : 0) }))
      .sort((a, b) => b.score - a.score || a.i - b.i)
      .map((x) => x.p),
  ])
) as Record<LineaId, Product[]>;

/**
 * "Toda la tienda" intercala las líneas (digital, perfume, reloj,
 * tecnología, digital…) para que la primera página muestre la red completa
 * y no 36 plataformas seguidas de 176 perfumes.
 */
const mixed: Product[] = (() => {
  const out: Product[] = [];
  const max = Math.max(...lineaOrder.map((id) => byLine[id].length));
  for (let i = 0; i < max; i++) for (const id of lineaOrder) if (byLine[id][i]) out.push(byLine[id][i]);
  return out;
})();

const catalogoMin = Math.min(...mixed.map(fromPrice).filter((n) => n > 0));

export function Catalog() {
  const reduced = useReducedMotion();
  const [limit, setLimit] = useState(PAGE);
  const { params, update, clear, animOn } = useUrlFilters(() => setLimit(PAGE));
  const motionOn = animOn && !reduced;

  const q = params.get("q") ?? "";
  const cat = (params.get("categoria") ?? "") as CategoryId | "";
  const onlySale = params.get("ofertas") === "1";
  // Una categoría digital o "ofertas" implican la línea digital (enlaces viejos siguen sirviendo)
  const rawLinea = (cat || onlySale ? "digital" : params.get("linea")) ?? "";
  // Solo líneas públicas: vapes tiene su propia sección con verificación de edad
  const linea = (lineaOrder.includes(rawLinea as LineaId) ? rawLinea : "") as LineaId | "";
  const sort = (params.get("orden") as Sort) || "relevancia";

  const list = useMemo(() => {
    const words = normalize(q.trim()).split(/\s+/).filter(Boolean);
    let out = (linea ? byLine[linea] : mixed).filter((p) => {
      if (cat && p.category !== cat) return false;
      if (onlySale && !isOnSale(p)) return false;
      if (!words.length) return true;
      const hay = normalize(`${p.name} ${p.tagline} ${categoryById(p.category)?.name ?? ""} ${lineas[lineaOf(p)].name}`);
      return words.every((w) => hay.includes(w));
    });
    out = [...out].sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)));
    if (sort === "menor") out.sort((a, b) => fromPrice(a) - fromPrice(b));
    if (sort === "mayor") out.sort((a, b) => fromPrice(b) - fromPrice(a));
    if (sort === "ahorro") out.sort((a, b) => bestDiscount(b) - bestDiscount(a));
    if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return out;
  }, [q, cat, onlySale, linea, sort]);

  const current = cat ? categoryById(cat) : undefined;
  const line = linea ? lineas[linea] : undefined;
  const astroPose: AstroPose = onlySale ? "sorpresa" : cat === "combos" ? "celebra" : cat === "cine-tv" ? "cine" : "senala";
  const hasFilters = Boolean(q || cat || onlySale || linea);
  const visible = list.slice(0, limit);

  // El rail de las colecciones, aquí con las líneas de la red y las categorías
  // digitales. Una categoría implica la línea digital, igual que en los filtros.
  const railGrupos: RailGroup[] = [
    {
      label: "Líneas",
      items: [
        {
          key: "todas",
          label: "Toda la tienda",
          count: mixed.length,
          active: !linea && !cat && !onlySale,
          onSelect: () => update({ linea: null, categoria: null, ofertas: null }),
        },
        ...lineaOrder.map((id) => ({
          key: id,
          label: lineas[id].name,
          count: byLine[id].length,
          active: linea === id && !cat && !onlySale,
          onSelect: () => update({ linea: linea === id && !cat ? null : id, categoria: null, ofertas: null }),
        })),
      ],
    },
    {
      label: "Categorías digitales",
      items: categories.map((c) => ({
        key: c.id,
        label: c.name,
        count: byLine.digital.filter((p) => p.category === c.id).length,
        active: cat === c.id,
        onSelect: () => update({ categoria: cat === c.id ? null : c.id, linea: null, ofertas: null }),
      })),
    },
    {
      label: "Precio",
      items: [
        { key: "todo", label: "Todo", active: !onlySale, onSelect: () => update({ ofertas: null }) },
        { key: "ofertas", label: "Solo con ahorro", active: onlySale, onSelect: () => update({ ofertas: onlySale ? null : "1", linea: null, categoria: null }) },
      ],
    },
  ];

  return (
    <>
      <SideRail
        linea={{
          name: line ? line.name : "Toda la tienda",
          blurb: line ? line.blurb : "Digital, perfumería, relojería y tecnología",
          path: "/catalogo",
          hue: line ? line.hue : "#9aa9ff",
        }}
        total={mixed.length}
        minPrice={catalogoMin}
        grupos={railGrupos}
      />
      <Seo
        title={`Catálogo · ${site.name}`}
        description="Toda la red en un lugar: streaming, IA y software, perfumería, relojería y tecnología. Precios claros y pedido por WhatsApp."
        path="/catalogo"
      />
      <div className="xl:pl-[228px]">
      <Telon name="telon-nebulosa" fijo opacity={0.32} />
      <section className="mx-auto max-w-[1200px] px-4 pb-24 pt-[140px] md:px-6 md:pt-[164px]">
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            <p className="kicker">Catálogo</p>
            <h1 className="display mt-3 text-[clamp(34px,5.5vw,60px)]">
              {onlySale ? "Con ahorro" : current ? current.name : line ? line.name : "Toda la tienda"}
            </h1>
            <p className="mt-3 max-w-xl text-mute">
              {current
                ? current.blurb + "."
                : line
                  ? line.blurb + "."
                  : "Digital, perfumería, relojería y tecnología. Agrega al carrito y confirma tu pedido por WhatsApp."}
            </p>
          </Reveal>
          {/* ASTRO cambia de pose según lo que se está viendo */}
          <div className="relative -mb-4 hidden h-44 w-40 shrink-0 md:block">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={astroPose}
                className="absolute inset-0 flex justify-center"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                <Astro pose={astroPose} small enter={false} decorative className="h-full" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controles */}
        <Reveal delay={0.06} className="mt-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <label htmlFor="cat-q" className="sr-only">
                Buscar en el catálogo
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-faint" />
              <input
                id="cat-q"
                type="search"
                value={q}
                onChange={(e) => update({ q: e.target.value || null })}
                placeholder="Buscar: Netflix, Sauvage, Kairos, AirPods…"
                className="field pl-11"
                autoComplete="off"
              />
            </div>
            <Select
              label="Ordenar"
              className="sm:w-56"
              value={sort}
              onChange={(v) => update({ orden: v === "relevancia" ? null : v })}
              options={[
                { value: "relevancia", label: "Relevancia" },
                { value: "menor", label: "Precio: menor a mayor" },
                { value: "mayor", label: "Precio: mayor a menor" },
                { value: "ahorro", label: "Mayor ahorro" },
                { value: "az", label: "Nombre: A–Z" },
              ]}
            />
          </div>

          {/* Líneas de la red */}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por línea">
            <button type="button" className="chip" aria-pressed={!linea} onClick={() => update({ linea: null, categoria: null, ofertas: null })}>
              Toda la tienda
            </button>
            {lineaOrder.map((id) => (
              <button
                key={id}
                type="button"
                className="chip"
                aria-pressed={linea === id && !cat && !onlySale}
                onClick={() => update({ linea: linea === id && !cat && !onlySale ? null : id, categoria: null, ofertas: null })}
              >
                <LineIcon id={id} className="h-4 w-4" />
                {lineas[id].name}
                <span className="text-xs text-faint">{byLine[id].length}</span>
              </button>
            ))}
            <Link to={lineas.vapes.path} className="chip whitespace-nowrap text-faint">
              <LineIcon id="vapes" className="h-4 w-4" />
              {lineas.vapes.name} · +18
            </Link>
          </div>

          {/* Categorías digitales, solo dentro de Digital */}
          {linea === "digital" && (
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por categoría digital">
              <button type="button" className="chip" aria-pressed={onlySale} onClick={() => update({ ofertas: onlySale ? null : "1", linea: "digital" })}>
                Ofertas
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="chip"
                  aria-pressed={cat === c.id}
                  onClick={() => update({ categoria: cat === c.id ? null : c.id, linea: "digital" })}
                >
                  <CategoryIcon id={c.id} className="h-4 w-4" />
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Las líneas físicas tienen su página con filtros propios */}
          {line && linea !== "digital" && (
            <Link to={line.path} className="flex items-center gap-2 text-sm font-semibold text-neb hover:underline">
              Ver {line.name.toLowerCase()} con todos sus filtros <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </Reveal>

        <div className="mt-6 flex items-center justify-between text-sm text-faint" aria-live="polite">
          <span>
            {list.length} {list.length === 1 ? "producto" : "productos"}
          </span>
          {hasFilters && (
            <button type="button" onClick={clear} className="flex min-h-[44px] items-center gap-1.5 font-semibold text-mute hover:text-ink">
              <X className="h-4 w-4" /> Limpiar filtros
            </button>
          )}
        </div>

        {/* Rejilla: Framer reordena con `layout` al filtrar */}
        <LayoutGroup>
          <motion.ul layout={motionOn} className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p) => (
                <motion.li
                  key={p.slug}
                  layout={motionOn}
                  initial={motionOn ? { opacity: 0, scale: 0.94 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={motionOn ? { opacity: 0, scale: 0.94, transition: { duration: 0.18 } } : undefined}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <ProductCard product={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        {list.length > limit && (
          <div className="mt-8 flex justify-center">
            <button type="button" className="btn btn-ghost" onClick={() => setLimit((n) => n + PAGE)}>
              <Plus className="h-4 w-4" /> Ver más productos ({list.length - limit})
            </button>
          </div>
        )}

        <AnimatePresence>
          {list.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card mt-4 flex flex-col items-center gap-3 px-6 py-12 text-center"
            >
              <Astro pose="chibi-espera" small decorative className="h-40" />
              <p className="text-lg font-bold">No encontramos resultados</p>
              <p className="max-w-sm text-mute">Prueba con otra palabra o escríbenos: si no está, te lo conseguimos.</p>
              <button type="button" className="btn btn-ghost mt-2" onClick={clear}>
                Ver toda la tienda
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      </div>
    </>
  );
}
