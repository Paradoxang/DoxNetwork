import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { landings } from "@/data/landings";
import { formatCOP } from "@/data/site";
import "@/styles/comedero-landing.css";
import "@/styles/estrellas.css";

/**
 * Productos estrella, justo después de la apertura: calco de la sección
 * dn-estrellas de la portada de Shopify (orden de Santiago vía Tor,
 * 26-sep-2026). Tarjetas grandes con gancho, precio y botón a su página de
 * venta. Como en Shopify, un producto en borrador (`disponible: false`) no se
 * pinta, y si no queda ninguno la sección no sale.
 */
const S = {
  kicker: "Productos estrella",
  headline: "Lo nuevo de la tienda",
  texto: "Dos productos que resuelven problemas de todos los días, con envío gratis; pagas como prefieras, también contra entrega.",
  insignia: "Estrella",
  boton: "Comprar",
  headingSize: 38,
};

export function ProductosEstrella() {
  const encendidos = landings.filter((l) => l.disponible);
  if (!encendidos.length) return null;

  return (
    <section className="dn-section dn-estrellas" style={{ paddingTop: 48, paddingBottom: 24 }} aria-labelledby="estrellas-titulo">
      <div className="dn-container">
        <div className="dn-estrellas__cabeza">
          <p className="dn-kicker">{S.kicker}</p>
          <h2 id="estrellas-titulo" className="dn-estrellas__titulo" style={{ fontSize: S.headingSize }}>
            {S.headline}
          </h2>
          <p className="dn-estrellas__texto">{S.texto}</p>
        </div>
        <div className="dn-estrellas__rejilla">
          {encendidos.map((l, i) => (
            <Link key={l.slug} className="dn-estrella" to={l.path} style={{ "--dn-acento": l.estrella.acento } as CSSProperties}>
              <div className="dn-estrella__media">
                <img src={l.estrella.foto} alt={l.nombre} width={900} height={675} loading={i === 0 ? "eager" : "lazy"} />
                <span className="dn-estrella__insignia">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
                  </svg>
                  {S.insignia}
                </span>
              </div>
              <div className="dn-estrella__cuerpo">
                <p className="dn-estrella__etiqueta">{l.estrella.etiqueta}</p>
                <h3 className="dn-estrella__nombre">{l.estrella.titulo}</h3>
                <p className="dn-estrella__gancho">{l.estrella.gancho}</p>
                <div className="dn-estrella__pie">
                  <p className="dn-estrella__precio">
                    <b>{formatCOP(l.precio)}</b>
                    <small>{l.estrella.nota}</small>
                  </p>
                  <span className="dn-boton dn-boton--primario">{S.boton}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
