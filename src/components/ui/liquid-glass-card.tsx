import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Tarjeta de cristal líquido de designali-in (21st.dev), con los tokens de la
 * marca (ink, mute, surface, line) en lugar de los de shadcn.
 *
 * El cristal es un `backdrop-filter` con un filtro SVG (`#container-glass`):
 * solo lo pintan los navegadores Chromium; en el resto la tarjeta queda
 * transparente con su borde y su sombra, y se lee igual. `GlassFilter` se
 * monta UNA vez por sección, no una por tarjeta: el original repetía el
 * mismo id en cada copia de la marquesina.
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("flex flex-col gap-6 rounded-xl border border-line bg-surface py-6 text-ink", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("font-semibold leading-none", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-sm text-mute", className)} {...props} />;
}

export function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props} />;
}

export function LiquidCard({ className, style, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      data-cristal
      style={{ backdropFilter: 'url("#container-glass")', ...style }}
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-line bg-transparent py-6 text-ink transition-all shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] [[data-theme=dark]_&]:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]",
        className
      )}
      {...props}
    />
  );
}

/** El filtro SVG del cristal. Va una sola vez en la sección que usa `LiquidCard`. */
export function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          {/* Ruido turbulento para la distorsión */}
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.02" numOctaves="1" seed="1" result="turbulence" />
          {/* Se suaviza un poco el ruido */}
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          {/* Desplaza lo que hay detrás con el ruido */}
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="120" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          {/* Desenfoque final */}
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
