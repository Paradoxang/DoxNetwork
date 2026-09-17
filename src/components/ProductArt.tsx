import { initials, isCombo, logoOf, productBySlug, type Plan, type Product } from "@/data/catalog";
import { conditionInfo } from "@/data/lineas";
import { qualityInfo } from "@/data/perfumeria";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SmartImage } from "@/components/SmartImage";

type Size = "sm" | "md" | "lg" | "wide" | "square";

/**
 * Miniatura de producto. Tres formas, todas sobre el tono del producto:
 *  · con `logo`: la baldosa de la marca flota al centro con un halo de su color,
 *  · perfumería: una vitrina clara donde la foto de fondo blanco se funde
 *    (multiply) y el color de la familia olfativa queda como reflejo,
 *  · sin imagen: las iniciales y una órbita fina que recuerda al isotipo.
 * Si el producto trae `image` (combos), la imagen cubre todo al cargar.
 */
export function ProductArt({
  product,
  plan,
  size = "md",
  bare = false,
  className = "",
}: {
  product: Product;
  /** Sin las etiquetas superpuestas (la tarjeta pone las suyas). */
  bare?: boolean;
  /** En la ficha, el plan elegido puede cambiar la baldosa. */
  plan?: Plan;
  size?: Size;
  className?: string;
}) {
  if (product.perfume) return <PerfumeArt product={product} size={size} bare={bare} className={className} />;
  if (product.articulo) return <ArticuloArt product={product} size={size} bare={bare} className={className} />;

  const big = size === "lg";
  const small = size === "sm";
  const logo = logoOf(product, plan);
  const parts = isCombo(product)
    ? [...new Set(product.includes!.map((i) => i.slug))].map((s) => productBySlug(s)!).filter(Boolean)
    : [];

  return (
    <div
      className={`relative isolate flex ${size === "md" ? "aspect-[16/9] sm:aspect-[4/3]" : size === "wide" ? "aspect-[16/9]" : size === "square" ? "aspect-square" : "aspect-[4/3]"} items-center justify-center overflow-hidden ${className}`}
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

      {logo ? (
        <>
          {/* Halo del color de la marca detrás de la baldosa */}
          <span
            className="absolute left-1/2 top-1/2 -z-10 h-[70%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ background: `${product.hue}66` }}
          />
          <div
            className={`relative z-10 aspect-square transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:-rotate-3 ${
              small ? "h-[72%]" : big ? "h-[56%]" : "h-[60%]"
            }`}
            style={{ filter: `drop-shadow(0 ${small ? 6 : 18}px ${small ? 10 : 28}px rgba(6, 9, 18, 0.45))` }}
          >
            <SmartImage
              key={logo}
              src={logo}
              eager={big}
              className={`h-full w-full object-cover ${small ? "rounded-[22%]" : "rounded-[24%]"}`}
            />
          </div>
        </>
      ) : product.image ? null : parts.length > 0 ? (
        // Con imagen propia no se dibujan iniciales: se verían a través del fundido de entrada
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
      {!logo && <SmartImage src={product.image} eager={big} className="absolute inset-0 z-10 h-full w-full object-cover" />}

      {!small && !bare && (
        <span
          className={`absolute left-3 top-3 z-20 flex items-center justify-center rounded-full bg-bg/70 text-ink backdrop-blur-sm ${big ? "h-10 w-10" : "h-8 w-8"}`}
        >
          <CategoryIcon id={product.category} className={big ? "h-5 w-5" : "h-4 w-4"} />
        </span>
      )}
    </div>
  );
}

/**
 * Relojería y tecnología: las fotos del proveedor ya vienen compuestas
 * (estudio gris para relojes, piezas de producto para tecnología), así que
 * van enteras, cuadradas, sobre el tono de su subcategoría mientras cargan.
 */
function ArticuloArt({ product, size, bare, className }: { product: Product; size: Size; bare: boolean; className: string }) {
  const info = product.articulo!;
  const big = size === "lg";
  const small = size === "sm";
  const base = product.image!.replace(/\.webp$/, "");
  return (
    <div
      className={`relative isolate aspect-square overflow-hidden ${className}`}
      style={{ background: `radial-gradient(90% 70% at 50% 30%, ${product.hue}33, transparent 70%), var(--surface-2)` }}
      aria-hidden="true"
    >
      <SmartImage
        src={`${base}${small ? "-sm" : ""}.webp`}
        srcSet={small ? undefined : `${base}-sm.webp 360w, ${base}.webp 720w`}
        sizes={big ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 280px, (min-width: 640px) 45vw, 50vw"}
        eager={big}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!small && !bare && info.condition && (
        <span
          className={`absolute left-3 top-3 z-20 rounded-full bg-[#1a1712]/85 font-mono font-semibold tracking-[0.04em] text-[#f6ead2] backdrop-blur-sm ${
            big ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]"
          }`}
        >
          {conditionInfo[info.condition].label}
        </span>
      )}
    </div>
  );
}

/**
 * Vitrina de perfume. Las fotos del proveedor traen fondo blanco con cajas y
 * frascos blancos: recortarlas se come el producto. En su lugar la vitrina es
 * clara en ambos temas y la foto se multiplica sobre ella (el blanco toma el
 * color de la vitrina y las sombras quedan naturales).
 */
function PerfumeArt({ product, size, bare, className }: { product: Product; size: Size; bare: boolean; className: string }) {
  const info = product.perfume!;
  const big = size === "lg";
  const small = size === "sm";
  const base = product.image!.replace(/\.webp$/, "");

  return (
    <div
      className={`relative isolate aspect-square overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(70% 38% at 50% 96%, ${product.hue}40, transparent 75%),
          radial-gradient(120% 80% at 50% 0%, #ffffff, transparent 70%),
          linear-gradient(180deg, #f7f5f1, #ece8e1)`,
      }}
      aria-hidden="true"
    >
      <SmartImage
        src={`${base}${small ? "-sm" : ""}.webp`}
        srcSet={small ? undefined : `${base}-sm.webp 360w, ${base}.webp 720w`}
        sizes={big ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 280px, (min-width: 640px) 45vw, 50vw"}
        eager={big}
        className={
          info.photo
            ? "absolute inset-0 h-full w-full object-cover"
            : `absolute inset-0 h-full w-full object-contain mix-blend-multiply ${small ? "p-1" : "p-[6%]"}`
        }
      />
      {/* Brillo de vitrina: una línea de luz arriba y un borde interior suave */}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-30px_60px_-40px_rgba(20,16,10,0.25)]" />

      {!small && !bare && (
        <span
          className={`absolute left-3 top-3 z-20 rounded-full bg-[#1a1712]/85 font-mono font-semibold tracking-[0.04em] text-[#f6ead2] backdrop-blur-sm ${
            big ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]"
          }`}
        >
          {qualityInfo[info.quality].label}
        </span>
      )}
    </div>
  );
}
