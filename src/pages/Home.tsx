import { Seo } from "@/components/Seo";
import { site } from "@/data/site";
import { Benefits } from "@/sections/Benefits";
import { Categories } from "@/sections/Categories";
import { Cta } from "@/sections/Cta";
import { Faq, faqs } from "@/sections/Faq";
import { Featured } from "@/sections/Featured";
import { Hero } from "@/sections/Hero";
import { HowItWorks } from "@/sections/HowItWorks";

export function Home() {
  return (
    <>
      <Seo
        title={`${site.name} · ${site.tagline}`}
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
      <Featured />
      <HowItWorks />
      <Faq />
      <Cta />
    </>
  );
}
