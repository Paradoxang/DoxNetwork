import { ArrowRight, Check, Search } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoDN } from "@/components/LogoDN";
import { minPrice } from "@/data/catalog";
import { formatCOP, site } from "@/data/site";
import { Magnetic, Tilt } from "@/lib/anim";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const populares = [
  { label: "Netflix", to: "/producto/netflix" },
  { label: "Disney+", to: "/producto/disney-plus" },
  { label: "ChatGPT", to: "/producto/chatgpt" },
  { label: "Canva", to: "/producto/canva-pro" },
  { label: "Pines de cine", to: "/catalogo?categoria=cine-tv" },
];

export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/catalogo?q=${encodeURIComponent(q.trim())}` : "/catalogo");
  };

  /* Coreografía de entrada con GSAP:
     1. el titular sube palabra a palabra (SplitText con máscara por palabra:
        no depende de dónde corten las líneas, así da igual si Kenney aún no
        ha cargado cuando se parte el texto),
     2. el resto del texto y el buscador llegan escalonados,
     3. en paralelo el isotipo se dibuja: trazo de la D, trazo de la N, se
        enciende el halo de la N, aparecen el planeta y la luna, los anillos se
        abren desde el centro y los nodos de la red se encienden uno a uno.
     Con movimiento reducido no se anima nada: el CSS ya lo deja visible. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = scope.current!;
        const title = el.querySelector<HTMLElement>("[data-hero-title]")!;
        const split = SplitText.create(title, { type: "words", mask: "words" });
        // La máscara recorta al alto de línea (leading 1) y se comía los
        // descendentes: la "g" de "digital". Se le da aire por abajo y se
        // compensa con margen negativo para que el titular no crezca.
        split.masks.forEach((m) => {
          (m as HTMLElement).style.paddingBottom = "0.18em";
          (m as HTMLElement).style.marginBottom = "-0.18em";
        });

        gsap.set(el.querySelectorAll("[data-intro]"), { autoAlpha: 1 });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(split.words, { yPercent: 110, duration: 1, stagger: 0.06 })
          .from(el.querySelectorAll("[data-hero-in]"), { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.7");

        const logo = el.querySelector("[data-hero-logo]");
        if (logo) {
          const lt = gsap.timeline({ delay: 0.15 });
          lt.from(logo.querySelector(".dn-d"), { drawSVG: "0%", duration: 1.3, ease: "power2.inOut" })
            .from(logo.querySelectorAll(".dn-n"), { drawSVG: "0%", duration: 0.9, stagger: 0.25, ease: "power2.inOut" }, "-=0.9")
            .from(logo.querySelectorAll(".dn-n-fx"), { autoAlpha: 0, duration: 0.8, ease: "power1.out" }, "-=0.3")
            .from(logo.querySelector(".dn-sphere"), { scale: 0.4, autoAlpha: 0, svgOrigin: "500 420", duration: 0.9, ease: "back.out(1.6)" }, "-=1.3")
            .from(logo.querySelector(".dn-moon"), { scale: 0, autoAlpha: 0, svgOrigin: "910 420", duration: 0.8, ease: "back.out(2)" }, "-=0.5")
            .from(logo.querySelectorAll(".dn-ring"), { scale: 0.2, autoAlpha: 0, svgOrigin: "500 420", duration: 1.1, ease: "expo.out" }, "-=0.6")
            .from(logo.querySelectorAll(".dn-node"), { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.12, ease: "back.out(2.2)" }, "-=0.7");
        }
        return () => split.revert();
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative overflow-hidden pt-[148px] pb-16 md:pt-[172px] md:pb-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 md:px-6 lg:grid-cols-[1.15fr_1fr]">
        <div data-intro>
          <p className="kicker" data-hero-in>
            Tienda digital · Entrega por WhatsApp
          </p>
          <h1 data-hero-title className="display mt-5 text-[clamp(40px,6.4vw,72px)] leading-[1]">
            Todo lo digital, sin vueltas.
          </h1>
          <p data-hero-in className="mt-6 max-w-xl text-[17px] leading-relaxed text-mute md:text-lg">
            Streaming, música, IA, pines de cine, software y gaming desde {formatCOP(minPrice)}. Eliges, pagas y lo
            recibes en tu WhatsApp, con garantía durante toda la vigencia.
          </p>

          <form data-hero-in onSubmit={onSearch} role="search" className="mt-8 flex max-w-xl gap-2">
            <label htmlFor="hero-q" className="sr-only">
              Buscar productos
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-faint" />
              <input
                id="hero-q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="field pl-11"
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn btn-primary shrink-0">
              Buscar
            </button>
          </form>

          <div data-hero-in className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-faint">Lo más buscado:</span>
            {populares.map((p) => (
              <Link key={p.label} to={p.to} className="chip min-h-[34px] text-[13px]">
                {p.label}
              </Link>
            ))}
          </div>

          <div data-hero-in className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link to="/catalogo" className="btn btn-primary">
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Link to="/arma-tu-combo" className="btn btn-ghost">
              Arma tu combo
            </Link>
          </div>

          <ul data-hero-in className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mute">
            {[`Entrega en ~${site.deliveryMinutes} min`, `Garantía de ${site.warrantyHours} h`, "Sin cobros automáticos"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-mint" strokeWidth={2.5} /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div data-intro className="relative isolate mx-auto w-full max-w-[340px] lg:max-w-[520px]">
          <div
            aria-hidden="true"
            className="absolute inset-[8%] -z-10 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, var(--glow-a), transparent 70%)" }}
          />
          <Tilt>
            <div className="flota" data-hero-logo>
              <LogoDN title={site.name} className="h-auto w-full" />
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}
