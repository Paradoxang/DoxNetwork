import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { Telon } from "@/components/Telon";
import { ProductArt } from "@/components/ProductArt";
import { InfiniteDragScroll } from "@/components/ui/infinite-drag-scroll";
import { NumberTicker } from "@/components/ui/number-ticker";
import type { Product } from "@/data/catalog";
import { destacados } from "@/data/destacados";
import { relojes, tecnologia } from "@/data/lineas";
import { perfumes, shipping } from "@/data/perfumeria";
import { formatCOP } from "@/data/site";
import { Reveal } from "@/lib/anim";
import { gsap, useGSAP } from "@/lib/gsap";

// Perfume, reloj, tecnología, perfume…: la fila muestra las tres líneas físicas
const picks: Product[] = [];
for (let i = 0; i < 8; i++) for (const id of ["perfumeria", "relojeria", "tecnologia"] as const) if (destacados[id][i]) picks.push(destacados[id][i]);

const shortcuts = [
  { to: "/perfumeria", label: "Perfumería", count: perfumes.length },
  { to: "/relojeria", label: "Relojería", count: relojes.length },
  { to: "/tecnologia", label: "Tecnología", count: tecnologia.length },
];

const lineLabel = (p: Product) => (p.perfume ? "Perfumería" : p.articulo!.line === "relojeria" ? "Relojería" : "Tecnología");

/**
 * Las líneas físicas en el inicio, a sangre (brief de rediseño): es la
 * sección "full-bleed" del ritmo de fondos y la primera vez que vuelve el
 * agujero negro del hero, como resplandor violeta detrás de la fila.
 * La fila es un Infinite Drag Scroll: corre sola y se arrastra.
 */
export function TiendaTeaser() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-halo]",
          { yPercent: -12 },
          { yPercent: 12, ease: "none", scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} id="envios" className="echo-section slant relative isolate overflow-hidden py-20 md:py-28">
      {/* Eco del agujero negro: núcleo oscuro con disco violeta */}
      <div data-halo aria-hidden="true" className="hole-echo pointer-events-none absolute -right-[18%] -top-[12%] -z-10 w-[min(1100px,120vw)]" />
      <Telon name="telon-nebulosa" opacity={0.3} className="h-[60%]" />
      <div className="pointer-events-none absolute -bottom-2 right-6 hidden h-40 xl:block">
        <Astro pose="chibi-envios" small decorative className="h-full" />
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 md:grid-cols-[1fr_auto] md:items-end md:px-6">
        <Reveal>
          <p className="kicker">Tienda física · Nuevo</p>
          <h2 className="display mt-4 text-[clamp(30px,4.6vw,52px)]">Perfumes, relojes y tecnología</h2>
          <div className="mt-4 flex items-end gap-4">
            <span className="display text-[clamp(64px,10vw,140px)] leading-[0.82]">
              <NumberTicker value={perfumes.length + relojes.length + tecnologia.length} />
            </span>
            <p className="mb-2 max-w-[260px] text-sm leading-snug text-mute md:mb-4">
              productos físicos que confirmas por WhatsApp. {shipping.short}.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {shortcuts.map((s) => (
              <Link key={s.to} to={s.to} className="chip">
                {s.label} <NumberTicker value={s.count} className="text-xs text-faint" />
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <Link to="/catalogo" className="btn btn-primary">
            Ver toda la tienda <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">Sin registro · pagas al confirmar</p>
        </Reveal>
      </div>

      <InfiniteDragScroll
        label="Productos físicos destacados. Arrastra para ver más."
        items={picks}
        getKey={(p) => p.slug}
        className="mt-12 [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]"
        itemClassName="pr-3 md:pr-4"
        renderItem={(p, decorative) => (
          <Link
            to={`/producto/${p.slug}`}
            tabIndex={decorative ? -1 : undefined}
            draggable={false}
            className="group block w-44 rounded-[22px] md:w-56"
          >
            <ProductArt product={p} size="sm" bare className="rounded-[22px]" />
            <span className="mt-3 block truncate px-1 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{lineLabel(p)}</span>
            <span className="block truncate px-1 font-semibold group-hover:text-neb">{p.name}</span>
            <span className="num block px-1 text-sm text-mute">{formatCOP(p.plans[0].price)}</span>
          </Link>
        )}
      />
      <p className="mx-auto mt-4 max-w-[1200px] px-4 text-xs text-faint md:px-6" aria-hidden="true">
        Arrastra la fila para ver más
      </p>
    </section>
  );
}
