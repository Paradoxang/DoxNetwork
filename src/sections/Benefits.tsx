import { ShieldCheck, SprayCan, Truck, Wallet } from "lucide-react";
import { Deco } from "@/components/Deco";
import { tint } from "@/data/paleta";
import { site } from "@/data/site";
import { Reveal } from "@/lib/anim";

// Barra de confianza justo debajo del hero (estructura mínima de los tres estudios).
// TODO: confirma que cada promesa es real en tu operación antes de publicarla.
const items = [
  { icon: SprayCan, hue: "#ef8fb8", title: "Perfumería 1.1 y AAA", text: "Para ella, para él y unisex. ¿No está la tuya? Pregunta por el stock secreto." },
  { icon: Truck, hue: "#5fb8e8", title: "Envío gratis a toda Colombia", text: "Perfumes, relojes y tecnología. Llega en 3 a 6 días hábiles." },
  { icon: Wallet, hue: "#f2c46d", title: "Pagas sin tarjeta", text: `${site.payments.map((p) => (p === "Bre-B" ? "Llave Bre-B" : p)).join(" o ")} al finalizar la compra.` },
  { icon: ShieldCheck, hue: "#5fd8a4", title: "Te atiende una persona", text: "Dudas, pedidos y garantía por WhatsApp, antes y después de comprar." },
];

export function Benefits() {
  return (
    <section aria-label="Por qué comprar aquí" className="relative overflow-hidden border-y border-line bg-bg-soft">
      <Deco name="banda" className="right-0 top-1/2 hidden w-[560px] -translate-y-1/2 lg:block" opacity={0.16} />
      <ul className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {items.map((it, i) => (
          <li key={it.title}>
            <Reveal delay={i * 0.06} className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ background: tint(it.hue, 16), color: it.hue }}
              >
                <it.icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div>
                <p className="font-bold">{it.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-mute">{it.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
