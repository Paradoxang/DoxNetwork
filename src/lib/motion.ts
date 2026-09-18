import { useEffect, type RefObject } from "react";

/**
 * GSAP a la carta.
 *
 * GSAP con ScrollTrigger y SplitText pesa unos 60 KB comprimidos y todo lo que
 * hace en esta tienda es decorativo: el titular que sube palabra a palabra, los
 * halos con paralaje, la entrada en ola de las rejillas. Nada de eso debe
 * retrasar la primera pintura ni competir con la hidratación en un móvil de
 * gama media, así que la librería sale del paquete principal y se pide cuando
 * el hilo respira.
 *
 * Uso: igual que `useGSAP`, pero la función recibe el `gsap` ya cargado.
 *
 *   useAnimacion(({ gsap }) => { ... }, { scope, deps: [linea] });
 *
 * La limpieza va por `gsap.context`, así que cada sección revierte lo suyo al
 * desmontarse o al cambiar sus dependencias, igual que antes.
 */
type Gsap = typeof import("gsap")["gsap"];
type Modulo = typeof import("@/lib/gsap");

let promesa: Promise<Modulo> | null = null;

/** Carga (una sola vez) GSAP y sus plugins ya registrados. */
export function cargarGsap(): Promise<Modulo> {
  promesa ??= import("@/lib/gsap");
  return promesa;
}

/** ¿Ya está en memoria? Lo usa Lenis para engancharse a ScrollTrigger sin forzar la carga. */
export const gsapListo = () => promesa;

const cuandoRespire = (fn: () => void) => {
  const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
  return idle(fn) as number;
};

export function useAnimacion(
  setup: (api: { gsap: Gsap; ScrollTrigger: Modulo["ScrollTrigger"]; SplitText: Modulo["SplitText"] }) => void,
  { scope, deps = [] }: { scope?: RefObject<HTMLElement | null>; deps?: unknown[] } = {}
) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // El modo ligero apaga el movimiento decorativo: ni siquiera se descarga
    if (document.documentElement.dataset.perf === "ligero") return;

    let vivo = true;
    let ctx: { revert: () => void } | undefined;
    const id = cuandoRespire(async () => {
      const mod = await cargarGsap();
      if (!vivo) return;
      ctx = mod.gsap.context(() => setup(mod), scope?.current ?? undefined);
    });

    return () => {
      vivo = false;
      (window.cancelIdleCallback ?? window.clearTimeout)(id);
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
