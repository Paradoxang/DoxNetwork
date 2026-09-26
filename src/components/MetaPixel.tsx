import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Píxel de Meta en todo el sitio, montado una vez en el layout raíz (App.tsx).
 *
 * Hasta el 26-sep-2026 solo se montaba en /comedero, y la campaña de
 * perfumería (que lleva a /perfumeria?para=…) no dejaba ni un PageView:
 * 20 clics y 1 visita registrada (docs/ENCARGO-ASTRO-pixel-todo-el-sitio.md).
 *
 * - PageView en cada cambio de ruta: la tienda es una SPA y navegar no recarga.
 *   Cambiar de filtro (?para=hombre) no es otra página y no cuenta.
 * - `pixel()` inicia el píxel si todavía no lo estaba, así que da igual qué
 *   efecto corra primero, el de la página o el del layout.
 * - Los vapes no mandan nada, ni PageView: la Ley 2354 prohíbe promocionarlos
 *   y Meta tampoco admite anunciarlos, así que no se le pasan datos de ellos.
 *
 * Sin `VITE_META_PIXEL_ID` no hace nada y no descarga nada.
 *
 * La CSP de `public/_headers` deja pasar `connect.facebook.net` (script) y
 * `www.facebook.com` (img, connect, frame y form-action) desde el 23-sep-2026.
 * Si se cambia de píxel o de proveedor, revisar esas líneas: un script
 * bloqueado por CSP falla en silencio salvo por un error en consola, igual
 * que pasó con el beacon de Cloudflare al conectar el dominio.
 *
 * El ID no es secreto —va inlineado en el JS de cada página por diseño—, así
 * que vive en `.env.production`, versionado, para que el build de Cloudflare
 * lo vea. Ahí nunca va nada que sí sea secreto.
 *
 * El script se carga desde JS y no como <script> inline a propósito: un
 * inline necesitaría 'unsafe-inline' en la CSP, que es justo lo que este
 * sitio evita externalizando hasta el arranque de vite-react-ssg.
 */
const ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

/** Rutas que no le pasan nada a Meta. */
const sinPixel = (ruta: string) => ruta === "/vapes" || ruta.startsWith("/producto/vapes-");

let iniciado = false;
let ultimaRuta = "";

type Fbq = ((...args: unknown[]) => void) & Record<string, any>;
const fbqDe = () => (window as unknown as { fbq?: Fbq }).fbq;

/** Crea la cola de fbq como el snippet oficial, carga fbevents.js e inicia el píxel, una sola vez. */
function asegurar(): boolean {
  if (!ID || typeof window === "undefined") return false;
  if (iniciado) return true;

  const w = window as unknown as Record<string, any>;
  if (!w.fbq) {
    const fbq: any = (...args: unknown[]) => (fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args));
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq; // fbevents.js lo espera
    w.fbq = fbq;
    w._fbq ??= fbq;
  }
  if (!document.getElementById("meta-pixel")) {
    const s = document.createElement("script");
    s.id = "meta-pixel";
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }
  w.fbq("init", ID);
  iniciado = true;
  return true;
}

export function MetaPixel() {
  const { pathname } = useLocation();

  useEffect(() => {
    // `ultimaRuta` evita el PageView doble del modo estricto de React
    if (pathname === ultimaRuta) return;
    ultimaRuta = pathname;
    if (sinPixel(pathname) || !asegurar()) return;
    fbqDe()?.("track", "PageView");
  }, [pathname]);

  return null;
}

/** Evento del píxel. Inofensivo sin ID, y mudo en las rutas de vapes. */
export function pixel(evento: string, datos?: Record<string, unknown>) {
  if (typeof window === "undefined" || sinPixel(window.location.pathname)) return;
  if (!asegurar()) return;
  fbqDe()?.("track", evento, datos);
}
