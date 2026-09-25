import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { minPrice } from "@/data/catalog";
import { formatCOP } from "@/data/site";
import { useCart } from "@/lib/cart";
import { EASE } from "@/lib/anim";

const KEY = "dn:peek";

/**
 * La versión amable del popup de entrada de Emprendered: una tarjeta pequeña
 * en la esquina, a los 15 s y solo cuando ya se bajó más allá del hero, en
 * pantallas medianas o grandes y nunca con el carrito abierto.
 *
 * Brief de rediseño: tapaba contenido durante el scroll. Ahora aparece UNA
 * sola vez en este navegador (se recuerda aunque no la cierren), se retira
 * sola a los 12 s y al navegar a otra página.
 */
export function PromoPeek() {
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const show = ready && scrolled && !dismissed;
  const { open } = useCart();
  const location = useLocation();

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === "1";
    } catch {
      /* sin almacenamiento: se muestra igual una vez */
    }
    if (seen || !window.matchMedia("(min-width: 768px)").matches) return;
    const t = window.setTimeout(() => setReady(true), 15000);
    const onScroll = () => window.scrollY > window.innerHeight * 0.9 && setScrolled(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const close = () => {
    setDismissed(true);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* modo privado */
    }
  };

  // Al mostrarse queda recordada (una sola vez en este navegador) y se retira sola a los 12 s
  useEffect(() => {
    if (!show) return;
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* modo privado */
    }
    const t = window.setTimeout(() => setDismissed(true), 12000);
    return () => window.clearTimeout(t);
  }, [show]);

  // Si el cliente ya navega hacia productos, se retira sola
  useEffect(() => {
    if (show && location.pathname !== "/") close();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {/* Solo en el inicio: en /perfumeria esa esquina es del stock secreto */}
      {show && !open && location.pathname === "/" && (
        <motion.aside
          aria-label="Promoción"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed inset-x-4 bottom-4 z-[56] mx-auto hidden max-w-[520px] items-center gap-3 overflow-hidden rounded-2xl border border-line-strong bg-surface/95 py-2 pl-2 pr-3 shadow-[var(--shadow)] backdrop-blur-xl md:flex"
        >
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neb-soft">
            <Astro pose="urgente" small enter={false} float={false} decorative className="absolute inset-x-0 -top-1 mx-auto h-16" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="kicker block text-[10px]">¿Primera vez?</span>
            <span className="block truncate text-sm font-bold leading-snug">Empieza con productos desde {formatCOP(minPrice)}</span>
          </span>
          <Link
            to="/catalogo?orden=menor"
            onClick={close}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-neb hover:underline"
          >
            Ver lo barato <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-faint hover:text-ink"
            aria-label="Cerrar promoción"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
