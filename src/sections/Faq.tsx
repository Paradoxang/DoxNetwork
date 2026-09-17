import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { comboTiers, site, waLink } from "@/data/site";
import { EASE, Reveal } from "@/lib/anim";

/**
 * Preguntas que responden objeciones, no que informan (lección de ZeroDelay).
 * Torostream y Emprendered tienen el FAQ vacío: aquí está la ventaja.
 * TODO: ajusta cada respuesta a tus condiciones reales.
 */
export const faqs = [
  {
    q: "¿Qué venden en DoxNetwork?",
    a: "Productos digitales (streaming, música, IA, software, pines de cine y gaming), perfumería, relojería y tecnología, y páginas web a la medida con Dox Designs. Todo se pide por el mismo carrito y el mismo WhatsApp.",
  },
  {
    q: "¿Hacen envíos? ¿Cuánto tardan?",
    a: `Lo digital llega por WhatsApp en unos ${site.deliveryMinutes} minutos en horario de atención (${site.hours}). Perfumes, relojes y tecnología se envían a toda Colombia: el costo y el tiempo te los confirmamos por WhatsApp según tu ciudad.`,
  },
  {
    q: "¿Los productos físicos son originales?",
    a: "Cada ficha lo dice. Hay productos originales (como los relojes Kairos) y réplicas (perfumes 1.1 y AAA, algunos relojes y audífonos). Las réplicas no son productos de las marcas ni están asociadas a ellas.",
  },
  {
    q: "¿Qué diferencia hay entre Pantalla y Completa?",
    a: "Pantalla es un perfil propio dentro de una cuenta compartida: lo usas tú solo, en un dispositivo a la vez. Completa es la cuenta entera con todos sus perfiles, ideal para compartir en casa.",
  },
  {
    q: "¿Qué cambia entre Estándar, Premium y Platino?",
    a: "La calidad y lo que incluye el plan oficial de cada plataforma. Premium y Platino suelen sumar 4K, más dispositivos a la vez o extras como ESPN en Disney+. En cada ficha lo ves detallado.",
  },
  {
    q: "¿Qué pasa si un producto digital deja de funcionar?",
    a: `Escríbenos con tu número de pedido. Te reponemos la cuenta o el perfil en menos de ${site.warrantyHours} horas y sin costo, durante toda la vigencia de tu plan.`,
  },
  {
    q: "¿Hay cobros o renovaciones automáticas?",
    a: "No. Nada se renueva solo ni guardamos tarjetas. Antes de que venza te escribimos y tú decides si renuevas.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: `${site.payments.join(", ")}. Al confirmar el pedido te compartimos los datos para pagar.`,
  },
  {
    q: "¿Cómo funcionan los combos?",
    a: comboTiers.length
      ? `Hay dos formas: los combos armados, que ya vienen con precio rebajado, o armar el tuyo. Al combinar productos digitales distintos el descuento se aplica solo: ${comboTiers
          .map((t) => `${t.pct}% con ${t.min}`)
          .join(", ")} o más.`
      : "Tenemos combos armados con precio rebajado frente a comprar cada plataforma por separado.",
  },
  {
    q: "¿Los pines de cine y las recargas son oficiales?",
    a: "Sí. Son códigos oficiales que redimes directamente en la taquilla, la app del cine o el juego. Para las recargas de juegos solo necesitamos tu ID, nunca tu contraseña.",
  },
  {
    q: "¿Necesito crear una cuenta en la tienda?",
    a: "No. Armas tu carrito, lo envías por WhatsApp y listo. Tu carrito y tus favoritos quedan guardados en este navegador.",
  },
  {
    q: "¿Puedo revender o comprar al por mayor?",
    a: "Sí. Escríbenos por WhatsApp y te compartimos precios por volumen para distribuidores.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="preguntas" className="border-t border-line bg-bg-soft">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading kicker="06 · Preguntas" title="Antes de comprar">
            Lo que más nos preguntan, sin letra pequeña.
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
          <ul className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className={`card overflow-hidden transition-colors ${isOpen ? "border-line-strong" : ""}`}>
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
