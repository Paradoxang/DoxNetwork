import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronRight,
  Info,
  MonitorSmartphone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
  UserRound,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PlanPicker } from "@/components/PlanPicker";
import { ProductArt } from "@/components/ProductArt";
import { FavoriteButton, ProductBadge, ProductCard, StockHint } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  categoryById,
  discountPct,
  isAvailable,
  isCombo,
  planLabel,
  planOf,
  productBySlug,
  products,
} from "@/data/catalog";
import { articulos, conditionInfo, isRestricted, lineas, subLabel, vapeWarning } from "@/data/lineas";
import { AgeGate } from "@/components/AgeGate";
import { disclaimer, families, paraLabel, perfumes, qualityInfo, shipping } from "@/data/perfumeria";
import { formatCOP, site, waLink } from "@/data/site";
import { EASE, Reveal } from "@/lib/anim";
import { useCart } from "@/lib/cart";
import { NotFound } from "@/pages/NotFound";

export function Product() {
  const { slug = "" } = useParams();
  const product = productBySlug(slug);
  const reduced = useReducedMotion();
  const { add, setOpen } = useCart();
  const [planId, setPlanId] = useState(product?.plans[0].id ?? "");

  // Al saltar a otro producto (relacionados) se vuelve a su primer plan
  useEffect(() => {
    if (product) setPlanId(product.plans[0].id);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return <NotFound />;

  const plan = product.plans.find((p) => p.id === planId) ?? product.plans[0];
  const category = categoryById(product.category);
  const available = isAvailable(product);
  const quote = plan.price === 0;
  const combo = isCombo(product);
  const off = discountPct(plan);
  const url = `${site.url}/producto/${product.slug}`;
  const perfume = product.perfume;
  const articulo = product.articulo;
  const physical = Boolean(perfume || articulo);
  const restricted = isRestricted(product);
  const related = articulo
    ? // Misma subcategoría primero; entre ellos, misma marca
      articulos
        .filter((p) => p.slug !== product.slug && p.articulo!.line === articulo.line)
        .map((p) => ({ p, score: (p.articulo!.sub === articulo.sub ? 2 : 0) + (articulo.brand && p.articulo!.brand === articulo.brand ? 1 : 0) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((x) => x.p)
    : perfume
    ? // Primero misma familia y mismo público, luego solo misma familia o mismo público
      perfumes
        .filter((p) => p.slug !== product.slug)
        .map((p) => ({ p, score: (p.perfume!.family === perfume.family ? 2 : 0) + (p.perfume!.para === perfume.para ? 1 : 0) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((x) => x.p)
    : products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const listPath = perfume ? "/perfumeria" : articulo ? lineas[articulo.line].path : `/catalogo?categoria=${product.category}`;

  // Mensaje precargado con nombre, plan y enlace (lo mejor de Torostream)
  const buyNow = waLink(
    quote
      ? `Hola ${site.name}, quiero cotizar: ${product.name}.\n${url}`
      : `Hola ${site.name}, quiero comprar: ${product.name} (${planLabel(plan)}) por ${formatCOP(plan.price)}.\n${url}`
  );

  const details = articulo
    ? ([
        articulo.brand && { icon: Tag, label: "Marca", value: articulo.brand },
        { icon: Sparkles, label: "Categoría", value: `${lineas[articulo.line].name} · ${subLabel[articulo.sub]}` },
        articulo.condition && { icon: BadgeCheck, label: "Condición", value: conditionInfo[articulo.condition].label },
        { icon: Truck, label: "Envío", value: shipping.short },
        { icon: Wallet, label: "Pago", value: site.payments.slice(0, 2).join(" · ") },
      ].filter(Boolean) as { icon: typeof Zap; label: string; value: string }[])
    : perfume
    ? ([
        perfume.brand && { icon: Tag, label: "Fragancia de referencia", value: perfume.brand },
        { icon: UserRound, label: "Para", value: paraLabel[perfume.para] },
        { icon: BadgeCheck, label: "Calidad", value: qualityInfo[perfume.quality].label },
        perfume.family && { icon: Sparkles, label: "Familia olfativa", value: families[perfume.family].label },
        { icon: Truck, label: "Envío", value: shipping.short },
        { icon: Wallet, label: "Pago", value: site.payments.slice(0, 2).join(" · ") },
      ].filter(Boolean) as { icon: typeof Zap; label: string; value: string }[])
    : [
    plan.access && {
      icon: UserRound,
      label: "Tipo de acceso",
      value: plan.access === "Pantalla" ? "Pantalla · perfil propio" : "Completa · cuenta entera",
    },
    product.devices && { icon: MonitorSmartphone, label: "Dispositivos", value: product.devices },
    { icon: CalendarClock, label: "Vigencia", value: plan.duration },
    { icon: Zap, label: "Entrega", value: `WhatsApp · ~${site.deliveryMinutes} min` },
    { icon: ShieldCheck, label: "Garantía", value: `Reposición en < ${site.warrantyHours} h` },
  ].filter(Boolean) as { icon: typeof Zap; label: string; value: string }[];

  const body = (
    <>
      <Seo
        title={`${product.name}${quote ? "" : ` desde ${formatCOP(Math.min(...product.plans.map((p) => p.price)))}`} · ${site.name}`}
        description={`${product.tagline}. ${product.description}`}
        path={`/producto/${product.slug}`}
        noindex={restricted}
        jsonLd={restricted ? undefined : {
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
        }}
      />

      <section className="mx-auto max-w-[1200px] px-4 pb-20 pt-[140px] md:px-6 md:pt-[164px]">
        <nav aria-label="Ruta" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-faint">
          <Link to="/" className="hover:text-ink">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={listPath} className="hover:text-ink">{category?.name}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-mute" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative">
              <ProductArt product={product} plan={plan} size="lg" className="card rounded-[22px]" />
              <FavoriteButton product={product} className="absolute right-4 top-4 h-11 w-11" />
            </div>
            {combo && (
              <div className="card mt-4 p-5">
                <p className="kicker">Qué incluye</p>
                <ul className="mt-4 space-y-3">
                  {product.includes!.map((i, n) => {
                    const part = productBySlug(i.slug)!;
                    const pl = planOf(i.slug, i.planId)!;
                    return (
                      <li key={`${i.slug}-${i.planId}-${n}`} className="flex items-center justify-between gap-3">
                        <Link to={`/producto/${part.slug}`} className="flex min-w-0 items-center gap-3 hover:text-neb">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white" style={{ background: part.hue }}>
                            {part.name.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-bold">{part.name}</span>
                            <span className="block truncate text-xs text-faint">{planLabel(pl)}</span>
                          </span>
                        </Link>
                        <span className="num shrink-0 text-sm text-mute">{formatCOP(pl.price)}</span>
                      </li>
                    );
                  })}
                </ul>
                {plan.compareAt && (
                  <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
                    <p className="flex justify-between text-mute">
                      <span>Por separado</span>
                      <span className="line-through">{formatCOP(plan.compareAt)}</span>
                    </p>
                    <p className="flex justify-between font-extrabold">
                      <span>En combo</span>
                      <span>{formatCOP(plan.price)}</span>
                    </p>
                    <p className="flex justify-between font-bold text-gold">
                      <span>Ahorras</span>
                      <span>{formatCOP(plan.compareAt - plan.price)} ({off}%)</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-sm font-semibold text-faint ${physical ? "uppercase tracking-[0.08em]" : ""}`}>
                {combo
                  ? product.forWho
                  : perfume
                    ? perfume.brand || category?.name
                    : articulo
                      ? `${lineas[articulo.line].name} · ${subLabel[articulo.sub]}`
                      : category?.name}
              </span>
              <ProductBadge product={product} />
              <StockHint product={product} />
            </div>
            <h1 className="display mt-3 text-[clamp(34px,5vw,54px)]">{product.name}</h1>
            <p className="mt-3 text-lg text-mute">{product.tagline}</p>

            {/* Precio: cruce suave al cambiar de plan */}
            <div className="mt-6 flex min-h-[48px] items-end gap-3 overflow-hidden" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={plan.id}
                  initial={reduced ? false : { y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? undefined : { y: -22, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                >
                  <span className={`text-[38px] leading-none ${quote ? "font-display font-bold" : "num font-semibold"}`}>{quote ? "A cotizar" : formatCOP(plan.price)}</span>
                  {plan.compareAt && (
                    <>
                      <span className="num text-lg text-faint line-through">{formatCOP(plan.compareAt)}</span>
                      <span className="rounded-full bg-gold-soft px-2.5 py-1 font-mono text-xs font-semibold text-gold">Ahorras {off}%</span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {!quote && <p className="mt-1.5 text-sm text-faint">{planLabel(plan)}</p>}

            <div className="mt-7">
              <PlanPicker product={product} value={plan} onChange={(p) => setPlanId(p.id)} />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {available && !quote && (
                <button
                  type="button"
                  className="btn btn-primary min-h-[52px] flex-1"
                  onClick={() => {
                    add(product.slug, plan.id);
                    setOpen(true);
                  }}
                >
                  <ShoppingBag className="h-[18px] w-[18px]" /> Agregar al carrito
                </button>
              )}
              {available ? (
                <a href={buyNow} target="_blank" rel="noopener noreferrer" className="btn btn-buy min-h-[52px] flex-1">
                  <WhatsAppIcon /> {quote ? "Cotizar por WhatsApp" : "Comprar por WhatsApp"}
                </a>
              ) : (
                <a
                  href={waLink(`Hola ${site.name}, ¿cuándo vuelve ${product.name}?\n${url}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost min-h-[52px] flex-1"
                >
                  Avísame cuando vuelva
                </a>
              )}
            </div>

            {/* Ficha estándar: lo que Torostream no explica en ninguna de sus 67 fichas */}
            <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="flex items-center gap-3 bg-surface p-4">
                  <d.icon className="h-5 w-5 shrink-0 text-neb" />
                  <div className="min-w-0">
                    <dt className="text-xs text-faint">{d.label}</dt>
                    <dd className="truncate font-semibold">{d.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <p className="mt-8 leading-relaxed text-mute">{product.description}</p>
            <ul className="mt-5 space-y-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint-soft text-mint">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {physical ? (
              <>
                <p className="mt-6 text-sm text-faint">{shipping.detail}</p>
                <p className="mt-4 flex gap-3 rounded-2xl border border-line bg-surface p-4 text-sm text-mute">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
                  {restricted
                    ? vapeWarning
                    : articulo && articulo.condition !== "replica"
                      ? "Las fotos son del proveedor. Si tienes dudas del modelo, color o garantía, pregúntanos por WhatsApp antes de pagar."
                      : disclaimer}
                </p>
              </>
            ) : (
              <p className="mt-6 text-sm text-faint">
                ¿Dudas con el plan? Revisa las{" "}
                <Link to="/#preguntas" className="font-semibold text-neb hover:underline">preguntas frecuentes</Link> o{" "}
                <Link to="/arma-tu-combo" className="font-semibold text-neb hover:underline">combínalo y ahorra</Link>.
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-bg-soft">
          <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6">
            <h2 className="display text-[clamp(24px,3vw,32px)]">{perfume ? "Fragancias parecidas" : articulo ? "Más en " + lineas[articulo.line].name : "También te puede interesar"}</h2>
            <ul className={`mt-8 grid gap-4 lg:grid-cols-4 ${physical ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
              {related.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
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
