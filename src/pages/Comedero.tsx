import { motion } from "framer-motion";
import { Check, Info, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
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
  disponible,
  enlaceCheckout,
  faqs,
  ficha,
  imagenes,
  mensajeAviso,
  mensajeWa,
  pasos,
  problema,
  type Color,
} from "@/data/comedero";
import { formatCOP, site, waLink } from "@/data/site";
import { Reveal } from "@/lib/anim";

/**
 * Landing de un solo producto: el comedero por gravedad.
 *
 * NO es la ficha genérica /producto/:slug. Es una página de aterrizaje de
 * pauta: el anuncio de Meta cae aquí, así que el orden es el del embudo —
 * primero el problema, luego el producto, y el botón solo cuando el lector ya
 * sabe qué está comprando.
 *
 * Dos cosas que la separan del resto de la tienda, y son a propósito:
 *
 * 1. **Sin tachado ni −55 %.** El catálogo pinta descuento en todo; aquí no,
 *    porque nadie más vende este comedero en Colombia y no hay precio contra
 *    el que comparar. Esta página no toca `catalog.ts` ni `price.ts`.
 * 2. **Los avisos van encima del botón y desplegados.** No en un acordeón al
 *    final. En contraentrega, el cliente que compra sin leer devuelve, y la
 *    devolución cuesta el flete de ida y el de vuelta.
 */

/** Foto del producto: renders del proveedor hasta que haya fotos de la muestra. */
function Foto({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
      // React 18 no conoce `fetchPriority` en camelCase: pasa el atributo tal cual
      {...(eager ? { fetchpriority: "high" } : {})}
      className={`block h-full w-full rounded-2xl bg-surface-2 object-cover ${className}`}
    />
  );
}

