import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import {
  bestDiscount,
  categoryById,
  cheapestPlan,
  isAvailable,
  planLabel,
  type Product,
} from "@/data/catalog";
import { conditionInfo, lineas, subLabel } from "@/data/lineas";
import { families, paraLabel, qualityInfo } from "@/data/perfumeria";
import { formatCOP } from "@/data/site";
import { useCart } from "@/lib/cart";
import { ProductArt } from "@/components/ProductArt";
import UICard, { type ProductCardProps } from "@/components/ui/product-card";
import { smoothButtonVariants } from "@/components/ui/smooth-button";

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

/**
 * Tarjeta de la tienda sobre components/ui/product-card: arma la miniatura,
 * la etiqueta y el precio de cada producto y conecta carrito y favoritos.
 * Para cotizar o si está agotado, el botón se cambia por el que corresponde.
 */
export function ProductCard({ product }: { product: Product }) {
  const { add, favorites, toggleFavorite } = useCart();
  const available = isAvailable(product);
  const plan = cheapestPlan(product);
  const quote = plan.price === 0;
  const category = categoryById(product.category);
  const perfume = product.perfume;
  const articulo = product.articulo;
  const off = bestDiscount(product);
  const href = `/producto/${product.slug}`;

  const badge: ProductCardProps["badge"] = !available
    ? { label: "Agotado", tone: "muted" }
    : perfume
      ? { label: qualityInfo[perfume.quality].label, tone: "dark" }
      : articulo
        ? articulo.condition === "original"
          ? { label: conditionInfo.original.label, tone: "new" }
          : articulo.condition === "replica"
            ? { label: conditionInfo.replica.label, tone: "dark" }
            : undefined
        : off
        ? plan.compareAt
          ? undefined // el descuento ya va junto al precio
          : { label: `Ahorra hasta ${off}%`, tone: "sale" } // el ahorro está en otro plan (3 meses…)
        : product.badge === "popular"
          ? { label: "Más vendido", tone: "popular" }
          : product.badge === "nuevo"
            ? { label: "Nuevo", tone: "new" }
            : undefined;

  return (
    <UICard
      media={<ProductArt product={product} size="square" bare />}
      title={perfume ? perfume.line : product.name}
      href={href}
      kicker={
        perfume
          ? perfume.brand || "Perfumería"
          : articulo
            ? articulo.sub === "relojes"
              ? lineas.relojeria.name
              : `${lineas[articulo.line].name} · ${subLabel[articulo.sub]}`
            : category?.name
      }
      subtitle={
        perfume
          ? [paraLabel[perfume.para], perfume.family && families[perfume.family].label].filter(Boolean).join(" · ")
          : articulo
            ? articulo.brand || product.description
            : product.tagline
      }
      meta={<StockHint product={product} />}
      price={plan.price}
      originalPrice={plan.compareAt}
      pricePrefix={product.plans.length > 1 ? "Desde" : undefined}
      formatPrice={formatCOP}
      badge={badge}
      wishlisted={favorites.includes(product.slug)}
      onWishlist={() => toggleFavorite(product.slug)}
      onAddToCart={() => add(product.slug, plan.id)}
      addAriaLabel={`Agregar ${product.name} (${planLabel(plan)}) al carrito`}
      action={
        quote ? (
          <Link to={href} className={smoothButtonVariants({ variant: "outline", className: "w-full" })}>
            Cotizar
          </Link>
        ) : !available ? (
          <Link to={href} className={smoothButtonVariants({ variant: "secondary", className: "w-full" })}>
            Avísame cuando vuelva
          </Link>
        ) : undefined
      }
    />
  );
}
