import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { alCambiarModo, modoActual } from "@/lib/perf";
import { cn } from "@/lib/utils";

/**
 * Infinite Drag + Scroll Gallery (21st.dev), a la medida de la tienda: una
 * fila que corre sola, se arrastra en las dos direcciones (mouse o dedo) con
 * inercia, responde a la rueda horizontal del trackpad y nunca se acaba.
 *
 * La lista se pinta dos veces y la posición se envuelve en el ancho de una
 * copia, así el bucle no tiene salto. La segunda copia es decorativa
 * (aria-hidden, sin tabulación). Si el arrastre movió la fila, el clic que
 * llega al soltar se descarta para no abrir un producto por accidente.
 * Con movimiento reducido no corre sola ni tiene inercia.
 */
export function InfiniteDragScroll<T>({
  items,
  getKey,
  renderItem,
  speed = 28,
  label,
  className,
  itemClassName,
}: {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, decorative: boolean) => ReactNode;
  /** Píxeles por segundo en reposo. */
  speed?: number;
  label: string;
  className?: string;
  itemClassName?: string;
}) {
  const reduced = useReducedMotion();
  // En modo ligero la fila no corre sola; arrastrarla sigue funcionando
  const pausa = useRef(modoActual() === "ligero");
  useEffect(() => alCambiarModo((m) => (pausa.current = m === "ligero")), []);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const width = useRef(0);
  const hover = useRef(false);
  const focus = useRef(false);
  const drag = useRef<{ id: number; start: number; from: number; last: number; t: number; moved: boolean } | null>(null);
  const velocity = useRef(0);
  const suppressClick = useRef(false);

  const wrap = useCallback(
    (v: number) => {
      const w = width.current;
      if (!w) return v;
      return (((v % w) + w) % w) - w;
    },
    []
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      width.current = el.scrollWidth / 2;
      x.set(wrap(x.get()));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrap, x]);

  useAnimationFrame((_, delta) => {
    if (drag.current?.moved || !width.current) return;
    const dt = Math.min(delta, 64) / 1000;
    if (Math.abs(velocity.current) > 4) {
      x.set(wrap(x.get() + velocity.current * dt));
      velocity.current *= Math.pow(0.04, dt); // inercia que se apaga en ~1 s
      return;
    }
    velocity.current = 0;
    if (reduced || pausa.current || hover.current || focus.current || drag.current) return;
    x.set(wrap(x.get() - speed * dt));
  });

  // Rueda horizontal (trackpad o shift + rueda)
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      e.preventDefault();
      velocity.current = 0;
      x.set(wrap(x.get() - dx));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [wrap, x]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    velocity.current = 0;
    suppressClick.current = false;
    drag.current = { id: e.pointerId, start: e.clientX, from: x.get(), last: e.clientX, t: performance.now(), moved: false };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.start;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const dt = Math.max(now - d.t, 1) / 1000;
    velocity.current = velocity.current * 0.6 + ((e.clientX - d.last) / dt) * 0.4;
    d.last = e.clientX;
    d.t = now;
    x.set(wrap(d.from + dx));
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (d.moved) {
      suppressClick.current = true;
      if (reduced || performance.now() - d.t > 80) velocity.current = 0;
    } else {
      velocity.current = 0;
    }
    drag.current = null;
  };

  // Al tabular hasta un producto fuera de vista, la fila lo trae
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    focus.current = true;
    const li = (e.target as HTMLElement).closest("li");
    const vp = viewport.current;
    if (!li || !vp) return;
    velocity.current = 0;
    const left = li.offsetLeft + x.get();
    if (left < 24 || left + li.offsetWidth > vp.clientWidth - 24) x.set(wrap(-(li.offsetLeft - 24)));
  };

  return (
    <div
      ref={viewport}
      role="region"
      aria-roledescription="galería"
      aria-label={label}
      className={cn("relative cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={(e) => e.pointerType === "mouse" && (hover.current = true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && (hover.current = false)}
      onFocus={onFocus}
      onBlur={() => (focus.current = false)}
      onClickCapture={(e) => {
        if (suppressClick.current) {
          e.preventDefault();
          e.stopPropagation();
          suppressClick.current = false;
        }
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      <motion.ul ref={track} className="flex w-max" style={{ x }}>
        {[0, 1].map((copy) =>
          items.map((item) => (
            <li key={`${copy}-${getKey(item)}`} aria-hidden={copy === 1 || undefined} className={itemClassName}>
              {renderItem(item, copy === 1)}
            </li>
          ))
        )}
      </motion.ul>
    </div>
  );
}
