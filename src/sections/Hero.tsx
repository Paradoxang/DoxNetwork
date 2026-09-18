import { ArrowRight, ArrowUpRight, Code2, Headphones, Search, Sparkles, SprayCan, Tv, Watch } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { Deco } from "@/components/Deco";
import { glowHandlers } from "@/components/ui/glowing-effect";
import { NumberTicker } from "@/components/ui/number-ticker";
import { products } from "@/data/catalog";
import { relojes, tecnologia } from "@/data/lineas";
import { perfumes } from "@/data/perfumeria";
import { useAnimacion } from "@/lib/motion";
import { alCambiarModo, modoActual } from "@/lib/perf";
import { useUI } from "@/lib/ui";

/* El agujero negro es lo más caro de la página: 900 líneas de WebGL y la
   compilación de sus shaders. Sale del paquete principal y entra cuando el
   navegador termina de hidratar, con el disco plano de CSS como relevo. */
const BlackHoleHeroSection = lazy(() =>
  import("@/components/ui/blackhole-hero-section").then((m) => ({ default: m.BlackHoleHeroSection }))
);

const count = (...cats: string[]) => products.filter((p) => cats.includes(p.category)).length;

/** Las líneas de la red. El orden va de lo que más se vende a lo más nuevo. */
const nodes = [
  {
    icon: Tv,
    title: "Streaming y TV",
    n: count("streaming", "cine-tv", "musica"),
    text: "plataformas y cine",
    to: "/catalogo?categoria=streaming",
  },
  {
    icon: Sparkles,
    title: "IA y software",
    text: "ChatGPT, Canva, Office",
    to: "/catalogo?categoria=ia",
  },
  {
    icon: SprayCan,
    title: "Perfumería",
    n: perfumes.length,
    text: "fragancias",
    to: "/perfumeria",
  },
  {
    icon: Watch,
    title: "Relojería",
    n: relojes.length,
    text: "originales y réplicas",
    to: "/relojeria",
    isNew: true,
  },
  {
    icon: Headphones,
    title: "Tecnología",
    n: tecnologia.length,
    text: "gadgets y accesorios",
    to: "/tecnologia",
    isNew: true,
  },
  {
    icon: Code2,
    title: "Páginas web",
    text: "A la medida, con Dox Designs",
    to: "/#dox-designs",
  },
];

/** Estrecho = el agujero negro va debajo del texto y no detrás. */
function useNarrow(query = "(max-width: 767px)") {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const sync = () => setNarrow(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, [query]);
  return narrow;
}

/**
 * Hero de la red. El fondo es un agujero negro renderizado en WebGL
 * (components/ui/blackhole-hero-section): la "red" que atrae todo lo que
 * vendemos, con el disco en el dorado y el azul nebulosa del isotipo.
 *
 * El hero es espacio en los dos temas: va con data-theme="dark" para que los
 * tokens de color de su contenido sean siempre los oscuros, y el Nav hace lo
 * mismo mientras está encima. Abajo se funde con el fondo del tema activo.
 *
 * Escritorio: el agujero a la derecha, velo a la izquierda bajo el texto.
 * Móvil: el texto arriba y el agujero en su propio bloque debajo, con menos
 * pasos por rayo porque el teléfono paga cada uno.
 */
