import { motion, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Toast } from "@/components/Toast";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { products } from "@/data/catalog";
import { site, waLink } from "@/data/site";
import { EASE, scrollToTarget, useLenis } from "@/lib/anim";
import { CartProvider } from "@/lib/cart";
import { Catalog } from "@/pages/Catalog";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { Product } from "@/pages/Product";
import { Terms } from "@/pages/Terms";

function Layout() {
  useLenis();
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const firstRender = useRef(true);
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

  return (
    <CartProvider>
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

        <div className="relative z-10">
          <Footer />
        </div>

        <a
          href={waLink(`Hola ${site.name}, tengo una pregunta.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          className="fixed bottom-5 right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-mint text-mint-ink shadow-[var(--shadow)] transition-transform hover:scale-105"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>

        <Toast />
        <CartDrawer />
      </div>
    </CartProvider>
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
        getStaticPaths: () => products.map((p) => `producto/${p.slug}`),
      },
      { path: "terminos", element: <Terms /> },
      // Se prerenderiza como dist/404.html: Vercel la sirve sola en rutas inexistentes
      { path: "404", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
