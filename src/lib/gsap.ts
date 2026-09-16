import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Registro único de GSAP.
 *
 * Mismo reparto que en el portafolio: GSAP se ocupa de las coreografías
 * (entrada del hero, trazo del logo, revelados por scroll) y Framer Motion de
 * lo que depende del estado de React (carrito, filtros, acordeones, toasts).
 * Nunca escriben el mismo `transform` sobre el mismo nodo.
 *
 * El guard existe porque el prerenderizado corre en Node y los plugins tocan
 * el DOM.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger, SplitText);
}

export { gsap, useGSAP, ScrollTrigger, SplitText };
