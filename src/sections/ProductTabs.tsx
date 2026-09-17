import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { fromPrice, isCombo, isOnSale, products } from "@/data/catalog";
import { EASE, Reveal } from "@/lib/anim";

/**
 * Los bloques de producto de Emprendered (recomendados, ofertas, recién
 * llegados) condensados en pestañas, para no repetir el mismo producto en
 * cuatro secciones seguidas. Framer lleva el subrayado y el cruce de rejillas.
 */
const tabs = [
  {
    id: "vendidos",
    label: "Más vendidos",
    list: products.filter((p) => !isCombo(p) && (p.badge === "popular" || p.featured)).slice(0, 8),
    more: { to: "/catalogo", label: "Ver catálogo" },
  },
  {
    // Los 8 más económicos: la puerta de entrada para el primer pedido
    id: "empezar",
    label: "Para empezar",
    list: products.filter((p) => !isCombo(p) && fromPrice(p) > 0).sort((a, b) => fromPrice(a) - fromPrice(b)).slice(0, 8),
    more: { to: "/catalogo?orden=menor", label: "Ver por precio" },
  },
  {
    id: "ofertas",
    label: "Con ahorro",
    list: products.filter((p) => !isCombo(p) && isOnSale(p)).slice(0, 8),
    more: { to: "/catalogo?ofertas=1", label: "Ver ofertas" },
  },
  {
    id: "nuevos",
    label: "Nuevos",
    list: products.filter((p) => p.badge === "nuevo").slice(0, 8),
    more: { to: "/catalogo", label: "Ver catálogo" },
  },
].filter((t) => t.list.length > 0);

export function ProductTabs() {
  const [active, setActive] = useState(tabs[0].id);
  const reduced = useReducedMotion();
  const uid = useId();
  const tab = tabs.find((t) => t.id === active)!;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = tabs[(i + d + tabs.length) % tabs.length];
    setActive(next.id);
    document.getElementById(`${uid}-tab-${next.id}`)?.focus();
  };

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <SectionHeading kicker="03 · Productos" title="Lo que más se lleva" />

      <Reveal delay={0.05} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filtrar productos" className="no-scrollbar -mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex rounded-full border border-line p-1">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                id={`${uid}-tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={active === t.id}
                aria-controls={`${uid}-panel`}
                tabIndex={active === t.id ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`relative min-h-[40px] whitespace-nowrap rounded-full px-4 text-sm font-bold transition-colors ${
                  active === t.id ? "text-neb-ink" : "text-mute hover:text-ink"
                }`}
              >
                {active === t.id && (
                  <motion.span
                    layoutId={reduced ? undefined : `${uid}-tab-pill`}
                    className="absolute inset-0 rounded-full bg-neb"
                    transition={{ type: "spring", stiffness: 450, damping: 36 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <Link to={tab.more.to} className="flex items-center gap-1.5 text-sm font-semibold text-neb hover:underline">
          {tab.more.label} <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={active}
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${active}`}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {tab.list.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </section>
  );
}
