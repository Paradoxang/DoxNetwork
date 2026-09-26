/**
 * Logos de las formas de pago, debajo de «Comprar» (orden de Santiago,
 * 26-sep-2026, al activar Bold). Son los SVG oficiales que usa el checkout de
 * Shopify (2-COMUN/marca/iconos-pago/, copiados a /public/pagos): van tal
 * cual, sin recolorear. Como <img> y no inline, para que sus id internos no
 * choquen cuando la fila sale dos veces en la misma página (arriba y en la
 * hoja de compra).
 *
 * Mismo marcado y clases que el snippet dn-medios-pago.liquid de Shopify; los
 * estilos están en index.css y en el calco de /comedero.
 */
const LOGOS: [archivo: string, nombre: string][] = [
  ["visa", "Visa"],
  ["master", "Mastercard"],
  ["american_express", "American Express"],
  ["diners_club", "Diners Club"],
  ["pse", "PSE"],
  ["nequi", "Nequi"],
  ["bancolombia", "Bancolombia"],
  ["breb", "Bre-B"],
];

export function MediosPago({
  contraEntrega = false,
  compacto = false,
  className = "",
}: {
  /** Solo lo que se puede pagar al recibir (hoy, el comedero). */
  contraEntrega?: boolean;
  /** Logos de 34 × 22 para la hoja de compra rápida. */
  compacto?: boolean;
  className?: string;
}) {
  return (
    <div className={`dn-medios ${compacto ? "dn-medios--compacto" : ""} ${className}`}>
      <ul className="dn-medios__lista" aria-label="Formas de pago">
        {LOGOS.map(([archivo, nombre]) => (
          <li key={archivo} className="dn-medios__logo">
            <img className="dn-medios__icono" src={`/pagos/${archivo}.svg`} alt={nombre} width={38} height={24} decoding="async" draggable={false} />
          </li>
        ))}
        {contraEntrega && (
          <li className="dn-medios__sello dn-medios__sello--cod">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 7h11v9H3z" />
              <path d="M14 10h4l3 3v3h-7" />
              <circle cx="7" cy="18" r="1.6" />
              <circle cx="17" cy="18" r="1.6" />
            </svg>
            Contra entrega
          </li>
        )}
      </ul>
    </div>
  );
}
