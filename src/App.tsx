import { motion, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { MobileCartBar } from "@/components/MobileCartBar";
import { Nav } from "@/components/Nav";
import { PromoPeek } from "@/components/PromoPeek";
import { SearchPalette } from "@/components/SearchPalette";
import { Toast } from "@/components/Toast";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { allProducts } from "@/data/catalog";
import { site, waLink } from "@/data/site";
import { EASE, scrollToTarget, useLenis } from "@/lib/anim";
import { CartProvider, useCart } from "@/lib/cart";
import { UIProvider } from "@/lib/ui";
import { Catalog } from "@/pages/Catalog";
import { Coleccion } from "@/pages/Coleccion";
import { ComboBuilder } from "@/pages/ComboBuilder";
import { Favorites } from "@/pages/Favorites";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { Perfumeria } from "@/pages/Perfumeria";
import { Product } from "@/pages/Product";
import { Legal } from "@/pages/Legal";

function Layout() {
  return (
    <CartProvider>
      <UIProvider>
        <Shell />
      </UIProvider>
    </CartProvider>
  );
}

function Shell() {
  useLenis();
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const { count } = useCart();
  const firstRender = useRef(true);
  const [waHref, setWaHref] = useState(waLink(`Hola ${site.name}, tengo una pregunta.`));

  useEffect(() => {
    firstRender.current = false;
  }, []);

  // Al ancla si hay hash; arriba si cambia la ruta (no al cambiar filtros)
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector<HTMLElement>(location.hash);
      if (el) {
        const t = window.setTimeout(() => scrollToTarget(el), 120);
        return () => window.clearTimeout(t);
      }
    }
    scrollToTarget(0, { immediate: true });
  }, [location.pathname, location.hash]);

  // Burbuja de WhatsApp con contexto: en una ficha, el mensaje ya lleva el producto y su enlace
  useEffect(() => {
    const m = location.pathname.match(/^\/producto\/([^/]+)/);
    const p = m && allProducts.find((x) => x.slug === m[1]);
    setWaHref(
      waLink(
        p
          ? `Hola ${site.name}, tengo una pregunta sobre ${p.name}.\n${site.url}${location.pathname}`
          : `Hola ${site.name}, tengo una pregunta.`
      )
    );
  }, [location.pathname]);

  const barUp = count > 0 && location.pathname !== "/arma-tu-combo";

  return (
    <div className="relative min-h-screen bg-bg font-sans text-ink">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-neb focus:px-4 focus:py-2 focus:text-neb-ink"
      >
        Saltar al contenido
      </a>

      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-neb"
        style={{ scaleX: scrollYProgress }}
      />
      <div aria-hidden="true" className="ambient pointer-events-none fixed inset-0 z-0" />

      <Nav />

      <motion.main
        id="contenido"
        key={location.pathname}
        className="relative z-10"
        initial={firstRender.current ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <Outlet />
      </motion.main>

      <div className={`relative z-10 ${barUp ? "pb-[76px] md:pb-0" : ""}`}>
        <Footer />
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className={`fixed right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-mint text-mint-ink shadow-[var(--shadow)] transition-[transform,bottom] duration-300 hover:scale-105 ${
          barUp ? "bottom-[92px] md:bottom-5" : "bottom-5"
        } ${location.pathname === "/arma-tu-combo" ? "max-lg:hidden" : ""}`}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>

      {location.pathname !== "/arma-tu-combo" && <MobileCartBar />}
      <PromoPeek />
      <Toast />
      <CartDrawer />
      <SearchPalette />
    </div>
  );
}

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "catalogo", element: <Catalog /> },
      {
        path: "producto/:slug",
        element: <Product />,
        getStaticPaths: () => allProducts.map((p) => `producto/${p.slug}`),
      },
      { path: "perfumeria", element: <Perfumeria /> },
      { path: "relojeria", element: <Coleccion linea="relojeria" /> },
      { path: "tecnologia", element: <Coleccion linea="tecnologia" /> },
      { path: "vapes", element: <Coleccion linea="vapes" /> },
      { path: "arma-tu-combo", element: <ComboBuilder /> },
      { path: "favoritos", element: <Favorites /> },
      { path: "terminos", element: <Legal slug="terminos" /> },
      { path: "privacidad", element: <Legal slug="privacidad" /> },
      { path: "envios", element: <Legal slug="envios" /> },
      { path: "cambios-y-garantias", element: <Legal slug="cambios-y-garantias" /> },
      // Se prerenderiza como dist/404.html: Vercel la sirve sola en rutas inexistentes
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
