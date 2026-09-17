import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { glowHandlers } from "@/components/ui/glowing-effect";
import SmoothButton from "@/components/ui/smooth-button";
import { Tilt } from "@/lib/anim";
import { cn } from "@/lib/utils";

/*
 * Tarjeta de producto de 21st.dev, adaptada a DoxNetwork:
 *  · `motion/react` → `framer-motion` (es la misma librería; el proyecto ya
 *    la usa y no se carga dos veces),
 *  · `media` en vez de `image`: la miniatura la pinta quien usa la tarjeta
 *    (baldosas de logo, vitrina de perfumes, iniciales),
 *  · favorito controlado desde fuera (vive en el carrito, no en la tarjeta),
 *  · el título es un enlace que cubre toda la tarjeta; corazón y botón quedan
 *    encima con z-10,
 *  · textos en español, precio con formato inyectado y tokens de la tienda,
 *  · `action` reemplaza el botón cuando no se puede agregar (cotizar, agotado),
 *  · las estrellas siguen disponibles, pero la tienda no las pasa hasta tener
 *    reseñas reales.
 */

export interface ProductCardProps {
  media: ReactNode;
  title: string;
  href: string;
  kicker?: string;
  subtitle?: string;
  /** Debajo del subtítulo: escasez, avisos. */
  meta?: ReactNode;
  price: number;
  originalPrice?: number;
  /** "Desde" cuando hay varios planes. */
  pricePrefix?: string;
  formatPrice?: (n: number) => string;
  badge?: { label: string; tone?: "sale" | "new" | "popular" | "muted" | "dark" };
  /** Original o réplica: va bajo el nombre, con el peso de lo segundo que se lee. */
  condition?: { label: string; tone: "original" | "replica"; note?: string };
  rating?: number;
  wishlisted?: boolean;
  onWishlist?: () => void;
  onAddToCart?: () => void;
  addLabel?: string;
  addedLabel?: string;
  addAriaLabel?: string;
  /** Sustituye al botón de agregar. */
  action?: ReactNode;
  className?: string;
}

/* ─────────────────────────────────────────────────────────
 * STORYBOARD
 *
 *    0ms   la tarjeta entra en pantalla → sube y escala
 *  250ms   la etiqueta aparece con resorte
 *  hover   la imagen se acerca 1.05 y aparece el corazón
 *  clic    el botón rebota y el ícono cambia a check
 * ───────────────────────────────────────────────────────── */

const SPRING = { bounce: 0.1, duration: 0.25, type: "spring" as const };
const SPRING_BOUNCY = { bounce: 0.2, duration: 0.3, type: "spring" as const };
const SSR = import.meta.env.SSR;

const STAR_PATH =
  "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z";

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  const id = useId();
  if (half) {
    const gradientId = `half-star-${id}`;
    return (
      <svg aria-hidden="true" className="h-3.5 w-3.5 text-gold" viewBox="0 0 24 24">
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path d={STAR_PATH} fill={`url(#${gradientId})`} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className={cn("h-3.5 w-3.5", filled ? "text-gold" : "text-faint/40")}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      viewBox="0 0 24 24"
    >
      <path d={STAR_PATH} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-4 w-4", filled ? "text-[#f06a8a]" : "text-ink")}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      viewBox="0 0 24 24"
    >
      <path
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RatingStars({ rating, title }: { rating: number; title: string }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const roundedUp = rating - fullStars >= 0.75;
  return (
    <div aria-label={`${rating} de 5 estrellas`} className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon filled={i < fullStars || (roundedUp && i === fullStars)} half={hasHalf && i === fullStars} key={`star-${title}-${i}`} />
      ))}
      <span className="ml-1 text-xs font-medium text-mute">{rating}</span>
    </div>
  );
}

const badgeTone = {
  sale: "bg-gold text-gold-ink",
  new: "bg-mint text-mint-ink",
  popular: "bg-neb text-neb-ink",
  muted: "bg-surface-2 text-mute",
  dark: "bg-[#1a1712]/85 text-[#f6ead2] backdrop-blur-sm",
};

