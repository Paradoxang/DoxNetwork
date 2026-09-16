import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { products } from "@/data/catalog";
import { useBatchReveal } from "@/lib/useBatchReveal";

export function Featured() {
  const scope = useRef<HTMLElement>(null);
  useBatchReveal(scope);
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section ref={scope} className="border-y border-line bg-bg-soft">
      <div className="mx-auto max-w-[1200px] px-4 py-20 md:px-6 md:py-24">
        <SectionHeading
          kicker="02 · Destacados"
          title="Lo que más se lleva"
          action={
            <Link to="/catalogo" className="btn btn-ghost self-start md:self-auto">
              Ver todo <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <li key={p.slug} data-reveal>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
