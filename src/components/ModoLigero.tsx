import { Gauge } from "lucide-react";
import { useEffect, useState } from "react";
import { alCambiarModo, aplicarModo, modoActual } from "@/lib/perf";

/**
 * Interruptor del modo ligero, en el pie.
 *
 * La detección automática acierta casi siempre, pero no siempre: hay equipos
 * que se declaran modestos y van bien, y otros que rinden mal por temperatura o
 * por tener veinte pestañas abiertas. Este botón deja la última palabra a quien
 * está mirando la página, y la decisión se recuerda en este navegador.
 */
export function ModoLigero() {
  const [ligero, setLigero] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setLigero(modoActual() === "ligero");
    setMontado(true);
    return alCambiarModo((m) => setLigero(m === "ligero"));
  }, []);

  // En el prerender no se sabe el modo: se pinta al hidratar para no mentir
  if (!montado) return null;

  return (
    <button
      type="button"
      onClick={() => aplicarModo(ligero ? "completo" : "ligero", true)}
      aria-pressed={ligero}
      className="flex items-center gap-2 text-left text-mute transition-colors hover:text-ink"
      title={
        ligero
          ? "Activa los fondos y el movimiento completos"
          : "Apaga fondos, desenfoques y movimiento para que la página vaya más suelta"
      }
    >
      <Gauge className="h-4 w-4" aria-hidden="true" />
      Modo ligero: <span className="font-semibold text-ink">{ligero ? "activado" : "desactivado"}</span>
    </button>
  );
}
