import { motion, useReducedMotion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { categoryById, fromPrice, isAvailable, isOnSale, type Product } from "@/data/catalog";
import { formatCOP } from "@/data/site";
import { useCart } from "@/lib/cart";
import { ProductArt } from "@/components/ProductArt";

export function Price({ product, className = "" }: { product: Product; className?: string }) {
  const plan = product.plans.reduce((a, b) => (b.price < a.price ? b : a));
  if (plan.price === 0) {
    return <span className={`font-bold text-ink ${className}`}>A cotizar</span>;
  }
  return (
    <span className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      {product.plans.length > 1 && <span className="text-xs font-semibold text-faint">Desde</span>}
      <span className="text-lg font-extrabold text-ink">{formatCOP(fromPrice(product))}</span>
      {plan.compareAt && (
        <span className="text-sm text-faint line-through">{formatCOP(plan.compareAt)}</span>
      )}
    </span>
  );
}

export function ProductBadge({ product }: { product: Product }) {
  if (!isAvailable(product)) {
    return <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold text-mute">Agotado</span>;
  }
  if (isOnSale(product)) {
    return <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-bold text-gold">Oferta</span>;
  }
  if (product.badge === "popular") {
    return <span className="rounded-full bg-neb-soft px-2.5 py-1 text-xs font-bold text-neb">Más vendido</span>;
  }
  if (product.badge === "nuevo") {
    return <span className="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-bold text-mint">Nuevo</span>;
  }
  return null;
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const reduced = useReducedMotion();
  const [added, setAdded] = useState(false);
  const available = isAvailable(product);
  const quote = product.plans[0].price === 0;
  const category = categoryById(product.category);

  const onAdd = () => {
    add(product.slug, product.plans[0].id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <Link
        to={`/producto/${product.slug}`}
        className="flex flex-1 flex-col rounded-[18px] focus-visible:outline-offset-[-2px]"
      >
        <ProductArt product={product} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="flex flex-1 flex-col gap-1.5 p-4 pb-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-faint">{category?.name}</span>
            <ProductBadge product={product} />
          </div>
          <h3 className="text-[17px] font-bold leading-snug text-ink">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-mute">{product.tagline}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-3 p-4 pt-2">
        <Price product={product} />
        {available && !quote && (
          <motion.button
            type="button"
            onClick={onAdd}
            whileTap={reduced ? undefined : { scale: 0.9 }}
            aria-label={`Agregar ${product.name} al carrito`}
            className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
              added ? "bg-mint text-mint-ink" : "bg-neb-soft text-neb hover:bg-neb hover:text-neb-ink"
            }`}
          >
            <motion.span
              key={added ? "ok" : "add"}
              initial={reduced ? false : { scale: 0.4, rotate: -60, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </motion.span>
          </motion.button>
        )}
      </div>
    </article>
  );
}
