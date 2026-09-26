import { ArrowRight, MessageCircle, Search, SprayCan, Truck, Wallet } from "lucide-react";
import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { Deco } from "@/components/Deco";
import { lineaMascotas } from "@/data/comedero";
import { DOX_PATH } from "@/data/dox";
import { lineas } from "@/data/lineas";
import { useAnimacion } from "@/lib/motion";
import { useUI } from "@/lib/ui";

/**
 * Las líneas alrededor de ASTRO, perfumería arriba y en el sentido del reloj.
 * Vapes no va: la Ley 2354 no deja promocionarlos, y la apertura es la
 * vitrina más visible de la tienda.
 */
const orbita: { name: string; to: string; acento: string; img: string; w: number; h: number; recorte?: CSSProperties }[] = [
  { name: "Perfumería", to: lineas.perfumeria.path, acento: lineas.perfumeria.hue, img: "/astro/astro-chibi-perfume-sm.webp", w: 301, h: 360 },
  { name: "Relojería", to: lineas.relojeria.path, acento: lineas.relojeria.hue, img: "/astro/astro-chibi-reloj-sm.webp", w: 366, h: 360 },
  { name: "Tecnología", to: lineas.tecnologia.path, acento: lineas.tecnologia.hue, img: "/astro/astro-chibi-audifonos-sm.webp", w: 308, h: 360 },
  {
    name: "Mascotas",
    to: lineaMascotas.path,
    acento: lineaMascotas.hue,
    img: "/inicio/burbuja-comedero.webp",
    w: 360,
    h: 228,
    // Es ancho: sin esto los extremos se salen del círculo
    recorte: { width: "84%", height: "84%", objectPosition: "center 70%" },
  },
  { name: "Páginas web", to: DOX_PATH, acento: "#9aa9ff", img: "/astro/astro-laptop-sm.webp", w: 241, h: 360 },
];

/** Radio de la órbita, en % del lado. Las posiciones salen aquí y no con cos() en CSS: así se ven igual en el prerender. */
const RADIO = 37.5;
const posicion = (i: number, n: number): CSSProperties => {
  const a = ((360 / n) * i - 90) * (Math.PI / 180);
  return { left: `${(50 + RADIO * Math.cos(a)).toFixed(2)}%`, top: `${(50 + RADIO * Math.sin(a)).toFixed(2)}%` };
};

const datos = [
  { icon: Truck, color: "text-mint", text: "Envío gratis a toda Colombia" },
  { icon: Wallet, color: "text-neb", text: "Nequi o Llave Bre-B" },
  { icon: MessageCircle, color: "text-gold", text: "Te atiende una persona" },
];

/**
 * Apertura del inicio (v2, 25-sep-2026: docs/ENCARGO-ASTRO-inicio-v2.md).
 *
 * El fondo es una nebulosa pintada con degradados (`.nebulosa` en index.css):
 * nítida a cualquier tamaño y sin descarga. Antes era un WebGL en escritorio y
 * una foto de 760 px en el celular, que se pixelaba.
 *
 * La órbita reúne las líneas alrededor de ASTRO, con el agujero negro de la
 * marca de fondo, también en CSS. En el celular y la tableta va arriba, antes
 * del titular; en escritorio, a la derecha.
 *
 * El hero es espacio en los dos temas: va con data-theme="dark" para que los
 * tokens de color de su contenido sean siempre los oscuros, y el Nav hace lo
 * mismo mientras está encima. Abajo se funde con el fondo del tema activo.
 */
