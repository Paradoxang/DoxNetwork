import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SmartImage } from "@/components/SmartImage";
import { promos } from "@/data/promos";
import { EASE } from "@/lib/anim";
import { gsap, useGSAP } from "@/lib/gsap";

const DURATION = 6;

/**
 * Carrusel de promos. Framer lleva el cambio de slide (arrastre incluido) y
 * GSAP la barra de progreso de cada punto, que es la que marca el tiempo: al
 * completarse pasa al siguiente. Se pausa con hover, foco, pestaña oculta o
 * con el botón, y no avanza solo con movimiento reducido.
 */
export function PromoCarousel() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const reduced = useReducedMotion();
  const bar = useRef<HTMLSpanElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const paused = userPaused || hoverPaused || Boolean(reduced);

  const go = useCallback((next: number, d = 1) => {
    setState([(next + promos.length) % promos.length, d]);
  }, []);

  // La barra de progreso del slide activo es el reloj del carrusel
  useGSAP(
    () => {
      if (!bar.current) return;
      tween.current?.kill();
      tween.current = gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        { scaleX: 1, duration: DURATION, ease: "none", transformOrigin: "0 50%", onComplete: () => go(index + 1, 1) }
      );
      if (paused) tween.current.pause();
    },
    { dependencies: [index] }
  );

  useEffect(() => {
    if (!tween.current) return;
    if (paused) tween.current.pause();
    else tween.current.resume();
  }, [paused]);

  useEffect(() => {
    const onVis = () => setHoverPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1, 1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1, -1);
  };

  const p = promos[index];

  return (
    <section aria-roledescription="carrusel" aria-label="Promociones" className="mx-auto max-w-[1200px] px-4 pt-14 md:px-6 md:pt-20">
      <div
        className="relative overflow-hidden rounded-[28px] border border-line"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHoverPaused(true)}
        onPointerLeave={() => setHoverPaused(false)}
        onFocusCapture={() => setHoverPaused(true)}
        onBlurCapture={() => setHoverPaused(false)}
      >
        <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[64/27]">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={p.id}
              custom={dir}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              initial={reduced ? { opacity: 0 } : { x: `${dir * 100}%`, opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { x: `${-dir * 30}%`, opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${promos.length}: ${p.title}`}
            >
              {/* Fondo de respaldo de marca: se ve completo sin imagen */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(90% 120% at 85% 20%, ${p.hue}66, transparent 60%),
                    radial-gradient(70% 90% at 10% 110%, ${p.hue}33, transparent 60%), var(--surface)`,
                }}
              />
              <svg className="absolute right-[-10%] top-1/2 h-[140%] -translate-y-1/2 opacity-30" viewBox="0 0 600 600" aria-hidden="true">
                <ellipse cx="300" cy="300" rx="280" ry="70" fill="none" stroke={p.hue} strokeWidth="2" transform="rotate(-30 300 300)" />
                <ellipse cx="300" cy="300" rx="280" ry="70" fill="none" stroke="var(--gold)" strokeWidth="1.5" transform="rotate(30 300 300)" />
                <circle cx="300" cy="300" r="70" fill={p.hue} opacity="0.35" />
              </svg>
              {/* Dirección de arte: banner ~2,37:1 en escritorio (el contenedor usa esa misma proporción
                  para no recortar) y 4:5 en móvil. En tablet el banner se ancla a la derecha,
                  donde está el sujeto. */}
              <SmartImage src={p.image} eager={index === 0} className={`absolute inset-0 h-full w-full object-cover object-[80%_50%] ${p.imageMobile ? "hidden sm:block" : ""}`} />
              {p.imageMobile && <SmartImage src={p.imageMobile} eager={index === 0} className="absolute inset-0 h-full w-full object-cover sm:hidden" />}
              {/* Velo para que el texto se lea sobre cualquier imagen */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060912]/85 via-[#060912]/35 to-transparent sm:bg-gradient-to-r sm:from-[#060912]/80 sm:via-[#060912]/40" />

              <div className="relative flex h-full max-w-[560px] flex-col justify-end p-6 pb-20 sm:justify-center sm:p-10 lg:p-14">
                <p className="kicker text-[#c9d1ff]">{p.kicker}</p>
                <h2 className="mt-3 text-[clamp(26px,3.6vw,44px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white">{p.title}</h2>
                <p className="mt-3 max-w-md text-[15px] text-white/80 sm:text-base">{p.text}</p>
                <Link to={p.cta.to} className="btn btn-primary mt-6 self-start" draggable={false}>
                  {p.cta.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controles */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 p-4 sm:p-6">
          <div className="mr-auto hidden gap-2 sm:flex" role="tablist" aria-label="Elegir promoción">
            {promos.map((pr, i) => (
              <button
                key={pr.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={pr.title}
                onClick={() => go(i, i > index ? 1 : -1)}
                className="relative h-11 w-10"
              >
                <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                  {i === index && <span ref={bar} className="block h-full w-full origin-left scale-x-0 rounded-full bg-white" />}
                </span>
              </button>
            ))}
          </div>
          <span className="mr-auto text-sm font-semibold text-white/80 sm:hidden">
            {index + 1} / {promos.length}
          </span>
          {!reduced && (
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
              aria-label={userPaused ? "Reanudar carrusel" : "Pausar carrusel"}
            >
              {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => go(index - 1, -1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
            aria-label="Promoción anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1, 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
            aria-label="Siguiente promoción"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