export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const [q, setQ] = useState("");
  const { openSearch } = useUI();
  const narrow = useNarrow();
  const [ligero, setLigero] = useState(modoActual() === "ligero");
  const [listoParaShader, setListoParaShader] = useState(false);
  useEffect(() => alCambiarModo((m) => setLigero(m === "ligero")), []);
  /* En móvil no se monta el shader: compilarlo cuesta más de un segundo de
     hilo principal en un teléfono de gama media y, a 380 px, el agujero negro
     se lee igual pintado con degradados. */
  // Tras hidratar: el shader espera a que el hilo principal respire
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 900));
    const id = idle(() => setListoParaShader(true));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    openSearch(q.trim());
  };

  /* Coreografía de entrada con GSAP:
     1. el titular sube palabra a palabra (SplitText con máscara por palabra),
     2. el texto y el buscador llegan escalonados,
     3. los nodos de la red se encienden uno a uno,
     4. ASTRO flota hacia el frente del agujero y aparece su globo.
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
          .from(el.querySelectorAll("[data-hero-in]"), { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.7")
          .from(el.querySelectorAll("[data-node]"), { y: 24, autoAlpha: 0, scale: 0.96, duration: 0.7, stagger: 0.09 }, "-=0.5");

        gsap.from(el.querySelector("[data-hero-astro]"), { y: 70, x: -30, rotate: -14, autoAlpha: 0, duration: 1.6, delay: 0.9, ease: "power3.out" });
        gsap.from(el.querySelector("[data-hero-bubble]"), { scale: 0, autoAlpha: 0, duration: 0.6, delay: 2, ease: "back.out(2)" });
        return () => split.revert();
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative isolate overflow-hidden">
      <div data-theme="dark" className="relative flex flex-col bg-[#05070d]">
        <Deco name="polvo" className="-bottom-10 left-0 z-[1] w-[70%] max-w-[900px]" opacity={0.35} pesado />
        {/* ── Texto ── */}
        <div data-intro className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pt-[132px] md:flex md:min-h-[min(100svh,880px)] md:items-center md:px-6 md:pb-24 md:pt-[150px]">
          <div className="max-w-[600px]">
            <p className="kicker" data-hero-in>
              Dox Network · Software Solutions
            </p>
            <h1 data-hero-title className="display mt-5 text-[clamp(40px,6.2vw,74px)] leading-[1] text-white">
              Todo lo que usas, en una sola red.
            </h1>
            <p data-hero-in className="mt-6 max-w-xl text-[17px] leading-relaxed text-mute md:text-lg">
              Streaming e IA, perfumería, relojería, tecnología y páginas web a la medida. Una sola tienda, envíos a toda
              Colombia, pagos locales y atención de personas por WhatsApp.
            </p>

            <form data-hero-in onSubmit={onSearch} role="search" className="mt-8 flex max-w-xl gap-2">
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
                  placeholder="Netflix, un perfume, un reloj, AirPods…"
                  className="field bg-white/[0.06] pl-11 backdrop-blur-md"
                  autoComplete="off"
                />
              </div>
                <button type="submit" className="btn btn-primary shrink-0">
                  Buscar
                </button>
            </form>

            {/* Los nodos de la red: una puerta por línea de negocio */}
            <ul className="mt-8 grid max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-3" aria-label="Explora la red">
              {nodes.map((n) => (
                <li key={n.title} data-node>
                  <Link
                    to={n.to}
                    {...glowHandlers}
                    className="glow-border group relative flex h-full flex-col items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-md transition-[border-color,background-color] duration-300 hover:border-white/25 hover:bg-white/[0.08] sm:p-3.5"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        n.isNew ? "bg-gold-soft text-gold group-hover:bg-gold group-hover:text-gold-ink" : "bg-neb-soft text-neb group-hover:bg-neb group-hover:text-neb-ink"
                      }`}
                    >
                      <n.icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-[14px] font-bold leading-tight text-white sm:text-[15px]">
                        {n.title}
                        {n.isNew && <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-label="Nuevo" />}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-mute">
                        {n.n !== undefined && <NumberTicker value={n.n} className="text-ink" />} {n.text}
                      </span>
                    </span>
                    <ArrowUpRight className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>

            <Link data-hero-in to="/catalogo" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-neb hover:underline md:hidden">
              Ver todo el catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ── Agujero negro ── En móvil es un bloque bajo el texto; desde md cubre todo el hero. */}
        <div className="relative -mt-6 h-[380px] md:absolute md:inset-0 md:mt-0 md:h-auto">
          {ligero || narrow || !listoParaShader ? (
            /* Sin WebGL: el agujero negro se pinta con degradados. Mismo
               encuadre, coste casi cero. Es el modo ligero y también el relevo
               mientras el shader carga. */
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#05070d]">
              <div className="hole-plano absolute right-[6%] top-1/2 aspect-[1/0.62] w-[86%] -translate-y-1/2 md:right-[12%] md:w-[58%]" />
            </div>
          ) : (
          <Suspense
            fallback={
              <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#05070d]">
                <div className="hole-plano absolute right-[6%] top-1/2 aspect-[1/0.62] w-[86%] -translate-y-1/2 md:right-[12%] md:w-[58%]" />
              </div>
            }
          >
          <BlackHoleHeroSection
            aria-hidden="true"
            focus={narrow ? [0.62, 0.4] : [0.74, 0.46]}
            scrim={narrow ? "none" : "left"}
            scrimStrength={0.85}
            distance={24}
            elevation={narrow ? -7 : -5.5}
            roll={-20}
            fov={narrow ? 50 : 42}
            glow={narrow ? 0.85 : 1}
            steps={narrow ? 180 : 300}
            resolution={narrow ? 0.6 : 0.7}
            hotColor="#FFF6E0"
            midColor="#F2B24F"
            coolColor="#3B4FC4"
            doppler={0.4}
            starBrightness={0.35}
            className="bg-[#05070d]"
          />
          </Suspense>
          )}
          {/* Móvil: el bloque se funde con el texto de arriba */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#05070d] to-transparent md:hidden" />

          {/* ASTRO flota frente al disco; su globo (anclado a él) abre el buscador */}
          <div
            data-hero-astro
            className="absolute bottom-[4%] left-[4%] z-10 h-[56%] md:bottom-[7%] md:left-[60%] md:h-[32%] lg:left-[59%] lg:h-[36%]"
          >
            <Astro pose="saludo" eager enter={false} decorative className="h-full" />
            <button
              type="button"
              data-hero-bubble
              onClick={() => openSearch()}
              className="absolute left-[74%] top-[40%] z-20 w-max max-w-[170px] origin-bottom-left md:left-[78%] md:top-[22%] md:max-w-[180px] rounded-2xl rounded-bl-sm border border-white/15 bg-[#0f1424]/85 px-3.5 py-2.5 text-left shadow-[0_18px_44px_rgba(3,6,15,0.5)] backdrop-blur-md transition-colors hover:border-neb"
            >
              <span className="block text-[13px] font-extrabold text-white sm:text-sm">¡Hola! Soy ASTRO</span>
              <span className="mt-0.5 block text-xs text-mute sm:text-[13px]">¿Qué buscas hoy en la red?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fuera del alcance de data-theme: se funde con el fondo del tema activo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-b from-transparent to-bg [[data-theme=light]_&]:h-10" />
    </section>
  );
}
