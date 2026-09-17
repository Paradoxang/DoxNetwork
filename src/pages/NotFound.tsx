import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { LineIcon } from "@/components/CategoryIcon";
import { Seo } from "@/components/Seo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { lineaOrder, lineas } from "@/data/lineas";
import { site, waLink } from "@/data/site";
import { useUI } from "@/lib/ui";

/**
 * 404. Se prerenderiza como dist/404.html y Vercel la sirve en cualquier ruta
 * que no exista. En vez de un callejón sin salida, ofrece buscar, ir a cada
 * línea de la red o escribir por WhatsApp.
 */
export function NotFound() {
  const { openSearch } = useUI();

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-[1200px] flex-col items-center justify-center px-4 pb-20 pt-28 text-center md:px-6">
      <Seo title={`Página no encontrada · ${site.name}`} description="Esta página no existe o cambió de lugar." path="/404" noindex />
      <Astro pose="404" eager className="h-56 md:h-72" />
      <p className="kicker mt-8">Error 404</p>
      <h1 className="display mt-3 text-[clamp(30px,5vw,48px)]">Esto se salió de órbita</h1>
      <p className="mt-3 max-w-md text-mute">La página que buscas no existe o cambió de lugar. Busca lo que necesitas o sigue por alguna de estas rutas.</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn btn-primary" onClick={() => openSearch()}>
          <Search className="h-4 w-4" /> Buscar en la tienda
        </button>
        <Link to="/" className="btn btn-ghost">
          Ir al inicio
        </Link>
      </div>

      <ul className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
        {lineaOrder.map((id) => (
          <li key={id}>
            <Link to={lineas[id].path} className="card card-hover group flex h-full flex-col items-center gap-2 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${lineas[id].hue}22`, color: lineas[id].hue }}>
                <LineIcon id={id} />
              </span>
              <span className="font-bold">{lineas[id].name}</span>
              <ArrowRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>

      <a
        href={waLink(`Hola ${site.name}, llegué a una página que no existe. Estaba buscando:`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-mint hover:underline"
      >
        <WhatsAppIcon className="h-4 w-4" /> ¿No lo encuentras? Escríbenos
      </a>
    </section>
  );
}
