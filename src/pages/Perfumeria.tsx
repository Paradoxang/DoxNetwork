import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Gift, Info, Plus, Search, Truck, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { Deco } from "@/components/Deco";
import { ProductCard } from "@/components/ProductCard";
import { FaqItem, Select } from "@/components/ShopControls";
import { Seo } from "@/components/Seo";
import { SideRail, type RailGroup } from "@/components/SideRail";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { productBySlug, type Product } from "@/data/catalog";
import { lineas } from "@/data/lineas";
import {
  disclaimer,
  families,
  perfumeBrands,
  perfumeMinPrice,
  perfumes,
  qualityInfo,
  shipping,
  type Family,
  type Quality,
} from "@/data/perfumeria";
import { formatCOP, site, waLink } from "@/data/site";
import { EASE, Reveal, scrollToTarget } from "@/lib/anim";
import { gsap, useGSAP } from "@/lib/gsap";
import { normalize } from "@/lib/ui";

type ParaFilter = "dama" | "hombre" | "unisex" | "sets";
type Sort = "destacados" | "menor" | "mayor" | "az";

const PAGE = 24;
const EMPTY = new URLSearchParams();

/** Vitrina del hero: fragancias reconocibles de familias distintas. */
const showcase = ["perfume-lattafa-yara", "perfume-dior-sauvage", "perfume-carolina-herrera-good-girl"]
  .map((s) => productBySlug(s))
  .filter(Boolean) as Product[];

const paraOptions: { id: ParaFilter; label: string; hint: string }[] = [
  { id: "dama", label: "Para ella", hint: "Florales, dulces y frutales" },
  { id: "hombre", label: "Para él", hint: "Frescas, amaderadas y especiadas" },
  { id: "unisex", label: "Unisex", hint: "Árabes, ámbar y oud" },
  { id: "sets", label: "Sets y kits", hint: "Para regalar o probar varias" },
];

const matchesPara = (p: Product, para: ParaFilter | "") =>
  !para || (para === "sets" ? p.perfume!.kind === "set" : p.perfume!.para === para && p.perfume!.kind === "perfume");

const faqs = [
  {
    q: "¿Los perfumes son originales?",
    a: `No. ${disclaimer} Por eso cada ficha dice su calidad: 1.1 o AAA.`,
  },
  {
    q: "¿Qué diferencia hay entre 1.1 y AAA?",
    a: `${qualityInfo["1.1"].label}: ${qualityInfo["1.1"].text.charAt(0).toLowerCase()}${qualityInfo["1.1"].text.slice(1)} ${qualityInfo.AAA.label}: ${qualityInfo.AAA.text.charAt(0).toLowerCase()}${qualityInfo.AAA.text.slice(1)}`,
  },
  {
    q: "¿Cómo llega mi pedido?",
    a: `${shipping.short}. ${shipping.detail}`,
  },
  {
    q: "¿Puedo pedir perfumes junto con productos digitales?",
    a: "Sí, en el mismo carrito. Los digitales llegan por WhatsApp y los perfumes por envío. El descuento por combinar aplica solo a los productos digitales.",
  },
  {
    q: "No sé cuál elegir, ¿me ayudan?",
    a: "Claro. Escríbenos qué fragancias te gustan o para quién es, y te recomendamos opciones parecidas.",
  },
];

