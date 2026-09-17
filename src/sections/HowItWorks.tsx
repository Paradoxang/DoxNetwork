import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCheck, CreditCard, MessageCircle, MousePointerClick, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Astro } from "@/components/Astro";
import { Deco } from "@/components/Deco";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { planLabel, type Product } from "@/data/catalog";
import { destacados, thumbOf } from "@/data/destacados";
import { formatCOP, site } from "@/data/site";
import { EASE } from "@/lib/anim";

const steps = [
  {
    icon: MousePointerClick,
    title: "Elige",
    text: "Agrega al carrito lo que quieras de toda la red: plataformas, perfumes, relojes o tecnología. Sin registrarte.",
  },
  {
    icon: MessageCircle,
    title: "Confirma por WhatsApp",
    text: "Tu pedido llega armado a nuestro WhatsApp y te respondemos con los datos de pago. Te atiende una persona.",
  },
  {
    icon: CreditCard,
    title: "Paga y recibe",
    text: `Pagas por ${site.payments.slice(0, 3).join(", ")}. Lo digital llega al chat en ~${site.deliveryMinutes} minutos y lo físico sale con envío a toda Colombia.`,
  },
];

// Pedido de ejemplo con productos y precios reales del catálogo
const sample = [destacados.digital[0], destacados.perfumeria[0]].filter(Boolean) as Product[];
const total = sample.reduce((n, p) => n + p.plans[0].price, 0);

