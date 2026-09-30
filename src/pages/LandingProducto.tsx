import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { PasosEntrega, RejillaConfianza } from "@/components/ConfianzaEntrega";
import { MediosPago } from "@/components/MediosPago";
import { pixel } from "@/components/MetaPixel";
import { usePedidoContraEntrega } from "@/components/PedidoContraEntrega";
import { Seo } from "@/components/Seo";
import { landingPorSlug, type SeccionPlantilla } from "@/data/landings";
import { formatCOP, site } from "@/data/site";
import { conAtribucion, useAtribucion } from "@/lib/atribucion";
import { useCart } from "@/lib/cart";
import { rangoEntrega } from "@/lib/entrega";
import { BloquePrepago, LineaPrepago, usePrepago } from "@/lib/prepago";
import { TIENDA_SHOPIFY } from "@/lib/shopify";
import { NotFound } from "@/pages/NotFound";
import "@/styles/comedero-landing.css";

/**
 * Página de venta de un producto, pintada desde su plantilla de Shopify
 * (encargo de Tor, 26-sep-2026: docs/ENCARGO-ASTRO-ventilador-aspiradora.md).
 *
 * Cada sección del tema (dn-oferta, dn-imagen-texto, dn-pasos, dn-cifras,
 * dn-comparativa, dn-listas, dn-garantia, dn-cta, dn-faq) sale con el mismo
 * marcado y las mismas clases que su .liquid, y el CSS es el del calco de
 * /comedero (styles/comedero-landing.css = dn-landing.css). Los textos vienen
 * de la plantilla tal cual (data/landings/<producto>.json); lo demás (título,
 * precio, variante, SEO) de data/landings.ts.
 *
 * Lo que es de este sitio, como en /comedero: «Comprar» va al checkout de
 * Shopify con la atribución del anuncio, el píxel manda sus eventos con la
 * variante, y «o añádelo a la cesta» lo lleva a la cesta de la tienda. Con el
 * formulario contra entrega encendido (components/PedidoContraEntrega.tsx),
 * «Comprar» abre el formulario y el checkout queda como «o paga ya».
 */

const bloques = (s: SeccionPlantilla) => (s.block_order ?? []).map((id) => s.blocks![id]);
const px = (s: SeccionPlantilla, extraArriba = 0): CSSProperties =>
  ({ paddingTop: (s.settings.padding_top ?? 48) + extraArriba, paddingBottom: s.settings.padding_bottom ?? 48, "--dn-acento": s.settings.acento }) as CSSProperties;
/** Texto enriquecido del tema (solo <p>): se pinta como párrafos, sin HTML. */
const parrafos = (html = "") =>
  html
    .split(/<\/p>/i)
    .map((t) => t.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim())
    .filter(Boolean);

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const Escudo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const Flecha = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const IrAComprar = ({ children, href = "#comprar", reveal = false }: { children: ReactNode; href?: string; reveal?: boolean }) => (
  <a className={`dn-boton dn-boton--primario${reveal ? " dn-reveal" : ""}`} href={href}>
    {children}
  </a>
);
/** Cabecera centrada del tema: kicker + titular (+ texto). */
function Cabeza({ s, centro = true }: { s: SeccionPlantilla; centro?: boolean }) {
  return (
    <div className={`dn-cabeza dn-reveal${centro ? " dn-cabeza--centro" : ""}`}>
      {s.settings.kicker && <p className="dn-kicker">{s.settings.kicker}</p>}
      <h2 className="dn-h2" style={{ fontSize: s.settings.heading_size }}>
        {s.settings.headline}
      </h2>
      {s.settings.texto && <p className="dn-body">{s.settings.texto}</p>}
    </div>
  );
}

