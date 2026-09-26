import {
  BadgeCheck,
  Check,
  ChevronRight,
  Flower2,
  Info,
  Package,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  UserRound,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AgeGate } from "@/components/AgeGate";
import { ProductArt } from "@/components/ProductArt";
import { FavoriteButton, ProductBadge, ProductCard, StockHint } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { categoryById, discountPct, isAvailable, planLabel, productBySlug, type Product as Producto } from "@/data/catalog";
import { thumbOf } from "@/data/destacados";
import { recibesDe, saberDe, tarjetasDe, textoRetracto, type IconoFicha } from "@/data/ficha";
import { articulos, isRestricted, lineas, subLabel } from "@/data/lineas";
import { perfumes } from "@/data/perfumeria";
import { formatCOP, site, waLink } from "@/data/site";
import { ENTREGA, fechaEntrega } from "@/lib/entrega";
import { Reveal } from "@/lib/anim";
import { useCart } from "@/lib/cart";
import { enlaceCarritoShopify } from "@/lib/shopify";
import { NotFound } from "@/pages/NotFound";

/**
 * Ficha de producto: la versión corta de la página del comedero (encargo de
 * Santiago del 25-sep-2026, docs/ENCARGO-ASTRO-plantilla-fichas.md). Una sola
 * plantilla para perfumería, relojería, tecnología y vapes; el contenido por
 * línea sale de src/data/ficha.ts, solo con datos que ya existen.
 *
 * 1. Compra en el primer pantallazo: a 375 × 667 el botón se ve sin bajar (en
 *    móvil las tres ventajas van justo debajo de los botones para lograrlo).
 *    «Comprar» va directo al pago de Shopify con este producto.
 * 2. Barra fija al bajar, con la hoja de compra rápida.
 * 3. La ficha · 4. Cómo lo recibes · 5. Lo que recibes, y lo que no es ·
 * 6. Lo que tienes que saber · cierre · relacionados.
 *
 * Sin reseñas, sin fotos ni vídeos nuevos y sin el botón grande de WhatsApp
 * (queda un enlace pequeño). Nada de escasez inventada.
 */

const iconos: Record<IconoFicha, LucideIcon> = {
  para: UserRound,
  familia: Flower2,
  calidad: BadgeCheck,
  referencia: Tag,
  tipo: Package,
  condicion: BadgeCheck,
  marca: Tag,
  tecnico: Zap,
  caladas: Wind,
  edad: ShieldAlert,
};

const confianza = (p: Producto) => [
  "Te confirmamos por WhatsApp antes de despachar",
  `Te atiende una persona · ${site.hours}`,
  textoRetracto(p),
];

function relacionadosDe(p: Producto) {
  const a = p.articulo;
  const pf = p.perfume;
  if (a) {
    // Misma subcategoría primero; entre ellos, misma marca
    return articulos
      .filter((x) => x.slug !== p.slug && x.articulo!.line === a.line)
      .map((x) => ({ x, s: (x.articulo!.sub === a.sub ? 2 : 0) + (a.brand && x.articulo!.brand === a.brand ? 1 : 0) }))
      .sort((m, n) => n.s - m.s)
      .slice(0, 4)
      .map((m) => m.x);
  }
  if (pf) {
    // Primero misma familia y mismo público, luego solo misma familia o mismo público
    return perfumes
      .filter((x) => x.slug !== p.slug)
      .map((x) => ({ x, s: (x.perfume!.family === pf.family ? 2 : 0) + (x.perfume!.para === pf.para ? 1 : 0) }))
      .sort((m, n) => n.s - m.s)
      .slice(0, 4)
      .map((m) => m.x);
  }
  return [];
}

