import { useEffect } from "react";

/**
 * Píxel de Meta, apagado hasta que haya ID.
 *
 * Sin `VITE_META_PIXEL_ID` no hace nada y no descarga nada: es el hueco
 * preparado para cuando exista la cuenta publicitaria.
 *
 * La CSP de `public/_headers` deja pasar `connect.facebook.net` (script) y
 * `www.facebook.com` (img y connect) desde el 23-sep-2026, cuando llegó el ID.
 * Si se cambia de píxel o de proveedor, revisar esas tres líneas: un script
 * bloqueado por CSP falla en silencio salvo por un error en consola, igual
 * que pasó con el beacon de Cloudflare al conectar el dominio.
 *
 * El ID no es secreto —va inlineado en el JS de cada página por diseño—, así
 * que vive en `.env.production`, versionado, para que el build de Cloudflare
 * lo vea. Ahí nunca va nada que sí sea secreto.
 *
 * El script se carga desde el efecto y no como <script> inline a propósito:
 * un inline necesitaría 'unsafe-inline' en la CSP, que es justo lo que este
 * sitio evita externalizando hasta el arranque de vite-react-ssg.
 */
export function MetaPixel() {
  const id = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

  useEffect(() => {
    if (!id) return;
    if (document.getElementById("meta-pixel")) return;

    const w = window as unknown as Record<string, any>;
    const fbq: any = (...args: unknown[]) =>
      fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq; // como el snippet oficial: fbevents.js lo espera
    w.fbq ??= fbq;
    w._fbq ??= fbq;

    const s = document.createElement("script");
    s.id = "meta-pixel";
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);

    w.fbq("init", id);
    w.fbq("track", "PageView");
  }, [id]);

  return null;
}

/** Evento del píxel, inofensivo mientras no haya ID. */
export function pixel(evento: string, datos?: Record<string, unknown>) {
  const fbq = (window as unknown as Record<string, any>).fbq;
  if (typeof fbq === "function") fbq("track", evento, datos);
}
