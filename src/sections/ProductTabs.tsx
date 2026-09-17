import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { SectionHeading } from "@/components/SectionHeading";
import { destacados, destacadosRed } from "@/data/destacados";
import { EASE, Reveal } from "@/lib/anim";

/**
 * Una pestaña por línea de la red, más "Destacados" que las mezcla. Antes
 * eran pestañas de streaming (más vendidos, ofertas…): ahora la primera
 * vista del inicio muestra perfumes, relojes y tecnología junto a lo digital.
 * Animated Tabs (brief, fase 2) lleva el indicador; framer, el cruce de rejillas.
 */
const tabs = [
  { id: "red", label: "Destacados", list: destacadosRed.slice(0, 8), more: { to: "/catalogo", label: "Ver toda la tienda" } },
  { id: "digital", label: "Digital", list: destacados.digital, more: { to: "/catalogo?linea=digital", label: "Ver digital" } },
  { id: "perfumeria", label: "Perfumería", list: destacados.perfumeria, more: { to: "/perfumeria", label: "Ver perfumería" } },
  { id: "relojeria", label: "Relojería", list: destacados.relojeria, more: { to: "/relojeria", label: "Ver relojería" } },
  { id: "tecnologia", label: "Tecnología", list: destacados.tecnologia, more: { to: "/tecnologia", label: "Ver tecnología" } },
].filter((t) => t.list.length > 0);

export function ProductTabs() {
  const [active, setActive] = useState(tabs[0].id);
  const reduced = useReducedMotion();
  const uid = useId();
  const tab = tabs.find((t) => t.id === active)!;

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <SectionHeading kicker="03 · Productos" title="Lo mejor de cada línea" />

      <Reveal delay={0.05} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <AnimatedTabs
            tabs={tabs}
            active={active}
            onChange={setActive}
            idBase={uid}
            panelId={`${uid}-panel`}
            label="Filtrar productos"
          />
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
          className="mt-6 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4"
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
