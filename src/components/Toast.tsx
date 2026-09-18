import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";

/** Confirmación al agregar, con "Deshacer" (mecánica de ZeroDelay) y acceso al carrito. */
export function Toast() {
  const { toast, setOpen, dismissToast, count } = useCart();
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-[65] flex justify-center px-4 ${
        count > 0 ? "bottom-[92px] md:bottom-5" : "bottom-5"
      }`}
      aria-live="polite"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto flex max-w-full items-center gap-3 rounded-full border border-line-strong bg-surface py-1.5 pl-3 pr-1.5 text-sm font-semibold text-ink shadow-[var(--shadow)]"
          >
            <span className="relative -my-1 flex h-10 w-10 shrink-0 items-start justify-center overflow-hidden rounded-full bg-mint-soft" aria-hidden="true">
              <img src="/astro/astro-chibi-listo-sm.webp" alt="" width="360" height="360" className="mt-0.5 h-[62px] w-auto max-w-none" />
            </span>
            <span className="truncate">{toast.text}</span>
            {toast.undo && (
              <button
                type="button"
                onClick={() => {
                  toast.undo?.();
                  dismissToast();
                }}
                className="min-h-[36px] shrink-0 rounded-full px-3 text-mute hover:bg-surface-2 hover:text-ink"
              >
                Deshacer
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                dismissToast();
              }}
              className="min-h-[36px] shrink-0 rounded-full bg-neb px-3.5 text-neb-ink"
            >
              Ver carrito
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
