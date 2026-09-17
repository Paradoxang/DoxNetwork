import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Deco } from "@/components/Deco";
import { ProductCard } from "@/components/ProductCard";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { SectionHeading } from "@/components/SectionHeading";
import { destacados, destacadosRed } from "@/data/destacados";
import { lineas } from "@/data/lineas";
import { tint } from "@/data/paleta";
import { EASE, Reveal } from "@/lib/anim";

/**
 * Una pestaña por línea de la red, más "Destacados" que las mezcla. Antes
 * eran pestañas de streaming (más vendidos, ofertas…): ahora la primera
 * vista del inicio muestra perfumes, relojes y tecnología junto a lo digital.
 * Animated Tabs (brief, fase 2) lleva el indicador; framer, el cruce de rejillas.
 */
const tabs = [
  { id: "red", label: "Destacados", hue: "#9aa9ff", list: destacadosRed.slice(0, 8), more: { to: "/catalogo", label: "Ver toda la tienda" } },
  { id: "digital", label: "Digital", hue: lineas.digital.hue, list: destacados.digital, more: { to: "/catalogo?linea=digital", label: "Ver digital" } },
  { id: "perfumeria", label: "Perfumería", hue: lineas.perfumeria.hue, list: destacados.perfumeria, more: { to: "/perfumeria", label: "Ver perfumería" } },
  { id: "relojeria", label: "Relojería", hue: lineas.relojeria.hue, list: destacados.relojeria, more: { to: "/relojeria", label: "Ver relojería" } },
  { id: "tecnologia", label: "Tecnología", hue: lineas.tecnologia.hue, list: destacados.tecnologia, more: { to: "/tecnologia", label: "Ver tecnología" } },
].filter((t) => t.list.length > 0);

export function ProductTabs() {
  const [active, setActive] = useState(tabs[0].id);
  const reduced = useReducedMotion();
  const uid = useId();
  const tab = tabs.find((t) => t.id === active)!;

  return (
    <section id="productos" className="mx-auto max-w-[1200px] scroll-mt-24 px-4 py-20 md:px-6 md:py-24">
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

      {/* El panel toma el color de la línea activa: cada pestaña cambia el ambiente */}
      <div
        className="brackets relative mt-6 overflow-hidden rounded-[28px] border transition-colors duration-500"
        style={{ borderColor: tint(tab.hue, 34), background: `radial-gradient(120% 90% at 0% 0%, ${tint(tab.hue, 20)}, transparent 62%), var(--bg-soft)` }}
      >
        <Deco name="reticula" className="-right-16 -top-16 w-72" opacity={0.22} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={active}
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${active}`}
          className="grid grid-cols-2 divide-x divide-y divide-line lg:grid-cols-4"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {tab.list.map((p) => (
            <li key={p.slug} className="p-3 md:p-5">
              <ProductCard product={p} variant="plain" />
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      </div>
    </section>
  );
}
