import { useEffect, useState } from "react";
import { scrollToTarget } from "@/lib/anim";

/**
 * Navegación por capítulos (idea de VOID): una píldora flotante que dice en qué
 * parte de la página vas y deja saltar a cualquier otra. El inicio ya numera
 * sus secciones (01 · La red, 02 · Combos…), así que esto solo hace visible
 * una estructura que ya existe.
 *
 * Solo en escritorio: en móvil la barra inferior ya está ocupada por el
 * carrito. Se esconde cuando aparece el pie, para no pisar los enlaces.
 */
const capitulos = [
  { id: "categorias", n: "01", label: "La red" },
  { id: "combos", n: "02", label: "Combos" },
  { id: "productos", n: "03", label: "Productos" },
  { id: "como-comprar", n: "04", label: "Cómo comprar" },
  { id: "garantia", n: "05", label: "Garantía" },
  { id: "preguntas", n: "06", label: "Preguntas" },
];

export function ChapterNav() {
  const [activo, setActivo] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [moviendo, setMoviendo] = useState(false);

  useEffect(() => {
    const secciones = capitulos.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!secciones.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActivo(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    secciones.forEach((el) => io.observe(el));

    // Aparece pasado el hero y desaparece al llegar al pie
    const pie = document.querySelector("footer");
    const io2 = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { rootMargin: "0px 0px -80% 0px" });
    if (pie) io2.observe(pie);

    // Mientras el dedo o la rueda se mueven, la píldora se aparta: tapaba
    // nombres de producto y titulares en las secciones que llegan hasta abajo.
    let quieto = 0;
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.8) setVisible(false);
      else {
        setMoviendo(true);
        window.clearTimeout(quieto);
        quieto = window.setTimeout(() => setMoviendo(false), 360);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      io2.disconnect();
      window.clearTimeout(quieto);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (activo) setVisible(true);
  }, [activo]);

  return (
    <nav
      aria-label="Secciones de esta página"
      className={`fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 rounded-full border border-line-strong bg-bg/80 p-1.5 shadow-[var(--shadow)] backdrop-blur-xl transition-opacity duration-300 lg:flex ${
        visible && !moviendo ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {capitulos.map((c) => {
        const on = activo === c.id;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-current={on ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(c.id);
              if (el) scrollToTarget(el);
            }}
            className={`flex min-h-[36px] items-center gap-2 rounded-full px-3 transition-colors ${
              on ? "bg-neb text-neb-ink" : "text-mute hover:text-ink"
            }`}
          >
            <span className="num text-[11px] font-semibold">{c.n}</span>
            <span className={`text-[13px] font-semibold ${on ? "" : "hidden xl:inline"}`}>{c.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
