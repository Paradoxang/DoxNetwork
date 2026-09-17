import { useEffect } from "react";
import { Head } from "vite-react-ssg";
import { site } from "@/data/site";

/**
 * Head por página. Head (react-helmet-async) cubre el HTML prerenderizado; el
 * efecto garantiza que el título de la pestaña cambie también al navegar.
 */
export function Seo({
  title,
  description,
  path,
  jsonLd,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  jsonLd?: object;
  /** Páginas que no deben aparecer en buscadores (vapes: publicidad restringida). */
  noindex?: boolean;
}) {
  const url = site.url + path;
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Head>
  );
}
