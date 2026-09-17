import { motion, useReducedMotion } from "framer-motion";
import { EASE, SSR } from "@/lib/anim";

/**
 * ASTRO, el avatar de DoxNetwork. Imágenes sin fondo en /public/astro
 * (recortadas con brand/astro/key_astro.py), con una versión pequeña para
 * usos de menos de ~180 px de alto.
 *
 * Framer lleva la entrada (sube con un rebote suave al entrar en pantalla) y
 * la reacción al puntero; la flotación va en CSS (`.flota`) en un nodo
 * interior para no pelear por el mismo `transform`.
 */
export type AstroPose = "saludo" | "senala" | "pulgar" | "celebra" | "piensa" | "cine" | "sorpresa";

const dims: Record<AstroPose, [number, number]> = {
  celebra: [617, 901],
  cine: [593, 902],
  piensa: [533, 901],
  pulgar: [543, 902],
  saludo: [607, 900],
  senala: [646, 902],
  sorpresa: [671, 902],
};

const alts: Record<AstroPose, string> = {
  saludo: "ASTRO, el astronauta de DoxNetwork, saludando",
  senala: "ASTRO señalando",
  pulgar: "ASTRO con el pulgar arriba",
  celebra: "ASTRO celebrando",
  piensa: "ASTRO pensando",
  cine: "ASTRO con crispetas y una entrada de cine",
  sorpresa: "ASTRO sorprendido",
};

export function Astro({
  pose,
  className = "",
  float = true,
  enter = true,
  eager = false,
  small = false,
  decorative = false,
  delay = 0,
}: {
  pose: AstroPose;
  /** Controla el tamaño: pon un alto (h-*) o un ancho (w-*). */
  className?: string;
  float?: boolean;
  /** Animación de entrada al aparecer en pantalla. */
  enter?: boolean;
  eager?: boolean;
  /** Usa la versión de 360 px de alto. */
  small?: boolean;
  /** Oculto para lectores de pantalla cuando solo acompaña. */
  decorative?: boolean;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const [w, h] = dims[pose];
  const animateIn = enter && !reduced && !SSR;

  return (
    <motion.div
      // Sin `relative` fijo: en Tailwind `relative` le gana a `absolute` y no se
      // podría posicionar desde fuera. El contenedor no lo necesita.
      className={`select-none ${className}`}
      style={{ aspectRatio: `${w} / ${h}` }}
      initial={animateIn ? { opacity: 0, y: 36, scale: 0.92 } : false}
      whileInView={animateIn ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay }}
      whileHover={reduced ? undefined : { rotate: -3, scale: 1.03, transition: { duration: 0.35, ease: EASE } }}
    >
      <div className={`h-full w-full ${float && !reduced ? "flota" : ""}`}>
        <img
          src={`/astro/astro-${pose}${small ? "-sm" : ""}.webp`}
          alt={decorative ? "" : alts[pose]}
          aria-hidden={decorative || undefined}
          width={w}
          height={h}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain drop-shadow-[0_24px_40px_rgba(6,9,18,0.35)]"
        />
      </div>
    </motion.div>
  );
}
