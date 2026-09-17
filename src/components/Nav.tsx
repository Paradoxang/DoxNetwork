import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  HelpCircle,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CategoryIcon, LineIcon } from "@/components/CategoryIcon";
import { LogoDN } from "@/components/LogoDN";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { allProducts, bestDiscount, categories, fromPrice, products } from "@/data/catalog";
import { destacados } from "@/data/destacados";
import { lineaOf, lineaOrder, lineas, type LineaId } from "@/data/lineas";
import { formatCOP, site, waLink } from "@/data/site";
import { EASE, lockScroll } from "@/lib/anim";
import { useCart } from "@/lib/cart";
import { useUI } from "@/lib/ui";

type MenuId = "categorias" | "combos" | "ayuda";

const combos = products.filter((p) => p.category === "combos");
const countIn = (id: string) => products.filter((p) => p.category === id).length;
const lineCount = Object.fromEntries(lineaOrder.map((id) => [id, allProducts.filter((p) => lineaOf(p) === id).length])) as Record<LineaId, number>;

/**
 * Cabecera interactiva:
 *  · barra de anuncios rotativa,
 *  · menús desplegables con intención de hover (abre a los 70 ms, cierra a los
 *    180 ms) y también por clic y teclado; Esc cierra y devuelve el foco,
 *  · una píldora que sigue al puntero entre los items (layoutId),
 *  · se esconde al bajar y reaparece al subir,
 *  · en móvil, panel a pantalla completa con acordeones.
 */
