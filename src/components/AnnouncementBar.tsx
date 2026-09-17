import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { announcements } from "@/data/site";

/**
 * Barra superior con mensajes que rotan hacia arriba cada 4 s. Se pausa al
 * pasar el puntero o enfocarla, y con movimiento reducido no rota. El primer
 * mensaje sale igual en el prerender y en el cliente.
 */
export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced || announcements.length < 2) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % announcements.length), 4000);
    return () => window.clearInterval(t);
  }, [paused, reduced]);

  return (
    <div
      className="relative flex h-9 items-center justify-center overflow-hidden border-b border-line bg-neb-soft px-4 text-[13px] font-semibold text-ink"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Anuncios"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={i}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="truncate"
          aria-live="polite"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-mint" aria-hidden="true" />
          {announcements[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
