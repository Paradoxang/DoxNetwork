import { Link } from "react-router-dom";
import { Astro } from "@/components/Astro";
import { Seo } from "@/components/Seo";
import { site } from "@/data/site";

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-[1200px] flex-col items-center justify-center px-4 pt-24 text-center">
      <Seo title={`Página no encontrada · ${site.name}`} description="Esta página no existe." path="/404" />
      <Astro pose="piensa" eager className="h-56 md:h-64" />
      <p className="kicker mt-8">Error 404</p>
      <h1 className="display mt-3 text-[clamp(30px,5vw,48px)]">Esto se salió de órbita</h1>
      <p className="mt-3 max-w-md text-mute">La página que buscas no existe o cambió de lugar.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">Ir al inicio</Link>
        <Link to="/catalogo" className="btn btn-ghost">Ver catálogo</Link>
      </div>
    </section>
  );
}
