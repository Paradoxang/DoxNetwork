import { ArrowUpRight, Code2 } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { CategoryIcon, LineIcon } from "@/components/CategoryIcon";
import { SectionHeading } from "@/components/SectionHeading";
import { glowHandlers } from "@/components/ui/glowing-effect";
import { allProducts, categories, fromPrice, products, upcoming } from "@/data/catalog";
import { destacados, thumbOf } from "@/data/destacados";
import { lineaOf, lineaOrder, lineas, type LineaId } from "@/data/lineas";
import { formatCOP } from "@/data/site";
import { useBatchReveal } from "@/lib/useBatchReveal";

const stats = Object.fromEntries(
  lineaOrder.map((id) => {
    const list = allProducts.filter((p) => lineaOf(p) === id);
    return [id, { count: list.length, min: Math.min(...list.map(fromPrice).filter((n) => n > 0)) }];
  })
) as Record<LineaId, { count: number; min: number }>;

const isNew: Partial<Record<LineaId, boolean>> = { relojeria: true, tecnologia: true };

/**
 * La red completa en el inicio: una tarjeta grande por línea, con una muestra
 * de sus productos, y debajo las categorías digitales y Dox Designs. Antes
 * esta sección solo listaba categorías de streaming y software.
 */
export function Categories() {
  const scope = useRef<HTMLElement>(null);
  useBatchReveal(scope);

  return (
    <section ref={scope} id="categorias" className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <SectionHeading kicker="01 · La red" title="Todo lo que encuentras aquí">
        Cuatro líneas en una sola tienda, con el mismo carrito y el mismo WhatsApp.
      </SectionHeading>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {lineaOrder.map((id) => {
          const l = lineas[id];
          const thumbs = destacados[id].slice(0, 3);
          return (
            <li key={id} data-reveal>
              <Link
                to={l.path}
                {...glowHandlers}
                className="glow-border card card-hover group relative flex h-full flex-col overflow-hidden p-5"
                style={{ background: `radial-gradient(120% 80% at 100% 0%, ${l.hue}22, transparent 60%), var(--surface)` }}
              >
                <div className="flex items-start justify-between">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${l.hue}22`, color: l.hue }}
                  >
                    <LineIcon id={id} />
                  </span>
                  {isNew[id] ? (
                    <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold">Nuevo</span>
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </div>
                <p className="mt-5 text-xl font-extrabold leading-tight">{l.name}</p>
                <p className="mt-1 text-sm leading-snug text-mute">{l.blurb}</p>

                {/* Muestra: tres productos solapados que se abren al pasar el puntero */}
                <div className="mt-6 flex items-center" aria-hidden="true">
                  {thumbs.map((p, i) => (
                    <span
                      key={p.slug}
                      className={`relative block h-16 w-16 overflow-hidden rounded-2xl border-2 border-[var(--surface)] shadow-md transition-transform duration-500 ease-out ${
                        i ? "-ml-4 group-hover:translate-x-2" : ""
                      } ${i === 2 ? "group-hover:translate-x-4" : ""}`}
                      style={{ zIndex: 3 - i, background: p.perfume ? "linear-gradient(180deg,#f7f5f1,#ece8e1)" : "var(--surface-2)" }}
                    >
                      <img
                        src={thumbOf(p)}
                        alt=""
                        width={64}
                        height={64}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full ${p.perfume ? "object-contain p-1 mix-blend-multiply" : "object-cover"}`}
                      />
                    </span>
                  ))}
                </div>

                <p className="num mt-auto pt-5 text-xs text-faint">
                  {stats[id].count} productos · desde <span className="text-ink">{formatCOP(stats[id].min)}</span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Dentro de Digital: sus categorías, más Dox Designs y lo que viene */}
      <div data-reveal className="mt-8 overflow-hidden rounded-[22px] border border-line p-4 md:p-5">
        <p className="kicker text-faint">Categorías digitales</p>
        <ul className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {categories.map((c) => (
            <li key={c.id} className="shrink-0">
              <Link to={`/catalogo?categoria=${c.id}`} className="chip whitespace-nowrap">
                <CategoryIcon id={c.id} className="h-4 w-4" />
                {c.name}
                <span className="text-xs text-faint">{products.filter((p) => p.category === c.id).length}</span>
              </Link>
            </li>
          ))}
          <li className="shrink-0">
            <Link to="/#dox-designs" className="chip whitespace-nowrap">
              <Code2 className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
              Páginas web · Dox Designs
            </Link>
          </li>
          {upcoming.map((u) => (
            <li key={u.name} className="shrink-0">
              <span className="chip cursor-default whitespace-nowrap border-dashed text-faint" aria-label={`${u.name}, próximamente`}>
                {u.name} · Próximamente
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
