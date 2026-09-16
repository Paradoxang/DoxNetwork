import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { comboTiers, site } from "@/data/site";
import { EASE, Reveal } from "@/lib/anim";

// TODO: ajusta las respuestas a tus condiciones reales (tiempos, garantía, reembolsos).
export const faqs = [
  {
    q: "¿Cómo recibo lo que compro?",
    a: "Todo es digital: cuando confirmamos tu pago te enviamos los datos de acceso, la clave o la recarga por el mismo chat de WhatsApp.",
  },
  {
    q: "¿Cuánto tarda la entrega?",
    a: `En horario de atención (${site.hours}) normalmente entregamos en pocos minutos después de confirmar el pago.`,
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: `Aceptamos ${site.payments.join(", ")}. Te compartimos los datos al confirmar el pedido.`,
  },
  {
    q: "¿Cómo funcionan los combos?",
    a: comboTiers.length
      ? `Al llevar productos distintos el descuento se aplica solo en el carrito: ${comboTiers
          .map((t) => `${t.pct}% desde ${t.min} productos`)
          .join(" y ")}.`
      : "Escríbenos por WhatsApp y te armamos un combo a tu medida.",
  },
  {
    q: "¿Qué pasa si algo deja de funcionar?",
    a: "Escríbenos por WhatsApp con tu número de pedido. Revisamos el caso y te damos solución durante la vigencia de tu plan.",
  },
  {
    q: "¿Necesito crear una cuenta en la tienda?",
    a: "No. Armas tu carrito, lo envías por WhatsApp y listo. Tu carrito queda guardado en este navegador por si vuelves.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="preguntas" className="border-t border-line bg-bg-soft">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading kicker="04 · Preguntas" title="Lo que más nos preguntan">
          ¿No está tu duda? Escríbenos y te respondemos en el chat.
        </SectionHeading>

        <Reveal>
          <ul className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="card overflow-hidden">
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold transition-colors hover:text-neb"
                    >
                      {f.q}
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isOpen ? "bg-neb text-neb-ink" : "bg-neb-soft text-neb"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <p className="px-5 pb-5 text-[15px] leading-relaxed text-mute">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
