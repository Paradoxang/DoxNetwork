/**
 * Piezas decorativas del universo Dox (public/deco, generadas por
 * brand/imagenes/deco.py). Son atrezo: no cuentan nada que el texto no diga,
 * así que van siempre aria-hidden y sin capturar el puntero.
 *
 * Dos familias:
 *  · "luz" (partículas, nebulosas, anillos, retículas): vienen sobre negro y
 *    se mezclan con `screen`, que descarta el negro sobre el fondo navy.
 *  · "objeto" (orbes de cromo, cristales, el escudo…): ya vienen recortados.
 *
 * Todas cargan en diferido y ninguna bloquea el primer pintado. Si el visitante
 * pidió menos movimiento, `flota` se detiene solo (index.css).
 */
const LUZ = new Set([
  "particulas",
  "particulas-campo",
  "anillo",
  "reticula",
  "esquinas",
  "marco",
  "banda",
  "malla",
  "nebulosa",
  "velo",
  "destello",
  "nodo",
  "lente",
  "esfera",
  "diagrama",
  "estela",
  "polvo",
  "fibra",
]);

export type DecoName =
  | "particulas"
  | "particulas-campo"
  | "anillo"
  | "reticula"
  | "esquinas"
  | "marco"
  | "banda"
  | "malla"
  | "nebulosa"
  | "velo"
  | "destello"
  | "nodo"
  | "lente"
  | "esfera"
  | "diagrama"
  | "estela"
  | "polvo"
  | "fibra"
  | "orbe-1"
  | "orbe-2"
  | "orbe-3"
  | "cristal-1"
  | "cristal-2"
  | "cristal-3"
  | "vortice"
  | "escudo"
  | "llave"
  | "boveda"
  | "nave"
  | "modulo"
  | "astrolabio"
  | "cristal-capas"
  | "vela"
  | "sello";

export function Deco({
  name,
  className = "",
  opacity = 0.5,
  float = false,
  rotate,
  fade,
}: {
  name: DecoName;
  /** Posición y tamaño: la pieza es un <img> suelto, la coloca quien la usa. */
  className?: string;
  opacity?: number;
  /** Flotación lenta (se detiene con movimiento reducido). */
  float?: boolean;
  rotate?: number;
  /** Difuminado de los bordes. Por defecto en las capas de luz, que si no
   *  dejan ver el rectángulo del render. */
  fade?: boolean;
}) {
  const luz = LUZ.has(name);
  const difumina = fade ?? luz;
  return (
    <img
      src={`/deco/${name}.webp`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`pointer-events-none absolute select-none ${luz ? "mix-blend-screen" : ""} ${float ? "flota" : ""} ${className}`}
      style={{
        opacity,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        maskImage: difumina ? "radial-gradient(closest-side, #000 45%, transparent 98%)" : undefined,
      }}
    />
  );
}
