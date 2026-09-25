import { MapPin, Star } from "lucide-react";
import { CardContent, GlassFilter, LiquidCard } from "@/components/ui/liquid-glass-card";
import { Marquee } from "@/components/ui/marquee";
import { initials } from "@/data/catalog";
import type { Resena } from "@/data/resenas";

/**
 * Tarjetas de reseña en marquesina (marquee-card de 21st.dev). En vez de los
 * testimonios de ejemplo del original recibe las reseñas reales por props.
 * Sin nombre, la tarjeta titula con la ciudad; sin foto, lleva iniciales o
 * un pin de ubicación.
 */
export function MarqueeResenas({ resenas }: { resenas: Resena[] }) {
  return (
    <div>
      <GlassFilter />
      <Marquee pauseOnHover speed="slow" className="[mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
        {resenas.map((r, i) => {
          const titulo = r.nombre ?? r.ciudad ?? "Cliente";
          const sub = [r.nombre ? r.ciudad : null, r.variante, r.fecha].filter(Boolean).join(" · ");
          return (
            <LiquidCard key={`${titulo}-${r.fecha ?? i}`} className="mx-1 h-full w-72 rounded-3xl sm:w-80">
              <CardContent className="flex h-full flex-col p-6 py-0">
                <div className="mb-4 flex items-center gap-3">
                  {r.foto ? (
                    <img src={r.foto} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neb-soft text-sm font-extrabold text-neb" aria-hidden="true">
                      {r.nombre ? initials(r.nombre) : <MapPin className="h-4 w-4" />}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{titulo}</p>
                    {sub && <p className="truncate text-sm text-mute">{sub}</p>}
                  </div>
                </div>
                <blockquote className="text-[15px] leading-relaxed">«{r.texto}»</blockquote>
                {r.despues && (
                  <p className="mt-3 border-l-2 border-line-strong pl-3 text-[13.5px] leading-relaxed text-mute">
                    <span className="font-semibold text-ink">Después agregó:</span> «{r.despues}»
                  </p>
                )}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pt-4">
                  <div className="flex gap-1" role="img" aria-label={`${r.estrellas} de 5 estrellas`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className={`h-4 w-4 ${s < r.estrellas ? "fill-gold text-gold" : "text-line-strong"}`} aria-hidden="true" />
                    ))}
                  </div>
                  {r.fuente && <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-faint">{r.fuente}</span>}
                </div>
              </CardContent>
            </LiquidCard>
          );
        })}
      </Marquee>
    </div>
  );
}
