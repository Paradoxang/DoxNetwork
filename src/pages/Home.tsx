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
      <CombosSection />
      <ProductTabs />
      <TiendaTeaser />
      <HowItWorks />
      <Guarantee />
      <DoxDesigns />
      <Reviews />
      <Faq />
      <Cta />
    </>
  );
}