export function LandingProducto({ slug }: { slug: string }) {
  const L = landingPorSlug(slug);
  const cart = useCart();
  const atribucion = useAtribucion();
  const raiz = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLDivElement>(null);
  const minis = useRef<HTMLDivElement>(null);
  const deslizando = useRef<number>();
  const boton = useRef<HTMLElement>(null);
  const hoja = useRef<HTMLDialogElement>(null);

  const secciones = L ? L.plantilla.order.map((id) => ({ id, ...L.plantilla.sections[id] })).filter((s) => !s.disabled) : [];
  const oferta = secciones.find((s) => s.type === "dn-oferta");
  const O = oferta?.settings ?? {};
  const fotos = oferta
    ? bloques(oferta)
        .filter((b) => b.type === "foto")
        .map((b) => ({ archivo: b.settings.imagen_asset as string, alt: b.settings.alt as string, rotulo: b.settings.rotulo as string }))
    : [];
  const packs = oferta
    ? bloques(oferta)
        .filter((b) => b.type === "pack")
        .map((b) => b.settings as { cantidad: number; titulo: string; detalle: string; insignia: string; descuento: number })
    : [];

  // El pack marcado al abrir es el de «pack_por_defecto» de la plantilla, como en Shopify (dn-oferta);
  // si no hay un pack con esa cantidad, el primero.
  const [cantidad, setCantidad] = useState(() => {
    const def = Number(O.pack_por_defecto);
    return packs.some((p) => Number(p.cantidad) === def) ? def : (packs[0]?.cantidad ?? 1);
  });
  const [foto, setFoto] = useState(0);
  const [barra, setBarra] = useState(false);
  const [entrega, setEntrega] = useState<string | null>(null);
  const prepago = usePrepago();

  const precio = L?.precio ?? 0;
  const pack = packs.find((p) => p.cantidad === cantidad);
  /* Lo que cobra el checkout: el descuento automático de Shopify ya restado */
  const precioPack = (p: { cantidad: number; descuento: number }) => precio * p.cantidad - (p.descuento || 0);
  const total = pack ? precioPack(pack) : precio * cantidad;
  const checkout = L ? conAtribucion(`https://${TIENDA_SHOPIFY}/cart/${L.variante}:${cantidad}`, atribucion) : "";
  const evento = (valor = precio, unidades = 1) => ({
    content_ids: [L?.variante],
    content_type: "product",
    content_name: L?.nombre,
    value: valor,
    num_items: unidades,
    currency: "COP",
  });
  const cod = usePedidoContraEntrega(
    { nombre: L?.nombre ?? "", variante: L?.variante ?? "", cantidad, total, foto: L && fotos[0] ? L.carpeta + fotos[0].archivo : undefined },
    checkout,
    atribucion
  );

  useEffect(() => {
    if (L?.disponible) pixel("ViewContent", evento());
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Galería, como initCarrusel de dn-landing.js */
  const suave = (): ScrollBehavior => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  const ir = (i: number) => {
    const n = fotos.length;
    i = (i + n) % n;
    const p = pista.current;
    const f = p?.children[i] as HTMLElement | undefined;
    if (p && f) p.scrollTo({ left: f.offsetLeft - p.offsetLeft, behavior: suave() });
    setFoto(i);
  };
  const alDeslizar = () => {
    const p = pista.current;
    if (!p) return;
    window.clearTimeout(deslizando.current);
    deslizando.current = window.setTimeout(() => setFoto(Math.round(p.scrollLeft / Math.max(1, p.clientWidth))), 80);
  };
  useEffect(() => {
    const fila = minis.current;
    const m = fila?.children[foto] as HTMLElement | undefined;
    if (fila && m) fila.scrollTo({ left: m.offsetLeft - fila.clientWidth / 2 + m.clientWidth / 2, behavior: suave() });
  }, [foto]);

  /* Entrega estimada: solo en el navegador (la fecha de hoy no es la del build) */
  useEffect(() => {
    try {
      const festivos = String(O.festivos ?? "").split(",").map((f) => f.trim()).filter(Boolean);
      setEntrega(rangoEntrega(O.dias_min ?? 3, O.dias_max ?? 6, festivos));
    } catch {
      /* queda el texto de respaldo */
    }
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Barra fija: se ve siempre que el botón principal no esté en pantalla, desde el
     primer pantallazo (en el celular «Comprar» queda debajo de la galería) y
     después de pasarlo. Como dn-landing.js de Shopify desde el 27-sep-2026. */
  useEffect(() => {
    const b = boton.current;
    if (!b || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setBarra(!e.isIntersecting));
    io.observe(b);
    return () => io.disconnect();
  }, [slug]);

  /* Apariciones y cifras que cuentan, como initReveals e initContadores */
  useEffect(() => {
    const el = raiz.current;
    if (!el || !("IntersectionObserver" in window)) {
      el?.querySelectorAll(".dn-reveal").forEach((n) => n.classList.add("dn-visible"));
      return;
    }
    const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = el.querySelectorAll(".dn-reveal:not(.dn-visible)");
    if (reducir) {
      reveals.forEach((n) => n.classList.add("dn-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("dn-visible");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((n) => io.observe(n));
    const cuenta = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          cuenta.unobserve(e.target);
          const nodo = e.target as HTMLElement;
          const txt = nodo.dataset.dnContar ?? "";
          const m = txt.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
          if (!m) return;
          const dec = (m[2].split(/[.,]/)[1] || "").length;
          const fin = parseFloat(m[2].replace(",", "."));
          if (!fin) return;
          let t0: number | null = null;
          const paso = (ts: number) => {
            if (t0 === null) t0 = ts;
            const p = Math.min(1, (ts - t0) / 1100);
            nodo.textContent = m[1] + (fin * (1 - Math.pow(1 - p, 3))).toFixed(dec).replace(".", ",") + m[3];
            if (p < 1) requestAnimationFrame(paso);
            else nodo.textContent = txt;
          };
          requestAnimationFrame(paso);
        }),
      { threshold: 0.4 }
    );
    el.querySelectorAll("[data-dn-contar]").forEach((n) => cuenta.observe(n));
    return () => {
      io.disconnect();
      cuenta.disconnect();
    };
  }, [slug]);

  if (!L || !oferta) return <NotFound />;

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
  const alCheckout = () => pixel("InitiateCheckout", evento(total, cantidad));
  const alaCesta = () => {
    cart.add(L.slug, "u", cantidad);
    pixel("AddToCart", evento(total, cantidad));
    cart.setOpen(true);
  };

  /* Funciones y no componentes: un componente declarado dentro del render se
     vuelve a montar en cada cambio de estado (y la barra perdería su botón). */
  const comprar = (principal = false) =>
    L.disponible && cod.encendido ? (
      <button
        ref={principal ? (boton as RefObject<HTMLButtonElement>) : undefined}
        type="button"
        className="dn-boton dn-boton--primario dn-oferta__boton"
        onClick={() => {
          cerrarHoja();
          cod.abrir();
        }}
      >
        <span>Comprar y pagar al recibir</span>
        <Flecha />
      </button>
    ) : L.disponible ? (
      <a ref={principal ? (boton as RefObject<HTMLAnchorElement>) : undefined} className="dn-boton dn-boton--primario dn-oferta__boton" href={checkout} onClick={alCheckout}>
        <span>{O.boton_texto}</span>
        <Flecha />
      </a>
    ) : (
      /* En borrador: como el tema con un producto sin disponibilidad */
      <button type="button" className="dn-boton dn-boton--primario dn-oferta__boton" disabled>
        <span>{O.agotado_texto}</span>
      </button>
    );
  const selectorPacks = (compacto = false) =>
    packs.length > 0 && (
      <div className={`dn-packs${compacto ? " dn-packs--compacto" : ""}`}>
        {packs.map((p) => (
          <label key={p.cantidad} className="dn-pack">
            <input type="radio" name={compacto ? "dn-hoja-pack" : "dn-pack"} value={p.cantidad} checked={cantidad === p.cantidad} onChange={() => setCantidad(p.cantidad)} />
            <span className="dn-pack__caja">
              {!compacto && p.insignia && <em className="dn-pack__insignia">{p.insignia}</em>}
              <span className="dn-pack__texto">
                <b>{p.titulo}</b>
                {!compacto && <small>{p.detalle}</small>}
              </span>
              {!compacto && (
                <span className="dn-pack__precio">
                  {p.descuento > 0 && <s>{formatCOP(precio * p.cantidad)}</s>}
                  <span>{formatCOP(precioPack(p))}</span>
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    );

  const seccion = (s: (typeof secciones)[number]) => {
    const S = s.settings;
    const img = (archivo?: string) => (archivo ? L.carpeta + archivo : undefined);
    switch (s.type) {
      case "dn-oferta":
        return (
          <section key={s.id} className="dn-section dn-oferta" id="comprar" style={px(s, 108)}>
            {/* Aviso de arriba, pegado al menú: solo ofertas reales (el pack, el envío). */}
            {S.aviso && (
              <p className="dn-aviso" style={{ marginTop: -(S.padding_top ?? 48), marginBottom: S.padding_top ?? 48 }}>
                {S.aviso}
              </p>
            )}
            <div className="dn-container dn-oferta__rejilla">
              <div className="dn-oferta__galeria">
                <div
                  className="dn-oferta__pista"
                  ref={pista}
                  onScroll={alDeslizar}
                  tabIndex={0}
                  aria-label="Fotos del producto"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      ir(foto - 1);
                    }
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      ir(foto + 1);
                    }
                  }}
                >
                  {fotos.map((f, i) => (
                    <figure key={f.archivo} className="dn-oferta__foto">
                      <img
                        src={img(f.archivo)}
                        alt={f.alt}
                        width={1000}
                        height={1000}
                        loading={i === 0 ? "eager" : "lazy"}
                        {...(i === 0 ? { fetchpriority: "high" } : {})}
                      />
                      {f.rotulo && <figcaption>{f.rotulo}</figcaption>}
                    </figure>
                  ))}
                </div>
                {fotos.length > 1 && (
                  <>
                    <button type="button" className="dn-oferta__flecha dn-oferta__flecha--prev" aria-label="Foto anterior" onClick={() => ir(foto - 1)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 5-7 7 7 7" />
                      </svg>
                    </button>
                    <button type="button" className="dn-oferta__flecha dn-oferta__flecha--next" aria-label="Foto siguiente" onClick={() => ir(foto + 1)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 5 7 7-7 7" />
                      </svg>
                    </button>
                    <span className="dn-oferta__contador" aria-live="polite">
                      {foto + 1} / {fotos.length}
                    </span>
                    <div className="dn-oferta__minis" role="group" aria-label="Fotos del producto" ref={minis}>
                      {fotos.map((f, i) => (
                        <button
                          key={f.archivo}
                          type="button"
                          className={`dn-oferta__mini${i === foto ? " activa" : ""}`}
                          aria-label={`Ver foto ${i + 1}`}
                          aria-pressed={i === foto}
                          onClick={() => ir(i)}
                        >
                          <img src={`${L.carpeta}mini/${f.archivo}`} alt="" loading="lazy" width={80} height={80} />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="dn-oferta__compra">
                {S.kicker && <p className="dn-kicker">{S.kicker}</p>}
                <h1 className="dn-oferta__titulo" style={{ fontSize: S.heading_size }}>
                  {S.headline || L.nombre}
                </h1>
                <p className="dn-oferta__producto">{L.nombre}</p>
                {S.subtitulo && <p className="dn-oferta__sub">{S.subtitulo}</p>}

                <ul className={`dn-oferta__checks${S.checks_emoji ? " dn-oferta__checks--emoji" : ""}`}>
                  {[S.check1, S.check2, S.check3, S.check4].filter(Boolean).map((c: string) => (
                    <li key={c}>
                      {!S.checks_emoji && <Check />}
                      {c}
                    </li>
                  ))}
                </ul>

                {/* Tachado honesto (30-sep-2026): solo con un pack con descuento, y lo tachado es lo que
                    costarían esas unidades sueltas (como en dn-oferta de Shopify). */}
                <div className="dn-oferta__precio">
                  <strong>{formatCOP(total)}</strong>
                  {pack && pack.descuento > 0 && <s className="dn-oferta__antes">{formatCOP(precio * pack.cantidad)}</s>}
                  {pack && pack.descuento > 0 && <em className="dn-oferta__ahorro">Ahorras {formatCOP(pack.descuento)}</em>}
                  {S.precio_nota && <span>{S.precio_nota}</span>}
                </div>

                {packs.length > 0 && (
                  <div className="dn-oferta__bloque">
                    <p className="dn-oferta__etiqueta">{S.packs_titulo}</p>
                    {selectorPacks()}
                  </div>
                )}

                {S.prepago_mostrar && prepago && <BloquePrepago p={prepago} />}
                <div className="dn-oferta__form">{comprar(true)}</div>
                {L.disponible && cod.encendido && (
                  <p className="dn-oferta__alterno">
                    <a href={checkout} onClick={alCheckout}>
                      o paga ya con tarjeta, PSE, Nequi o Bre-B
                    </a>
                  </p>
                )}
                {L.disponible && (
                  <p className="mt-2 text-center">
                    <button type="button" onClick={alaCesta} className="text-[12px] font-semibold text-mute underline underline-offset-4 hover:text-ink">
                      o añádelo a la cesta
                    </button>
                  </p>
                )}

                <MediosPago contraEntrega />

                <RejillaConfianza datos={[S.confianza1, S.confianza2, S.confianza3, S.confianza4]} nota={S.confianza_nota} />

                {S.mostrar_entrega && (
                  <PasosEntrega
                    rango={entrega}
                    respaldo={S.entrega_respaldo}
                    nota={S.entrega_nota}
                    paso1={S.entrega_paso1}
                    paso2Titulo={S.entrega_paso2_titulo}
                    paso2={S.entrega_paso2}
                    paso3={S.entrega_paso3}
                  />
                )}
              </div>
            </div>

            {/* Barra fija al bajar: abre la hoja de compra rápida */}
            {S.barra_fija && L.disponible && (
              <div className={`dn-barra${barra ? " visible" : ""}`} aria-hidden={!barra}>
                <div className="dn-barra__info">
                  <b>{L.nombre}</b>
                  <span>
                    <span data-dn-total-barra>{formatCOP(total)}</span> · {S.barra_nota}
                  </span>
                </div>
                <button type="button" className="dn-boton dn-boton--primario" tabIndex={barra ? 0 : -1} onClick={abrirHoja}>
                  {S.barra_texto}
                </button>
              </div>
            )}

            <dialog ref={hoja} className="dn-hoja" aria-label="Compra rápida" onClick={(e) => e.target === hoja.current && cerrarHoja()}>
              <div className="dn-hoja__caja">
                <button type="button" className="dn-hoja__cerrar" onClick={cerrarHoja} aria-label="Cerrar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
                <div className="dn-hoja__cabeza">
                  <img src={img(fotos[0]?.archivo)} alt="" width={96} height={96} loading="lazy" />
                  <div>
                    <p className="dn-hoja__titulo">{S.hoja_titulo}</p>
                    <p className="dn-hoja__total">{formatCOP(total)}</p>
                    <p className="dn-hoja__nota">{S.precio_nota}</p>
                    {S.prepago_mostrar && prepago && <LineaPrepago p={prepago} />}
                  </div>
                </div>
                {packs.length > 0 && (
                  <>
                    <p className="dn-oferta__etiqueta">{S.packs_titulo}</p>
                    {selectorPacks(true)}
                  </>
                )}
                {comprar()}
                <MediosPago contraEntrega compacto />
              </div>
            </dialog>
            {L.disponible && cod.encendido && cod.elemento}
          </section>
        );

      case "dn-duda":
        /* La duda principal (sections/dn-duda.liquid): una objeción, respondida con datos de la ficha. */
        return (
          <section key={s.id} className="dn-section dn-duda" style={px(s)}>
            <div className="dn-container dn-duda__rejilla">
              <div className="dn-duda__media dn-reveal">
                <img src={img(S.imagen_asset)} alt={S.alt} loading="lazy" width={1100} height={1100} />
              </div>
              <div className="dn-duda__texto">
                {S.kicker && <p className="dn-kicker dn-reveal">{S.kicker}</p>}
                <h2 className="dn-duda__titulo dn-reveal" style={{ fontSize: S.heading_size }}>
                  {S.pregunta}
                </h2>
                {S.remate && <p className="dn-duda__remate dn-reveal">{S.remate}</p>}
                {S.respuesta && (
                  <div className="dn-body dn-reveal">
                    {parrafos(S.respuesta).map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                {bloques(s).length > 0 && (
                  <ul className="dn-duda__puntos">
                    {bloques(s).map((b) => (
                      <li key={b.settings.texto} className="dn-reveal">
                        {b.settings.tipo === "no" ? (
                          <svg className="dn-duda__no" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6 6 18" />
                          </svg>
                        ) : (
                          <Check />
                        )}
                        <span>{b.settings.texto}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {S.cita && (
                  <figure className="dn-duda__cita dn-reveal">
                    <blockquote>«{S.cita}»</blockquote>
                    <figcaption>
                      {S.cita_autor}
                      {S.cita_fuente && (
                        <>
                          {" · "}
                          <span>{S.cita_fuente}</span>
                        </>
                      )}
                    </figcaption>
                  </figure>
                )}
              </div>
            </div>
          </section>
        );

      case "dn-imagen-texto":
        return (
          <section key={s.id} className={`dn-section dn-imtx${S.imagen_derecha ? " dn-imtx--derecha" : ""}`} style={px(s)}>
            <div className="dn-container dn-imtx__rejilla">
              <div className="dn-imtx__media dn-reveal">
                <img src={img(S.imagen_asset)} alt={S.alt} loading="lazy" width={1100} height={1100} />
                {S.rotulo && <span className="dn-escena__rotulo">{S.rotulo}</span>}
              </div>
              <div className="dn-imtx__texto">
                {S.kicker && <p className="dn-kicker dn-reveal">{S.kicker}</p>}
                <h2 className="dn-h2 dn-reveal" style={{ fontSize: S.heading_size }}>
                  {S.headline}
                </h2>
                {S.texto && (
                  <div className="dn-body dn-reveal">
                    {parrafos(S.texto).map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
                {bloques(s).length > 0 && (
                  <ul className="dn-imtx__lista">
                    {bloques(s).map((b, i) => (
                      <li key={b.settings.titulo} className="dn-reveal" data-dn-delay={(i + 1) % 5}>
                        <Check />
                        <span>
                          <b>{b.settings.titulo}</b>
                          {b.settings.texto && ` ${b.settings.texto}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {S.boton_texto && (
                  <IrAComprar href={S.boton_enlace || "#comprar"} reveal>
                    {S.boton_texto}
                  </IrAComprar>
                )}
              </div>
            </div>
          </section>
        );

      case "dn-pasos":
        return (
          <section key={s.id} className="dn-section dn-mecanismo" style={px(s)}>
            <div className="dn-container">
              <div className="dn-pasos-cabeza" style={{ maxWidth: 760 }}>
                {S.kicker && <p className="dn-kicker dn-reveal">{S.kicker}</p>}
                <h2 className="dn-h2 dn-reveal" style={{ fontSize: S.heading_size }}>
                  {S.headline}
                </h2>
                {S.texto && <p className="dn-body dn-reveal">{S.texto}</p>}
              </div>
              <ol className="dn-pasos">
                {bloques(s).map((b, i) => (
                  <li key={b.settings.titulo} className="dn-paso dn-reveal" data-dn-delay={i + 1}>
                    {b.settings.imagen_asset && (
                      <div className="dn-paso__foto">
                        <img src={img(b.settings.imagen_asset)} alt={b.settings.alt ?? ""} loading="lazy" width={700} height={525} />
                        {b.settings.rotulo && <span className="dn-escena__rotulo">{b.settings.rotulo}</span>}
                      </div>
                    )}
                    <div className="dn-paso__cuerpo">
                      <span className="dn-paso__n">{i + 1}</span>
                      <div>
                        <h3>{b.settings.titulo}</h3>
                        <p>{b.settings.texto}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              {S.boton_texto && (
                <div className="dn-centro">
                  <IrAComprar>{S.boton_texto}</IrAComprar>
                </div>
              )}
            </div>
          </section>
        );

      case "dn-cifras":
        return (
          <section key={s.id} className="dn-section dn-cifras" style={px(s)}>
            <div className="dn-container">
              <Cabeza s={s} />
              <ul className="dn-cifras__lista">
                {bloques(s).map((b, i) => (
                  <li key={b.settings.texto} className="dn-cifra dn-reveal" data-dn-delay={(i + 1) % 5}>
                    <p className="dn-cifra__num">
                      <span data-dn-contar={b.settings.numero}>{b.settings.numero}</span>
                      <small>{b.settings.unidad}</small>
                    </p>
                    <p className="dn-cifra__texto">{b.settings.texto}</p>
                  </li>
                ))}
              </ul>
              {S.nota && <p className="dn-cifras__nota">{S.nota}</p>}
            </div>
          </section>
        );

      case "dn-comparativa":
        return (
          <section key={s.id} className="dn-section dn-comparativa" style={px(s)}>
            <div className="dn-container">
              <Cabeza s={{ ...s, settings: { ...S, texto: "" } }} />
              <div className="dn-vs dn-reveal">
                <div className="dn-vs__cabeza">
                  <span />
                  <div className="dn-vs__col dn-vs__col--nuestro">
                    {S.imagen_asset && <img src={img(S.imagen_asset)} alt="" width={200} height={200} loading="lazy" />}
                    <b>{S.col_a}</b>
                  </div>
                  <div className="dn-vs__col">
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="12" y="6" width="24" height="30" rx="5" />
                      <rect x="17" y="12" width="14" height="8" rx="2" />
                      <circle cx="24" cy="27" r="2.5" />
                      <path d="M8 40h32" />
                      <path d="M36 14h6M39 11v6" />
                    </svg>
                    <b>{S.col_b}</b>
                  </div>
                </div>
                {bloques(s).map((b) => (
                  <div key={b.settings.aspecto} className="dn-vs__fila">
                    <span className="dn-vs__aspecto">{b.settings.aspecto}</span>
                    <span className="dn-vs__celda dn-vs__celda--nuestro">
                      {b.settings.mejor === "a" && (
                        <i className="dn-vs__si" aria-label="Mejor">
                          ✓
                        </i>
                      )}
                      {b.settings.a}
                    </span>
                    <span className="dn-vs__celda">
                      {b.settings.mejor === "b" ? (
                        <i className="dn-vs__si" aria-label="Mejor">
                          ✓
                        </i>
                      ) : b.settings.mejor === "a" ? (
                        <i className="dn-vs__no" aria-hidden="true">
                          ✕
                        </i>
                      ) : null}
                      {b.settings.b}
                    </span>
                  </div>
                ))}
              </div>
              {S.nota && <p className="dn-comparativa__nota dn-reveal">{S.nota}</p>}
            </div>
          </section>
        );

      case "dn-listas":
        return (
          <section key={s.id} className="dn-section dn-listas" style={px(s)}>
            <div className="dn-container">
              <Cabeza s={s} />
              <div className="dn-listas__rejilla">
                {(["si", "no"] as const).map((lado, i) => (
                  <div key={lado} className={`dn-lista dn-lista--${lado} dn-reveal`} data-dn-delay={i || undefined}>
                    <h3>{lado === "si" ? S.titulo_si : S.titulo_no}</h3>
                    <ul>
                      {bloques(s)
                        .filter((b) => b.type === lado)
                        .map((b) => (
                          <li key={b.settings.texto}>{b.settings.texto}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "dn-garantia":
        return (
          <section key={s.id} className="dn-section dn-garantia" style={px(s)}>
            <div className="dn-container">
              <div className="dn-garantia__caja">
                <div className="dn-garantia__rejilla">
                  <div>
                    {S.kicker && <p className="dn-kicker dn-reveal">{S.kicker}</p>}
                    <h2 className="dn-h2 dn-reveal" style={{ fontSize: S.heading_size }}>
                      {S.headline}
                    </h2>
                    {S.texto && <p className="dn-body dn-reveal">{S.texto}</p>}
                    <ol className="dn-linea-tiempo">
                      {bloques(s)
                        .filter((b) => b.type === "paso")
                        .map((b, i) => (
                          <li key={b.settings.titulo} className="dn-reveal" data-dn-delay={i + 1}>
                            <span className="dn-linea-tiempo__n">{i + 1}</span>
                            <div>
                              <h3>{b.settings.titulo}</h3>
                              <p>{b.settings.texto}</p>
                            </div>
                          </li>
                        ))}
                    </ol>
                  </div>
                  {S.imagen_asset && (
                    <div className="dn-garantia__media dn-reveal">
                      <img src={img(S.imagen_asset)} alt={S.alt} loading="lazy" width={900} height={900} />
                    </div>
                  )}
                </div>
                <ul className="dn-sellos">
                  {bloques(s)
                    .filter((b) => b.type === "sello")
                    .map((b, i) => (
                      <li key={b.settings.titulo} className="dn-reveal" data-dn-delay={(i + 1) % 5}>
                        <Escudo />
                        <div>
                          <b>{b.settings.titulo}</b>
                          <span>{b.settings.texto}</span>
                        </div>
                      </li>
                    ))}
                </ul>
                {S.boton_texto && (
                  <div className="dn-centro">
                    <IrAComprar>{S.boton_texto}</IrAComprar>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case "dn-cta":
        return (
          <section key={s.id} className="dn-section dn-cta" style={px(s)}>
            <div className="dn-container">
              <div className="dn-cta__caja">
                {S.imagen_asset && <img className="dn-cta__img dn-reveal" src={img(S.imagen_asset)} alt={S.alt} loading="lazy" width={900} height={900} />}
                <div className="dn-cta__texto">
                  <h2 className="dn-h2 dn-reveal" style={{ fontSize: S.heading_size }}>
                    {S.headline}
                  </h2>
                  <p className="dn-cta__precio dn-reveal">
                    {formatCOP(precio)} <span>{S.precio_nota}</span>
                  </p>
                  <a className="dn-boton dn-boton--primario dn-reveal" href="#comprar">
                    {S.boton_texto}
                  </a>
                </div>
              </div>
            </div>
          </section>
        );

      case "dn-faq":
        // La plantilla usa el modo de respuestas abiertas: afirmaciones siempre visibles
        return (
          <section key={s.id} className="dn-section dn-faq" style={px(s)}>
            <div className="dn-container">
              <Cabeza s={s} />
              <ul className="dn-respuestas">
                {bloques(s).map((b, i) => (
                  <li key={b.settings.pregunta} className="dn-respuesta dn-reveal" data-dn-delay={(i + 1) % 4}>
                    <Check />
                    <div>
                      <h3>{b.settings.pregunta}</h3>
                      <div className="dn-respuesta__texto">
                        {parrafos(b.settings.respuesta).map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {S.boton_texto && (
                <div className="dn-centro">
                  <IrAComprar>{S.boton_texto}</IrAComprar>
                </div>
              )}
            </div>
          </section>
        );

      default:
        // Una sección que este sitio todavía no sabe pintar: mejor nada que algo roto
        return null;
    }
  };

  const portada = site.url + L.carpeta + (fotos[0]?.archivo ?? "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: L.nombre,
    description: L.resumen,
    image: [portada],
    url: site.url + L.path,
    offers: {
      "@type": "Offer",
      url: site.url + L.path,
      price: L.precio,
      priceCurrency: "COP",
      availability: L.disponible ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <Seo title={L.seo.title} description={L.seo.description} path={L.path} noindex={!L.disponible} image={L.carpeta + (fotos[0]?.archivo ?? "")} jsonLd={jsonLd} />
      <div ref={raiz} className="dn-landing" data-theme="dark">
        {secciones.map(seccion)}
      </div>
    </>
  );
}