const defaultFormat = (n: number) => "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function ProductCard({
  media,
  title,
  href,
  kicker,
  subtitle,
  meta,
  price,
  originalPrice,
  pricePrefix,
  formatPrice = defaultFormat,
  badge,
  condition,
  rating,
  wishlisted = false,
  onWishlist,
  onAddToCart,
  addLabel = "Agregar",
  addedLabel = "Agregado",
  addAriaLabel,
  action,
  className,
}: ProductCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  // En el prerender no hay viewport: la tarjeta sale visible y la entrada solo corre en el navegador
  const animateIn = !shouldReduceMotion && !SSR;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isAdded) return;
    const t = window.setTimeout(() => setIsAdded(false), 2000);
    return () => window.clearTimeout(t);
  }, [isAdded]);

  const handleAddToCart = () => {
    setIsAdded(true);
    onAddToCart?.();
  };

  const hasDiscount = originalPrice !== undefined && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Las dos firmas del sitio: tilt 3D sutil (nodo exterior) y borde luminoso (la tarjeta).
  // Nodos distintos para no pelear por el mismo transform con la entrada.
  return (
    <Tilt max={4} className="h-full">
    <motion.article
      {...glowHandlers}
      aria-label={`${title}, ${pricePrefix ? `${pricePrefix.toLowerCase()} ` : ""}${formatPrice(price)}`}
      className={cn(
        "glow-border group relative flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-line bg-surface shadow-sm",
        "transition-[box-shadow,border-color] duration-300",
        isHoverDevice && "hover:border-line-strong hover:shadow-xl hover:shadow-black/20",
        className
      )}
      initial={animateIn ? { opacity: 0, transform: "translateY(20px) scale(0.97)" } : false}
      transition={shouldReduceMotion ? { duration: 0 } : SPRING}
      viewport={{ margin: "-50px", once: true }}
      whileInView={animateIn ? { opacity: 1, transform: "translateY(0px) scale(1)" } : undefined}
    >
      {/* Imagen a sangre */}
      <div className="relative overflow-hidden">
        {/* El acercamiento al pasar el puntero lo hace el lecho de imagen (.product-media-img) */}
        {media}

        {/* Degradado al pasar el puntero */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-300",
            isHoverDevice && "group-hover:opacity-100"
          )}
        />

        {badge ? (
          <motion.span
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, transform: "scale(1)" }}
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.04em] shadow-sm",
              badgeTone[badge.tone ?? "popular"]
            )}
            initial={animateIn ? { opacity: 0, transform: "scale(0.6)" } : false}
            transition={shouldReduceMotion ? { duration: 0 } : { ...SPRING_BOUNCY, delay: 0.25 }}
          >
            {badge.label}
          </motion.span>
        ) : null}

        {onWishlist && (
          <motion.button
            aria-label={wishlisted ? `Quitar ${title} de favoritos` : `Guardar ${title} en favoritos`}
            aria-pressed={wishlisted}
            className={cn(
              "absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-bg/80 backdrop-blur-sm",
              "transition-[opacity,background-color] duration-150 focus-visible:opacity-100",
              isHoverDevice && !wishlisted ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            )}
            onClick={onWishlist}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.85, transition: { duration: 0.1 } }}
          >
            <HeartIcon filled={wishlisted} />
          </motion.button>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        {kicker && <span className="truncate font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-faint">{kicker}</span>}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[17px]">
          {/* El enlace cubre toda la tarjeta con ::after; corazón y botón van por encima */}
          <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[18px] focus-visible:after:outline-2 focus-visible:after:outline-neb">
            {title}
          </Link>
        </h3>
        {condition && (
          <p
            className={cn(
              "flex w-fit max-w-full items-center gap-1.5 rounded-md border px-2 py-1 text-[12.5px] font-semibold leading-none",
              condition.tone === "original" ? "border-mint/40 bg-mint-soft text-mint" : "border-gold/40 bg-gold-soft text-gold"
            )}
          >
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", condition.tone === "original" ? "bg-mint" : "bg-gold")} />
            <span className="truncate">
              {condition.label}
              {condition.note && <span className="font-medium opacity-80"> · {condition.note}</span>}
            </span>
          </p>
        )}
        {subtitle && <p className="line-clamp-1 text-[13px] text-mute">{subtitle}</p>}
        {meta}
        {rating !== undefined && <RatingStars rating={rating} title={title} />}

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {pricePrefix && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{pricePrefix}</span>}
          <span className="num text-lg font-semibold text-ink sm:text-xl">{formatPrice(price)}</span>
          {hasDiscount ? (
            <>
              <span className="num text-[13px] text-faint line-through">{formatPrice(originalPrice)}</span>
              <span className="num rounded-md bg-gold-soft px-1.5 py-0.5 text-xs font-semibold text-gold">-{discountPercent}%</span>
            </>
          ) : null}
        </div>

        <div className="relative z-10 mt-auto pt-2">
          {action ?? (
            <SmoothButton
              aria-label={addAriaLabel ?? `Agregar ${title} al carrito`}
              className={cn("w-full gap-2", isAdded && "from-mint to-mint text-mint-ink [text-shadow:none] hover:from-mint hover:to-mint")}
              disabled={isAdded}
              onClick={handleAddToCart}
              variant="candy"
            >
              <AnimatePresence initial={false} mode="wait">
                {isAdded ? (
                  <motion.span
                    animate={{ opacity: 1, transform: "scale(1)" }}
                    className="flex items-center gap-2"
                    exit={{ opacity: 0, transform: "scale(0.8)" }}
                    initial={{ opacity: 0, transform: "scale(0.8)" }}
                    key="added"
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
                  >
                    <CheckIcon /> {addedLabel}
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{ opacity: 1, transform: "scale(1)" }}
                    className="flex items-center gap-2"
                    exit={{ opacity: 0, transform: "scale(0.8)" }}
                    initial={{ opacity: 0, transform: "scale(0.8)" }}
                    key="cart"
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
                  >
                    <CartIcon /> {addLabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </SmoothButton>
          )}
        </div>
      </div>
    </motion.article>
    </Tilt>
  );
}
