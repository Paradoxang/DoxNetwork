import { ChapterNav } from "@/components/ChapterNav";
import { Deco } from "@/components/Deco";
import { MarqueeBand } from "@/components/MarqueeBand";
import { Seo } from "@/components/Seo";
import { site } from "@/data/site";
import { Benefits } from "@/sections/Benefits";
import { Categories } from "@/sections/Categories";
import { CombosSection } from "@/sections/CombosSection";
import { Cta } from "@/sections/Cta";
import { DoxDesigns } from "@/sections/DoxDesigns";
import { Faq, faqs } from "@/sections/Faq";
import { Guarantee } from "@/sections/Guarantee";
import { Hero } from "@/sections/Hero";
import { TiendaTeaser } from "@/sections/TiendaTeaser";
import { HowItWorks } from "@/sections/HowItWorks";
import { ProductTabs } from "@/sections/ProductTabs";
import { PromoCarousel } from "@/sections/PromoCarousel";
import { Reviews } from "@/sections/Reviews";

/**
 * Orden del inicio, cruzando los tres estudios:
 * propuesta de valor → confianza → promos → categorías → combos (el gancho
 * de ticket) → productos → cómo comprar → garantía → reseñas → objeciones.
 */
export function Home() {
  return (
    <>
      <Seo
        title="Dox Network Software Solutions"
        description={site.description}
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "OnlineStore", name: site.name, url: site.url, description: site.description },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />
      <Hero />
      <Benefits />
      <Categories />
      <PromoCarousel />
      <MarqueeBand />
      <CombosSection />
      <ProductTabs />
      {/* Cambio de mundo: de lo digital a lo físico, con el cromo líquido a sangre */}
      <div aria-hidden="true" className="relative h-24 overflow-hidden md:h-36">
        <Deco name="vortice" className="left-1/2 top-1/2 w-[150vw] max-w-none -translate-x-1/2 -translate-y-1/2" opacity={0.4} fade />
      </div>
      <TiendaTeaser />
      <HowItWorks />
      <Guarantee />
      <DoxDesigns />
      <Reviews />
      <Faq />
      <Cta />
      <ChapterNav />
    </>
  );
}
