import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart";

/** Confirmación breve al agregar al carrito; toca para abrir el carrito. */
export function Toast() {
  const { toast, setOpen } = useCart();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[65] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.button
            key={toast.id}
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-line-strong bg-surface py-2.5 pl-3 pr-5 text-sm font-semibold text-ink shadow-[var(--shadow)]"
          >
            <CheckCircle2 className="h-5 w-5 text-mint" />
            {toast.text}
            <span className="text-neb">Ver carrito</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
