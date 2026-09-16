import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SectionHeading } from "@/components/SectionHeading";
import { categories, products } from "@/data/catalog";
import { useBatchReveal } from "@/lib/useBatchReveal";

export function Categories() {
  const scope = useRef<HTMLElement>(null);
  useBatchReveal(scope);

  return (
    <section ref={scope} id="categorias" className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
      <SectionHeading kicker="01 · Categorías" title="Encuentra lo que necesitas">
        Todo organizado para que llegues rápido a lo tuyo.
      </SectionHeading>

      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {categories.map((c) => {
          const n = products.filter((p) => p.category === c.id).length;
          return (
            <li key={c.id} data-reveal>
              <Link
                to={`/catalogo?categoria=${c.id}`}
                className="card card-hover group flex h-full flex-col gap-4 p-4 md:p-5"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neb-soft text-neb transition-colors group-hover:bg-neb group-hover:text-neb-ink">
                    <CategoryIcon id={c.id} />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neb" />
                </div>
                <div>
                  <p className="font-bold leading-snug">{c.name}</p>
                  <p className="mt-1 hidden text-sm text-mute sm:block">{c.blurb}</p>
                  <p className="mt-1 text-xs font-semibold text-faint">
                    {n} {n === 1 ? "producto" : "productos"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
