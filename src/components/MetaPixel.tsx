import { useEffect } from "react";

/**
 * Píxel de Meta, apagado hasta que haya ID.
 *
 * Sin `VITE_META_PIXEL_ID` no hace nada y no descarga nada: es el hueco
 * preparado para cuando exista la cuenta publicitaria.
 *
 * ⚠️ ANTES DE ENCENDERLO hay que tocar `public/_headers`. La CSP del sitio es
 * `script-src 'self' https://static.cloudflareinsights.com`, así que el
 * navegador bloqueará `connect.facebook.net` y el píxel no medirá nada — y lo
 * hará en silencio salvo por un error en consola. Hay que añadir:
 *
 *   script-src  … https://connect.facebook.net
 *   img-src     … https://www.facebook.com
 *   connect-src … https://www.facebook.com
 *
 * Es exactamente el mismo tropiezo que dio el beacon de Cloudflare al conectar
 * el dominio: inyectado, bloqueado y sin recoger un dato.
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
