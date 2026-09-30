/**
 * Compra por la API de conversiones de Meta (CAPI), desde el servidor (30-sep-2026).
 *
 * Por qué: el pedido del formulario contra entrega se crea por API y no pasa por el
 * checkout de Shopify, así que la app de Meta de Shopify no lo ve. En doxnetworks.com
 * el navegador ya manda la compra al píxel (PedidoContraEntrega.tsx), pero la pierden
 * los bloqueadores y los iPhone con seguimiento limitado; en la tienda de Shopify
 * (snippets/dn-pedido.liquid) no sale ninguna. Esta es la copia de servidor.
 *
 * Deduplicación: mismo event_name («Purchase») y mismo event_id que el navegador,
 * «pedido-<id del pedido en Shopify>». Meta cuenta una sola vez si llegan las dos.
 *
 * Credencial: META_CAPI_TOKEN, secreto de Cloudflare que genera Santiago en el
 * Administrador de eventos (píxel → Configuración → API de conversiones). No va en
 * este repositorio. Sin el secreto, no se manda nada y el pedido sigue igual.
 */
export interface EnvCapi {
  META_PIXEL_ID?: string;
  META_CAPI_TOKEN?: string;
  /** Solo para pruebas: con un código «TEST…» del Administrador de eventos, las compras salen como eventos de prueba. */
  META_TEST_EVENT_CODE?: string;
}

export interface Compra {
  eventId: string;
  url: string;
  valor: number;
  variante: string;
  cantidad: number;
  nombre: string;
  celular: string;
  ciudad: string;
  departamento: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  ip?: string | null;
  agente?: string | null;
  codigoPrueba?: string;
}

const VERSION = "v26.0";

async function sha256(texto: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Normalización de Meta: minúsculas, sin espacios ni signos; las tildes se quitan. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export async function enviarCompra(env: EnvCapi, c: Compra): Promise<{ ok: boolean; detalle: string }> {
  if (!env.META_CAPI_TOKEN || !env.META_PIXEL_ID) return { ok: false, detalle: "sin META_CAPI_TOKEN o META_PIXEL_ID" };
  const partes = c.nombre.trim().split(/\s+/);
  const telefono = `57${c.celular}`;
  const ahora = Math.floor(Date.now() / 1000);
  // _fbc de la cookie; si no hay, se arma con el fbclid guardado en la atribución (formato de Meta).
  const fbc = c.fbc || (c.fbclid ? `fb.1.${Date.now()}.${c.fbclid}` : undefined);
  const user_data: Record<string, unknown> = {
    ph: [await sha256(telefono)],
    fn: [await sha256(norm(partes[0] ?? ""))],
    ln: [await sha256(norm(partes.slice(1).join(" ")))],
    ct: [await sha256(norm(c.ciudad))],
    st: [await sha256(norm(c.departamento))],
    country: [await sha256("co")],
    external_id: [await sha256(telefono)],
    ...(c.ip ? { client_ip_address: c.ip } : {}),
    ...(c.agente ? { client_user_agent: c.agente } : {}),
    ...(c.fbp ? { fbp: c.fbp } : {}),
    ...(fbc ? { fbc } : {}),
  };
  const cuerpo: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: ahora,
        event_id: c.eventId,
        action_source: "website",
        event_source_url: c.url,
        user_data,
        custom_data: {
          currency: "COP",
          value: c.valor,
          content_type: "product",
          content_ids: [c.variante],
          contents: [{ id: c.variante, quantity: c.cantidad }],
          num_items: c.cantidad,
        },
      },
    ],
  };
  const prueba = c.codigoPrueba || env.META_TEST_EVENT_CODE;
  if (prueba) cuerpo.test_event_code = prueba;
  const r = await fetch(`https://graph.facebook.com/${VERSION}/${env.META_PIXEL_ID}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  const j = (await r.json().catch(() => ({}))) as { events_received?: number; error?: { message?: string; error_user_msg?: string } };
  if (!r.ok || j.error) return { ok: false, detalle: `HTTP ${r.status} ${j.error?.error_user_msg || j.error?.message || ""}`.trim() };
  return { ok: true, detalle: `events_received=${j.events_received ?? "?"}${prueba ? " (prueba)" : ""}` };
}
