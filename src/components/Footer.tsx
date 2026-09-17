import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "@/data/catalog";
import { site, waLink } from "@/data/site";
import { LogoDN } from "@/components/LogoDN";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

/* Constante y no new Date(): el HTML prerenderizado llevaría el año del build
   y la hidratación avisaría de la diferencia. Se actualiza a mano cada año. */
const ANIO = 2026;

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div className="max-w-sm">
          <Link to="/" className="flex items-center gap-2.5" aria-label="DoxNetwork, inicio">
            <LogoDN className="h-9 w-auto" />
            <span className="font-display text-[19px] tracking-[0.08em]">
              DOX<span className="text-neb">NETWORK</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-mute">{site.description}</p>
          <p className="mt-4 text-sm text-faint">
            Pagos: {site.payments.join(" · ")}
          </p>
        </div>

        <div>
          <p className="kicker">Categorías</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/catalogo?categoria=${c.id}`} className="text-mute transition-colors hover:text-neb">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="kicker">Contacto</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={waLink(`Hola ${site.name}, tengo una pregunta.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-mute transition-colors hover:text-mint"
              >
                <WhatsAppIcon className="h-4 w-4" /> {site.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-mute transition-colors hover:text-neb"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
            <li>
              <a
                href={waLink(`Hola ${site.name}, quiero información para revender.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mute transition-colors hover:text-neb"
              >
                Revendedores y por mayor
              </a>
            </li>
            <li>
              <Link to="/arma-tu-combo" className="text-mute transition-colors hover:text-neb">
                Arma tu combo
              </Link>
            </li>
            <li>
              <Link to="/#garantia" className="text-mute transition-colors hover:text-neb">
                Garantía
              </Link>
            </li>
            <li className="text-faint">{site.hours}</li>
            <li>
              <Link to="/terminos" className="text-mute transition-colors hover:text-neb">
                Términos y condiciones
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto max-w-[1200px] px-4 pb-6 text-xs leading-relaxed text-faint md:px-6">
        {site.name} no está afiliada ni patrocinada por las plataformas mencionadas. Los nombres y marcas pertenecen a
        sus respectivos dueños y se usan solo para identificar los productos.
      </p>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-faint sm:flex-row sm:text-left md:px-6">
          <p>© {ANIO} DoxNetwork · Todos los derechos reservados</p>
          <p>
            Diseñado y desarrollado por{" "}
            <a href={site.dox} target="_blank" rel="noopener noreferrer" className="text-mute hover:text-neb">
              Dox Designs
            </a>
            <span className="text-neb">*</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
