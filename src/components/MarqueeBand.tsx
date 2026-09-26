import { Deco } from "@/components/Deco";

/**
 * Banda de promesas en marquesina (idea de VOID, que repite su "waitlist
 * subscribe /" a lo ancho). Aquí no repetimos una llamada a la acción sino lo
 * que el cliente quiere oír antes de comprar, que además es lo que más nos
 * diferencia de la competencia.
 *
 * Son marcas propias, no de terceros: nada de logos ajenos corriendo por la
 * página. El texto se duplica para que el bucle no tenga salto, y la copia de
 * atrás va oculta para los lectores de pantalla.
 */
const promesas = [
  "Perfumes 1.1 y AAA",
  "Envío gratis a toda Colombia",
  "Nequi o Llave Bre-B",
  "Te atiende una persona",
  "Sin registro ni tarjetas",
  "Pregunta por el stock secreto",
];

export function MarqueeBand() {
  const fila = (oculta: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {promesas.map((p) => (
        <li key={p} className="flex items-center gap-6 whitespace-nowrap px-6 font-mono text-[12px] uppercase tracking-[0.18em] text-mute">
          {p}
          <span className="text-neb" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Cómo compras en Dox Network" className="relative overflow-hidden border-y border-line bg-surface py-3.5">
      <Deco name="banda" className="left-1/2 top-1/2 w-[1400px] -translate-x-1/2 -translate-y-1/2" opacity={0.12} />
      <div className="relative flex w-max marquee">
        {fila(false)}
        {fila(true)}
      </div>
    </section>
  );
}
