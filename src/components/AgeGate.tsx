import { motion, useReducedMotion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { vapeWarning } from "@/data/lineas";
import { EASE } from "@/lib/anim";

const KEY = "dn:mayor-de-edad";

type State = "cargando" | "preguntar" | "confirmado" | "rechazado";

/**
 * Verificación de mayoría de edad para la línea de vapes (Ley 2354 de 2024).
 *
 * El HTML prerenderizado y el primer render del cliente no muestran los
 * productos: solo después de montar se lee la confirmación guardada. Así
 * nada restringido queda visible sin pasar por aquí, ni siquiera sin JS.
 * La confirmación se recuerda en este navegador; "Soy menor" no se guarda.
 */
export function AgeGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>("cargando");
  const reduced = useReducedMotion();

  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(KEY) === "1";
    } catch {
      /* sin almacenamiento: se pregunta cada vez */
    }
    setState(ok ? "confirmado" : "preguntar");
  }, []);

  if (state === "confirmado") return <>{children}</>;

  const confirm = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* modo privado: vale solo para esta visita */
    }
    setState("confirmado");
  };

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-[1200px] items-center justify-center px-4 pb-20 pt-[140px] md:px-6">
      {state !== "cargando" && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="age-title"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="card w-full max-w-md p-7 text-center md:p-9"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft text-gold">
            <ShieldAlert className="h-7 w-7" />
          </span>
          {state === "rechazado" ? (
            <>
              <h1 id="age-title" className="display mt-5 text-[28px]">
                Esta sección no está disponible
              </h1>
              <p className="mt-3 leading-relaxed text-mute">Los productos de vapeo solo se venden a mayores de 18 años.</p>
              <Link to="/" className="btn btn-primary mt-7 w-full">
                Volver al inicio
              </Link>
            </>
          ) : (
            <>
              <p className="kicker mt-5">Solo mayores de 18 años</p>
              <h1 id="age-title" className="display mt-3 text-[28px]">
                ¿Eres mayor de edad?
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-mute">{vapeWarning}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="btn btn-primary flex-1" onClick={confirm}>
                  Sí, soy mayor de 18
                </button>
                <button type="button" className="btn btn-ghost flex-1" onClick={() => setState("rechazado")}>
                  No, soy menor
                </button>
              </div>
              <p className="mt-5 text-xs text-faint">
                Al continuar declaras que tienes 18 años o más. También te pediremos confirmarlo al hacer el pedido.
              </p>
            </>
          )}
        </motion.div>
      )}
    </section>
  );
}
