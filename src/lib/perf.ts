/**
 * Modo ligero: la misma tienda, sin lo que cuesta pintar.
 *
 * Esto es un ecommerce y buena parte del tráfico llega por WhatsApp desde
 * gamas medias y bajas. La página tiene un shader WebGL en el hero, capas con
 * `mix-blend-mode`, desenfoques, grano a pantalla completa y scroll suavizado:
 * en un equipo bueno se mueve solo, en uno flojo se arrastra justo cuando la
 * persona está decidiendo comprar. Por eso hay dos modos.
 *
 * El modo se decide en tres capas, de menos a más fiable:
 *
 *  1. Lo que el equipo declara: ahorro de datos, memoria, núcleos, conexión y
 *     la preferencia de menos movimiento del sistema.
 *  2. Lo que el equipo demuestra: se miden los fotogramas del primer scroll y,
 *     si no llega a 40 fps, se baja a ligero aunque la ficha técnica dijera
 *     otra cosa (la ficha miente: un móvil con 8 núcleos térmicamente limitado
 *     rinde como uno de 4).
 *  3. Lo que la persona elige: el interruptor del pie manda sobre todo y se
 *     recuerda en este navegador.
 *
 * El resultado vive en `document.documentElement.dataset.perf`, así el CSS
 * apaga lo caro sin que ningún componente tenga que enterarse, y en un evento
 * para los que sí necesitan saberlo (el hero, el scroll suavizado, el tilt).
 */
export type Modo = "completo" | "ligero";

const CLAVE = "dox-perf";
const EVENTO = "dox-perf-change";

/** SSR: en el prerender no hay navegador, así que se asume el modo completo. */
export const modoActual = (): Modo =>
  typeof document === "undefined" ? "completo" : (document.documentElement.dataset.perf as Modo) || "completo";

export const modoGuardado = (): Modo | null => {
  try {
    const v = localStorage.getItem(CLAVE);
    return v === "ligero" || v === "completo" ? v : null;
  } catch {
    return null; // modo privado
  }
};

/** Señales del propio equipo. No miden rendimiento real, solo dan un primer aviso. */
function equipoModesto(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const con = nav.connection;
  // Ahorro de datos: lo pidió la persona, se respeta sin discutir
  if (con?.saveData) return true;
  // 2G sí: ahí el problema es traer los megas. 3G no: la red no dice nada de
  // lo que cuesta pintar, y degradaba la página en equipos perfectamente capaces
  if (con?.effectiveType && ["slow-2g", "2g"].includes(con.effectiveType)) return true;
  // Solo gama muy baja: 4 núcleos y 4 GB los tiene media gama que va de sobra
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return true;
  // Lo demás lo decide la medición real del primer scroll
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function aplicarModo(modo: Modo, recordar = false) {
  document.documentElement.dataset.perf = modo;
  if (recordar) {
    try {
      localStorage.setItem(CLAVE, modo);
    } catch {
      /* modo privado: el modo vale solo para esta visita */
    }
  }
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: modo }));
}

export function alCambiarModo(fn: (modo: Modo) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<Modo>).detail);
  window.addEventListener(EVENTO, handler);
  return () => window.removeEventListener(EVENTO, handler);
}

/**
 * Mide el primer scroll de verdad y decide si este equipo va ahogado.
 *
 * Con los fotogramas solos no alcanza: un navegador en segundo plano, una
 * pestaña oculta o un monitor a 30 Hz dan pocos fotogramas sin que el equipo
 * esté sufriendo, y bajar de modo a alguien que no lo necesita es peor que no
 * hacer nada. Por eso se piden dos señales a la vez: pocos fotogramas Y el
 * hilo principal bloqueado (tareas largas). Donde no existan las tareas largas
 * (Safari), se exige un número de fotogramas mucho más bajo para actuar.
 *
 * Solo baja de modo, nunca sube.
 */
function vigilarFotogramas() {
  const VENTANA = 1500;
  let frames = 0;
  let inicio = 0;
  let raf = 0;
  let midiendo = false;
  let bloqueoMs = 0;

  const soportaTareasLargas =
    typeof PerformanceObserver !== "undefined" && PerformanceObserver.supportedEntryTypes?.includes("longtask");
  let observador: PerformanceObserver | null = null;

  const terminar = () => {
    midiendo = false;
    cancelAnimationFrame(raf);
    observador?.disconnect();
    window.removeEventListener("scroll", arrancar);
  };

  const paso = (t: number) => {
    if (!inicio) inicio = t;
    frames++;
    const transcurrido = t - inicio;
    if (transcurrido < VENTANA) {
      raf = requestAnimationFrame(paso);
      return;
    }
    const fps = (frames * 1000) / transcurrido;
    /* Umbrales medidos sobre esta misma página con el CPU frenado:
       equipo flojo (x6) ~22 fps y 320 ms bloqueados por segundo y medio;
       equipo normal, 50 fps y 0 ms. El corte va entre los dos, y lejos de
       ambos, para no castigar a nadie por una ventana mala. */
    const ahogado = soportaTareasLargas ? fps < 34 && bloqueoMs > transcurrido * 0.15 : fps < 24;
    if (ahogado && modoGuardado() !== "completo") aplicarModo("ligero");
    terminar();
  };

  function arrancar() {
    if (midiendo || document.hidden) return;
    midiendo = true; // una sola medición por visita
    if (soportaTareasLargas) {
      observador = new PerformanceObserver((lista) => {
        for (const e of lista.getEntries()) bloqueoMs += e.duration;
      });
      try {
        observador.observe({ type: "longtask", buffered: false });
      } catch {
        observador = null;
      }
    }
    raf = requestAnimationFrame(paso);
  }

  // Se mide durante el primer scroll: es cuando de verdad se nota el ahogo
  window.addEventListener("scroll", arrancar, { once: true, passive: true });
  return terminar;
}

/** Se llama una vez al montar la aplicación. */
export function iniciarModo() {
  const elegido = modoGuardado();
  if (elegido) {
    aplicarModo(elegido);
    return () => {};
  }
  aplicarModo(equipoModesto() ? "ligero" : "completo");
  return vigilarFotogramas();
}
