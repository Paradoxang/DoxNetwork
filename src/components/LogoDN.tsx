import { forwardRef, useId } from "react";

/**
 * Isotipo DN en línea. Misma geometría que brand/gen_logo.py, pero los colores
 * salen de las variables --lg-* de index.css, así que cambia solo con el tema.
 *
 * Las piezas llevan clases `dn-*` para que GSAP las coreografíe desde fuera
 * (ver sections/Hero.tsx). Los ids de los degradados se derivan de useId, sin
 * los dos puntos que React mete y que rompen `url(#...)`.
 */

const CX = 500;
const CY = 420;
const D_PATH = "M 305 165 L 420 165 A 255.7 255.7 0 1 1 420 675 L 305 675 Z";
const N_L = 790;
const N_R = 1030;
const T = 165;
const B = 675;
const RING_BACK = "M -275 0 A 275 66 0 0 1 275 0 L 155 0 A 155 37.2 0 0 0 -155 0 Z";
const RING_FRONT = "M 275 0 A 275 66 0 0 1 -275 0 L -155 0 A 155 37.2 0 0 0 155 0 Z";

const stop = (offset: number, v: string) => (
  <stop offset={offset} style={{ stopColor: `var(${v})` }} />
);

export const LogoDN = forwardRef<SVGSVGElement, { className?: string; title?: string }>(
  function LogoDN({ className = "", title }, ref) {
    const u = useId().replace(/:/g, "");
    const id = (n: string) => `${n}-${u}`;
    const url = (n: string) => `url(#${id(n)})`;

    return (
      <svg
        ref={ref}
        viewBox="262 118 818 604"
        className={className}
        role={title ? "img" : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
      >
        <defs>
          <linearGradient id={id("d")} x1="0" y1="0" x2="0.6" y2="1">
            {stop(0, "--lg-d1")}
            {stop(0.55, "--lg-d2")}
            {stop(1, "--lg-d3")}
          </linearGradient>
          <linearGradient id={id("a")} x1="0" y1="0" x2="1" y2="0.35">
            {stop(0, "--lg-a1")}
            {stop(0.5, "--lg-a2")}
            {stop(1, "--lg-a3")}
          </linearGradient>
          <linearGradient id={id("b")} x1="0" y1="0" x2="1" y2="0.35">
            {stop(0, "--lg-b1")}
            {stop(0.5, "--lg-b2")}
            {stop(1, "--lg-b3")}
          </linearGradient>
          <linearGradient id={id("ab")} x1="0" y1="0" x2="1" y2="0.35">
            {stop(0, "--lg-ab1")}
            {stop(1, "--lg-ab2")}
          </linearGradient>
          <linearGradient id={id("bb")} x1="0" y1="0" x2="1" y2="0.35">
            {stop(0, "--lg-bb1")}
            {stop(1, "--lg-bb2")}
          </linearGradient>
          <radialGradient id={id("sphere")}>
            <stop offset="0" stopColor="#182341" />
            <stop offset="0.72" stopColor="#080c18" />
            <stop offset="1" stopColor="#05070f" />
          </radialGradient>
          <radialGradient id={id("glow")}>
            <stop offset="0.6" style={{ stopColor: "var(--lg-glow)" }} />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* D */}
        <path
          className="dn-d"
          d={D_PATH}
          fill="none"
          stroke={url("d")}
          strokeWidth={24}
          strokeLinejoin="round"
        />

        {/* N: astas en el azul de la D, diagonal en el dorado del anillo */}
        <path
          className="dn-n"
          d={`M ${N_L} ${B} L ${N_L} ${T} M ${N_R} ${T} L ${N_R} ${B}`}
          fill="none"
          stroke={url("d")}
          strokeWidth={24}
          strokeLinecap="round"
        />
        <path
          className="dn-n"
          d={`M ${N_L} ${T} L ${N_R} ${B}`}
          fill="none"
          stroke={url("a")}
          strokeWidth={24}
          strokeLinecap="round"
        />
        {[
          [N_L, T, "--lg-hot"],
          [N_R, B, "--lg-hot"],
          [N_L, B, "--lg-photon"],
          [N_R, T, "--lg-photon"],
        ].map(([x, y, c]) => (
          <circle
            key={`${x}-${y}`}
            className="dn-node"
            cx={x}
            cy={y}
            r={21}
            style={{ fill: "var(--lg-node)", stroke: `var(${c})` }}
            strokeWidth={9}
          />
        ))}

        {/* Anillos, mitad trasera */}
        <g className="dn-ring">
          <g transform={`translate(${CX} ${CY}) rotate(-36)`}>
            <path d={RING_BACK} fill={url("ab")} />
          </g>
          <g transform={`translate(${CX} ${CY}) rotate(36)`}>
            <path d={RING_BACK} fill={url("bb")} />
          </g>
        </g>

        {/* Esfera: la O de Dox */}
        <g className="dn-sphere">
          <circle cx={CX} cy={CY} r={168} fill={url("glow")} />
          <circle cx={CX} cy={CY} r={112} fill={url("sphere")} />
          <circle
            cx={CX}
            cy={CY}
            r={127}
            fill="none"
            style={{ stroke: "var(--lg-photon)" }}
            strokeWidth={6}
            opacity={0.9}
          />
          <path
            d="M 399.67 498.74 A 127 127 0 0 0 600.33 498.74"
            fill="none"
            style={{ stroke: "var(--lg-hot)" }}
            strokeWidth={8}
            strokeLinecap="round"
            opacity={0.9}
          />
        </g>

        {/* Anillos, mitad delantera */}
        <g className="dn-ring">
          <g transform={`translate(${CX} ${CY}) rotate(-36)`}>
            <path d={RING_FRONT} fill={url("a")} />
          </g>
          <g transform={`translate(${CX} ${CY}) rotate(36)`}>
            <path d={RING_FRONT} fill={url("b")} />
          </g>
        </g>
      </svg>
    );
  }
);
