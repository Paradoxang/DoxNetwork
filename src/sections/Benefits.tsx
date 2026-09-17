import { Percent, ShieldCheck, Wallet, Zap } from "lucide-react";
import { comboTiers, site } from "@/data/site";
import { Reveal } from "@/lib/anim";

const maxPct = comboTiers.length ? comboTiers[comboTiers.length - 1].pct : 0;

// Barra de confianza justo debajo del hero (estructura mínima de los tres estudios).
// TODO: confirma que cada promesa es real en tu operación antes de publicarla.
const items = [
  { icon: Zap, title: "Entrega en minutos", text: `Por WhatsApp, ~${site.deliveryMinutes} min en horario de atención.` },
  { icon: ShieldCheck, title: "Garantía escrita", text: `Reponemos en menos de ${site.warrantyHours} h si algo falla.` },
  { icon: Wallet, title: "Pagos locales", text: `${site.payments.slice(0, 3).join(", ")}. Sin tarjeta.` },
  ...(maxPct ? [{ icon: Percent, title: `Combos hasta ${maxPct}%`, text: "El descuento se aplica solo al combinar." }] : []),
];

export function Benefits() {
  return (
    <section aria-label="Por qué comprar aquí" className="border-y border-line bg-bg-soft">
      <ul className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {items.map((it, i) => (
          <li key={it.title}>
            <Reveal delay={i * 0.06} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neb-soft text-neb">
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
