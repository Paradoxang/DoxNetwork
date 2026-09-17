import { BellRing, RefreshCcw, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { site, waLink } from "@/data/site";
import { Reveal } from "@/lib/anim";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Garantía escrita: lo que ningún competidor pone en su web y lo que, según
 * los estudios, decide al cliente que ya se quemó en otra tienda.
 * TODO: publica solo lo que puedas cumplir (site.warrantyHours).
 */
const items = [
  {
    icon: RefreshCcw,
    title: `Reposición en menos de ${site.warrantyHours} h`,
    text: "Si tu cuenta o perfil falla durante la vigencia, te damos uno nuevo sin costo.",
  },
  {
    icon: BellRing,
    title: "Sin cobros automáticos",
    text: "Nada se renueva solo. Te escribimos antes de que venza y decides si sigues.",
  },
  {
    icon: WhatsAppIcon,
    title: "Soporte con personas",
    text: `Te atiende alguien de verdad por WhatsApp. ${site.hours}.`,
  },
];

export function Guarantee() {
  const scope = useRef<HTMLElement>(null);

  // El escudo se dibuja y hace un pulso cuando la sección entra en pantalla
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const shield = scope.current!.querySelector("[data-shield] path");
        if (!shield) return;
        gsap.from(shield, {
          drawSVG: "0%",
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: { trigger: scope.current, start: "top 75%", once: true },
        });
        gsap.fromTo(
          "[data-shield-ring]",
          { scale: 0.6, autoAlpha: 0.7 },
          {
            scale: 1.6,
            autoAlpha: 0,
            duration: 1.8,
            repeat: 2,
            ease: "power1.out",
            scrollTrigger: { trigger: scope.current, start: "top 75%", once: true },
          }
        );
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="garantia" className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <div className="card relative grid gap-10 overflow-hidden p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--mint-soft)" }}
        />
        <Reveal className="relative">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span data-shield-ring className="absolute inset-0 rounded-full border-2 border-mint" aria-hidden="true" />
            <span data-shield className="flex h-20 w-20 items-center justify-center rounded-full bg-mint-soft text-mint">
              <ShieldCheck className="h-10 w-10" strokeWidth={1.8} />
            </span>
          </div>
          <p className="kicker mt-6">05 · Garantía</p>
          <h2 className="display mt-3 text-[clamp(28px,4.2vw,44px)]">Si falla, lo reponemos</h2>
          <p className="mt-3 max-w-md leading-relaxed text-mute">
            En este mercado las cuentas a veces se caen. Por eso la garantía está por escrito y dura toda la vigencia de tu plan.
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
