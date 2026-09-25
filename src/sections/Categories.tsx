import { ArrowUpRight, Code2, PawPrint } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Astro, type AstroPose } from "@/components/Astro";
import { LineIcon } from "@/components/CategoryIcon";
import { Deco, type DecoName } from "@/components/Deco";
import { SectionHeading } from "@/components/SectionHeading";
import { glowHandlers } from "@/components/ui/glowing-effect";
import { NumberTicker } from "@/components/ui/number-ticker";
import { allProducts, fromPrice, type Product } from "@/data/catalog";
import { comedero, imagenes, lineaMascotas } from "@/data/comedero";
import { destacados, microThumbOf } from "@/data/destacados";
import { lineaOf, lineaOrder, lineas, vapes, type LineaId } from "@/data/lineas";
import { tint } from "@/data/paleta";
import { formatCOP } from "@/data/site";
import { useBatchReveal } from "@/lib/useBatchReveal";

const stats = Object.fromEntries(
  lineaOrder.map((id) => {
    const list = allProducts.filter((p) => lineaOf(p) === id);
    return [id, { count: list.length, min: Math.min(...list.map(fromPrice).filter((n) => n > 0)) }];
  })
) as Record<LineaId, { count: number; min: number }>;

const isNew: Partial<Record<LineaId, boolean>> = {};

/** ASTRO presenta cada línea desde la esquina de su baldosa. */
const chibi: Partial<Record<LineaId, AstroPose>> = {
  perfumeria: "chibi-perfume",
  relojeria: "chibi-reloj",
  tecnologia: "chibi-audifonos",
  vapes: "chibi-mayor-edad",
};

/** Atrezo por línea: el cristal para perfumería, el astrolabio para relojería… */
const adorno: Partial<Record<LineaId, DecoName>> = {
  perfumeria: "cristal-1",
  relojeria: "astrolabio",
  tecnologia: "modulo",
};

/**
 * 01 · La red, como Bento Grid (brief de rediseño, fase 2): el tamaño de cada
 * baldosa sigue al peso de la línea. Perfumería, el foco de la tienda, es la
 * más alta; Tecnología va ancha, Relojería mediana, Páginas web chica, y
 * Mascotas ocupa la franja que era de lo digital hasta el 25-sep-2026. El
 * borde luminoso es la única respuesta al puntero.
 */
export function Categories() {
  const scope = useRef<HTMLElement>(null);
  useBatchReveal(scope);

  return (
    <section ref={scope} id="categorias" className="mx-auto max-w-[1200px] px-4 pb-10 pt-20 md:px-6 md:pb-12 md:pt-24">
      <SectionHeading kicker="01 · La red" title="Todo lo que encuentras aquí">
        Perfumería primero, y relojería, tecnología y mascotas en la misma tienda, con el mismo carrito y el mismo WhatsApp.
      </SectionHeading>

      <ul className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-6 lg:grid-rows-[auto_auto_auto]">
        {/* Perfumería: la baldosa más alta */}
        <li data-reveal className="col-span-2 lg:col-span-3 lg:row-span-2">
          <Tile id="perfumeria">
            <Showcase items={destacados.perfumeria.slice(0, 6)} layout="grid" />
          </Tile>
        </li>

        {/* Tecnología: ancha */}
        <li data-reveal className="col-span-2 lg:col-span-3">
          <Tile id="tecnologia" className="min-h-[260px]">
            <Showcase items={destacados.tecnologia.slice(0, 4)} layout="row" />
          </Tile>
        </li>

        {/* Relojería: mediana */}
        <li data-reveal className="col-span-1 lg:col-span-2">
          <Tile id="relojeria" className="min-h-[248px]" compact>
            <Showcase items={destacados.relojeria.slice(0, 3)} layout="row" small />
          </Tile>
        </li>

        {/* Páginas web: chica, un solo servicio */}
        <li data-reveal className="col-span-1">
          <Link
            to="/#dox-designs"
            {...glowHandlers}
            className="glow-border card card-hover group relative flex min-h-[248px] flex-col overflow-hidden p-4 md:p-5 lg:min-h-full"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neb-soft text-neb">
              <Code2 className="h-5 w-5" aria-hidden="true" strokeWidth={1.8} />
            </span>
            <p className="mt-auto pt-6 text-lg font-bold leading-tight">Páginas web</p>
            <p className="mt-1 text-[13px] leading-snug text-mute">A la medida, con Dox Designs</p>
            <Deco name="diagrama" className="deco-esquina -bottom-6 -right-10 w-44" opacity={0.28} />
            <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-faint" aria-hidden="true" />
          </Link>
        </li>

        {/* Mascotas: el comedero, que vive en Shopify y se paga al recibir */}
        <li data-reveal className="col-span-2 lg:col-span-4">
          <Link
            to={lineaMascotas.path}
            {...glowHandlers}
            className="glow-border card card-hover group relative flex min-h-full flex-col gap-5 overflow-hidden p-5 sm:flex-row sm:items-center md:p-6"
            style={{ background: `radial-gradient(90% 140% at 0% 0%, ${tint(lineaMascotas.hue, 16)}, transparent 60%), var(--surface)`, borderColor: tint(lineaMascotas.hue, 24) }}
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: tint(lineaMascotas.hue, 18), color: lineaMascotas.hue }}
                >
                  <PawPrint className="h-5 w-5" aria-hidden="true" strokeWidth={1.8} />
                </span>
                <span className="rounded-full bg-gold-soft px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-gold sm:hidden">Nuevo</span>
              </span>
              <span className="mt-4 flex items-center gap-2 text-2xl font-bold leading-tight group-hover:text-neb">
                {lineaMascotas.name} <ArrowUpRight className="h-4 w-4 text-faint" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-sm leading-snug text-mute">{comedero.nombre}</span>
              <span className="num mt-3 block text-xs text-faint">
                <span className="text-ink">{formatCOP(comedero.precio)}</span> · envío gratis · pagas al recibir
              </span>
            </span>
            <span className="product-media aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl sm:w-[44%]" aria-hidden="true">
              <img
                src={imagenes.portadaSm}
                alt=""
                width={480}
                height={360}
                loading="lazy"
                decoding="async"
                className="relative z-[1] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </span>
          </Link>
        </li>
        {/* Vapes: su propia baldosa, sin fotos ni precios y con la verificación de edad */}
        <li data-reveal className="col-span-2 lg:col-span-2">
          <Link
            to={lineas.vapes.path}
            {...glowHandlers}
            className="glow-border card card-hover group relative flex min-h-full flex-col overflow-hidden p-5 md:p-6"
            style={{ background: `radial-gradient(120% 80% at 100% 0%, ${tint(lineas.vapes.hue, 16)}, transparent 60%), var(--surface)` }}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: tint(lineas.vapes.hue, 18), color: lineas.vapes.hue }}
              >
                <LineIcon id="vapes" />
              </span>
              <span className="rounded-full border border-gold/40 bg-gold-soft px-2.5 py-0.5 font-mono text-[12px] font-bold text-gold">+18</span>
            </div>
            <p className="mt-4 text-2xl font-bold leading-tight md:pr-28">{lineas.vapes.name}</p>
            <p className="mt-1 text-sm leading-snug text-mute md:pr-28">{lineas.vapes.blurb}</p>
            <p className="mt-4 text-[13px] leading-relaxed text-faint md:pr-24">
              Al entrar se verifica tu edad. Contienen nicotina, una sustancia adictiva que afecta la salud.
            </p>
            <p className="num mt-auto pt-5 text-xs text-faint">
              <NumberTicker value={vapes.length} className="text-ink" /> referencias
            </p>
            <div className="pointer-events-none absolute right-3 top-14 z-10 hidden h-28 md:block">
              <Astro pose="chibi-mayor-edad" small enter={false} decorative className="h-full" />
            </div>
          </Link>
        </li>
      </ul>
    </section>
  );
}