export function Product() {
  const { slug = "" } = useParams();
  const product = productBySlug(slug);
  const { add, setOpen } = useCart();
  const [planId, setPlanId] = useState(product?.plans[0].id ?? "");
  /* Estado y no ref: en los vapes el botón aparece después de la verificación de edad. */
  const [boton, setBoton] = useState<HTMLAnchorElement | null>(null);
  const hoja = useRef<HTMLDialogElement>(null);
  const [barra, setBarra] = useState(false);
  const [entrega, setEntrega] = useState<[string, string] | null>(null);

  // Al saltar a otro producto (relacionados) se vuelve a su primer plan
  useEffect(() => {
    if (product) setPlanId(product.plans[0].id);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Entrega estimada: solo en el navegador (la fecha del build no es la de quien compra). */
  useEffect(() => {
    try {
      setEntrega([fechaEntrega(ENTREGA.min), fechaEntrega(ENTREGA.max)]);
    } catch {
      /* queda el texto de respaldo */
    }
  }, []);

  /* Barra fija: aparece cuando el botón principal ya quedó arriba, fuera de pantalla. */
  useEffect(() => {
    setBarra(false);
    if (!boton || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setBarra(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(boton);
    return () => io.disconnect();
  }, [boton, slug]);

  if (!product) return <NotFound />;

  const plan = product.plans.find((p) => p.id === planId) ?? product.plans[0];
  const category = categoryById(product.category);
  const available = isAvailable(product);
  const quote = plan.price === 0;
  const off = discountPct(plan);
  const url = `${site.url}/producto/${product.slug}`;
  const perfume = product.perfume;
  const articulo = product.articulo;
  const restricted = isRestricted(product);
  const related = relacionadosDe(product);
  const listPath = perfume ? "/perfumeria" : articulo ? lineas[articulo.line].path : "/catalogo";
  const rotulo = perfume ? perfume.brand || category?.name : articulo ? `${lineas[articulo.line].name} · ${articulo.brand || subLabel[articulo.sub]}` : category?.name;

  /* «Comprar» abre el pago de Shopify con este producto. Si no estuviera cargado
     allí, el pedido va por WhatsApp como siempre. */
  const checkout = available && !quote ? enlaceCarritoShopify([{ slug: product.slug, planId: plan.id, qty: 1, product }]) : null;
  const porWhatsApp = waLink(
    quote
      ? `Hola ${site.name}, quiero cotizar: ${product.name}.\n${url}`
      : `Hola ${site.name}, quiero comprar: ${product.name} (${planLabel(plan)}) por ${formatCOP(plan.price)}.\n${url}`
  );
  const avisame = waLink(`Hola ${site.name}, ¿cuándo vuelve ${product.name}?\n${url}`);
  const alCarrito = () => {
    add(product.slug, plan.id);
    hoja.current?.close?.();
    setOpen(true);
  };
  const abrirHoja = () => {
    const h = hoja.current;
    if (!h) return;
    if (typeof h.showModal === "function") h.showModal();
    else h.setAttribute("open", "");
  };
  const cerrarHoja = () => {
    const h = hoja.current;
    if (h?.close) h.close();
    else h?.removeAttribute("open");
  };

  const tarjetas = tarjetasDe(product);
  const recibes = recibesDe(product);
  const saber = saberDe(product);

  const precio = (grande = true) => (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`num font-semibold leading-none ${grande ? "text-[34px] md:text-[42px]" : "text-2xl"}`}>{quote ? "A cotizar" : formatCOP(plan.price)}</span>
      {plan.compareAt && (
        <>
          <span className="num text-lg text-faint line-through">{formatCOP(plan.compareAt)}</span>
          <span className="rounded-full bg-gold-soft px-2.5 py-1 font-mono text-xs font-semibold text-gold">Ahorras {off}%</span>
        </>
      )}
    </div>
  );

  /** El botón de compra; en los agotados, «Avísame cuando vuelva». */
  const comprar = (principal = false) =>
    available ? (
      <a ref={principal ? setBoton : undefined} href={checkout ?? porWhatsApp} className="btn btn-primary min-h-[52px] flex-1 justify-center text-base">
        Comprar
      </a>
    ) : (
      <a ref={principal ? setBoton : undefined} href={avisame} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-[52px] flex-1 justify-center text-base">
        <WhatsAppIcon className="h-5 w-5" /> Avísame cuando vuelva
      </a>
    );

  const agregar = () =>
    available && !quote ? (
      <button type="button" className="btn btn-ghost min-h-[52px] justify-center" onClick={alCarrito}>
        <ShoppingBag className="h-[18px] w-[18px]" /> Agregar al carrito
      </button>
    ) : null;

  const pagos = () => (
    <ul className="flex flex-wrap gap-2" aria-label="Formas de pago">
      {["Nequi", "Llave Bre-B"].map((p) => (
        <li key={p} className="rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] tracking-wide text-mute">
          {p}
        </li>
      ))}
    </ul>
  );

  const selectorPlan = () =>
    product.plans.length > 1 && (
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Plan">
        {product.plans.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={p.id === plan.id}
            onClick={() => setPlanId(p.id)}
            className={`chip ${p.id === plan.id ? "border-neb bg-neb-soft text-ink" : ""}`}
          >
            {planLabel(p) || p.id}
          </button>
        ))}
      </div>
    );

  const body = (
    <>
      <Seo
        title={`${product.name}${quote ? "" : ` desde ${formatCOP(Math.min(...product.plans.map((p) => p.price)))}`} · ${site.name}`}
        description={`${product.tagline}. ${product.description}`}
        path={`/producto/${product.slug}`}
        noindex={restricted}
        jsonLd={
          restricted
            ? undefined
            : {
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                description: product.description,
                category: category?.name,
                ...(quote
                  ? {}
                  : {
                      offers: product.plans.map((p) => ({
                        "@type": "Offer",
                        name: planLabel(p),
                        price: p.price,
                        priceCurrency: "COP",
                        availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                      })),
                    }),
              }
        }
      />

      {/* ── 1 · Compra ── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-14 pt-[112px] md:px-6 md:pt-[150px]">
        <nav aria-label="Ruta" className="mb-6 hidden flex-wrap items-center gap-1 text-sm text-faint md:flex">
          <Link to="/" className="hover:text-ink">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={listPath} className="hover:text-ink">{category?.name}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-mute" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative mx-auto w-[min(100%,230px)] sm:w-[min(100%,320px)] lg:w-full">
              <ProductArt product={product} size="lg" className="card rounded-[22px]" />
              <FavoriteButton product={product} className="absolute right-3 top-3 h-11 w-11" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-semibold uppercase tracking-[0.08em] text-faint">{rotulo}</span>
              {/* El «Ahorras X%» ya va junto al precio: aquí no se repite */}
              {!(plan.compareAt && available) && <ProductBadge product={product} />}
              <StockHint product={product} />
            </div>
            <h1 className="display mt-2 text-[26px] leading-[1.1] md:text-[clamp(34px,4.4vw,50px)]">{product.name}</h1>
            <p className="mt-1.5 text-[15px] text-mute md:text-lg">{product.tagline}</p>

            {/* En móvil van debajo de los botones: así el botón cabe en el primer pantallazo */}
            <ul className="mt-4 space-y-2 max-lg:order-1">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[16px] md:text-[17px]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-soft text-mint">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-4">{precio()}</div>
            {product.plans.length > 1 && <div className="mt-4">{selectorPlan()}</div>}

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              {comprar(true)}
              {agregar()}
            </div>

            {available && !quote && (
              <a href={porWhatsApp} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-semibold text-mute underline underline-offset-4 hover:text-ink max-lg:order-2 max-sm:text-center">
                ¿Prefieres pedir por WhatsApp?
              </a>
            )}

            <div className="mt-4 max-lg:order-2">{pagos()}</div>

            <div className="mt-4 flex gap-3 rounded-2xl border border-mint/30 bg-mint-soft p-3.5 max-lg:order-2">
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-mint" aria-hidden="true" />
              <p className="text-[15px] leading-snug">
                <span className="font-semibold">Envío gratis a toda Colombia.</span>{" "}
                {entrega ? (
                  <>
                    Pide hoy y te llega entre el <b className="text-mint">{entrega[0]}</b> y el <b className="text-mint">{entrega[1]}</b>.
                  </>
                ) : (
                  `${ENTREGA.texto}.`
                )}
                <span className="mt-0.5 block text-xs text-faint">{ENTREGA.nota}</span>
              </p>
            </div>

            <ul className="mt-4 space-y-2 max-lg:order-2">
              {confianza(product).map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-mute">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 3 · La ficha ── */}
      {tarjetas.length > 0 && (
        <section className="border-t border-line bg-bg-soft">
          <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6">
            <Reveal>
              <p className="kicker">La ficha</p>
              <h2 className="display mt-3 text-[clamp(26px,3.4vw,38px)]">Los datos que importan</h2>
            </Reveal>
            <ul className={`mt-8 grid gap-3 sm:grid-cols-2 ${tarjetas.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {tarjetas.map((t, i) => {
                const Icono = iconos[t.icono];
                const hue = t.hue ?? "var(--neb)";
                return (
                  <li key={t.label}>
                    <Reveal delay={i * 0.05} className="card flex h-full flex-col gap-3 p-5">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-2xl"
                        style={{ background: `color-mix(in srgb, ${hue} 18%, transparent)`, color: hue }}
                      >
                        <Icono className="h-5 w-5" aria-hidden="true" strokeWidth={1.9} />
                      </span>
                      <span>
                        <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{t.label}</span>
                        <span className="mt-1 block text-lg font-bold leading-snug">{t.value}</span>
                        {t.texto && <span className="mt-1.5 block text-sm leading-relaxed text-mute">{t.texto}</span>}
                      </span>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ── 4 · Cómo lo recibes ── */}
      <section className="mx-auto max-w-[1200px] px-4 py-14 md:px-6">
        <div className="rounded-[26px] border border-mint/30 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--mint)_12%,transparent),transparent_60%)] p-6 md:p-10">
          <Reveal>
            <p className="kicker text-mint">Cómo lo recibes</p>
            <h2 className="display mt-3 text-[clamp(26px,3.4vw,38px)]">Pides, pagas y te llega a la puerta</h2>
          </Reveal>
          <ol className="mt-7 grid gap-5 md:grid-cols-3">
            {[
              { t: "Pides y pagas", x: "Por Nequi o Llave Bre-B al finalizar la compra. Sin tarjeta." },
              { t: "Nos mandas el comprobante por WhatsApp", x: "Y te confirmamos el despacho por el mismo chat." },
              { t: "Te llega a tu casa", x: `Con número de guía para seguirlo, en ${ENTREGA.min} a ${ENTREGA.max} días hábiles.` },
            ].map((p, i) => (
              <li key={p.t}>
                <Reveal delay={i * 0.06} className="flex gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint font-mono text-sm font-extrabold text-mint-ink">{i + 1}</span>
                  <span>
                    <span className="block font-bold leading-snug">{p.t}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-mute">{p.x}</span>
                  </span>
                </Reveal>
              </li>
            ))}
          </ol>
          <ul className="mt-7 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
            {[
              { t: "Envío gratis", x: "A toda Colombia, incluido en el precio." },
              { t: "Garantía legal", x: "Si llega roto o no es lo que pediste, lo resolvemos." },
              { t: "5 días de retracto", x: textoRetracto(product).includes("abierto") ? "Hábiles desde que lo recibes, si no lo has abierto." : "Hábiles desde que lo recibes, como manda la ley." },
            ].map((s) => (
              <li key={s.t} className="flex gap-3">
                <ShieldCheck className="h-6 w-6 shrink-0 text-mint" aria-hidden="true" />
                <span>
                  <span className="block font-bold">{s.t}</span>
                  <span className="block text-sm text-mute">{s.x}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5 · Lo que recibes, y lo que no es ── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-14 md:px-6">
        <Reveal className="text-center">
          <p className="kicker justify-center">Antes de pedir</p>
          <h2 className="display mt-3 text-[clamp(26px,3.4vw,38px)]">Lo que recibes{recibes.aparte?.titulo === "Lo que no es" ? ", y lo que no es" : ""}</h2>
        </Reveal>
        <div className={`mx-auto mt-8 grid max-w-[920px] gap-4 ${recibes.aparte ? "md:grid-cols-2" : ""}`}>
          <Reveal className="card p-6">
            <p className="font-bold">Recibes</p>
            <ul className="mt-3 space-y-2.5">
              {recibes.recibes.map((r) => (
                <li key={r} className="flex gap-2.5 text-[15px] leading-relaxed text-mute">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-soft text-mint">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
          {recibes.aparte && (
            <Reveal delay={0.06} className="card p-6">
              <p className="font-bold">{recibes.aparte.titulo}</p>
              <ul className="mt-3 space-y-2.5">
                {recibes.aparte.lineas.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[15px] leading-relaxed text-mute">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-faint">
                      {recibes.aparte!.titulo === "Lo que no es" ? <X className="h-3 w-3" strokeWidth={3} /> : <Info className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {recibes.advertencia && (
            <p className="flex gap-3 rounded-2xl border border-gold/40 bg-gold-soft p-4 text-sm leading-relaxed text-ink md:col-span-2">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
              {recibes.advertencia}
            </p>
          )}
        </div>
      </section>

      {/* ── 6 · Lo que tienes que saber ── */}
      <section className="border-t border-line bg-bg-soft">
        <div className="mx-auto max-w-[1000px] px-4 py-14 md:px-6">
          <Reveal className="text-center">
            <p className="kicker justify-center">Sin letra pequeña</p>
            <h2 className="display mt-3 text-[clamp(26px,3.4vw,38px)]">Lo que tienes que saber</h2>
          </Reveal>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {saber.map((s, i) => (
              <li key={s.titulo}>
                <Reveal delay={(i % 4) * 0.05} className="card flex h-full gap-3.5 p-5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neb-soft text-neb">
                    <Check className="h-4 w-4" strokeWidth={2.6} />
                  </span>
                  <span>
                    <span className="block font-bold leading-snug">{s.titulo}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-mute">{s.texto}</span>
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>

          {/* Cierre corto */}
          <Reveal className="card mt-10 flex flex-col items-center gap-4 p-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <p className="text-lg font-extrabold leading-tight">{product.name}</p>
              <p className="mt-1 text-sm text-mute">Envío gratis · Nequi o Llave Bre-B</p>
            </div>
            <div className="flex flex-col items-center gap-3 md:flex-row">
              {precio(false)}
              <div className="flex w-full min-w-[180px] md:w-auto">{comprar()}</div>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6">
            <h2 className="display text-[clamp(24px,3vw,32px)]">{perfume ? "Fragancias parecidas" : articulo ? "Más en " + lineas[articulo.line].name : "También te puede interesar"}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 2 · Barra fija al bajar (celular y escritorio) y hoja de compra rápida ── */}
      <div
        aria-hidden={!barra}
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line-strong bg-bg/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:inset-x-auto md:bottom-5 md:left-1/2 md:w-[min(760px,calc(100%-40px))] md:-translate-x-1/2 md:rounded-full md:border md:py-2.5 md:pl-6 md:pr-2.5 md:shadow-[var(--shadow)] ${
          barra ? "translate-y-0" : "translate-y-[115%] md:translate-y-[160%]"
        }`}
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-mute">{product.name}</p>
          <p className="text-sm text-mute">
            <span className="num text-lg font-semibold text-gold">{quote ? "A cotizar" : formatCOP(plan.price)}</span> · Envío gratis
          </p>
        </div>
        {available ? (
          <button type="button" tabIndex={barra ? 0 : -1} onClick={abrirHoja} className="btn btn-primary shrink-0 px-6">
            Comprar
          </button>
        ) : (
          <a href={avisame} tabIndex={barra ? 0 : -1} target="_blank" rel="noopener noreferrer" className="btn btn-primary shrink-0">
            Avísame
          </a>
        )}
      </div>

      <dialog
        ref={hoja}
        aria-label="Compra rápida"
        onClick={(e) => e.target === hoja.current && cerrarHoja()}
        className="m-auto mb-0 w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-[#050810]/60 backdrop:backdrop-blur-[3px] md:mb-auto md:w-[min(520px,92vw)]"
      >
        <div className="relative rounded-t-[22px] border border-line-strong bg-bg-soft p-5 pb-[max(20px,env(safe-area-inset-bottom))] md:rounded-[22px] md:p-6">
          <button type="button" onClick={cerrarHoja} aria-label="Cerrar" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-ink">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-4 pr-10">
            {thumbOf(product) && <img src={thumbOf(product)} alt="" width={84} height={84} loading="lazy" className="h-[84px] w-[84px] shrink-0 rounded-2xl bg-white object-contain p-1" />}
            <div className="min-w-0">
              <p className="font-bold leading-snug">{product.name}</p>
              <p className="num mt-1 text-2xl font-semibold text-gold">{quote ? "A cotizar" : formatCOP(plan.price)}</p>
              <p className="text-xs text-mute">Envío gratis a toda Colombia</p>
            </div>
          </div>
          {product.plans.length > 1 && <div className="mt-4">{selectorPlan()}</div>}
          <div className="mt-5 flex flex-col gap-2.5">
            {comprar()}
            {agregar()}
          </div>
          <div className="mt-4 flex justify-center">{pagos()}</div>
        </div>
      </dialog>
    </>
  );

  if (!restricted) return body;
  return (
    <>
      <Seo title={`${lineas.vapes.name} · ${site.name}`} description="Sección para mayores de 18 años." path={`/producto/${product.slug}`} noindex />
      <AgeGate>{body}</AgeGate>
    </>
  );
}
