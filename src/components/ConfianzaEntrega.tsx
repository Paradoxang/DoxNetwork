/**
 * Bajo «Comprar», como la sección dn-oferta del tema de Shopify desde el
 * 28-sep-2026: la rejilla 2×2 de confianza y la entrega en 3 pasos.
 *
 * - Cada dato de confianza va «Título | detalle» y el icono lo da la
 *   posición: 1 envío, 2 pago, 3 garantía, 4 retracto.
 * - En la entrega, el paso 2 no lleva fecha, porque no controlamos el día de
 *   despacho. El 3 lleva el rango en días hábiles (lib/entrega.ts).
 */
const iconos = [
  <>
    <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </>,
  <>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 12h.01M18 12h.01" />
  </>,
  <>
    <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </>,
  <>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </>,
];

export function RejillaConfianza({ datos, nota }: { datos: (string | undefined)[]; nota?: string }) {
  return (
    <>
      <ul className="dn-confianza">
        {datos.map((d, i) => {
          if (!d) return null;
          const [titulo, detalle] = d.split("|").map((x) => x.trim());
          return (
            <li key={i}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {iconos[i]}
              </svg>
              <span>
                <b>{titulo}</b>
                {detalle && <small>{detalle}</small>}
              </span>
            </li>
          );
        })}
      </ul>
      {nota && <p className="dn-confianza__nota">{nota}</p>}
    </>
  );
}

export function PasosEntrega({
  rango,
  respaldo,
  nota,
  paso1 = "Haces tu pedido",
  paso2Titulo = "Confirmamos",
  paso2 = "Por WhatsApp, y despachamos",
  paso3 = "Te llega a la puerta",
}: {
  rango: string | null;
  respaldo: string;
  nota: string;
  paso1?: string;
  paso2Titulo?: string;
  paso2?: string;
  paso3?: string;
}) {
  const icono = (d: JSX.Element) => (
    <i>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d}
      </svg>
    </i>
  );
  return (
    <div className="dn-entrega">
      <ol className="dn-entrega__pasos">
        <li>
          {icono(
            <>
              <path d="M6 7h12l-1 13H7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </>
          )}
          <b>Hoy</b>
          <span>{paso1}</span>
        </li>
        <li>
          {icono(
            <>
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
              <path d="m9 12 2 2 4-4" />
            </>
          )}
          <b>{paso2Titulo}</b>
          <span>{paso2}</span>
        </li>
        <li>
          {icono(
            <>
              <path d="M3 11 12 4l9 7" />
              <path d="M5 10v10h14V10" />
              <path d="M10 20v-5h4v5" />
            </>
          )}
          <b>{rango ?? respaldo}</b>
          <span>{paso3}</span>
        </li>
      </ol>
      <small className="dn-entrega__nota">{nota}</small>
    </div>
  );
}
