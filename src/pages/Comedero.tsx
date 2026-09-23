import { motion } from "framer-motion";
import { Check, Info, MessageCircle, PackageCheck, ShieldCheck, ShoppingBag, Truck, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { MetaPixel, pixel } from "@/components/MetaPixel";
import { Seo } from "@/components/Seo";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqItem } from "@/components/ShopControls";
import { Telon } from "@/components/Telon";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  avisos,
  claves,
  colores,
  comedero,
  comparativa,
  disponible,
  enlaceCheckout,
  faqs,
  ficha,
  imagenes,
  mensajeAviso,
  mensajeWa,
  pasos,
  paraQuien,
  problema,
  productoComedero,
  type Color,
} from "@/data/comedero";
import { formatCOP, site, waLink } from "@/data/site";
import { Reveal } from "@/lib/anim";
import { useCart } from "@/lib/cart";

/**
 * Landing de un solo producto: el comedero por gravedad.
 *
 * Es una página de aterrizaje de pauta, montada para convertir en el checkout
 * de Shopify (contra entrega). Lo que manda el orden:
 *
 * 1. **Precio y botón en el primer pantallazo.** El anuncio ya hizo el gancho;
 *    quien llega quiere ver cuánto vale y cómo se pide. Foto, precio, color y
 *    «Comprar» caben en un móvil sin hacer scroll.
 * 2. **Confianza pegada al botón**: pagas al recibir, envío gratis, garantía y
 *    confirmación por WhatsApp, en una fila que se ve antes de decidir.
 * 3. **Botón fijo en móvil** cuando el bloque de compra sale de pantalla: el
 *    lector nunca tiene que volver arriba para pedir.
 * 4. **Para quién sí / para quién no** y los avisos desplegados: en contra
 *    entrega, el pedido que no encaja se devuelve, y la devolución cuesta el
 *    flete de ida y el de vuelta. Filtrar antes vende mejor que vender a todos.
 * 5. **Sin tachado, sin −55 %, sin contador, sin reseñas inventadas.** No hay
 *    precio de mercado contra el que comparar y no hay reseñas todavía. Lo que
 *    la página afirma obliga (Ley 1480).
 *
 * Dos formas de pedir: «Comprar» va derecho al checkout de Shopify con el
 * color elegido; «Añadir a la cesta» lo mete en el carrito de la tienda, que
 * también cierra en Shopify cuando todo lo que lleva es físico.
 */

/** Foto del producto: renders del proveedor hasta que haya fotos de la muestra. */
function Foto({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
      {...(eager ? { fetchpriority: "high" } : {})}
      className={`block h-full w-full rounded-2xl bg-surface-2 object-cover ${className}`}
    />
  );
}

const confianza = [
  { icon: Wallet, texto: "Pagas al recibir" },
  { icon: Truck, texto: "Envío gratis" },
  { icon: ShieldCheck, texto: "Garantía legal" },
  { icon: MessageCircle, texto: "Te confirmamos por WhatsApp" },
];

const evento = () => ({ content_name: comedero.nombre, value: comedero.precio, currency: "COP" });