export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const [q, setQ] = useState("");
  const { openSearch } = useUI();

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    openSearch(q.trim());
  };

  /* Coreografía de entrada con GSAP:
     1. el titular sube palabra a palabra (SplitText con máscara por palabra),
     2. el texto, el buscador y los botones llegan escalonados,
     3. ASTRO aparece en el centro y las líneas brotan a su alrededor.
     Con movimiento reducido no se anima nada: el CSS ya lo deja visible. */
  useAnimacion(
    ({ gsap, SplitText }) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = scope.current!;
        const title = el.querySelector<HTMLElement>("[data-hero-title]")!;
        const split = SplitText.create(title, { type: "words", mask: "words" });
        // La máscara recorta al alto de línea y se comía los descendentes
        split.masks.forEach((m) => {
          (m as HTMLElement).style.paddingBottom = "0.18em";
          (m as HTMLElement).style.marginBottom = "-0.18em";
        });

        gsap.set(el.querySelectorAll("[data-intro]"), { autoAlpha: 1 });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(split.words, { yPercent: 110, duration: 1, stagger: 0.06 })
          .from(el.querySelectorAll("[data-hero-in]"), { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.7");

        gsap.from(el.querySelector("[data-hero-astro]"), { y: 40, scale: 0.9, autoAlpha: 0, duration: 1.2, delay: 0.2, ease: "power3.out" });
        gsap.from(el.querySelectorAll("[data-orbita-in]"), { scale: 0.4, autoAlpha: 0, duration: 0.7, stagger: 0.09, delay: 0.45, ease: "back.out(1.8)" });
        return () => split.revert();
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative isolate overflow-hidden">
      <div data-theme="dark" className="nebulosa relative">
        <Deco name="polvo" className="-bottom-10 left-0 z-[1] w-[70%] max-w-[900px]" opacity={0.35} pesado />

        <div
          data-intro
          className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-6 px-4 pb-16 pt-[118px] md:px-6 md:pt-[140px] lg:min-h-[min(100svh,880px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-12 lg:pb-24 lg:pt-[150px]"
        >
          {/* ── Órbita ── arriba en el celular, a la derecha en escritorio */}
          <nav aria-label="Líneas de la tienda" className="mx-auto w-[min(100%,330px)] md:w-[420px] lg:order-2 lg:w-full">
            <ul className="orbita">
              <li aria-hidden="true" className="orbita-disco" />
              <li aria-hidden="true" className="orbita-anillo" />
              <li aria-hidden="true" className="orbita-anillo orbita-anillo-2" />
              <li aria-hidden="true" data-hero-astro className="absolute left-1/2 top-1/2 w-[25%] -translate-x-1/2 -translate-y-[44%]">
                <Astro pose="saludo" small eager enter={false} decorative className="w-full" />
              </li>
              {orbita.map((o, i) => (
                <li key={o.name} className="orbita-item" style={{ ...posicion(i, orbita.length), ["--acento" as string]: o.acento }}>
                  <Link data-orbita-in to={o.to} className="orbita-link flex flex-col items-center">
                    <span className="orbita-burbuja" style={{ animationDelay: `${-i}s` }}>
                      <img src={o.img} alt="" width={o.w} height={o.h} loading="eager" decoding="async" draggable={false} style={o.recorte} />
                    </span>
                    <span className="orbita-etiqueta">{o.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Texto ── */}
          <div className="mx-auto w-full max-w-[600px] lg:order-1 lg:mx-0">
            <p className="kicker" data-hero-in>
              Dox Network · Perfumería y más
            </p>
            <h1 data-hero-title className="display mt-4 text-[clamp(38px,6.2vw,74px)] leading-[1] text-white lg:mt-5">
              Tu fragancia favorita, en una sola red.
            </h1>
            <p data-hero-in className="mt-5 max-w-xl text-[17px] leading-relaxed text-mute md:text-lg lg:mt-6">
              Perfumes 1.1 y AAA para ella, para él y unisex, además de relojería y tecnología.
            </p>

            <form data-hero-in onSubmit={onSearch} role="search" className="mt-7 flex max-w-xl gap-2">
              <label htmlFor="hero-q" className="sr-only">
                Buscar en la tienda
              </label>
              <div className="relative flex-1">
                {/* z-10: el backdrop-blur del campo lo pintaría encima */}
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-faint" />
                <input
                  id="hero-q"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Yara, Sauvage, un reloj, AirPods…"
                  className="field bg-white/[0.06] pl-11 backdrop-blur-md"
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="btn btn-ghost shrink-0 bg-white/[0.04]">
                Buscar
              </button>
            </form>

            {/* La línea foco va de botón; lo demás está en la órbita */}
            <div data-hero-in className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link to={lineas.perfumeria.path} className="btn btn-primary">
                <SprayCan className="h-[18px] w-[18px]" aria-hidden="true" /> Ver perfumería
              </Link>
              <Link to="/catalogo" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-neb hover:underline">
                Toda la tienda <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <ul data-hero-in className="mt-6 flex flex-wrap gap-2" aria-label="Así compras">
              {datos.map((d) => (
                <li
                  key={d.text}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[13px] text-mute backdrop-blur-md"
                >
                  <d.icon className={`h-4 w-4 ${d.color}`} aria-hidden="true" strokeWidth={2} />
                  {d.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fuera del alcance de data-theme: se funde con el fondo del tema activo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-b from-transparent to-bg [[data-theme=light]_&]:h-10" />
    </section>
  );
}
