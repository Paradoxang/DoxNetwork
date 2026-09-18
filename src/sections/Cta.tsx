import { Astro } from "@/components/Astro";
import { Deco } from "@/components/Deco";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site, waLink } from "@/data/site";
import { Reveal } from "@/lib/anim";

/**
 * Cierre de la página, como segunda franja invertida (dorado sobre texto
 * oscuro). La primera es la garantía en menta: entre las dos parten el navy
 * continuo en tres tramos y el final de la página deja de desvanecerse.
 */
export function Cta() {
  return (
    <section className="slant relative isolate overflow-hidden bg-gold text-gold-ink">
      <Deco name="llave" className="-left-12 -top-14 w-44 md:w-64" opacity={0.22} rotate={-18} />
      <Deco name="obj-bolsa" className="right-[30%] -top-6 hidden w-48 xl:block" opacity={0.85} rotate={8} float fade={false} />

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-6 md:py-20 2xl:pr-56">
        <Reveal>
          <p className="kicker text-gold-ink/70">¿No lo encuentras?</p>
          <h2 className="display mt-3 max-w-xl text-[clamp(30px,4.4vw,52px)] text-gold-ink">Pídelo y te lo conseguimos</h2>
          <p className="mt-4 max-w-md leading-relaxed text-gold-ink/80">
            Si buscas una plataforma, una licencia, una fragancia o un servicio que no está en la tienda, escríbenos y te cotizamos.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="shrink-0">
          <a
            href={waLink(`Hola ${site.name}, estoy buscando un producto que no vi en el catálogo:`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-gold-ink px-6 font-bold text-gold transition-transform hover:brightness-110"
          >
            <WhatsAppIcon /> Escribir por WhatsApp
          </a>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-gold-ink/65">
            Te responde una persona · {site.hours.replace(/\.$/, "")}
          </p>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute -bottom-2 right-2 hidden h-52 2xl:block">
        <Astro pose="soporte" decorative className="h-full" />
      </div>
    </section>
  );
}
