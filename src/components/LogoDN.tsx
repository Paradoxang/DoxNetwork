import { forwardRef, useId } from "react";

/**
 * Isotipo DN en línea. Misma geometría que brand/gen_logo.py, pero los colores
 * salen de las variables --lg-* de index.css, así que cambia solo con el tema.
 *
 * La D lleva el planeta con sus dos anillos en X; la N es un tubo de luz grueso
 * (halo + cuerpo + brillo interior) con una luna ensartada en la diagonal, a la
 * misma altura que el planeta. Las piezas llevan clases `dn-*` para que GSAP
 * las coreografíe desde fuera (sections/Hero.tsx). Los ids de degradados y
 * filtros se derivan de useId, sin los dos puntos que rompen `url(#...)`.
 */

const CX = 500;
const CY = 420;
const D_PATH = "M 305 165 L 420 165 A 255.7 255.7 0 1 1 420 675 L 305 675 Z";
const N_L = 790;
const N_R = 1030;
const T = 165;
const B = 675;
const MX = (N_L + N_R) / 2;
const MY = (T + B) / 2;
const N_STEMS = `M ${N_L} ${B} L ${N_L} ${T} M ${N_R} ${T} L ${N_R} ${B}`;
const N_DIAG = `M ${N_L} ${T} L ${N_R} ${B}`;
const RING_BACK = "M -275 0 A 275 66 0 0 1 275 0 L 155 0 A 155 37.2 0 0 0 -155 0 Z";
const RING_FRONT = "M 275 0 A 275 66 0 0 1 -275 0 L -155 0 A 155 37.2 0 0 0 155 0 Z";

const stop = (offset: number, v: string) => <stop offset={offset} style={{ stopColor: `var(${v})` }} />;

export const LogoDN = forwardRef<SVGSVGElement, { className?: string; title?: string }>(function LogoDN(
  { className = "", title },
  ref
) {
  const u = useId().replace(/:/g, "");
  const id = (n: string) => `${n}-${u}`;
  const url = (n: string) => `url(#${id(n)})`;

  return (
    <svg
      ref={ref}
      viewBox="262 100 840 640"
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
        <linearGradient id={id("ns")} x1="0" y1="0" x2="0" y2="1">
          {stop(0, "--lg-ns1")}
          {stop(0.5, "--lg-ns2")}
          {stop(1, "--lg-ns3")}
        </linearGradient>
        <linearGradient id={id("nd")} x1="0" y1="0" x2="0.4" y2="1">
          {stop(0, "--lg-nd1")}
          {stop(0.45, "--lg-nd2")}
          {stop(1, "--lg-nd3")}
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
        <filter id={id("nglow")} x="-40%" y="-20%" width="180%" height="140%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {/* D */}
      <path className="dn-d" d={D_PATH} fill="none" stroke={url("d")} strokeWidth={32} strokeLinejoin="round" />

      {/* N · halo. La opacidad del tema va en el grupo de fuera y la animación
          en el de dentro: GSAP no sabe interpolar desde `var(--lg-nglow)`. */}
      <g style={{ opacity: "var(--lg-nglow)" }}>
        <g className="dn-n-fx" filter={url("nglow")}>
          <path d={N_STEMS} fill="none" style={{ stroke: "var(--lg-photon)" }} strokeWidth={66} strokeLinecap="round" />
          <path d={N_DIAG} fill="none" style={{ stroke: "var(--lg-hot)" }} strokeWidth={74} strokeLinecap="round" />
        </g>
      </g>
      {/* N · cuerpo */}
      <path className="dn-n" d={N_STEMS} fill="none" stroke={url("ns")} strokeWidth={50} strokeLinecap="round" />
      <path className="dn-n" d={N_DIAG} fill="none" stroke={url("nd")} strokeWidth={58} strokeLinecap="round" />
      {/* N · brillo interior, luz desde arriba a la izquierda */}
      <g className="dn-n-fx">
        <path d={N_STEMS} transform="translate(-11 0)" fill="none" style={{ stroke: "var(--lg-shine)" }} strokeWidth={9} strokeLinecap="round" opacity={0.5} />
        <path d={N_DIAG} transform="translate(-9 4.3)" fill="none" style={{ stroke: "var(--lg-shine-hot)" }} strokeWidth={10} strokeLinecap="round" opacity={0.55} />
      </g>

      {/* Luna ensartada en su anillo (misma inclinación que el anillo dorado de la D) */}
      <g className="dn-moon">
        <path d="M -94 0 A 94 20 0 0 1 94 0" transform={`translate(${MX} ${MY}) rotate(-36)`} fill="none" stroke={url("a")} strokeWidth={9} strokeLinecap="round" />
        <circle cx={MX} cy={MY} r={84} fill={url("glow")} />
        <circle cx={MX} cy={MY} r={50} fill={url("sphere")} />
        <circle cx={MX} cy={MY} r={58} fill="none" style={{ stroke: "var(--lg-photon)" }} strokeWidth={5} opacity={0.9} />
        <path
          d={`M ${MX - 46} ${MY + 35} A 58 58 0 0 0 ${MX + 46} ${MY + 35}`}
          fill="none"
          style={{ stroke: "var(--lg-hot)" }}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.9}
        />
        <path d="M 94 0 A 94 20 0 0 1 -94 0" transform={`translate(${MX} ${MY}) rotate(-36)`} fill="none" stroke={url("a")} strokeWidth={9} strokeLinecap="round" />
      </g>

      {/* Nodos de red */}
      {(
        [
          [N_L, T, "--lg-hot"],
          [N_R, B, "--lg-hot"],
          [N_L, B, "--lg-photon"],
          [N_R, T, "--lg-photon"],
        ] as const
      ).map(([x, y, c]) => (
        <circle key={`${x}-${y}`} className="dn-node" cx={x} cy={y} r={30} style={{ fill: "var(--lg-node)", stroke: `var(${c})` }} strokeWidth={10} />
      ))}

      {/* Anillos de la D, mitad trasera */}
      <g className="dn-ring">
        <g transform={`translate(${CX} ${CY}) rotate(-36)`}>
          <path d={RING_BACK} fill={url("ab")} />
        </g>
        <g transform={`translate(${CX} ${CY}) rotate(36)`}>
          <path d={RING_BACK} fill={url("bb")} />
        </g>
      </g>

      {/* Planeta: la O de Dox */}
      <g className="dn-sphere">
        <circle cx={CX} cy={CY} r={168} fill={url("glow")} />
        <circle cx={CX} cy={CY} r={112} fill={url("sphere")} />
        <circle cx={CX} cy={CY} r={127} fill="none" style={{ stroke: "var(--lg-photon)" }} strokeWidth={6} opacity={0.9} />
        <path
          d="M 399.67 498.74 A 127 127 0 0 0 600.33 498.74"
          fill="none"
          style={{ stroke: "var(--lg-hot)" }}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.9}
        />
      </g>

      {/* Anillos de la D, mitad delantera */}
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
});
