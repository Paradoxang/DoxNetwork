/**
 * POST /api/pedido · crea en Shopify el pedido del formulario contra entrega
 * (src/components/PedidoContraEntrega.tsx; el porqué está en src/data/pedido-cod.ts).
 *
 * El pedido nace igual que uno del checkout con «Pago contra entrega»: pago
 * pendiente, pasarela «Cash on Delivery (COD)», envío gratis. Dropify lo pasa
 * a Dropi solo, como pasó con los pedidos del checkout.
 *
 * Nada de lo que manda la página se cree sin comprobar: el precio y el producto
 * salen de Shopify (solo se venden los que llevan la etiqueta `contraentrega`),
 * el descuento del pack de SEGUNDO_CON_DESCUENTO, y si el total no cuadra con
 * el que vio el cliente el pedido no se crea.
 *
 * Credenciales: app «Pedidos contra entrega» del Dev Dashboard de Shopify, con
 * `write_orders` y `read_products`. El token sale de su client ID y su secreto
 * (client credentials grant) y dura 24 h; se guarda en memoria del Worker
 * hasta 5 minutos antes de vencer. El secreto es SHOPIFY_CLIENT_SECRET, un
 * secreto de Cloudflare que pone Santiago: no va en este repositorio.
 */
import { CANTIDAD_MAX, DEPARTAMENTOS, SEGUNDO_CON_DESCUENTO, celularValido, limpiarCelular, nombreValido, type PedidoEntrada } from "../src/data/pedido-cod";

export interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  SHOPIFY_TIENDA: string;
  SHOPIFY_CLIENT_ID: string;
  SHOPIFY_CLIENT_SECRET?: string;
  /** "1" en `wrangler dev`: valida y devuelve el pedido que se crearía, sin llamar a Shopify. */
  SIMULAR?: string;
}

const API = "2026-07";
const ORIGENES = new Set(["https://doxnetworks.com", "https://www.doxnetworks.com"]);

let token: { valor: string; vence: number } | null = null;

const json = (datos: unknown, status = 200) =>
  new Response(JSON.stringify(datos), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

/** Error que se le puede mostrar al cliente tal cual. */
class ErrorCliente extends Error {
  constructor(
    mensaje: string,
    readonly status = 400
  ) {
    super(mensaje);
  }
}

async function tokenShopify(env: Env): Promise<string> {
  if (token && Date.now() < token.vence) return token.valor;
  if (!env.SHOPIFY_CLIENT_ID || !env.SHOPIFY_CLIENT_SECRET) throw new Error("Faltan SHOPIFY_CLIENT_ID o SHOPIFY_CLIENT_SECRET");
  const r = await fetch(`https://${env.SHOPIFY_TIENDA}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: env.SHOPIFY_CLIENT_ID, client_secret: env.SHOPIFY_CLIENT_SECRET, grant_type: "client_credentials" }),
  });
  if (!r.ok) throw new Error(`Token de Shopify: HTTP ${r.status}`);
  const j = (await r.json()) as { access_token: string; expires_in?: number };
  token = { valor: j.access_token, vence: Date.now() + ((j.expires_in ?? 86399) - 300) * 1000 };
  return token.valor;
}

async function gql<T>(env: Env, query: string, variables: Record<string, unknown>): Promise<T> {
  const r = await fetch(`https://${env.SHOPIFY_TIENDA}/admin/api/${API}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": await tokenShopify(env) },
    body: JSON.stringify({ query, variables }),
  });
  const j = (await r.json()) as { data?: T; errors?: unknown };
  if (!r.ok || j.errors || !j.data) throw new Error(`Shopify: HTTP ${r.status} ${JSON.stringify(j.errors ?? "").slice(0, 300)}`);
  return j.data;
}

const VARIANTE = `query($id: ID!) {
  productVariant(id: $id) { id title price product { id title status tags } }
}`;

const CREAR = `mutation($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
  orderCreate(order: $order, options: $options) {
    order { id name }
    userErrors { field message }
  }
}`;

const texto = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

