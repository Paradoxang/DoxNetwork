import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { Deco } from "@/components/Deco";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { reportHours } from "@/data/legal";
import { qualityInfo } from "@/data/perfumeria";
import { site, waLink } from "@/data/site";
import { EASE, Reveal } from "@/lib/anim";

/**
 * Preguntas que responden objeciones, no que informan (lección de ZeroDelay).
 * Torostream y Emprendered tienen el FAQ vacío: aquí está la ventaja.
 * Desde el 25-sep-2026 son preguntas de la tienda física: se fueron las de
 * pantallas, planes, reposición y renovaciones.
 * TODO: ajusta cada respuesta a tus condiciones reales.
 */
const lower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

export const faqs = [
  {
    q: "¿Qué venden en DoxNetwork?",
    a: "Perfumería 1.1 y AAA para ella, para él y unisex, relojería, tecnología y productos para mascotas, además de páginas web a la medida con Dox Designs. Todo se pide por el mismo carrito.",
  },
  {
    q: "¿No encuentras la fragancia que buscas?",
    a: `Pregunta por nuestro stock secreto: escríbenos por WhatsApp el nombre de la fragancia y te decimos si la tenemos.`,
  },
  {
    q: "¿Los perfumes y los relojes son originales?",
    a: "Cada ficha lo dice. Hay productos originales (como los relojes Kairos) y réplicas (perfumes 1.1 y AAA, algunos relojes y audífonos). Las réplicas no son productos de las marcas ni están asociadas a ellas.",
  },
  {
    q: "¿Qué diferencia hay entre 1.1 y AAA?",
    a: `${qualityInfo["1.1"].label}: ${lower(qualityInfo["1.1"].text)} ${qualityInfo.AAA.label}: ${lower(qualityInfo.AAA.text)}`,
  },
  {
    q: "¿Hacen envíos? ¿Cuánto tardan?",
    a: "Sí, a toda Colombia. El costo del envío lo ves en el checkout antes de pagar, y cuando tu pedido sale te compartimos la guía para que le hagas seguimiento.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Nequi o Llave Bre-B, al finalizar la compra. No necesitas tarjeta.",
  },
  {
    q: "¿Qué pasa si mi pedido llega mal?",
    a: `Si llega dañado, incompleto o distinto, repórtalo por WhatsApp en las ${reportHours} horas siguientes con fotos o un video, y asumimos el cambio y los envíos. Además, cada producto tiene su garantía legal.`,
  },
  {
    q: "¿Necesito crear una cuenta en la tienda?",
    a: "No. Armas tu carrito y finalizas la compra sin registrarte. Tu carrito y tus favoritos quedan guardados en este navegador.",
  },
  {
    q: "¿Puedo revender o comprar al por mayor?",
    a: "Sí. Escríbenos por WhatsApp y te compartimos precios por volumen para distribuidores.",
  },
];

/**
 * 06 · Preguntas como FAQ Chat Accordion (brief de rediseño, fase 2): toda la
 * compra pasa por WhatsApp, así que las preguntas se ven como un chat. Cada
 * pregunta es un mensaje del cliente; al tocarla, Dox "escribe" un instante y
 * llega la respuesta. Una abierta a la vez.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="preguntas" className="relative bg-bg">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora" />
        <Deco name="lente" className="-left-40 top-1/4 hidden w-[760px] lg:block" opacity={0.26} pesado />
        <Deco name="obj-burbuja" className="-left-6 top-6 hidden w-40 xl:block" opacity={0.7} float fade={false} />
      </div>
      <div className="relative mx-auto grid max-w-[1200px] gap-10 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[1fr_1.35fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading kicker="06 · Preguntas" title="Antes de comprar">
            Lo que más nos preguntan, sin letra pequeña. Toca una pregunta y te respondemos como en el chat.
          </SectionHeading>
          <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-3">
            <a href={waLink(`Hola ${site.name}, tengo una pregunta.`)} target="_blank" rel="noopener noreferrer" className="btn btn-buy">
              <WhatsAppIcon /> Preguntar por WhatsApp
            </a>
            <Link to="/terminos" className="btn btn-ghost">Términos</Link>
          </Reveal>
          <div className="mt-8 hidden h-64 lg:block">
            <Astro pose="busto" small decorative className="h-full" />
          </div>
        </div>

        <Reveal>
          <div className="brackets relative overflow-hidden rounded-[28px] border border-line bg-surface">
            <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
              <img src="/astro/avatar-sm.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full border border-line" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{site.name}</span>
                <span className="block text-xs text-mint">en línea · te responde una persona</span>
              </span>
              <WhatsAppIcon className="h-5 w-5 text-mint" />
            </div>

            <ul className="chat-wall space-y-2.5 px-3 py-5 sm:px-5">
              <li className="flex justify-center pb-2" aria-hidden="true">
                <span className="rounded-full bg-surface-2 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">Preguntas frecuentes</span>
              </li>
              {faqs.map((f, i) => (
                <ChatItem key={f.q} i={i} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ChatItem({ i, q, a, open, onToggle }: { i: number; q: string; a: string; open: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion();
  const [typing, setTyping] = useState(false);

  // Al abrir, un instante de "escribiendo…" antes de la respuesta
  useEffect(() => {
    if (!open || reduced) return setTyping(false);
    setTyping(true);
    const t = window.setTimeout(() => setTyping(false), 650);
    return () => window.clearTimeout(t);
  }, [open, reduced]);

  return (
    <li>
      <h3 className="flex justify-end">
        <button
          type="button"
          id={`faq-btn-${i}`}
          aria-expanded={open}
          aria-controls={`faq-panel-${i}`}
          onClick={onToggle}
          className={`max-w-[88%] rounded-2xl rounded-br-md px-4 py-2.5 text-left text-[15px] font-semibold leading-snug transition-colors ${
            open ? "bg-mint text-mint-ink" : "bg-mint-soft text-ink hover:bg-mint/25"
          }`}
        >
          {q}
          <span className={`mt-1 flex justify-end ${open ? "text-mint-ink/70" : "text-faint"}`} aria-hidden="true">
            <CheckCheck className="h-3.5 w-3.5" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-panel-${i}`}
            role="region"
            aria-labelledby={`faq-btn-${i}`}
            aria-busy={typing}
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
          >
            <div className="flex items-end gap-2 pt-2.5">
              <img src="/astro/avatar-sm.webp" alt="" width={24} height={24} className="mb-1 h-6 w-6 shrink-0 rounded-full border border-line" />
              {typing ? (
                <span className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md bg-surface-2 px-4" aria-label="Escribiendo">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="typing-dot h-1.5 w-1.5 rounded-full bg-mute" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </span>
              ) : (
                <p className="max-w-[88%] rounded-2xl rounded-bl-md bg-surface-2 px-4 py-3 text-[15px] leading-relaxed text-ink">{a}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
