import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Info, Plus, Search, Truck, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { LineIcon } from "@/components/CategoryIcon";
import { ProductCard } from "@/components/ProductCard";
import { FaqItem, Select, useUrlFilters } from "@/components/ShopControls";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Seo } from "@/components/Seo";
import { productBySlug, type Product } from "@/data/catalog";
import { destacados } from "@/data/destacados";
import { articulos, conditionInfo, lineas, subLabel, type Condicion, type SubId } from "@/data/lineas";
import { disclaimer, shipping } from "@/data/perfumeria";
import { formatCOP, site, waLink } from "@/data/site";
import { EASE, Reveal, scrollToTarget } from "@/lib/anim";
import { gsap, useGSAP } from "@/lib/gsap";
import { normalize } from "@/lib/ui";

type LineaFisica = "relojeria" | "tecnologia";
type Sort = "destacados" | "menor" | "mayor" | "az";

const PAGE = 24;

interface Config {
  kicker: string;
  title: [string, string];
  text: string;
  showcase: string[];
  /** Atajos del hero: filtros prearmados. */
  tiles: { label: string; hint: string; params: Record<string, string> }[];
  faqs: { q: string; a: string }[];
}

const replicaFaq = {
  q: "¿Qué diferencia hay entre original y réplica?",
  a: `${conditionInfo.original.text} Las réplicas imitan el diseño de un modelo conocido. ${disclaimer} Cada ficha dice cuál es.`,
};
const shippingFaq = { q: "¿Cómo llega mi pedido?", a: `${shipping.short}. ${shipping.detail}` };
const mixFaq = {
  q: "¿Puedo pedir junto con productos digitales o perfumes?",
  a: "Sí, en el mismo carrito. Lo digital llega por WhatsApp y lo físico por envío. El descuento por combinar aplica solo a los productos digitales.",
};

const configs: Record<LineaFisica, Config> = {
  relojeria: {
    kicker: "Relojería · Nuevo",
    title: ["Relojes que", "se notan"],
    text: "Kairos originales, ediciones oficiales de Nacional, América y la Selección, y réplicas de los modelos más buscados. Confirmas por WhatsApp y te lo enviamos.",
    showcase: ["relojeria-rolex-submarine-f11", "relojeria-kairos-oficial-seleccion-colombia", "relojeria-audemars-piguet-royal-oak-ch125"],
    tiles: [
      { label: "Originales", hint: "Kairos y Q&Q", params: { condicion: "original" } },
      { label: "Réplicas", hint: "Rolex, Patek, Hublot, AP", params: { condicion: "replica" } },
      { label: "Fútbol oficial", hint: "Nacional, América, Selección", params: { q: "oficial" } },
      { label: "Para regalar", hint: "Combos de pareja y económicos", params: { q: "combo" } },
    ],
    faqs: [replicaFaq, shippingFaq, { q: "¿Tienen garantía?", a: "Depende del reloj. Antes de pagar te confirmamos por escrito la garantía que aplica a tu modelo." }, mixFaq],
  },
  tecnologia: {
    kicker: "Tecnología · Nuevo",
    title: ["Tecnología para", "todo el día"],
    text: "Audífonos y parlantes, smartwatches, cargadores, gaming, soportes y gadgets. Precios claros, confirmas por WhatsApp y te lo enviamos a toda Colombia.",
    showcase: ["tecnologia-parlante-portatil-kimiso-kms-374", "tecnologia-smartwatch-mobulaa-ub6-pro", "tecnologia-proyector-hy300"],
    tiles: [
      { label: "Audio", hint: "Audífonos, diademas y parlantes", params: { sub: "audio" } },
      { label: "Smartwatches", hint: "Con correas y combos", params: { sub: "smartwatches" } },
      { label: "Carga y cables", hint: "Cargadores y power banks", params: { sub: "carga" } },
      { label: "Gaming y TV", hint: "Consolas, proyectores y TV", params: { sub: "gaming" } },
    ],
    faqs: [shippingFaq, replicaFaq, { q: "¿Tienen garantía?", a: "Depende del producto. Antes de pagar te confirmamos por escrito la garantía que aplica." }, mixFaq],
  },
};

