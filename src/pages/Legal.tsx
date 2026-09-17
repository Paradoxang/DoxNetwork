import { ArrowRight, FileText, Lock, RefreshCcw, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { legalDocs, legalUpdated, type LegalDoc } from "@/data/legal";
import { site, waLink } from "@/data/site";
import { Reveal } from "@/lib/anim";

const icons = { terminos: FileText, privacidad: Lock, envios: Truck, "cambios-y-garantias": RefreshCcw } as const;

/**
 * Plantilla de los documentos legales: pestañas entre documentos, resumen en
 * lenguaje claro, índice con anclas (fijo en escritorio) y secciones numeradas.
 */
export function Legal({ slug }: { slug: LegalDoc["slug"] }) {
  const doc = legalDocs.find((d) => d.slug === slug)!;

  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-24 pt-[140px] md:px-6 md:pt-[164px]">
      <Seo title={`${doc.title} · ${site.name}`} description={doc.description} path={doc.path} />

      <Reveal>
        <p className="kicker">Legal</p>
        <h1 className="display mt-3 max-w-3xl text-[clamp(32px,5vw,52px)]">{doc.title}</h1>
        <p className="mt-3 text-sm text-faint">Última actualización: {legalUpdated}</p>
      </Reveal>

      {/* Documentos */}
      <nav aria-label="Documentos legales" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {legalDocs.map((d) => {
          const Icon = icons[d.slug as keyof typeof icons] ?? FileText;
          const on = d.slug === doc.slug;
          return (
            <Link key={d.slug} to={d.path} aria-current={on ? "page" : undefined} className="chip shrink-0 whitespace-nowrap" aria-pressed={on}>
              <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.8} />
              {d.title}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Índice */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="kicker text-faint">En esta página</p>
          <ol className="mt-4 space-y-1 border-l border-line text-sm">
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-mute transition-colors hover:border-neb hover:text-ink">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <Reveal className="card p-5 md:p-6">
            <p className="font-bold">En pocas palabras</p>
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-mute">
              {doc.summary.map((s) => (
                <li key={s} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neb" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-10 space-y-10">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="text-xl font-extrabold tracking-tight">
                  <span className="mr-2 text-faint">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className="mt-3 space-y-3 leading-relaxed text-mute">
                  {s.body.map((b, j) =>
                    Array.isArray(b) ? (
                      <ul key={j} className="space-y-2 pl-1">
                        {b.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-faint" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={j}>{b}</p>
                    )
                  )}
                </div>
                {s.links && (
                  <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {s.links.map((l) => (
                      <Link key={l.to} to={l.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-neb hover:underline">
                        {l.label} <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </p>
                )}
              </section>
            ))}
          </div>

          <div className="card mt-14 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-bold">¿Tienes dudas sobre este documento?</p>
              <p className="mt-1 text-sm text-mute">Escríbenos y te respondemos en horario de atención.</p>
            </div>
            <a
              href={waLink(`Hola ${site.name}, tengo una pregunta sobre ${doc.title.toLowerCase()}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-buy"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" /> Escribir por WhatsApp
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
