import { useEffect, useState } from "react";

/**
 * Descuento por pago adelantado con reloj por visitante (orden de Santiago,
 * 28-sep-2026). Es el mismo de las páginas de venta de Shopify: sección
 * dn-oferta e initPrepago en assets/dn-landing.js del tema.
 *
 * - El reloj arranca en la primera visita y se guarda en este navegador: si
 *   vuelve, sigue bajando. Al llegar a cero, el bloque desaparece. A los 7
 *   días del inicio, la persona recibe una oferta nueva.
 * - El código es PAGOYA + DDMM del día (hora de Bogotá) de esa primera visita.
 *   Shopify lo acepta de las 00:00 de ese día a las 02:00 del siguiente. Los
 *   códigos los crea 2-COMUN/taller/shopify/pagoya/generar.mjs y existen del
 *   `desde` al `hasta`; fuera de ese rango no sale nada.
 * - Es descuento de pedido ($5.000): se suma al pack «el segundo con 30 %».
 *   Se pone a mano en el checkout y solo vale pagando por adelantado (tarjeta,
 *   PSE, Nequi o Bre-B). No aplica en contra entrega: si alguien lo usa con
 *   contra entrega, se le aclara al confirmar por WhatsApp.
 */
export const PREPAGO = {
  monto: "$5.000",
  horas: 2,
  prefijo: "PAGOYA",
  desde: "2026-09-28",
  hasta: "2026-11-30",
  titulo: "Paga por adelantado y te descontamos $5.000",
  nota: "Con tarjeta, PSE, Nequi o Bre-B: pon el código al pagar. No aplica en contra entrega.",
  mini: "−$5.000 pagando por adelantado:",
};

const CLAVE = "dn-prepago-inicio";
const RENUEVA = 7 * 864e5;

/** El código y los milisegundos que le quedan, o null si esta persona no tiene oferta vigente. */
export function usePrepago() {
  const [estado, setEstado] = useState<{ codigo: string; fin: number } | null>(null);
  const [ahora, setAhora] = useState(() => Date.now());

  /* Solo en el navegador: el build no sabe quién visita ni cuándo. */
  useEffect(() => {
    const t = Date.now();
    let inicio: number | null = null;
    try {
      inicio = parseInt(window.localStorage.getItem(CLAVE) ?? "", 10) || null;
    } catch {
      /* sin almacenamiento: cuenta desde esta carga */
    }
    if (!inicio || inicio > t || t - inicio > RENUEVA) {
      inicio = t;
      try {
        window.localStorage.setItem(CLAVE, String(inicio));
      } catch {
        /* nada */
      }
    }
    const fin = inicio + PREPAGO.horas * 36e5;
    let dia: string;
    try {
      dia = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(inicio));
    } catch {
      return;
    }
    if (dia < PREPAGO.desde || dia > PREPAGO.hasta || t >= fin) return;
    setEstado({ codigo: PREPAGO.prefijo + dia.slice(8, 10) + dia.slice(5, 7), fin });
  }, []);

  useEffect(() => {
    if (!estado) return;
    let id = 0;
    const tic = () => {
      const t = Date.now();
      setAhora(t);
      if (t >= estado.fin) return;
      id = window.setTimeout(tic, 1000 - (t % 1000) + 5);
    };
    tic();
    return () => window.clearTimeout(id);
  }, [estado]);

  if (!estado || ahora >= estado.fin) return null;
  const s = Math.floor((estado.fin - ahora) / 1000);
  const dos = (n: number) => String(n).padStart(2, "0");
  return { codigo: estado.codigo, reloj: `${Math.floor(s / 3600)}:${dos(Math.floor((s % 3600) / 60))}:${dos(s % 60)}` };
}

/** El bloque grande, justo encima de «Comprar». */
export function BloquePrepago({ p }: { p: { codigo: string; reloj: string } }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    const listo = () => {
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(p.codigo).then(listo, () => {});
  };
  return (
    <div className="dn-prepago">
      <p className="dn-prepago__titulo">{PREPAGO.titulo}</p>
      <div className="dn-prepago__fila">
        <button type="button" className="dn-prepago__codigo" onClick={copiar} aria-label="Copiar el código de descuento">
          <span>{p.codigo}</span>
          <small>{copiado ? "¡Copiado!" : "Copiar"}</small>
        </button>
        <p className="dn-prepago__reloj">
          Vence en <b>{p.reloj}</b>
        </p>
      </div>
      <p className="dn-prepago__nota">{PREPAGO.nota}</p>
    </div>
  );
}

/** La línea corta de la compra rápida. */
export function LineaPrepago({ p }: { p: { codigo: string; reloj: string } }) {
  return (
    <p className="dn-hoja__prepago">
      {PREPAGO.mini} <b>{p.codigo}</b> · vence en <b>{p.reloj}</b>
    </p>
  );
}
