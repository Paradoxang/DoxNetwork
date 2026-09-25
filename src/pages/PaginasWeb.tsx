import { ArrowUpRight, Check, Globe } from "lucide-react";
import { Astro } from "@/components/Astro";
import { Deco } from "@/components/Deco";
import { ServiceIcon } from "@/components/DoxIcon";
import { Seo } from "@/components/Seo";
import { FaqItem } from "@/components/ShopControls";
import { Telon } from "@/components/Telon";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { GlareCard } from "@/components/ui/glare-card";
import { allProducts } from "@/data/catalog";
import { DOX_PATH, dox, doxFaqs, doxPasos, doxProjects, doxServices, doxStats } from "@/data/dox";
import { site, waLink } from "@/data/site";
import { Reveal, Tilt } from "@/lib/anim";
import { ProjectCard } from "@/sections/DoxDesigns";

/** Lo que tiene esta misma tienda: la prueba de lo que hace Dox Designs, con datos del sitio. */
const prueba = [
  `${allProducts.length} productos con buscador y filtros`,
  "Carrito y checkout con Nequi y Llave Bre-B",
  "Menús, animaciones y modo claro y oscuro",
  "Diseño propio, sin plantillas",
];

/**
 * Página del servicio de páginas web de Dox Designs, el estudio que hizo esta
 * tienda (orden de Santiago, 25-sep-2026: el servicio tiene su entrada en el
 * menú y su página propia). Datos, proyectos y preguntas en src/data/dox.ts;
 * sin precios ni plazos fijos: van en la cotización por WhatsApp.
 */
