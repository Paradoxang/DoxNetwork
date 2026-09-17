import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/catalog";
import { destacados } from "@/data/destacados";
import { relojes, tecnologia } from "@/data/lineas";
import { perfumes, shipping } from "@/data/perfumeria";
import { formatCOP } from "@/data/site";
import { Reveal } from "@/lib/anim";
import { gsap, useGSAP } from "@/lib/gsap";

// Perfume, reloj, tecnología, perfume…: la cinta muestra las tres líneas físicas
const picks: Product[] = [];
for (let i = 0; i < 8; i++) for (const id of ["perfumeria", "relojeria", "tecnologia"] as const) if (destacados[id][i]) picks.push(destacados[id][i]);

const shortcuts = [
  { to: "/perfumeria", label: "Perfumería", count: perfumes.length },
  { to: "/relojeria", label: "Relojería", count: relojes.length },
  { to: "/tecnologia", label: "Tecnología", count: tecnologia.length },
];

/**
 * Las líneas físicas en el inicio: una banda cálida (el dorado del logo) con
 * una cinta de perfumes, relojes y tecnología que corre sola y se pausa al
 * pasar el puntero. GSAP solo mueve el halo con el scroll; la cinta es CSS.
 */
export function TiendaTeaser() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-halo]",
          { yPercent: -20 },
          { yPercent: 25, ease: "none", scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} id="envios" className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <div className="card relative overflow-hidden">
        <div
          data-halo
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(242,196,109,0.28), transparent 70%)" }}
        />
        <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-10">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Nuevo
            </span>
            <h2 className="display mt-4 text-[clamp(30px,4.6vw,50px)]">Perfumes, relojes y tecnología</h2>
            <p className="mt-3 max-w-lg leading-relaxed text-mute">
              {perfumes.length + relojes.length + tecnologia.length} productos físicos que confirmas por WhatsApp. {shipping.short}.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {shortcuts.map((s) => (
                <Link key={s.to} to={s.to} className="chip">
                  {s.label} <span className="text-xs text-faint">{s.count}</span>
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Link to="/catalogo" className="btn btn-primary">
              Ver toda la tienda <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        {/* Cinta: se duplica la lista para que el bucle no tenga salto */}
        <div className="relative overflow-hidden pb-8 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
          <ul className="cinta flex w-max gap-4 px-2">
            {[...picks, ...picks].map((p, i) => (
              <li key={`${p.slug}-${i}`} aria-hidden={i >= picks.length || undefined}>
                <Link
                  to={`/producto/${p.slug}`}
                  tabIndex={i >= picks.length ? -1 : undefined}
                  className="group block w-40 md:w-48"
                >
                  <span
                    className="block aspect-square overflow-hidden rounded-[22px] transition-transform duration-500 ease-out group-hover:-translate-y-2"
                    style={{
                      background: p.perfume
                        ? `radial-gradient(70% 38% at 50% 96%, ${p.hue}40, transparent 75%), linear-gradient(180deg, #f7f5f1, #ece8e1)`
                        : "var(--surface-2)",
                    }}
                  >
                    <img
                      src={p.image!.replace(/\.webp$/, "-sm.webp")}
                      alt=""
                      width={360}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full ${p.perfume ? "object-contain p-2 mix-blend-multiply" : "object-cover"}`}
                    />
                  </span>
                  <span className="mt-3 block truncate px-1 text-xs font-semibold uppercase tracking-[0.08em] text-faint">
                    {p.perfume ? "Perfumería" : p.articulo!.line === "relojeria" ? "Relojería" : "Tecnología"}
                  </span>
                  <span className="block truncate px-1 font-bold group-hover:text-gold">{p.name}</span>
                  <span className="num block px-1 text-sm text-mute">{formatCOP(p.plans[0].price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
