import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated Tabs (21st.dev): la fila de pestañas existe dos veces, una normal y
 * otra rellena de nebulosa encima, recortada con clip-path a la pestaña
 * activa. Al cambiar, el recorte se desliza y el texto cambia de color justo
 * por donde pasa el borde, no de golpe. Accesible: la capa de arriba es
 * decorativa y los botones reales son los de abajo.
 */
export function AnimatedTabs({
  tabs,
  active,
  onChange,
  idBase,
  panelId,
  label,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  idBase: string;
  panelId: string;
  label: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [clip, setClip] = useState<string | undefined>();

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[active];
      const box = wrap.current;
      if (!el || !box) return;
      const l = el.offsetLeft;
      const r = box.offsetWidth - (l + el.offsetWidth);
      setClip(`inset(0 ${r}px 0 ${l}px round 999px)`);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = tabs[(i + d + tabs.length) % tabs.length];
    onChange(next.id);
    refs.current[next.id]?.focus();
  };

  const row = "flex rounded-full p-1";
  const item = "flex min-h-[40px] items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold";

  return (
    <div className="relative w-fit rounded-full border border-line">
      <div ref={wrap} role="tablist" aria-label={label} className={row}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            id={`${idBase}-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            aria-controls={panelId}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(item, "text-mute transition-colors hover:text-ink")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Copia rellena, recortada a la pestaña activa */}
      <div
        aria-hidden="true"
        className="animated-tabs-clip pointer-events-none absolute inset-0"
        style={{ clipPath: clip, visibility: clip ? "visible" : "hidden" }}
      >
        <div className={cn(row, "h-full bg-neb")}>
          {tabs.map((t) => (
            <span key={t.id} className={cn(item, "text-neb-ink")}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