/** Lee y valida lo que manda la página. Lanza ErrorCliente con el primer problema. */
function leer(b: Partial<PedidoEntrada>) {
  if (b.web) throw new ErrorCliente("No pudimos registrar el pedido.");
  if (typeof b.ms !== "number" || b.ms < 2500) throw new ErrorCliente("Revisa tus datos y vuelve a intentarlo.");
  const variante = texto(b.variante, 20);
  if (!/^\d{6,20}$/.test(variante)) throw new ErrorCliente("Producto no válido.");
  const cantidad = Number(b.cantidad);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > CANTIDAD_MAX) throw new ErrorCliente("Cantidad no válida.");
  const nombre = texto(b.nombre, 80);
  if (!nombreValido(nombre)) throw new ErrorCliente("Escribe tu nombre y apellido.");
  const celular = limpiarCelular(texto(b.celular, 20));
  if (!celularValido(celular)) throw new ErrorCliente("El celular debe tener 10 dígitos y empezar por 3.");
  const departamento = DEPARTAMENTOS.find(([c]) => c === b.departamento)?.[0];
  if (!departamento) throw new ErrorCliente("Elige tu departamento.");
  const ciudad = texto(b.ciudad, 60);
  if (ciudad.length < 3) throw new ErrorCliente("Escribe tu ciudad o municipio.");
  const direccion = texto(b.direccion, 120);
  if (direccion.length < 6) throw new ErrorCliente("Escribe la dirección completa.");
  const barrio = texto(b.barrio, 120);
  const total = Number(b.total);
  const pagina = texto(b.pagina, 60);
  const atribucion = [...new URLSearchParams(texto(b.atribucion, 600))].filter(([k]) => k.startsWith("utm_") || k === "fbclid" || k === "gclid");
  return { variante, cantidad, nombre, celular, departamento, ciudad, direccion, barrio, total, pagina, atribucion };
}

export async function pedido(req: Request, env: Env): Promise<Response> {
  if (req.method !== "POST") return json({ ok: false, error: "Método no permitido." }, 405);
  const origen = req.headers.get("Origin") ?? "";
  if (!ORIGENES.has(origen) && !(env.SIMULAR === "1" && origen.startsWith("http://localhost"))) return json({ ok: false, error: "Origen no permitido." }, 403);
  if (Number(req.headers.get("Content-Length") ?? 0) > 8000) return json({ ok: false, error: "Pedido demasiado grande." }, 413);

  try {
    const p = leer((await req.json()) as Partial<PedidoEntrada>);

    const partes = p.nombre.split(" ");
    const direccion = {
      firstName: partes[0],
      lastName: partes.slice(1).join(" "),
      address1: p.direccion,
      address2: p.barrio || null,
      city: p.ciudad,
      provinceCode: p.departamento,
      countryCode: "CO",
      phone: `+57${p.celular}`,
    };

    if (env.SIMULAR === "1") return json({ ok: true, simulado: true, pedido: "#SIMULADO", entrada: p, direccion });

    const { productVariant: v } = await gql<{
      productVariant: { id: string; title: string; price: string; product: { id: string; title: string; status: string; tags: string[] } } | null;
    }>(env, VARIANTE, { id: `gid://shopify/ProductVariant/${p.variante}` });
    if (!v || v.product.status !== "ACTIVE" || !v.product.tags.includes("contraentrega")) throw new ErrorCliente("Este producto no se puede pedir contra entrega.");

    const precio = Math.round(Number(v.price));
    const tasa = SEGUNDO_CON_DESCUENTO[v.product.id.split("/").pop()!] ?? 0;
    const descuento = p.cantidad === 2 ? Math.round(precio * tasa) : 0;
    const total = precio * p.cantidad - descuento;
    if (total !== p.total) throw new ErrorCliente("El precio cambió mientras pedías. Recarga la página y vuelve a intentarlo.", 409);

    const cop = (n: number) => ({ shopMoney: { amount: String(n), currencyCode: "COP" } });
    const order = {
      currency: "COP",
      phone: direccion.phone,
      lineItems: [{ variantId: v.id, quantity: p.cantidad, priceSet: cop(precio) }],
      shippingAddress: direccion,
      billingAddress: direccion,
      shippingLines: [{ title: "Gratis para Colombia", priceSet: cop(0) }],
      ...(descuento ? { discountCode: { itemFixedDiscountCode: { code: "SEGUNDO-30", amountSet: cop(descuento) } } } : {}),
      financialStatus: "PENDING",
      transactions: [{ kind: "SALE", status: "PENDING", gateway: "Cash on Delivery (COD)", amountSet: cop(total) }],
      tags: ["formulario-contraentrega"],
      note: `Pedido del formulario contra entrega de doxnetworks.com${p.pagina}. Confirmar por WhatsApp antes de despachar.`,
      customAttributes: [{ key: "pagina", value: p.pagina }, ...p.atribucion.map(([key, value]) => ({ key, value }))],
    };
    const { orderCreate } = await gql<{ orderCreate: { order: { id: string; name: string } | null; userErrors: { field: string[]; message: string }[] } }>(
      env,
      CREAR,
      { order, options: { inventoryBehaviour: "BYPASS", sendReceipt: false, sendFulfillmentReceipt: false } }
    );
    if (!orderCreate.order) throw new Error(`orderCreate: ${JSON.stringify(orderCreate.userErrors).slice(0, 400)}`);

    return json({ ok: true, pedido: orderCreate.order.name, id: orderCreate.order.id.split("/").pop(), total });
  } catch (e) {
    if (e instanceof ErrorCliente) return json({ ok: false, error: e.message }, e.status);
    console.error("pedido", e);
    return json({ ok: false, error: "No pudimos registrar el pedido." }, 502);
  }
}
