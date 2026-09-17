import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { NumberTicker } from "@/components/ui/number-ticker";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { formatCOP, site, waLink } from "@/data/site";

export interface RailFilter {
  key: string;
  label: string;
  count?: number;
  active: boolean;
  onSelect: () => void;
}

export interface RailGroup {
  label: string;
  items: RailFilter[];
}

/**
 * Rail lateral fijo de las colecciones (idea de Kraken Industries, que mete la
 * identidad en una columna fija y deja todo el ancho al producto).
 *
 * Aquí resuelve un problema concreto: en las colecciones los filtros empujan la
 * rejilla media pantalla hacia abajo. En el rail están siempre a la vista y sin
 * robar altura. Aparece desde 1280 px; por debajo mandan los chips de arriba,
 * que siguen intactos. No duplica estado: los mismos `onSelect` que usan los
 * chips, así que la URL sigue siendo la única fuente de verdad.
 *
 * Se esconde al llegar al pie para no taparle los enlaces.
 */
export function SideRail({
  linea,
  total,
  minPrice,
  grupos,
  nota,
}: {
  linea: { name: string; blurb: string; path: string; hue: string };
  total: number;
  minPrice: number;
  grupos: RailGroup[];
  /** Aviso propio de la línea (por ejemplo, el +18 de vapes). */
  nota?: ReactNode;
}) {
  const [enPie, setEnPie] = useState(false);

  useEffect(() => {
    const pie = document.querySelector("footer");
    if (!pie) return;
    const io = new IntersectionObserver(([e]) => setEnPie(e.isIntersecting), { rootMargin: "0px 0px -40% 0px" });
    io.observe(pie);
    return () => io.disconnect();
  }, []);

  return (
    <aside
      aria-label={`Filtros de ${linea.name.toLowerCase()}`}
      className={`fixed bottom-0 left-0 top-[72px] z-30 hidden w-[228px] flex-col border-r border-line px-5 pb-6 pt-7 backdrop-blur-xl transition-opacity duration-300 xl:flex ${
        enPie ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ background: `linear-gradient(180deg, ${linea.hue}14, transparent 42%), color-mix(in srgb, var(--bg) 82%, transparent)` }}
    >
      <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">Colección</p>
      <p className="mt-1.5 text-xl font-bold leading-tight" style={{ color: linea.hue }}>
        {linea.name}
      </p>
      <p className="mt-1 text-[12.5px] leading-snug text-mute">{linea.blurb}</p>
      <p className="num mt-3 text-xs text-faint">
        <NumberTicker value={total} className="text-ink" /> productos · desde <span className="text-ink">{formatCOP(minPrice)}</span>
      </p>

      {/* Los filtros, siempre a la vista */}
      <div className="no-scrollbar mt-6 flex-1 overflow-y-auto [mask-image:linear-gradient(180deg,#000_92%,transparent)]">
        {grupos
          .filter((g) => g.items.length > 1)
          .map((g) => (
            <div key={g.label} className="mb-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">{g.label}</p>
              <ul className="mt-2 space-y-0.5">
                {g.items.map((it) => (
                  <li key={it.key}>
                    <button
                      type="button"
                      onClick={it.onSelect}
                      aria-pressed={it.active}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[13.5px] transition-colors ${
                        it.active ? "bg-neb-soft font-semibold text-neb" : "text-mute hover:bg-surface hover:text-ink"
                      }`}
                    >
                      <span className="truncate">{it.label}</span>
                      {it.count !== undefined && <span className="num shrink-0 text-[11px] text-faint">{it.count}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        {nota}
      </div>

      {/* Pie del rail: a quién le escribes y desde dónde te atienden */}
      <div className="mt-4 border-t border-line pt-4">
        <a
          href={waLink(`Hola ${site.name}, estoy viendo ${linea.name.toLowerCase()} y tengo una pregunta.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[13px] font-semibold text-mint hover:underline"
        >
          <WhatsAppIcon className="h-4 w-4" /> Escríbenos
        </a>
        <Link to="/catalogo" className="mt-2 flex items-center gap-1.5 text-[13px] text-mute transition-colors hover:text-ink">
          Ver toda la tienda <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
        <p className="num mt-3 text-[10.5px] leading-relaxed text-faint">
          {site.hours}
          <br />
          Cali, Colombia · 3.45°N 76.53°W
        </p>
      </div>
    </aside>
  );
}
