import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductArt } from "@/components/ProductArt";
import { allProducts, categoryById, fromPrice, type CategoryId, type Product } from "@/data/catalog";
import { destacadosRed } from "@/data/destacados";
import { isRestricted, lineaOf, lineaOrder, lineas, subLabel, type LineaId } from "@/data/lineas";
import { paraOptions, stockSecreto } from "@/data/perfumeria";
import { formatCOP, waLink } from "@/data/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { EASE, lockScroll } from "@/lib/anim";
import { normalize, useUI } from "@/lib/ui";

interface Result {
  key: string;
  label: string;
  hint: string;
  to: string;
  icon: CategoryId;
  price?: number;
  group: string;
  product?: Product;
}

/**
 * Buscador tipo Spotlight (Ctrl/Cmd + K o "/"): panel translúcido, resultados
 * agrupados por tipo y una vista previa del resultado activo a la derecha.
 * Busca en vivo sobre nombre, descripción corta y categoría, sin tildes.
 * Flechas para moverse, Enter para ir, Esc para cerrar. Vacío muestra los
 * destacados de la tienda. La vista previa se oculta en móvil: ahí manda la lista.
 */
export function SearchPalette() {
  const { searchOpen: open, setSearchOpen: setOpen, searchSeed } = useUI();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ(searchSeed);
    setActive(0);
    lockScroll(true);
    const t = window.setTimeout(() => input.current?.focus(), 40);
    return () => {
      window.clearTimeout(t);
      lockScroll(false);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo<Result[]>(() => {
    const nq = normalize(q.trim());
    if (!nq) {
      return destacadosRed.slice(0, 8).map((p) => ({
        key: p.slug,
        label: p.name,
        hint: lineas[lineaOf(p)].name,
        to: `/producto/${p.slug}`,
        icon: p.category,
        price: fromPrice(p),
        group: "Destacados",
        product: p,
      }));
    }
    const lines = ([...lineaOrder, "vapes"] as LineaId[])
      .filter((id) => normalize(`${lineas[id].name} ${lineas[id].blurb} ${id === "vapes" ? "vape vapeador" : ""}`).includes(nq))
      .map((id) => ({ key: `l-${id}`, label: lineas[id].name, hint: lineas[id].blurb, to: lineas[id].path, icon: id as CategoryId, group: "Líneas" }));
    const cats = [
      ...lines,
      // Los accesos por público de la perfumería: "para ella", "unisex", "sets"…
      ...paraOptions
        .filter((o) => normalize(`${o.label} perfume ${o.hint}`).includes(nq))
        .map((o) => ({ key: `p-${o.id}`, label: `Perfumes · ${o.label}`, hint: o.hint, to: `/perfumeria?para=${o.id}`, icon: "perfumeria" as CategoryId, group: "Perfumería" })),
    ].slice(0, 3);
    // Todas las palabras, en cualquier orden: "sauvage dior" encuentra "Dior Sauvage"
    const words = nq.split(/\s+/);
    const prods = allProducts
      .filter((p) => {
        if (isRestricted(p)) return false;
        const hay = normalize(`${p.name} ${p.tagline} ${categoryById(p.category)?.name}`);
        return words.every((w) => hay.includes(w));
      })
      .slice(0, 8)
      .map((p) => ({
        key: p.slug,
        label: p.name,
        hint: p.perfume
          ? `Perfumería · ${p.tagline}`
          : p.articulo
            ? `${lineas[p.articulo.line].name} · ${p.articulo.brand || subLabel[p.articulo.sub]}`
            : categoryById(p.category)?.name ?? "",
        to: `/producto/${p.slug}`,
        icon: p.category,
        price: fromPrice(p),
        group: "Productos",
        product: p,
      }));
    return [...cats, ...prods];
  }, [q]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (r?: Result) => {
    if (!r) {
      if (q.trim()) navigate(`/catalogo?q=${encodeURIComponent(q.trim())}`);
      setOpen(false);
      return;
    }
    navigate(r.to);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-3 pt-[10vh]" data-lenis-prevent>
          <motion.div
            className="absolute inset-0 bg-[#060912]/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar en la tienda"
            className="spotlight relative w-full max-w-[760px] overflow-hidden rounded-[26px] border border-line-strong shadow-2xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-5 w-5 shrink-0 text-faint" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Busca un perfume, un reloj, AirPods…"
                className="h-[64px] w-full bg-transparent text-[18px] text-ink outline-none placeholder:text-faint"
                role="combobox"
                aria-expanded="true"
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `sr-${results[active].key}` : undefined}
                autoComplete="off"
              />
              <button type="button" onClick={() => setOpen(false)} className="icon-btn h-9 w-9 shrink-0" aria-label="Cerrar buscador">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex">
              <ul ref={list} id="search-results" role="listbox" className="max-h-[55vh] flex-1 overflow-y-auto p-2 sm:max-h-[420px]">
                {results.map((r, i) => (
                  <Fragment key={r.key}>
                  {(i === 0 || results[i - 1].group !== r.group) && (
                    <li className="px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-faint first:pt-1">{r.group}</li>
                  )}
                <li
                  id={`sr-${r.key}`}
                  data-i={i}
                  role="option"
                  aria-selected={i === active}
                  onPointerMove={() => setActive(i)}
                  onClick={() => go(r)}
                  className="relative flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl px-3 py-2"
                >
                  {i === active && (
                    <motion.span
                      layoutId={reduced ? undefined : "search-active"}
                      className="absolute inset-0 rounded-2xl bg-surface"
                      transition={{ type: "spring", stiffness: 600, damping: 45 }}
                    />
                  )}
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neb-soft text-neb">
                    <CategoryIcon id={r.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block truncate font-bold">{r.label}</span>
                    <span className="block truncate text-xs text-faint">{r.hint}</span>
                  </span>
                  {r.price !== undefined && (
                    <span className="num relative text-sm font-semibold text-mute">
                      {r.price === 0 ? "A cotizar" : `desde ${formatCOP(r.price)}`}
                    </span>
                  )}
                  {i === active && <CornerDownLeft className="relative h-4 w-4 text-faint" />}
                </li>
                  </Fragment>
                ))}
              {q.trim() && results.length === 0 && (
                <li className="flex flex-col items-center px-3 py-6 text-center text-mute">
                  <Astro pose="chibi-espera" small enter={false} float={false} decorative className="mb-3 h-28" />
                  Sin resultados para “{q}”.
                  <button type="button" onClick={() => go()} className="mt-3 flex w-full items-center justify-center gap-1.5 font-semibold text-neb">
                    Buscar en toda la tienda <ArrowRight className="h-4 w-4" />
                  </button>
                  {/* Una fragancia que no está: el stock secreto, con lo que ya escribió */}
                  <a
                    href={waLink(stockSecreto.mensaje + q.trim())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex w-full items-center justify-center gap-1.5 font-semibold text-mint"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Preguntar por el stock secreto 😉
                  </a>
                </li>
              )}
              </ul>

              {/* Vista previa del resultado activo, como en Spotlight */}
              {results[active] && (
                <div className="hidden w-[260px] shrink-0 flex-col items-center border-l border-line p-5 text-center sm:flex" aria-hidden="true">
                  {results[active].product ? (
                    <ProductArt product={results[active].product!} size="sm" bare className="w-full rounded-2xl" />
                  ) : (
                    <span className="flex h-28 w-full items-center justify-center rounded-2xl bg-neb-soft text-neb">
                      <CategoryIcon id={results[active].icon} className="h-10 w-10" />
                    </span>
                  )}
                  <p className="mt-4 text-[15px] font-bold leading-tight">{results[active].label}</p>
                  <p className="mt-1 text-xs leading-snug text-mute">{results[active].hint}</p>
                  {results[active].price !== undefined && (
                    <p className="num mt-3 text-lg font-semibold">
                      {results[active].price === 0 ? "A cotizar" : formatCOP(results[active].price!)}
                    </p>
                  )}
                  <p className="mt-auto pt-4 text-[11px] text-faint">
                    <kbd className="rounded border border-line px-1">Enter</kbd> para abrir
                  </p>
                </div>
              )}
            </div>

            <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-faint sm:flex">
              <span><kbd className="rounded border border-line px-1">↑</kbd> <kbd className="rounded border border-line px-1">↓</kbd> moverse</span>
              <span><kbd className="rounded border border-line px-1">Enter</kbd> abrir</span>
              <span><kbd className="rounded border border-line px-1">Esc</kbd> cerrar</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
