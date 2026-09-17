import { BellRing, RefreshCcw, ShieldCheck } from "lucide-react";
import { Astro } from "@/components/Astro";
import { Deco } from "@/components/Deco";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site, waLink } from "@/data/site";
import { Reveal } from "@/lib/anim";

/**
 * Garantía escrita: lo que ningún competidor pone en su web y lo que, según
 * los estudios, decide al cliente que ya se quemó en otra tienda.
 * TODO: publica solo lo que puedas cumplir (site.warrantyHours).
 *
 * Va como franja invertida a sangre (menta sobre texto oscuro) y con la cifra
 * de reposición a tamaño de titular: es la idea del brief de inspiración, que
 * una sola cifra cargue con la promesa. Rompe el navy continuo de la página
 * sin añadir ninguna animación.
 */
const items = [
  {
    icon: RefreshCcw,
    title: `Reposición en menos de ${site.warrantyHours} h`,
    text: "Si tu cuenta, perfil o código digital falla durante la vigencia, te damos uno nuevo sin costo.",
  },
  {
    icon: BellRing,
    title: "Productos físicos, sin sorpresas",
    text: "Antes de pagar te confirmamos por escrito disponibilidad, envío y garantía. Nada se renueva ni se cobra solo.",
  },
  {
    icon: WhatsAppIcon,
    title: "Soporte con personas",
    text: `Te atiende alguien de verdad por WhatsApp, ${site.hours.replace(/\.$/, "")}.`,
  },
];

export function Guarantee() {
  return (
    <section id="garantia" className="relative isolate overflow-hidden border-y border-mint-ink/10 bg-mint text-mint-ink">
      <Deco name="escudo" className="-right-16 -top-10 w-72 md:w-[420px]" opacity={0.16} />

      <div className="relative mx-auto grid max-w-[1200px] gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_1.05fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="kicker text-mint-ink/70">05 · Garantía</p>
          <div className="mt-4 flex items-end gap-4">
            <span className="display text-[clamp(84px,13vw,176px)] leading-[0.82] text-mint-ink">{site.warrantyHours}</span>
            <span className="mb-3 font-mono text-2xl font-bold tracking-tight md:mb-5 md:text-3xl">H</span>
            <span className="mb-4 max-w-[180px] text-sm font-semibold uppercase leading-tight tracking-[0.08em] text-mint-ink/75 md:mb-6">
              Reposición digital, por escrito
            </span>
          </div>
          <h2 className="display mt-6 text-[clamp(26px,3.4vw,40px)] text-mint-ink">Compras con respaldo</h2>
          <p className="mt-3 max-w-md leading-relaxed text-mint-ink/80">
            Lo digital tiene reposición por escrito durante toda la vigencia. En perfumes, relojes y tecnología te confirmamos la
            garantía de tu producto antes de que pagues.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href={waLink(`Hola ${site.name}, tengo un problema con mi pedido. Mi número de pedido es:`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-mint-ink/30 px-5 font-semibold transition-colors hover:bg-mint-ink hover:text-mint"
            >
              <ShieldCheck className="h-4 w-4" /> Reportar un problema
            </a>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-mint-ink/60">
              Sin letra pequeña · {site.hours.replace(/\.$/, "")}
            </span>
          </div>
        </Reveal>

        {/* Las tres promesas, separadas por hairlines en vez de por tarjetas */}
        <ul className="relative 2xl:pr-56">
          {items.map((it, i) => (
            <li key={it.title} className={i ? "border-t border-mint-ink/15" : ""}>
              <Reveal delay={0.06 * i} className="flex gap-4 py-5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-ink/10">
                  <it.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-bold">{it.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-mint-ink/75">{it.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {/* ASTRO se asoma desde el borde inferior, a escala de página */}
      <div className="pointer-events-none absolute -bottom-4 right-6 hidden h-72 2xl:block">
        <Astro pose="escudo" decorative className="h-full" />
      </div>
    </section>
  );
}
