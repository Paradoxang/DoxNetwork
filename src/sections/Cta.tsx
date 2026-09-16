import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoDN } from "@/components/LogoDN";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site, waLink } from "@/data/site";
import { Magnetic, Reveal } from "@/lib/anim";

export function Cta() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
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

        {/* Venta cruzada con Dox Designs, discreta */}
        <Reveal delay={0.08}>
          <Link
            to="/producto/pagina-web-dox-designs"
            className="card card-hover group flex h-full flex-col justify-between gap-6 p-8"
          >
            <div className="flex items-center justify-between">
              <LogoDN className="h-8 w-auto opacity-90" />
              <ArrowUpRight className="h-5 w-5 text-faint transition-colors group-hover:text-neb" />
            </div>
            <div>
              <p className="kicker">Hecho por Dox Designs</p>
              <p className="mt-3 text-xl font-bold">¿Quieres una tienda como esta?</p>
              <p className="mt-2 text-sm text-mute">Diseñamos y desarrollamos tu página web a la medida.</p>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
