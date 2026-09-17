import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categories, categoryById, fromPrice, products, type CategoryId } from "@/data/catalog";
import { formatCOP } from "@/data/site";
import { EASE, lockScroll } from "@/lib/anim";
import { normalize, useUI } from "@/lib/ui";

interface Result {
  key: string;
  label: string;
  hint: string;
  to: string;
  icon: CategoryId;
  price?: number;
}

/**
 * Buscador tipo paleta de comandos (Ctrl/Cmd + K o "/"). Busca en vivo sobre
 * nombre, descripción corta y categoría, sin tildes. Flechas para moverse,
 * Enter para ir, Esc para cerrar. Vacío muestra los más vendidos.
 */
export function SearchPalette() {
  const { searchOpen: open, setSearchOpen: setOpen } = useUI();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActive(0);
    lockScroll(true);
    const t = window.setTimeout(() => input.current?.focus(), 40);
    return () => {
      window.clearTimeout(t);
      lockScroll(false);
    };
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const nq = normalize(q.trim());
    if (!nq) {
      return products
        .filter((p) => p.badge === "popular")
        .slice(0, 6)
        .map((p) => ({ key: p.slug, label: p.name, hint: "Más vendido", to: `/producto/${p.slug}`, icon: p.category, price: fromPrice(p) }));
    }
    const cats = categories
      .filter((c) => normalize(`${c.name} ${c.blurb}`).includes(nq))
      .slice(0, 3)
      .map((c) => ({ key: `c-${c.id}`, label: c.name, hint: "Categoría", to: `/catalogo?categoria=${c.id}`, icon: c.id }));
    const prods = products
      .filter((p) => normalize(`${p.name} ${p.tagline} ${categoryById(p.category)?.name}`).includes(nq))
      .slice(0, 8)
      .map((p) => ({
        key: p.slug,
        label: p.name,
        hint: categoryById(p.category)?.name ?? "",
        to: `/producto/${p.slug}`,
        icon: p.category,
        price: fromPrice(p),
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
            className="relative w-full max-w-[600px] overflow-hidden rounded-3xl border border-line-strong bg-bg shadow-2xl"
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
                placeholder="Busca Netflix, Canva, pines de cine…"
                className="h-16 w-full bg-transparent text-[17px] text-ink outline-none placeholder:text-faint"
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

            <ul ref={list} id="search-results" role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
              {!q.trim() && <li className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-faint">Lo más vendido</li>}
              {results.map((r, i) => (
                <li
                  key={r.key}
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
                    <span className="relative text-sm font-bold text-mute">
                      {r.price === 0 ? "A cotizar" : `desde ${formatCOP(r.price)}`}
                    </span>
                  )}
                  {i === active && <CornerDownLeft className="relative h-4 w-4 text-faint" />}
                </li>
              ))}
              {q.trim() && results.length === 0 && (
                <li className="flex flex-col items-center px-3 py-6 text-center text-mute">
                  <Astro pose="piensa" small enter={false} float={false} decorative className="mb-3 h-28" />
                  Sin resultados para “{q}”.
                  <button type="button" onClick={() => go()} className="mt-3 flex w-full items-center justify-center gap-1.5 font-semibold text-neb">
                    Buscar en todo el catálogo <ArrowRight className="h-4 w-4" />
                  </button>
                </li>
              )}
            </ul>

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
