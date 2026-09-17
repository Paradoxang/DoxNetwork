import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Plan, Product } from "@/data/catalog";
import { formatCOP } from "@/data/site";
import { EASE } from "@/lib/anim";

type Axis = "access" | "tier" | "duration";

const axisLabel: Record<Axis, string> = {
  access: "Tipo de acceso",
  tier: "Plan",
  duration: "Duración",
};

const help: Partial<Record<Axis, { title: string; body: string[] }>> = {
  access: {
    title: "¿Pantalla o Completa?",
    body: [
      "Pantalla: un perfil propio dentro de una cuenta compartida. Lo usas en un dispositivo a la vez.",
      "Completa: la cuenta entera para ti, con todos sus perfiles. Ideal para compartir en casa.",
    ],
  },
};

/**
 * La escalera de precios de los competidores (acceso × calidad × duración)
 * como selectores segmentados. Solo aparecen los ejes que cambian dentro del
 * producto. Al tocar un valor se busca el plan que lo tenga y que conserve
 * lo más posible del resto de la selección.
 */
export function PlanPicker({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: Plan;
  onChange: (plan: Plan) => void;
}) {
  const axes = (["access", "tier", "duration"] as Axis[]).filter(
    (a) => new Set(product.plans.map((p) => p[a] ?? "")).size > 1
  );
  const uid = useId();

  if (axes.length === 0) return null;

  const pick = (axis: Axis, v: string) => {
    const candidates = product.plans.filter((p) => p[axis] === v);
    const score = (p: Plan) => axes.filter((a) => a !== axis && p[a] === value[a]).length;
    const best = candidates.sort((a, b) => score(b) - score(a))[0];
    if (best) onChange(best);
  };

  return (
    <div className="space-y-5">
      {axes.map((axis) => {
        const values = [...new Set(product.plans.map((p) => p[axis]!))];
        return (
          <fieldset key={axis}>
            <legend className="mb-2.5 flex items-center gap-2 text-sm font-bold">
              {axisLabel[axis]}
              {help[axis] && <HelpPopover {...help[axis]!} />}
            </legend>
            <div className="flex flex-wrap gap-2">
              {values.map((v) => {
                const on = value[axis] === v;
                // Precio más bajo disponible con este valor, como pista
                const min = Math.min(...product.plans.filter((p) => p[axis] === v).map((p) => p.price));
                return (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pick(axis, v)}
                    className={`relative min-h-[48px] rounded-2xl border px-4 py-2 text-left transition-colors ${
                      on ? "border-neb text-ink" : "border-line text-mute hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId={`${uid}-${axis}`}
                        className="absolute inset-0 rounded-2xl bg-neb-soft"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative block text-[15px] font-semibold">{v}</span>
                    <span className="relative block text-xs text-faint">desde {formatCOP(min)}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

function HelpPopover({ title, body }: { title: string; body: string[] }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        aria-label={title}
        className="-m-2 flex h-9 w-9 items-center justify-center rounded-full text-faint transition-colors hover:text-neb"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute left-0 top-8 z-30 block w-[min(300px,80vw)] rounded-2xl border border-line-strong bg-surface p-4 text-left font-normal shadow-[var(--shadow)]"
          >
            <span className="block text-sm font-bold text-ink">{title}</span>
            {body.map((b) => (
              <span key={b} className="mt-2 block text-sm leading-relaxed text-mute">
                {b}
              </span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