export function Comedero() {
  const [color, setColor] = useState<Color>("Gris");
  const cart = useCart();
  /* Los UTM con los que llegó la visita viajan hasta el checkout: sin ellos la
     venta no se puede atribuir a la campaña que la trajo. En SSR no hay
     `window`, así que se leen después de montar. */
  const [search, setSearch] = useState("");
  useEffect(() => setSearch(window.location.search), []);

  /* Barra fija en móvil: aparece cuando el bloque de compra del hero ya pasó. */
  const cajaCompra = useRef<HTMLDivElement>(null);
  const [fija, setFija] = useState(false);
  useEffect(() => {
    const el = cajaCompra.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setFija(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    pixel("ViewContent", evento());
  }, []);

  const variante = colores.find((c) => c.nombre === color)!.variante;
  const precio = formatCOP(comedero.precio);
  const planId = color.toLowerCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: comedero.nombre,
    description: comedero.resumen,
    image: [site.url + imagenes.portada],
    url: site.url + "/comedero",
    offers: colores.map((c) => ({
      "@type": "Offer",
      name: `Color ${c.nombre}`,
      url: enlaceCheckout(c.variante),
      price: comedero.precio,
      priceCurrency: "COP",
      availability: disponible ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
    })),
  };

  const alCarrito = () => {
    cart.add(productoComedero.slug, planId);
    pixel("AddToCart", evento());
    cart.setOpen(true);
  };

  /** El botón principal: al checkout de Shopify con el color elegido. */
  const Comprar = ({ grande = false }: { grande?: boolean }) =>
    disponible ? (
      <a
        className={`btn btn-primary w-full justify-center ${grande ? "py-4 text-base" : "py-3.5"} sm:w-auto sm:px-10`}
        href={enlaceCheckout(variante, search)}
        onClick={() => pixel("InitiateCheckout", evento())}
      >
        Comprar
      </a>
    ) : (
      <a className="btn btn-primary w-full justify-center py-4 text-base sm:w-auto sm:px-10" href={waLink(mensajeAviso(color))}>
        <WhatsAppIcon className="h-5 w-5" /> Avísame cuando esté
      </a>
    );

  const Anadir = () =>
    disponible ? (
      <button type="button" onClick={alCarrito} className="btn btn-ghost w-full justify-center sm:w-auto">
        <ShoppingBag className="h-5 w-5" aria-hidden="true" /> Añadir a la cesta
      </button>
    ) : null;

  const Selector = ({ compacto = false }: { compacto?: boolean }) => (
    <div className={`flex flex-wrap ${compacto ? "justify-center gap-2" : "gap-2"}`}>
      {colores.map((c) => {
        const on = c.nombre === color;
        return (
          <button
            key={c.nombre}
            type="button"
            aria-pressed={on}
            onClick={() => setColor(c.nombre)}
            className={`flex items-center gap-1.5 rounded-full border text-[13px] font-semibold transition-colors ${compacto ? "px-2.5 py-1.5" : "px-3 py-2"} ${
              on ? "border-neb bg-neb-soft text-neb" : "border-line text-mute hover:border-neb/50"
            }`}
          >
            <img src={imagenes.porColor[c.nombre]} alt="" loading="lazy" className="h-7 w-5 shrink-0 rounded object-cover" />
            {c.nombre}
            {on && <Check aria-hidden="true" className="h-4 w-4" />}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <Seo
        title={`Comedero por gravedad 3,2 L para perros y gatos · ${precio} contra entrega`}
        description="El alimento baja solo a medida que tu mascota come. Sin pilas ni enchufe. 3,2 litros, tres colores. Envío gratis a toda Colombia, pagas al recibir."
        path="/comedero"
        noindex={!disponible}
        image={imagenes.og}
        jsonLd={jsonLd}
      />
      <MetaPixel />

      {/* ── 1 · Hero: foto, precio, color y botón en el primer pantallazo ── */}
      <section className="relative overflow-hidden">
        <Telon name="telon-aurora" opacity={0.4} />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 pb-12 pt-[124px] md:grid-cols-2 md:items-start md:gap-12 md:pb-20 md:pt-[164px]">
          <div className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl md:aspect-square">
              <img
                src={imagenes.portada}
                srcSet={`${imagenes.portadaSm} 520w, ${imagenes.portada} 1000w`}
                sizes="(min-width: 768px) 50vw, 100vw"
                width={1000}
                height={1000}
                alt="Comedero por gravedad en gris, azul y verde"
                {...{ fetchpriority: "high" }}
                decoding="sync"
                className="block h-full w-full object-cover"
              />
            </div>
            <Astro pose="chibi-espera" className="pointer-events-none absolute -bottom-3 -left-3 h-24 md:h-32" small decorative />
          </div>

          <div>
            <p className="kicker text-neb">Para perros y gatos · contra entrega</p>
            <h1 className="mt-3 font-display text-[clamp(30px,5vw,46px)] font-bold leading-[1.04] tracking-[-0.02em] text-balance">
              {comedero.titular}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-mute">{comedero.resumen}</p>

            <div ref={cajaCompra} className="card glow-border mt-4 p-5" id="comprar">
              <div className="flex items-baseline justify-between gap-3">
                {/* Sin tachado: ver el comentario de cabecera. */}
                <p className="num text-[38px] font-bold leading-none">{precio}</p>
                <p className="text-xs text-faint">Envío gratis incluido</p>
              </div>
              <p className="mt-4 text-sm font-bold">Elige el color</p>
              <div className="mt-2.5">
                <Selector />
              </div>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Comprar grande />
                <Anadir />
              </div>
              <a className="mt-3 flex items-center justify-center gap-1.5 text-sm text-mute hover:text-ink" href={waLink(mensajeWa(color))}>
                <WhatsAppIcon className="h-4 w-4" /> ¿Dudas? Escríbenos
              </a>
            </div>

            {/* Confianza justo debajo del botón: se lee antes de decidir y no empuja el precio bajo el pliegue */}
            <ul className="mt-4 grid grid-cols-2 gap-2 text-[13px] font-semibold">
              {confianza.map(({ icon: Icon, texto }) => (
                <li key={texto} className="flex items-center gap-2 rounded-xl border border-line bg-surface/70 px-3 py-2">
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-mint" /> {texto}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 2 · El problema ── */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <ul className="grid gap-4 sm:grid-cols-2">
          {problema.map((p) => (
            <li key={p.titulo} className="card p-5">
              <p className="font-bold leading-snug">{p.titulo}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-mute">{p.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3 · Las tres claves ── */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeading kicker="Cómo funciona" title="Lo llenas una vez y él se encarga">
            Llenas el tanque y el alimento va cayendo al plato conforme se va comiendo. Nada que enchufar,
            nada que programar.
          </SectionHeading>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {claves.map((c, i) => (
              <Reveal key={c.spec} delay={i * 0.06}>
                <div className="card h-full p-6">
                  <p className="num text-sm font-bold text-neb">{c.spec}</p>
                  <p className="mt-2 text-xl font-bold leading-tight">{c.titulo}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{c.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · Así se ve ── */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <SectionHeading kicker="Así se ve" title="Tres colores, un mismo comedero" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="aspect-[4/3] sm:col-span-2 sm:aspect-[16/10]">
            <Foto src={imagenes.ancho} alt="Los tres colores del comedero, de frente" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
            <div className="aspect-square"><Foto src={imagenes.porColor.Gris} alt="Comedero gris" /></div>
            <div className="aspect-square"><Foto src={imagenes.porColor.Verde} alt="Comedero verde" /></div>
          </div>
        </div>
      </section>

      {/* ── 5 · Para quién sí y para quién no ── */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeading kicker="Antes de pedir" title="Para quién es, y para quién no">
            Preferimos que lo sepas ahora y no cuando llegue.
          </SectionHeading>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {paraQuien.map((g) => (
              <div key={g.titulo} className={`card p-6 ${g.si ? "border-mint/40" : "border-gold/40"}`}>
                <p className={`flex items-center gap-2 font-bold ${g.si ? "text-mint" : "text-gold"}`}>
                  {g.si ? <PackageCheck aria-hidden="true" className="h-4 w-4" /> : <Info aria-hidden="true" className="h-4 w-4" />}
                  {g.titulo}
                </p>
                <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-mute">
                  {g.puntos.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 · Gravedad frente a programable ── */}
      <section className="mx-auto max-w-4xl px-5 py-12">
        <SectionHeading kicker="Comparado" title="Por qué gravedad y no un dispensador programable" />
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-faint"> </th>
                <th className="px-4 py-3 font-bold">Este comedero</th>
                <th className="px-4 py-3 font-semibold text-mute">Programable</th>
              </tr>
            </thead>
            <tbody>
              {comparativa.map((f) => (
                <tr key={f.que} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold">{f.que}</td>
                  <td className="px-4 py-3 text-ink">{f.este}</td>
                  <td className="px-4 py-3 text-mute">{f.otro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-faint">Si necesitas raciones medidas u horarios, el programable es lo tuyo. Este no lo hace, y lo decimos.</p>
      </section>

      {/* ── 7 · Cómo funciona el contraentrega ── */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <SectionHeading kicker="Contra entrega" title="Pagas cuando lo tienes en la mano">
            Sin adelantos, sin tarjeta, y el envío va por nuestra cuenta.
          </SectionHeading>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {pasos.map((p, i) => (
              <Reveal key={p.titulo} delay={i * 0.06}>
                <li className="card h-full p-6">
                  <span className="num flex h-9 w-9 items-center justify-center rounded-full bg-neb text-sm font-bold text-neb-ink">{i + 1}</span>
                  <p className="mt-4 font-bold leading-snug">{p.titulo}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-mute">{p.texto}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="mt-6 flex items-center gap-2 text-sm text-faint">
            <Truck aria-hidden="true" className="h-4 w-4 shrink-0" /> Los tiempos son días hábiles y dependen de la ciudad.
          </p>
        </div>
      </section>

      {/* ── 8 · Ficha técnica ── */}
      <section className="mx-auto max-w-4xl px-5 py-12">
        <SectionHeading kicker="Ficha técnica" title="Lo que llega a tu casa" />
        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {ficha.map(([k, v]) => (
            <div key={k} className="bg-bg px-5 py-4">
              <dt className="kicker text-faint">{k}</dt>
              <dd className="mt-1 text-sm font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 9 · Garantía ── */}
      <section className="mx-auto max-w-4xl px-5 pb-12">
        <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <Astro pose="escudo" className="h-24 shrink-0" small decorative />
          <div>
            <p className="flex items-center gap-2 font-bold">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-mint" /> Si llega mal, respondemos
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Te cubre la garantía legal que manda la ley, y si el producto llega roto o no es lo que pediste, lo
              resolvemos. Las condiciones están en{" "}
              <Link className="font-semibold text-neb underline-offset-4 hover:underline" to="/cambios-y-garantias">
                cambios y garantías
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── 10 · Preguntas ── */}
      <section className="mx-auto max-w-4xl px-5 pb-12">
        <SectionHeading kicker="Preguntas" title="Lo que más nos preguntan" />
        <ul className="mt-6 grid gap-3">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </ul>
      </section>

      {/* ── 11 · Avisos y cierre ── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <div className="rounded-2xl border border-gold/30 bg-gold-soft/40 p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-gold">
              <Info aria-hidden="true" className="h-4 w-4" /> Léelo antes de pedir
            </p>
            <ul className="mt-3 grid gap-2.5">
              {avisos.map((a) => (
                <li key={a.titulo} className="text-sm leading-relaxed">
                  <strong className="font-bold">{a.titulo}.</strong> <span className="text-mute">{a.texto}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-center gap-5 text-center">
            <Astro pose="pulgar" className="h-28" />
            <div>
              <h2 className="font-display text-[clamp(26px,4vw,38px)] font-bold leading-tight tracking-[-0.02em] text-balance">
                Que no vuelva a amanecer vacío
              </h2>
              <p className="num mt-3 text-2xl font-bold">{precio}</p>
              <p className="mt-1 text-sm text-mute">Pagas al recibir · Envío gratis</p>
            </div>
            <Selector compacto />
            <motion.div
              className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <Comprar grande />
              <Anadir />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Barra fija en móvil: el bloque de compra ya pasó, el botón se queda ── */}
      {disponible && (
        <div
          aria-hidden={!fija}
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden ${
            fija ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-mute">Comedero · {color}</p>
              <p className="num text-lg font-bold leading-tight">{precio}</p>
            </div>
            <button type="button" onClick={alCarrito} aria-label="Añadir a la cesta" tabIndex={fija ? 0 : -1} className="icon-btn h-11 w-11 shrink-0">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            </button>
            <a
              className="btn btn-primary shrink-0 px-6 py-3"
              href={enlaceCheckout(variante, search)}
              tabIndex={fija ? 0 : -1}
              onClick={() => pixel("InitiateCheckout", evento())}
            >
              Comprar
            </a>
          </div>
        </div>
      )}
    </>
  );
}
