import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MetaPixel, pixel } from "@/components/MetaPixel";
import { ResenasProducto } from "@/components/ResenasProducto";
import { Seo } from "@/components/Seo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  colores,
  comedero,
  disponible,
  enlaceCheckout,
  imagenes,
  landing,
  mensajeAviso,
  productoComedero,
  type Color,
} from "@/data/comedero";
import { porProducto } from "@/data/resenas";
import { formatCOP, site, waLink } from "@/data/site";
import { useCart } from "@/lib/cart";
import { fechaEntrega } from "@/lib/entrega";
import "@/styles/comedero-landing.css";

/**
 * Landing del comedero por gravedad: calco de su página de venta en Shopify
 * (plantilla `product.comedero` del tema DoxNetwork), por orden de Santiago
 * del 25-sep-2026. Mismo orden, textos, fotos, vídeos y comportamiento; el
 * CSS es el del tema (styles/comedero-landing.css) y el JS de
 * assets/dn-landing.js vive aquí como estado de React.
 *
 * Lo que es de este sitio y no del tema: «Comprar» va al checkout de Shopify
 * por enlace de carrito (con UTM, fbclid y gclid), el píxel de Meta con sus
 * eventos, las reseñas con su componente, y «o añádelo a la cesta» para la
 * cesta de la tienda. Los anuncios apuntan aquí: no se redirige nada.
 */

const O = landing.oferta;
const evento = () => ({ content_name: comedero.nombre, value: comedero.precio, currency: "COP" });
const px = (top: number, bottom: number): CSSProperties => ({ paddingTop: top, paddingBottom: bottom });

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

/** Cabecera de sección del tema: kicker + titular (+ texto). */
function Cabeza({ kicker, titulo, texto, centro = false, size }: { kicker?: string; titulo: string; texto?: string; centro?: boolean; size: number }) {
  return (
    <div className={`dn-cabeza dn-reveal${centro ? " dn-cabeza--centro" : ""}`}>
      {kicker && <p className="dn-kicker">{kicker}</p>}
      <h2 className="dn-h2" style={{ fontSize: size }}>
        {titulo}
      </h2>
      {texto && <p className="dn-body">{texto}</p>}
    </div>
  );
}

const IrAComprar = ({ children }: { children: ReactNode }) => (
  <a className="dn-boton dn-boton--primario" href="#comprar">
    {children}
  </a>
);

