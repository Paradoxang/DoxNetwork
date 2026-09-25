import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { Telon } from "@/components/Telon";
import { ProductArt } from "@/components/ProductArt";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { InfiniteDragScroll } from "@/components/ui/infinite-drag-scroll";
import { NumberTicker } from "@/components/ui/number-ticker";
import { isAvailable, productBySlug, type Product } from "@/data/catalog";
import { destacados } from "@/data/destacados";
import { matchesPara, paraOptions, perfumeMinPrice, perfumes, shipping, stockSecreto } from "@/data/perfumeria";
import { formatCOP, waLink } from "@/data/site";
import { Reveal } from "@/lib/anim";
import { useAnimacion } from "@/lib/motion";

// Los destacados de perfumería y, detrás, más fragancias reconocibles de casas distintas
const picks: Product[] = [
  ...destacados.perfumeria,
  ...[
    "perfume-lattafa-asad-elixir",
    "perfume-armaf-club-de-nuit-intense-man",
    "perfume-jean-paul-gaultier-le-male-elixir",
    "perfume-versace-eros-flame",
    "perfume-carolina-herrera-212-vip-rose",
    "perfume-lattafa-yara-candy",
    "perfume-paco-rabanne-invictus",
    "perfume-victoria-s-secret-bombshell-intense",
  ]
    .map((s) => productBySlug(s))
    .filter((p): p is Product => Boolean(p && isAvailable(p))),
];

/**
 * 02 · Perfumería, la sección a sangre del inicio. Ocupa el sitio que tenían
 * los combos desde que la tienda dejó lo digital (25-sep-2026): el foco es la
 * perfumería. Vuelve el agujero negro del hero como resplandor violeta
 * detrás de una fila de fragancias que corre sola y se arrastra.
 */
export function PerfumeriaSection() {
  const scope = useRef<HTMLElement>(null);

  useAnimacion(
    ({ gsap }) => {
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
    <section ref={scope} id="perfumes" className="echo-section slant relative isolate overflow-hidden py-20 md:py-28">
      {/* Eco del agujero negro: núcleo oscuro con disco violeta */}
      <div data-halo aria-hidden="true" className="hole-echo pointer-events-none absolute -right-[18%] -top-[12%] -z-10 w-[min(1100px,120vw)]" />
      <Telon name="telon-perfumeria" opacity={0.3} className="h-[60%]" />
      {/* Arriba a la derecha: abajo se montaba sobre los nombres de producto */}
      <div className="pointer-events-none absolute right-8 top-6 hidden h-28 xl:block">
        <Astro pose="chibi-perfume" small decorative className="h-full" />
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 md:grid-cols-[1fr_auto] md:items-end md:px-6">
        <Reveal>
          <p className="kicker">02 · Perfumería</p>
          <h2 className="display mt-4 text-[clamp(30px,4.6vw,52px)]">Las fragancias más pedidas</h2>
          <div className="mt-4 flex items-end gap-4">
            <span className="display text-[clamp(64px,10vw,140px)] leading-[0.82]">
              <NumberTicker value={perfumes.length} />
            </span>
            <p className="mb-2 max-w-[280px] text-sm leading-snug text-mute md:mb-4">
              perfumes 1.1 y AAA desde {formatCOP(perfumeMinPrice)}. {shipping.short}.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {paraOptions.map((o) => (
              <Link key={o.id} to={`/perfumeria?para=${o.id}`} className="chip">
                {o.label} <NumberTicker value={perfumes.filter((p) => matchesPara(p, o.id)).length} className="text-xs text-faint" />
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <Link to="/perfumeria" className="btn btn-primary">
            Ver las {perfumes.length} fragancias <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={waLink(stockSecreto.mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-mint hover:underline"
          >
            <WhatsAppIcon className="h-4 w-4" /> ¿No está la tuya? Stock secreto 😉
          </a>
        </Reveal>
      </div>

      <InfiniteDragScroll
        label="Fragancias destacadas. Arrastra para ver más."
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
            <span className="mt-3 block truncate px-1 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{p.perfume!.brand || "Perfumería"}</span>
            <span className="block truncate px-1 font-semibold group-hover:text-neb">{p.perfume!.line}</span>
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
