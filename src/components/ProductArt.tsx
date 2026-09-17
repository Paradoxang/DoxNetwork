import { initials, isCombo, productBySlug, type Product } from "@/data/catalog";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SmartImage } from "@/components/SmartImage";

/**
 * Miniatura de producto sin logos de terceros: el tono del producto en un
 * degradado suave, sus iniciales y una órbita fina que recuerda al isotipo.
 * Los combos muestran las iniciales de lo que incluyen, solapadas. Si el
 * producto trae `image`, la imagen se pinta encima cuando carga.
 */
export function ProductArt({
  product,
  size = "md",
  className = "",
}: {
  product: Product;
  size?: "sm" | "md" | "lg" | "wide";
  className?: string;
}) {
  const big = size === "lg";
  const small = size === "sm";
  const parts = isCombo(product)
    ? [...new Set(product.includes!.map((i) => i.slug))].map((s) => productBySlug(s)!).filter(Boolean)
    : [];

  return (
    <div
      className={`relative isolate flex ${size === "md" ? "aspect-[16/9] sm:aspect-[4/3]" : size === "wide" ? "aspect-[16/9]" : "aspect-[4/3]"} items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 20% 0%, ${product.hue}55, transparent 60%),
          radial-gradient(90% 80% at 100% 100%, ${product.hue}33, transparent 65%),
          var(--surface-2)`,
      }}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 -z-10 h-full w-full opacity-40" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="200" cy="150" rx="170" ry="44" fill="none" stroke={product.hue} strokeWidth="1.2" transform="rotate(-18 200 150)" />
      </svg>

      {/* Con imagen propia no se dibujan iniciales: se verían a través del fundido de entrada */}
      {product.image ? null : parts.length > 0 ? (
        <div className="flex items-center">
          {parts.map((p, i) => (
            <span
              key={p.slug}
              className={`flex items-center justify-center rounded-full border-2 border-[var(--surface-2)] font-extrabold tracking-[-0.02em] text-white shadow-lg ${
                big ? "h-24 w-24 text-3xl" : small ? "h-8 w-8 text-[11px]" : "h-14 w-14 text-lg"
              }`}
              style={{ background: p.hue, marginLeft: i ? (big ? -18 : small ? -8 : -12) : 0, zIndex: parts.length - i }}
            >
              {initials(p.name)}
            </span>
          ))}
        </div>
      ) : (
        <span
          className={`font-extrabold tracking-[-0.02em] ${big ? "text-[clamp(56px,9vw,96px)]" : small ? "text-[22px]" : "text-[44px]"}`}
          style={{ color: product.hue, filter: "saturate(0.85)" }}
        >
          {initials(product.name)}
        </span>
      )}

      {/* z-10: los círculos de las iniciales llevan z-index propio y se pintarían encima */}
      <SmartImage src={product.image} eager={big} className="absolute inset-0 z-10 h-full w-full object-cover" />

      {!small && (
        <span
          className={`absolute left-3 top-3 z-20 flex items-center justify-center rounded-full bg-bg/70 text-ink backdrop-blur-sm ${big ? "h-10 w-10" : "h-8 w-8"}`}
        >
          <CategoryIcon id={product.category} className={big ? "h-5 w-5" : "h-4 w-4"} />
        </span>
      )}
    </div>
  );
}