export function Comedero() {
  const cart = useCart();
  const raiz = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLAnchorElement>(null);
  const hoja = useRef<HTMLDialogElement>(null);

  const [color, setColor] = useState<Color>("Gris");
  const [cantidad, setCantidad] = useState(1);
  const [foto, setFoto] = useState(0);
  const [barra, setBarra] = useState(false);
  const [entrega, setEntrega] = useState<[string, string] | null>(null);
  const [gramos, setGramos] = useState(landing.calculadora.presets[0].gramos);
  const [conSonido, setConSonido] = useState<number | null>(null);

  /* Los UTM con los que llegó la visita viajan hasta el checkout: sin ellos la
     venta no se puede atribuir a la campaña que la trajo. En SSR no hay
     `window`, así que se leen después de montar. */
  const [search, setSearch] = useState("");
  useEffect(() => setSearch(window.location.search), []);

  useEffect(() => {
    pixel("ViewContent", evento());
  }, []);

  const variante = colores.find((c) => c.nombre === color)!.variante;
  const total = comedero.precio * cantidad;
  const checkout = enlaceCheckout(variante, search, cantidad);
  const resenas = porProducto[productoComedero.slug] ?? [];
  const promedio = resenas.length ? resenas.reduce((n, r) => n + r.estrellas, 0) / resenas.length : 0;

  /* Galería: puntos que siguen al deslizamiento; ir(i) salta a una foto. */
  const ir = (i: number) => {
    const p = pista.current;
    const f = p?.children[i] as HTMLElement | undefined;
    if (p && f) p.scrollTo({ left: f.offsetLeft - p.offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const alDeslizar = () => {
    const p = pista.current;
    if (p) setFoto(Math.round(p.scrollLeft / Math.max(1, p.clientWidth)));
  };
  /* Al elegir un color, la galería salta a su foto. */
  const elegirColor = (c: Color) => {
    setColor(c);
    const i = O.fotos.findIndex((f) => f.color === c);
    if (i > -1) ir(i);
  };

  /* Entrega estimada: solo en el navegador (la fecha de hoy no es la del build). */
  useEffect(() => {
    try {
      setEntrega([fechaEntrega(O.entrega.min, O.entrega.festivos), fechaEntrega(O.entrega.max, O.entrega.festivos)]);
    } catch {
      /* queda el texto de respaldo */
    }
  }, []);

  /* Barra fija: aparece cuando el botón principal ya quedó arriba, fuera de pantalla. */
  useEffect(() => {
    const b = boton.current;
    if (!b || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setBarra(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(b);
    return () => io.disconnect();
  }, []);

  /* Apariciones, cifras que cuentan y bucles mudos, como initReveals, initContadores e initBucles. */
  useEffect(() => {
    const el = raiz.current;
    if (!el || !("IntersectionObserver" in window)) {
      el?.querySelectorAll(".dn-reveal").forEach((n) => n.classList.add("dn-visible"));
      return;
    }
    const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observadores: IntersectionObserver[] = [];

    const reveals = el.querySelectorAll(".dn-reveal:not(.dn-visible)");
    if (reducir) reveals.forEach((n) => n.classList.add("dn-visible"));
    else {
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
      observadores.push(io);
    }

    if (!reducir) {
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
      observadores.push(cuenta);

      const bucles = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            const v = e.target as HTMLVideoElement;
            if (!v.hasAttribute("data-dn-bucle")) {
              if (!e.isIntersecting) v.pause();
              return;
            }
            if (e.isIntersecting) {
              v.preload = "auto";
              v.muted = true;
              v.play().catch(() => {});
            } else v.pause();
          }),
        { threshold: 0.35 }
      );
      el.querySelectorAll("video").forEach((v) => bucles.observe(v));
      observadores.push(bucles);
    }
    return () => observadores.forEach((o) => o.disconnect());
  }, []);

  /* Vídeos con voz: al tocar uno arranca desde el principio con sonido y los demás se callan. */
  const oirVideo = (i: number, v: HTMLVideoElement | null) => {
    if (!v || conSonido === i) return;
    raiz.current?.querySelectorAll<HTMLVideoElement>("[data-dn-video] video").forEach((o) => {
      if (o !== v) o.muted = true;
    });
    v.muted = false;
    v.currentTime = 0;
    setConSonido(i);
    v.play().catch(() => {});
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

  const alCheckout = () => pixel("InitiateCheckout", evento());
  const alaCesta = () => {
    cart.add(productoComedero.slug, color.toLowerCase(), cantidad);
    pixel("AddToCart", evento());
    cart.setOpen(true);
  };

  /* Funciones y no componentes: un componente declarado dentro del render se
     vuelve a montar en cada cambio de estado, y el observador de la barra se
     quedaría mirando un botón que ya no está en la página. */

  /** El botón de compra: al checkout de Shopify con color y cantidad; apagado, pide aviso. */
  const comprar = (principal = false) =>
    disponible ? (
      <a ref={principal ? boton : undefined} className="dn-boton dn-boton--primario dn-oferta__boton" href={checkout} onClick={alCheckout}>
        <span>{O.boton}</span>
        <Flecha />
      </a>
    ) : (
      <a ref={principal ? boton : undefined} className="dn-boton dn-boton--primario dn-oferta__boton" href={waLink(mensajeAviso(color))}>
        <WhatsAppIcon className="h-5 w-5" /> <span>Avísame cuando esté</span>
      </a>
    );

  const selectorColor = (nombre: string) => (
    <div className="dn-colores">
      {colores.map((c) => (
        <label key={c.nombre} className="dn-color">
          <input type="radio" name={nombre} value={c.nombre} checked={c.nombre === color} onChange={() => elegirColor(c.nombre)} />
          <span style={{ "--dn-c": c.muestra } as CSSProperties}>
            <i />
            {c.nombre}
          </span>
        </label>
      ))}
    </div>
  );

  const pagos = () => (
    <ul className="dn-pagos" aria-label="Formas de pago">
      {O.pagos.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );

  const C = landing.calculadora;
  const diasA = Math.floor(C.gramosMin / Math.max(1, gramos));
  const diasB = Math.floor(C.gramosMax / Math.max(1, gramos));

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

  return (
    <>
      <Seo
        title={`Comedero por gravedad 3,2 L para perros y gatos · ${formatCOP(comedero.precio)} contra entrega`}
        description="El alimento baja solo a medida que tu mascota come. Sin pilas ni enchufe. 3,2 litros, tres colores. Envío gratis a toda Colombia, pagas al recibir."
        path="/comedero"
        noindex={!disponible}
        image={imagenes.og}
        jsonLd={jsonLd}
      />
      <MetaPixel />

      <div ref={raiz} className="dn-landing" data-theme="dark">
        {/* ── 1 · Oferta ── */}
        <section className="dn-section dn-oferta" id="comprar" style={{ ...px(124, 40), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container dn-oferta__rejilla">
            <div className="dn-oferta__galeria">
              <div className="dn-oferta__pista" ref={pista} onScroll={alDeslizar}>
                {O.fotos.map((f, i) => (
                  <figure key={f.src} className="dn-oferta__foto">
                    <img
                      src={f.src}
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
              <div className="dn-oferta__puntos">
                {O.fotos.map((f, i) => (
                  <button key={f.src} type="button" aria-label={`Foto ${i + 1}`} className={i === foto ? "activo" : ""} onClick={() => ir(i)} />
                ))}
              </div>
            </div>

            <div className="dn-oferta__compra">
              <p className="dn-kicker">{O.kicker}</p>
              {resenas.length > 0 && (
                <a className="dn-oferta__estrellas" href="#resenas">
                  <span style={{ "--dn-pct": `${(promedio / 5) * 100}%` } as CSSProperties} />
                  <small>
                    {promedio.toFixed(1).replace(".", ",")} · {resenas.length} reseñas de clientes del proveedor
                  </small>
                </a>
              )}
              <h1 className="dn-oferta__titulo" style={{ fontSize: 44 }}>
                {comedero.titular}
              </h1>
              <p className="dn-oferta__producto">{comedero.nombre}</p>
              <p className="dn-oferta__sub">{O.subtitulo}</p>

              <ul className="dn-oferta__checks">
                {O.checks.map((c) => (
                  <li key={c}>
                    <Check />
                    {c}
                  </li>
                ))}
              </ul>

              <div className="dn-oferta__precio">
                <strong>{formatCOP(total)}</strong>
                <span>{O.precioNota}</span>
              </div>

              <div className="dn-oferta__bloque">
                <p className="dn-oferta__etiqueta">
                  Color: <b>{color}</b>
                </p>
                {selectorColor("dn-op-color")}
              </div>

              <div className="dn-oferta__bloque">
                <p className="dn-oferta__etiqueta">{O.packsTitulo}</p>
                <div className="dn-packs">
                  {O.packs.map((p) => (
                    <label key={p.cantidad} className="dn-pack">
                      <input type="radio" name="dn-pack" value={p.cantidad} checked={cantidad === p.cantidad} onChange={() => setCantidad(p.cantidad)} />
                      <span className="dn-pack__caja">
                        <span className="dn-pack__texto">
                          <b>{p.titulo}</b>
                          <small>{p.detalle}</small>
                        </span>
                        <span className="dn-pack__precio">{formatCOP(comedero.precio * p.cantidad)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="dn-oferta__form">
                {comprar(true)}
              </div>
              {disponible && (
                <p className="mt-2 text-center">
                  <button type="button" onClick={alaCesta} className="text-[12px] font-semibold text-mute underline underline-offset-4 hover:text-ink">
                    o añádelo a la cesta
                  </button>
                </p>
              )}

              {pagos()}

              <div className="dn-entrega">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
                <p>
                  <span>
                    {entrega ? (
                      <>
                        Pide hoy y te llega entre el <b>{entrega[0]}</b> y el <b>{entrega[1]}</b>
                      </>
                    ) : (
                      O.entrega.respaldo
                    )}
                  </span>
                  <small>{O.entrega.nota}</small>
                </p>
              </div>

              <ul className="dn-oferta__confianza">
                {O.confianza.map((c) => (
                  <li key={c}>
                    <Escudo />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Barra fija al bajar (celular y escritorio): abre la hoja de compra rápida */}
          <div className={`dn-barra${barra ? " visible" : ""}`} aria-hidden={!barra}>
            <div className="dn-barra__info">
              <b>{comedero.nombre}</b>
              <span>
                <span data-dn-total-barra>{formatCOP(total)}</span> · {O.barra.nota}
              </span>
            </div>
            <button type="button" className="dn-boton dn-boton--primario" tabIndex={barra ? 0 : -1} onClick={abrirHoja}>
              {O.barra.texto}
            </button>
          </div>

          <dialog ref={hoja} className="dn-hoja" aria-label="Compra rápida" onClick={(e) => e.target === hoja.current && cerrarHoja()}>
            <div className="dn-hoja__caja">
              <button type="button" className="dn-hoja__cerrar" onClick={cerrarHoja} aria-label="Cerrar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              <div className="dn-hoja__cabeza">
                <img src={O.fotos[0].src} alt="" width={96} height={96} loading="lazy" />
                <div>
                  <p className="dn-hoja__titulo">{O.hojaTitulo}</p>
                  <p className="dn-hoja__total">{formatCOP(total)}</p>
                  <p className="dn-hoja__nota">{O.precioNota}</p>
                </div>
              </div>
              <p className="dn-oferta__etiqueta">Color</p>
              {selectorColor("dn-hoja-color")}
              <p className="dn-oferta__etiqueta">{O.packsTitulo}</p>
              <div className="dn-packs dn-packs--compacto">
                {O.packs.map((p) => (
                  <label key={p.cantidad} className="dn-pack">
                    <input type="radio" name="dn-hoja-pack" value={p.cantidad} checked={cantidad === p.cantidad} onChange={() => setCantidad(p.cantidad)} />
                    <span className="dn-pack__caja">
                      <span className="dn-pack__texto">
                        <b>{p.titulo}</b>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {comprar()}
              {pagos()}
            </div>
          </dialog>
        </section>

        {/* ── 2 · El plato vacío no avisa ── */}
        <section className="dn-section dn-dolor" style={{ ...px(48, 48), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container">
            <Cabeza kicker={landing.dolor.kicker} titulo={landing.dolor.titulo} size={36} />
            <div className="dn-dolor__rejilla">
              {landing.dolor.escenas.map((e, i) => (
                <article key={e.titulo} className="dn-escena dn-reveal" data-dn-delay={i + 1}>
                  <div className="dn-escena__media">
                    <video src={e.video} poster={e.poster} muted loop playsInline preload="none" data-dn-bucle="" aria-hidden="true" />
                    <span className="dn-escena__rotulo">Imagen ilustrativa</span>
                  </div>
                  <h3>{e.titulo}</h3>
                  <p>{e.texto}</p>
                </article>
              ))}
            </div>
            <p className="dn-dolor__cierre dn-reveal">{landing.dolor.cierre}</p>
            <div className="dn-centro">
              <IrAComprar>{landing.dolor.boton}</IrAComprar>
            </div>
          </div>
        </section>

        {/* ── 3 · Cómo funciona ── */}
        <section className="dn-section dn-mecanismo" style={{ ...px(48, 48), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container dn-mecanismo__rejilla">
            <div className="dn-mecanismo__dibujo dn-reveal" aria-hidden="true">
              {/* Esquema animado: el tanque se vacía y la croqueta cae al plato. Dibujo del principio, no del modelo exacto. */}
              <svg viewBox="0 0 320 360" className="dn-gravedad">
                <defs>
                  <clipPath id="dn-tanque">
                    <rect x="90" y="40" width="140" height="200" rx="26" />
                  </clipPath>
                </defs>
                <rect x="84" y="22" width="152" height="26" rx="13" className="dn-g-tapa" />
                <rect x="90" y="40" width="140" height="200" rx="26" className="dn-g-tanque" />
                <g clipPath="url(#dn-tanque)">
                  <g className="dn-g-nivel">
                    <rect x="90" y="110" width="140" height="140" className="dn-g-croqueta-masa" />
                    {Array.from({ length: 21 }, (_, i) => (
                      <circle key={i} cx={(i % 7) * 20 + 100} cy={Math.floor(i / 7) * 16 + 116} r="6" className="dn-g-grano" />
                    ))}
                  </g>
                </g>
                <path d="M140 240 h40 l-6 34 h-28z" className="dn-g-boca" />
                <circle cx="152" cy="262" r="5" className="dn-g-cae dn-g-cae--1" />
                <circle cx="168" cy="262" r="5" className="dn-g-cae dn-g-cae--2" />
                <circle cx="160" cy="262" r="5" className="dn-g-cae dn-g-cae--3" />
                <path d="M60 290 h200 q-10 44 -100 44 q-90 0 -100 -44z" className="dn-g-plato" />
                <ellipse cx="160" cy="292" rx="96" ry="10" className="dn-g-borde" />
                <g className="dn-g-flecha">
                  <path d="M270 80 v130" />
                  <path d="m262 198 8 14 8-14" />
                </g>
                <text x="282" y="150" className="dn-g-texto" transform="rotate(90 282 150)">
                  GRAVEDAD
                </text>
              </svg>
              <p className="dn-mecanismo__nota">{landing.mecanismo.nota}</p>
            </div>
            <div className="dn-mecanismo__cabeza">
              <p className="dn-kicker dn-reveal">{landing.mecanismo.kicker}</p>
              <h2 className="dn-h2 dn-reveal" style={{ fontSize: 36 }}>
                {landing.mecanismo.titulo}
              </h2>
              <p className="dn-body dn-reveal">{landing.mecanismo.texto}</p>
            </div>
          </div>
          <div className="dn-container">
            <ol className="dn-pasos">
              {landing.mecanismo.pasos.map((p, i) => (
                <li key={p.titulo} className="dn-paso dn-reveal" data-dn-delay={i + 1}>
                  <div className="dn-paso__foto">
                    <img src={p.img} alt={p.alt} loading="lazy" width={700} height={525} />
                    <span className="dn-escena__rotulo">Imagen ilustrativa</span>
                  </div>
                  <div className="dn-paso__cuerpo">
                    <span className="dn-paso__n">{i + 1}</span>
                    <div>
                      <h3>{p.titulo}</h3>
                      <p>{p.texto}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 4 · Calculadora ── */}
        <section className="dn-section dn-calc" style={{ ...px(40, 40), "--dn-acento": "#f2c46d" } as CSSProperties}>
          <div className="dn-container">
            <div className="dn-calc__caja">
              <div className="dn-calc__texto">
                <p className="dn-kicker">{C.kicker}</p>
                <h2 className="dn-h2" style={{ fontSize: 34 }}>
                  {C.titulo}
                </h2>
                <div className="dn-calc__presets" role="group" aria-label="Tipo de mascota">
                  {C.presets.map((p) => (
                    <button key={p.nombre} type="button" className={`dn-calc__preset${gramos === p.gramos ? " activo" : ""}`} onClick={() => setGramos(p.gramos)}>
                      {p.nombre}
                      <small>{p.gramos} g/día</small>
                    </button>
                  ))}
                </div>
                <label className="dn-calc__rango">
                  <span>
                    {C.rangoTexto}: <b>{gramos} g</b>
                  </span>
                  <input type="range" min={C.minG} max={C.maxG} step={10} value={gramos} onChange={(e) => setGramos(Number(e.target.value))} />
                </label>
              </div>
              <div className="dn-calc__resultado" aria-live="polite">
                <p className="dn-calc__pre">{C.resultadoPre}</p>
                <p className="dn-calc__dias">
                  <span>{diasA === diasB ? diasA : `${diasA}–${diasB}`}</span>
                  <small>{C.unidad}</small>
                </p>
                <div className="dn-calc__barra">
                  <span style={{ width: `${Math.min(100, (diasB / 30) * 100)}%` }} />
                </div>
                <p className="dn-calc__supuesto">{C.supuesto}</p>
                <IrAComprar>{C.boton}</IrAComprar>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5 · Vídeos ── */}
        <section className="dn-section dn-videos" style={{ ...px(48, 48), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container">
            <Cabeza kicker={landing.videos.kicker} titulo={landing.videos.titulo} size={34} />
            <div className="dn-videos__pista">
              {landing.videos.lista.map((v, i) => (
                <figure key={v.video} className="dn-video">
                  <div
                    className={`dn-video__marco${conSonido === i ? " con-sonido" : ""}`}
                    data-dn-video=""
                    onClick={(e) => oirVideo(i, e.currentTarget.querySelector("video"))}
                  >
                    <video
                      src={v.video}
                      poster={v.poster}
                      muted
                      loop={conSonido !== i}
                      controls={conSonido === i}
                      playsInline
                      preload="none"
                      controlsList="nodownload"
                      {...(conSonido === i ? {} : { "data-dn-bucle": "" })}
                    />
                    <button type="button" className="dn-video__sonido" aria-label={`Ver con sonido: ${v.titulo}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M11 5 6 9H3v6h3l5 4z" />
                        <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
                      </svg>
                      <span>{landing.videos.sonido}</span>
                    </button>
                  </div>
                  <figcaption>
                    <b>{v.titulo}</b>
                    <span>{v.duracion}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="dn-videos__nota">{landing.videos.nota}</p>
          </div>
        </section>

        {/* ── 6 · Cifras ── */}
        <section className="dn-section dn-cifras" style={{ ...px(32, 40), "--dn-acento": "#f2c46d" } as CSSProperties}>
          <div className="dn-container">
            <Cabeza kicker={landing.cifras.kicker} titulo={landing.cifras.titulo} centro size={32} />
            <ul className="dn-cifras__lista">
              {landing.cifras.lista.map((c, i) => (
                <li key={c.texto} className="dn-cifra dn-reveal" data-dn-delay={(i + 1) % 5}>
                  <p className="dn-cifra__num">
                    <span data-dn-contar={c.numero}>{c.numero}</span>
                    <small>{c.unidad}</small>
                  </p>
                  <p className="dn-cifra__texto">{c.texto}</p>
                </li>
              ))}
            </ul>
            <p className="dn-cifras__nota">{landing.cifras.nota}</p>
          </div>
        </section>

        {/* ── 7 · Cinco razones ── */}
        <section className="dn-section dn-imtx" style={{ ...px(48, 48), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container dn-imtx__rejilla">
            <div className="dn-imtx__media dn-reveal">
              <img src={landing.razones.img} alt={landing.razones.alt} loading="lazy" width={1100} height={1100} />
              <span className="dn-escena__rotulo">{landing.razones.rotulo}</span>
            </div>
            <div className="dn-imtx__texto">
              <p className="dn-kicker dn-reveal">{landing.razones.kicker}</p>
              <h2 className="dn-h2 dn-reveal" style={{ fontSize: 34 }}>
                {landing.razones.titulo}
              </h2>
              <ul className="dn-imtx__lista">
                {landing.razones.puntos.map((p, i) => (
                  <li key={p.titulo} className="dn-reveal" data-dn-delay={(i + 1) % 5}>
                    <Check />
                    <span>
                      <b>{p.titulo}</b> {p.texto}
                    </span>
                  </li>
                ))}
              </ul>
              <IrAComprar>{landing.razones.boton}</IrAComprar>
            </div>
          </div>
        </section>

        {/* ── 8 · También para gatos ── */}
        <section className="dn-section dn-imtx dn-imtx--derecha" style={{ ...px(32, 48), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container dn-imtx__rejilla">
            <div className="dn-imtx__media dn-reveal">
              <video src={landing.gatos.video} poster={landing.gatos.poster} muted loop playsInline preload="none" data-dn-bucle="" aria-hidden="true" />
              <span className="dn-escena__rotulo">{landing.gatos.rotulo}</span>
            </div>
            <div className="dn-imtx__texto">
              <p className="dn-kicker dn-reveal">{landing.gatos.kicker}</p>
              <h2 className="dn-h2 dn-reveal" style={{ fontSize: 32 }}>
                {landing.gatos.titulo}
              </h2>
              <div className="dn-body dn-reveal">
                <p>{landing.gatos.texto}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9 · Comparativa ── */}
        <section className="dn-section dn-comparativa" style={{ ...px(56, 56), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container">
            <Cabeza kicker={landing.comparativa.kicker} titulo={landing.comparativa.titulo} centro size={38} />
            <div className="dn-vs dn-reveal">
              <div className="dn-vs__cabeza">
                <span />
                <div className="dn-vs__col dn-vs__col--nuestro">
                  <img src={landing.comparativa.img} alt="" width={200} height={200} loading="lazy" />
                  <b>{landing.comparativa.colA}</b>
                </div>
                <div className="dn-vs__col">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="12" y="6" width="24" height="30" rx="5" />
                    <rect x="17" y="12" width="14" height="8" rx="2" />
                    <circle cx="24" cy="27" r="2.5" />
                    <path d="M8 40h32" />
                    <path d="M36 14h6M39 11v6" />
                  </svg>
                  <b>{landing.comparativa.colB}</b>
                </div>
              </div>
              {landing.comparativa.filas.map((f) => (
                <div key={f.aspecto} className="dn-vs__fila">
                  <span className="dn-vs__aspecto">{f.aspecto}</span>
                  <span className="dn-vs__celda dn-vs__celda--nuestro">
                    {f.mejor === "a" && (
                      <i className="dn-vs__si" aria-label="Mejor">
                        ✓
                      </i>
                    )}
                    {f.a}
                  </span>
                  <span className="dn-vs__celda">
                    {f.mejor === "b" ? (
                      <i className="dn-vs__si" aria-label="Mejor">
                        ✓
                      </i>
                    ) : f.mejor === "a" ? (
                      <i className="dn-vs__no" aria-hidden="true">
                        ✕
                      </i>
                    ) : null}
                    {f.b}
                  </span>
                </div>
              ))}
            </div>
            <p className="dn-comparativa__nota dn-reveal">{landing.comparativa.nota}</p>
          </div>
        </section>

        {/* ── 10 · Para quién es, y para quién no ── */}
        <section className="dn-section dn-listas" style={{ ...px(48, 48), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container">
            <Cabeza kicker={landing.paraQuien.kicker} titulo={landing.paraQuien.titulo} texto={landing.paraQuien.texto} centro size={32} />
            <div className="dn-listas__rejilla">
              <div className="dn-lista dn-lista--si dn-reveal">
                <h3>{landing.paraQuien.tituloSi}</h3>
                <ul>
                  {landing.paraQuien.si.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="dn-lista dn-lista--no dn-reveal" data-dn-delay="1">
                <h3>{landing.paraQuien.tituloNo}</h3>
                <ul>
                  {landing.paraQuien.no.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 11 · Compra sin riesgo ── */}
        <section className="dn-section dn-garantia" style={{ ...px(48, 48), "--dn-acento": "#74d8b0" } as CSSProperties}>
          <div className="dn-container">
            <div className="dn-garantia__caja">
              <div className="dn-garantia__rejilla">
                <div>
                  <p className="dn-kicker dn-reveal">{landing.garantia.kicker}</p>
                  <h2 className="dn-h2 dn-reveal" style={{ fontSize: 34 }}>
                    {landing.garantia.titulo}
                  </h2>
                  <p className="dn-body dn-reveal">{landing.garantia.texto}</p>
                  <ol className="dn-linea-tiempo">
                    {landing.garantia.pasos.map((p, i) => (
                      <li key={p.titulo} className="dn-reveal" data-dn-delay={i + 1}>
                        <span className="dn-linea-tiempo__n">{i + 1}</span>
                        <div>
                          <h3>{p.titulo}</h3>
                          <p>{p.texto}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="dn-garantia__media dn-reveal">
                  <img src={landing.garantia.img} alt={landing.garantia.alt} loading="lazy" width={900} height={900} />
                </div>
              </div>
              <ul className="dn-sellos">
                {landing.garantia.sellos.map((s, i) => (
                  <li key={s.titulo} className="dn-reveal" data-dn-delay={(i + 1) % 5}>
                    <Escudo />
                    <div>
                      <b>{s.titulo}</b>
                      <span>{s.texto}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="dn-centro">
                <IrAComprar>{landing.garantia.boton}</IrAComprar>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12 · Reseñas: las del proveedor, con su nota, como ya estaban ── */}
        <ResenasProducto slug={productoComedero.slug} linea="mascotas" id="resenas" />

        {/* ── 13 · Cierre ── */}
        <section className="dn-section dn-cta" style={{ ...px(40, 40), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container">
            <div className="dn-cta__caja">
              <img className="dn-cta__img dn-reveal" src={landing.cierre.img} alt={landing.cierre.alt} loading="lazy" width={900} height={900} />
              <div className="dn-cta__texto">
                <h2 className="dn-h2 dn-reveal" style={{ fontSize: 38 }}>
                  {landing.cierre.titulo}
                </h2>
                <p className="dn-cta__precio dn-reveal">
                  {formatCOP(comedero.precio)} <span>{landing.cierre.precioNota}</span>
                </p>
                <a className="dn-boton dn-boton--primario dn-reveal" href="#comprar">
                  {landing.cierre.boton}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 14 · Lo que tienes que saber: respuestas abiertas, de último (lo pidió Santiago) ── */}
        <section className="dn-section dn-faq" style={{ ...px(48, 48), "--dn-acento": "#9aa9ff" } as CSSProperties}>
          <div className="dn-container">
            <Cabeza kicker={landing.saber.kicker} titulo={landing.saber.titulo} centro size={34} />
            <ul className="dn-respuestas">
              {landing.saber.respuestas.map((r, i) => (
                <li key={r.titulo} className="dn-respuesta dn-reveal" data-dn-delay={(i + 1) % 4}>
                  <Check />
                  <div>
                    <h3>{r.titulo}</h3>
                    <div className="dn-respuesta__texto">
                      <p>{r.texto}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="dn-centro">
              <IrAComprar>{landing.saber.boton}</IrAComprar>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
