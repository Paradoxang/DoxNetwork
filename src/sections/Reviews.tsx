import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SmartImage } from "@/components/SmartImage";
import { reviews } from "@/data/promos";
import { Reveal } from "@/lib/anim";

/**
 * Reseñas reales. No se pinta nada hasta que haya al menos una en
 * src/data/promos.ts: una sección de testimonios inventados resta confianza.
 */
export function Reviews() {
  if (reviews.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <SectionHeading kicker="Clientes" title="Lo que dicen de nosotros" />
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {reviews.map((r, i) => (
          <li key={`${r.name}-${i}`}>
            <Reveal delay={i * 0.06} className="card flex h-full flex-col gap-4 p-6">
              <Quote className="h-6 w-6 text-neb" />
              {r.image && <SmartImage src={r.image} alt={`Captura de ${r.name}`} className="rounded-xl" />}
              <p className="flex-1 leading-relaxed text-ink">{r.text}</p>
              <p className="text-sm">
                <span className="font-bold">{r.name}</span> <span className="text-faint">· {r.city} · compró {r.product}</span>
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
