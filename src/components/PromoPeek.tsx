import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SmartImage } from "@/components/SmartImage";
import { minPrice } from "@/data/catalog";
import { formatCOP } from "@/data/site";
import { useCart } from "@/lib/cart";
import { EASE } from "@/lib/anim";

const KEY = "dn:peek";

/**
 * La versión amable del popup de entrada de Emprendered: en vez de un modal
 * que tapa la página, una tarjeta pequeña en la esquina, una sola vez por
 * sesión, a los 15 s y solo cuando ya se bajó más allá del hero (así nunca
 * tapa el buscador), en pantallas medianas o grandes y nunca con el carrito
 * abierto.
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
      seen = sessionStorage.getItem(KEY) === "1";
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
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* modo privado */
    }
  };

  // Si el cliente ya navega hacia productos, se retira sola
  useEffect(() => {
    if (show && location.pathname !== "/") close();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {show && !open && (
        <motion.aside
          aria-label="Promoción"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.2 } }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed bottom-5 left-5 z-[56] hidden w-[250px] overflow-hidden rounded-3xl border border-line-strong bg-surface shadow-[var(--shadow)] md:block"
        >
          <div
            className="relative aspect-[16/9]"
            style={{ background: "radial-gradient(90% 90% at 80% 10%, var(--neb-soft), transparent 60%), var(--surface-2)" }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold tracking-[-0.03em] text-neb">
              {formatCOP(minPrice)}
            </span>
            <SmartImage src="/promos/promo-peek.webp" className="absolute inset-0 h-full w-full object-cover" />
            <button
              type="button"
              onClick={close}
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-bg/80 text-ink backdrop-blur-sm hover:text-neb"
              aria-label="Cerrar promoción"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <p className="kicker">¿Primera vez?</p>
            <p className="mt-2 font-bold leading-snug">Empieza con productos desde {formatCOP(minPrice)}</p>
            <Link to="/catalogo?orden=menor" onClick={close} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-neb hover:underline">
              Ver lo más económico <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
