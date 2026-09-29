/**
 * El Worker de doxnetworks.com. Los archivos estáticos no pasan por aquí: en
 * wrangler.toml, `run_worker_first` solo manda /api/* a este script, y todo lo
 * demás lo sirve Cloudflare directo desde dist/, gratis y sin invocaciones.
 */
import { pedido, type Env } from "./pedido";

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(req.url);
    if (pathname === "/api/pedido") return pedido(req, env);
    if (pathname.startsWith("/api/")) return new Response("No existe", { status: 404 });
    return env.ASSETS.fetch(req);
  },
};
