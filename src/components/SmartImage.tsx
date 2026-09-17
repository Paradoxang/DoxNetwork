import { useEffect, useRef, useState } from "react";

/**
 * Imagen opcional encima de un fondo de respaldo. Arranca invisible y solo se
 * muestra si carga de verdad: así se puede declarar la ruta de una imagen que
 * todavía no se ha generado y el diseño no se rompe mientras tanto.
 *
 * El `complete` del efecto cubre el caso en que la imagen terminó de cargar
 * (o de fallar) antes de que React hidratara y se perdiera el onLoad.
 */
export function SmartImage({
  src,
  alt = "",
  className = "",
  eager = false,
  sizes,
}: {
  src?: string;
  alt?: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (img?.complete) setOk(img.naturalWidth > 0);
  }, [src]);

  if (!src) return null;
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setOk(true)}
      onError={() => setOk(false)}
      className={`transition-opacity duration-500 ${ok ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
