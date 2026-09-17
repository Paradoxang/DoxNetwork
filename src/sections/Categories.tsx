import { ArrowUpRight, Code2 } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { CategoryIcon, LineIcon } from "@/components/CategoryIcon";
import { SectionHeading } from "@/components/SectionHeading";
import { glowHandlers } from "@/components/ui/glowing-effect";
import { allProducts, categories, fromPrice, products, upcoming, type Product } from "@/data/catalog";
import { destacados, thumbOf } from "@/data/destacados";
import { lineaOf, lineaOrder, lineas, type LineaId } from "@/data/lineas";
import { recortes } from "@/data/recortes";
import { formatCOP } from "@/data/site";
import { useBatchReveal } from "@/lib/useBatchReveal";

const stats = Object.fromEntries(
  lineaOrder.map((id) => {
    const list = allProducts.filter((p) => lineaOf(p) === id);
    return [id, { count: list.length, min: Math.min(...list.map(fromPrice).filter((n) => n > 0)) }];
  })
) as Record<LineaId, { count: number; min: number }>;

const isNew: Partial<Record<LineaId, boolean>> = { relojeria: true, tecnologia: true };

/** Miniatura sin fondo cuando existe, así flota en el lecho común. */
const cutThumb = (p: Product) => (p.image && recortes.has(p.image) ? p.image.replace(/\.webp$/, "-cut-sm.webp") : thumbOf(p));

/**
 * 01 · La red, como Bento Grid (brief de rediseño, fase 2): el tamaño de cada
 * baldosa sigue al peso de la línea. Perfumería (176) y Tecnología (204) van
 * grandes, Relojería mediana, Páginas web chica, y Digital ocupa una franja
 * con sus categorías dentro. El borde luminoso es la única respuesta al puntero.
 */
export function Categories() {
  const scope = useRef<HTMLElement>(null);
  useBatchReveal(scope);

  return (
    <section ref={scope} id="categorias" className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <SectionHeading kicker="01 · La red" title="Todo lo que encuentras aquí">
        Cuatro líneas en una sola tienda, con el mismo carrito y el mismo WhatsApp.
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
            className="glow-border card card-hover group relative flex h-full min-h-[248px] flex-col overflow-hidden p-4 md:p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neb-soft text-neb">
              <Code2 className="h-5 w-5" aria-hidden="true" strokeWidth={1.8} />
            </span>
            <p className="mt-auto pt-6 text-lg font-bold leading-tight">Páginas web</p>
            <p className="mt-1 text-[13px] leading-snug text-mute">A la medida, con Dox Designs</p>
            <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-faint" aria-hidden="true" />
          </Link>
        </li>

        {/* Digital: franja completa con sus categorías */}
        <li data-reveal className="col-span-2 lg:col-span-6">
          <div
            {...glowHandlers}
            className="glow-border card relative grid gap-5 overflow-hidden p-5 md:p-6 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-center lg:gap-8"
            style={{ background: `radial-gradient(90% 140% at 0% 0%, ${lineas.digital.hue}1f, transparent 60%), var(--surface)` }}
          >
            <Link to={lineas.digital.path} className="group flex items-start gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: `${lineas.digital.hue}22`, color: lineas.digital.hue }}
              >
                <LineIcon id="digital" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-xl font-bold leading-tight group-hover:text-neb">
                  {lineas.digital.name} <ArrowUpRight className="h-4 w-4 text-faint" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm leading-snug text-mute">{lineas.digital.blurb}</span>
                <span className="num mt-2 block text-xs text-faint">
                  {stats.digital.count} productos · desde <span className="text-ink">{formatCOP(stats.digital.min)}</span>
                </span>
              </span>
            </Link>
            <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
              {categories.map((c) => (
                <li key={c.id} className="shrink-0">
                  <Link to={`/catalogo?categoria=${c.id}`} className="chip whitespace-nowrap">
                    <CategoryIcon id={c.id} className="h-4 w-4" />
                    {c.name}
                    <span className="text-xs text-faint">{products.filter((p) => p.category === c.id).length}</span>
                  </Link>
                </li>
              ))}
              {upcoming.map((u) => (
                <li key={u.name} className="shrink-0">
                  <span className="chip cursor-default whitespace-nowrap border-dashed text-faint" aria-label={`${u.name}, próximamente`}>
                    {u.name} · Próximamente
                  </span>
                </li>
              ))}
            </ul>
          </div>
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
      className={`glow-border card card-hover group relative flex h-full flex-col overflow-hidden ${compact ? "p-4 md:p-5" : "p-5 md:p-6"} ${className}`}
      style={{ background: `radial-gradient(120% 80% at 100% 0%, ${l.hue}22, transparent 60%), var(--surface)` }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex shrink-0 items-center justify-center rounded-2xl ${compact ? "h-10 w-10" : "h-11 w-11"}`}
          style={{ background: `${l.hue}22`, color: l.hue }}
        >
          <LineIcon id={id} />
        </span>
        {isNew[id] ? (
          <span className="rounded-full bg-gold-soft px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-gold">Nuevo</span>
        ) : (
          <ArrowUpRight className="h-4 w-4 text-faint" aria-hidden="true" />
        )}
      </div>
      <p className={`mt-4 font-bold leading-tight ${compact ? "text-lg" : "text-2xl"}`}>{l.name}</p>
      <p className={`mt-1 leading-snug text-mute ${compact ? "text-[13px]" : "text-sm"}`}>{l.blurb}</p>

      <div className="relative mt-5 flex flex-1 items-end">{children}</div>

      <p className="num mt-4 text-xs text-faint">
        {stats[id].count} productos · desde <span className="text-ink">{formatCOP(stats[id].min)}</span>
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
            src={cutThumb(p)}
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
