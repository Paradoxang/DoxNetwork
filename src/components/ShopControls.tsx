import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EASE } from "@/lib/anim";

/** Controles compartidos por las páginas de cada línea (perfumería, relojería, tecnología) y el catálogo. */

export function Select({
  label,
  value,
  onChange,
  options,
  className = "md:w-60",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <label className={`relative ${className}`}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field cursor-pointer appearance-none pr-10">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint">
        ▾
      </span>
    </label>
  );
}

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 text-left font-bold"
      >
        {q}
        <Plus className={`h-5 w-5 shrink-0 text-faint transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <p className="px-5 pb-5 leading-relaxed text-mute">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

const EMPTY = new URLSearchParams();

/**
 * Filtros en la URL sin romper la hidratación: el HTML prerenderizado no
 * conoce la query, así que el primer render del cliente la ignora y los
 * filtros entran justo después de montar. `motionOn` llega un fotograma más
 * tarde para que ese primer ajuste no se anime.
 */
export function useUrlFilters(onChange?: () => void) {
  const [urlParams, setParams] = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  const [animOn, setAnimOn] = useState(false);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!hydrated) return;
    const raf = requestAnimationFrame(() => setAnimOn(true));
    return () => cancelAnimationFrame(raf);
  }, [hydrated]);
  const params = hydrated ? urlParams : EMPTY;

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true, preventScrollReset: true });
    onChange?.();
  };
  const clear = () => {
    setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
    onChange?.();
  };

  return { params, update, clear, animOn };
}
