import type { PointerEvent } from "react";

/**
 * Glowing Effect (21st.dev, @manuarora700), reducido a lo esencial: un borde
 * que se enciende alrededor del cursor. Es una de las dos firmas de movimiento
 * del sitio (la otra es el tilt de las tarjetas, lib/anim.tsx).
 *
 * Uso: clase `glow-border` en el elemento (necesita `position: relative` y
 * `border-radius`) y `{...glowHandlers}` en sus props. El dibujo está en CSS
 * (index.css): un gradiente radial en la posición del puntero, recortado con
 * una máscara para que solo pinte el borde. Solo reacciona al mouse.
 */
export const glowHandlers = {
  onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
    el.style.setProperty("--ga", "1");
  },
  onPointerLeave(e: PointerEvent<HTMLElement>) {
    e.currentTarget.style.setProperty("--ga", "0");
  },
};
