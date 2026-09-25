import { Star } from "lucide-react";
import { MarqueeResenas } from "@/components/ui/marquee-card";
import { resenasDe, type LineaResenas } from "@/data/resenas";
import { Reveal } from "@/lib/anim";

const nombreLinea: Record<LineaResenas, string> = {
  perfumeria: "nuestra perfumería",
  relojeria: "nuestra relojería",
  vapes: "nuestros vapes",
  mascotas: "nuestros productos para mascotas",
};

/**
 * Contenedor de reseñas de una ficha (perfumes, relojes, vapes y el
 * comedero). No pinta nada mientras no haya reseñas reales en
 * src/data/resenas.ts: una sección de testimonios vacía o inventada resta la
 * confianza que busca ganar.
 */
export function ResenasProducto({ slug, linea }: { slug: string; linea: LineaResenas }) {
  const { lista, alcance } = resenasDe(slug, linea);
  if (!lista.length) return null;
  const promedio = lista.reduce((n, r) => n + r.estrellas, 0) / lista.length;

  return (
    <section aria-labelledby={`resenas-${slug}`} className="border-t border-line py-16">
      <Reveal className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-4 px-4 md:px-6">
        <div>
          <p className="kicker">Reseñas</p>
          <h2 id={`resenas-${slug}`} className="display mt-3 text-[clamp(24px,3vw,32px)]">
            {alcance === "producto" ? "Lo que dicen quienes lo compraron" : `Lo que dicen de ${nombreLinea[linea]}`}
          </h2>
        </div>
        <div className="text-sm text-mute sm:text-right">
          <p className="flex items-center gap-2 sm:justify-end">
            <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
            <span className="num font-semibold text-ink">{promedio.toFixed(1).replace(".", ",")}</span> de 5 ·{" "}
            {lista.length} {lista.length === 1 ? "reseña" : "reseñas"}
          </p>
          {/* Transparencia: si vienen del proveedor, se dice arriba y en cada tarjeta */}
          {lista.some((r) => r.fuente) && (
            <p className="mt-1 text-xs text-faint">Reseñas de clientes de nuestro proveedor, del mismo producto, copiadas tal cual.</p>
          )}
        </div>
      </Reveal>
      <div className="mt-8">
        <MarqueeResenas resenas={lista} />
      </div>
    </section>
  );
}
