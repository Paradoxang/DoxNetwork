import { useEffect, useRef, useState } from "react";
import { modoActual } from "@/lib/perf";

/**
 * Number Ticker (21st.dev): la cifra cuenta desde cero la primera vez que
 * entra en pantalla. El texto renderizado en el servidor ya trae el número
 * final, así que sin JS —o con movimiento reducido— se lee igual de bien.
 */
export function NumberTicker({ value, duration = 1100, className = "" }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || modoActual() === "ligero") return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          // Desaceleración: rápido al principio, se asienta en la cifra real
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        setN(0);
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`num tabular-nums ${className}`}>
      {n.toLocaleString("es-CO")}
    </span>
  );
}
