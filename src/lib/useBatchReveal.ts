import type { RefObject } from "react";
import { useAnimacion } from "@/lib/motion";

/**
 * Revelado escalonado por scroll con ScrollTrigger.batch: los elementos que
 * entran juntos en pantalla aparecen en ola (preset "Stagger List / Standard"
 * de UI UX Pro Max, con el rebote rebajado para una tienda).
 *
 * Solo se usa donde Framer no gobierna el mismo nodo (el catálogo filtrable
 * lo anima Framer con `layout`, así que ahí no).
 */
export function useBatchReveal(scope: RefObject<HTMLElement>, selector = "[data-reveal]") {
  useAnimacion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(selector, scope.current);
        if (!items.length) return;
        gsap.set(items, { autoAlpha: 0, y: 22, scale: 0.97 });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.07,
              ease: "back.out(1.2)",
              overwrite: true,
            }),
        });
      });
    },
    { scope }
  );
}
