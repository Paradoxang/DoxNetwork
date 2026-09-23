import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { planLabel } from "@/data/catalog";
import { formatCOP } from "@/data/site";
import { useCart } from "@/lib/cart";
import { EASE, lockScroll } from "@/lib/anim";
import { Astro } from "@/components/Astro";
import { ProductArt } from "@/components/ProductArt";
import { isPhysical } from "@/data/lineas";
import { productoComedero } from "@/data/comedero";
import { shipping } from "@/data/perfumeria";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function CartDrawer() {
  const cart = useCart();
  const { open, setOpen } = cart;
  const reduced = useReducedMotion();
  const panel = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    lockScroll(true);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("button")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // Trampa de foco mínima: Tab no se escapa del panel
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      lastFocus.current?.focus?.();
    };
  }, [open, setOpen]);

  const hasQuote = cart.lines.some((l) => l.plan.price === 0);
  // En Shopify el contra entrega es solo del comedero: si entra cualquier
  // producto del catálogo, Payfy lo quita y quedan Nequi y Llave Bre-B.
  const alRecibir = cart.lines.length > 0 && cart.lines.every((l) => l.slug === productoComedero.slug);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[70] bg-[#060912]/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="panel"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-[420px] flex-col border-l border-line bg-bg shadow-2xl"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="kicker">Tu pedido</p>
                <p className="mt-1.5 text-sm text-mute">
                  {cart.count} {cart.count === 1 ? "producto" : "productos"}
                </p>
              </div>
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Cerrar carrito">
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <Astro pose="chibi-hola" small enter={false} decorative className="h-36" />
                <p className="text-lg font-bold">Tu carrito está vacío</p>
                <p className="text-sm text-mute">Agrega productos y te armamos el pedido por WhatsApp.</p>
                <Link to="/catalogo" className="btn btn-primary mt-2" onClick={() => setOpen(false)}>
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  <AnimatePresence initial={false}>
                    {cart.lines.map((l) => (
                      <motion.li
                        key={`${l.slug}-${l.planId}`}
                        layout={!reduced}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="card flex gap-3 p-3"
                      >
                        <ProductArt product={l.product} plan={l.plan} size="sm" className="w-20 shrink-0 self-start rounded-xl" />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate font-bold">{l.product.name}</p>
                              <p className="truncate text-xs text-mute">{planLabel(l.plan)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => cart.remove(l.slug, l.planId)}
                              className="-m-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:text-ink"
                              aria-label={`Quitar ${l.product.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-line">
                              <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center text-mute hover:text-ink"
                                onClick={() => cart.setQty(l.slug, l.planId, l.qty - 1)}
                                aria-label="Quitar uno"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold" aria-live="polite">
                                {l.qty}
                              </span>
                              <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center text-mute hover:text-ink"
                                onClick={() => cart.setQty(l.slug, l.planId, l.qty + 1)}
                                aria-label="Agregar uno"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className={l.plan.price === 0 ? "font-bold" : "num font-semibold"}>{l.plan.price === 0 ? "A cotizar" : formatCOP(l.total)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="space-y-3 border-t border-line px-5 py-4">
                  <AnimatePresence mode="wait">
                    {cart.nextTier && (
                      <motion.p
                        key={cart.nextTier.missing + "-" + cart.nextTier.pct}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl bg-gold-soft px-3 py-2 text-sm text-ink"
                      >
                        Agrega {cart.nextTier.missing} {cart.nextTier.missing === 1 ? "producto distinto" : "productos distintos"} más y
                        obtén <strong className="text-gold">{cart.nextTier.pct}% de descuento</strong>.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <dl className="space-y-1.5 text-sm [&_dd]:font-mono [&_dd]:tabular-nums">
                    <div className="flex justify-between text-mute">
                      <dt>Subtotal</dt>
                      <dd>{formatCOP(cart.subtotal)}</dd>
                    </div>
                    {cart.discount > 0 && (
                      <div className="flex justify-between text-gold">
                        <dt>Descuento por combinar ({cart.discountPct}%)</dt>
                        <dd>-{formatCOP(cart.discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 text-lg font-extrabold">
                      <dt>Total</dt>
                      <dd>{formatCOP(cart.total)}</dd>
                    </div>
                  </dl>
                  {hasQuote && <p className="text-xs text-faint">Los servicios a cotizar se confirman por WhatsApp.</p>}
                  {cart.checkoutVia === "shopify" ? (
                    <p className="flex items-start gap-2 text-xs text-faint">
                      <Truck className="h-3.5 w-3.5 shrink-0" />{" "}
                      {alRecibir ? "Pagas al recibir, sin tarjeta." : "Pagas por Nequi o Llave Bre-B al finalizar la compra, sin tarjeta."} El
                      envío lo ves en el siguiente paso.
                    </p>
                  ) : (
                    cart.lines.some((l) => isPhysical(l.product)) && (
                      <p className="flex items-start gap-2 text-xs text-faint">
                        <Truck className="h-3.5 w-3.5 shrink-0" /> Productos con envío: {shipping.detail.charAt(0).toLowerCase() + shipping.detail.slice(1)}
                      </p>
                    )
                  )}
                  {/* Toda la cesta física y cargada en Shopify → su checkout (Nequi o Llave Bre-B;
                      contra entrega solo si es únicamente el comedero).
                      Cualquier digital, agotado o sin mapa → WhatsApp, como siempre. */}
                  <a href={cart.checkoutUrl} target="_blank" rel="noopener noreferrer" className="btn btn-buy w-full">
                    {cart.checkoutVia === "shopify" ? (
                      <>
                        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                        Ir a pagar
                      </>
                    ) : (
                      <>
                        <WhatsAppIcon className="h-5 w-5" />
                        Finalizar pedido por WhatsApp
                      </>
                    )}
                  </a>
                  <p className="text-center text-xs leading-relaxed text-faint">
                    Al enviar tu pedido aceptas los{" "}
                    <Link to="/terminos" onClick={() => setOpen(false)} className="underline hover:text-ink">términos</Link> y la{" "}
                    <Link to="/privacidad" onClick={() => setOpen(false)} className="underline hover:text-ink">política de privacidad</Link>.
                  </p>
                  <button type="button" onClick={cart.clear} className="w-full py-2 text-sm font-semibold text-faint hover:text-ink">
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
