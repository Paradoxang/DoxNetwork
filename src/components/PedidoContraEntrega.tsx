import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { pixel } from "@/components/MetaPixel";
import { DEPARTAMENTOS, celularValido, leerCookie, limpiarCelular, nombreValido } from "@/data/pedido-cod";
import { formatCOP, waLink } from "@/data/site";

/**
 * Formulario contra entrega (29-sep-2026): el cliente pide sin salir de la
 * página y sin el checkout de Shopify. Pide solo lo que necesita Dropi para
 * despachar; el servidor (worker/pedido.ts) crea el pedido en Shopify y
 * Dropify lo pasa a Dropi. El porqué, en data/pedido-cod.ts.
 *
 * Se enciende con VITE_FORMULARIO_COD=1 (.env.production). Apagado, «Comprar»
 * sigue yendo al checkout de Shopify como antes; con ?formulario en la URL se
 * puede probar en vivo antes de encenderlo para todos.
 *
 * El píxel: InitiateCheckout al abrirlo y Purchase cuando Shopify confirma el
 * pedido, con el número de pedido como eventID.
 */

const ENCENDIDO = import.meta.env.VITE_FORMULARIO_COD === "1";

export interface LineaPedido {
  /** Nombre del producto, como sale en la página. */
  nombre: string;
  /** Color u opción, si la hay. */
  detalle?: string;
  variante: string;
  cantidad: number;
  /** Lo que se le cobra, ya con el descuento del pack. */
  total: number;
  foto?: string;
}

type Campos = { nombre: string; celular: string; departamento: string; ciudad: string; direccion: string; barrio: string; web: string };
const vacios: Campos = { nombre: "", celular: "", departamento: "", ciudad: "", direccion: "", barrio: "", web: "" };

function validar(c: Campos): Partial<Record<keyof Campos, string>> {
  const e: Partial<Record<keyof Campos, string>> = {};
  if (!nombreValido(c.nombre)) e.nombre = "Escribe tu nombre y apellido.";
  if (!celularValido(c.celular)) e.celular = "10 dígitos, empezando por 3.";
  if (!c.departamento) e.departamento = "Elige tu departamento.";
  if (c.ciudad.trim().length < 3) e.ciudad = "Escribe tu ciudad o municipio.";
  if (c.direccion.trim().length < 6) e.direccion = "Escribe la dirección completa.";
  return e;
}

/**
 * El formulario de una página de venta. Devuelve si está encendido, cómo
 * abrirlo y el <dialog>, que la página pinta donde quiera.
 */
export function usePedidoContraEntrega(linea: LineaPedido, alternativa: string, atribucion: string) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [encendido, setEncendido] = useState(ENCENDIDO);

  /* Solo en el navegador: el prerender no conoce la URL de la visita */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("formulario")) setEncendido(true);
  }, []);

  const abrir = () => {
    const d = dialogo.current;
    if (!d) return;
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
    pixel("InitiateCheckout", { content_ids: [linea.variante], content_type: "product", content_name: linea.nombre, value: linea.total, num_items: linea.cantidad, currency: "COP" });
  };

  const elemento = <DialogoPedido dialogo={dialogo} linea={linea} alternativa={alternativa} atribucion={atribucion} />;
  return { encendido, abrir, elemento };
}

