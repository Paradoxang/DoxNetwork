import { AppWindow, Bot, MonitorSmartphone, ShoppingCart, type LucideIcon } from "lucide-react";
import type { DoxServiceId } from "@/data/dox";

/** Icono y tono de cada servicio de Dox Designs (menú, inicio y página del servicio). */
export const doxServiceStyle: Record<DoxServiceId, { icon: LucideIcon; hue: string }> = {
  web: { icon: MonitorSmartphone, hue: "#9aa9ff" },
  tienda: { icon: ShoppingCart, hue: "#5fd8a4" },
  apps: { icon: AppWindow, hue: "#5fb8e8" },
  ia: { icon: Bot, hue: "#f2c46d" },
};

/** Icono del servicio en su tono, para las listas de servicios. */
export function ServiceIcon({ id, size = "sm" }: { id: DoxServiceId; size?: "sm" | "lg" }) {
  const { icon: Icon, hue } = doxServiceStyle[id];
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${size === "lg" ? "h-12 w-12 rounded-2xl" : "h-8 w-8 rounded-xl"}`}
      style={{ background: `color-mix(in srgb, ${hue} 18%, transparent)`, color: hue }}
    >
      <Icon className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} aria-hidden="true" strokeWidth={1.9} />
    </span>
  );
}