/**
 * 04 · Cómo comprar como Sticky Scroll Reveal (brief de rediseño, fase 2): los
 * pasos corren a la izquierda y un teléfono fijo a la derecha muestra lo que
 * pasa en cada uno, del carrito al chat. En móvil no hay nada fijo: cada paso
 * lleva su propia pantalla debajo.
 */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="como-comprar" className="relative border-y border-line bg-bg-soft">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Deco name="fibra" className="-left-32 bottom-0 hidden w-[620px] lg:block" opacity={0.22} />
      </div>
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-20 md:px-6 md:py-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20">
        <div>
          <SectionHeading kicker="04 · Cómo comprar" title="Tres pasos y listo">
            Sin registros ni formularios largos. Compres lo que compres, todo pasa en un chat.
          </SectionHeading>

          <ol className="mt-12 lg:mt-4">
            {steps.map((s, i) => (
              <li
                key={s.title}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-step={i}
                className="flex flex-col gap-6 py-8 lg:min-h-[52vh] lg:py-20 lg:first:pt-14"
              >
                <div className={`flex gap-5 transition-opacity duration-500 ${active === i ? "lg:opacity-100" : "lg:opacity-35"}`}>
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-neb transition-colors duration-500 ${
                      active === i ? "bg-neb text-neb-ink" : "bg-neb text-neb-ink lg:bg-transparent lg:text-neb"
                    }`}
                  >
                    <s.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="max-w-md">
                    <p className="kicker text-faint">Paso {i + 1}</p>
                    <p className="display mt-2 text-[clamp(24px,3vw,34px)]">{s.title}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-mute md:text-base">{s.text}</p>
                  </div>
                </div>
                {/* Móvil y tableta: la pantalla del paso va debajo */}
                <div className="lg:hidden">
                  <Phone compact>
                    <Screen step={i} />
                  </Phone>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Escritorio: teléfono fijo que cambia con el paso */}
        <div className="relative hidden lg:block">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <Deco name="reticula" className="-right-24 top-0 w-72" opacity={0.28} />
          </div>
          <div className="sticky top-[max(7rem,calc(50vh-300px))]">
            <Phone>
              <AnimatePresence mode="wait" initial={false}>
                <ScreenSwap key={active}>
                  <Screen step={active} />
                </ScreenSwap>
              </AnimatePresence>
            </Phone>
            <div className="pointer-events-none absolute -left-28 bottom-6 hidden xl:block">
              <Astro pose="senala" decorative className="h-44" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScreenSwap({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="h-full"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Marco de teléfono, decorativo: el texto de cada paso ya lo cuenta. */
function Phone({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative mx-auto overflow-hidden rounded-[38px] border border-line-strong bg-[var(--echo-bg)] p-2 shadow-[var(--shadow)] ${
        compact ? "h-[360px] w-full max-w-[340px]" : "h-[600px] w-[340px]"
      }`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[30px] bg-bg">{children}</div>
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neb-soft">
        <img src="/favicon-192.png" alt="" width={24} height={24} className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{site.name}</span>
        <span className="block text-[11px] text-mint">en línea</span>
      </span>
      <WhatsAppIcon className="h-5 w-5 text-mint" />
    </div>
  );
}

function Bubble({ out = false, children, time }: { out?: boolean; children: ReactNode; time: string }) {
  return (
    <div className={`flex ${out ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${
          out ? "rounded-br-md bg-mint-soft text-ink" : "rounded-bl-md bg-surface-2 text-ink"
        }`}
      >
        {children}
        <span className="num mt-1 flex items-center justify-end gap-1 text-[10px] text-faint">
          {time} {out && <CheckCheck className="h-3 w-3 text-neb" />}
        </span>
      </div>
    </div>
  );
}

function Screen({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3.5">
          <ShoppingBag className="h-4 w-4 text-neb" />
          <span className="text-sm font-semibold">Tu carrito</span>
          <span className="num ml-auto text-xs text-faint">{sample.length} productos</span>
        </div>
        <ul className="flex-1 space-y-2.5 overflow-hidden p-3">
          {sample.map((p) => (
            <li key={p.slug} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5">
              <span className="product-media h-12 w-12 shrink-0 rounded-xl">
                <img src={thumbOf(p)} alt="" width={48} height={48} className="relative z-[1] h-full w-full rounded-xl object-contain p-1" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold">{p.name}</span>
                <span className="block truncate text-[11px] text-faint">{planLabel(p.plans[0]) || "Unidad"}</span>
              </span>
              <span className="num text-[13px]">{formatCOP(p.plans[0].price)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-line bg-surface p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-mute">Total</span>
            <span className="num font-semibold">{formatCOP(total)}</span>
          </div>
          <span className="btn btn-buy mt-3 w-full justify-center text-sm">
            <WhatsAppIcon /> Enviar pedido por WhatsApp
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />
      <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden p-3">
        {step === 1 ? (
          <>
            <Bubble out time="10:02">
              Hola {site.name}, quiero hacer este pedido:
              <br />
              {sample.map((p) => (
                <span key={p.slug} className="block">
                  • {p.name} x1: <span className="num">{formatCOP(p.plans[0].price)}</span>
                </span>
              ))}
              <span className="mt-1 block font-semibold">
                Total: <span className="num">{formatCOP(total)}</span>
              </span>
            </Bubble>
            <Bubble time="10:03">¡Hola! Ya tenemos tu pedido. Te paso los datos para pagar por {site.payments[0]} o {site.payments[1]} 👇</Bubble>
          </>
        ) : (
          <>
            <Bubble out time="10:06">
              <span className="mb-1.5 flex items-center gap-2 rounded-xl bg-bg/40 px-2.5 py-2 text-[12px] text-mute">
                <CreditCard className="h-4 w-4" /> comprobante.jpg
              </span>
              Listo, ya pagué
            </Bubble>
            <Bubble time="10:08">Pago confirmado ✅ Aquí van los datos de acceso de tu {sample[0]?.name ?? "plan"}.</Bubble>
            <Bubble time="10:09">Tu perfume ya está en preparación. Te enviamos la guía de envío por este chat 📦</Bubble>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-line bg-surface px-3 py-2.5">
        <span className="flex-1 rounded-full bg-surface-2 px-3 py-2 text-[12px] text-faint">Mensaje</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-mint-ink">
          <WhatsAppIcon className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
