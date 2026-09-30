/**
 * El Worker de doxnetworks.com. Los archivos estáticos no pasan por aquí: en
 * wrangler.toml, `run_worker_first` solo manda /api/* a este script, y todo lo
 * demás lo sirve Cloudflare directo desde dist/, gratis y sin invocaciones.
 */
import { enviarCompra } from "./capi";
import { pedido, type Env } from "./pedido";

export default {
  async fetch(req: Request, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }): Promise<Response> {
    const { pathname } = new URL(req.url);
    if (pathname === "/api/pedido") return pedido(req, env, ctx);
    if (pathname === "/api/capi-prueba") return capiPrueba(req, env);
    if (pathname.startsWith("/api/")) return new Response("No existe", { status: 404 });
    return env.ASSETS.fetch(req);
  },
};

/**
 * POST /api/capi-prueba {"codigo":"TEST12345"} · manda una compra falsa a Meta como EVENTO DE PRUEBA
 * (el código sale del Administrador de eventos → Probar eventos). Sirve para comprobar el secreto
 * META_CAPI_TOKEN sin crear un pedido de verdad. Sin un código TEST válido no manda nada, y los
 * eventos de prueba no cuentan para los anuncios.
 */
async function capiPrueba(req: Request, env: Env): Promise<Response> {
  const cabeceras = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (req.method !== "POST") return new Response(JSON.stringify({ ok: false, error: "Usa POST" }), { status: 405, headers: cabeceras });
  const b = (await req.json().catch(() => ({}))) as { codigo?: string };
  const codigo = typeof b.codigo === "string" ? b.codigo.trim() : "";
  if (!/^TEST\d{3,10}$/.test(codigo)) return new Response(JSON.stringify({ ok: false, error: "Falta un código de prueba TEST… válido" }), { status: 400, headers: cabeceras });
  const r = await enviarCompra(env, {
    eventId: `prueba-${Date.now()}`,
    url: "https://doxnetworks.com/comedero",
    valor: 1000,
    variante: "0",
    cantidad: 1,
    nombre: "Prueba Mercurio",
    celular: "3000000000",
    ciudad: "Bogota",
    departamento: "DC",
    ip: req.headers.get("CF-Connecting-IP"),
    agente: req.headers.get("User-Agent"),
    codigoPrueba: codigo,
  });
  return new Response(JSON.stringify(r), { status: r.ok ? 200 : 502, headers: cabeceras });
}
