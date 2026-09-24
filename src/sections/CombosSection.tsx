import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Deco } from "@/components/Deco";
import { ProductArt } from "@/components/ProductArt";
import { SectionHeading } from "@/components/SectionHeading";
import { bestDiscount, cheapestPlan, planOf, productBySlug, products, type Product } from "@/data/catalog";
import { formatCOP } from "@/data/site";
import { useCart } from "@/lib/cart";
import { useBatchReveal } from "@/lib/useBatchReveal";

const combos = products.filter((p) => p.category === "combos");

export function CombosSection() {
  const scope = useRef<HTMLElement>(null);
  useBatchReveal(scope);

  return (
    <section ref={scope} id="combos" className="difiere slant relative overflow-hidden bg-bg-soft">
      <div className="aurora" aria-hidden="true" />
      <Deco name="orbe-2" className="-right-24 top-40 w-48 md:-right-32 md:w-80" opacity={0.3} float pesado />
      <Deco name="obj-cofre" className="-left-16 bottom-28 hidden w-44 lg:block xl:w-56" opacity={0.45} rotate={-8} fade={false} />
      <div className="relative mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
        <SectionHeading
          kicker="02 · Combos"
          title="Un combo para cada plan"
          action={
            <Link to="/catalogo?categoria=combos" className="btn btn-ghost self-start md:self-auto">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          }
        >
          Varias plataformas por menos de lo que cuestan por separado.
        </SectionHeading>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {combos.map((c) => (
            <li key={c.slug} data-reveal>
              <ComboCard combo={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ComboCard({ combo }: { combo: Product }) {
  const { add } = useCart();
  const reduced = useReducedMotion();
  const [added, setAdded] = useState(false);
  const plan = cheapestPlan(combo);
  const saving = (plan.compareAt ?? plan.price) - plan.price;

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link to={`/producto/${combo.slug}`} className="flex flex-1 flex-col">
        <ProductArt product={combo} size="wide" />
        <div className="flex flex-1 flex-col p-5 pb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-faint">{combo.forWho}</span>
            <span className="shrink-0 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-bold text-gold">-{bestDiscount(combo)}%</span>
          </div>
          <h3 className="mt-2 text-xl font-extrabold leading-tight">{combo.name}</h3>
          <ul className="mt-3 space-y-1.5">
            {combo.includes!.map((i, n) => {
              const prod = productBySlug(i.slug)!;
              const pl = planOf(i.slug, i.planId)!;
              return (
                <li key={`${i.slug}-${i.planId}-${n}`} className="flex items-center gap-2 text-sm text-mute">
                  <Check className="h-4 w-4 shrink-0 text-mint" strokeWidth={2.5} />
                  <span className="truncate">
                    <span className="font-semibold text-ink">{prod.name}</span> · {[pl.access, pl.tier].filter(Boolean).join(" ") || pl.duration}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Link>
      <div className="flex items-end justify-between gap-3 border-t border-line p-5 pt-4">
        <div>
          <p className="flex items-baseline gap-2">
            <span className="num text-2xl font-semibold">{formatCOP(plan.price)}</span>
            {plan.compareAt && <span className="num text-sm text-faint line-through">{formatCOP(plan.compareAt)}</span>}
          </p>
          {saving > 0 && <p className="text-xs font-bold text-gold">Ahorras {formatCOP(saving)}</p>}
        </div>
        <motion.button
          type="button"
          whileTap={reduced ? undefined : { scale: 0.94 }}
          onClick={() => {
            add(combo.slug, plan.id);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1400);
          }}
          className={`btn shrink-0 ${added ? "btn-buy" : "btn-primary"}`}
          aria-label={`Agregar combo ${combo.name} al carrito`}
        >
          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {added ? "Listo" : "Agregar"}
        </motion.button>
      </div>
    </article>
  );
}
