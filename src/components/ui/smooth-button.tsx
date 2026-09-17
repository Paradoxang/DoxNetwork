import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Botón de educalvolpz/smooth-button, adaptado a DoxNetwork:
 *  · colores con los tokens de la tienda (neb, surface, ink…) en vez de los de
 *    shadcn (primary, accent…), que este proyecto no define,
 *  · sin `asChild` ni @radix-ui/react-slot: para un enlace con esta forma se
 *    usa `smoothButtonVariants` directamente en el <Link>,
 *  · "candy" toma su degradado de --brand / --brand-secondary (index.css).
 */
const smoothButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold text-sm transition-[transform,background-color,color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neb active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-neb text-neb-ink hover:brightness-110",
        outline: "border border-line-strong bg-transparent text-ink hover:bg-surface-2",
        secondary: "bg-surface-2 text-ink hover:bg-line",
        ghost: "text-mute hover:bg-surface-2 hover:text-ink",
        link: "text-neb underline-offset-4 hover:underline",
        candy:
          "border-[0.5px] border-white/25 bg-gradient-to-b from-brand to-brand-secondary text-white shadow-md shadow-black/20 ring-1 ring-[color-mix(in_oklab,var(--ink)_15%,var(--brand))] [text-shadow:0_1px_1px_rgba(0,0,0,0.25)] hover:from-brand-secondary hover:to-brand-secondary [&_svg]:drop-shadow-sm",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Sin `ref` como prop: en React 18 no llega a los componentes de función.
export type SmoothButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof smoothButtonVariants>;

function SmoothButton({ className, variant, size, ...props }: SmoothButtonProps) {
  return <button className={cn(smoothButtonVariants({ variant, size, className }))} {...props} />;
}

export default SmoothButton;
export { smoothButtonVariants };
