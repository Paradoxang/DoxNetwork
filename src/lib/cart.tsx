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
import { productBySlug, type Plan, type Product } from "@/data/catalog";
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

interface CartState {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  discountPct: number;
  discount: number;
  total: number;
  /** Siguiente escalón de combo, si queda alguno. */
  nextTier: { missing: number; pct: number } | null;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, planId: string, qty?: number) => void;
  setQty: (slug: string, planId: string, qty: number) => void;
  remove: (slug: string, planId: string) => void;
  clear: () => void;
  checkoutUrl: string;
  toast: { id: number; text: string } | null;
}

const KEY = "dn:cart";
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

export function buildOrderMessage(lines: ResolvedLine[], s: Pick<CartState, "subtotal" | "discountPct" | "discount" | "total">) {
  const rows = lines.map((l) => {
    const price = l.plan.price === 0 ? "a cotizar" : formatCOP(l.total);
    return `• ${l.product.name} — ${l.plan.label} x${l.qty}: ${price}`;
  });
  const out = [`Hola ${site.name}, quiero hacer este pedido:`, "", ...rows, ""];
  if (s.discount > 0) {
    out.push(`Subtotal: ${formatCOP(s.subtotal)}`);
    out.push(`Descuento combo (${s.discountPct}%): -${formatCOP(s.discount)}`);
  }
  out.push(`Total: ${formatCOP(s.total)}`);
  return out.join("\n");
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Vacío en el primer render (igual que el prerender); se hidrata desde
  // localStorage después de montar para no romper la hidratación.
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<CartState["toast"]>(null);
  const loaded = useRef(false);
  const toastTimer = useRef<number>();

  // El guardado va antes que la carga: en el montaje aún no hay nada cargado
  // y así no pisa lo guardado con el carrito vacío inicial.
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(raw));
    } catch {
      /* modo privado */
    }
  }, [raw]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setRaw(saved);
    } catch {
      /* almacenamiento no disponible o corrupto */
    }
    loaded.current = true;
  }, []);

  const add = useCallback((slug: string, planId: string, qty = 1) => {
    setRaw((prev) => {
      const i = prev.findIndex((l) => l.slug === slug && l.planId === planId);
      if (i === -1) return [...prev, { slug, planId, qty }];
      const next = [...prev];
      next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, 20) };
      return next;
    });
    const name = productBySlug(slug)?.name ?? "Producto";
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text: `${name} agregado al carrito` });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const setQty = useCallback((slug: string, planId: string, qty: number) => {
    setRaw((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.slug === slug && l.planId === planId))
        : prev.map((l) =>
            l.slug === slug && l.planId === planId ? { ...l, qty: Math.min(qty, 20) } : l
          )
    );
  }, []);

  const remove = useCallback(
    (slug: string, planId: string) => setQty(slug, planId, 0),
    [setQty]
  );
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartState>(() => {
    const lines = resolve(raw);
    const count = lines.reduce((a, l) => a + l.qty, 0);
    const subtotal = lines.reduce((a, l) => a + l.total, 0);
    const distinct = new Set(lines.map((l) => l.slug)).size;
    const tier = [...comboTiers].reverse().find((t) => distinct >= t.min);
    const discountPct = tier?.pct ?? 0;
    const discount = Math.round((subtotal * discountPct) / 100);
    const total = subtotal - discount;
    const next = comboTiers.find((t) => distinct < t.min);
    const totals = { subtotal, discountPct, discount, total };
    return {
      lines,
      count,
      ...totals,
      nextTier: next && distinct > 0 ? { missing: next.min - distinct, pct: next.pct } : null,
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      checkoutUrl: waLink(buildOrderMessage(lines, totals)),
      toast,
    };
  }, [raw, open, add, setQty, remove, clear, toast]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
