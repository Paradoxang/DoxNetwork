import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Crown,
  Flame,
  Flower2,
  Gift,
  Heart,
  HelpCircle,
  Lock,
  Menu,
  MessageCircle,
  Moon,
  PawPrint,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tag,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Astro } from "@/components/Astro";
import { ServiceIcon } from "@/components/DoxIcon";
import { LineIcon } from "@/components/CategoryIcon";
import { LogoDN } from "@/components/LogoDN";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { allProducts, type Product } from "@/data/catalog";
import { destacados, microThumbOf } from "@/data/destacados";
import { lineaMascotas } from "@/data/comedero";
import { DOX_PATH, dox, doxProjects, doxServices } from "@/data/dox";
import { reportHours } from "@/data/legal";
import { lineaOf, lineaOrder, lineas, type LineaId } from "@/data/lineas";
import {
  families,
  matchesPara,
  paraOptions,
  perfumeMinPrice,
  perfumes,
  stockSecreto,
  type Family,
  type ParaFilter,
} from "@/data/perfumeria";
import { tint } from "@/data/paleta";
import { formatCOP, site, waLink } from "@/data/site";
import { EASE, lockScroll } from "@/lib/anim";
import { useCart } from "@/lib/cart";
import { useUI } from "@/lib/ui";

type MenuId = "categorias" | "perfumeria" | "web" | "ayuda";

/** Ofertas = perfumería de menor a mayor precio: el foco de la tienda. */
const OFERTAS = "/perfumeria?orden=menor";
const porPublico = (id: ParaFilter) => perfumes.filter((p) => matchesPara(p, id)).length;
/** Icono y tono de cada público en el menú de perfumería. */
const estiloPublico: Record<ParaFilter, { icon: LucideIcon; hue: string }> = {
  dama: { icon: Flower2, hue: "#ef8fb8" },
  hombre: { icon: Flame, hue: "#5fb8e8" },
  unisex: { icon: Moon, hue: "#c9a46a" },
  sets: { icon: Gift, hue: "#b48cff" },
};
/** Tres frascos por público: primero los destacados, luego el resto. */
const muestraDe = (id: ParaFilter): Product[] =>
  [...new Set([...destacados.perfumeria, ...perfumes])].filter((p) => matchesPara(p, id)).slice(0, 3);
