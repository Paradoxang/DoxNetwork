import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "@/data/catalog";
import { legalDocs } from "@/data/legal";
import { lineaOrder, lineas } from "@/data/lineas";
import { site, waLink } from "@/data/site";
import { Astro } from "@/components/Astro";
import { Deco } from "@/components/Deco";
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
            <span className="font-brand text-[19px] tracking-[0.08em]">
              DOX<span className="text-neb">NETWORK</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-mute">{site.description}</p>
          <p className="mt-4 text-sm text-faint">
            Pagos: {site.payments.join(" · ")}
          </p>
          <div className="mt-6 flex items-end gap-3">
            <Astro pose="despedida" small decorative className="h-28" />
            <p className="mb-3 text-sm font-semibold text-mute">¡Gracias por pasar por la red!</p>
          </div>
        </div>

        <div>
          <p className="kicker">La red</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-1">
            {lineaOrder.map((id) => (
              <li key={id}>
                <Link to={lineas[id].path} className="font-semibold text-ink transition-colors hover:text-neb">
                  {lineas[id].name}
                </Link>
              </li>
            ))}
            <li>
              <Link to={lineas.vapes.path} className="text-mute transition-colors hover:text-neb">
                {lineas.vapes.name} · +18
              </Link>
            </li>
          </ul>
          <p className="kicker mt-8">Digital</p>
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
              <Link to="/#dox-designs" className="text-mute transition-colors hover:text-neb">
                ¿Quieres tu página web?
              </Link>
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
          </ul>
          <p className="kicker mt-8">Legal</p>
          <ul className="mt-4 space-y-2 text-sm">
            {legalDocs.map((d) => (
              <li key={d.slug}>
                <Link to={d.path} className="text-mute transition-colors hover:text-neb">
                  {d.title}
                </Link>
              </li>
            ))}
            <li>
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="text-mute transition-colors hover:text-neb">
                Superintendencia de Industria y Comercio
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto max-w-[1200px] px-4 pb-6 text-xs leading-relaxed text-faint md:px-6">
        {site.name} no está afiliada ni patrocinada por las plataformas mencionadas. Los nombres y marcas pertenecen a
        sus respectivos dueños y se usan solo para identificar los productos.
      </p>

      {/* Large Name Footer: la marca gigante cierra la página, con el segundo
          eco del agujero negro del hero detrás (brief de rediseño, fase 3) */}
      <div className="echo-section relative isolate overflow-hidden border-t border-line pt-10">
        <div
          aria-hidden="true"
          className="hole-echo pointer-events-none absolute -bottom-[38%] left-1/2 -z-10 w-[min(1500px,160vw)] -translate-x-1/2"
        />
        <Deco name="polvo" className="inset-x-0 top-0 w-full" opacity={0.3} />
        {/* SVG y no texto: así la palabra encaja exacta al ancho en cualquier pantalla */}
        <svg viewBox="0 0 1000 118" className="block w-full" role="img" aria-label="DoxNetwork">
          <defs>
            <linearGradient id="large-name-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="4%" stopColor="var(--ink)" stopOpacity="0.92" />
              <stop offset="100%" stopColor="var(--ink)" stopOpacity="0.12" />
            </linearGradient>
            {/* La palabra recorta la nebulosa: el universo se ve por dentro de las letras */}
            <mask id="large-name-mask">
              <text className="large-name" x="500" y="100" textAnchor="middle" textLength="984" lengthAdjust="spacingAndGlyphs" fill="#fff">
                DOXNETWORK
              </text>
            </mask>
          </defs>
          {/* Debajo, el degradado de siempre: si la imagen no carga, la palabra sigue ahí */}
          <text
            className="large-name"
            x="500"
            y="100"
            textAnchor="middle"
            textLength="984"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#large-name-fade)"
          >
            DOXNETWORK
          </text>
          <image
            href="/deco/nebulosa.webp"
            x="0"
            y="-30"
            width="1000"
            height="178"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#large-name-mask)"
            opacity="0.85"
            style={{ mixBlendMode: "screen" }}
          />
        </svg>
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 px-4 pb-20 pt-5 text-center text-xs text-faint sm:flex-row sm:pb-5 sm:text-left md:px-6">
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
