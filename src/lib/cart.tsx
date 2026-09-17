import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { isCombo, planLabel, productBySlug, type Plan, type Product } from "@/data/catalog";
import { comboTiers, formatCOP, site, waLink } from "@/data/site";

export interface CartLine {
  slug: string;
  planId: string;
  qty: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  plan: Plan;
  total: number;
}

export interface Totals {
  subtotal: number;
  discountPct: number;
  discount: number;
  total: number;
}

/**
 * Descuento por combinar: cuenta productos digitales distintos que no sean
 * combos (los combos ya traen su precio rebajado; la perfumería tiene su
 * propio margen) y aplica el % solo sobre esas líneas.
 * Exportado porque el armador de combos calcula lo mismo en vivo.
 */
export function computeTotals(lines: { product: Product; total: number }[]): Totals & {
  distinct: number;
  nextTier: { missing: number; pct: number } | null;
} {
  const subtotal = lines.reduce((a, l) => a + l.total, 0);
  const loose = lines.filter((l) => !isCombo(l.product) && !l.product.perfume);
  const distinct = new Set(loose.map((l) => l.product.slug)).size;
  const tier = [...comboTiers].reverse().find((t) => distinct >= t.min);
  const discountPct = tier?.pct ?? 0;
  const base = loose.reduce((a, l) => a + l.total, 0);
  const discount = Math.round((base * discountPct) / 100 / 100) * 100;
  const next = comboTiers.find((t) => distinct < t.min);
  return {
    subtotal,
    discountPct,
    discount,
    total: subtotal - discount,
    distinct,
    nextTier: next && distinct > 0 ? { missing: next.min - distinct, pct: next.pct } : null,
  };
}

interface Toast {
  id: number;
  text: string;
  undo?: () => void;
}

interface CartState extends Totals {
  lines: ResolvedLine[];
  count: number;
  nextTier: { missing: number; pct: number } | null;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, planId: string, qty?: number) => void;
  addMany: (items: { slug: string; planId: string }[], label: string) => void;
  setQty: (slug: string, planId: string, qty: number) => void;
  remove: (slug: string, planId: string) => void;
  clear: () => void;
  checkoutUrl: string;
  toast: Toast | null;
  dismissToast: () => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
}

const KEY = "dn:cart";
const FAV_KEY = "dn:favs";
const CartCtx = createContext<CartState | null>(null);

function resolve(lines: CartLine[]): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const l of lines) {
    const product = productBySlug(l.slug);
    const plan = product?.plans.find((p) => p.id === l.planId);
    // Productos o planes que ya no existen en el catálogo se descartan en silencio.
    if (!product || !plan) continue;
    out.push({ ...l, product, plan, total: plan.price * l.qty });
  }
  return out;
}

export function buildOrderMessage(lines: ResolvedLine[], t: Totals) {
  const rows = lines.map((l) => {
    const price = l.plan.price === 0 ? "a cotizar" : formatCOP(l.total);
    return `• ${l.product.name} (${planLabel(l.plan)}) x${l.qty}: ${price}`;
  });
  const out = [`Hola ${site.name}, quiero hacer este pedido:`, "", ...rows, ""];
  if (t.discount > 0) {
    out.push(`Subtotal: ${formatCOP(t.subtotal)}`);
    out.push(`Descuento por combinar (${t.discountPct}%): -${formatCOP(t.discount)}`);
  }
  out.push(`Total: ${formatCOP(t.total)}`);
  if (lines.some((l) => l.product.perfume)) {
    out.push("", "Envío de perfumes a (ciudad y dirección): ");
  }
  return out.join("\n");
}

function useStored<T>(key: string, initial: T) {
  // Valor inicial igual al prerender; se lee de localStorage tras montar.
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);
  // El guardado va antes que la carga: en el montaje aún no hay nada cargado
  // y así no pisa lo guardado con el valor inicial.
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* modo privado */
    }
  }, [key, value]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setValue(JSON.parse(saved));
    } catch {
      /* almacenamiento no disponible o corrupto */
    }
    loaded.current = true;
  }, [key]);
  return [value, setValue] as const;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useStored<CartLine[]>(KEY, []);
  const [favorites, setFavorites] = useStored<string[]>(FAV_KEY, []);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number>();

  const showToast = useCallback((t: Omit<Toast, "id">) => {
    window.clearTimeout(toastTimer.current);
    setToast({ ...t, id: Date.now() });
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
  }, []);
  const dismissToast = useCallback(() => {
    window.clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const bump = useCallback(
    (items: { slug: string; planId: string; qty: number }[]) =>
      setRaw((prev) => {
        const next = Array.isArray(prev) ? [...prev] : [];
        for (const it of items) {
          const i = next.findIndex((l) => l.slug === it.slug && l.planId === it.planId);
          if (i === -1) {
            if (it.qty > 0) next.push({ slug: it.slug, planId: it.planId, qty: Math.min(it.qty, 20) });
          } else {
            const qty = Math.min(next[i].qty + it.qty, 20);
            if (qty <= 0) next.splice(i, 1);
            else next[i] = { ...next[i], qty };
          }
        }
        return next;
      }),
    [setRaw]
  );

  const add = useCallback(
    (slug: string, planId: string, qty = 1) => {
      bump([{ slug, planId, qty }]);
      const name = productBySlug(slug)?.name ?? "Producto";
      showToast({ text: `${name} agregado`, undo: () => bump([{ slug, planId, qty: -qty }]) });
    },
    [bump, showToast]
  );

  const addMany = useCallback(
    (items: { slug: string; planId: string }[], label: string) => {
      bump(items.map((i) => ({ ...i, qty: 1 })));
      showToast({ text: label, undo: () => bump(items.map((i) => ({ ...i, qty: -1 }))) });
    },
    [bump, showToast]
  );

  const setQty = useCallback(
    (slug: string, planId: string, qty: number) =>
      setRaw((prev) =>
        qty <= 0
          ? prev.filter((l) => !(l.slug === slug && l.planId === planId))
          : prev.map((l) => (l.slug === slug && l.planId === planId ? { ...l, qty: Math.min(qty, 20) } : l))
      ),
    [setRaw]
  );

  const remove = useCallback((slug: string, planId: string) => setQty(slug, planId, 0), [setQty]);
  const clear = useCallback(() => setRaw([]), [setRaw]);

  const toggleFavorite = useCallback(
    (slug: string) =>
      setFavorites((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
      }),
    [setFavorites]
  );

  const value = useMemo<CartState>(() => {
    const lines = resolve(Array.isArray(raw) ? raw : []);
    const count = lines.reduce((a, l) => a + l.qty, 0);
    const t = computeTotals(lines);
    return {
      lines,
      count,
      subtotal: t.subtotal,
      discountPct: t.discountPct,
      discount: t.discount,
      total: t.total,
      nextTier: t.nextTier,
      open,
      setOpen,
      add,
      addMany,
      setQty,
      remove,
      clear,
      checkoutUrl: waLink(buildOrderMessage(lines, t)),
      toast,
      dismissToast,
      favorites: Array.isArray(favorites) ? favorites.filter((s) => productBySlug(s)) : [],
      toggleFavorite,
    };
  }, [raw, open, add, addMany, setQty, remove, clear, toast, dismissToast, favorites, toggleFavorite]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
