import { BellRing, RefreshCcw, ShieldCheck } from "lucide-react";
import { Astro } from "@/components/Astro";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site, waLink } from "@/data/site";
import { Reveal } from "@/lib/anim";

/**
 * Garantía escrita: lo que ningún competidor pone en su web y lo que, según
 * los estudios, decide al cliente que ya se quemó en otra tienda.
 * TODO: publica solo lo que puedas cumplir (site.warrantyHours).
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
    <section id="garantia" className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <div className="card relative grid gap-10 overflow-hidden p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--mint-soft)" }}
        />
        <Reveal className="relative">
          <div className="flex items-end gap-4">
            <Astro pose="escudo" decorative className="h-40 shrink-0 md:h-48" />
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-mint-soft px-3 py-1.5 text-sm font-bold text-mint">
              <ShieldCheck className="h-4 w-4" /> Garantía escrita
            </span>
          </div>
          <p className="kicker mt-6">05 · Garantía</p>
          <h2 className="display mt-3 text-[clamp(28px,4.2vw,44px)]">Compras con respaldo</h2>
          <p className="mt-3 max-w-md leading-relaxed text-mute">
            Lo digital tiene reposición por escrito durante toda la vigencia. En perfumes, relojes y tecnología te confirmamos la
            garantía de tu producto antes de que pagues.
          </p>
          <a
            href={waLink(`Hola ${site.name}, tengo un problema con mi pedido. Mi número de pedido es:`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-6"
          >
            Reportar un problema
          </a>
        </Reveal>

        <ul className="relative grid gap-3">
          {items.map((it, i) => (
            <li key={it.title}>
              <Reveal delay={0.08 * i} className="flex gap-4 rounded-2xl border border-line bg-bg-soft p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint-soft text-mint">
                  <it.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold">{it.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-mute">{it.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