export function Comedero() {
  const [color, setColor] = useState<Color>("Gris");
  /* Los UTM con los que llegó la visita viajan hasta el checkout: sin ellos la
     venta no se puede atribuir a la campaña que la trajo. En SSR no hay
     `window`, así que se leen después de montar. */
  const [search, setSearch] = useState("");
  useEffect(() => setSearch(window.location.search), []);

  const variante = colores.find((c) => c.nombre === color)!.variante;
  const precio = formatCOP(comedero.precio);

  /* Ficha de producto para buscadores. Una oferta por color, cada una con su
     enlace de carrito: es lo que Google pide para pintar precio y stock. Sin
     UTM aquí: es la URL canónica del checkout, no la de una campaña. */
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

  const Comprar = ({ id }: { id: string }) =>
    disponible ? (
      <a
        className="btn btn-primary w-full justify-center py-4 text-base sm:w-auto sm:px-10"
        href={enlaceCheckout(variante, search)}
        onClick={() => pixel("InitiateCheckout", { content_name: comedero.nombre, value: comedero.precio, currency: "COP" })}
      >
        Comprar contraentrega · {precio}
      </a>
    ) : (
      <a
        className="btn btn-primary w-full justify-center py-4 text-base sm:w-auto sm:px-10"
        href={waLink(mensajeAviso(color))}
        onClick={() => pixel("Lead", { content_name: comedero.nombre })}
        id={id}
      >
        <WhatsAppIcon className="h-5 w-5" /> Avísame cuando esté
      </a>
    );

  const PorWhatsapp = () => (
    <a className="btn btn-ghost w-full justify-center sm:w-auto" href={waLink(mensajeWa(color))}>
      <WhatsAppIcon className="h-5 w-5" /> ¿Dudas? Escríbenos
    </a>
  );

  return (
    <>
      <Seo
        title={`Comedero por gravedad 3,2 L para perros y gatos · ${precio} contra entrega`}
        description="El alimento baja solo a medida que tu mascota come. Sin pilas ni enchufe. 3,2 litros, tres colores. Envío a toda Colombia, pagas al recibir."
        path="/comedero"
        /* Mientras no se pueda comprar, fuera de buscadores: el tráfico entra
           por el anuncio, y un resultado que no se puede comprar solo gasta
           visitas y reputación. Se abre solo con la bandera `disponible`. */
        noindex={!disponible}
        image={imagenes.og}
        jsonLd={jsonLd}
      />
      <MetaPixel />

      {/* ── 1 · El problema abre ── */}
      <section className="relative overflow-hidden">
        <Telon name="telon-aurora" opacity={0.4} />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-[140px] md:grid-cols-[1.1fr_0.9fr] md:items-center md:pb-24 md:pt-[164px]">
          <div>
            <p className="kicker text-neb">Para perros y gatos</p>
            <h1 className="mt-3 font-display text-[clamp(34px,6vw,58px)] font-bold leading-[1.02] tracking-[-0.02em] text-balance">
              {comedero.titular}
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-mute">{comedero.resumen}</p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {problema.map((p) => (
                <li key={p.titulo} className="card p-5">
                  <p className="font-bold leading-snug">{p.titulo}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-mute">{p.texto}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a className="btn btn-primary justify-center py-3.5" href="#comprar">
                Ver precio y colores
              </a>
              <p className="num text-sm text-faint">Pagas al recibir · Envío a toda Colombia</p>
            </div>
          </div>

          <div className="relative flex items-end justify-center">
            <div className="aspect-square w-full max-w-[440px] overflow-hidden rounded-2xl shadow-xl">
              <img
                src={imagenes.portada}
                srcSet={`${imagenes.portadaSm} 520w, ${imagenes.portada} 1000w`}
                sizes="(min-width: 768px) 440px, 90vw"
                width={1000}
                height={1000}
                alt="Comedero por gravedad en gris, azul y verde"
                {...{ fetchpriority: "high" }}
                decoding="sync"
                className="block h-full w-full object-cover"
              />
            </div>
            <Astro pose="chibi-espera" className="pointer-events-none absolute -bottom-2 -left-2 h-28 md:h-36" small decorative />
          </div>
        </div>
      </section>

      {/* ── 2 · El producto en uso ── */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <SectionHeading kicker="Así se ve" title="Lo llenas una vez y él se encarga">
          Llenas el tanque y el alimento va cayendo al plato conforme se va comiendo. Nada que enchufar,
          nada que programar.
        </SectionHeading>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="aspect-[4/3] sm:col-span-2 sm:aspect-[16/10]">
            <Foto src={imagenes.ancho} alt="Los tres colores del comedero, de frente" />
          </div>
          {/* En móvil los dos pequeños van en pareja: tres fotos apiladas dejaban
              media pantalla de scroll en una página que se paga por visita. */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
            <div className="aspect-square"><Foto src={imagenes.porColor.Gris} alt="Comedero gris" /></div>
            <div className="aspect-square"><Foto src={imagenes.porColor.Verde} alt="Comedero verde" /></div>
          </div>
        </div>
      </section>

      {/* ── 3 · Las tres claves ── */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-6 md:grid-cols-3">
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

      {/* ── 4 y 5 · Precio, color, avisos y botón ── */}
      <section className="mx-auto max-w-4xl px-5 py-16" id="comprar">
        <div className="card glow-border p-6 sm:p-9">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker text-faint">Comedero por gravedad · 3,2 L</p>
              {/* Sin tachado: ver el comentario de cabecera. */}
              <p className="num mt-1 text-[42px] font-bold leading-none">{precio}</p>
              <p className="mt-2 text-sm text-mute">Pagas cuando lo recibes. Sin tarjeta.</p>
            </div>
            <div className="hidden h-32 w-24 overflow-hidden rounded-xl sm:block md:h-40 md:w-28">
              <Foto src={imagenes.porColor[color]} alt={`Comedero ${color.toLowerCase()}`} />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-bold">Elige el color</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {colores.map((c) => {
                const on = c.nombre === color;
                return (
                  <button
                    key={c.nombre}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setColor(c.nombre)}
                    className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                      on ? "border-neb bg-neb-soft text-neb" : "border-line text-mute hover:border-neb/50"
                    }`}
                  >
                    <img src={imagenes.porColor[c.nombre]} alt="" loading="lazy" className="h-9 w-7 shrink-0 rounded-md object-cover" />
                    <span className="h-3 w-3 shrink-0 rounded-full border border-line" style={{ background: c.hex }} />
                    {c.nombre}
                    {on && <Check aria-hidden="true" className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Los avisos, completos y antes del botón. */}
          <div className="mt-8 rounded-2xl border border-gold/30 bg-gold-soft/40 p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-gold">
              <Info aria-hidden="true" className="h-4 w-4" /> Léelo antes de pedir
            </p>
            <ul className="mt-3 grid gap-3">
              {avisos.map((a) => (
                <li key={a.titulo} className="text-sm leading-relaxed">
                  <strong className="font-bold">{a.titulo}.</strong>{" "}
                  <span className="text-mute">{a.texto}</span>
                </li>
              ))}
            </ul>
          </div>

          {!disponible && (
            <p className="mt-6 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-mute">
              Todavía no está a la venta: estamos probando la primera muestra antes de despacharlo. Déjanos
              tu WhatsApp y te escribimos apenas entre.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Comprar id="cta-principal" />
            <PorWhatsapp />
          </div>
        </div>
      </section>

      {/* ── 6 · El contraentrega ── */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <SectionHeading kicker="Cómo funciona" title="Pagas cuando lo tienes en la mano">
            Sin adelantos y sin tarjeta.
          </SectionHeading>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {pasos.map((p, i) => (
              <Reveal key={p.titulo} delay={i * 0.06}>
                <li className="card h-full p-6">
                  <span className="num flex h-9 w-9 items-center justify-center rounded-full bg-neb text-sm font-bold text-neb-ink">
                    {i + 1}
                  </span>
                  <p className="mt-4 font-bold leading-snug">{p.titulo}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-mute">{p.texto}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="mt-6 flex items-center gap-2 text-sm text-faint">
            <Truck aria-hidden="true" className="h-4 w-4 shrink-0" />
            Los tiempos son días hábiles y dependen de la ciudad.
          </p>
        </div>
      </section>

      {/* ── Ficha técnica ── */}
      <section className="mx-auto max-w-4xl px-5 py-14">
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

      {/* ── 7 · Garantía ── */}
      <section className="mx-auto max-w-4xl px-5 pb-14">
        <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <Astro pose="escudo" className="h-24 shrink-0" small decorative />
          <div>
            <p className="flex items-center gap-2 font-bold">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-mint" /> Si llega mal, respondemos
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Te cubre la garantía legal que manda la ley, y si el producto llega roto o no es lo que
              pediste, lo resolvemos. Las condiciones de cambios y devoluciones están en{" "}
              <Link className="font-semibold text-neb underline-offset-4 hover:underline" to="/cambios-y-garantias">
                cambios y garantías
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── 8 · Preguntas ── */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <SectionHeading kicker="Preguntas" title="Lo que más nos preguntan" />
        <ul className="mt-6 grid gap-3">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </ul>
      </section>

      {/* ── 9 · El botón otra vez ── */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 py-16 text-center">
          <Astro pose="pulgar" className="h-32" />
          <div>
            <h2 className="font-display text-[clamp(26px,4vw,38px)] font-bold leading-tight tracking-[-0.02em] text-balance">
              Que no vuelva a amanecer vacío
            </h2>
            <p className="num mt-3 text-2xl font-bold">{precio}</p>
            <p className="mt-1 text-sm text-mute">
              Color: {color} · Pagas al recibir
            </p>
          </div>
          <motion.div
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <Comprar id="cta-cierre" />
            <PorWhatsapp />
          </motion.div>
        </div>
      </section>
    </>
  );
}
