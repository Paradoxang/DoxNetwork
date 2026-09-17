import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";
import { productBySlug } from "@/data/catalog";
import { site } from "@/data/site";
import { EASE, Reveal } from "@/lib/anim";
import { useCart } from "@/lib/cart";

/** Lista de deseos (Torostream y Emprendered la tienen): intención de compra sin fricción. */
export function Favorites() {
  const { favorites } = useCart();
  const reduced = useReducedMotion();
  const list = favorites.map((s) => productBySlug(s)!).filter(Boolean);

  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-24 pt-[140px] md:px-6 md:pt-[164px]">
      <Seo title={`Favoritos · ${site.name}`} description="Los productos que guardaste para después." path="/favoritos" />
      <Reveal>
        <p className="kicker">Favoritos</p>
        <h1 className="display mt-3 text-[clamp(34px,5.5vw,60px)]">Guardado para después</h1>
        <p className="mt-3 text-mute">Se guardan en este navegador. Toca el corazón de cualquier producto para agregarlo.</p>
      </Reveal>

      {list.length === 0 ? (
        <Reveal delay={0.06} className="card mt-10 flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neb-soft text-neb">
            <Heart className="h-7 w-7" />
          </span>
          <p className="text-lg font-bold">Aún no tienes favoritos</p>
          <Link to="/catalogo" className="btn btn-primary mt-2">Explorar catálogo</Link>
        </Reveal>
      ) : (
        <motion.ul layout={!reduced} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.li
                key={p.slug}
                layout={!reduced}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  );
}
