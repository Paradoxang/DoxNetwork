import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { modoActual } from "@/lib/perf";

export const EASE = [0.16, 1, 0.3, 1] as const;

/** En el build SSG se pinta el estado final; las animaciones corren en cliente. */
export const SSR = import.meta.env.SSR;

/* ── Reveal: fade + translateY al entrar en pantalla ── */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const hidden = { opacity: 0, y };
  const shown = { opacity: 1, y: 0 };
  return (
    <motion.div
      ref={ref}
      initial={reduced || SSR ? false : hidden}
      animate={reduced || SSR || inView ? shown : hidden}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ── Magnetic: el hijo sigue sutilmente al puntero ── */
export function Magnetic({
  children,
  strength = 0.2,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Tilt: inclinación 3D suave que sigue al puntero ── */
export function Tilt({
  children,
  max = 7,
  className = "",
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 20 });
  const sry = useSpring(ry, { stiffness: 150, damping: 20 });

  if (reduced || modoActual() === "ligero") return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Lenis, conducido por el ticker de GSAP ──
   Un solo reloj para los dos: así ScrollTrigger lee la posición que Lenis
   acaba de escribir y no la del fotograma anterior. */
let lenisInstance: Lenis | null = null;

export function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Lenis reescribe la posición en cada fotograma: en equipos flojos es de lo
    // primero que hay que soltar (perf.ts)
    if (modoActual() === "ligero") return;
    const lenis = new Lenis({ duration: 1 });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

/** Pausa el scroll de la página (p. ej. con el carrito abierto). */
export function lockScroll(locked: boolean) {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Scroll programático compatible con Lenis. */
export function scrollToTarget(
  target: number | HTMLElement,
  { immediate = false, offset = -88 }: { immediate?: boolean; offset?: number } = {}
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      immediate,
      offset: typeof target === "number" ? 0 : offset,
    });
  } else if (typeof target === "number") {
    window.scrollTo(0, target);
  } else {
    target.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  }
}
