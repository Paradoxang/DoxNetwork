import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight, Clock, ShieldCheck, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductArt } from "@/components/ProductArt";
import { ProductBadge, ProductCard } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { categoryById, isAvailable, productBySlug, products } from "@/data/catalog";
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

  if (!product) return <NotFound />;

  const plan = product.plans.find((p) => p.id === planId) ?? product.plans[0];
  const category = categoryById(product.category);
  const available = isAvailable(product);
  const quote = plan.price === 0;
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);
  const buyNow = waLink(
    quote
      ? `Hola ${site.name}, quiero cotizar: ${product.name}.`
      : `Hola ${site.name}, quiero comprar: ${product.name} — ${plan.label} (${formatCOP(plan.price)}).`
  );

  return (
    <>
      <Seo
        title={`${product.name} · ${site.name}`}
        description={`${product.tagline}. ${product.description}`}
        path={`/producto/${product.slug}`}
        jsonLd={{
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
                  name: p.label,
                  price: p.price,
                  priceCurrency: "COP",
                  availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                })),
              }),
        }}
      />

      <section className="mx-auto max-w-[1200px] px-4 pb-20 pt-[104px] md:px-6 md:pt-[128px]">
        <nav aria-label="Ruta" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-faint">
          <Link to="/" className="hover:text-ink">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/catalogo?categoria=${product.category}`} className="hover:text-ink">
            {category?.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-mute" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <ProductArt product={product} size="lg" className="card rounded-[22px]" />
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-faint">{category?.name}</span>
              <ProductBadge product={product} />
            </div>
            <h1 className="display mt-3 text-[clamp(34px,5vw,54px)]">{product.name}</h1>
            <p className="mt-3 text-lg text-mute">{product.tagline}</p>

            {/* Precio: cambia con un cruce suave al elegir plan */}
            <div className="mt-6 flex h-12 items-baseline gap-3 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={plan.id}
                  initial={reduced ? false : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? undefined : { y: -20, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex items-baseline gap-3"
                >
                  <span className="text-[34px] font-extrabold leading-none">
                    {quote ? "A cotizar" : formatCOP(plan.price)}
                  </span>
                  {plan.compareAt && (
                    <>
                      <span className="text-lg text-faint line-through">{formatCOP(plan.compareAt)}</span>
                      <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-bold text-gold">
                        -{Math.round((1 - plan.price / plan.compareAt) * 100)}%
                      </span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {product.plans.length > 1 && (
              <fieldset className="mt-6">
                <legend className="mb-3 text-sm font-bold">Elige tu plan</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {product.plans.map((p) => {
                    const on = p.id === plan.id;
                    return (
                      <label
                        key={p.id}
                        className={`relative flex min-h-[56px] cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                          on ? "border-neb" : "border-line hover:border-line-strong"
                        }`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={p.id}
                          checked={on}
                          onChange={() => setPlanId(p.id)}
                          className="sr-only"
                        />
                        {on && (
                          <motion.span
                            layoutId={reduced ? undefined : "plan-activo"}
                            className="absolute inset-0 -z-0 rounded-2xl bg-neb-soft"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative text-[15px] font-semibold">{p.label}</span>
                        <span className="relative text-sm font-bold text-mute">{formatCOP(p.price)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {available && !quote && (
                <button
                  type="button"
                  className="btn btn-primary flex-1"
                  onClick={() => {
                    add(product.slug, plan.id);
                    setOpen(true);
                  }}
                >
                  <ShoppingBag className="h-[18px] w-[18px]" /> Agregar al carrito
                </button>
              )}
              {available ? (
                <a href={buyNow} target="_blank" rel="noopener noreferrer" className="btn btn-buy flex-1">
                  <WhatsAppIcon /> {quote ? "Cotizar por WhatsApp" : "Comprar por WhatsApp"}
                </a>
              ) : (
                <a
                  href={waLink(`Hola ${site.name}, ¿cuándo vuelve a estar disponible ${product.name}?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost flex-1"
                >
                  Avísame cuando vuelva
                </a>
              )}
            </div>

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

            <div className="mt-8 grid gap-3 border-t border-line pt-6 text-sm text-mute sm:grid-cols-2">
              <p className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-neb" /> Entrega por WhatsApp
              </p>
              <p className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-neb" /> Pago: {site.payments.slice(0, 2).join(" o ")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-bg-soft">
          <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6">
            <h2 className="display text-[clamp(24px,3vw,32px)]">También te puede interesar</h2>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
}
