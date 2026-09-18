import { Astro } from "@/components/Astro";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Deco } from "@/components/Deco";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { GlareCard } from "@/components/ui/glare-card";
import { dox, doxProjects, doxServices, doxStats, type DoxProject } from "@/data/dox";
import { waLink } from "@/data/site";
import { Reveal, Tilt } from "@/lib/anim";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Sección de Dox Designs: el estudio que construyó esta tienda. Promociona el
 * servicio de páginas y soluciones web con datos y proyectos reales del
 * portafolio.
 *
 * GSAP: el isotipo flota y sus capas de luz se mueven con el scroll (parallax
 * suave), y las tarjetas de proyectos entran en ola. Framer: inclinación del
 * logo al puntero. Cada proyecto reproduce su video al pasar el puntero.
 */
export function DoxDesigns() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = scope.current!;
        gsap.to(el.querySelector("[data-dox-logo]"), {
          y: -14,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.fromTo(
          el.querySelector("[data-dox-halo]"),
          { yPercent: 12, scale: 0.9 },
          {
            yPercent: -12,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        const cards = gsap.utils.toArray<HTMLElement>("[data-dox-card]", el);
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el.querySelector("[data-dox-grid]"), start: "top 85%", once: true },
        });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="dox-designs" className="slant relative overflow-hidden bg-bg-soft">
      {/* Luces de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(154,169,255,0.16), transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(242,196,109,0.1), transparent 70%)" }}
      />

      <Deco name="malla" className="bottom-0 left-0 w-full" opacity={0.22} pesado />
      <Deco name="stylus" className="right-10 top-14 hidden w-56 lg:block" opacity={0.55} rotate={12} fade={false} />

      <div className="relative mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <a
                href={dox.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors hover:border-neb"
              >
                <img src="/dox/isotipo.webp" alt="" width="32" height="32" className="h-8 w-8 rounded-full" />
                Hecho por <span className="text-neb">Dox Designs</span>
                <ArrowUpRight className="h-4 w-4 text-faint" />
              </a>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display mt-6 text-[clamp(32px,5vw,56px)]">
                ¿Tu negocio necesita una página <span className="text-neb">como esta?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-mute">
                DoxNetwork es un proyecto de <strong className="text-ink">Dox Designs</strong>, estudio de diseño y
                desarrollo web en Cali, Colombia. Creamos páginas web, tiendas online y aplicaciones a la medida:
                rápidas, seguras y pensadas para que tus clientes te encuentren y te escriban.
              </p>
            </Reveal>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {doxServices.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={0.12 + i * 0.05} className="flex h-full gap-3 rounded-2xl border border-line bg-surface p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neb-soft text-neb">
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <span>
                      <span className="block font-bold">{s.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-mute">{s.text}</span>
                    </span>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
                <a href={dox.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Visitar doxdesigns.dev <ArrowUpRight className="h-4 w-4" />
                </a>
              <a href={waLink(dox.whatsappText)} target="_blank" rel="noopener noreferrer" className="btn btn-buy">
                <WhatsAppIcon /> Cotizar mi página
              </a>
              <a href={dox.servicesUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Ver servicios
              </a>
            </Reveal>
          </div>

          {/* Logo y cifras */}
          <div className="relative mx-auto w-full max-w-[420px]">
            <div
              data-dox-halo
              aria-hidden="true"
              className="absolute inset-[6%] rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(154,169,255,0.28), rgba(242,196,109,0.08) 55%, transparent 72%)" }}
            />
            <Tilt max={8}>
              <a href={dox.url} target="_blank" rel="noopener noreferrer" aria-label="Ir a Dox Designs" className="relative block">
                <GlareCard className="mx-auto w-[78%] overflow-hidden rounded-[32px] shadow-[0_30px_80px_rgba(3,6,15,0.55)]">
                  <img
                    data-dox-logo
                    src="/dox/logo-principal.webp"
                    alt="Dox Designs"
                    width="900"
                    height="972"
                    loading="lazy"
                    decoding="async"
                    className="relative block w-full"
                  />
                </GlareCard>
              </a>
            </Tilt>
            <div className="pointer-events-none absolute -left-6 top-[46%] z-10 h-36 sm:-left-10 md:h-48">
              <Astro pose="laptop" small decorative className="h-full" />
            </div>
            <dl className="relative mt-8 grid grid-cols-3 gap-2 text-center">
              {doxStats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-line bg-surface px-2 py-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-extrabold text-ink md:text-3xl">{s.value}</dd>
                  <dd className="mt-1 text-xs leading-tight text-mute">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Proyectos */}
        <div className="mt-20">
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker">Portafolio</p>
              <h3 className="mt-2 text-2xl font-extrabold md:text-3xl">Algunos proyectos de Dox Designs</h3>
            </div>
            <a
              href={dox.projectsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-neb hover:underline"
            >
              Ver todos los proyectos <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>

          <ul data-dox-grid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doxProjects.map((p) => (
              <li key={p.slug} data-dox-card>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: DoxProject }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  // Solo con puntero fino: en táctil no se descargan videos por un toque
  const play = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !video.current) return;
    video.current.play().then(() => setPlaying(true)).catch(() => {});
  };
  const stop = () => {
    if (!video.current) return;
    video.current.pause();
    video.current.currentTime = 0;
    setPlaying(false);
  };

  return (
    <a
      href={dox.projectsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onPointerEnter={play}
      onPointerLeave={stop}
      className="card card-hover group block overflow-hidden"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
        <img
          src={`/dox/${project.slug}.webp`}
          alt={`Vista del proyecto ${project.name}`}
          width="960"
          height="450"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <video
          ref={video}
          src={`/dox/${project.slug}.mp4`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
        />
        <span
          className={`absolute bottom-3 right-3 items-center gap-1.5 rounded-full bg-bg/80 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur-sm transition-opacity ${
            playing ? "opacity-0" : "opacity-100"
          } hidden md:flex`}
        >
          <Play className="h-3 w-3" fill="currentColor" /> Pasa el cursor
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="font-bold leading-snug">{project.name}</p>
          <p className="mt-0.5 text-sm text-mute">{project.tag}</p>
          <p className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((t) => (
              <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-faint">
                {t}
              </span>
            ))}
          </p>
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neb" />
      </div>
    </a>
  );
}