/**
 * Página de una línea física (relojería o tecnología). Misma estructura que
 * la perfumería: vitrina en el hero, atajos, filtros en la URL, rejilla con
 * "ver más", preguntas y un CTA para pedir lo que no está.
 */
export function Coleccion({ linea }: { linea: LineaFisica }) {
  const config = configs[linea];
  const meta = lineas[linea];
  const reduced = useReducedMotion();
  const hero = useRef<HTMLElement>(null);
  const [limit, setLimit] = useState(PAGE);
  const { params, update, clear, animOn } = useUrlFilters(() => setLimit(PAGE));
  const motionOn = animOn && !reduced;

  const pool = useMemo(() => {
    const picked = new Set(destacados[linea].map((p) => p.slug));
    return articulos
      .filter((p) => p.articulo!.line === linea)
      .map((p, i) => ({ p, i, score: (picked.has(p.slug) ? 4 : 0) + (p.articulo!.brand ? 1 : 0) }))
      .sort((a, b) => b.score - a.score || a.i - b.i)
      .map((x) => x.p);
  }, [linea]);
  const subs = useMemo(() => [...new Set(pool.map((p) => p.articulo!.sub))] as SubId[], [pool]);
  const brands = useMemo(
    () => [...new Set(pool.map((p) => p.articulo!.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")),
    [pool]
  );
  const showcase = config.showcase.map((s) => productBySlug(s)).filter(Boolean) as Product[];
  const minPrice = Math.min(...pool.map((p) => p.plans[0].price));

  const q = params.get("q") ?? "";
  const sub = (params.get("sub") ?? "") as SubId | "";
  const condition = (params.get("condicion") ?? "") as Condicion | "";
  const brand = params.get("marca") ?? "";
  const sort = (params.get("orden") as Sort) || "destacados";

  const list = useMemo(() => {
    const words = normalize(q.trim()).split(/\s+/).filter(Boolean);
    const out = pool.filter((p) => {
      const info = p.articulo!;
      const hay = normalize(`${p.name} ${p.tagline} ${subLabel[info.sub]}`);
      return (
        (!sub || info.sub === sub) &&
        (!condition || info.condition === condition) &&
        (!brand || info.brand === brand) &&
        words.every((w) => hay.includes(w))
      );
    });
    // Agotados al final; sort() es estable, así el resto conserva el orden
    out.sort((a, b) => Number(b.stock !== 0) - Number(a.stock !== 0));
    if (sort === "menor") out.sort((a, b) => a.plans[0].price - b.plans[0].price);
    if (sort === "mayor") out.sort((a, b) => b.plans[0].price - a.plans[0].price);
    if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return out;
  }, [pool, q, sub, condition, brand, sort]);

  const hasFilters = Boolean(q || sub || condition || brand);
  const visible = list.slice(0, limit);
  const hasConditions = pool.some((p) => p.articulo!.condition);

  const goToGrid = () => {
    const el = document.getElementById("productos");
    if (el) scrollToTarget(el);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-plate]", {
          y: 60,
          opacity: 0,
          rotate: (i) => [-10, 0, 10][i] ?? 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.15,
        });
      });
      return () => mm.revert();
    },
    { scope: hero, dependencies: [linea], revertOnUpdate: true }
  );

  return (
    <>
      <Seo
        title={`${meta.name} · ${site.name}`}
        description={`${pool.length} productos de ${meta.name.toLowerCase()} desde ${formatCOP(minPrice)}. ${meta.blurb}. ${shipping.short}.`}
        path={meta.path}
      />

      {/* ── Hero ── */}
      <section ref={hero} className="relative mx-auto max-w-[1200px] px-4 pb-10 pt-[140px] md:px-6 md:pt-[164px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-24 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${meta.hue}30, transparent 70%)` }}
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <p className="kicker flex items-center gap-2">
              <LineIcon id={linea} className="h-4 w-4" /> {config.kicker}
            </p>
            <h1 className="display mt-3 text-[clamp(38px,6vw,68px)]">
              {config.title[0]} <span style={{ color: meta.hue }}>{config.title[1]}</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-mute">{config.text}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary" onClick={goToGrid}>
                Ver {meta.name.toLowerCase()} <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={waLink(`Hola ${site.name}, quiero asesoría en ${meta.name.toLowerCase()}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" /> Asesoría gratis
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <li className="flex items-center gap-2 text-mute">
                <BadgeCheck className="h-4 w-4" style={{ color: meta.hue }} />
                <span>
                  <strong className="text-ink">{pool.length}</strong> productos
                </span>
              </li>
              <li className="flex items-center gap-2 text-mute">
                Desde <strong className="text-ink">{formatCOP(minPrice)}</strong>
              </li>
              <li className="flex items-center gap-2 text-mute">
                <Truck className="h-4 w-4" style={{ color: meta.hue }} />
                {shipping.short}
              </li>
            </ul>
          </Reveal>

          {/* Vitrina: tres productos en abanico que se abren al pasar el puntero */}
          <div className="group/vitrina relative mx-auto h-[300px] w-full max-w-[520px] sm:h-[380px]" aria-hidden="true">
            <div className="absolute inset-x-6 bottom-2 h-10 rounded-[50%] bg-black/30 blur-2xl" />
            {showcase.map((p, i) => {
              const pos = [
                "left-[2%] top-[14%] -rotate-[9deg] group-hover/vitrina:-translate-x-3 group-hover/vitrina:-rotate-[13deg]",
                "left-1/2 top-0 z-10 -translate-x-1/2 group-hover/vitrina:-translate-y-3",
                "right-[2%] top-[14%] rotate-[9deg] group-hover/vitrina:translate-x-3 group-hover/vitrina:rotate-[13deg]",
              ][i];
              return (
                <div key={p.slug} className={`absolute w-[42%] transition-transform duration-700 ease-out ${pos}`}>
                  <Link
                    to={`/producto/${p.slug}`}
                    tabIndex={-1}
                    data-plate
                    className="relative block overflow-hidden rounded-[26px] border border-white/10 shadow-[0_30px_60px_-20px_rgba(3,6,15,0.7)]"
                  >
                    <div className={i === 1 ? "" : "flota"} style={{ animationDelay: `${i * -2.3}s` }}>
                      <img src={p.image} alt="" width={720} height={720} className="aspect-[4/5] w-full bg-surface-2 object-cover" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Atajos */}
        <Reveal delay={0.1} className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {config.tiles.map((t) => {
            const on = Object.entries(t.params).every(([k, v]) => params.get(k) === v);
            return (
              <button
                key={t.label}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  // Un atajo reemplaza los filtros: evita combinaciones vacías
                  const reset = { q: null, sub: null, condicion: null, marca: null };
                  update(on ? reset : { ...reset, ...t.params });
                  goToGrid();
                }}
                className="card card-hover flex flex-col items-start gap-1 p-4 text-left md:p-5"
                style={on ? { borderColor: meta.hue } : undefined}
              >
                <span className="font-bold">{t.label}</span>
                <span className="text-[13px] leading-snug text-mute">{t.hint}</span>
              </button>
            );
          })}
        </Reveal>
      </section>

      {/* ── Productos ── */}
      <section id="productos" className="mx-auto max-w-[1200px] scroll-mt-24 px-4 pb-16 pt-6 md:px-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <label htmlFor="col-q" className="sr-only">
                Buscar en {meta.name.toLowerCase()}
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-faint" />
              <input
                id="col-q"
                type="search"
                value={q}
                onChange={(e) => update({ q: e.target.value || null })}
                placeholder={linea === "relojeria" ? "Buscar: Kairos, Rolex, dama…" : "Buscar: AirPods, parlante, cargador…"}
                className="field pl-11"
                autoComplete="off"
              />
            </div>
            {brands.length > 1 && (
              <Select
                label="Marca"
                value={brand}
                onChange={(v) => update({ marca: v || null })}
                options={[{ value: "", label: "Todas las marcas" }, ...brands.map((b) => ({ value: b, label: b }))]}
              />
            )}
            <Select
              label="Ordenar"
              value={sort}
              onChange={(v) => update({ orden: v === "destacados" ? null : v })}
              options={[
                { value: "destacados", label: "Destacados" },
                { value: "menor", label: "Precio: menor a mayor" },
                { value: "mayor", label: "Precio: mayor a menor" },
                { value: "az", label: "Nombre: A–Z" },
              ]}
            />
          </div>

          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar">
            <button type="button" className="chip" aria-pressed={!sub && !condition} onClick={() => update({ sub: null, condicion: null })}>
              Todos
            </button>
            {subs.length > 1 &&
              subs.map((s) => (
                <button key={s} type="button" className="chip" aria-pressed={sub === s} onClick={() => update({ sub: sub === s ? null : s })}>
                  {subLabel[s]}
                  <span className="text-xs text-faint">{pool.filter((p) => p.articulo!.sub === s).length}</span>
                </button>
              ))}
            {hasConditions && subs.length > 1 && <span className="mx-1 hidden w-px self-stretch bg-line md:block" />}
            {hasConditions &&
              (Object.keys(conditionInfo) as Condicion[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  className="chip"
                  aria-pressed={condition === c}
                  onClick={() => update({ condicion: condition === c ? null : c })}
                >
                  {c === "original" ? "Originales" : "Réplicas"}
                </button>
              ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-faint" aria-live="polite">
          <span>
            {list.length} {list.length === 1 ? "producto" : "productos"}
          </span>
          {hasFilters && (
            <button type="button" onClick={clear} className="flex min-h-[44px] items-center gap-1.5 font-semibold text-mute hover:text-ink">
              <X className="h-4 w-4" /> Limpiar filtros
            </button>
          )}
        </div>

        <LayoutGroup>
          <motion.ul layout={motionOn} className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p) => (
                <motion.li
                  key={p.slug}
                  layout={motionOn}
                  initial={motionOn ? { opacity: 0, scale: 0.94 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={motionOn ? { opacity: 0, scale: 0.94, transition: { duration: 0.18 } } : undefined}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <ProductCard product={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        {list.length > limit && (
          <div className="mt-8 flex justify-center">
            <button type="button" className="btn btn-ghost" onClick={() => setLimit((n) => n + PAGE)}>
              <Plus className="h-4 w-4" /> Ver más ({list.length - limit})
            </button>
          </div>
        )}

        <AnimatePresence>
          {list.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card mt-4 flex flex-col items-center gap-3 px-6 py-12 text-center"
            >
              <Astro pose="piensa" small decorative className="h-40" />
              <p className="text-lg font-bold">No lo tenemos a la vista</p>
              <p className="max-w-sm text-mute">Escríbenos qué buscas: si nuestro proveedor lo tiene, te lo conseguimos.</p>
              <a
                href={waLink(`Hola ${site.name}, busco este producto de ${meta.name.toLowerCase()}: ${q}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-buy mt-2"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" /> Pedirlo por WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Preguntas ── */}
      <section className="mx-auto max-w-[860px] px-4 pb-24 md:px-6">
        <Reveal>
          <p className="kicker">Preguntas frecuentes</p>
          <h2 className="display mt-3 text-[clamp(28px,4vw,42px)]">Antes de comprar</h2>
        </Reveal>
        <ul className="mt-8 space-y-3">
          {config.faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </ul>
        {hasConditions && (
          <p className="mt-6 flex gap-3 rounded-2xl border border-line bg-surface p-4 text-sm text-mute">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
            {disclaimer}
          </p>
        )}
        <Reveal className="card mt-10 flex flex-col items-center gap-4 p-8 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <p className="text-xl font-extrabold">¿Buscas algo que no está?</p>
            <p className="mt-1 text-mute">Dinos qué necesitas y lo buscamos con nuestro proveedor.</p>
          </div>
          <a
            href={waLink(`Hola ${site.name}, busco un producto de ${meta.name.toLowerCase()} que no vi en la página:`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-buy"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" /> Escríbenos
          </a>
        </Reveal>
      </section>
    </>
  );
}
