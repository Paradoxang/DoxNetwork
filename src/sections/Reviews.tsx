import { SectionHeading } from "@/components/SectionHeading";
import { SmartImage } from "@/components/SmartImage";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { InfiniteDragScroll } from "@/components/ui/infinite-drag-scroll";
import { reviews, type Review } from "@/data/promos";

/**
 * Testimonios en cinta (brief de rediseño, fase 3: "capturas reales de
 * WhatsApp en scroll infinito"). No se pinta nada hasta que haya al menos una
 * reseña real en src/data/promos.ts: una sección de testimonios inventados
 * resta la confianza que busca ganar. Cada reseña puede llevar la captura del
 * chat en /public/reviews/ (con el nombre y el número ya tapados).
 */
export function Reviews() {
  if (reviews.length === 0) return null;
  return (
    <section className="border-y border-line bg-bg-soft py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionHeading kicker="Clientes" title="Lo que dicen de nosotros">
          Capturas reales de conversaciones, con los datos de cada persona tapados.
        </SectionHeading>
      </div>

      <InfiniteDragScroll
        label="Reseñas de clientes. Arrastra para ver más."
        items={reviews}
        getKey={(r) => `${r.name}-${r.product}`}
        speed={22}
        className="mt-10 [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]"
        itemClassName="pr-3 md:pr-4"
        renderItem={(r: Review) => (
          <figure className="card flex h-full w-[280px] flex-col gap-4 p-5 md:w-[340px]">
            <WhatsAppIcon className="h-5 w-5 text-mint" />
            {r.image && <SmartImage src={r.image} alt={`Captura del chat con ${r.name}`} className="rounded-xl border border-line" />}
            <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">{r.text}</blockquote>
            <figcaption className="text-sm">
              <span className="font-semibold">{r.name}</span>
              <span className="block text-faint">
                {r.city} · compró {r.product}
              </span>
            </figcaption>
          </figure>
        )}
      />
    </section>
  );
}