export function Nav() {
  const location = useLocation();
  const reduced = useReducedMotion();
  const { count, favorites, setOpen: openCart } = useCart();
  const { setSearchOpen } = useUI();

  const [menu, setMenu] = useState<MenuId | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const openTimer = useRef<number>();
  const closeTimer = useRef<number>();
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});

  // Cabecera inteligente
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar todo al navegar
  useEffect(() => {
    setMenu(null);
    setMobile(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!mobile) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [mobile]);

  const closeMenu = useCallback((returnFocus = false) => {
    setMenu((m) => {
      if (returnFocus && m) triggers.current[m]?.focus();
      return null;
    });
  }, []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu(true);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, closeMenu]);

  const enter = (id: MenuId) => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setMenu(id), menu ? 0 : 70);
  };
  const leave = () => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 180);
  };

  const show = !hidden || Boolean(menu) || mobile;

  const trigger = (id: MenuId, label: string) => (
    <button
      ref={(el) => (triggers.current[id] = el)}
      type="button"
      aria-expanded={menu === id}
      aria-controls={`menu-${id}`}
      onClick={() => setMenu((m) => (m === id ? null : id))}
      onPointerEnter={(e) => {
        setHover(id);
        if (e.pointerType === "mouse") enter(id);
      }}
      onPointerLeave={(e) => e.pointerType === "mouse" && leave()}
      className={`relative flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors ${
        menu === id ? "text-ink" : "text-mute hover:text-ink"
      }`}
    >
      {hover === id && <Pill reduced={reduced} />}
      <span className="relative">{label}</span>
      <ChevronDown className={`relative h-4 w-4 transition-transform duration-300 ${menu === id ? "rotate-180" : ""}`} />
    </button>
  );

  return (
    <>
    <motion.header
      // Sobre el hero del inicio (espacio oscuro en los dos temas) la cabecera usa los tokens oscuros
      data-theme={location.pathname === "/" && atTop && !menu && !mobile ? "dark" : undefined}
      className="fixed inset-x-0 top-0 z-50"
      initial={false}
      animate={{ y: show ? 0 : "-100%" }}
      transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
    >
      <AnimatePresence initial={false}>
        {atTop && !mobile && (
          <motion.div
            key="bar"
            initial={{ height: 0 }}
            animate={{ height: 36 }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <AnnouncementBar />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`border-b transition-[background-color,border-color] duration-300 ${
          atTop && !menu && !mobile ? "border-transparent" : "border-line bg-bg/90 backdrop-blur-md"
        }`}
        onPointerLeave={(e) => {
          setHover(null);
          if (e.pointerType === "mouse") leave();
        }}
      >
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4 md:px-6">
          <Link to="/" className="group flex min-w-0 shrink items-center gap-2 sm:gap-2.5" aria-label="DoxNetwork, inicio">
            <LogoDN className="h-8 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-9" />
            <span className="truncate font-display text-[15px] leading-none tracking-[0.06em] text-ink transition-colors group-hover:text-neb min-[400px]:text-[17px] sm:text-[19px] sm:tracking-[0.08em]">
              DOX<span className="text-neb">NETWORK</span>
            </span>
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Principal">
            {trigger("categorias", "Tienda")}
            {trigger("combos", "Combos")}
            {/* Una puerta por línea física; Ofertas y Arma tu combo viven en los paneles y en el menú móvil */}
            {(["perfumeria", "relojeria", "tecnologia"] as const).map((id) => (
              <Link
                key={id}
                to={lineas[id].path}
                onPointerEnter={() => {
                  setHover(id);
                  leave();
                }}
                className="relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-semibold text-mute transition-colors hover:text-ink xl:px-3.5"
              >
                {hover === id && <Pill reduced={reduced} />}
                <span className="relative">{lineas[id].name}</span>
                {id !== "perfumeria" && <span className="relative h-1.5 w-1.5 rounded-full bg-gold" aria-label="Nuevo" />}
              </Link>
            ))}
            {trigger("ayuda", "Ayuda")}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="icon-btn 2xl:w-auto 2xl:gap-2 2xl:px-3.5"
              aria-label="Buscar (Ctrl + K)"
            >
              <Search className="h-[18px] w-[18px]" />
              <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-sans text-[11px] text-faint 2xl:inline">Ctrl K</kbd>
            </button>
            <Link to="/favoritos" className="icon-btn relative hidden sm:inline-flex" aria-label={`Favoritos, ${favorites.length}`}>
              <Heart className="h-[18px] w-[18px]" />
              <CountBubble n={favorites.length} tone="neb" />
            </Link>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={() => openCart(true)}
              className="icon-btn relative"
              aria-label={`Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <CountBubble n={count} tone="mint" />
            </button>
            <button
              type="button"
              onClick={() => setMobile((v) => !v)}
              className="icon-btn lg:hidden"
              aria-label={mobile ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobile}
              aria-controls="menu-movil"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobile ? "x" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Panel de escritorio: un solo contenedor que cambia de alto al pasar de un menú a otro */}
        <AnimatePresence>
          {menu && (
            <motion.div
              key="panel"
              id={`menu-${menu}`}
              layout={!reduced}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.28, ease: EASE }}
              className="hidden border-t border-line lg:block"
              onPointerEnter={(e) => e.pointerType === "mouse" && window.clearTimeout(closeTimer.current)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={menu}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="mx-auto max-w-[1200px] px-6 py-6"
                >
                  {menu === "categorias" && <CategoriesPanel />}
                  {menu === "combos" && <CombosPanel />}
                  {menu === "ayuda" && <HelpPanel />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.header>

    {/* Hermanos del header y no hijos: el header se desplaza con transform y
        eso convertiría en relativos a él a los elementos fixed de dentro. */}
    <AnimatePresence>
      {menu && (
        <motion.div
          key="scrim"
          aria-hidden="true"
          className="fixed inset-0 z-40 hidden bg-[#060912]/35 lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMenu(null)}
        />
      )}
    </AnimatePresence>

    <MobileMenu open={mobile} onSearch={() => setSearchOpen(true)} />
    </>
  );
}

function Pill({ reduced }: { reduced: boolean | null }) {
  return (
    <motion.span
      layoutId={reduced ? undefined : "nav-pill"}
      className="absolute inset-0 rounded-full bg-surface"
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    />
  );
}

function CountBubble({ n, tone }: { n: number; tone: "mint" | "neb" }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-extrabold ${
            tone === "mint" ? "bg-mint text-mint-ink" : "bg-neb text-neb-ink"
          }`}
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ── Paneles ──

function CategoriesPanel() {
  const nuevos = [destacados.tecnologia[0], destacados.relojeria[0]].filter(Boolean);
  return (
    <div className="grid grid-cols-[1fr_280px] gap-6">
      <div>
        <p className="kicker">La red</p>
        <ul className="mt-4 grid grid-cols-2 gap-1.5 xl:grid-cols-4">
          {lineaOrder.map((id) => (
            <li key={id}>
              <Link to={lineas[id].path} className="group flex h-full items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-surface">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ background: `${lineas[id].hue}22`, color: lineas[id].hue }}
                >
                  <LineIcon id={id} />
                </span>
                <span>
                  <span className="block font-bold leading-snug">{lineas[id].name}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-mute">{lineas[id].blurb}</span>
                  <span className="mt-1 block text-xs font-semibold text-faint">{lineCount[id]} productos</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="kicker mt-5 border-t border-line pt-5 text-faint">Categorías digitales</p>
        <ul className="mt-3 grid grid-cols-2 gap-1 xl:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/catalogo?categoria=${c.id}`} className="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface">
                <CategoryIcon id={c.id} className="h-4 w-4 shrink-0 text-neb" />
                <span className="font-semibold group-hover:text-ink">{c.name}</span>
                <span className="ml-auto text-xs text-faint">{countIn(c.id)}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-sm">
          <Link to="/catalogo?ofertas=1" className="chip min-h-[34px] text-[13px]">Ofertas</Link>
          <Link to="/arma-tu-combo" className="chip min-h-[34px] text-[13px]">Arma tu combo</Link>
          <Link to="/#dox-designs" className="chip min-h-[34px] text-[13px]">Páginas web</Link>
          <Link to={lineas.vapes.path} className="chip min-h-[34px] text-[13px] text-faint">{lineas.vapes.name} · +18</Link>
          <Link to="/catalogo" className="ml-auto flex items-center gap-1.5 font-semibold text-neb hover:underline">
            Ver toda la tienda <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Link
        to="/tecnologia"
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-line p-5"
        style={{ background: `radial-gradient(120% 80% at 100% 0%, ${lineas.tecnologia.hue}33, transparent 60%), var(--surface)` }}
      >
        <span className="kicker">Nuevo en la red</span>
        <span className="mt-2 text-xl font-extrabold leading-tight">Relojería y tecnología</span>
        <span className="mt-1 text-sm text-mute">Con envío a toda Colombia.</span>
        <span className="mt-4 flex gap-2" aria-hidden="true">
          {nuevos.map((p) => (
            <img
              key={p.slug}
              src={p.image!.replace(/\.webp$/, "-sm.webp")}
              alt=""
              width={110}
              height={110}
              loading="lazy"
              className="aspect-square w-1/2 rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ))}
        </span>
        <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-neb">
          Ver lo nuevo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </div>
  );
}

function CombosPanel() {
  return (
    <div className="grid grid-cols-[1fr_280px] gap-6">
      <div>
        <p className="kicker">Combos con identidad</p>
        <ul className="mt-4 grid grid-cols-2 gap-1.5 xl:grid-cols-3">
          {combos.map((c) => (
            <li key={c.slug}>
              <Link to={`/producto/${c.slug}`} className="group flex h-full flex-col rounded-2xl p-3 transition-colors hover:bg-surface">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-bold group-hover:text-neb">{c.name}</span>
                  <span className="text-xs font-bold text-gold">-{bestDiscount(c)}%</span>
                </span>
                <span className="mt-0.5 text-[13px] text-mute">{c.tagline}</span>
                <span className="mt-1.5 text-sm font-extrabold">{formatCOP(fromPrice(c))}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Link
        to="/arma-tu-combo"
        className="group flex flex-col justify-between rounded-2xl border border-line bg-neb-soft p-5 transition-colors hover:border-neb"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neb text-neb-ink">
          <Sparkles className="h-5 w-5" />
        </span>
        <span>
          <span className="mt-6 block text-xl font-extrabold leading-tight">Arma tu propio combo</span>
          <span className="mt-1 block text-sm text-mute">Elige lo que quieras: 2 productos 5%, 3 productos 10%, 4 o más 15%.</span>
          <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-neb">
            Empezar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
    </div>
  );
}

function HelpPanel() {
  const items: { icon: ReactNode; title: string; text: string; to?: string; href?: string }[] = [
    { icon: <HelpCircle className="h-5 w-5" />, title: "Cómo comprar", text: "Tres pasos, todo por WhatsApp", to: "/#como-comprar" },
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Garantía", text: `Reponemos en menos de ${site.warrantyHours} h`, to: "/#garantia" },
    { icon: <MessageCircle className="h-5 w-5" />, title: "Preguntas frecuentes", text: "Pantalla, completa, pagos y más", to: "/#preguntas" },
    {
      icon: <Store className="h-5 w-5" />,
      title: "¿Quieres revender?",
      text: "Precios por volumen para distribuidores",
      href: waLink(`Hola ${site.name}, quiero información para revender.`),
    },
  ];
  return (
    <div className="grid grid-cols-[1fr_280px] gap-6">
      <ul className="grid grid-cols-2 gap-1.5">
        {items.map((it) => {
          const inner = (
            <>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neb-soft text-neb">{it.icon}</span>
              <span>
                <span className="block font-bold">{it.title}</span>
                <span className="block text-[13px] text-mute">{it.text}</span>
              </span>
            </>
          );
          const cls = "flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-surface";
          return (
            <li key={it.title}>
              {it.to ? (
                <Link to={it.to} className={cls}>{inner}</Link>
              ) : (
                <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              )}
            </li>
          );
        })}
      </ul>
      <a
        href={waLink(`Hola ${site.name}, necesito ayuda.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col justify-between rounded-2xl border border-line bg-mint-soft p-5 transition-colors hover:border-mint"
      >
        <WhatsAppIcon className="h-8 w-8 text-mint" />
        <span>
          <span className="mt-6 block text-lg font-extrabold">Habla con una persona</span>
          <span className="mt-1 block text-sm text-mute">{site.hours}</span>
        </span>
      </a>
    </div>
  );
}

// ── Menú móvil ──

function MobileMenu({ open, onSearch }: { open: boolean; onSearch: () => void }) {
  const [section, setSection] = useState<"red" | "cat" | "combos" | null>("red");
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-movil"
          data-lenis-prevent
          className="fixed inset-x-0 bottom-0 top-[72px] z-[45] overflow-y-auto border-t border-line bg-bg lg:hidden"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <div className="space-y-2 px-4 pb-10 pt-4">
            <button type="button" onClick={onSearch} className="field flex items-center gap-3 text-left text-faint">
              <Search className="h-[18px] w-[18px]" /> Buscar productos
            </button>

            <Accordion label="La red" open={section === "red"} onToggle={() => setSection((s) => (s === "red" ? null : "red"))}>
              <ul className="grid grid-cols-2 gap-2">
                {lineaOrder.map((id) => (
                  <li key={id}>
                    <Link to={lineas[id].path} className="flex min-h-[60px] items-center gap-2.5 rounded-xl bg-surface p-3 text-sm font-bold">
                      <span style={{ color: lineas[id].hue }}>
                        <LineIcon id={id} className="h-5 w-5 shrink-0" />
                      </span>
                      <span>
                        {lineas[id].name}
                        <span className="block text-xs font-semibold text-faint">{lineCount[id]} productos</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion label="Categorías digitales" open={section === "cat"} onToggle={() => setSection((s) => (s === "cat" ? null : "cat"))}>
              <ul className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link to={`/catalogo?categoria=${c.id}`} className="flex min-h-[52px] items-center gap-2.5 rounded-xl bg-surface p-3 text-sm font-semibold">
                      <CategoryIcon id={c.id} className="h-[18px] w-[18px] shrink-0 text-neb" />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion label="Combos" open={section === "combos"} onToggle={() => setSection((s) => (s === "combos" ? null : "combos"))}>
              <ul className="space-y-1">
                {combos.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/producto/${c.slug}`} className="flex min-h-[48px] items-center justify-between rounded-xl px-3 py-2 hover:bg-surface">
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-sm font-bold">{formatCOP(fromPrice(c))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>

            {[
              { to: "/catalogo", label: "Toda la tienda" },
              { to: lineas.vapes.path, label: `${lineas.vapes.name} · +18` },
              { to: "/catalogo?ofertas=1", label: "Ofertas" },
              { to: "/arma-tu-combo", label: "Arma tu combo" },
              { to: "/favoritos", label: "Favoritos" },
              { to: "/#garantia", label: "Garantía" },
              { to: "/#preguntas", label: "Preguntas frecuentes" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="flex min-h-[52px] items-center justify-between rounded-2xl px-4 text-base font-bold hover:bg-surface">
                {l.label} <ArrowRight className="h-4 w-4 text-faint" />
              </Link>
            ))}

            <div className="flex items-center justify-between rounded-2xl px-4 py-2">
              <span className="font-bold">Tema</span>
              <ThemeToggle />
            </div>

            <a href={waLink(`Hola ${site.name}, necesito ayuda.`)} target="_blank" rel="noopener noreferrer" className="btn btn-buy mt-4 w-full">
              <WhatsAppIcon /> Hablar por WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Accordion({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-h-[52px] w-full items-center justify-between px-4 text-base font-bold">
        {label}
        <ChevronDown className={`h-5 w-5 text-faint transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
