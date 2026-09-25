/**
 * Telón de fondo de una sección o de una página entera.
 *
 * Los telones (public/deco/telon-*.webp) vienen pintados sobre el mismo navy
 * del sitio y desenfocados de origen, así que no llevan mezcla ni recorte: se
 * apoyan detrás del contenido, se difuminan por abajo y ya. Van fijos al
 * viewport cuando cubren una página —la rejilla pasa por encima, como en
 * Nightkidz— y absolutos cuando visten una sola sección.
 *
 * Son la capa más cara del sitio (una imagen a pantalla completa), así que
 * desaparecen en modo ligero: llevan la marca `deco-pesado`.
 */
export type TelonName =
  | "telon-perfumeria"
  | "telon-relojeria"
  | "telon-tecnologia"
  | "telon-vapes"
  | "telon-aurora"
  | "telon-nebulosa";

export function Telon({
  name,
  fijo = false,
  opacity = 0.5,
  className = "",
}: {
  name: TelonName;
  /** Fijo al viewport (página entera) o absoluto dentro de su sección. */
  fijo?: boolean;
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`deco-pesado pointer-events-none ${fijo ? "fixed inset-x-0 top-0 h-[70vh]" : "absolute inset-x-0 top-0"} -z-10 overflow-hidden ${className}`}
    >
      <img
        src={`/deco/${name}.webp`}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        style={{ opacity, maskImage: "linear-gradient(180deg, #000 0%, #000 45%, transparent 100%)" }}
      />
    </div>
  );
}
