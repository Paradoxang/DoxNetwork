import { motion, useReducedMotion } from "framer-motion";
import { Check, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  bestDiscount,
  categoryById,
  cheapestPlan,
  isAvailable,
  planLabel,
  type Product,
} from "@/data/catalog";
import { families, paraLabel } from "@/data/perfumeria";
import { formatCOP } from "@/data/site";
import { useCart } from "@/lib/cart";
import { ProductArt } from "@/components/ProductArt";

export function Price({ product, className = "" }: { product: Product; className?: string }) {
  const plan = cheapestPlan(product);
  if (plan.price === 0) return <span className={`font-bold text-ink ${className}`}>A cotizar</span>;
  return (
    <span className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      {product.plans.length > 1 && <span className="text-xs font-semibold text-faint">Desde</span>}
      <span className="text-lg font-extrabold text-ink">{formatCOP(plan.price)}</span>
      {plan.compareAt && <span className="text-sm text-faint line-through">{formatCOP(plan.compareAt)}</span>}
    </span>
  );
}

export function ProductBadge({ product }: { product: Product }) {
  const off = bestDiscount(product);
  if (!isAvailable(product)) {
    return <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold text-mute">Agotado</span>;
  }
  if (off) {
    return <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-bold text-gold">Ahorra {off}%</span>;
  }
  if (product.badge === "popular") {
    return <span className="rounded-full bg-neb-soft px-2.5 py-1 text-xs font-bold text-neb">Más vendido</span>;
  }
  if (product.badge === "nuevo") {
    return <span className="rounded-full bg-mint-soft px-2.5 py-1 text-xs font-bold text-mint">Nuevo</span>;
  }
  return null;
}

/** Escasez honesta: solo si el producto declara stock y quedan pocas unidades. */
export function StockHint({ product }: { product: Product }) {
  if (product.stock === undefined || product.stock === 0 || product.stock > 5) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
      {product.stock === 1 ? "¡Queda 1!" : `Quedan ${product.stock}`}
    </span>
  );
}

export function FavoriteButton({ product, className = "" }: { product: Product; className?: string }) {
  const { favorites, toggleFavorite } = useCart();
  const reduced = useReducedMotion();
  const on = favorites.includes(product.slug);
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite(product.slug);
      }}
      whileTap={reduced ? undefined : { scale: 0.8 }}
      aria-pressed={on}
      aria-label={on ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-bg/70 backdrop-blur-sm transition-colors ${
        on ? "text-[#f06a8a]" : "text-ink hover:text-[#f06a8a]"
      } ${className}`}
    >
      <motion.span
        key={on ? "on" : "off"}
        initial={reduced ? false : { scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Heart className="h-[18px] w-[18px]" fill={on ? "currentColor" : "none"} />
      </motion.span>
    </motion.button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const reduced = useReducedMotion();
  const [added, setAdded] = useState(false);
  const available = isAvailable(product);
  const plan = cheapestPlan(product);
  const quote = plan.price === 0;
  const category = categoryById(product.category);
  const perfume = product.perfume;
  const kicker = perfume ? perfume.brand || "Perfumería" : category?.name;
  const title = perfume ? perfume.line : product.name;
  const tagline = perfume
    ? [paraLabel[perfume.para], perfume.family && families[perfume.family].label].filter(Boolean).join(" · ")
    : product.tagline;

  const onAdd = () => {
    add(product.slug, plan.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <Link to={`/producto/${product.slug}`} className="flex flex-1 flex-col rounded-[18px] focus-visible:outline-offset-[-2px]">
        <div className="overflow-hidden">
          <ProductArt product={product} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4 pb-2">
          <div className="flex items-center justify-between gap-2">
            <span className={`truncate text-xs font-semibold text-faint ${perfume ? "uppercase tracking-[0.08em]" : ""}`}>{kicker}</span>
            <ProductBadge product={product} />
          </div>
          <h3 className="text-[17px] font-bold leading-snug text-ink">{title}</h3>
          <p className="line-clamp-2 text-sm text-mute">{tagline}</p>
          <StockHint product={product} />
        </div>
      </Link>

      <FavoriteButton product={product} className="absolute right-3 top-3" />

      <div className="flex items-center justify-between gap-3 p-4 pt-2">
        <Price product={product} />
        {available && !quote && (
          <motion.button
            type="button"
            onClick={onAdd}
            whileTap={reduced ? undefined : { scale: 0.9 }}
            aria-label={`Agregar ${product.name} (${planLabel(plan)}) al carrito`}
            title={planLabel(plan)}
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
