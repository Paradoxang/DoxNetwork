import { CreditCard, MessageCircle, MousePointerClick } from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/data/site";
import { gsap, useGSAP } from "@/lib/gsap";

const steps = [
  {
    icon: MousePointerClick,
    title: "Elige",
    text: "Agrega al carrito lo que quieras. Si combinas varios productos, el descuento se aplica solo.",
  },
  {
    icon: MessageCircle,
    title: "Confirma por WhatsApp",
    text: "Enviamos tu pedido armado a nuestro WhatsApp y te respondemos con los datos de pago.",
  },
  {
    icon: CreditCard,
    title: "Paga y recibe",
    text: `Pagas por ${site.payments.slice(0, 3).join(", ")} y recibes tu producto en el mismo chat.`,
  },
];

/* La línea que une los pasos se dibuja con DrawSVG acompañando al scroll
   (scrub), y cada paso se enciende cuando la línea llega a él. Horizontal en
   escritorio, vertical en móvil: dos trazos y matchMedia elige cuál. */
export function HowItWorks() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          wide: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          narrow: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { wide } = ctx.conditions as { wide: boolean };
          const el = scope.current!;
          const line = el.querySelector(wide ? "[data-line-h]" : "[data-line-v]");
          const dots = el.querySelectorAll("[data-step-dot]");
          const cards = el.querySelectorAll("[data-step]");

          gsap.set(cards, { autoAlpha: 0.45, y: 12 });
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el.querySelector("[data-steps]"), start: "top 80%", end: "bottom 60%", scrub: 0.6 },
          });
          tl.from(line, { drawSVG: "0%", ease: "none", duration: 3 }, 0);
          cards.forEach((c, i) => {
            tl.to(c, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, i * 1.1);
            tl.from(dots[i], { scale: 0.4, backgroundColor: "transparent", duration: 0.4 }, i * 1.1);
          });
        }
      );
    },
    { scope }
  );

  return (
    <section ref={scope} className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <SectionHeading kicker="03 · Cómo comprar" title="Tres pasos y listo" center>
        Sin registros ni formularios largos. Todo pasa en un chat.
      </SectionHeading>

      <div data-steps className="relative mt-14">
        {/* Trazo horizontal (escritorio) */}
        <svg
          className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-[22px] hidden h-[2px] w-[66.8%] md:block"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line data-line-h x1="0" y1="1" x2="100" y2="1" stroke="var(--neb)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Trazo vertical (móvil) */}
        <svg
          className="pointer-events-none absolute left-[21px] top-6 h-[calc(100%-4.5rem)] w-[2px] md:hidden"
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line data-line-v x1="1" y1="0" x2="1" y2="100" stroke="var(--neb)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>

        <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} data-step className="flex gap-5 md:flex-col md:items-center md:text-center">
              <span
                data-step-dot
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-neb bg-neb text-neb-ink"
              >
                <s.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="md:max-w-[300px]">
                <p className="kicker text-faint">Paso {i + 1}</p>
                <p className="mt-2 text-lg font-bold">{s.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-mute">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
