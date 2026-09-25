import { ChapterNav } from "@/components/ChapterNav";
import { MarqueeBand } from "@/components/MarqueeBand";
import { Seo } from "@/components/Seo";
import { site } from "@/data/site";
import { Benefits } from "@/sections/Benefits";
import { Categories } from "@/sections/Categories";
import { Cta } from "@/sections/Cta";
import { DoxDesigns } from "@/sections/DoxDesigns";
import { Faq, faqs } from "@/sections/Faq";
import { Guarantee } from "@/sections/Guarantee";
import { Hero } from "@/sections/Hero";
import { HowItWorks } from "@/sections/HowItWorks";
import { PerfumeriaSection } from "@/sections/PerfumeriaSection";
import { ProductTabs } from "@/sections/ProductTabs";
import { PromoCarousel } from "@/sections/PromoCarousel";
import { Reviews } from "@/sections/Reviews";

/**
 * Orden del inicio, cruzando los tres estudios y con el foco en perfumería
 * desde que la tienda dejó lo digital (25-sep-2026):
 * propuesta de valor → confianza → líneas → promos → perfumería (donde
 * estaban los combos) → productos → cómo comprar → garantía → reseñas →
 * objeciones.
 */
export function Home() {
  return (
    <>
      <Seo
        title={`${site.name} · Perfumería, relojería y tecnología`}
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
      <PerfumeriaSection />
      <ProductTabs />
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
