import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatCOP } from "@/data/site";
import { EASE } from "@/lib/anim";
import { useCart } from "@/lib/cart";

/** Barra fija de carrito en móvil (la de ZeroDelay): total siempre a mano. */
export function MobileCartBar() {
  const { count, total, open, setOpen } = useCart();
  const visible = count > 0 && !open;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[58] border-t border-line bg-bg/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-faint">
                {count} {count === 1 ? "producto" : "productos"}
              </p>
              <p className="num text-lg font-semibold leading-tight">{formatCOP(total)}</p>
            </div>
            <button type="button" onClick={() => setOpen(true)} className="btn btn-buy shrink-0">
              <ShoppingBag className="h-[18px] w-[18px]" /> Ver carrito
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
