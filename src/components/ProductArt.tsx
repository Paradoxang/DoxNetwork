import { initials, isCombo, logoOf, productBySlug, type Plan, type Product } from "@/data/catalog";
import { conditionInfo } from "@/data/lineas";
import { qualityInfo } from "@/data/perfumeria";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SmartImage } from "@/components/SmartImage";

type Size = "sm" | "md" | "lg" | "wide" | "square";

const aspect: Record<Size, string> = {
  sm: "aspect-[4/3]",
  md: "aspect-[16/9] sm:aspect-[4/3]",
  lg: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  square: "aspect-square",
};

/**
 * Miniatura de producto con un lecho común (brief de rediseño, "Tratamiento
 * de imagen de producto"): el mismo fondo radial violeta, la misma viñeta y el
 * mismo margen para todo, así un logo plano, un frasco y una foto de
 * marketplace dejan de pelearse en la misma fila.
 *
 *  · foto de producto → contenida y con esquinas suaves,
 *  · logo de plataforma → baldosa con más aire que un frasco,
 *  · combo con arte propio → a sangre (ya está hecho para ese fondo),
 *  · sin imagen → iniciales en el tono del producto.
 */
export function ProductArt({
  product,
  plan,
  size = "md",
  bare = false,
  className = "",
}: {
  product: Product;
  /** En la ficha, el plan elegido puede cambiar la baldosa. */
  plan?: Plan;
  size?: Size;
  /** Sin las etiquetas superpuestas (la tarjeta pone las suyas). */
  bare?: boolean;
  className?: string;
}) {
  const big = size === "lg";
  const small = size === "sm";
  const logo = logoOf(product, plan);
  const physical = Boolean(product.perfume || product.articulo);
  const parts = isCombo(product)
    ? [...new Set(product.includes!.map((i) => i.slug))].map((s) => productBySlug(s)!).filter(Boolean)
    : [];

  const src = physical ? product.image! : undefined;
  const base = src?.replace(/\.webp$/, "");
  const sizes = big ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 280px, (min-width: 640px) 45vw, 50vw";

  const label = product.perfume
    ? qualityInfo[product.perfume.quality].label
    : product.articulo?.condition
      ? conditionInfo[product.articulo.condition].label
      : undefined;

  return (
    <div className={`product-media ${physical ? "aspect-square" : aspect[size]} ${className}`} aria-hidden="true">
      {src ? (
        // Margen óptico: la foto respira dentro del lecho
        <div className="absolute inset-0 z-[1]" style={{ padding: small ? "6%" : "12%" }}>
          <SmartImage
            src={`${base}${small ? "-sm" : ""}.webp`}
            srcSet={small ? undefined : `${base}-sm.webp 360w, ${base}.webp 720w`}
            sizes={sizes}
            eager={big}
            className="product-media-img h-full w-full rounded-[10px] object-contain"
          />
        </div>
      ) : logo ? (
        <div className={`relative z-[1] aspect-square ${small ? "h-[64%]" : "h-[56%]"}`}>
          <span className="absolute inset-[-18%] -z-10 rounded-full opacity-60 blur-2xl" style={{ background: `${product.hue}55` }} />
          <SmartImage
            key={logo}
            src={logo}
            eager={big}
            className={`product-media-img h-full w-full object-cover ${small ? "rounded-[22%]" : "rounded-[24%]"}`}
          />
        </div>
      ) : product.image ? (
        <SmartImage src={product.image} eager={big} className="product-media-img absolute inset-0 z-[1] h-full w-full object-cover" />
      ) : parts.length > 0 ? (
        <div className="relative z-[1] flex items-center">
          {parts.map((p, i) => (
            <span
              key={p.slug}
              className={`flex items-center justify-center rounded-full border-2 border-[var(--media-bed)] font-extrabold tracking-[-0.02em] text-white shadow-lg ${
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
          className={`relative z-[1] font-display font-bold tracking-[-0.02em] ${big ? "text-[clamp(56px,9vw,96px)]" : small ? "text-[22px]" : "text-[44px]"}`}
          style={{ color: product.hue }}
        >
          {initials(product.name)}
        </span>
      )}

      {!small && !bare && label && (
        <span
          className={`absolute left-3 top-3 z-20 rounded-full bg-[#1a1712]/85 font-mono font-semibold tracking-[0.04em] text-[#f6ead2] backdrop-blur-sm ${
            big ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]"
          }`}
        >
          {label}
        </span>
      )}
      {!small && !bare && !label && !physical && (
        <span
          className={`absolute left-3 top-3 z-20 flex items-center justify-center rounded-full bg-bg/70 text-ink backdrop-blur-sm ${big ? "h-10 w-10" : "h-8 w-8"}`}
        >
          <CategoryIcon id={product.category} className={big ? "h-5 w-5" : "h-4 w-4"} />
        </span>
      )}
    </div>
  );
}
