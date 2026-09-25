import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marquesina de designali-in (21st.dev), adaptada:
 *  · la animación se llama `marquee-x`/`marquee-y` (index.css) para no pisar
 *    la `marquee` de la banda de promesas,
 *  · solo la primera copia la leen los lectores de pantalla,
 *  · se detiene con movimiento reducido y en modo ligero.
 */
interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  /** Invierte el sentido de la animación. */
  reverse?: boolean;
  /** Pausa la animación con el puntero encima. */
  pauseOnHover?: boolean;
  children: ReactNode;
  /** Vertical en vez de horizontal. */
  vertical?: boolean;
  /** Cuántas veces se repite el contenido para que la pista no se quede corta. */
  repeat?: number;
  speed?: "slow" | "normal" | "fast";
}

const speedVariants = {
  slow: "[--duration:120s]",
  normal: "[--duration:40s]",
  fast: "[--duration:10s]",
};

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 5,
  speed = "normal",
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-1 [--gap:6px] [gap:var(--gap)]",
        speedVariants[speed],
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={cn(
            "marquee-pista flex shrink-0 justify-around [gap:var(--gap)] motion-reduce:[animation-play-state:paused]",
            vertical ? "animate-marquee-y flex-col" : "animate-marquee-x flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
