import { Star } from "lucide-react";
import { CardContent, GlassFilter, LiquidCard } from "@/components/ui/liquid-glass-card";
import { Marquee } from "@/components/ui/marquee";
import { initials } from "@/data/catalog";
import type { Resena } from "@/data/resenas";

/**
 * Tarjetas de reseña en marquesina (marquee-card de 21st.dev). En vez de los
 * testimonios de ejemplo del original recibe las reseñas reales por props.
 * Sin foto, la persona sale con sus iniciales.
 */
export function MarqueeResenas({ resenas }: { resenas: Resena[] }) {
  return (
    <div>
      <GlassFilter />
      <Marquee pauseOnHover speed="slow" className="[mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
        {resenas.map((r, i) => (
          <LiquidCard key={`${r.nombre}-${i}`} className="mx-1 h-full w-72 rounded-3xl sm:w-80">
            <CardContent className="flex h-full flex-col p-6 py-0">
              <div className="mb-4 flex items-center gap-3">
                {r.foto ? (
                  <img src={r.foto} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neb-soft text-sm font-extrabold text-neb" aria-hidden="true">
                    {initials(r.nombre)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.nombre}</p>
                  {(r.detalle || r.fuente) && (
                    <p className="truncate text-sm text-mute">{[r.detalle, r.fuente].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
              </div>
              <blockquote className="mb-3 flex-1 text-[15px] leading-relaxed">{r.texto}</blockquote>
              <div className="flex gap-1" role="img" aria-label={`${r.estrellas} de 5 estrellas`}>
                {Array.from({ length: 5 }, (_, s) => (
                  <Star key={s} className={`h-4 w-4 ${s < r.estrellas ? "fill-gold text-gold" : "text-line-strong"}`} aria-hidden="true" />
                ))}
              </div>
            </CardContent>
          </LiquidCard>
        ))}
      </Marquee>
    </div>
  );
}