export function PaginasWeb() {
  const cotizar = waLink(dox.whatsappText);

  return (
    <>
      <Seo
        title={`Páginas web para tu negocio · Dox Designs · ${site.name}`}
        description="Páginas web, tiendas online y aplicaciones a la medida con Dox Designs, el estudio de Cali que hizo esta tienda. Cotiza por WhatsApp sin compromiso."
        path={DOX_PATH}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Dox Designs",
          url: dox.url,
          areaServed: "CO",
          address: { "@type": "PostalAddress", addressLocality: "Cali", addressCountry: "CO" },
          makesOffer: doxServices.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })),
        }}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <Telon name="telon-aurora" opacity={0.4} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-24 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(154,169,255,0.18), transparent 70%)" }}
        />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-4 pb-16 pt-[140px] md:px-6 md:pt-[164px] lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <a
                href={dox.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors hover:border-neb"
              >
                <img src="/dox/isotipo.webp" alt="" width="32" height="32" className="h-8 w-8 rounded-full" />
                Un servicio de <span className="text-neb">Dox Designs</span>
                <ArrowUpRight className="h-4 w-4 text-faint" />
              </a>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display mt-6 text-[clamp(38px,6vw,68px)] leading-[1.02]">
                Tu negocio, con una página <span className="text-neb">que vende.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-mute">
                Páginas web, tiendas online y aplicaciones a la medida, rápidas y pensadas para que tus clientes te encuentren
                y te escriban. Las hace <strong className="text-ink">Dox Designs</strong>, el estudio de Cali que construyó
                esta tienda.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
              <a href={cotizar} target="_blank" rel="noopener noreferrer" className="btn btn-buy min-h-[52px]">
                <WhatsAppIcon /> Cotizar mi página
              </a>
              <a href="#proyectos" className="btn btn-ghost min-h-[52px]">
                Ver proyectos
              </a>
            </Reveal>
            <Reveal delay={0.2}>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-2 text-center">
                {doxStats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-line bg-surface px-2 py-4">
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-2xl font-extrabold text-ink md:text-3xl">{s.value}</dd>
                    <dd className="mt-1 text-xs leading-tight text-mute">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <div
              aria-hidden="true"
              className="absolute inset-[6%] rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(154,169,255,0.28), rgba(242,196,109,0.08) 55%, transparent 72%)" }}
            />
            <Tilt max={8}>
              <a href={dox.url} target="_blank" rel="noopener noreferrer" aria-label="Ir a Dox Designs" className="relative block">
                <GlareCard className="mx-auto w-[78%] overflow-hidden rounded-[32px] shadow-[0_30px_80px_rgba(3,6,15,0.55)]">
                  <img src="/dox/logo-principal.webp" alt="Dox Designs" width="900" height="972" className="relative block w-full" />
                </GlareCard>
              </a>
            </Tilt>
            <div className="pointer-events-none absolute -left-6 top-[46%] z-10 h-36 sm:-left-10 md:h-48">
              <Astro pose="laptop" small decorative className="h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Esta tienda es la prueba ── */}
      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-10 md:grid-cols-[auto_1fr] md:items-center md:gap-12 md:px-6">
          <Reveal>
            <p className="kicker">La prueba</p>
            <p className="mt-2 text-2xl font-extrabold leading-tight md:text-3xl">
              Esta tienda la
              <br className="hidden md:block" /> hicimos nosotros
            </p>
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2">
            {prueba.map((t, i) => (
              <li key={t}>
                <Reveal delay={i * 0.05} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint-soft text-mint">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="font-semibold">{t}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Servicios ── */}
      <section id="servicios" className="relative mx-auto max-w-[1200px] scroll-mt-24 px-4 py-20 md:px-6">
        <Deco name="stylus" className="right-0 top-10 hidden w-48 lg:block" opacity={0.45} rotate={12} fade={false} />
        <Reveal>
          <p className="kicker">Servicios</p>
          <h2 className="display mt-3 text-[clamp(28px,4vw,44px)]">Lo que hacemos por tu negocio</h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {doxServices.map((s, i) => (
            <li key={s.id}>
              <Reveal delay={i * 0.06} className="card card-hover flex h-full gap-4 p-6">
                <ServiceIcon id={s.id} size="lg" />
                <span>
                  <span className="block text-xl font-bold">{s.title}</span>
                  <span className="mt-1.5 block leading-relaxed text-mute">{s.text}</span>
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Proyectos ── */}
      <section id="proyectos" className="scroll-mt-24 border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-[1200px] px-4 py-20 md:px-6">
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker">Portafolio</p>
              <h2 className="display mt-3 text-[clamp(28px,4vw,44px)]">Proyectos de Dox Designs</h2>
            </div>
            <a href={dox.projectsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold text-neb hover:underline">
              Ver todos en doxdesigns.dev <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doxProjects.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={i * 0.05} className="h-full">
                  <ProjectCard project={p} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Cómo trabajamos ── */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 md:px-6">
        <Reveal>
          <p className="kicker">Cómo trabajamos</p>
          <h2 className="display mt-3 text-[clamp(28px,4vw,44px)]">De la idea a tu página en línea</h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {doxPasos.map((paso, i) => (
            <li key={paso.title}>
              <Reveal delay={i * 0.06} className="card relative h-full overflow-hidden p-6">
                <span className="display text-5xl text-neb/30">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-lg font-bold">{paso.title}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-mute">{paso.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Preguntas ── */}
      <section className="mx-auto max-w-[860px] px-4 pb-20 md:px-6">
        <Reveal>
          <p className="kicker">Preguntas frecuentes</p>
          <h2 className="display mt-3 text-[clamp(28px,4vw,42px)]">Antes de cotizar</h2>
        </Reveal>
        <ul className="mt-8 space-y-3">
          {doxFaqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </ul>
      </section>

      {/* ── Cierre ── */}
      <section className="slant relative isolate overflow-hidden bg-neb text-neb-ink">
        <Deco name="diagrama" className="-left-10 -top-10 w-56 md:w-72" opacity={0.2} />
        <div className="relative mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-6 md:py-20">
          <Reveal>
            <p className="kicker text-neb-ink/70">¿Hablamos?</p>
            <h2 className="display mt-3 max-w-xl text-[clamp(30px,4.4vw,52px)] text-neb-ink">Cuéntanos tu idea y te cotizamos</h2>
            <p className="mt-4 max-w-md leading-relaxed text-neb-ink/80">Sin compromiso y por WhatsApp. Te responde una persona.</p>
          </Reveal>
          <Reveal delay={0.08} className="flex shrink-0 flex-col gap-3">
            <a
              href={cotizar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-neb-ink px-6 font-bold text-neb transition-transform hover:brightness-110"
            >
              <WhatsAppIcon /> Cotizar por WhatsApp
            </a>
            <a href={dox.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-neb-ink/80 hover:text-neb-ink">
              <Globe className="h-4 w-4" /> doxdesigns.dev
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