function Tile({ id, className = "", compact = false, children }: { id: LineaId; className?: string; compact?: boolean; children: ReactNode }) {
  const l = lineas[id];
  return (
    <Link
      to={l.path}
      {...glowHandlers}
      className={`glow-border card card-hover group relative flex min-h-full flex-col overflow-hidden ${compact ? "p-4 md:p-5" : "p-5 md:p-6"} ${className}`}
      style={{ background: `radial-gradient(120% 80% at 100% 0%, ${tint(l.hue, 20)}, transparent 62%), var(--surface)`, borderColor: tint(l.hue, 26) }}
    >
      {adorno[id] && <Deco name={adorno[id]!} className={`deco-esquina -right-8 -top-8 ${compact ? "w-28" : "w-40"}`} opacity={0.3} />}
      {chibi[id] && (
        <div className={`pointer-events-none absolute right-3 top-2 z-10 hidden md:block ${compact ? "h-24" : "h-32"}`}>
          <Astro pose={chibi[id]!} small enter={false} decorative className="h-full" />
        </div>
      )}
      <div className="relative flex items-start justify-between gap-3">
        <span
          className={`flex shrink-0 items-center justify-center rounded-2xl ${compact ? "h-10 w-10" : "h-11 w-11"}`}
          style={{ background: tint(l.hue, 18), color: l.hue }}
        >
          <LineIcon id={id} />
        </span>
        {isNew[id] ? (
          <span className="rounded-full bg-gold-soft px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-gold">Nuevo</span>
        ) : (
          <ArrowUpRight className="h-4 w-4 text-faint" aria-hidden="true" />
        )}
      </div>
      <p className={`mt-4 font-bold leading-tight md:pr-24 ${compact ? "text-lg" : "text-2xl"}`}>{l.name}</p>
      <p className={`mt-1 leading-snug text-mute md:pr-24 ${compact ? "text-[13px]" : "text-sm"}`}>{l.blurb}</p>

      <div className="relative mt-5 flex flex-1 items-center">{children}</div>

      <p className="num mt-4 text-xs text-faint">
        <NumberTicker value={stats[id].count} className="text-ink" /> productos · desde{" "}
        <span className="text-ink">{formatCOP(stats[id].min)}</span>
      </p>
    </Link>
  );
}

/** Muestra de productos sobre el lecho común, en fila o en rejilla de tres. */
function Showcase({ items, layout, small = false }: { items: Product[]; layout: "grid" | "row"; small?: boolean }) {
  const cols = layout === "grid" ? 3 : items.length;
  return (
    <div className="grid w-full gap-2 md:gap-2.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} aria-hidden="true">
      {items.map((p, i) => (
        <span key={p.slug} className={`product-media aspect-square rounded-2xl ${small && i === 2 ? "max-lg:hidden" : ""}`}>
          <img
            src={microThumbOf(p)}
            alt=""
            width={180}
            height={180}
            loading="lazy"
            decoding="async"
            className="product-media-img relative z-[1] h-full w-full object-contain p-[10%]"
          />
        </span>
      ))}
    </div>
  );
}
