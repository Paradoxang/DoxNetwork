import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site, waLink } from "@/data/site";
import { Magnetic, Reveal } from "@/lib/anim";

export function Cta() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <Reveal className="card relative overflow-hidden p-8 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "var(--mint-soft)" }}
          />
          <p className="kicker">¿No lo encuentras?</p>
          <h2 className="display mt-3 max-w-lg text-[clamp(28px,4vw,42px)]">Pídelo y te lo conseguimos</h2>
          <p className="mt-4 max-w-md text-mute">
            Si buscas una plataforma, licencia o recarga que no está en el catálogo, escríbenos y te cotizamos.
          </p>
          <Magnetic className="mt-8">
            <a
              href={waLink(`Hola ${site.name}, estoy buscando un producto que no vi en el catálogo:`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-buy"
            >
              <WhatsAppIcon /> Escribir por WhatsApp
            </a>
          </Magnetic>
      </Reveal>
    </section>
  );
}