function DialogoPedido({ dialogo, linea, alternativa, atribucion }: { dialogo: RefObject<HTMLDialogElement>; linea: LineaPedido; alternativa: string; atribucion: string }) {
  const [c, setC] = useState<Campos>(vacios);
  const [errores, setErrores] = useState<Partial<Record<keyof Campos, string>>>({});
  const [estado, setEstado] = useState<"form" | "enviando" | "ok" | "error">("form");
  const [error, setError] = useState("");
  const [pedido, setPedido] = useState("");
  const abiertoEn = useRef(0);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const alAbrir = () => (abiertoEn.current = Date.now());
    /* Un <dialog> no avisa al abrirse: se mira el atributo open */
    const obs = new MutationObserver(() => d.open && alAbrir());
    obs.observe(d, { attributes: true, attributeFilter: ["open"] });
    return () => obs.disconnect();
  }, [dialogo]);

  const cerrar = () => {
    const d = dialogo.current;
    if (d?.close) d.close();
    else d?.removeAttribute("open");
    if (estado === "ok") {
      setEstado("form");
      setC((x) => ({ ...vacios, nombre: x.nombre, celular: x.celular }));
    }
  };

  const cambiar = (k: keyof Campos) => (e: { target: { value: string } }) => {
    setC((x) => ({ ...x, [k]: e.target.value }));
    if (errores[k]) setErrores((x) => ({ ...x, [k]: undefined }));
  };

  const departamento = DEPARTAMENTOS.find(([cod]) => cod === c.departamento)?.[1] ?? "";
  const resumen = `${linea.cantidad} × ${linea.nombre}${linea.detalle ? ` (${linea.detalle})` : ""}`;
  const whatsapp = waLink(
    `Hola, quiero pedir contra entrega: ${resumen}, ${formatCOP(linea.total)}.` +
      (c.nombre ? ` Nombre: ${c.nombre}.` : "") +
      (c.celular ? ` Celular: ${c.celular}.` : "") +
      (c.direccion ? ` Dirección: ${c.direccion}${c.barrio ? `, ${c.barrio}` : ""}, ${c.ciudad}${departamento ? `, ${departamento}` : ""}.` : "")
  );

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validar(c);
    setErrores(errs);
    if (Object.keys(errs).length) {
      (dialogo.current?.querySelector(`[name="${Object.keys(errs)[0]}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setEstado("enviando");
    setError("");
    try {
      const r = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...c,
          celular: limpiarCelular(c.celular),
          variante: linea.variante,
          cantidad: linea.cantidad,
          total: linea.total,
          atribucion,
          pagina: window.location.pathname,
          ms: Date.now() - abiertoEn.current,
          fbp: leerCookie("_fbp"),
          fbc: leerCookie("_fbc"),
        }),
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; pedido?: string; id?: string; error?: string };
      if (!r.ok || !j.ok) throw new Error(j.error || "No pudimos registrar el pedido.");
      setPedido(j.pedido ?? "");
      setEstado("ok");
      pixel(
        "Purchase",
        { content_ids: [linea.variante], content_type: "product", content_name: linea.nombre, value: linea.total, num_items: linea.cantidad, currency: "COP" },
        { eventID: `pedido-${j.id ?? j.pedido}` }
      );
    } catch (err) {
      setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "No pudimos registrar el pedido. Revisa tu conexión.");
      setEstado("error");
    }
  };

  const campo = (k: keyof Campos, etiqueta: string, props: Record<string, unknown>) => (
    <div className={`dn-campo${errores[k] ? " dn-campo--error" : ""}`}>
      <label htmlFor={`dn-pedido-${k}`}>{etiqueta}</label>
      <input
        id={`dn-pedido-${k}`}
        name={k}
        value={c[k]}
        onChange={cambiar(k)}
        aria-invalid={!!errores[k]}
        aria-describedby={errores[k] ? `dn-pedido-${k}-error` : undefined}
        {...props}
      />
      {errores[k] && (
        <span className="dn-campo__error" id={`dn-pedido-${k}-error`}>
          {errores[k]}
        </span>
      )}
    </div>
  );

  return (
    <dialog ref={dialogo} className="dn-hoja dn-pedido" aria-labelledby="dn-pedido-titulo" onClick={(e) => e.target === dialogo.current && cerrar()}>
      <div className="dn-hoja__caja">
        <button type="button" className="dn-hoja__cerrar" onClick={cerrar} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        {estado === "ok" ? (
          <div className="dn-pedido__ok" role="status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="m8 12 3 3 5-6" />
            </svg>
            <p className="dn-hoja__titulo" id="dn-pedido-titulo">
              ¡Pedido recibido{c.nombre ? `, ${c.nombre.split(" ")[0]}` : ""}!
            </p>
            {pedido && <p className="dn-pedido__numero">Pedido {pedido}</p>}
            <p>
              Te escribimos por WhatsApp al <b>{limpiarCelular(c.celular)}</b> para confirmar la dirección antes de despacharlo. Le pagas{" "}
              <b>{formatCOP(linea.total)}</b> al mensajero cuando te llegue.
            </p>
            <button type="button" className="dn-boton dn-boton--primario dn-oferta__boton" onClick={cerrar}>
              Listo
            </button>
          </div>
        ) : (
          <form className="dn-pedido__form" onSubmit={enviar} noValidate>
            <div className="dn-hoja__cabeza">
              {linea.foto && <img src={linea.foto} alt="" width={96} height={96} loading="lazy" />}
              <div>
                <p className="dn-hoja__titulo" id="dn-pedido-titulo">
                  Pide y paga al recibir
                </p>
                <p className="dn-hoja__total">{formatCOP(linea.total)}</p>
                <p className="dn-hoja__nota">{resumen} · envío gratis</p>
              </div>
            </div>

            {campo("nombre", "Nombre y apellido", { autoComplete: "name", enterKeyHint: "next", maxLength: 80 })}
            {campo("celular", "Celular (WhatsApp)", { type: "tel", inputMode: "numeric", autoComplete: "tel-national", placeholder: "300 123 4567", enterKeyHint: "next", maxLength: 16 })}
            <div className="dn-pedido__fila">
              <div className={`dn-campo${errores.departamento ? " dn-campo--error" : ""}`}>
                <label htmlFor="dn-pedido-departamento">Departamento</label>
                <select
                  id="dn-pedido-departamento"
                  name="departamento"
                  value={c.departamento}
                  onChange={cambiar("departamento")}
                  autoComplete="address-level1"
                  aria-invalid={!!errores.departamento}
                >
                  <option value="">Elige…</option>
                  {DEPARTAMENTOS.map(([cod, nombre]) => (
                    <option key={cod} value={cod}>
                      {nombre}
                    </option>
                  ))}
                </select>
                {errores.departamento && <span className="dn-campo__error">{errores.departamento}</span>}
              </div>
              {campo("ciudad", "Ciudad o municipio", { autoComplete: "address-level2", enterKeyHint: "next", maxLength: 60 })}
            </div>
            {campo("direccion", "Dirección", { autoComplete: "address-line1", placeholder: "Calle 12 # 34-56", enterKeyHint: "next", maxLength: 120 })}
            {campo("barrio", "Barrio y referencias (opcional)", { autoComplete: "address-line2", placeholder: "Barrio, conjunto, torre, apto…", enterKeyHint: "send", maxLength: 120 })}

            {/* Trampa para robots: una persona no la ve ni la llena */}
            <div className="dn-pedido__trampa" aria-hidden="true">
              <label>
                Web
                <input name="web" tabIndex={-1} autoComplete="off" value={c.web} onChange={cambiar("web")} />
              </label>
            </div>

            <button type="submit" className="dn-boton dn-boton--primario dn-oferta__boton" disabled={estado === "enviando"}>
              <span>{estado === "enviando" ? "Enviando tu pedido…" : `Confirmar pedido · ${formatCOP(linea.total)}`}</span>
            </button>
            <p className="dn-pedido__nota">Le pagas al mensajero cuando te llegue. Antes de despacharlo te escribimos por WhatsApp para confirmar.</p>

            {estado === "error" && (
              <div className="dn-pedido__error" role="alert">
                <p>{error}</p>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  Pídelo por WhatsApp
                </a>
              </div>
            )}

            <p className="dn-pedido__alterno">
              ¿Prefieres pagar ya con tarjeta, PSE, Nequi o Bre-B? <a href={alternativa}>Ir al pago</a>
            </p>
            <p className="dn-pedido__privacidad">
              Usamos tus datos solo para enviarte el pedido. <a href="/privacidad">Política de privacidad</a>
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