const porFamilia = (f: Family) => perfumes.filter((p) => p.perfume!.family === f).length;
/** Las casas con más fragancias, para el menú de perfumería. */
const casas = Object.entries(
  perfumes.reduce<Record<string, number>>((acc, p) => {
    if (p.perfume!.brand) acc[p.perfume!.brand] = (acc[p.perfume!.brand] ?? 0) + 1;
    return acc;
  }, {})
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8);
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
      className={`relative flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[14px] xl:px-3.5 xl:text-[15px] font-semibold transition-colors ${
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
            <span className="truncate font-brand text-[15px] leading-none tracking-[0.06em] text-ink transition-colors group-hover:text-neb min-[400px]:text-[17px] sm:text-[19px] sm:tracking-[0.08em]">
              DOX<span className="text-neb">NETWORK</span>
            </span>
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Principal">
            {trigger("categorias", "Tienda")}
            {trigger("perfumeria", "Perfumería")}
            {/* Desde el 25-sep-2026 no hay combos: su lugar es la perfumería, y las ofertas van a ella */}
            <Link
              to={OFERTAS}
              onPointerEnter={() => {
                setHover("ofertas");
                leave();
              }}
              className="relative whitespace-nowrap rounded-full px-2.5 py-2 text-[14px] xl:px-3.5 xl:text-[15px] font-semibold text-mute transition-colors hover:text-ink"
            >
              {hover === "ofertas" && <Pill reduced={reduced} />}
              <span className="relative">Ofertas</span>
            </Link>
            {trigger("web", "Páginas web")}
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
                  {menu === "perfumeria" && <PerfumeriaPanel />}
                  {menu === "web" && <WebPanel />}
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
  const vitrina = destacados.perfumeria.slice(0, 2);
  return (
    <div className="grid grid-cols-[1fr_280px] gap-6">
      <div>
        <p className="kicker">La red</p>
        <ul className="mt-4 grid grid-cols-2 gap-1.5 xl:grid-cols-5">
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
          {/* Mascotas: un solo producto, contra entrega, fuera del catálogo */}
          <li>
            <Link to={lineaMascotas.path} className="group flex h-full items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-surface">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: `${lineaMascotas.hue}22`, color: lineaMascotas.hue }}
              >
                <PawPrint className="h-5 w-5" aria-hidden="true" strokeWidth={1.8} />
              </span>
              <span>
                <span className="block font-bold leading-snug">{lineaMascotas.name}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-mute">{lineaMascotas.blurb}</span>
                <span className="mt-1 block text-xs font-semibold text-faint">{lineaMascotas.count} producto</span>
              </span>
            </Link>
          </li>
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-sm">
          <Link to={OFERTAS} className="chip min-h-[34px] text-[13px]">Ofertas en perfumería</Link>
          <Link to={DOX_PATH} className="chip min-h-[34px] text-[13px]">Páginas web</Link>
          <Link to={lineas.vapes.path} className="chip min-h-[34px] text-[13px] text-faint">{lineas.vapes.name} · +18</Link>
          <Link to="/catalogo" className="ml-auto flex items-center gap-1.5 font-semibold text-neb hover:underline">
            Ver toda la tienda <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Link
        to="/perfumeria"
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-line p-5"
        style={{ background: `radial-gradient(120% 80% at 100% 0%, ${lineas.perfumeria.hue}33, transparent 60%), var(--surface)` }}
      >
        <span className="kicker">Lo más pedido</span>
        <span className="mt-2 text-xl font-extrabold leading-tight">Perfumería 1.1 y AAA</span>
        <span className="mt-1 text-sm text-mute">{perfumes.length} fragancias con envío gratis a toda Colombia.</span>
        <span className="mt-4 flex gap-2" aria-hidden="true">
          {vitrina.map((p) => (
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
          Ver perfumería <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </div>
  );
}

function PerfumeriaPanel() {
  const secreto = destacados.perfumeria.slice(3, 6);
  return (
    <div className="grid grid-cols-[1fr_280px] gap-6">
      <div>
        <p className="kicker">Por público</p>
        <ul className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-4">
          {paraOptions.map((o) => {
            const { icon: Icon, hue } = estiloPublico[o.id];
            return (
              <li key={o.id}>
                <Link
                  to={`/perfumeria?para=${o.id}`}
                  className="group relative flex h-full flex-col rounded-2xl p-3 transition-[background-color,box-shadow] hover:bg-surface hover:ring-1 hover:ring-line"
                  style={{ background: `radial-gradient(90% 75% at 100% 0%, ${tint(hue, 14)}, transparent 75%)` }}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                      style={{ background: tint(hue, 20), color: hue }}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={1.9} />
                    </span>
                    {/* Pila de frascos del público */}
                    <span className="flex -space-x-3" aria-hidden="true">
                      {muestraDe(o.id).map((p) => (
                        <img
                          key={p.slug}
                          src={microThumbOf(p)}
                          alt=""
                          width={40}
                          height={40}
                          loading="lazy"
                          className="h-10 w-10 rounded-full border-2 border-bg bg-white object-contain p-0.5 transition-transform group-hover:-translate-y-0.5"
                        />
                      ))}
                    </span>
                  </span>
                  <span className="mt-3 font-bold group-hover:text-neb">{o.label}</span>
                  <span className="mt-0.5 text-[13px] leading-snug text-mute">{o.hint}</span>
                  <span className="mt-auto pt-2 text-xs font-semibold" style={{ color: hue }}>
                    {porPublico(o.id)} fragancias
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 grid gap-5 border-t border-line pt-5 xl:grid-cols-2">
          <div>
            <p className="kicker text-faint">Familias olfativas</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(families) as Family[]).map((f) => (
                <li key={f}>
                  <Link
                    to={`/perfumeria?familia=${f}`}
                    className="chip min-h-[34px] text-[13px]"
                    style={{ borderColor: tint(families[f].hue, 40), background: tint(families[f].hue, 10) }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: families[f].hue }} aria-hidden="true" />
                    {families[f].label}
                    <span className="text-xs text-faint">{porFamilia(f)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kicker text-faint">Casas más pedidas</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {casas.map(([c, n], i) => (
                <li key={c}>
                  <Link to={`/perfumeria?casa=${encodeURIComponent(c)}`} className="chip min-h-[34px] text-[13px]">
                    {i === 0 && <Crown className="h-3.5 w-3.5 text-gold" aria-label="La casa con más fragancias" />}
                    {c}
                    <span className="text-xs text-faint">{n}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-sm">
          <Link
            to={OFERTAS}
            className="chip min-h-[34px] text-[13px]"
            style={{ borderColor: "color-mix(in srgb, var(--gold) 45%, transparent)", background: "var(--gold-soft)" }}
          >
            <Tag className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            Ofertas · desde <span className="num font-semibold text-gold">{formatCOP(perfumeMinPrice)}</span>
          </Link>
          <Link to="/perfumeria" className="ml-auto flex items-center gap-1.5 font-semibold text-neb hover:underline">
            Ver las {perfumes.length} fragancias <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stock secreto: frascos a oscuras con candado, ASTRO sorprendido y el botón a WhatsApp */}
      <a
        href={waLink(stockSecreto.mensaje)}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-mint-soft p-5 transition-colors hover:border-mint"
      >
        <span className="relative flex min-h-28 flex-1 items-center justify-center" aria-hidden="true">
          {secreto.map((p, i) => (
            <img
              key={p.slug}
              src={microThumbOf(p)}
              alt=""
              width={84}
              height={84}
              loading="lazy"
              className="h-[84px] w-[84px] rounded-2xl border border-line bg-white object-contain p-1 blur-[3px] brightness-75 transition-[filter] duration-500 group-hover:blur-[1.5px]"
              style={{ transform: `rotate(${(i - 1) * 12}deg) translateY(${i === 1 ? -6 : 4}px)`, marginLeft: i ? -18 : 0, zIndex: i === 1 ? 2 : 1 }}
            />
          ))}
          <span className="absolute z-10 flex items-center gap-1.5 rounded-full border border-mint/40 bg-bg/85 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-mint backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5" /> Secreto
          </span>
          <span className="pointer-events-none absolute -right-3 -top-3 h-16">
            <Astro pose="chibi-sorpresa" small enter={false} float={false} decorative className="h-full" />
          </span>
        </span>
        <span className="block pt-4 text-lg font-extrabold leading-tight">{stockSecreto.titulo}</span>
        <span className="mt-1 block text-sm text-mute">{stockSecreto.texto}</span>
        <span className="mt-4 flex items-center justify-center gap-2 rounded-full bg-mint px-4 py-2.5 text-sm font-bold text-mint-ink transition-transform group-hover:scale-[1.02]">
          <WhatsAppIcon className="h-4 w-4" /> Preguntar por WhatsApp
        </span>
      </a>
    </div>
  );
}

/** Promoción del servicio de páginas web de Dox Designs, con su página propia. */
function WebPanel() {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-6">
      <div>
        <p className="kicker">Dox Designs · Páginas web</p>
        <ul className="mt-4 grid grid-cols-2 gap-1.5">
          {doxServices.map((sv) => (
            <li key={sv.id}>
              <Link to={`${DOX_PATH}#servicios`} className="group flex h-full items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-surface">
                <ServiceIcon id={sv.id} />
                <span>
                  <span className="block font-bold leading-snug group-hover:text-neb">{sv.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-mute">{sv.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <p className="kicker text-faint">Proyectos recientes</p>
          <Link to={`${DOX_PATH}#proyectos`} className="flex items-center gap-1.5 text-sm font-semibold text-neb hover:underline">
            Ver el portafolio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {doxProjects.slice(0, 3).map((pr) => (
            <li key={pr.slug}>
              <Link to={`${DOX_PATH}#proyectos`} className="group block">
                <span className="block aspect-[16/9] overflow-hidden rounded-xl border border-line bg-surface-2">
                  <img
                    src={`/dox/${pr.slug}.webp`}
                    alt=""
                    width={320}
                    height={180}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </span>
                <span className="mt-1.5 block truncate text-[13px] font-semibold group-hover:text-neb">{pr.name}</span>
                <span className="block truncate text-xs text-faint">{pr.tag}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="relative flex flex-col overflow-hidden rounded-2xl border border-line p-5"
        style={{ background: "radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--neb) 26%, transparent), transparent 62%), var(--surface)" }}
      >
        <span className="flex items-center gap-2.5">
          <img src="/dox/isotipo.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
          <span className="text-sm font-semibold text-mute">Hecho por Dox Designs</span>
        </span>
        <span className="pointer-events-none absolute -right-2 top-3 h-24">
          <Astro pose="laptop" small enter={false} float={false} decorative className="h-full" />
        </span>
        <span className="mt-auto block pt-10 text-lg font-extrabold leading-tight">¿Tu negocio necesita una página como esta?</span>
        <span className="mt-1 block text-sm text-mute">Esta tienda la hicimos nosotros. Te cotizamos la tuya sin compromiso.</span>
        <a
          href={waLink(dox.whatsappText)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-mint px-4 py-2.5 text-sm font-bold text-mint-ink transition-transform hover:scale-[1.02]"
        >
          <WhatsAppIcon className="h-4 w-4" /> Cotizar mi página
        </a>
        <Link to={DOX_PATH} className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-neb hover:underline">
          Conocer el servicio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function HelpPanel() {
  const items: { icon: ReactNode; title: string; text: string; to?: string; href?: string }[] = [
    { icon: <HelpCircle className="h-5 w-5" />, title: "Cómo comprar", text: "Eliges, pagas sin tarjeta y te llega", to: "/#como-comprar" },
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Garantía", text: `Novedades del envío en ${reportHours} h`, to: "/#garantia" },
    { icon: <MessageCircle className="h-5 w-5" />, title: "Preguntas frecuentes", text: "Envíos, pagos, réplicas y más", to: "/#preguntas" },
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
  const [section, setSection] = useState<"red" | "perfumeria" | null>("red");
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
                <li>
                  <Link to={lineaMascotas.path} className="flex min-h-[60px] items-center gap-2.5 rounded-xl bg-surface p-3 text-sm font-bold">
                    <span style={{ color: lineaMascotas.hue }}>
                      <PawPrint className="h-5 w-5 shrink-0" aria-hidden="true" />
                    </span>
                    <span>
                      {lineaMascotas.name}
                      <span className="block text-xs font-semibold text-faint">{lineaMascotas.count} producto · contra entrega</span>
                    </span>
                  </Link>
                </li>
              </ul>
            </Accordion>

            <Accordion label="Perfumería" open={section === "perfumeria"} onToggle={() => setSection((s) => (s === "perfumeria" ? null : "perfumeria"))}>
              <ul className="grid grid-cols-2 gap-2">
                {paraOptions.map((o) => {
                  const { icon: Icon, hue } = estiloPublico[o.id];
                  return (
                    <li key={o.id}>
                      <Link to={`/perfumeria?para=${o.id}`} className="flex min-h-[56px] items-center gap-2.5 rounded-xl bg-surface p-3 text-sm font-semibold">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: tint(hue, 20), color: hue }}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>
                          {o.label}
                          <span className="block text-xs font-semibold text-faint">{porPublico(o.id)} fragancias</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
                <li className="col-span-2">
                  <a
                    href={waLink(stockSecreto.mensaje)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[52px] items-center gap-2.5 rounded-xl bg-mint-soft p-3 text-sm font-semibold"
                  >
                    <WhatsAppIcon className="h-[18px] w-[18px] shrink-0 text-mint" />
                    ¿No está la tuya? Stock secreto 😉
                  </a>
                </li>
              </ul>
            </Accordion>

            <Link
              to={DOX_PATH}
              className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-line p-3"
              style={{ background: "radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--neb) 22%, transparent), transparent 65%), var(--surface)" }}
            >
              <img src="/dox/isotipo.webp" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold">Páginas web</span>
                <span className="block text-xs font-semibold text-faint">Tu página o tienda online con Dox Designs</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-neb" />
            </Link>

            {[
              { to: "/catalogo", label: "Toda la tienda" },
              { to: lineas.vapes.path, label: `${lineas.vapes.name} · +18` },
              { to: "/comedero", label: "Mascotas · contra entrega" },
              { to: OFERTAS, label: "Ofertas en perfumería" },
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
