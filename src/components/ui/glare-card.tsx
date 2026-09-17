import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Glare Card (21st.dev): un reflejo holográfico que sigue al puntero, como el
 * de una lámina de cromo. Se usa en un solo sitio —el logo de Dox Designs— a
 * propósito: la regla de arte del brief permite dos movimientos firma en todo
 * el sitio y este es el guiño de la firma del estudio, no un efecto de catálogo.
 *
 * El dibujo está en CSS (index.css, .glare-card): dos capas, un brillo suave
 * y una banda de arcoíris, ambas movidas por --mx/--my. Solo reacciona al mouse.
 */
export function GlareCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.style.setProperty("--ga", "1");
  };

  return (
    <div
      ref={ref}
      className={cn("glare-card relative", className)}
      onPointerMove={move}
      onPointerLeave={() => ref.current?.style.setProperty("--ga", "0")}
    >
      {children}
    </div>
  );
}
