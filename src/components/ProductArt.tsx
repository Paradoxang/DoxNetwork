import { initials, type Product } from "@/data/catalog";
import { CategoryIcon } from "@/components/CategoryIcon";

/**
 * Miniatura de producto sin logos de terceros: el tono del producto en un
 * degradado suave, sus iniciales en Kenney y una órbita fina que recuerda a
 * los anillos del isotipo. Si más adelante hay imágenes propias, este es el
 * único sitio que hay que tocar.
 */
export function ProductArt({
  product,
  size = "md",
  className = "",
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const big = size === "lg";
  return (
    <div
      className={`relative isolate flex ${size === "md" ? "aspect-[16/9] sm:aspect-[4/3]" : "aspect-[4/3]"} items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 20% 0%, ${product.hue}55, transparent 60%),
          radial-gradient(90% 80% at 100% 100%, ${product.hue}33, transparent 65%),
          var(--surface-2)`,
      }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 -z-10 h-full w-full opacity-40"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse
          cx="200"
          cy="150"
          rx="170"
          ry="44"
          fill="none"
          stroke={product.hue}
          strokeWidth="1.2"
          transform="rotate(-18 200 150)"
        />
      </svg>
      <span
        className={`font-extrabold tracking-[-0.02em] ${
          big ? "text-[clamp(56px,9vw,96px)]" : size === "sm" ? "text-[22px]" : "text-[44px]"
        }`}
        style={{ color: product.hue, filter: "saturate(0.85)" }}
      >
        {initials(product.name)}
      </span>
      {size !== "sm" && (
      <span
        className={`absolute left-3 top-3 flex items-center justify-center rounded-full bg-bg/70 text-ink backdrop-blur-sm ${big ? "h-10 w-10" : "h-8 w-8"}`}
      >
        <CategoryIcon id={product.category} className={big ? "h-5 w-5" : "h-4 w-4"} />
      </span>
      )}
    </div>
  );
}