export function Perfumeria() {
  const [urlParams, setParams] = useSearchParams();
  const reduced = useReducedMotion();
  const hero = useRef<HTMLElement>(null);

  // Misma estrategia que el catálogo: el primer render ignora la URL para que la hidratación case
  const [hydrated, setHydrated] = useState(false);
  const [animOn, setAnimOn] = useState(false);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!hydrated) return;
    const raf = requestAnimationFrame(() => setAnimOn(true));
    return () => cancelAnimationFrame(raf);
  }, [hydrated]);
  const params = hydrated ? urlParams : EMPTY;
  const motionOn = animOn && !reduced;

  const q = params.get("q") ?? "";
  const para = (params.get("para") ?? "") as ParaFilter | "";
  const family = (params.get("familia") ?? "") as Family | "";
  const quality = (params.get("calidad") ?? "") as Quality | "";
  const brand = params.get("casa") ?? "";
  const sort = (params.get("orden") as Sort) || "destacados";
  const [limit, setLimit] = useState(PAGE);

  const update = (patch: Record<string, string | null>, scroll = false) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    setParams(next, { replace: true, preventScrollReset: true });
    setLimit(PAGE);
    if (scroll) {
      const el = document.getElementById("fragancias");
      if (el) scrollToTarget(el);
    }
  };

  const list = useMemo(() => {
    const words = normalize(q.trim()).split(/\s+/).filter(Boolean);
    const out = perfumes.filter((p) => {
      const info = p.perfume!;
      const hay = normalize(`${p.name} ${p.tagline}`);
      return (
        matchesPara(p, para) &&
        (!family || info.family === family) &&
        (!quality || info.quality === quality) &&
        (!brand || info.brand === brand) &&
        words.every((w) => hay.includes(w))
      );
    });
    if (sort === "menor") out.sort((a, b) => a.plans[0].price - b.plans[0].price);
    if (sort === "mayor") out.sort((a, b) => b.plans[0].price - a.plans[0].price);
    if (sort === "az") out.sort((a, b) => a.perfume!.line.localeCompare(b.perfume!.line, "es"));
    return out;
  }, [q, para, family, quality, brand, sort]);

  const hasFilters = Boolean(q || para || family || quality || brand);
  const visible = list.slice(0, limit);

  // Vitrina del hero: los frascos entran escalonados y el brillo cruza una vez
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
        gsap.fromTo("[data-shine]", { xPercent: -160 }, { xPercent: 260, duration: 1.6, ease: "power2.inOut", delay: 1.1 });
      });
      return () => mm.revert();
    },
    { scope: hero }
  );

  const railGrupos: RailGroup[] = [
    {
      label: "Para quién",
      items: [
        { key: "todos", label: "Todas", count: perfumes.length, active: !para, onSelect: () => update({ para: null }) },
        ...paraOptions.map((o) => ({
          key: o.id,
          label: o.label,
          count: perfumes.filter((p) => matchesPara(p, o.id)).length,
          active: para === o.id,
          onSelect: () => update({ para: para === o.id ? null : o.id }),
        })),
      ],
    },
    {
      label: "Calidad",
      items: [
        { key: "cualquiera", label: "Cualquiera", active: !quality, onSelect: () => update({ calidad: null }) },
        ...(Object.keys(qualityInfo) as Quality[]).map((k) => ({
          key: k,
          label: qualityInfo[k].label,
          count: perfumes.filter((p) => p.perfume!.quality === k).length,
          active: quality === k,
          onSelect: () => update({ calidad: quality === k ? null : k }),
        })),
      ],
    },
    {
      label: "Familia",
      items: [
        { key: "todas", label: "Todas", active: !family, onSelect: () => update({ familia: null }) },
        ...(Object.keys(families) as Family[]).map((k) => ({
          key: k,
          label: families[k].label,
          count: perfumes.filter((p) => p.perfume!.family === k).length,
          active: family === k,
          onSelect: () => update({ familia: family === k ? null : k }),
        })),
      ],
    },
  ];

  return (
    <>
      <SideRail
        linea={{ name: lineas.perfumeria.name, blurb: lineas.perfumeria.blurb, path: "/perfumeria", hue: lineas.perfumeria.hue }}
        total={perfumes.length}
        minPrice={perfumeMinPrice}
        grupos={railGrupos}
      />
      <Seo
        title={`Perfumería · ${site.name}`}
        description={`${perfumes.length} fragancias para ella, para él y unisex en réplica 1.1 y AAA, desde ${formatCOP(perfumeMinPrice)}. ${shipping.short}.`}
        path="/perfumeria"
      />

      <div className="xl:pl-[228px]">
      {/* ── Hero ── */}
      <section ref={hero} className="relative mx-auto max-w-[1200px] overflow-hidden px-4 pb-10 pt-[140px] md:px-6 md:pt-[164px]">
        <Deco name="cristal-2" className="-left-14 bottom-4 hidden w-48 lg:block" opacity={0.3} float />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-24 -z-0 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(242,196,109,0.16), transparent 70%)" }}
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <p className="kicker">Perfumería · Nuevo</p>
            <h1 className="display mt-3 text-[clamp(38px,6vw,68px)]">
              Fragancias que <span className="text-gold">dejan huella</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-mute">
              Réplicas 1.1 y AAA de los perfumes más buscados, para ella, para él y unisex. Eliges, confirmas por WhatsApp y te lo enviamos.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary" onClick={() => update({}, true)}>
                Ver fragancias <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={waLink(`Hola ${site.name}, quiero asesoría para elegir un perfume.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" /> Asesoría gratis
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <li className="flex items-center gap-2 text-mute">
                <BadgeCheck className="h-4 w-4 text-gold" />
                <span><strong className="text-ink">{perfumes.length}</strong> fragancias</span>
              </li>
              <li className="flex items-center gap-2 text-mute">
                <Gift className="h-4 w-4 text-gold" />
                Desde <strong className="text-ink">{formatCOP(perfumeMinPrice)}</strong>
              </li>
              <li className="flex items-center gap-2 text-mute">
                <Truck className="h-4 w-4 text-gold" />
                {shipping.short}
              </li>
            </ul>
          </Reveal>

          {/* Vitrina: tres frascos en abanico; al pasar el puntero se abren */}
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
                      {/* Reutiliza la vitrina de las tarjetas */}
                      <ShowcaseArt product={p} />
                    </div>
                    {i === 1 && (
                      <span
                        data-shine
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Atajos por público */}
        <Reveal delay={0.1} className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {paraOptions.map((o) => {
            const count = perfumes.filter((p) => matchesPara(p, o.id)).length;
            const on = para === o.id;
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={on}
                onClick={() => update({ para: on ? null : o.id }, true)}
                className={`card card-hover flex flex-col items-start gap-1 p-4 text-left transition-colors md:p-5 ${on ? "border-gold" : ""}`}
              >
                <span className="font-bold">{o.label}</span>
                <span className="text-[13px] leading-snug text-mute">{o.hint}</span>
                <span className="mt-1 text-xs font-semibold text-faint">{count} opciones</span>
              </button>
            );
          })}
        </Reveal>
      </section>

      {/* ── Catálogo de fragancias ── */}
      <section id="fragancias" className="mx-auto max-w-[1200px] scroll-mt-24 px-4 pb-16 pt-6 md:px-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <label htmlFor="perf-q" className="sr-only">Buscar perfume</label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-faint" />
              <input
                id="perf-q"
                type="search"
                value={q}
                onChange={(e) => update({ q: e.target.value || null })}
                placeholder="Buscar: Sauvage, Yara, 212…"
                className="field pl-11"
                autoComplete="off"
              />
            </div>
            <Select
              label="Casa de referencia"
              value={brand}
              onChange={(v) => update({ casa: v || null })}
              options={[{ value: "", label: "Todas las casas" }, ...perfumeBrands.map((b) => ({ value: b, label: b }))]}
            />
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

          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por público">
            <button type="button" className="chip" aria-pressed={!para} onClick={() => update({ para: null })}>
              Todos
            </button>
            {paraOptions.map((o) => (
              <button key={o.id} type="button" className="chip" aria-pressed={para === o.id} onClick={() => update({ para: para === o.id ? null : o.id })}>
                {o.label}
              </button>
            ))}
            <span className="mx-1 hidden w-px self-stretch bg-line md:block" />
            {(Object.keys(qualityInfo) as Quality[]).map((k) => (
              <button key={k} type="button" className="chip" aria-pressed={quality === k} onClick={() => update({ calidad: quality === k ? null : k })}>
                {qualityInfo[k].label}
              </button>
            ))}
          </div>

          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por familia olfativa">
            {(Object.keys(families) as Family[]).map((k) => (
              <button key={k} type="button" className="chip" aria-pressed={family === k} onClick={() => update({ familia: family === k ? null : k })}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: families[k].hue }} />
                {families[k].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-faint" aria-live="polite">
          <span>
            {list.length} {list.length === 1 ? "fragancia" : "fragancias"}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
                setLimit(PAGE);
              }}
              className="flex min-h-[44px] items-center gap-1.5 font-semibold text-mute hover:text-ink"
            >
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
              <Plus className="h-4 w-4" /> Ver más fragancias ({list.length - limit})
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
              <p className="text-lg font-bold">No la tenemos en la vitrina</p>
              <p className="max-w-sm text-mute">Escríbenos el nombre de la fragancia: si nuestro proveedor la tiene, te la conseguimos.</p>
              <a
                href={waLink(`Hola ${site.name}, busco este perfume: ${q}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-buy mt-2"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" /> Pedirla por WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Guía de familias ── */}
      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6">
          <Reveal>
            <p className="kicker">¿Qué aroma buscas?</p>
            <h2 className="display mt-3 text-[clamp(28px,4vw,42px)]">Elige por familia olfativa</h2>
            <p className="mt-3 max-w-xl text-mute">Si sabes qué te gusta pero no el nombre, empieza por aquí. Las familias son orientativas.</p>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {(Object.keys(families) as Family[]).map((k, i) => {
              const f = families[k];
              const count = perfumes.filter((p) => p.perfume!.family === k).length;
              return (
                <li key={k}>
                <Reveal delay={i * 0.04} className="h-full">
                  <button
                    type="button"
                    onClick={() => update({ familia: k }, true)}
                    className="card card-hover group relative flex h-full w-full flex-col items-start overflow-hidden p-5 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
                      style={{ background: f.hue }}
                    />
                    <span className="relative h-3 w-3 rounded-full" style={{ background: f.hue }} />
                    <span className="relative mt-4 text-lg font-extrabold">{f.label}</span>
                    <span className="relative mt-1 text-sm leading-snug text-mute">{f.text}</span>
                    <span className="relative mt-3 flex items-center gap-1.5 text-xs font-semibold text-faint group-hover:text-ink">
                      {count} fragancias <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Calidades, sin letra pequeña ── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="kicker">Sin letra pequeña</p>
            <h2 className="display mt-3 text-[clamp(28px,4vw,42px)]">Réplicas, y lo decimos claro</h2>
            <p className="mt-3 max-w-md leading-relaxed text-mute">
              Cada ficha dice su calidad para que sepas exactamente qué compras. Si tienes dudas, te asesoramos antes de pagar.
            </p>
            <div className="mt-6 flex gap-3 rounded-2xl border border-line bg-surface p-4 text-sm text-mute">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
              {disclaimer}
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {(Object.keys(qualityInfo) as Quality[]).map((k, i) => {
              const count = perfumes.filter((p) => p.perfume!.quality === k).length;
              const min = Math.min(...perfumes.filter((p) => p.perfume!.quality === k).map((p) => p.plans[0].price));
              return (
                <Reveal key={k} delay={0.06 + i * 0.06} className="card flex flex-col p-6">
                  <span className="w-fit rounded-full bg-[#1a1712] px-3 py-1.5 text-xs font-extrabold tracking-wide text-[#f6ead2]">
                    {qualityInfo[k].label}
                  </span>
                  <p className="mt-4 leading-relaxed text-mute">{qualityInfo[k].text}</p>
                  <p className="mt-auto pt-5 text-sm text-faint">
                    {count} fragancias · desde <strong className="text-ink">{formatCOP(min)}</strong>
                  </p>
                  <button type="button" onClick={() => update({ calidad: k }, true)} className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-neb hover:underline">
                    Ver {qualityInfo[k].label} <ArrowRight className="h-4 w-4" />
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Preguntas ── */}
      <section className="mx-auto max-w-[860px] px-4 pb-24 md:px-6">
        <Reveal>
          <p className="kicker">Preguntas frecuentes</p>
          <h2 className="display mt-3 text-[clamp(28px,4vw,42px)]">Antes de elegir tu perfume</h2>
        </Reveal>
        <ul className="mt-8 space-y-3">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </ul>
        <Reveal className="card mt-10 flex flex-col items-center gap-4 p-8 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <p className="text-xl font-extrabold">¿Buscas una fragancia que no está?</p>
            <p className="mt-1 text-mute">Dinos cuál y la buscamos con nuestro proveedor.</p>
          </div>
          <a href={waLink(`Hola ${site.name}, busco un perfume que no vi en la página:`)} target="_blank" rel="noopener noreferrer" className="btn btn-buy">
            <WhatsAppIcon className="h-[18px] w-[18px]" /> Escríbenos
          </a>
        </Reveal>
      </section>
    </div>
    </>
  );
}

function ShowcaseArt({ product }: { product: Product }) {
  const base = product.image!.replace(/\.webp$/, "");
  return (
    <div
      className="aspect-[4/5]"
      style={{
        background: `radial-gradient(70% 38% at 50% 96%, ${product.hue}55, transparent 75%),
          radial-gradient(120% 80% at 50% 0%, #ffffff, transparent 70%),
          linear-gradient(180deg, #f7f5f1, #ece8e1)`,
      }}
    >
      <img src={`${base}.webp`} alt="" width={720} height={720} className="h-full w-full object-contain p-[4%] mix-blend-multiply" />
    </div>
  );
}
