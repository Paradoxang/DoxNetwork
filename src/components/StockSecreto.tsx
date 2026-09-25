import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { stockSecreto } from "@/data/perfumeria";
import { waLink } from "@/data/site";
import { EASE } from "@/lib/anim";
import { useCart } from "@/lib/cart";

const KEY = "dn:stock-secreto";
const href = waLink(stockSecreto.mensaje);

/**
 * El "stock secreto" de perfumería: a los pocos segundos en /perfumeria salta
 * una tarjeta en la esquina que invita a preguntar por WhatsApp por la
 * fragancia que no está en la vitrina. Al cerrarla queda una píldora pequeña,
 * así sigue a mano sin tapar los perfumes (y se recuerda en esta pestaña).
 *
 * Vive en el layout y no en la página: el <main> se anima con transform y un
 * `position: fixed` dentro de él dejaría de anclarse a la pantalla.
 */
export function StockSecreto() {
  const { pathname } = useLocation();
  const { count, open } = useCart();
  const enPerfumeria = pathname === "/perfumeria";
  const [lista, setLista] = useState(false);
  const [plegada, setPlegada] = useState(false);

  useEffect(() => {
    if (!enPerfumeria) return setLista(false);
    try {
      if (sessionStorage.getItem(KEY) === "plegada") setPlegada(true);
    } catch {
      /* sin almacenamiento: vuelve a salir la tarjeta */
    }
    const t = window.setTimeout(() => setLista(true), 5000);
    return () => window.clearTimeout(t);
  }, [enPerfumeria]);

  const plegar = () => {
    setPlegada(true);
    try {
      sessionStorage.setItem(KEY, "plegada");
    } catch {
      /* modo privado */
    }
  };

  // Misma fila que el botón flotante de WhatsApp (sube con la barra del carrito en móvil). En escritorio
  // va a su izquierda: a la izquierda de la pantalla taparía los filtros de la barra lateral.
  const abajo = count > 0 ? "bottom-[92px] md:bottom-5" : "bottom-5";
  const visible = enPerfumeria && !open;

  return (
    <AnimatePresence>
      {visible && lista && !plegada && (
        <motion.aside
          key="tarjeta"
          aria-label="Stock secreto"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
          transition={{ duration: 0.45, ease: EASE }}
          className={`fixed left-4 right-[88px] z-[56] rounded-2xl border border-line-strong bg-surface/95 p-3 shadow-[var(--shadow)] backdrop-blur-xl md:left-auto md:right-[92px] md:w-[360px] ${abajo}`}
        >
          <div className="flex items-start gap-3">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gold-soft">
              <Astro pose="perfume" small enter={false} float={false} decorative className="absolute inset-x-0 -top-1 mx-auto h-16" />
            </span>
            <span className="min-w-0 flex-1 pt-0.5">
              <span className="block text-sm font-bold leading-snug">{stockSecreto.titulo}</span>
              <span className="mt-0.5 block text-sm text-mute">{stockSecreto.texto}</span>
            </span>
            <button
              type="button"
              onClick={plegar}
              className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-faint hover:text-ink"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <a href={href} target="_blank" rel="noopener noreferrer" onClick={plegar} className="btn btn-buy mt-3 w-full">
            <WhatsAppIcon className="h-[18px] w-[18px]" /> Preguntar por WhatsApp
          </a>
        </motion.aside>
      )}
      {visible && plegada && (
        <motion.a
          key="pildora"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35, ease: EASE }}
          className={`fixed left-4 z-[56] mb-1 flex h-12 items-center gap-2 rounded-full border border-line-strong bg-surface/95 pl-3 pr-4 text-sm font-semibold shadow-[var(--shadow)] backdrop-blur-xl transition-colors hover:border-neb md:left-auto md:right-[92px] ${abajo}`}
          aria-label="Preguntar por el stock secreto por WhatsApp"
        >
          <WhatsAppIcon className="h-[18px] w-[18px] text-mint" /> Stock secreto 😉
        </motion.a>
      )}
    </AnimatePresence>
  );
}
