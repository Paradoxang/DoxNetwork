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
export type AstroPose =
  | "saludo"
  | "senala"
  | "pulgar"
  | "celebra"
  | "piensa"
  | "cine"
  | "sorpresa"
  | "404"
  | "busto"
  | "chibi"
  | "despedida"
  | "escudo"
  | "favoritos"
  | "laptop"
  | "soporte"
  | "audifonos"
  | "carga"
  | "estuche"
  | "gamer"
  | "mayor-edad"
  | "perfume"
  | "regalo"
  | "reloj"
  | "spray"
  | "urgente"
  | "chibi-audifonos"
  | "chibi-envios"
  | "chibi-espera"
  | "chibi-gracias"
  | "chibi-hola"
  | "chibi-listo"
  | "chibi-mayor-edad"
  | "chibi-perfume"
  | "chibi-reloj"
  | "chibi-sorpresa"
  | "chibi-streaming";

const dims: Record<AstroPose, [number, number]> = {
  celebra: [617, 901],
  cine: [593, 902],
  piensa: [533, 901],
  pulgar: [543, 902],
  saludo: [607, 900],
  senala: [646, 902],
  sorpresa: [671, 902],
  "404": [713, 837],
  busto: [748, 955],
  chibi: [639, 871],
  despedida: [594, 899],
  escudo: [558, 904],
  favoritos: [548, 902],
  laptop: [606, 904],
  soporte: [610, 902],
  audifonos: [559, 900],
  carga: [686, 900],
  estuche: [462, 900],
  gamer: [554, 900],
  "mayor-edad": [566, 900],
  perfume: [443, 900],
  regalo: [457, 900],
  reloj: [482, 900],
  spray: [633, 900],
  urgente: [496, 900],
  "chibi-audifonos": [770, 900],
  "chibi-envios": [779, 900],
  "chibi-espera": [626, 900],
  "chibi-gracias": [624, 900],
  "chibi-hola": [782, 900],
  "chibi-listo": [727, 900],
  "chibi-mayor-edad": [696, 900],
  "chibi-perfume": [753, 900],
  "chibi-reloj": [914, 900],
  "chibi-sorpresa": [588, 900],
  "chibi-streaming": [672, 900],
};

const alts: Record<AstroPose, string> = {
  saludo: "ASTRO, el astronauta de DoxNetwork, saludando",
  senala: "ASTRO señalando",
  pulgar: "ASTRO con el pulgar arriba",
  celebra: "ASTRO celebrando",
  piensa: "ASTRO pensando",
  cine: "ASTRO con crispetas y una entrada de cine",
  sorpresa: "ASTRO sorprendido",
  "404": "ASTRO flotando de cabeza, perdido en el espacio",
  busto: "ASTRO saludando",
  chibi: "ASTRO en versión chibi, saludando",
  despedida: "ASTRO despidiéndose de espaldas",
  escudo: "ASTRO con un escudo de garantía",
  favoritos: "ASTRO abrazando un corazón",
  laptop: "ASTRO trabajando en un portátil",
  soporte: "ASTRO hablando por teléfono",
  audifonos: "ASTRO con audífonos",
  carga: "ASTRO con un cargador",
  estuche: "ASTRO mostrando un estuche",
  gamer: "ASTRO jugando en una consola portátil",
  "mayor-edad": "ASTRO pidiendo verificar la edad",
  perfume: "ASTRO con un frasco de perfume",
  regalo: "ASTRO con un regalo",
  reloj: "ASTRO mostrando un reloj",
  spray: "ASTRO probando una fragancia",
  urgente: "ASTRO señalando un reloj de arena",
  "chibi-audifonos": "ASTRO chibi con audífonos",
  "chibi-envios": "ASTRO chibi con una caja de envío",
  "chibi-espera": "ASTRO chibi esperando con un reloj de arena",
  "chibi-gracias": "ASTRO chibi abrazando un corazón",
  "chibi-hola": "ASTRO chibi saludando con las dos manos",
  "chibi-listo": "ASTRO chibi con el pulgar arriba",
  "chibi-mayor-edad": "ASTRO chibi pidiendo verificar la edad",
  "chibi-perfume": "ASTRO chibi con un frasco de perfume",
  "chibi-reloj": "ASTRO chibi mostrando un reloj",
  "chibi-sorpresa": "ASTRO chibi sorprendido",
  "chibi-streaming": "ASTRO chibi con crispetas viendo una serie",
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
