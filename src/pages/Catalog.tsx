import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductCard } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";
import {
  bestDiscount,
  categories,
  categoryById,
  fromPrice,
  isAvailable,
  isOnSale,
  products,
  type CategoryId,
} from "@/data/catalog";
import { site } from "@/data/site";
import { EASE, Reveal } from "@/lib/anim";
import { normalize } from "@/lib/ui";

type Sort = "relevancia" | "menor" | "mayor" | "ahorro" | "az";


const EMPTY = new URLSearchParams();

export function Catalog() {
  const [urlParams, setParams] = useSearchParams();
  const reduced = useReducedMotion();

  /* El HTML prerenderizado es el catálogo sin filtros (el build no conoce la
     query). Para que la hidratación case, el primer render del cliente
     también ignora la URL; los filtros entran justo después de montar y ese
     primer ajuste no se anima (`animOn`), así no se ve una ola de salidas. */
  const [hydrated, setHydrated] = useState(false);
  const [animOn, setAnimOn] = useState(false);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!hydrated) return;
    const raf = requestAnimationFrame(() => setAnimOn(true));
    return () => cancelAnimationFrame(raf);
  }, [hydrated]);
  const params = hydrated ? urlParams : EMPTY;
  const motionOn = animOn && !reduced;

  const q = params.get("q") ?? "";
  const cat = (params.get("categoria") ?? "") as CategoryId | "";
  const onlySale = params.get("ofertas") === "1";
  const sort = (params.get("orden") as Sort) || "relevancia";

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const list = useMemo(() => {
    const nq = normalize(q.trim());
    let out = products.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!onlySale || isOnSale(p)) &&
        (!nq ||
          normalize(`${p.name} ${p.tagline} ${categoryById(p.category)?.name ?? ""}`).includes(nq))
    );
    // Los agotados siempre al final
    out = [...out].sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)));
    if (sort === "menor") out.sort((a, b) => fromPrice(a) - fromPrice(b));
    if (sort === "mayor") out.sort((a, b) => fromPrice(b) - fromPrice(a));
    if (sort === "ahorro") out.sort((a, b) => bestDiscount(b) - bestDiscount(a));
    if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return out;
  }, [q, cat, onlySale, sort]);

  const current = cat ? categoryById(cat) : undefined;
  const hasFilters = Boolean(q || cat || onlySale);

  return (
    <>
      <Seo
        title={`Catálogo · ${site.name}`}
        description="Streaming, música, IA, software, gaming, cursos y más. Precios claros y entrega por WhatsApp."
        path="/catalogo"
      />
      <section className="mx-auto max-w-[1200px] px-4 pb-24 pt-[140px] md:px-6 md:pt-[164px]">
        <Reveal>
          <p className="kicker">Catálogo</p>
          <h1 className="display mt-3 text-[clamp(34px,5.5vw,60px)]">
            {onlySale ? "Con ahorro" : current ? current.name : "Todos los productos"}
          </h1>
          <p className="mt-3 max-w-xl text-mute">
            {current ? current.blurb + "." : "Elige, agrega al carrito y confirma tu pedido por WhatsApp."}
          </p>
        </Reveal>

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
                placeholder="Buscar: Netflix, Canva, pines de cine…"
                className="field pl-11"
                autoComplete="off"
              />
            </div>
            <label className="relative sm:w-56">
              <span className="sr-only">Ordenar</span>
              <select
                value={sort}
                onChange={(e) => update({ orden: e.target.value === "relevancia" ? null : e.target.value })}
                className="field cursor-pointer appearance-none pr-10"
              >
                <option value="relevancia">Relevancia</option>
                <option value="menor">Precio: menor a mayor</option>
                <option value="mayor">Precio: mayor a menor</option>
                <option value="ahorro">Mayor ahorro</option>
                <option value="az">Nombre: A–Z</option>
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint">
                ▾
              </span>
            </label>
          </div>

          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por categoría">
            <button type="button" className="chip" aria-pressed={!cat && !onlySale} onClick={() => update({ categoria: null, ofertas: null })}>
              Todos
            </button>
            <button
              type="button"
              className="chip"
              aria-pressed={onlySale}
              onClick={() => update({ ofertas: onlySale ? null : "1" })}
            >
              Ofertas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={cat === c.id}
                onClick={() => update({ categoria: cat === c.id ? null : c.id })}
              >
                <CategoryIcon id={c.id} className="h-4 w-4" />
                {c.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 flex items-center justify-between text-sm text-faint" aria-live="polite">
          <span>
            {list.length} {list.length === 1 ? "producto" : "productos"}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })}
              className="flex min-h-[44px] items-center gap-1.5 font-semibold text-mute hover:text-ink"
            >
              <X className="h-4 w-4" /> Limpiar filtros
            </button>
          )}
        </div>

        {/* Rejilla: Framer reordena con `layout` al filtrar */}
        <LayoutGroup>
          <motion.ul layout={motionOn} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p) => (
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

        <AnimatePresence>
          {list.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card mt-4 flex flex-col items-center gap-3 px-6 py-16 text-center"
            >
              <p className="text-lg font-bold">No encontramos resultados</p>
              <p className="max-w-sm text-mute">Prueba con otra palabra o escríbenos: si no está, te lo conseguimos.</p>
              <button
                type="button"
                className="btn btn-ghost mt-2"
                onClick={() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })}
              >
                Ver todo el catálogo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
