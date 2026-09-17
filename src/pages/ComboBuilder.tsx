import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { Check, Plus, ShoppingBag, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Seo } from "@/components/Seo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  categories,
  cheapestPlan,
  initials,
  isAvailable,
  isCombo,
  planLabel,
  products,
  type CategoryId,
} from "@/data/catalog";
import { comboTiers, formatCOP, site, waLink } from "@/data/site";
import { EASE, Reveal } from "@/lib/anim";
import { buildOrderMessage, computeTotals, useCart } from "@/lib/cart";

/** Lo que se puede combinar: productos sueltos, con precio y disponibles. */
const pool = products.filter((p) => !isCombo(p) && isAvailable(p) && cheapestPlan(p).price > 0);
const poolCats = categories.filter((c) => pool.some((p) => p.category === c.id));

/**
 * El "arma tu propio combo" de ZeroDelay, que según su estudio es lo que más
 * sube el ticket y casi nadie implementa. Usa exactamente el mismo cálculo que
 * el carrito (computeTotals), así el precio que ves aquí es el que se cobra.
 */
export function ComboBuilder() {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [cat, setCat] = useState<CategoryId | "todas">("todas");
  const { addMany, setOpen } = useCart();
  const reduced = useReducedMotion();

  const lines = useMemo(
    () =>
      Object.entries(picked).map(([slug, planId]) => {
        const product = pool.find((p) => p.slug === slug)!;
        const plan = product.plans.find((pl) => pl.id === planId)!;
        return { slug, planId, qty: 1, product, plan, total: plan.price };
      }),
    [picked]
  );
  const t = computeTotals(lines);
  const maxPct = comboTiers.length ? comboTiers[comboTiers.length - 1].pct : 0;
  const maxMin = comboTiers.length ? comboTiers[comboTiers.length - 1].min : 1;
  const shown = pool.filter((p) => cat === "todas" || p.category === cat);

  const toggle = (slug: string) =>
    setPicked((prev) => {
      const next = { ...prev };
      if (next[slug]) delete next[slug];
      else next[slug] = cheapestPlan(pool.find((p) => p.slug === slug)!).id;
      return next;
    });

  return (
    <>
      <Seo
        title={`Arma tu combo · ${site.name}`}
        description={`Combina tus plataformas favoritas y ahorra hasta ${maxPct}%. El descuento se aplica solo.`}
        path="/arma-tu-combo"
      />
      <section className="mx-auto max-w-[1200px] px-4 pb-32 pt-[140px] md:px-6 md:pb-24 md:pt-[164px]">
        <Reveal>
          <p className="kicker">Arma tu combo</p>
          <h1 className="display mt-3 text-[clamp(34px,5.5vw,60px)]">Combina y ahorra hasta {maxPct}%</h1>
          <p className="mt-3 max-w-xl text-mute">
            Elige las plataformas que quieras y el plan de cada una. El descuento sube solo a medida que agregas.
          </p>
        </Reveal>

        {/* Escalones de descuento */}
        <Reveal delay={0.05} className="mt-8 flex flex-wrap gap-2">
          {comboTiers.map((tier) => {
            const reached = t.distinct >= tier.min;
            return (
              <span
                key={tier.min}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  reached ? "border-gold bg-gold-soft text-gold" : "border-line text-mute"
                }`}
              >
                {reached ? <Check className="h-4 w-4" strokeWidth={3} /> : <Sparkles className="h-4 w-4" />}
                {tier.min}
                {tier === comboTiers[comboTiers.length - 1] ? "+" : ""} productos · {tier.pct}%
              </span>
            );
          })}
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar">
              <button type="button" className="chip" aria-pressed={cat === "todas"} onClick={() => setCat("todas")}>
                Todas
              </button>
              {poolCats.map((c) => (
                <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                  <CategoryIcon id={c.id} className="h-4 w-4" /> {c.name}
                </button>
              ))}
            </div>

            <motion.ul layout={!reduced} className="mt-5 grid gap-3 sm:grid-cols-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((p) => {
                  const on = Boolean(picked[p.slug]);
                  return (
                    <motion.li
                      key={p.slug}
                      layout={!reduced}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className={`card relative flex flex-col gap-3 p-4 transition-colors ${on ? "border-neb" : ""}`}
                    >
                      {on && <span className="pointer-events-none absolute inset-0 rounded-[18px] bg-neb-soft" aria-hidden="true" />}
                      <div className="relative flex items-center gap-3">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                          style={{ background: p.hue }}
                          aria-hidden="true"
                        >
                          {initials(p.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold">{p.name}</p>
                          <p className="truncate text-xs text-faint">{p.tagline}</p>
                        </div>
                        <motion.button
                          type="button"
                          whileTap={reduced ? undefined : { scale: 0.88 }}
                          onClick={() => toggle(p.slug)}
                          aria-pressed={on}
                          aria-label={on ? `Quitar ${p.name}` : `Agregar ${p.name}`}
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                            on ? "bg-neb text-neb-ink" : "bg-surface-2 text-ink hover:bg-neb-soft hover:text-neb"
                          }`}
                        >
                          {on ? <Check className="h-5 w-5" strokeWidth={2.5} /> : <Plus className="h-5 w-5" />}
                        </motion.button>
                      </div>
                      <label className="relative">
                        <span className="sr-only">Plan de {p.name}</span>
                        <select
                          value={picked[p.slug] ?? cheapestPlan(p).id}
                          onChange={(e) => setPicked((prev) => ({ ...prev, [p.slug]: e.target.value }))}
                          className="field min-h-[44px] cursor-pointer appearance-none rounded-xl py-0 pr-9 text-sm"
                          style={{ fontSize: 16 }}
                        >
                          {p.plans.map((pl) => (
                            <option key={pl.id} value={pl.id}>
                              {planLabel(pl)} — {formatCOP(pl.price)}
                            </option>
                          ))}
                        </select>
                        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint">▾</span>
                      </label>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          </div>

          {/* Resumen: pegado al lado en escritorio, barra inferior en móvil */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-5">
              <p className="kicker">Tu combo</p>
              {lines.length === 0 ? (
                <p className="mt-4 text-sm text-mute">Agrega al menos dos productos para empezar a ahorrar.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.slug}
                        layout={!reduced}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{l.product.name}</span>
                          <span className="block truncate text-xs text-faint">{planLabel(l.plan)}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                          {formatCOP(l.total)}
                          <button type="button" onClick={() => toggle(l.slug)} className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-faint hover:text-ink" aria-label={`Quitar ${l.product.name}`}>
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {/* Progreso hacia el máximo descuento */}
              <div className="mt-5">
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-neb to-gold"
                    initial={false}
                    animate={{ width: `${Math.min(100, (t.distinct / maxMin) * 100)}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${t.distinct}-${t.discountPct}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-sm text-mute"
                  >
                    {t.nextTier
                      ? `Agrega ${t.nextTier.missing} más y llegas al ${t.nextTier.pct}%`
                      : t.discountPct
                        ? `¡Tienes el máximo descuento: ${t.discountPct}%!`
                        : "Elige productos para empezar"}
                  </motion.p>
                </AnimatePresence>
              </div>

              <dl className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
                <div className="flex justify-between text-mute">
                  <dt>Subtotal</dt>
                  <dd><Ticker value={t.subtotal} /></dd>
                </div>
                <div className={`flex justify-between ${t.discount ? "text-gold" : "text-faint"}`}>
                  <dt>Descuento {t.discountPct ? `(${t.discountPct}%)` : ""}</dt>
                  <dd>-<Ticker value={t.discount} /></dd>
                </div>
                <div className="flex justify-between pt-1 text-xl font-extrabold">
                  <dt>Total</dt>
                  <dd><Ticker value={t.total} /></dd>
                </div>
              </dl>

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  disabled={lines.length === 0}
                  onClick={() => {
                    addMany(lines.map((l) => ({ slug: l.slug, planId: l.planId })), `Combo de ${lines.length} productos agregado`);
                    setPicked({});
                    setOpen(true);
                  }}
                  className="btn btn-primary w-full"
                >
                  <ShoppingBag className="h-[18px] w-[18px]" /> Agregar combo al carrito
                </button>
                <a
                  href={lines.length ? waLink(buildOrderMessage(lines, t)) : undefined}
                  aria-disabled={lines.length === 0}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-buy w-full ${lines.length === 0 ? "pointer-events-none opacity-50" : ""}`}
                >
                  <WhatsAppIcon /> Pedir por WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Barra resumen en móvil */}
      <AnimatePresence>
        {lines.length > 0 && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[57] border-t border-line bg-bg/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-faint">
                  {lines.length} en tu combo{t.discountPct ? <span className="font-bold text-gold"> · -{t.discountPct}%</span> : null}
                </p>
                <p className="text-lg font-extrabold"><Ticker value={t.total} /></p>
              </div>
              <button
                type="button"
                onClick={() => {
                  addMany(lines.map((l) => ({ slug: l.slug, planId: l.planId })), `Combo de ${lines.length} productos agregado`);
                  setPicked({});
                  setOpen(true);
                }}
                className="btn btn-primary"
              >
                Agregar combo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Número que cuenta hasta su nuevo valor (Framer `animate`). */
function Ticker({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = formatCOP(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.5,
      ease: "easeOut",
      onUpdate: (v) => (el.textContent = formatCOP(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduced]);

  return <span ref={ref}>{formatCOP(value)}</span>;
}
